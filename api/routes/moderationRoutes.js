const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/authenticate');

// ==================== MODERATION MANAGEMENT ====================

/**
 * @route GET /api/moderate/queue
 * @description Get public feedback items pending moderation
 * @access Protected (Admin/Moderator)
 */
router.get('/queue', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, moderation_status = 'pending' } = req.query;
        const offset = (page - 1) * limit;

        // Build where condition based on moderation_status parameter
        let whereCondition = 'WHERE moderation_status = ?';
        const queryParams = [moderation_status];

        // Get total count of feedback with specified moderation status
        const countQuery = `
            SELECT COUNT(*) as total
            FROM public_feedback
            ${whereCondition}
        `;
        const [countResult] = await pool.query(countQuery, queryParams);
        const totalItems = countResult[0].total;

        // Get paginated feedback with specified moderation status
        const queueQuery = `
            SELECT 
                f.id,
                f.name,
                f.email,
                f.phone,
                f.subject,
                f.message,
                f.project_id,
                f.status,
                f.created_at,
                f.moderation_status,
                f.moderation_reason,
                f.custom_reason,
                f.moderator_notes,
                f.moderated_at,
                f.rating_overall_support,
                f.rating_quality_of_life_impact,
                f.rating_community_alignment,
                f.rating_transparency,
                f.rating_feasibility_confidence,
                p.projectName as project_name,
                CONCAT(u.firstName, ' ', u.lastName) as moderator_name
            FROM public_feedback f
            LEFT JOIN kemri_projects p ON f.project_id = p.id
            LEFT JOIN kemri_users u ON f.moderated_by = u.userId
            ${whereCondition}
            ORDER BY f.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        const [items] = await pool.query(queueQuery, [...queryParams, parseInt(limit), offset]);

        res.json({
            success: true,
            items,
            pagination: {
                total: totalItems,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalItems / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching moderation queue:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch moderation queue' 
        });
    }
});

/**
 * @route GET /api/moderate/statistics
 * @description Get moderation statistics
 * @access Protected (Admin/Moderator)
 */
router.get('/statistics', auth, async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_feedback,
                SUM(CASE WHEN moderation_status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN moderation_status = 'approved' THEN 1 ELSE 0 END) as approved_count,
                SUM(CASE WHEN moderation_status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
                SUM(CASE WHEN moderation_status = 'flagged' THEN 1 ELSE 0 END) as flagged_count
            FROM public_feedback
        `;
        const [stats] = await pool.query(statsQuery);

        // Get moderation reasons breakdown
        const reasonsQuery = `
            SELECT 
                moderation_reason,
                COUNT(*) as count
            FROM public_feedback
            WHERE moderation_reason IS NOT NULL
            GROUP BY moderation_reason
            ORDER BY count DESC
        `;
        const [reasons] = await pool.query(reasonsQuery);

        // Get recent moderation activity
        const activityQuery = `
            SELECT 
                f.id,
                f.name,
                f.subject,
                f.moderation_status,
                f.moderation_reason,
                f.moderated_at,
                CONCAT(u.firstName, ' ', u.lastName) as moderator_name
            FROM public_feedback f
            LEFT JOIN kemri_users u ON f.moderated_by = u.userId
            WHERE f.moderated_at IS NOT NULL
            ORDER BY f.moderated_at DESC
            LIMIT 10
        `;
        const [recentActivity] = await pool.query(activityQuery);

        res.json({
            success: true,
            statistics: stats[0],
            reasonsBreakdown: reasons,
            recentActivity
        });
    } catch (error) {
        console.error('Error fetching moderation statistics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch moderation statistics' 
        });
    }
});

/**
 * @route GET /api/moderate/analytics
 * @description Get comprehensive moderation analytics
 * @access Protected (Admin/Moderator)
 */
