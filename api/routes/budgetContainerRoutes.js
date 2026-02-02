const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const auth = require('../middleware/authenticate');
const privilege = require('../middleware/privilegeMiddleware');
const multer = require('multer');
const xlsx = require('xlsx');
const metadataService = require('../services/metadataService');

/**
 * ============================================
 * BUDGET CONTAINERS ROUTES
 * ============================================
 */

/**
 * @route GET /api/budgets/containers
 * @description Get all budget containers with optional filters
 * @access Private
 */
router.get('/containers', async (req, res) => {
    try {
        console.log('=== GET /api/budgets/containers called ===');
        console.log('Query params:', req.query);
        console.log('Request URL:', req.url);
        console.log('Request path:', req.path);
        const { 
            finYearId, 
            departmentId, 
            status,
            budgetType,
            page = 1,
            limit = 50,
            search
        } = req.query;

        let whereConditions = ['b.voided = 0'];
        const queryParams = [];
        const offset = (page - 1) * limit;

        if (finYearId) {
            whereConditions.push('b.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (departmentId) {
            whereConditions.push('b.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (status) {
            whereConditions.push('b.status = ?');
            queryParams.push(status);
        }

        if (budgetType) {
            whereConditions.push('b.budgetType = ?');
            queryParams.push(budgetType);
        }

        if (search) {
            whereConditions.push('(b.budgetName LIKE ? OR b.description LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM kemri_budgets b
            WHERE ${whereClause}
        `;
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;

        // Get budgets with related data
        const query = `
            SELECT 
                b.budgetId,
                b.budgetName,
                b.budgetType,
                b.isCombined,
                b.parentBudgetId,
                b.finYearId,
                b.departmentId,
                b.description,
                b.totalAmount,
                b.status,
                b.isFrozen,
                b.requiresApprovalForChanges,
                b.approvedBy,
                b.approvedAt,
                b.rejectedBy,
                b.rejectedAt,
                b.rejectionReason,
                b.userId,
                b.createdAt,
                b.updatedAt,
                fy.finYearName,
                d.name as departmentName,
                u.firstName as createdByFirstName,
                u.lastName as createdByLastName,
                approver.firstName as approvedByFirstName,
                approver.lastName as approvedByLastName,
                (SELECT COUNT(*) FROM kemri_budget_items WHERE budgetId = b.budgetId AND voided = 0) as itemCount
            FROM kemri_budgets b
            LEFT JOIN kemri_financialyears fy ON b.finYearId = fy.finYearId
            LEFT JOIN kemri_departments d ON b.departmentId = d.departmentId
            LEFT JOIN kemri_users u ON b.userId = u.userId
            LEFT JOIN kemri_users approver ON b.approvedBy = approver.userId
            WHERE ${whereClause}
            ORDER BY b.createdAt DESC
            LIMIT ? OFFSET ?
        `;
        
        queryParams.push(parseInt(limit), offset);
        
        const startTime = Date.now();
        console.log('Executing query with params:', queryParams);
        console.log('Query:', query);
        console.log('Where clause:', whereClause);
        
        const [budgets] = await pool.query(query, queryParams);
        const queryTime = Date.now() - startTime;
        console.log(`Query executed successfully in ${queryTime}ms`);

        console.log('Found budgets:', budgets.length);
        console.log('Total count:', total);
        
        if (queryTime > 5000) {
            console.warn(`⚠️ WARNING: Query took ${queryTime}ms - this is slow and may cause timeout issues.`);
        }
        
        if (budgets.length > 0) {
            console.log('Sample budget:', {
                budgetId: budgets[0].budgetId,
                budgetName: budgets[0].budgetName,
                voided: 'N/A (filtered)',
                finYearId: budgets[0].finYearId,
                departmentId: budgets[0].departmentId,
                status: budgets[0].status,
                budgetType: budgets[0].budgetType
            });
        } else if (total > 0) {
            console.warn('⚠️ WARNING: Total count > 0 but no budgets returned. This suggests a pagination issue or query problem.');
            console.warn('Query params:', queryParams);
            console.warn('Where clause:', whereClause);
        } else {
            console.log('No budgets found matching criteria');
        }

        res.json({
            budgets: budgets || [],
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching budget containers:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching budget containers', 
            error: error.message,
            details: error.stack 
        });
    }
});

/**
 * @route GET /api/budgets/containers/:budgetId
 * @description Get a single budget container with all items
 * @access Private
 */
router.get('/containers/:budgetId', auth, async (req, res) => {
    try {
        const { budgetId } = req.params;

        // Get budget container
        const budgetQuery = `
            SELECT 
                b.*,
                fy.finYearName,
                d.name as departmentName,
                u.firstName as createdByFirstName,
                u.lastName as createdByLastName,
                approver.firstName as approvedByFirstName,
                approver.lastName as approvedByLastName
            FROM kemri_budgets b
            LEFT JOIN kemri_financialyears fy ON b.finYearId = fy.finYearId
            LEFT JOIN kemri_departments d ON b.departmentId = d.departmentId
            LEFT JOIN kemri_users u ON b.userId = u.userId
            LEFT JOIN kemri_users approver ON b.approvedBy = approver.userId
            WHERE b.budgetId = ? AND b.voided = 0
        `;

        const [budgets] = await pool.query(budgetQuery, [budgetId]);

        if (budgets.length === 0) {
            return res.status(404).json({ message: 'Budget container not found' });
        }

        const budget = budgets[0];

        // Get budget items
        const itemsQuery = `
            SELECT 
                bi.*,
                d.name as departmentName,
                sc.name as subcountyName,
                w.name as wardName,
                p.projectName as linkedProjectName,
                u.firstName as createdByFirstName,
                u.lastName as createdByLastName
            FROM kemri_budget_items bi
            LEFT JOIN kemri_departments d ON bi.departmentId = d.departmentId
            LEFT JOIN kemri_subcounties sc ON bi.subcountyId = sc.subcountyId
            LEFT JOIN kemri_wards w ON bi.wardId = w.wardId
            LEFT JOIN kemri_projects p ON bi.projectId = p.id
            LEFT JOIN kemri_users u ON bi.userId = u.userId
            WHERE bi.budgetId = ? AND bi.voided = 0
            ORDER BY bi.createdAt DESC
        `;

        const [items] = await pool.query(itemsQuery, [budgetId]);

        // Get pending change requests
        const changesQuery = `
            SELECT 
                bc.*,
                u.firstName as requestedByFirstName,
                u.lastName as requestedByLastName,
                reviewer.firstName as reviewedByFirstName,
                reviewer.lastName as reviewedByLastName
            FROM kemri_budget_changes bc
            LEFT JOIN kemri_users u ON bc.requestedBy = u.userId
            LEFT JOIN kemri_users reviewer ON bc.reviewedBy = reviewer.userId
            WHERE bc.budgetId = ? AND bc.voided = 0 AND bc.status = 'Pending Approval'
            ORDER BY bc.requestedAt DESC
        `;

        const [changes] = await pool.query(changesQuery, [budgetId]);

        res.json({
            ...budget,
            items,
            pendingChanges: changes
        });
    } catch (error) {
        console.error('Error fetching budget container:', error);
        res.status(500).json({ message: 'Error fetching budget container', error: error.message });
    }
});

/**
 * @route POST /api/budgets/containers
 * @description Create a new budget container
 * @access Private
 */
router.post('/containers', auth, async (req, res) => {
    try {
        const {
            budgetName,
            budgetType = 'Draft',
            finYearId,
            departmentId,
            description,
            requiresApprovalForChanges = true
        } = req.body;

        // Validation
        if (!budgetName || !finYearId) {
            return res.status(400).json({ 
                message: 'Missing required fields: budgetName and finYearId are required' 
            });
        }

        const userId = req.user?.userId || 1;

        const query = `
            INSERT INTO kemri_budgets 
            (budgetName, budgetType, finYearId, departmentId, description, requiresApprovalForChanges, userId, voided)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `;

        const [result] = await pool.query(query, [
            budgetName,
            budgetType,
            finYearId,
            departmentId || null,
            description || null,
            requiresApprovalForChanges ? 1 : 0,
            userId
        ]);

        // Fetch the created budget
        const [createdBudget] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ?',
            [result.insertId]
        );

        res.status(201).json({
            message: 'Budget container created successfully',
            budget: createdBudget[0]
        });
    } catch (error) {
        console.error('Error creating budget container:', error);
        console.error('Error details:', {
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Error creating budget container', 
            error: error.message,
            details: error.sqlMessage || error.code || 'Unknown database error',
            hint: error.code === 'ER_NO_SUCH_TABLE' ? 'The kemri_budgets table does not exist. Please create it first.' : null
        });
    }
});

/**
 * @route PUT /api/budgets/containers/:budgetId
 * @description Update a budget container
 * @access Private
 */
router.put('/containers/:budgetId', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { budgetId } = req.params;
        const {
            budgetName,
            budgetType,
            finYearId,
            departmentId,
            description,
            requiresApprovalForChanges
        } = req.body;

        // Check if budget exists
        const [existing] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND voided = 0',
            [budgetId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Budget container not found' });
        }

        const budget = existing[0];

        // If budget is approved and frozen, check if changes require approval
        if (budget.status === 'Approved' && budget.isFrozen && budget.requiresApprovalForChanges) {
            return res.status(400).json({ 
                message: 'This budget is approved and frozen. Changes must be requested through the change request process.' 
            });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (budgetName !== undefined) {
            updates.push('budgetName = ?');
            values.push(budgetName);
        }
        if (budgetType !== undefined) {
            updates.push('budgetType = ?');
            values.push(budgetType);
        }
        if (finYearId !== undefined) {
            updates.push('finYearId = ?');
            values.push(finYearId);
        }
        if (departmentId !== undefined) {
            updates.push('departmentId = ?');
            values.push(departmentId || null);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description || null);
        }
        if (requiresApprovalForChanges !== undefined) {
            updates.push('requiresApprovalForChanges = ?');
            values.push(requiresApprovalForChanges ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(budgetId);

        const query = `
            UPDATE kemri_budgets 
            SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP
            WHERE budgetId = ? AND voided = 0
        `;

        await pool.query(query, values);

        // Fetch updated budget
        const [updated] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ?',
            [budgetId]
        );

        res.json({
            message: 'Budget container updated successfully',
            budget: updated[0]
        });
    } catch (error) {
        console.error('Error updating budget container:', error);
        res.status(500).json({ message: 'Error updating budget container', error: error.message });
    }
});

/**
 * @route POST /api/budgets/containers/:budgetId/approve
 * @description Approve a budget container
 * @access Private
 */
router.post('/containers/:budgetId/approve', auth, privilege(['budget.approve']), async (req, res) => {
    try {
        const { budgetId } = req.params;
        const userId = req.user?.userId || 1;

        const [budget] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND voided = 0',
            [budgetId]
        );

        if (budget.length === 0) {
            return res.status(404).json({ message: 'Budget container not found' });
        }

        if (budget[0].status === 'Approved') {
            return res.status(400).json({ message: 'Budget is already approved' });
        }

        await pool.query(
            `UPDATE kemri_budgets 
             SET status = 'Approved', 
                 approvedBy = ?, 
                 approvedAt = NOW(),
                 isFrozen = 1,
                 updatedAt = CURRENT_TIMESTAMP
             WHERE budgetId = ?`,
            [userId, budgetId]
        );

        // Log approval as a change
        await pool.query(
            `INSERT INTO kemri_budget_changes 
             (budgetId, changeType, changeReason, status, requestedBy, reviewedBy, reviewedAt, userId)
             VALUES (?, 'Budget Approved', 'Budget approved by authorized user', 'Approved', ?, ?, NOW(), ?)`,
            [budgetId, userId, userId, userId]
        );

        res.json({ message: 'Budget approved successfully' });
    } catch (error) {
        console.error('Error approving budget:', error);
        console.error('Error details:', {
            code: error.code,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Error approving budget', 
            error: error.message,
            details: error.sqlMessage || error.code || 'Unknown database error'
        });
    }
});

/**
 * @route POST /api/budgets/containers/:budgetId/reject
 * @description Reject a budget container
 * @access Private
 */
router.post('/containers/:budgetId/reject', auth, privilege(['budget.approve']), async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { rejectionReason } = req.body;
        const userId = req.user?.userId || 1;

        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const [budget] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND voided = 0',
            [budgetId]
        );

        if (budget.length === 0) {
            return res.status(404).json({ message: 'Budget container not found' });
        }

        await pool.query(
            `UPDATE kemri_budgets 
             SET status = 'Rejected', 
                 rejectedBy = ?, 
                 rejectedAt = NOW(),
                 rejectionReason = ?,
                 updatedAt = CURRENT_TIMESTAMP
             WHERE budgetId = ?`,
            [userId, rejectionReason, budgetId]
        );

        res.json({ message: 'Budget rejected successfully' });
    } catch (error) {
        console.error('Error rejecting budget:', error);
        res.status(500).json({ message: 'Error rejecting budget', error: error.message });
    }
});

/**
 * ============================================
 * BUDGET ITEMS ROUTES
 * ============================================
 */

/**
 * @route GET /api/budgets/containers/:budgetId/items
 * @description Get all items in a budget container
 * @access Private
 */
router.get('/containers/:budgetId/items', auth, async (req, res) => {
    try {
        const { budgetId } = req.params;

        const query = `
            SELECT 
                bi.*,
                d.name as departmentName,
                sc.name as subcountyName,
                w.name as wardName,
                p.projectName as linkedProjectName,
                u.firstName as createdByFirstName,
                u.lastName as createdByLastName
            FROM kemri_budget_items bi
            LEFT JOIN kemri_departments d ON bi.departmentId = d.departmentId
            LEFT JOIN kemri_subcounties sc ON bi.subcountyId = sc.subcountyId
            LEFT JOIN kemri_wards w ON bi.wardId = w.wardId
            LEFT JOIN kemri_projects p ON bi.projectId = p.id
            LEFT JOIN kemri_users u ON bi.userId = u.userId
            WHERE bi.budgetId = ? AND bi.voided = 0
            ORDER BY bi.createdAt DESC
        `;

        const [items] = await pool.query(query, [budgetId]);

        res.json({ items });
    } catch (error) {
        console.error('Error fetching budget items:', error);
        res.status(500).json({ message: 'Error fetching budget items', error: error.message });
    }
});

/**
 * @route POST /api/budgets/containers/:budgetId/items
 * @description Add an item to a budget container
 * @access Private
 */
router.post('/containers/:budgetId/items', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { budgetId } = req.params;
        const {
            projectId,
            projectName,
            departmentId,
            subcountyId,
            wardId,
            amount,
            remarks,
            changeReason
        } = req.body;

        // Validation
        if (!projectName || !departmentId || !amount || amount <= 0) {
            return res.status(400).json({ 
                message: 'Missing required fields: projectName, departmentId, and amount (must be > 0) are required' 
            });
        }

        // Check if budget exists
        const [budget] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND voided = 0',
            [budgetId]
        );

        if (budget.length === 0) {
            return res.status(404).json({ message: 'Budget container not found' });
        }

        const budgetData = budget[0];
        const userId = req.user?.userId || 1;

        // Check if budget is approved and frozen - requires change request
        if (budgetData.status === 'Approved' && budgetData.isFrozen && budgetData.requiresApprovalForChanges) {
            if (!changeReason) {
                return res.status(400).json({ 
                    message: 'Change reason is required when adding items to an approved and frozen budget' 
                });
            }

            // Create change request instead of directly adding
            const changeQuery = `
                INSERT INTO kemri_budget_changes 
                (budgetId, changeType, changeReason, status, requestedBy, newValue)
                VALUES (?, 'Item Added', ?, 'Pending Approval', ?, ?)
            `;

            const newValue = JSON.stringify({
                projectId: projectId || null,
                projectName,
                departmentId,
                subcountyId: subcountyId || null,
                wardId: wardId || null,
                amount,
                remarks: remarks || null
            });

            const [changeResult] = await pool.query(changeQuery, [
                budgetId,
                changeReason,
                userId,
                newValue
            ]);

            return res.status(202).json({
                message: 'Item addition request created and pending approval',
                changeRequestId: changeResult.insertId
            });
        }

        // Directly add item if budget is not approved/frozen
        const itemQuery = `
            INSERT INTO kemri_budget_items 
            (budgetId, projectId, projectName, departmentId, subcountyId, wardId, amount, remarks, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(itemQuery, [
            budgetId,
            projectId || null,
            projectName,
            departmentId,
            subcountyId || null,
            wardId || null,
            amount,
            remarks || null,
            userId
        ]);

        // Check if added after approval
        const addedAfterApproval = budgetData.status === 'Approved' ? 1 : 0;

        if (addedAfterApproval) {
            await pool.query(
                'UPDATE kemri_budget_items SET addedAfterApproval = 1 WHERE itemId = ?',
                [result.insertId]
            );
        }

        res.status(201).json({
            message: 'Budget item added successfully',
            itemId: result.insertId
        });
    } catch (error) {
        console.error('Error adding budget item:', error);
        res.status(500).json({ message: 'Error adding budget item', error: error.message });
    }
});

/**
 * @route PUT /api/budgets/items/:itemId
 * @description Update a budget item
 * @access Private
 */
router.put('/items/:itemId', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { itemId } = req.params;
        const {
            projectId,
            projectName,
            departmentId,
            subcountyId,
            wardId,
            amount,
            remarks,
            changeReason
        } = req.body;

        // Get item and budget info
        const [items] = await pool.query(
            `SELECT bi.*, b.status, b.isFrozen, b.requiresApprovalForChanges 
             FROM kemri_budget_items bi
             INNER JOIN kemri_budgets b ON bi.budgetId = b.budgetId
             WHERE bi.itemId = ? AND bi.voided = 0`,
            [itemId]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Budget item not found' });
        }

        const item = items[0];
        const budget = {
            status: items[0].status,
            isFrozen: items[0].isFrozen,
            requiresApprovalForChanges: items[0].requiresApprovalForChanges
        };

        const userId = req.user?.userId || 1;

        // Check if budget is approved and frozen - requires change request
        if (budget.status === 'Approved' && budget.isFrozen && budget.requiresApprovalForChanges) {
            if (!changeReason) {
                return res.status(400).json({ 
                    message: 'Change reason is required when modifying items in an approved and frozen budget' 
                });
            }

            // Create change request
            const oldValue = JSON.stringify({
                projectId: item.projectId,
                projectName: item.projectName,
                departmentId: item.departmentId,
                subcountyId: item.subcountyId,
                wardId: item.wardId,
                amount: item.amount,
                remarks: item.remarks
            });

            const newValue = JSON.stringify({
                projectId: projectId !== undefined ? (projectId || null) : item.projectId,
                projectName: projectName !== undefined ? projectName : item.projectName,
                departmentId: departmentId !== undefined ? departmentId : item.departmentId,
                subcountyId: subcountyId !== undefined ? (subcountyId || null) : item.subcountyId,
                wardId: wardId !== undefined ? (wardId || null) : item.wardId,
                amount: amount !== undefined ? amount : item.amount,
                remarks: remarks !== undefined ? (remarks || null) : item.remarks
            });

            const changeQuery = `
                INSERT INTO kemri_budget_changes 
                (budgetId, itemId, changeType, changeReason, status, requestedBy, oldValue, newValue)
                VALUES (?, ?, 'Item Modified', ?, 'Pending Approval', ?, ?, ?)
            `;

            const [changeResult] = await pool.query(changeQuery, [
                item.budgetId,
                itemId,
                changeReason,
                userId,
                oldValue,
                newValue
            ]);

            return res.status(202).json({
                message: 'Item modification request created and pending approval',
                changeRequestId: changeResult.insertId
            });
        }

        // Directly update if budget is not approved/frozen
        const updates = [];
        const values = [];

        if (projectId !== undefined) {
            updates.push('projectId = ?');
            values.push(projectId || null);
        }
        if (projectName !== undefined) {
            updates.push('projectName = ?');
            values.push(projectName);
        }
        if (departmentId !== undefined) {
            updates.push('departmentId = ?');
            values.push(departmentId);
        }
        if (subcountyId !== undefined) {
            updates.push('subcountyId = ?');
            values.push(subcountyId || null);
        }
        if (wardId !== undefined) {
            updates.push('wardId = ?');
            values.push(wardId || null);
        }
        if (amount !== undefined) {
            if (amount <= 0) {
                return res.status(400).json({ message: 'Amount must be greater than 0' });
            }
            updates.push('amount = ?');
            values.push(amount);
        }
        if (remarks !== undefined) {
            updates.push('remarks = ?');
            values.push(remarks || null);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(itemId);

        const query = `
            UPDATE kemri_budget_items 
            SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP
            WHERE itemId = ? AND voided = 0
        `;

        await pool.query(query, values);

        res.json({ message: 'Budget item updated successfully' });
    } catch (error) {
        console.error('Error updating budget item:', error);
        res.status(500).json({ message: 'Error updating budget item', error: error.message });
    }
});

/**
 * @route DELETE /api/budgets/items/:itemId
 * @description Remove a budget item
 * @access Private
 */
router.delete('/items/:itemId', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { itemId } = req.params;
        const { changeReason } = req.body;
        const userId = req.user?.userId || 1;

        // Get item and budget info
        const [items] = await pool.query(
            `SELECT bi.*, b.status, b.isFrozen, b.requiresApprovalForChanges 
             FROM kemri_budget_items bi
             INNER JOIN kemri_budgets b ON bi.budgetId = b.budgetId
             WHERE bi.itemId = ? AND bi.voided = 0`,
            [itemId]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Budget item not found' });
        }

        const item = items[0];
        const budget = {
            status: items[0].status,
            isFrozen: items[0].isFrozen,
            requiresApprovalForChanges: items[0].requiresApprovalForChanges
        };

        // Check if budget is approved and frozen - requires change request
        if (budget.status === 'Approved' && budget.isFrozen && budget.requiresApprovalForChanges) {
            if (!changeReason) {
                return res.status(400).json({ 
                    message: 'Change reason is required when removing items from an approved and frozen budget' 
                });
            }

            // Create change request
            const oldValue = JSON.stringify({
                projectId: item.projectId,
                projectName: item.projectName,
                departmentId: item.departmentId,
                amount: item.amount
            });

            const changeQuery = `
                INSERT INTO kemri_budget_changes 
                (budgetId, itemId, changeType, changeReason, status, requestedBy, oldValue)
                VALUES (?, ?, 'Item Removed', ?, 'Pending Approval', ?, ?)
            `;

            const [changeResult] = await pool.query(changeQuery, [
                item.budgetId,
                itemId,
                changeReason,
                userId,
                oldValue
            ]);

            return res.status(202).json({
                message: 'Item removal request created and pending approval',
                changeRequestId: changeResult.insertId
            });
        }

        // Soft delete item
        await pool.query(
            'UPDATE kemri_budget_items SET voided = 1, voidedBy = ?, voidedAt = NOW() WHERE itemId = ?',
            [userId, itemId]
        );

        res.json({ message: 'Budget item removed successfully' });
    } catch (error) {
        console.error('Error removing budget item:', error);
        res.status(500).json({ message: 'Error removing budget item', error: error.message });
    }
});

/**
 * ============================================
 * CHANGE REQUESTS ROUTES
 * ============================================
 */

/**
 * @route GET /api/budgets/containers/:budgetId/changes
 * @description Get change history for a budget
 * @access Private
 */
router.get('/containers/:budgetId/changes', auth, async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { status } = req.query;

        let whereClause = 'bc.budgetId = ? AND bc.voided = 0';
        const params = [budgetId];

        if (status) {
            whereClause += ' AND bc.status = ?';
            params.push(status);
        }

        const query = `
            SELECT 
                bc.*,
                u.firstName as requestedByFirstName,
                u.lastName as requestedByLastName,
                reviewer.firstName as reviewedByFirstName,
                reviewer.lastName as reviewedByLastName,
                bi.projectName as itemProjectName
            FROM kemri_budget_changes bc
            LEFT JOIN kemri_users u ON bc.requestedBy = u.userId
            LEFT JOIN kemri_users reviewer ON bc.reviewedBy = reviewer.userId
            LEFT JOIN kemri_budget_items bi ON bc.itemId = bi.itemId
            WHERE ${whereClause}
            ORDER BY bc.requestedAt DESC
        `;

        const [changes] = await pool.query(query, params);

        res.json({ changes });
    } catch (error) {
        console.error('Error fetching budget changes:', error);
        res.status(500).json({ message: 'Error fetching budget changes', error: error.message });
    }
});

