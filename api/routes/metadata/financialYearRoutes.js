// src/routes/metadata/financialYearRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../../config/db'); // Correct path for the new folder structure

// --- Financial Years CRUD ---

/**
 * @route GET /api/metadata/financialyears/
 * @description Get all financial years that are not soft-deleted.
 * @access Public (can be protected by middleware)
 */
router.get('/', async (req, res) => {
    try {
        // Only return financial years where voided = 0 (exclude NULL and 1)
        const [rows] = await pool.query('SELECT finYearId, finYearName, startDate, endDate, createdAt, updatedAt, userId FROM kemri_financialyears WHERE voided = 0 ORDER BY finYearName DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching financial years:', error);
        res.status(500).json({ message: 'Error fetching financial years', error: error.message });
    }
});

/**
 * @route GET /api/metadata/financialyears/:finYearId
 * @description Get a specific financial year by ID (including voided ones, for editing projects that reference them)
 * @access Public (can be protected by middleware)
 */
router.get('/:finYearId', async (req, res) => {
    const { finYearId } = req.params;
    if (isNaN(parseInt(finYearId))) {
        return res.status(400).json({ message: 'Invalid financial year ID' });
    }
    try {
        // Get financial year even if voided (projects might reference voided financial years)
        const [rows] = await pool.query(
            'SELECT finYearId, finYearName, startDate, endDate, createdAt, updatedAt, userId, voided FROM kemri_financialyears WHERE finYearId = ?',
            [finYearId]
        );
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Financial year not found' });
        }
    } catch (error) {
        console.error('Error fetching financial year:', error);
        res.status(500).json({ message: 'Error fetching financial year', error: error.message });
    }
});

/**
 * @route POST /api/metadata/financialyears/
 * @description Create a new financial year.
 * @access Private (requires authentication and privilege)
 */
router.post('/', async (req, res) => {
    // TODO: Get userId from authenticated user (e.g., req.user.userId)
    const userId = 1; // Placeholder for now
    const { finYearName, startDate, endDate, remarks } = req.body;

    if (!finYearName || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing required fields: finYearName, startDate, endDate' });
    }

    try {
        // Check if financial year with this name already exists (including voided ones)
        const [existing] = await pool.query(
            'SELECT finYearId, finYearName, voided FROM kemri_financialyears WHERE finYearName = ?',
            [finYearName]
        );

        if (existing.length > 0) {
            const existingRecord = existing[0];
            if (existingRecord.voided === 0 || existingRecord.voided === null) {
                return res.status(409).json({ 
                    message: `Financial year "${finYearName}" already exists. Please use a different name.` 
                });
            } else {
                // If voided, we could restore it, but for now, return error
                return res.status(409).json({ 
                    message: `Financial year "${finYearName}" already exists (voided). Please use a different name or restore the existing record.` 
                });
            }
        }

        // Insert new financial year - explicitly set voided = 0
        const [result] = await pool.query(
            'INSERT INTO kemri_financialyears (finYearName, startDate, endDate, remarks, userId, voided) VALUES (?, ?, ?, ?, ?, 0)',
            [finYearName, startDate, endDate, remarks, userId]
        );
        res.status(201).json({ message: 'Financial year created successfully', finYearId: result.insertId });
    } catch (error) {
        console.error('Error creating financial year:', error);
        
        // Handle duplicate key error (in case unique constraint exists)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                message: `Financial year "${finYearName}" already exists. Please use a different name.` 
            });
        }
        
        res.status(500).json({ message: 'Error creating financial year', error: error.message });
    }
});

/**
 * @route PUT /api/metadata/financialyears/:finYearId
 * @description Update an existing financial year by finYearId.
 * @access Private (requires authentication and privilege)
 */
router.put('/:finYearId', async (req, res) => {
    const { finYearId } = req.params;
    const { finYearName, startDate, endDate, remarks } = req.body;

    try {
        // Check if another financial year with this name already exists (excluding current record)
        if (finYearName) {
            const [existing] = await pool.query(
                'SELECT finYearId, finYearName, voided FROM kemri_financialyears WHERE finYearName = ? AND finYearId != ?',
                [finYearName, finYearId]
            );

            if (existing.length > 0) {
                const existingRecord = existing[0];
                if (existingRecord.voided === 0 || existingRecord.voided === null) {
                    return res.status(409).json({ 
                        message: `Financial year "${finYearName}" already exists. Please use a different name.` 
                    });
                }
            }
        }

        // Update financial year - explicitly ensure voided = 0 (in case it was NULL)
        const [result] = await pool.query(
            'UPDATE kemri_financialyears SET finYearName = ?, startDate = ?, endDate = ?, remarks = ?, voided = 0, updatedAt = CURRENT_TIMESTAMP WHERE finYearId = ? AND (voided = 0 OR voided IS NULL)',
            [finYearName, startDate, endDate, remarks, finYearId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Financial year not found or already deleted' });
        }
        res.status(200).json({ message: 'Financial year updated successfully' });
    } catch (error) {
        console.error('Error updating financial year:', error);
        
        // Handle duplicate key error (in case unique constraint exists)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ 
                message: `Financial year "${finYearName}" already exists. Please use a different name.` 
            });
        }
        
        res.status(500).json({ message: 'Error updating financial year', error: error.message });
    }
});

/**
 * @route DELETE /api/metadata/financialyears/:finYearId
 * @description Soft delete a financial year by finYearId.
 * @access Private (requires authentication and privilege)
 */
router.delete('/:finYearId', async (req, res) => {
    const { finYearId } = req.params;
    // TODO: Get userId from authenticated user (e.g., req.user.userId)
    const userId = 1; // Placeholder for now

    try {
        const [result] = await pool.query(
            'UPDATE kemri_financialyears SET voided = 1, voidedBy = ? WHERE finYearId = ? AND voided = 0',
            [userId, finYearId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Financial year not found or already deleted' });
        }
        res.status(200).json({ message: 'Financial year soft-deleted successfully' });
    } catch (error) {
        console.error('Error deleting financial year:', error);
        res.status(500).json({ message: 'Error deleting financial year', error: error.message });
    }
});

module.exports = router;