router.get('/analytics', auth, async (req, res) => {
    try {
        // Get moderation trends over time (last 30 days)
        const trendsQuery = `
            SELECT 
                DATE(moderated_at) as date,
                COUNT(CASE WHEN moderation_status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN moderation_status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN moderation_status = 'flagged' THEN 1 END) as flagged,
                COUNT(*) as total_moderated
            FROM public_feedback 
            WHERE moderated_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(moderated_at)
            ORDER BY date DESC
        `;

        // Get moderator activity
        const moderatorQuery = `
            SELECT 
                CONCAT(u.firstName, ' ', u.lastName) as moderator_name,
                COUNT(*) as total_moderated,
                COUNT(CASE WHEN f.moderation_status = 'approved' THEN 1 END) as approved_count,
                COUNT(CASE WHEN f.moderation_status = 'rejected' THEN 1 END) as rejected_count,
                COUNT(CASE WHEN f.moderation_status = 'flagged' THEN 1 END) as flagged_count,
                ROUND(AVG(TIMESTAMPDIFF(MINUTE, f.created_at, f.moderated_at)), 2) as avg_response_time_minutes
            FROM public_feedback f
            JOIN kemri_users u ON f.moderated_by = u.userId
            WHERE f.moderated_at IS NOT NULL
            GROUP BY f.moderated_by, u.firstName, u.lastName
            ORDER BY total_moderated DESC
        `;

        // Get feedback volume trends
        const volumeQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_submitted,
                COUNT(CASE WHEN moderation_status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN moderation_status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN moderation_status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN moderation_status = 'flagged' THEN 1 END) as flagged
            FROM public_feedback 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;

        // Get average ratings by moderation status
        const ratingsQuery = `
            SELECT 
                moderation_status,
                ROUND(AVG(rating_overall_support), 2) as avg_overall_support,
                ROUND(AVG(rating_quality_of_life_impact), 2) as avg_quality_impact,
                ROUND(AVG(rating_community_alignment), 2) as avg_community_alignment,
                ROUND(AVG(rating_transparency), 2) as avg_transparency,
                ROUND(AVG(rating_feasibility_confidence), 2) as avg_feasibility_confidence,
                COUNT(*) as count
            FROM public_feedback 
            WHERE moderation_status IS NOT NULL
            GROUP BY moderation_status
        `;

        // Get response time statistics
        const responseTimeQuery = `
            SELECT 
                AVG(TIMESTAMPDIFF(HOUR, created_at, moderated_at)) as avg_response_hours,
                MIN(TIMESTAMPDIFF(HOUR, created_at, moderated_at)) as min_response_hours,
                MAX(TIMESTAMPDIFF(HOUR, created_at, moderated_at)) as max_response_hours,
                COUNT(*) as total_moderated
            FROM public_feedback 
            WHERE moderated_at IS NOT NULL
        `;

        // Get moderation reason breakdown with percentages
        const reasonQuery = `
            SELECT 
                moderation_reason,
                COUNT(*) as count,
                ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public_feedback WHERE moderation_reason IS NOT NULL)), 2) as percentage
            FROM public_feedback 
            WHERE moderation_reason IS NOT NULL
            GROUP BY moderation_reason
            ORDER BY count DESC
        `;

        // Get hourly moderation patterns
        const hourlyQuery = `
            SELECT 
                HOUR(moderated_at) as hour,
                COUNT(*) as moderation_count
            FROM public_feedback 
            WHERE moderated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY HOUR(moderated_at)
            ORDER BY hour
        `;

        const [trendsResults] = await pool.query(trendsQuery);
        const [moderatorResults] = await pool.query(moderatorQuery);
        const [volumeResults] = await pool.query(volumeQuery);
        const [ratingsResults] = await pool.query(ratingsQuery);
        const [responseTimeResults] = await pool.query(responseTimeQuery);
        const [reasonResults] = await pool.query(reasonQuery);
        const [hourlyResults] = await pool.query(hourlyQuery);

        res.json({
            success: true,
            analytics: {
                moderationTrends: trendsResults,
                moderatorActivity: moderatorResults,
                volumeTrends: volumeResults,
                ratingsByStatus: ratingsResults,
                responseTimeStats: responseTimeResults[0],
                reasonBreakdown: reasonResults,
                hourlyPatterns: hourlyResults
            }
        });
    } catch (error) {
        console.error('Error fetching moderation analytics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch moderation analytics' 
        });
    }
});

/**
 * @route POST /api/moderate/:feedbackId/approve
 * @description Approve a feedback item
 * @access Protected (Admin/Moderator)
 */