/**
 * @route PUT /api/budgets/changes/:changeId/approve
 * @description Approve a change request
 * @access Private
 */
router.put('/changes/:changeId/approve', auth, privilege(['budget.approve']), async (req, res) => {
    try {
        const { changeId } = req.params;
        const { reviewNotes } = req.body;
        const userId = req.user?.userId || 1;

        // Get change request
        const [changes] = await pool.query(
            'SELECT * FROM kemri_budget_changes WHERE changeId = ? AND voided = 0',
            [changeId]
        );

        if (changes.length === 0) {
            return res.status(404).json({ message: 'Change request not found' });
        }

        const change = changes[0];

        if (change.status !== 'Pending Approval') {
            return res.status(400).json({ message: 'Change request is not pending approval' });
        }

        // Apply the change based on change type
        if (change.changeType === 'Item Added') {
            const newValue = JSON.parse(change.newValue);
            await pool.query(
                `INSERT INTO kemri_budget_items 
                 (budgetId, projectId, projectName, departmentId, subcountyId, wardId, amount, remarks, addedAfterApproval, changeRequestId, userId)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
                [
                    change.budgetId,
                    newValue.projectId || null,
                    newValue.projectName,
                    newValue.departmentId,
                    newValue.subcountyId || null,
                    newValue.wardId || null,
                    newValue.amount,
                    newValue.remarks || null,
                    changeId,
                    change.requestedBy
                ]
            );
        } else if (change.changeType === 'Item Modified') {
            const newValue = JSON.parse(change.newValue);
            await pool.query(
                `UPDATE kemri_budget_items 
                 SET projectId = ?, projectName = ?, departmentId = ?, subcountyId = ?, wardId = ?, amount = ?, remarks = ?, changeRequestId = ?
                 WHERE itemId = ?`,
                [
                    newValue.projectId || null,
                    newValue.projectName,
                    newValue.departmentId,
                    newValue.subcountyId || null,
                    newValue.wardId || null,
                    newValue.amount,
                    newValue.remarks || null,
                    changeId,
                    change.itemId
                ]
            );
        } else if (change.changeType === 'Item Removed') {
            await pool.query(
                'UPDATE kemri_budget_items SET voided = 1, voidedBy = ?, voidedAt = NOW(), changeRequestId = ? WHERE itemId = ?',
                [userId, changeId, change.itemId]
            );
        }

        // Update change request status
        await pool.query(
            `UPDATE kemri_budget_changes 
             SET status = 'Approved', reviewedBy = ?, reviewedAt = NOW(), reviewNotes = ?
             WHERE changeId = ?`,
            [userId, reviewNotes || null, changeId]
        );

        res.json({ message: 'Change request approved and applied successfully' });
    } catch (error) {
        console.error('Error approving change request:', error);
        res.status(500).json({ message: 'Error approving change request', error: error.message });
    }
});

/**
 * @route PUT /api/budgets/changes/:changeId/reject
 * @description Reject a change request
 * @access Private
 */
router.put('/changes/:changeId/reject', auth, privilege(['budget.approve']), async (req, res) => {
    try {
        const { changeId } = req.params;
        const { reviewNotes } = req.body;
        const userId = req.user?.userId || 1;

        if (!reviewNotes) {
            return res.status(400).json({ message: 'Review notes are required when rejecting a change request' });
        }

        const [changes] = await pool.query(
            'SELECT * FROM kemri_budget_changes WHERE changeId = ? AND voided = 0',
            [changeId]
        );

        if (changes.length === 0) {
            return res.status(404).json({ message: 'Change request not found' });
        }

        if (changes[0].status !== 'Pending Approval') {
            return res.status(400).json({ message: 'Change request is not pending approval' });
        }

        await pool.query(
            `UPDATE kemri_budget_changes 
             SET status = 'Rejected', reviewedBy = ?, reviewedAt = NOW(), reviewNotes = ?
             WHERE changeId = ?`,
            [userId, reviewNotes, changeId]
        );

        res.json({ message: 'Change request rejected successfully' });
    } catch (error) {
        console.error('Error rejecting change request:', error);
        res.status(500).json({ message: 'Error rejecting change request', error: error.message });
    }
});

/**
 * ============================================
 * COMBINED BUDGETS ROUTES
 * ============================================
 */

/**
 * @route POST /api/budgets/containers/combined
 * @description Create a new combined budget container
 * @access Private
 */
router.post('/containers/combined', auth, privilege(['budget.create']), async (req, res) => {
    try {
        const {
            budgetName,
            finYearId,
            description,
            containerIds = [] // Array of budget IDs to combine
        } = req.body;

        // Validation
        if (!budgetName || !finYearId) {
            return res.status(400).json({ 
                message: 'Missing required fields: budgetName and finYearId are required' 
            });
        }

        if (!Array.isArray(containerIds) || containerIds.length === 0) {
            return res.status(400).json({ 
                message: 'At least one container must be selected to create a combined budget' 
            });
        }

        const userId = req.user?.userId || 1;

        // Verify all containers exist and are not already part of another combined budget
        const placeholders = containerIds.map(() => '?').join(',');
        const [containers] = await pool.query(
            `SELECT budgetId, budgetName, departmentId, status, isCombined, parentBudgetId 
             FROM kemri_budgets 
             WHERE budgetId IN (${placeholders}) AND voided = 0`,
            containerIds
        );

        if (containers.length !== containerIds.length) {
            return res.status(400).json({ 
                message: 'One or more selected containers do not exist or have been deleted' 
            });
        }

        // Check if any container is already part of a combined budget
        const alreadyCombined = containers.filter(c => c.isCombined === 1 || c.parentBudgetId);
        if (alreadyCombined.length > 0) {
            return res.status(400).json({ 
                message: `The following containers are already part of a combined budget: ${alreadyCombined.map(c => c.budgetName).join(', ')}` 
            });
        }

        // Create the combined budget container
        const query = `
            INSERT INTO kemri_budgets 
            (budgetName, budgetType, isCombined, finYearId, description, userId)
            VALUES (?, 'Combined', 1, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            budgetName,
            finYearId,
            description || null,
            userId
        ]);

        const combinedBudgetId = result.insertId;

        // Link containers to the combined budget
        const combinationQueries = containerIds.map((containerId, index) => {
            return pool.query(
                `INSERT INTO kemri_budget_combinations 
                 (combinedBudgetId, containerBudgetId, displayOrder, userId)
                 VALUES (?, ?, ?, ?)`,
                [combinedBudgetId, containerId, index, userId]
            );
        });

        await Promise.all(combinationQueries);

        // Calculate total amount from all containers
        const [totalResult] = await pool.query(
            `SELECT COALESCE(SUM(totalAmount), 0) as total
             FROM kemri_budgets
             WHERE budgetId IN (${placeholders}) AND voided = 0`,
            containerIds
        );

        const totalAmount = totalResult[0].total || 0;

        // Update the combined budget's total amount
        await pool.query(
            'UPDATE kemri_budgets SET totalAmount = ? WHERE budgetId = ?',
            [totalAmount, combinedBudgetId]
        );

        // Fetch the created combined budget
        const [createdBudget] = await pool.query(
            `SELECT b.*, fy.finYearName, d.name as departmentName
             FROM kemri_budgets b
             LEFT JOIN kemri_financialyears fy ON b.finYearId = fy.finYearId
             LEFT JOIN kemri_departments d ON b.departmentId = d.departmentId
             WHERE b.budgetId = ?`,
            [combinedBudgetId]
        );

        res.status(201).json({
            message: 'Combined budget created successfully',
            budget: createdBudget[0],
            totalAmount,
            containerCount: containerIds.length
        });
    } catch (error) {
        console.error('Error creating combined budget:', error);
        res.status(500).json({ 
            message: 'Error creating combined budget', 
            error: error.message,
            details: error.sqlMessage || error.code
        });
    }
});

/**
 * @route GET /api/budgets/containers/:budgetId/combined
 * @description Get a combined budget with all its containers and subtotals
 * @access Private
 */
router.get('/containers/:budgetId/combined', auth, async (req, res) => {
    try {
        const { budgetId } = req.params;

        // Get the combined budget
        const [combinedBudget] = await pool.query(
            `SELECT b.*, fy.finYearName, d.name as departmentName
             FROM kemri_budgets b
             LEFT JOIN kemri_financialyears fy ON b.finYearId = fy.finYearId
             LEFT JOIN kemri_departments d ON b.departmentId = d.departmentId
             WHERE b.budgetId = ? AND b.voided = 0`,
            [budgetId]
        );

        if (combinedBudget.length === 0) {
            return res.status(404).json({ message: 'Combined budget not found' });
        }

        if (combinedBudget[0].isCombined !== 1) {
            return res.status(400).json({ message: 'This is not a combined budget' });
        }

        // Get all containers in this combined budget
        const [containers] = await pool.query(
            `SELECT 
                b.budgetId,
                b.budgetName,
                b.totalAmount,
                b.status,
                b.isFrozen,
                b.description,
                d.name as departmentName,
                d.departmentId,
                bc.displayOrder,
                (SELECT COUNT(*) FROM kemri_budget_items WHERE budgetId = b.budgetId AND voided = 0) as itemCount
             FROM kemri_budget_combinations bc
             INNER JOIN kemri_budgets b ON bc.containerBudgetId = b.budgetId
             LEFT JOIN kemri_departments d ON b.departmentId = d.departmentId
             WHERE bc.combinedBudgetId = ? AND b.voided = 0
             ORDER BY bc.displayOrder ASC, b.budgetName ASC`,
            [budgetId]
        );

        // Get all items from all containers, grouped by container
        const containerItems = [];
        console.log(`Found ${containers.length} containers in combined budget ${budgetId}`);
        
        for (const container of containers) {
            console.log(`Fetching items for container ${container.budgetId} (${container.budgetName})`);
            
            // First check if items exist at all for this container
            const [itemCountCheck] = await pool.query(
                `SELECT COUNT(*) as count FROM kemri_budget_items WHERE budgetId = ? AND voided = 0`,
                [container.budgetId]
            );
            console.log(`Container ${container.budgetId} has ${itemCountCheck[0].count} items in database (before joins)`);
            
            const [items] = await pool.query(
                `SELECT 
                    bi.*,
                    d.name as departmentName,
                    sc.name as subcountyName,
                    w.name as wardName,
                    p.projectName as linkedProjectName
                 FROM kemri_budget_items bi
                 LEFT JOIN kemri_departments d ON bi.departmentId = d.departmentId
                 LEFT JOIN kemri_subcounties sc ON bi.subcountyId = sc.subcountyId
                 LEFT JOIN kemri_wards w ON bi.wardId = w.wardId
                 LEFT JOIN kemri_projects p ON bi.projectId = p.id
                 WHERE bi.budgetId = ? AND bi.voided = 0
                 ORDER BY bi.createdAt DESC`,
                [container.budgetId]
            );

            console.log(`Container ${container.budgetId} query returned ${items.length} items after joins`);
            if (items.length > 0) {
                console.log(`First item sample:`, JSON.stringify(items[0], null, 2));
            }
            if (items.length > 0) {
                console.log(`Sample item from container ${container.budgetId}:`, JSON.stringify(items[0], null, 2));
            }
            
            // Ensure items is always an array
            const itemsArray = Array.isArray(items) ? items : [];
            
            console.log(`Container ${container.budgetId} (${container.budgetName}):`, {
                itemCount: itemsArray.length,
                items: itemsArray,
                rawItems: items
            });
            
            containerItems.push({
                container: container,
                items: itemsArray
            });
        }
        
        console.log(`Total containerItems array length: ${containerItems.length}`);
        const totalItemsCount = containerItems.reduce((sum, ci) => sum + (ci.items?.length || 0), 0);
        console.log(`Total items across all containers: ${totalItemsCount}`);
        
        if (containerItems.length > 0) {
            console.log(`Sample containerItems[0] structure:`, JSON.stringify({
                container: {
                    budgetId: containerItems[0].container?.budgetId,
                    budgetName: containerItems[0].container?.budgetName,
                    itemCount: containerItems[0].container?.itemCount
                },
                itemsLength: containerItems[0].items?.length,
                firstItem: containerItems[0].items?.[0] || null
            }, null, 2));
        }
        
        // Log full response structure
        console.log('Full response structure:', {
            hasCombinedBudget: !!combinedBudget[0],
            containersCount: containers.length,
            containerItemsCount: containerItems.length,
            totalItems: totalItemsCount
        });

        // Calculate grand total
        const grandTotal = containers.reduce((sum, c) => sum + (parseFloat(c.totalAmount) || 0), 0);

        res.json({
            combinedBudget: combinedBudget[0],
            containers: containers,
            containerItems: containerItems,
            grandTotal: grandTotal,
            containerCount: containers.length,
            totalItems: containerItems.reduce((sum, ci) => sum + ci.items.length, 0)
        });
    } catch (error) {
        console.error('Error fetching combined budget:', error);
        res.status(500).json({ message: 'Error fetching combined budget', error: error.message });
    }
});

/**
 * @route POST /api/budgets/containers/:budgetId/combined/add
 * @description Add a container to an existing combined budget
 * @access Private
 */
router.post('/containers/:budgetId/combined/add', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { containerId } = req.body;
        const userId = req.user?.userId || 1;

        if (!containerId) {
            return res.status(400).json({ message: 'containerId is required' });
        }

        // Verify combined budget exists
        const [combinedBudget] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND isCombined = 1 AND voided = 0',
            [budgetId]
        );

        if (combinedBudget.length === 0) {
            return res.status(404).json({ message: 'Combined budget not found' });
        }

        // Verify container exists and is not already combined
        const [container] = await pool.query(
            'SELECT * FROM kemri_budgets WHERE budgetId = ? AND voided = 0',
            [containerId]
        );

        if (container.length === 0) {
            return res.status(404).json({ message: 'Container not found' });
        }

        if (container[0].isCombined === 1 || container[0].parentBudgetId) {
            return res.status(400).json({ message: 'This container is already part of a combined budget' });
        }

        // Get current max display order
        const [maxOrder] = await pool.query(
            'SELECT COALESCE(MAX(displayOrder), -1) as maxOrder FROM kemri_budget_combinations WHERE combinedBudgetId = ?',
            [budgetId]
        );

        const nextOrder = (maxOrder[0].maxOrder || 0) + 1;

        // Add container to combined budget
        await pool.query(
            `INSERT INTO kemri_budget_combinations 
             (combinedBudgetId, containerBudgetId, displayOrder, userId)
             VALUES (?, ?, ?, ?)`,
            [budgetId, containerId, nextOrder, userId]
        );

        // Recalculate total amount
        const [containers] = await pool.query(
            `SELECT budgetId FROM kemri_budget_combinations WHERE combinedBudgetId = ?`,
            [budgetId]
        );

        const containerIds = containers.map(c => c.budgetId);
        const placeholders = containerIds.map(() => '?').join(',');
        const [totalResult] = await pool.query(
            `SELECT COALESCE(SUM(totalAmount), 0) as total
             FROM kemri_budgets
             WHERE budgetId IN (${placeholders}) AND voided = 0`,
            containerIds
        );

        await pool.query(
            'UPDATE kemri_budgets SET totalAmount = ? WHERE budgetId = ?',
            [totalResult[0].total || 0, budgetId]
        );

        res.json({ message: 'Container added to combined budget successfully' });
    } catch (error) {
        console.error('Error adding container to combined budget:', error);
        res.status(500).json({ message: 'Error adding container', error: error.message });
    }
});

