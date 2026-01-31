const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authenticate');
const privilege = require('../middleware/privilegeMiddleware');

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
        
        console.log('Executing query with params:', queryParams);
        console.log('Query:', query);
        const [budgets] = await pool.query(query, queryParams);
        console.log('Query executed successfully');

        console.log('Found budgets:', budgets.length);
        console.log('Total count:', total);

        res.json({
            budgets,
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
            (budgetName, budgetType, finYearId, departmentId, description, requiresApprovalForChanges, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?)
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
             (budgetId, changeType, changeReason, status, requestedBy, reviewedBy, reviewedAt)
             VALUES (?, 'Budget Approved', 'Budget approved by authorized user', 'Approved', ?, ?, NOW())`,
            [budgetId, userId, userId]
        );

        res.json({ message: 'Budget approved successfully' });
    } catch (error) {
        console.error('Error approving budget:', error);
        res.status(500).json({ message: 'Error approving budget', error: error.message });
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

module.exports = router;


