const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authenticate');
const privilege = require('../middleware/privilegeMiddleware');

// ==================== PROJECT ANNOUNCEMENTS MANAGEMENT ====================

/**
 * @route GET /api/project-announcements
 * @description Get all project announcements (admin view)
 * @access Protected
 */
router.get('/', auth, privilege(['project_announcements.read']), async (req, res) => {
    try {
        const { category, status, page = 1, limit = 20, search } = req.query;
        
        let whereConditions = ['voided = 0'];
        const queryParams = [];
        
        if (category && category !== 'All') {
            whereConditions.push('category = ?');
            queryParams.push(category);
        }
        
        if (status && status !== 'All') {
            whereConditions.push('status = ?');
            queryParams.push(status);
        }
        
        if (search) {
            whereConditions.push('(title LIKE ? OR description LIKE ? OR content LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM project_announcements WHERE ${whereClause}`;
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;
        
        // Get announcements
        const query = `
            SELECT 
                id,
                title,
                description,
                content,
                category,
                type,
                date,
                time,
                location,
                organizer,
                status,
                priority,
                image_url,
                attendees,
                max_attendees,
                created_by,
                created_at,
                updated_at
            FROM project_announcements
            WHERE ${whereClause}
            ORDER BY date DESC, time DESC
            LIMIT ? OFFSET ?
        `;
        
        queryParams.push(parseInt(limit), offset);
        const [announcements] = await pool.query(query, queryParams);
        
        res.json({
            announcements,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ 
            error: 'Failed to fetch announcements',
            details: error.message
        });
    }
});

/**
 * @route GET /api/project-announcements/:id
 * @description Get a specific announcement by ID
 * @access Protected
 */
router.get('/:id', auth, privilege(['project_announcements.read']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                id,
                title,
                description,
                content,
                category,
                type,
                date,
                time,
                location,
                organizer,
                status,
                priority,
                image_url,
                attendees,
                max_attendees,
                created_by,
                created_at,
                updated_at
            FROM project_announcements
            WHERE id = ? AND voided = 0
        `;
        
        const [announcements] = await pool.query(query, [id]);
        
        if (announcements.length === 0) {
            return res.status(404).json({ error: 'Announcement not found' });
        }
        
        res.json(announcements[0]);
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ 
            error: 'Failed to fetch announcement',
            details: error.message
        });
    }
});

/**
 * @route POST /api/project-announcements
 * @description Create a new project announcement
 * @access Protected
 */
router.post('/', auth, privilege(['project_announcements.create']), async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            category,
            type,
            date,
            time,
            location,
            organizer,
            status,
            priority,
            imageUrl,
            attendees,
            maxAttendees
        } = req.body;
        
        const userId = req.user?.id || req.user?.userId;
        
        if (!title || !description || !content || !category || !type || 
            !date || !time || !location || !organizer) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const query = `
            INSERT INTO project_announcements (
                title, description, content, category, type,
                date, time, location, organizer, status, priority,
                image_url, attendees, max_attendees, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.query(query, [
            title, description, content, category, type,
            date, time, location, organizer,
            status || 'Upcoming', priority || 'Medium',
            imageUrl || null, attendees || 0, maxAttendees || 0,
            userId
        ]);
        
        res.status(201).json({
            message: 'Announcement created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ 
            error: 'Failed to create announcement',
            details: error.message
        });
    }
});

/**
 * @route PUT /api/project-announcements/:id
 * @description Update a project announcement
 * @access Protected
 */
router.put('/:id', auth, privilege(['project_announcements.update']), async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            content,
            category,
            type,
            date,
            time,
            location,
            organizer,
            status,
            priority,
            imageUrl,
            attendees,
            maxAttendees
        } = req.body;
        
        // Build update query dynamically
        const updates = [];
        const values = [];
        
        if (title !== undefined) { updates.push('title = ?'); values.push(title); }
        if (description !== undefined) { updates.push('description = ?'); values.push(description); }
        if (content !== undefined) { updates.push('content = ?'); values.push(content); }
        if (category !== undefined) { updates.push('category = ?'); values.push(category); }
        if (type !== undefined) { updates.push('type = ?'); values.push(type); }
        if (date !== undefined) { updates.push('date = ?'); values.push(date); }
        if (time !== undefined) { updates.push('time = ?'); values.push(time); }
        if (location !== undefined) { updates.push('location = ?'); values.push(location); }
        if (organizer !== undefined) { updates.push('organizer = ?'); values.push(organizer); }
        if (status !== undefined) { updates.push('status = ?'); values.push(status); }
        if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
        if (imageUrl !== undefined) { updates.push('image_url = ?'); values.push(imageUrl); }
        if (attendees !== undefined) { updates.push('attendees = ?'); values.push(attendees); }
        if (maxAttendees !== undefined) { updates.push('max_attendees = ?'); values.push(maxAttendees); }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(id);
        
        const query = `
            UPDATE project_announcements 
            SET ${updates.join(', ')}
            WHERE id = ? AND voided = 0
        `;
        
        await pool.query(query, values);
        
        res.json({ message: 'Announcement updated successfully' });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ 
            error: 'Failed to update announcement',
            details: error.message
        });
    }
});

/**
 * @route DELETE /api/project-announcements/:id
 * @description Soft delete a project announcement
 * @access Protected
 */
router.delete('/:id', auth, privilege(['project_announcements.delete']), async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'UPDATE project_announcements SET voided = 1 WHERE id = ?';
        await pool.query(query, [id]);
        
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ 
            error: 'Failed to delete announcement',
            details: error.message
        });
    }
});

module.exports = router;