/**
 * @route DELETE /api/budgets/containers/:budgetId/combined/:containerId
 * @description Remove a container from a combined budget
 * @access Private
 */
router.delete('/containers/:budgetId/combined/:containerId', auth, privilege(['budget.update']), async (req, res) => {
    try {
        const { budgetId, containerId } = req.params;

        // Remove container from combined budget
        await pool.query(
            'DELETE FROM kemri_budget_combinations WHERE combinedBudgetId = ? AND containerBudgetId = ?',
            [budgetId, containerId]
        );

        // Recalculate total amount
        const [containers] = await pool.query(
            `SELECT budgetId FROM kemri_budget_combinations WHERE combinedBudgetId = ?`,
            [budgetId]
        );

        if (containers.length === 0) {
            // No containers left, update total to 0
            await pool.query(
                'UPDATE kemri_budgets SET totalAmount = 0 WHERE budgetId = ?',
                [budgetId]
            );
        } else {
            const containerIds = containers.map(c => c.budgetId);
            const placeholders = containerIds.map(() => '?').join(',');
            const [totalResult] = await pool.query(
                `SELECT COALESCE(SUM(totalAmount), 0) as total
                 FROM kemri_budgets
                 WHERE budgetId IN (${placeholders}) AND voided = 0`,
                containerIds
            );

            await pool.query(
                'UPDATE kemri_budgets SET totalAmount = ? WHERE budgetId = ?',
                [totalResult[0].total || 0, budgetId]
            );
        }

        res.json({ message: 'Container removed from combined budget successfully' });
    } catch (error) {
        console.error('Error removing container from combined budget:', error);
        res.status(500).json({ message: 'Error removing container', error: error.message });
    }
});