router.post('/:feedbackId/approve', auth, async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { moderator_notes } = req.body;
        const moderatorId = req.user.userId;

        // Update the public feedback moderation status
        const updateQuery = `
            UPDATE public_feedback 
            SET 
                moderation_status = 'approved',
                moderation_reason = NULL,
                custom_reason = NULL,
                moderator_notes = ?,
                moderated_by = ?,
                moderated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(updateQuery, [moderator_notes, moderatorId, feedbackId]);

        res.json({
            success: true,
            message: 'Feedback approved successfully'
        });
    } catch (error) {
        console.error('Error approving feedback:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to approve feedback' 
        });
    }
});

/**
 * @route POST /api/moderate/:feedbackId/reject
 * @description Reject a feedback item
 * @access Protected (Admin/Moderator)
 */
router.post('/:feedbackId/reject', auth, async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { moderation_reason, custom_reason, moderator_notes } = req.body;
        const moderatorId = req.user.userId;

        // Validate required fields
        if (!moderation_reason) {
            return res.status(400).json({
                success: false,
                error: 'Moderation reason is required'
            });
        }

        // Update the public feedback moderation status
        const updateQuery = `
            UPDATE public_feedback 
            SET 
                moderation_status = 'rejected',
                moderation_reason = ?,
                custom_reason = ?,
                moderator_notes = ?,
                moderated_by = ?,
                moderated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(updateQuery, [
            moderation_reason, 
            custom_reason, 
            moderator_notes, 
            moderatorId, 
            feedbackId
        ]);

        res.json({
            success: true,
            message: 'Feedback rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting feedback:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to reject feedback' 
        });
    }
});

/**
 * @route POST /api/moderate/:feedbackId/flag
 * @description Flag a feedback item for further review
 * @access Protected (Admin/Moderator)
 */
router.post('/:feedbackId/flag', auth, async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { moderation_reason, custom_reason, moderator_notes } = req.body;
        const moderatorId = req.user.userId;

        // Update the public feedback moderation status
        const updateQuery = `
            UPDATE public_feedback 
            SET 
                moderation_status = 'flagged',
                moderation_reason = ?,
                custom_reason = ?,
                moderator_notes = ?,
                moderated_by = ?,
                moderated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(updateQuery, [
            moderation_reason, 
            custom_reason, 
            moderator_notes, 
            moderatorId, 
            feedbackId
        ]);

        res.json({
            success: true,
            message: 'Feedback flagged successfully'
        });
    } catch (error) {
        console.error('Error flagging feedback:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to flag feedback' 
        });
    }
});

/**
 * @route GET /api/moderate/:feedbackId/details
 * @description Get detailed information about a specific feedback item
 * @access Protected (Admin/Moderator)
 */
router.get('/:feedbackId/details', auth, async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const detailsQuery = `
            SELECT 
                f.*,
                p.projectName as project_name,
                CONCAT(u.firstName, ' ', u.lastName) as moderator_name
            FROM public_feedback f
            LEFT JOIN kemri_projects p ON f.project_id = p.id
            LEFT JOIN kemri_users u ON f.moderated_by = u.userId
            WHERE f.id = ?
        `;

        const [details] = await pool.query(detailsQuery, [feedbackId]);

        if (details.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Feedback not found'
            });
        }

        res.json({
            success: true,
            feedback: details[0]
        });
    } catch (error) {
        console.error('Error fetching feedback details:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch feedback details' 
        });
    }
});

/**
 * @route GET /api/moderate/settings
 * @description Get moderation settings
 * @access Protected (Admin)
 */
router.get('/settings', auth, async (req, res) => {
    try {
        const settingsQuery = `
            SELECT setting_name, setting_value, description
            FROM feedback_moderation_settings
            ORDER BY setting_name
        `;
        const [settings] = await pool.query(settingsQuery);

        // Convert to object for easier frontend consumption
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.setting_name] = {
                value: setting.setting_value,
                description: setting.description
            };
        });

        res.json({
            success: true,
            settings: settingsObj
        });
    } catch (error) {
        console.error('Error fetching moderation settings:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch moderation settings' 
        });
    }
});

/**
 * @route PUT /api/moderate/settings
 * @description Update moderation settings
 * @access Protected (Admin)
 */
router.put('/settings', auth, async (req, res) => {
    try {
        const { settings } = req.body;

        for (const [settingName, settingData] of Object.entries(settings)) {
            const updateQuery = `
                UPDATE feedback_moderation_settings 
                SET setting_value = ?, updated_at = NOW()
                WHERE setting_name = ?
            `;
            await pool.query(updateQuery, [settingData.value, settingName]);
        }

        res.json({
            success: true,
            message: 'Settings updated successfully'
        });
    } catch (error) {
        console.error('Error updating moderation settings:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update moderation settings' 
        });
    }
});

module.exports = router;