/**
 * ============================================
 * BUDGET IMPORT ROUTES
 * ============================================
 */

// Configure multer for file uploads (matching projectRoutes.js pattern)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit (increased for large budget files)
});

// Normalize string for matching
const normalizeStr = (v) => {
    if (typeof v !== 'string') return v;
    let normalized = v.trim();
    normalized = normalized.replace(/[''"`\u0027\u2018\u2019\u201A\u201B\u2032\u2035]/g, '');
    normalized = normalized.replace(/\s*\/\s*/g, '/');
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
};

// Check if a value represents CountyWide (handles various user input formats)
const isCountyWide = (value) => {
    if (!value || value === 'unknown') return false;
    
    const normalized = normalizeStr(String(value)).toLowerCase();
    
    // CountyWide variations
    if (normalized === 'countywide' || normalized === 'county wide' || normalized === 'county-wide') {
        return true;
    }
    
    // "All Wards" / "All Ward" variations
    if (normalized === 'all wards' || normalized === 'all ward' || 
        normalized === 'all-wards' || normalized === 'all-ward') {
        return true;
    }
    
    // "All Subcounties" / "All Subcounty" variations
    if (normalized === 'all subcounties' || normalized === 'all subcounty' ||
        normalized === 'all-subcounties' || normalized === 'all-subcounty') {
        return true;
    }
    
    // Check if contains both "all" and ("ward" or "subcount" or "subcounty")
    // This handles variations like "All Wards", "All Subcounties", etc.
    const words = normalized.split(/[\s-]+/); // Split on spaces and dashes
    const hasAll = words.some(w => w === 'all');
    const hasWard = words.some(w => w.includes('ward'));
    const hasSubcount = words.some(w => w.includes('subcount'));
    
    if (hasAll && (hasWard || hasSubcount)) {
        return true;
    }
    
    return false;
};

/**
 * @route POST /api/budgets/import-data
 * @description Preview budget data from uploaded file
 * @access Private
 */
router.post('/import-data', upload.single('file'), async (req, res) => {
    const startTime = Date.now();
    console.log('=== POST /api/budgets/import-data called ===');
    
    // Set response timeout to prevent hanging
    req.setTimeout(30000, () => {
        console.error('Request timeout for budget import preview');
        if (!res.headersSent) {
            res.status(504).json({ success: false, message: 'Request timeout. File processing took too long.' });
        }
    });
    
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const filePath = req.file.path;
    console.log('Processing file:', req.file.originalname, 'Size:', req.file.size, 'bytes');
    
    try {
        const parseStartTime = Date.now();
        
        // Add error handling for file reading with more specific error messages
        let workbook;
        try {
            // Try reading with options to handle large/corrupted files better
            workbook = xlsx.readFile(filePath, { 
                cellDates: true,
                cellNF: false,  // Don't parse number formats (faster)
                cellStyles: false,  // Don't parse styles (faster, less memory)
                sheetRows: 10000  // Limit rows to prevent memory issues (adjust if needed)
            });
        } catch (readError) {
            console.error('Error reading Excel file:', readError);
            console.error('File path:', filePath);
            console.error('File size:', req.file?.size, 'bytes');
            fs.unlink(filePath, () => {});
            return res.status(500).json({ 
                success: false, 
                message: `Failed to read Excel file: ${readError.message}. The file may be corrupted or in an unsupported format. Try saving it as a new Excel file (.xlsx).`,
                error: process.env.NODE_ENV === 'development' ? readError.stack : undefined
            });
        }
        
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            fs.unlink(filePath, () => {});
            return res.status(400).json({ success: false, message: 'Excel file has no sheets or is invalid.' });
        }
        
        const sheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheetName];
        
        if (!worksheet) {
            fs.unlink(filePath, () => {});
            return res.status(400).json({ success: false, message: 'Excel file sheet is empty or invalid.' });
        }
        
        // Check if the worksheet has an extremely large range (indicates many empty columns)
        // This can cause memory issues during parsing
        const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
        const columnCount = range.e.c + 1; // End column index + 1
        const rowCount = range.e.r + 1; // End row index + 1
        
        console.log(`Worksheet range: ${worksheet['!ref']}, Columns: ${columnCount}, Rows: ${rowCount}`);
        
        // If we have more than 100 columns, limit the range to prevent memory issues
        // We'll read a reasonable number of columns and trim later if needed
        if (columnCount > 100) {
            console.log(`Large column range detected (${columnCount} columns), limiting to first 200 columns for initial parsing`);
            // Create a limited range (first 200 columns, all rows)
            const limitedRange = {
                s: { c: 0, r: 0 },
                e: { c: Math.min(199, columnCount - 1), r: range.e.r }
            };
            const limitedRef = xlsx.utils.encode_range(limitedRange);
            
            // Create a new worksheet object with limited range
            const limitedWorksheet = {};
            // Copy all properties from original worksheet
            Object.keys(worksheet).forEach(key => {
                if (key.startsWith('!')) {
                    // Copy metadata
                    limitedWorksheet[key] = worksheet[key];
                } else {
                    // Copy cell data only if within our limited range
                    const cellAddress = xlsx.utils.decode_cell(key);
                    if (cellAddress.c <= limitedRange.e.c) {
                        limitedWorksheet[key] = worksheet[key];
                    }
                }
            });
            // Update the range reference
            limitedWorksheet['!ref'] = limitedRef;
            worksheet = limitedWorksheet;
            console.log(`Limited worksheet range to: ${limitedRef}`);
        }
        
        let rawData;
        try {
            rawData = xlsx.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: null,  // Default value for empty cells
                raw: false  // Convert dates and numbers to strings for consistency
            });
        } catch (parseError) {
            console.error('Error parsing worksheet:', parseError);
            console.error('Parse error stack:', parseError.stack);
            fs.unlink(filePath, () => {});
            return res.status(500).json({ 
                success: false, 
                message: `Failed to parse Excel worksheet: ${parseError.message}. The file may have formatting issues or too many empty columns. Try saving it as a new Excel file (.xlsx) and removing empty columns.`,
                error: process.env.NODE_ENV === 'development' ? parseError.stack : undefined
            });
        }
        
        // Trim empty columns to prevent memory issues with files that have large "used ranges"
        // This is critical for files where Excel's "used range" includes many empty columns
        const originalColumnCount = rawData[0]?.length || 0;
        let lastColumnWithData = -1;
        
        // Only trim if we have a suspiciously large number of columns (more than 50)
        // This prevents processing thousands of empty columns
        if (originalColumnCount > 50) {
            console.log(`Large column count detected (${originalColumnCount}), trimming empty columns...`);
            
            // Find the last column with data by checking from the end backwards (more efficient)
            // Start from a reasonable maximum (e.g., 100 columns) and work backwards
            const maxColumnsToCheck = Math.min(originalColumnCount, 200); // Don't check more than 200 columns
            
            for (let col = maxColumnsToCheck - 1; col >= 0; col--) {
                let hasData = false;
                // Check first 50 rows to determine if column has data (for performance)
                for (let row = 0; row < Math.min(rawData.length, 50); row++) {
                    const cell = rawData[row]?.[col];
                    if (cell !== undefined && cell !== null && cell !== '') {
                        hasData = true;
                        break;
                    }
                }
                if (hasData) {
                    lastColumnWithData = col;
                    break; // Found the last column with data, no need to check further
                }
            }
            
            // If we didn't find data in first 200 columns, check if there's data beyond that
            if (lastColumnWithData === -1 && originalColumnCount > 200) {
                // This is unusual, but check a few columns beyond 200
                for (let col = 200; col < Math.min(originalColumnCount, 300); col++) {
                    for (let row = 0; row < Math.min(rawData.length, 10); row++) {
                        const cell = rawData[row]?.[col];
                        if (cell !== undefined && cell !== null && cell !== '') {
                            lastColumnWithData = col;
                            break;
                        }
                    }
                    if (lastColumnWithData >= 0) break;
                }
            }
            
            // Default to first 200 columns if we can't find data (safety fallback)
            if (lastColumnWithData === -1) {
                lastColumnWithData = Math.min(199, originalColumnCount - 1);
                console.log(`No data found in first columns, limiting to first 200 columns`);
            }
            
            // Trim rows to only include columns with data (add 1 to include the last column)
            if (lastColumnWithData >= 0 && lastColumnWithData < originalColumnCount - 1) {
                const trimStartTime = Date.now();
                rawData = rawData.map(row => {
                    if (!Array.isArray(row)) return row;
                    return row.slice(0, lastColumnWithData + 1);
                });
                const trimTime = Date.now() - trimStartTime;
                console.log(`Trimmed columns from ${originalColumnCount} to ${lastColumnWithData + 1} columns (removed ${originalColumnCount - lastColumnWithData - 1} empty columns) in ${trimTime}ms`);
            }
        }
        
        const parseTime = Date.now() - parseStartTime;
        console.log(`File parsed in ${parseTime}ms. Rows: ${rawData.length}`);

        if (rawData.length < 2) {
            fs.unlink(filePath, () => {});
            return res.status(400).json({ success: false, message: 'Uploaded Excel file is empty or has no data rows.' });
        }

        const headers = rawData[0];
        if (!headers || !Array.isArray(headers) || headers.length === 0) {
            fs.unlink(filePath, () => {});
            return res.status(400).json({ success: false, message: 'Uploaded Excel file has no headers or invalid format.' });
        }
        
        // Log detected headers for debugging
        console.log('Detected headers:', headers.filter(h => h !== null && h !== undefined && h !== ''));
        console.log('Total header count:', headers.length);

        const dataRows = rawData.slice(1).filter(row => {
            if (!row || !Array.isArray(row)) return false;
            return row.some(cell => cell !== undefined && cell !== null && cell !== '');
        });

        // Map headers to canonical names
        const headerMap = {
            'BudgetName': 'budgetName',
            'Budget Name': 'budgetName',
            'Budget': 'budgetName',  // Support singular "Budget" column
            'budget': 'budgetName',
            'Department': 'department',
            'department': 'department',
            'Department Name': 'department',
            'db_department': 'dbDepartment',
            'dbDepartment': 'dbDepartment',
            'Project Name': 'projectName',
            'projectName': 'projectName',
            'ward': 'ward',
            'Ward': 'ward',
            'Amount': 'amount',
            'amount': 'amount',
            'db_subcounty': 'dbSubcounty',
            'db_ward': 'dbWard',
            'sub-county': 'subcounty',
            'Sub County': 'subcounty',
            'SubCounty': 'subcounty',
            'Subcounty': 'subcounty',  // Add explicit mapping for 'Subcounty'
            'subcounty': 'subcounty',
            'fin_year': 'finYear',
            'finYear': 'finYear',
            'Financial Year': 'finYear',
            'financialYear': 'finYear'
        };
        
        const mapRow = (headers, row) => {
            const obj = {};
            for (let i = 0; i < headers.length; i++) {
                const rawHeader = headers[i];
                if (rawHeader === undefined || rawHeader === null) continue;
                
                // Normalize header name for matching (trim whitespace, handle case variations)
                const normalizedHeader = String(rawHeader).trim();
                let canonical = headerMap[normalizedHeader] || headerMap[rawHeader];
                
                // If not found in map, try case-insensitive matching
                if (!canonical) {
                    const normalizedLower = normalizedHeader.toLowerCase();
                    for (const [key, value] of Object.entries(headerMap)) {
                        if (String(key).toLowerCase() === normalizedLower) {
                            canonical = value;
                            break;
                        }
                    }
                }
                
                // If still not found, use the original header (normalized)
                if (!canonical) {
                    canonical = normalizedHeader;
                }
                
                let value = row[i];
                if (value === undefined || value === null) {
                    value = null;
                } else if (value === '') {
                    value = null;
                }
                obj[canonical] = value;
            }
            return obj;
        };
        
        // Log which ward/subcounty columns were found
        const foundWardColumns = headers.filter(h => {
            if (!h) return false;
            const hStr = String(h).trim().toLowerCase();
            return hStr.includes('ward') || hStr === 'db_ward';
        });
        const foundSubcountyColumns = headers.filter(h => {
            if (!h) return false;
            const hStr = String(h).trim().toLowerCase();
            return hStr.includes('subcounty') || hStr.includes('sub-county') || hStr.includes('sub county') || hStr === 'db_subcounty';
        });
        console.log('Found ward columns:', foundWardColumns);
        console.log('Found subcounty columns:', foundSubcountyColumns);

        // Process rows in chunks to avoid memory issues
        const fullData = [];
        const chunkSize = 100;
        for (let i = 0; i < dataRows.length; i += chunkSize) {
            const chunk = dataRows.slice(i, i + chunkSize);
            const mappedChunk = chunk.map(r => {
                try {
                    return mapRow(headers, r);
                } catch (err) {
                    console.error('Error mapping row:', err);
                    return null;
                }
            }).filter(row => {
                if (!row) return false;
                // For budget imports, we need at least a budget name or project name
                const projectName = (row.projectName || row['Project Name'] || '').toString().trim();
                const budgetNameRaw = row.budgetName || row['BudgetName'] || row['Budget Name'] || row['Budget'] || row.budget || '';
                const budgetName = typeof budgetNameRaw === 'string' ? budgetNameRaw.trim() : (budgetNameRaw ? String(budgetNameRaw).trim() : '');
                const isValid = (projectName && projectName.length >= 3) || (budgetName && budgetName.length > 0);
                return isValid;
            });
            fullData.push(...mappedChunk);
        }

        if (fullData.length === 0) {
            fs.unlink(filePath, () => {});
            const sampleMappedRow = dataRows.length > 0 ? mapRow(headers, dataRows[0]) : null;
            return res.status(400).json({ 
                success: false, 
                message: 'No valid data rows found. Please ensure your file has at least one row with a Project Name (minimum 3 characters) or a Budget name.',
                headers: headers,
                dataRowCount: dataRows.length
            });
        }

        const previewLimit = 10;
        const previewData = fullData.slice(0, previewLimit);

        // CRITICAL: Don't send fullData in response - it can be huge and crash the server
        // Instead, store it temporarily or process it on the client side
        // For now, only send preview data and total count
        const totalRows = fullData.length;
        
        // Skip metadata validation in preview to speed up processing
        const validationErrors = [];
        
        const totalTime = Date.now() - startTime;
        console.log(`Preview processing completed in ${totalTime}ms. Processed ${totalRows} rows`);

        // Clean up file immediately
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

        // Send response with only preview data (not fullData to prevent memory issues)
        return res.status(200).json({
            success: true,
            message: `File parsed successfully. Review ${previewData.length} of ${totalRows} rows.${validationErrors.length > 0 ? ` ${validationErrors.length} validation warning(s).` : ''}`,
            previewData,
            headers: Object.keys(previewData[0] || {}),
            totalRows: totalRows,
            validationErrors: validationErrors.length > 0 ? validationErrors : undefined
        });
    } catch (err) {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp file on error:', unlinkErr);
            });
        }
        console.error('Budget import preview error:', err);
        console.error('Error stack:', err.stack);
        
        // Ensure response is sent even on error
        if (!res.headersSent) {
            return res.status(500).json({ 
                success: false, 
                message: `File parsing failed: ${err.message}`,
                error: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        }
    }
});

/**
 * @route POST /api/budgets/confirm-import-data
 * @description Confirm and import budget data
 * @access Private
 * Accepts either dataToImport array OR a file upload (if dataToImport is not provided)
 */
router.post('/confirm-import-data', upload.single('file'), async (req, res) => {
    let dataToImport = req.body?.dataToImport;
    const filePath = req.file?.path;
    
    // If no data provided but file uploaded, parse the file
    if ((!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) && filePath) {
        try {
            console.log('No dataToImport provided, parsing uploaded file for import');
            const workbook = xlsx.readFile(filePath, { 
                cellDates: true,
                cellNF: false,
                cellStyles: false
            });
            const sheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[sheetName];
            
            // Check and limit large column ranges (same as preview endpoint)
            const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
            const columnCount = range.e.c + 1;
            if (columnCount > 100) {
                console.log(`Large column range detected (${columnCount} columns), limiting to first 200 columns`);
                const limitedRange = {
                    s: { c: 0, r: 0 },
                    e: { c: Math.min(199, columnCount - 1), r: range.e.r }
                };
                const limitedRef = xlsx.utils.encode_range(limitedRange);
                const limitedWorksheet = {};
                Object.keys(worksheet).forEach(key => {
                    if (key.startsWith('!')) {
                        limitedWorksheet[key] = worksheet[key];
                    } else {
                        const cellAddress = xlsx.utils.decode_cell(key);
                        if (cellAddress.c <= limitedRange.e.c) {
                            limitedWorksheet[key] = worksheet[key];
                        }
                    }
                });
                limitedWorksheet['!ref'] = limitedRef;
                worksheet = limitedWorksheet;
            }
            
            const rawData = xlsx.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: null,
                raw: false
            });
            
            if (rawData.length < 2) {
                fs.unlink(filePath, () => {});
                return res.status(400).json({ success: false, message: 'Uploaded Excel file is empty or has no data rows.' });
            }
            
            const headers = rawData[0];
            const dataRows = rawData.slice(1).filter(row => {
                if (!row || !Array.isArray(row)) return false;
                return row.some(cell => cell !== undefined && cell !== null && cell !== '');
            });
            
            // Use same mapping logic as preview
            const headerMap = {
                'BudgetName': 'budgetName', 'Budget Name': 'budgetName', 'Budget': 'budgetName', 'budget': 'budgetName',
                'Department': 'department', 'department': 'department', 'Department Name': 'department', 'db_department': 'dbDepartment', 'dbDepartment': 'dbDepartment',
                'Project Name': 'projectName', 'projectName': 'projectName',
                'ward': 'ward', 'Ward': 'ward', 'db_ward': 'dbWard',
                'Amount': 'amount', 'amount': 'amount',
                'db_subcounty': 'dbSubcounty', 'sub-county': 'subcounty', 'Sub County': 'subcounty',
                'SubCounty': 'subcounty', 'Subcounty': 'subcounty', 'subcounty': 'subcounty',
                'fin_year': 'finYear', 'finYear': 'finYear', 'Financial Year': 'finYear', 'financialYear': 'finYear'
            };
            
            const mapRow = (headers, row) => {
                const obj = {};
                for (let i = 0; i < headers.length; i++) {
                    const rawHeader = headers[i];
                    if (rawHeader === undefined || rawHeader === null) continue;
                    const canonical = headerMap[rawHeader] || rawHeader;
                    let value = row[i];
                    obj[canonical] = (value === undefined || value === null || value === '') ? null : value;
                }
                return obj;
            };
            
            dataToImport = dataRows.map(r => mapRow(headers, r)).filter(row => {
                if (!row) return false;
                const projectName = (row.projectName || row['Project Name'] || '').toString().trim();
                const budgetNameRaw = row.budgetName || row['BudgetName'] || row['Budget Name'] || row['Budget'] || row.budget || '';
                const budgetName = typeof budgetNameRaw === 'string' ? budgetNameRaw.trim() : (budgetNameRaw ? String(budgetNameRaw).trim() : '');
                return (projectName && projectName.length >= 3) || (budgetName && budgetName.length > 0);
            });
            
            // Clean up file after parsing
            fs.unlink(filePath, () => {});
        } catch (parseErr) {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlink(filePath, () => {});
            }
            console.error('Error parsing file in confirm-import:', parseErr);
            return res.status(400).json({ success: false, message: `Failed to parse uploaded file: ${parseErr.message}` });
        }
    }
    
    if (!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) {
        return res.status(400).json({ success: false, message: 'No data provided for import. Please provide dataToImport array or upload a file.' });
    }

    const userId = req.user?.userId || 1; // Get from authenticated user
    let connection;
    const summary = {
        totalRows: dataToImport.length,
        itemsCreated: 0,
        itemsSkipped: 0,
        errors: []
    };

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Load metadata mappings for enhanced ward/subcounty matching
        console.log('Loading metadata mappings for import...');
        let metadataMappings;
        try {
            metadataMappings = await metadataService.loadMetadataMappings();
            console.log('Metadata mappings loaded successfully');
        } catch (metadataError) {
            console.error('Error loading metadata mappings, continuing with basic matching:', metadataError);
            metadataMappings = null; // Fallback to basic matching if metadata service fails
        }

        for (let i = 0; i < dataToImport.length; i++) {
            const row = dataToImport[i] || {};
            try {
                // Extract and normalize fields - log first row for debugging
                if (i === 0) {
                    console.log('Sample row data:', JSON.stringify(row, null, 2));
                    console.log('Available keys:', Object.keys(row));
                }
                
                const budgetNameRaw = row.budgetName || row['BudgetName'] || row['Budget Name'] || row['Budget'] || row.budget || '';
                const budgetName = normalizeStr(budgetNameRaw);
                const projectNameRaw = row.projectName || row['Project Name'] || row['project name'] || row['Project name'] || row['PROJECT NAME'] || '';
                let projectName = '';
                if (projectNameRaw) {
                    const normalized = normalizeStr(String(projectNameRaw));
                    if (normalized && typeof normalized === 'string') {
                        projectName = normalized.trim();
                    }
                }
                const amount = parseFloat(row.amount || row['Amount'] || 0);
                const dbWard = normalizeStr(row.dbWard || row['db_ward'] || row.ward || row.Ward || '');
                const dbSubcounty = normalizeStr(row.dbSubcounty || row['db_subcounty'] || row.subcounty || row.Subcounty || row['Sub County'] || row['sub-county'] || '');
                // Extract department name/alias from input file
                const departmentNameRaw = row.department || row.Department || row.dbDepartment || row['db_department'] || row['Department Name'] || '';
                const departmentName = normalizeStr(departmentNameRaw);

                // Log first row for debugging
                if (i === 0) {
                    console.log(`Row ${i + 2} extracted values:`, {
                        budgetName,
                        projectName,
                        amount,
                        dbWard,
                        dbSubcounty,
                        departmentName
                    });
                }

                // Validate required fields - projectName must be non-empty after normalization
                if (!budgetName || budgetName.trim() === '' || !projectName || projectName === '' || !amount || amount <= 0) {
                    summary.itemsSkipped++;
                    summary.errors.push({
                        row: i + 2,
                        message: `Missing required fields: budgetName="${budgetName}", projectName="${projectName}", amount=${amount}`
                    });
                    continue;
                }

                // Get budget container
                const [budgetRows] = await connection.query(
                    'SELECT budgetId, finYearId, departmentId FROM kemri_budgets WHERE voided = 0 AND budgetName = ? LIMIT 1',
                    [budgetName]
                );

                if (budgetRows.length === 0) {
                    summary.itemsSkipped++;
                    summary.errors.push({
                        row: i + 2,
                        message: `Budget "${budgetName}" not found`
                    });
                    continue;
                }

                const budgetId = budgetRows[0].budgetId;
                const finYearId = budgetRows[0].finYearId;
                
                // Validate that budget has required fields
                if (!finYearId || finYearId === null || finYearId === undefined) {
                    summary.itemsSkipped++;
                    summary.errors.push({
                        row: i + 2,
                        message: `Budget "${budgetName}" has no finYearId (finYearId is null or undefined)`
                    });
                    console.warn(`Budget "${budgetName}" (ID: ${budgetId}) found but has null/undefined finYearId`);
                    continue;
                }
                
                // Get department ID from input file using metadata service (handles both name and alias)
                let departmentId = null;
                if (departmentName && departmentName.trim() !== '') {
                    if (metadataMappings) {
                        // Use enhanced matching with metadata service (handles both name and alias)
                        departmentId = metadataService.getDepartmentId(
                            metadataMappings.departments,
                            metadataMappings.departmentAliases,
                            departmentName
                        );
                        if (departmentId) {
                            console.log(`Matched department: "${departmentName}" -> Department ID: ${departmentId}`);
                        } else {
                            console.warn(`Could not match department: "${departmentName}"`);
                        }
                    } else {
                        // Fallback to basic SQL matching if metadata service failed
                        const [deptRows] = await connection.query(
                            'SELECT departmentId FROM kemri_departments WHERE (voided IS NULL OR voided = 0) AND (name = ? OR alias LIKE ?) LIMIT 1',
                            [departmentName, `%${departmentName}%`]
                        );
                        if (deptRows.length > 0) {
                            departmentId = deptRows[0].departmentId;
                        }
                    }
                }
                
                // If department not found in input, try to get from budget as fallback
                if (!departmentId && budgetRows[0].departmentId) {
                    departmentId = budgetRows[0].departmentId;
                    console.log(`Using departmentId from budget record: ${departmentId}`);
                }
                
                // Validate that we have a departmentId
                if (!departmentId || departmentId === null || departmentId === undefined) {
                    summary.itemsSkipped++;
                    summary.errors.push({
                        row: i + 2,
                        message: `Department not found: "${departmentName}" (from input file) and budget "${budgetName}" has no departmentId`
                    });
                    console.warn(`Row ${i + 2}: No departmentId found. Input department: "${departmentName}", Budget departmentId: ${budgetRows[0].departmentId}`);
                    continue;
                }

                // Get or create project
                let projectId = null;
                const [projectRows] = await connection.query(
                    'SELECT id FROM kemri_projects WHERE voided = 0 AND projectName = ? LIMIT 1',
                    [projectName]
                );

                if (projectRows.length > 0) {
                    projectId = projectRows[0].id;
                } else {
                    // Create project if it doesn't exist
                    // Ensure projectName is not empty before inserting
                    const trimmedProjectName = projectName ? projectName.trim() : '';
                    if (!trimmedProjectName || trimmedProjectName === '') {
                        throw new Error(`Cannot create project: projectName is empty for row ${i + 2}. Raw value was: "${projectNameRaw}"`);
                    }
                    console.log(`Creating project with name: "${trimmedProjectName}"`);
                    const [projectResult] = await connection.query(
                        'INSERT INTO kemri_projects (projectName, departmentId, finYearId, costOfProject, userId) VALUES (?, ?, ?, ?, ?)',
                        [trimmedProjectName, departmentId, finYearId, amount, userId]
                    );
                    projectId = projectResult.insertId;
                    console.log(`Created new project: ID=${projectId}, Name="${trimmedProjectName}"`);
                }

                // Get ward and subcounty IDs using enhanced matching
                let wardId = null;
                let subcountyId = null;

                // Handle CountyWide - check if it exists in database
                // CountyWide ward: wardId = 38, subcountyId = 9
                // CountyWide subcounty: subcountyId = 9, name = "Countywide"
                const isCountyWideWard = isCountyWide(dbWard);
                const isCountyWideSubcounty = isCountyWide(dbSubcounty);

                if (dbWard && dbWard !== 'unknown') {
                    if (isCountyWideWard) {
                        // Look up CountyWide ward in database (handles both "CountyWide" and "Countywide" variations)
                        const [countyWideWardRows] = await connection.query(
                            'SELECT wardId, subcountyId FROM kemri_wards WHERE voided = 0 AND (LOWER(name) = ? OR LOWER(name) = ? OR LOWER(name) LIKE ?) LIMIT 1',
                            ['countywide', 'county wide', '%countywide%']
                        );
                        if (countyWideWardRows.length > 0) {
                            wardId = countyWideWardRows[0].wardId;
                            subcountyId = countyWideWardRows[0].subcountyId;
                            console.log(`Matched CountyWide ward -> Ward ID: ${wardId}, Subcounty ID: ${subcountyId}`);
                        } else {
                            console.warn(`CountyWide ward not found in database`);
                        }
                    } else if (metadataMappings) {
                        // Use enhanced matching with metadata service
                        const wardInfo = metadataService.getWardInfo(
                            metadataMappings.wards,
                            metadataMappings.wardWordSets,
                            dbWard
                        );
                        if (wardInfo) {
                            wardId = wardInfo.wardId;
                            subcountyId = wardInfo.subcountyId;
                            console.log(`Matched ward: "${dbWard}" -> Ward ID: ${wardId}, Subcounty ID: ${subcountyId}`);
                        } else {
                            console.warn(`Could not match ward: "${dbWard}"`);
                        }
                    } else {
                        // Fallback to basic SQL matching
                        const [wardRows] = await connection.query(
                            'SELECT wardId, subcountyId FROM kemri_wards WHERE voided = 0 AND name = ? LIMIT 1',
                            [dbWard]
                        );
                        if (wardRows.length > 0) {
                            wardId = wardRows[0].wardId;
                            subcountyId = wardRows[0].subcountyId;
                        }
                    }
                }

                if (dbSubcounty && dbSubcounty !== 'unknown' && !subcountyId) {
                    if (isCountyWideSubcounty) {
                        // Look up CountyWide subcounty in database (handles both "CountyWide" and "Countywide" variations)
                        const [countyWideSubcountyRows] = await connection.query(
                            'SELECT subcountyId FROM kemri_subcounties WHERE (voided IS NULL OR voided = 0) AND (LOWER(name) = ? OR LOWER(name) = ? OR LOWER(name) LIKE ?) LIMIT 1',
                            ['countywide', 'county wide', '%countywide%']
                        );
                        if (countyWideSubcountyRows.length > 0) {
                            subcountyId = countyWideSubcountyRows[0].subcountyId;
                            console.log(`Matched CountyWide subcounty -> Subcounty ID: ${subcountyId}`);
                        } else {
                            console.warn(`CountyWide subcounty not found in database`);
                        }
                    } else if (metadataMappings) {
                        // Use enhanced matching with metadata service
                        const subcountyIdResult = metadataService.getSubcountyId(
                            metadataMappings.subcounties,
                            metadataMappings.subcountyWordSets,
                            dbSubcounty
                        );
                        if (subcountyIdResult) {
                            subcountyId = subcountyIdResult;
                            console.log(`Matched subcounty: "${dbSubcounty}" -> Subcounty ID: ${subcountyId}`);
                        } else {
                            console.warn(`Could not match subcounty: "${dbSubcounty}"`);
                        }
                    } else {
                        // Fallback to basic SQL matching
                        const [subcountyRows] = await connection.query(
                            'SELECT subcountyId FROM kemri_subcounties WHERE voided = 0 AND name = ? LIMIT 1',
                            [dbSubcounty]
                        );
                        if (subcountyRows.length > 0) {
                            subcountyId = subcountyRows[0].subcountyId;
                        }
                    }
                }

                // Create budget item
                // Note: projectName and departmentId are required fields (NOT NULL) in kemri_budget_items
                console.log(`Creating budget item: budgetId=${budgetId}, projectId=${projectId}, projectName="${projectName}", departmentId=${departmentId}, wardId=${wardId}, subcountyId=${subcountyId}, amount=${amount}`);
                const [insertResult] = await connection.query(
                    'INSERT INTO kemri_budget_items (budgetId, projectId, projectName, departmentId, wardId, subcountyId, amount, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [budgetId, projectId, projectName, departmentId, wardId, subcountyId, amount, userId]
                );
                console.log(`Budget item created with ID: ${insertResult.insertId}`);

                summary.itemsCreated++;
            } catch (rowError) {
                summary.itemsSkipped++;
                summary.errors.push({
                    row: i + 2,
                    message: rowError.message || 'Error processing row'
                });
            }
        }

        await connection.commit();
        res.status(200).json({
            success: true,
            message: `Import completed. ${summary.itemsCreated} items created, ${summary.itemsSkipped} skipped.`,
            summary
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Budget import error:', error);
        res.status(500).json({ success: false, message: `Import failed: ${error.message}` });
    } finally {
        if (connection) connection.release();
    }
});

/**
 * @route POST /api/budgets/check-metadata-mapping
 * @description Check metadata mappings for budget import data (budgets, financial years, departments, wards, subcounties)
 * @access Private
 */
router.post('/check-metadata-mapping', upload.single('file'), async (req, res) => {
    const overallStart = Date.now();
    console.log('=== POST /api/budgets/check-metadata-mapping called ===');
    let dataToImport = req.body?.dataToImport;
    const filePath = req.file?.path;

    // If no data provided but file uploaded, parse the file
    if ((!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) && filePath) {
        try {
            console.log('No dataToImport provided, parsing uploaded file for metadata check');
            const workbook = xlsx.readFile(filePath, { 
                cellDates: true,
                cellNF: false,
                cellStyles: false
            });
            const sheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[sheetName];

            // Check and limit large column ranges
            const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
            const columnCount = range.e.c + 1;
            if (columnCount > 100) {
                console.log(`Large column range detected (${columnCount} columns), limiting to first 200 columns`);
                const limitedRange = {
                    s: { c: 0, r: 0 },
                    e: { c: Math.min(199, columnCount - 1), r: range.e.r }
                };
                const limitedRef = xlsx.utils.encode_range(limitedRange);
                const limitedWorksheet = {};
                Object.keys(worksheet).forEach(key => {
                    if (key.startsWith('!')) {
                        limitedWorksheet[key] = worksheet[key];
                    } else {
                        const cellAddress = xlsx.utils.decode_cell(key);
                        if (cellAddress.c <= limitedRange.e.c) {
                            limitedWorksheet[key] = worksheet[key];
                        }
                    }
                });
                limitedWorksheet['!ref'] = limitedRef;
                worksheet = limitedWorksheet;
            }

            const rawData = xlsx.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: null,
                raw: false
            });

            if (rawData.length < 2) {
                fs.unlink(filePath, () => {});
                return res.status(400).json({ success: false, message: 'Uploaded Excel file is empty or has no data rows.' });
            }

            const headers = rawData[0];
            const dataRows = rawData.slice(1).filter(row => {
                if (!row || !Array.isArray(row)) return false;
                return row.some(cell => cell !== undefined && cell !== null && cell !== '');
            });

            // Use same mapping logic as preview
            const headerMap = {
                'BudgetName': 'budgetName', 'Budget Name': 'budgetName', 'Budget': 'budgetName', 'budget': 'budgetName',
                'Department': 'department', 'department': 'department', 'Department Name': 'department', 'db_department': 'dbDepartment', 'dbDepartment': 'dbDepartment',
                'Project Name': 'projectName', 'projectName': 'projectName',
                'ward': 'ward', 'Ward': 'ward', 'db_ward': 'dbWard',
                'Amount': 'amount', 'amount': 'amount',
                'db_subcounty': 'dbSubcounty', 'sub-county': 'subcounty', 'Sub County': 'subcounty',
                'SubCounty': 'subcounty', 'Subcounty': 'subcounty', 'subcounty': 'subcounty',
                'fin_year': 'finYear', 'finYear': 'finYear', 'Financial Year': 'finYear', 'financialYear': 'finYear'
            };

            const mapRow = (headers, row) => {
                const obj = {};
                for (let i = 0; i < headers.length; i++) {
                    const rawHeader = headers[i];
                    if (rawHeader === undefined || rawHeader === null) continue;
                    const canonical = headerMap[rawHeader] || rawHeader;
                    let value = row[i];
                    obj[canonical] = (value === undefined || value === null || value === '') ? null : value;
                }
                return obj;
            };

            dataToImport = dataRows.map(r => mapRow(headers, r)).filter(row => {
                if (!row) return false;
                const projectName = (row.projectName || row['Project Name'] || '').toString().trim();
                const budgetNameRaw = row.budgetName || row['BudgetName'] || row['Budget Name'] || row['Budget'] || row.budget || '';
                const budgetName = typeof budgetNameRaw === 'string' ? budgetNameRaw.trim() : (budgetNameRaw ? String(budgetNameRaw).trim() : '');
                return (projectName && projectName.length >= 3) || (budgetName && budgetName.length > 0);
            });

            // Clean up file after parsing
            fs.unlink(filePath, () => {});
            console.log(`Parsed ${dataToImport.length} rows from uploaded file`);
        } catch (parseErr) {
            if (filePath && fs.existsSync(filePath)) {
                fs.unlink(filePath, () => {});
            }
            console.error('Error parsing file in check-metadata-mapping:', parseErr);
            return res.status(400).json({ success: false, message: `Failed to parse uploaded file: ${parseErr.message}` });
        }
    }

    console.log('Data to import length:', dataToImport?.length || 0);
    console.log('First row sample:', dataToImport?.[0] || 'N/A');
    
    if (!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) {
        console.error('No data provided for metadata mapping check');
        return res.status(400).json({ success: false, message: 'No data provided for metadata mapping check.' });
    }

    // Enhanced normalization: trim, normalize spaces/slashes, handle apostrophes, collapse multiple spaces
    const normalizeStr = (v) => {
        if (typeof v !== 'string') return v;
        let normalized = v.trim();
        // Remove apostrophes (handle different apostrophe characters)
        normalized = normalized.replace(/[''"`\u0027\u2018\u2019\u201A\u201B\u2032\u2035]/g, '');
        // Normalize slashes: remove spaces around existing slashes
        normalized = normalized.replace(/\s*\/\s*/g, '/');
        // Collapse multiple spaces to single space
        normalized = normalized.replace(/\s+/g, ' ');
        return normalized;
    };

    // Normalize alias for matching: remove &, commas, and spaces, then lowercase
    const normalizeAlias = (v) => {
        if (typeof v !== 'string') return v;
        return normalizeStr(v)
            .replace(/[&,]/g, '')  // Remove ampersands and commas
            .replace(/\s+/g, '')   // Remove all spaces
            .toLowerCase();         // Lowercase for case-insensitive matching
    };

    let connection;
    const mappingSummary = {
        budgets: { existing: [], new: [], unmatched: [] },
        financialYears: { existing: [], new: [], unmatched: [] },
        departments: { existing: [], new: [], unmatched: [] },
        wards: { existing: [], new: [], unmatched: [] },
        subcounties: { existing: [], new: [], unmatched: [] },
        totalRows: dataToImport.length,
        rowsWithUnmatchedMetadata: [],
        duplicateProjectNames: [] // Track duplicate project names
    };

    try {
        connection = await pool.getConnection();

        // Collect unique values from all rows
        const uniqueBudgets = new Set();
        const uniqueFinancialYears = new Set();
        const uniqueDepartments = new Set();
        const uniqueWards = new Set();
        const uniqueSubcounties = new Set();
        
        // Track project names to detect duplicates
        const projectNameMap = new Map(); // normalized name -> array of {rowNumber, projectName, budgetName}
        const duplicateProjectNames = new Set();

        console.log('Processing', dataToImport.length, 'rows for metadata check');
        if (dataToImport.length > 0) {
            console.log('First row sample keys:', Object.keys(dataToImport[0]));
            console.log('First row sample:', JSON.stringify(dataToImport[0], null, 2));
        }
        
        dataToImport.forEach((row, index) => {
            // For budget imports, we need at least a budget name or project name
            const projectName = (row.projectName || row['Project Name'] || '').toString().trim();
            // Check for budget in multiple possible column names: Budget, budgetName, BudgetName, Budget Name
            // Try to find budget name in various column name variations
            let budgetNameRaw = row.budgetName || 
                row['BudgetName'] || 
                row['Budget Name'] || 
                row['Budget'] || 
                row.budget;
            
            // If not found, try case-insensitive search through all keys
            if (!budgetNameRaw) {
                const budgetKey = Object.keys(row).find(key => {
                    if (!key) return false;
                    const normalized = String(key).toLowerCase().trim();
                    return normalized === 'budgetname' || 
                           normalized === 'budget name' || 
                           normalized === 'budget';
                });
                if (budgetKey) budgetNameRaw = row[budgetKey];
            }
            
            if (index === 0 && budgetNameRaw) {
                console.log(`Budget name found in row ${index}:`, {
                    raw: budgetNameRaw,
                    type: typeof budgetNameRaw,
                    keys: Object.keys(row).filter(k => k && k.toLowerCase().includes('budget'))
                });
            }
            
            const budgetName = normalizeStr(budgetNameRaw);
            
            // Skip rows that have neither project name nor budget name
            if ((!projectName || projectName.length < 3) && !budgetName) {
                if (index < 3) {
                    console.log(`Skipping row ${index}: no project name (min 3 chars) or budget name`);
                }
                return; // Skip this row
            }
            
            // Track project names for duplicate detection (case-insensitive)
            if (projectName && projectName.length >= 3) {
                const normalizedProjectName = normalizeStr(projectName).toLowerCase();
                if (!projectNameMap.has(normalizedProjectName)) {
                    projectNameMap.set(normalizedProjectName, []);
                }
                projectNameMap.get(normalizedProjectName).push({
                    rowNumber: index + 2, // Excel row number (1-indexed header + row index)
                    projectName: projectName,
                    budgetName: budgetName || 'N/A'
                });
                
                // Mark as duplicate if we've seen it before
                if (projectNameMap.get(normalizedProjectName).length > 1) {
                    duplicateProjectNames.add(normalizedProjectName);
                }
            }
            
            // Extract department from multiple possible column names (including 'Department' with capital D)
            const department = normalizeStr(
                row.department || 
                row.Department || 
                row['Department'] ||
                row.dbDepartment || 
                row['db_department']
            );
            
            if (index === 0) {
                console.log(`Row ${index} extracted values:`, {
                    projectName,
                    budgetName,
                    department,
                    departmentRaw: row.department || row.Department || row['Department'],
                    ward: row.ward || row.Ward || row.dbWard || row['db_ward'],
                    subcounty: row.subcounty || row.Subcounty || row.dbSubcounty || row['db_subcounty'] || row['sub-county'] || row['Sub County'],
                    finYear: row.finYear || row['fin_year'] || row.financialYear,
                    allRowKeys: Object.keys(row)  // Log all available keys for debugging
                });
            }
            
            // Try multiple variations of ward column names (case-insensitive matching)
            let ward = null;
            // First try exact matches
            ward = row.dbWard || row['db_ward'] || row.db_ward || row.ward || row.Ward || row['Ward'] || row['ward'];
            
            // If not found, search through all keys case-insensitively
            if (!ward) {
                const wardKey = Object.keys(row).find(key => {
                    if (!key) return false;
                    const normalized = String(key).toLowerCase().trim();
                    return normalized === 'ward' || normalized === 'db_ward';
                });
                if (wardKey) ward = row[wardKey];
            }
            ward = normalizeStr(ward);
            
            // Try multiple variations of subcounty column names (case-insensitive matching)
            let subcounty = null;
            // First try exact matches
            subcounty = row.dbSubcounty || row['db_subcounty'] || row.db_subcounty || 
                       row['sub-county'] || row['Sub County'] || row.SubCounty || 
                       row.Subcounty || row.subcounty;
            
            // If not found, search through all keys case-insensitively
            if (!subcounty) {
                const subcountyKey = Object.keys(row).find(key => {
                    if (!key) return false;
                    const normalized = String(key).toLowerCase().trim().replace(/[-\s]/g, '');
                    return normalized === 'subcounty' || normalized === 'db_subcounty' || 
                           normalized === 'subcounty' || normalized.includes('subcounty');
                });
                if (subcountyKey) subcounty = row[subcountyKey];
            }
            subcounty = normalizeStr(subcounty);
            
            // Log extraction for first few rows
            if (index < 5) {
                console.log(`Row ${index} metadata extraction:`, {
                    ward: ward || 'NOT FOUND',
                    wardType: typeof ward,
                    wardValue: ward,
                    subcounty: subcounty || 'NOT FOUND',
                    subcountyType: typeof subcounty,
                    subcountyValue: subcounty,
                    wardRaw: row.dbWard || row['db_ward'] || row.ward || row.Ward || 'N/A',
                    wardRawType: typeof (row.dbWard || row['db_ward'] || row.ward || row.Ward),
                    subcountyRaw: row.dbSubcounty || row['db_subcounty'] || row['sub-county'] || row.Subcounty || 'N/A',
                    subcountyRawType: typeof (row.dbSubcounty || row['db_subcounty'] || row['sub-county'] || row.Subcounty),
                    allKeys: Object.keys(row),
                    wardKeys: Object.keys(row).filter(k => k && (k.toLowerCase().includes('ward') || k.toLowerCase().includes('subcounty') || k.toLowerCase().includes('sub-county') || k.toLowerCase().includes('subcounty'))),
                    rowSample: JSON.stringify(row).substring(0, 500)
                });
            }
            // Check for financial year in the row data (from file columns only, not from existing budgets)
            const finYear = normalizeStr(
                row.financialYear || 
                row.FinancialYear || 
                row['Financial Year'] || 
                row.finYear || 
                row['fin_year'] ||
                row.finYear
            );

            if (budgetName) uniqueBudgets.add(budgetName);
            if (department) uniqueDepartments.add(department);
            if (ward && ward !== 'unknown' && ward !== 'CountyWide' && ward.trim() !== '') {
                uniqueWards.add(ward);
                if (index < 3) console.log(`  Added ward to unique set: "${ward}"`);
            }
            if (subcounty && subcounty !== 'unknown' && subcounty !== 'CountyWide' && subcounty.trim() !== '') {
                uniqueSubcounties.add(subcounty);
                if (index < 3) console.log(`  Added subcounty to unique set: "${subcounty}"`);
            }
            if (finYear) uniqueFinancialYears.add(finYear);
        });

        // Build duplicate project names list
        duplicateProjectNames.forEach(normalizedName => {
            const occurrences = projectNameMap.get(normalizedName);
            if (occurrences && occurrences.length > 1) {
                mappingSummary.duplicateProjectNames.push({
                    projectName: occurrences[0].projectName, // Use first occurrence's original casing
                    occurrences: occurrences.length,
                    rows: occurrences.map(occ => ({
                        rowNumber: occ.rowNumber,
                        budgetName: occ.budgetName
                    }))
                });
            }
        });

        // Check budgets (must exist in kemri_budgets)
        if (uniqueBudgets.size > 0) {
            const budgetList = Array.from(uniqueBudgets);
            console.log('Checking budgets:', budgetList);
            const budgetCheckStart = Date.now();
            const [budgetRows] = await connection.query(
                `SELECT budgetId, budgetName, finYearId, departmentId 
                 FROM kemri_budgets 
                 WHERE voided = 0`
            );
            const budgetCheckTime = Date.now() - budgetCheckStart;
            console.log(`Budget check query took ${budgetCheckTime}ms, fetched ${budgetRows.length} records`);
            
            if (budgetCheckTime > 2000) {
                console.warn(`⚠️ WARNING: Budget check query took ${budgetCheckTime}ms - consider adding indexes`);
            }
            
            const existingBudgets = new Set();
            const existingBudgetsMap = new Map(); // Map normalized -> original for debugging
            
            budgetRows.forEach(b => {
                if (b.budgetName) {
                    const normalized = normalizeStr(b.budgetName).toLowerCase();
                    existingBudgets.add(normalized);
                    existingBudgetsMap.set(normalized, b.budgetName);
                }
            });
            
            console.log(`Found ${existingBudgets.size} existing budgets in database`);
            if (budgetList.length <= 5) {
                console.log('Sample existing budgets (normalized):', Array.from(existingBudgets).slice(0, 10));
            }
            
            budgetList.forEach(budgetName => {
                const normalized = normalizeStr(budgetName).toLowerCase();
                console.log(`Checking budget: "${budgetName}" -> normalized: "${normalized}"`);
                
                if (existingBudgets.has(normalized)) {
                    const originalName = existingBudgetsMap.get(normalized);
                    console.log(`✓ Budget found: "${budgetName}" matches database budget: "${originalName}"`);
                    mappingSummary.budgets.existing.push(budgetName);
                } else {
                    console.log(`✗ Budget NOT found: "${budgetName}" (normalized: "${normalized}")`);
                    // Try to find similar budgets for debugging
                    const similar = Array.from(existingBudgets).filter(existing => 
                        existing.includes(normalized.substring(0, 10)) || 
                        normalized.includes(existing.substring(0, 10))
                    );
                    if (similar.length > 0) {
                        console.log(`  Similar budgets found:`, similar.slice(0, 3).map(n => existingBudgetsMap.get(n)));
                    }
                    mappingSummary.budgets.new.push(budgetName);
                }
            });

            // Note: We don't extract financial years or departments from existing budgets
            // because we only want to validate metadata that's actually in the uploaded file.
            // If a budget exists, its financial year and department are already validated.
            // We only check financial years and departments that are explicitly in the import data.
        }

        // Check financial years (with flexible matching)
        if (uniqueFinancialYears.size > 0) {
            const fyList = Array.from(uniqueFinancialYears);
            const fyCheckStart = Date.now();
            const [allFYs] = await connection.query(
                `SELECT finYearName FROM kemri_financialyears WHERE (voided IS NULL OR voided = 0)`
            );
            const fyCheckTime = Date.now() - fyCheckStart;
            console.log(`Financial year check query took ${fyCheckTime}ms, fetched ${allFYs.length} records`);
            
            const normalizeFinancialYear = (name) => {
                if (!name) return '';
                let normalized = String(name).trim().toLowerCase();
                // Remove FY or fy prefix (with optional space)
                normalized = normalized.replace(/^fy\s*/i, '');
                // Normalize all separators (space, dash) to slash
                normalized = normalized.replace(/[\s\-]/g, '/');
                // Remove any extra slashes
                normalized = normalized.replace(/\/+/g, '/');
                return normalized.trim();
            };
            
            const fyNormalizedMap = new Map();
            allFYs.forEach(fy => {
                if (fy.finYearName) {
                    const normalized = normalizeFinancialYear(fy.finYearName);
                    fyNormalizedMap.set(normalized, fy.finYearName);
                }
            });
            
            fyList.forEach(fy => {
                const normalizedFY = normalizeFinancialYear(fy);
                if (normalizedFY && fyNormalizedMap.has(normalizedFY)) {
                    mappingSummary.financialYears.existing.push(fy);
                } else {
                    mappingSummary.financialYears.new.push(fy);
                }
            });
        }

        // Check departments (by name and alias)
        if (uniqueDepartments.size > 0) {
            const deptList = Array.from(uniqueDepartments);
            const deptCheckStart = Date.now();
            const [allDepts] = await connection.query(
                `SELECT name, alias FROM kemri_departments 
                 WHERE (voided IS NULL OR voided = 0)`
            );
            const deptCheckTime = Date.now() - deptCheckStart;
            console.log(`Department check query took ${deptCheckTime}ms, fetched ${allDepts.length} records`);
            const existingNames = new Set();
            const existingAliases = new Set();
            
            allDepts.forEach(d => {
                if (d.name) existingNames.add(normalizeStr(d.name).toLowerCase());
                if (d.alias) {
                    const normalizedAlias = normalizeAlias(d.alias);
                    existingAliases.add(normalizedAlias);
                    const aliases = d.alias.split(',').map(a => normalizeStr(a).toLowerCase());
                    aliases.forEach(a => existingAliases.add(a));
                    const fullAlias = normalizeStr(d.alias).toLowerCase();
                    existingAliases.add(fullAlias);
                }
            });
            
            deptList.forEach(dept => {
                const normalizedDept = normalizeStr(dept).toLowerCase();
                const normalizedDeptAlias = normalizeAlias(dept);
                let found = false;
                
                if (existingNames.has(normalizedDept)) {
                    mappingSummary.departments.existing.push(dept);
                    found = true;
                }
                
                if (!found && (existingAliases.has(normalizedDept) || existingAliases.has(normalizedDeptAlias))) {
                    mappingSummary.departments.existing.push(dept);
                    found = true;
                }
                
                if (!found) {
                    mappingSummary.departments.new.push(dept);
                }
            });
        }

        // Check wards (case-insensitive matching)
        console.log(`Checking ${uniqueWards.size} unique wards:`, Array.from(uniqueWards));
        if (uniqueWards.size > 0) {
            const wardList = Array.from(uniqueWards);
            const wardCheckStart = Date.now();
            const [allWards] = await connection.query(
                `SELECT name FROM kemri_wards WHERE (voided IS NULL OR voided = 0)`
            );
            const wardCheckTime = Date.now() - wardCheckStart;
            console.log(`Ward check query took ${wardCheckTime}ms, fetched ${allWards.length} records`);
            
            const wardNameMap = new Map();
            const wardWordSetMap = new Map();
            
            allWards.forEach(w => {
                if (w.name) {
                    const normalized = normalizeStr(w.name).toLowerCase();
                    wardNameMap.set(normalized, w.name);
                    const withSlash = normalized.replace(/\s+/g, '/');
                    if (withSlash !== normalized) {
                        wardNameMap.set(withSlash, w.name);
                    }
                    const withSpace = normalized.replace(/\//g, ' ');
                    if (withSpace !== normalized) {
                        wardNameMap.set(withSpace, w.name);
                    }
                    const words = normalized.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                    if (words) {
                        wardWordSetMap.set(words, w.name);
                    }
                }
            });
            
            wardList.forEach(ward => {
                let wardName = normalizeStr(ward).toLowerCase();
                wardName = wardName.replace(/\s+ward\s*$/i, '').trim();
                
                console.log(`Checking ward: "${ward}" -> normalized: "${wardName}"`);
                
                let found = false;
                
                if (wardNameMap.has(wardName)) {
                    console.log(`  ✓ Ward found: "${ward}" matches database ward`);
                    mappingSummary.wards.existing.push(ward);
                    found = true;
                } else {
                    const withSlash = wardName.replace(/\s+/g, '/');
                    if (wardNameMap.has(withSlash)) {
                        console.log(`  ✓ Ward found (with slash): "${ward}" matches database ward`);
                        mappingSummary.wards.existing.push(ward);
                        found = true;
                    } else {
                        const withSpace = wardName.replace(/\//g, ' ');
                        if (wardNameMap.has(withSpace)) {
                            console.log(`  ✓ Ward found (with space): "${ward}" matches database ward`);
                            mappingSummary.wards.existing.push(ward);
                            found = true;
                        } else {
                            const words = wardName.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                            if (words && wardWordSetMap.has(words)) {
                                console.log(`  ✓ Ward found (word-order): "${ward}" matches database ward`);
                                mappingSummary.wards.existing.push(ward);
                                found = true;
                            }
                        }
                    }
                }
                
                if (!found) {
                    console.log(`  ✗ Ward NOT found: "${ward}" (normalized: "${wardName}")`);
                    mappingSummary.wards.new.push(ward);
                }
            });
        }

        // Check subcounties (case-insensitive matching)
        console.log(`Checking ${uniqueSubcounties.size} unique subcounties:`, Array.from(uniqueSubcounties));
        if (uniqueSubcounties.size > 0) {
            const subcountyList = Array.from(uniqueSubcounties);
            const subcountyCheckStart = Date.now();
            const [allSubcounties] = await connection.query(
                `SELECT name FROM kemri_subcounties WHERE (voided IS NULL OR voided = 0)`
            );
            const subcountyCheckTime = Date.now() - subcountyCheckStart;
            console.log(`Subcounty check query took ${subcountyCheckTime}ms, fetched ${allSubcounties.length} records`);
            
            const subcountyNameMap = new Map();
            const subcountyWordSetMap = new Map();
            
            allSubcounties.forEach(s => {
                if (s.name) {
                    const normalized = normalizeStr(s.name).toLowerCase();
                    subcountyNameMap.set(normalized, s.name);
                    const withSlash = normalized.replace(/\s+/g, '/');
                    if (withSlash !== normalized) {
                        subcountyNameMap.set(withSlash, s.name);
                    }
                    const withSpace = normalized.replace(/\//g, ' ');
                    if (withSpace !== normalized) {
                        subcountyNameMap.set(withSpace, s.name);
                    }
                    const words = normalized.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                    if (words) {
                        subcountyWordSetMap.set(words, s.name);
                    }
                }
            });
            
            subcountyList.forEach(subcounty => {
                let subcountyName = normalizeStr(subcounty).toLowerCase();
                subcountyName = subcountyName.replace(/\s+sc\s*$/i, '').trim();
                subcountyName = subcountyName.replace(/\s+subcounty\s*$/i, '').trim();
                subcountyName = subcountyName.replace(/\s+sub\s+county\s*$/i, '').trim();
                
                console.log(`Checking subcounty: "${subcounty}" -> normalized: "${subcountyName}"`);
                
                let found = false;
                
                if (subcountyNameMap.has(subcountyName)) {
                    console.log(`  ✓ Subcounty found: "${subcounty}" matches database subcounty`);
                    mappingSummary.subcounties.existing.push(subcounty);
                    found = true;
                } else {
                    const withSlash = subcountyName.replace(/\s+/g, '/');
                    if (subcountyNameMap.has(withSlash)) {
                        console.log(`  ✓ Subcounty found (with slash): "${subcounty}" matches database subcounty`);
                        mappingSummary.subcounties.existing.push(subcounty);
                        found = true;
                    } else {
                        const withSpace = subcountyName.replace(/\//g, ' ');
                        if (subcountyNameMap.has(withSpace)) {
                            console.log(`  ✓ Subcounty found (with space): "${subcounty}" matches database subcounty`);
                            mappingSummary.subcounties.existing.push(subcounty);
                            found = true;
                        } else {
                            const words = subcountyName.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                            if (words && subcountyWordSetMap.has(words)) {
                                console.log(`  ✓ Subcounty found (word-order): "${subcounty}" matches database subcounty`);
                                mappingSummary.subcounties.existing.push(subcounty);
                                found = true;
                            }
                        }
                    }
                }
                
                if (!found) {
                    console.log(`  ✗ Subcounty NOT found: "${subcounty}" (normalized: "${subcountyName}")`);
                    mappingSummary.subcounties.new.push(subcounty);
                }
            });
        }

        // Identify rows with unmatched metadata (for warnings)
        dataToImport.forEach((row, index) => {
            const projectName = (row.projectName || row['Project Name'] || '').toString().trim();
            // Check for budget in multiple possible column names
            const budgetName = normalizeStr(
                row.budgetName || 
                row['BudgetName'] || 
                row['Budget Name'] || 
                row['Budget'] || 
                row.budget
            );
            
            // Skip rows that have neither project name nor budget name
            if ((!projectName || projectName.length < 3) && !budgetName) {
                return;
            }
            
            const department = normalizeStr(row.department || row.Department || row.dbDepartment || row['db_department']);
            const ward = normalizeStr(row.dbWard || row['db_ward'] || row.ward || row.Ward);
            // Check for subcounty in multiple possible column names (matching project import pattern)
            const subcounty = normalizeStr(
                row.dbSubcounty || 
                row['db_subcounty'] || 
                row['sub-county'] || 
                row.SubCounty || 
                row['Sub County'] || 
                row.Subcounty ||
                row.subcounty
            );
            const finYear = normalizeStr(row.financialYear || row.FinancialYear || row['Financial Year'] || row.finYear || row['fin_year']);
            
            const unmatched = [];
            if (budgetName && !mappingSummary.budgets.existing.includes(budgetName) && !mappingSummary.budgets.new.includes(budgetName)) {
                unmatched.push(`Budget: ${budgetName}`);
            }
            if (department && !mappingSummary.departments.existing.includes(department) && !mappingSummary.departments.new.includes(department)) {
                unmatched.push(`Department: ${department}`);
            }
            if (ward && ward !== 'unknown' && ward !== 'CountyWide' && !mappingSummary.wards.existing.includes(ward) && !mappingSummary.wards.new.includes(ward)) {
                unmatched.push(`Ward: ${ward}`);
            }
            if (subcounty && subcounty !== 'unknown' && subcounty !== 'CountyWide' && !mappingSummary.subcounties.existing.includes(subcounty) && !mappingSummary.subcounties.new.includes(subcounty)) {
                unmatched.push(`Subcounty: ${subcounty}`);
            }
            if (finYear && !mappingSummary.financialYears.existing.includes(finYear) && !mappingSummary.financialYears.new.includes(finYear)) {
                unmatched.push(`Financial Year: ${finYear}`);
            }
            
            if (unmatched.length > 0) {
                mappingSummary.rowsWithUnmatchedMetadata.push({
                    rowNumber: index + 2,
                    projectName: projectName || `Row ${index + 2}`,
                    unmatched: unmatched
                });
            }
        });

        const overallTime = Date.now() - overallStart;
        console.log(`Metadata mapping check completed successfully in ${overallTime}ms`);
        console.log('Mapping summary:', {
            budgets: {
                existing: mappingSummary.budgets.existing.length,
                new: mappingSummary.budgets.new.length,
                unmatched: mappingSummary.budgets.unmatched.length
            },
            financialYears: {
                existing: mappingSummary.financialYears.existing.length,
                new: mappingSummary.financialYears.new.length
            },
            departments: {
                existing: mappingSummary.departments.existing.length,
                new: mappingSummary.departments.new.length
            },
            wards: {
                existing: mappingSummary.wards.existing.length,
                new: mappingSummary.wards.new.length
            },
            subcounties: {
                existing: mappingSummary.subcounties.existing.length,
                new: mappingSummary.subcounties.new.length
            },
            duplicateProjectNames: mappingSummary.duplicateProjectNames.length,
            rowsWithUnmatchedMetadata: mappingSummary.rowsWithUnmatchedMetadata.length
        });
        
        if (overallTime > 5000) {
            console.warn(`⚠️ WARNING: Metadata check took ${overallTime}ms - this is slow and may cause timeouts`);
        }
        
        return res.status(200).json({
            success: true,
            message: 'Metadata mapping check completed',
            mappingSummary
        });
    } catch (err) {
        console.error('Budget metadata mapping check error:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to check metadata mappings',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } finally {
        if (connection) {
            connection.release();
            console.log('Database connection released');
        }
    }
});

/**
 * @route GET /api/budgets/template
 * @description Download budget import template
 * @access Private
 */
router.get('/template', async (req, res) => {
    try {
        const templatePath = path.resolve(__dirname, '..', 'templates', 'budget_import_template.xlsx');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ message: 'Budget template not found on server' });
        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="budget_import_template.xlsx"');
        return res.sendFile(templatePath);
    } catch (err) {
        console.error('Error serving budget template:', err);
        return res.status(500).json({ message: 'Failed to serve budget template' });
    }
});

module.exports = router;


