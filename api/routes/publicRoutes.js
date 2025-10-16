const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * PUBLIC DASHBOARD API ROUTES
 * These endpoints are accessible without authentication
 * Designed for public-facing dashboards similar to Makueni PMTS
 */

// ==================== QUICK STATS ====================

/**
 * @route GET /api/public/stats/overview
 * @description Get overall project statistics (total projects, budget, status breakdown)
 * @access Public
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const { finYearId, departmentId, subcountyId, wardId, search } = req.query;
        
        let whereConditions = ['p.voided = 0'];
        const queryParams = [];
        
        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (subcountyId) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM kemri_project_subcounties psc 
                WHERE psc.projectId = p.id 
                AND psc.subcountyId = ? 
                AND psc.voided = 0
            )`);
            queryParams.push(subcountyId);
        }

        if (wardId) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM kemri_project_wards pw 
                WHERE pw.projectId = p.id 
                AND pw.wardId = ? 
                AND pw.voided = 0
            )`);
            queryParams.push(wardId);
        }

        if (search) {
            whereConditions.push('p.projectName LIKE ?');
            queryParams.push(`%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        const query = `
            SELECT 
                COUNT(*) as total_projects,
                COALESCE(SUM(p.costOfProject), 0) as total_budget,
                
                -- Status breakdown
                COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completed_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Completed' THEN p.costOfProject END), 0) as completed_budget,
                
                COUNT(CASE WHEN p.status = 'Ongoing' THEN 1 END) as ongoing_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Ongoing' THEN p.costOfProject END), 0) as ongoing_budget,
                
                COUNT(CASE WHEN p.status = 'Not Started' THEN 1 END) as not_started_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Not Started' THEN p.costOfProject END), 0) as not_started_budget,
                
                COUNT(CASE WHEN p.status = 'Under Procurement' THEN 1 END) as under_procurement_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Under Procurement' THEN p.costOfProject END), 0) as under_procurement_budget,
                
                COUNT(CASE WHEN p.status = 'Stalled' THEN 1 END) as stalled_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Stalled' THEN p.costOfProject END), 0) as stalled_budget
            FROM kemri_projects p
            WHERE ${whereClause}
        `;

        const [results] = await pool.query(query, queryParams);
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching overview stats:', error);
        res.status(500).json({ error: 'Failed to fetch overview statistics' });
    }
});

// ==================== FINANCIAL YEARS ====================

/**
 * @route GET /api/public/financial-years
 * @description Get list of all financial years with project counts
 * @access Public
 */
router.get('/financial-years', async (req, res) => {
    try {
        const query = `
            SELECT 
                fy.finYearId as id,
                fy.finYearName as name,
                fy.startDate,
                fy.endDate,
                COUNT(p.id) as project_count,
                COALESCE(SUM(p.costOfProject), 0) as total_budget
            FROM kemri_financialyears fy
            LEFT JOIN kemri_projects p ON fy.finYearId = p.finYearId AND p.voided = 0
            GROUP BY fy.finYearId, fy.finYearName, fy.startDate, fy.endDate
            ORDER BY fy.startDate DESC
        `;

        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching financial years:', error);
        res.status(500).json({ error: 'Failed to fetch financial years' });
    }
});

// ==================== PROJECTS ====================

/**
 * @route GET /api/public/projects
 * @description Get list of projects with filtering (for project gallery)
 * @access Public
 */
router.get('/projects', async (req, res) => {
    try {
        const { 
            finYearId, 
            status, 
            department,
            departmentId,
            subCountyId,
            wardId,
            projectType,
            page = 1, 
            limit = 20,
            search
        } = req.query;

        let whereConditions = ['p.voided = 0'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        if (department) {
            whereConditions.push('d.name = ?');
            queryParams.push(department);
        }

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (subCountyId) {
            whereConditions.push('psc.subcountyId = ?');
            queryParams.push(subCountyId);
        }

        if (wardId) {
            whereConditions.push('pw.wardId = ?');
            queryParams.push(wardId);
        }

        if (projectType) {
            whereConditions.push('pc.categoryName = ?');
            queryParams.push(projectType);
        }

        if (search) {
            whereConditions.push('(p.projectName LIKE ? OR p.projectDescription LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;

        // Get total count
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM kemri_projects p
            LEFT JOIN kemri_departments d ON p.departmentId = d.departmentId
            LEFT JOIN kemri_categories pc ON p.categoryId = pc.categoryId
            LEFT JOIN kemri_project_subcounties psc ON p.id = psc.projectId AND psc.voided = 0
            LEFT JOIN kemri_project_wards pw ON p.id = pw.projectId AND pw.voided = 0
            WHERE ${whereClause}
        `;

        const [countResult] = await pool.query(countQuery, queryParams);
        const totalProjects = countResult[0].total;

        // Get paginated projects with geographic info
        const projectsQuery = `
            SELECT DISTINCT
                p.id,
                p.projectName as project_name,
                p.projectDescription as description,
                p.costOfProject as budget,
                p.status,
                p.startDate as start_date,
                p.endDate as end_date,
                p.overallProgress as completionPercentage,
                p.createdAt,
                d.name as department_name,
                pc.categoryName as projectType,
                fy.finYearName as financialYear,
                (SELECT GROUP_CONCAT(DISTINCT sc.name SEPARATOR ', ')
                 FROM kemri_project_subcounties psc2
                 JOIN kemri_subcounties sc ON psc2.subcountyId = sc.subcountyId
                 WHERE psc2.projectId = p.id AND psc2.voided = 0) as subcounty_name,
                (SELECT GROUP_CONCAT(DISTINCT w.name SEPARATOR ', ')
                 FROM kemri_project_wards pw2
                 JOIN kemri_wards w ON pw2.wardId = w.wardId
                 WHERE pw2.projectId = p.id AND pw2.voided = 0) as ward_name,
                (SELECT filePath FROM kemri_project_photos WHERE projectId = p.id AND voided = 0 LIMIT 1) as thumbnail
            FROM kemri_projects p
            LEFT JOIN kemri_departments d ON p.departmentId = d.departmentId
            LEFT JOIN kemri_categories pc ON p.categoryId = pc.categoryId
            LEFT JOIN kemri_financialyears fy ON p.finYearId = fy.finYearId
            LEFT JOIN kemri_project_subcounties psc ON p.id = psc.projectId AND psc.voided = 0
            LEFT JOIN kemri_project_wards pw ON p.id = pw.projectId AND pw.voided = 0
            WHERE ${whereClause}
            ORDER BY p.createdAt DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);
        const [projects] = await pool.query(projectsQuery, queryParams);

        res.json({
            projects,
            pagination: {
                total: totalProjects,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalProjects / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
});

/**
 * @route GET /api/public/projects/:id
 * @description Get detailed information about a specific project
 * @access Public
 */
router.get('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.*,
                d.name as department,
                sc.name as subCounty,
                w.name as ward,
                v.name as village,
                pc.categoryName as projectType,
                fy.name as financialYear,
                fy.startDate as fyStartDate,
                fy.endDate as fyEndDate
            FROM kemri_projects p
            LEFT JOIN kemri_departments d ON p.departmentId = d.id
            LEFT JOIN kemri_subcounties sc ON p.subCountyId = sc.id
            LEFT JOIN kemri_wards w ON p.wardId = w.id
            LEFT JOIN kemri_villages v ON p.villageId = v.id
            LEFT JOIN kemri_categories pc ON p.categoryId = pc.categoryId
            LEFT JOIN kemri_financial_years fy ON p.finYearId = fy.id
            WHERE p.id = ? AND p.voided = 0
        `;

        const [projects] = await pool.query(query, [id]);

        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get project photos
        const photosQuery = `
            SELECT photo_url, caption, uploaded_at
            FROM kemri_project_photos
            WHERE project_id = ?
            ORDER BY uploaded_at DESC
        `;
        const [photos] = await pool.query(photosQuery, [id]);

        res.json({
            project: projects[0],
            photos
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ error: 'Failed to fetch project details' });
    }
});

// ==================== DEPARTMENT STATISTICS ====================

/**
 * @route GET /api/public/stats/by-department
 * @description Get project statistics grouped by department
 * @access Public
 */
router.get('/stats/by-department', async (req, res) => {
    try {
        const { finYearId, departmentId, subcountyId, wardId, search } = req.query;
        
        let whereConditions = ['p.voided = 0'];
        const queryParams = [];
        
        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (subcountyId) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM kemri_project_subcounties psc 
                WHERE psc.projectId = p.id 
                AND psc.subcountyId = ? 
                AND psc.voided = 0
            )`);
            queryParams.push(subcountyId);
        }

        if (wardId) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM kemri_project_wards pw 
                WHERE pw.projectId = p.id 
                AND pw.wardId = ? 
                AND pw.voided = 0
            )`);
            queryParams.push(wardId);
        }

        if (search) {
            whereConditions.push('p.projectName LIKE ?');
            queryParams.push(`%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        const query = `
            SELECT 
                d.departmentId as department_id,
                d.name as department_name,
                d.alias as departmentAlias,
                COUNT(p.id) as total_projects,
                COALESCE(SUM(p.costOfProject), 0) as total_budget,
                COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completed_projects,
                COUNT(CASE WHEN p.status = 'Ongoing' THEN 1 END) as ongoing_projects,
                COUNT(CASE WHEN p.status = 'Stalled' THEN 1 END) as stalled_projects,
                COUNT(CASE WHEN p.status = 'Not Started' THEN 1 END) as not_started_projects,
                COUNT(CASE WHEN p.status = 'Under Procurement' THEN 1 END) as under_procurement_projects
            FROM kemri_departments d
            LEFT JOIN kemri_projects p ON d.departmentId = p.departmentId AND p.voided = 0
            WHERE ${whereClause}
            GROUP BY d.departmentId, d.name, d.alias
            HAVING total_projects > 0
            ORDER BY total_budget DESC
        `;

        const [results] = await pool.query(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching department stats:', error);
        res.status(500).json({ error: 'Failed to fetch department statistics' });
    }
});

// ==================== GEOGRAPHIC STATISTICS ====================

/**
 * @route GET /api/public/stats/by-subcounty
 * @description Get project statistics grouped by sub-county
 * @access Public
 */
router.get('/stats/by-subcounty', async (req, res) => {
    try {
        const { finYearId, departmentId, subcountyId, wardId, search } = req.query;
        
        let whereConditions = ['p.voided = 0'];
        const queryParams = [];
        
        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (subcountyId) {
            whereConditions.push('sc.subcountyId = ?');
            queryParams.push(subcountyId);
        }

        if (wardId) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM kemri_project_wards pw 
                WHERE pw.projectId = p.id 
                AND pw.wardId = ? 
                AND pw.voided = 0
            )`);
            queryParams.push(wardId);
        }

        if (search) {
            whereConditions.push('p.projectName LIKE ?');
            queryParams.push(`%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        const query = `
            SELECT 
                sc.subcountyId as subcounty_id,
                sc.name as subcounty_name,
                COUNT(psc.projectId) as project_count,
                COALESCE(SUM(p.costOfProject), 0) as total_budget,
                COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completed_projects,
                COUNT(CASE WHEN p.status = 'Ongoing' THEN 1 END) as ongoing_projects
            FROM kemri_subcounties sc
            LEFT JOIN kemri_project_subcounties psc ON sc.subcountyId = psc.subcountyId AND psc.voided = 0
            LEFT JOIN kemri_projects p ON psc.projectId = p.id AND p.voided = 0
            WHERE ${whereClause}
            GROUP BY sc.subcountyId, sc.name
            HAVING project_count > 0
            ORDER BY total_budget DESC
        `;

        const [results] = await pool.query(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sub-county stats:', error);
        res.status(500).json({ error: 'Failed to fetch sub-county statistics' });
    }
});

/**
 * @route GET /api/public/stats/by-ward
 * @description Get project statistics grouped by ward
 * @access Public
 */
router.get('/stats/by-ward', async (req, res) => {
    try {
        const { finYearId, departmentId, subcountyId, wardId, search } = req.query;
        
        let whereConditions = ['p.voided = 0'];
        const queryParams = [];
        
        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }

        if (subcountyId) {
            whereConditions.push('w.subcountyId = ?');
            queryParams.push(subcountyId);
        }

        if (wardId) {
            whereConditions.push('w.wardId = ?');
            queryParams.push(wardId);
        }

        if (search) {
            whereConditions.push('p.projectName LIKE ?');
            queryParams.push(`%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');

        const query = `
            SELECT 
                w.wardId as ward_id,
                w.name as ward_name,
                sc.subcountyId as subcounty_id,
                sc.name as subcounty_name,
                COUNT(pw.projectId) as project_count,
                COALESCE(SUM(p.costOfProject), 0) as total_budget,
                COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completed_count,
                COUNT(CASE WHEN p.status = 'Ongoing' THEN 1 END) as ongoing_count
            FROM kemri_wards w
            LEFT JOIN kemri_subcounties sc ON w.subcountyId = sc.subcountyId
            LEFT JOIN kemri_project_wards pw ON w.wardId = pw.wardId AND pw.voided = 0
            LEFT JOIN kemri_projects p ON pw.projectId = p.id AND p.voided = 0
            WHERE ${whereClause}
            GROUP BY w.wardId, w.name, sc.subcountyId, sc.name
            HAVING project_count > 0
            ORDER BY sc.name, total_budget DESC
        `;

        const [results] = await pool.query(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching ward stats:', error);
        res.status(500).json({ error: 'Failed to fetch ward statistics' });
    }
});

// ==================== PROJECT TYPES ====================

/**
 * @route GET /api/public/stats/by-project-type
 * @description Get project statistics grouped by project type/category
 * @access Public
 */
router.get('/stats/by-project-type', async (req, res) => {
    try {
        const { finYearId } = req.query;
        
        let whereClause = 'WHERE p.voided = 0';
        const queryParams = [];
        
        if (finYearId) {
            whereClause += ' AND p.finYearId = ?';
            queryParams.push(finYearId);
        }

        const query = `
            SELECT 
                pc.categoryId as id,
                pc.categoryName as projectType,
                COUNT(p.id) as project_count,
                COALESCE(SUM(p.costOfProject), 0) as total_budget
            FROM kemri_categories pc
            LEFT JOIN kemri_projects p ON pc.categoryId = p.categoryId AND p.voided = 0
            ${finYearId ? 'AND p.finYearId = ?' : ''}
            GROUP BY pc.categoryId, pc.categoryName
            HAVING project_count > 0
            ORDER BY total_budget DESC
        `;

        const [results] = await pool.query(query, finYearId ? [finYearId] : []);
        res.json(results);
    } catch (error) {
        console.error('Error fetching project type stats:', error);
        res.status(500).json({ error: 'Failed to fetch project type statistics' });
    }
});

// ==================== METADATA ====================

/**
 * @route GET /api/public/metadata/departments
 * @description Get list of all departments
 * @access Public
 */
router.get('/metadata/departments', async (req, res) => {
    try {
        const query = 'SELECT departmentId as id, name FROM kemri_departments WHERE voided = 0 ORDER BY name';
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

/**
 * @route GET /api/public/metadata/subcounties
 * @description Get list of all sub-counties
 * @access Public
 */
router.get('/metadata/subcounties', async (req, res) => {
    try {
        const query = 'SELECT subcountyId as id, name, countyId FROM kemri_subcounties ORDER BY name';
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sub-counties:', error);
        res.status(500).json({ error: 'Failed to fetch sub-counties' });
    }
});

/**
 * @route GET /api/public/metadata/wards
 * @description Get list of all wards
 * @access Public
 */
router.get('/metadata/wards', async (req, res) => {
    try {
        const { subCountyId } = req.query;
        
        let query = 'SELECT wardId as id, name, subcountyId FROM kemri_wards';
        const queryParams = [];
        
        if (subCountyId) {
            query += ' WHERE subcountyId = ?';
            queryParams.push(subCountyId);
        }
        
        query += ' ORDER BY name';
        
        const [results] = await pool.query(query, queryParams);
        res.json(results);
    } catch (error) {
        console.error('Error fetching wards:', error);
        res.status(500).json({ error: 'Failed to fetch wards' });
    }
});

/**
 * @route GET /api/public/metadata/project-types
 * @description Get list of all project types/categories
 * @access Public
 */
router.get('/metadata/project-types', async (req, res) => {
    try {
        const query = 'SELECT categoryId as id, categoryName as name FROM kemri_categories WHERE voided = 0 ORDER BY categoryName';
        const [results] = await pool.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching project types:', error);
        res.status(500).json({ error: 'Failed to fetch project types' });
    }
});

// ==================== FEEDBACK ====================

/**
 * @route GET /api/public/feedback/stats
 * @description Get feedback statistics (only approved feedback counts)
 * @access Public
 */
router.get('/feedback/stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_feedback,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_feedback,
                COUNT(CASE WHEN status = 'reviewed' THEN 1 END) as reviewed_feedback,
                COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_feedback,
                COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_feedback
            FROM public_feedback 
            WHERE moderation_status = 'approved'
        `;

        const [results] = await pool.query(query);
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        res.status(500).json({ error: 'Failed to fetch feedback statistics' });
    }
});

/**
 * @route POST /api/public/feedback
 * @description Submit public feedback (no authentication required)
 * @access Public
 */
router.post('/feedback', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            subject, 
            message, 
            projectId,
            ratingOverallSupport,
            ratingQualityOfLifeImpact,
            ratingCommunityAlignment,
            ratingTransparency,
            ratingFeasibilityConfidence
        } = req.body;

        // Validate required fields
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Validate ratings if provided (must be between 1-5)
        const ratings = [
            ratingOverallSupport,
            ratingQualityOfLifeImpact,
            ratingCommunityAlignment,
            ratingTransparency,
            ratingFeasibilityConfidence
        ];

        for (const rating of ratings) {
            if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
                return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
            }
        }

        const query = `
            INSERT INTO public_feedback (
                name, email, phone, subject, message, project_id, 
                rating_overall_support, rating_quality_of_life_impact, 
                rating_community_alignment, rating_transparency, 
                rating_feasibility_confidence, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await pool.query(query, [
            name, 
            email, 
            phone, 
            subject, 
            message, 
            projectId || null,
            ratingOverallSupport || null,
            ratingQualityOfLifeImpact || null,
            ratingCommunityAlignment || null,
            ratingTransparency || null,
            ratingFeasibilityConfidence || null
        ]);

        res.status(201).json({ 
            success: true, 
            message: 'Feedback submitted successfully. Thank you!' 
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

/**
 * @route PUT /api/public/feedback/:id/respond
 * @description Add response to feedback (protected - requires authentication)
 * @access Protected
 */
router.put('/feedback/:id/respond', async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_response, responded_by } = req.body;

        if (!admin_response) {
            return res.status(400).json({ error: 'Response text is required' });
        }

        const query = `
            UPDATE public_feedback 
            SET admin_response = ?,
                responded_by = ?,
                responded_at = NOW(),
                status = 'responded',
                updated_at = NOW()
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [admin_response, responded_by || null, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({ 
            success: true, 
            message: 'Response submitted successfully' 
        });
    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({ error: 'Failed to submit response' });
    }
});

/**
 * @route PUT /api/public/feedback/:id/status
 * @description Update feedback status (protected - requires authentication)
 * @access Protected
 */
router.put('/feedback/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'reviewed', 'responded', 'archived'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const query = `
            UPDATE public_feedback 
            SET status = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({ 
            success: true, 
            message: 'Status updated successfully' 
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

/**
 * @route GET /api/public/feedback
 * @description Get list of public feedback with optional filtering
 * @access Public
 */
router.get('/feedback', async (req, res) => {
    try {
        const { 
            status, 
            projectId,
            search,
            page = 1, 
            limit = 10 
        } = req.query;

        let whereConditions = ['f.moderation_status = "approved"']; // Only show approved feedback publicly
        const queryParams = [];

        if (status && status !== 'all') {
            whereConditions.push('f.status = ?');
            queryParams.push(status);
        }

        if (projectId) {
            whereConditions.push('f.project_id = ?');
            queryParams.push(projectId);
        }

        if (search) {
            whereConditions.push('(f.name LIKE ? OR f.subject LIKE ? OR f.message LIKE ? OR p.projectName LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM public_feedback f
            LEFT JOIN kemri_projects p ON f.project_id = p.id
            WHERE ${whereClause}
        `;

        const [countResult] = await pool.query(countQuery, queryParams);
        const totalFeedbacks = countResult[0].total;

        // Get paginated feedback
        const feedbackQuery = `
            SELECT 
                f.id,
                f.name,
                f.email,
                f.phone,
                f.subject,
                f.message,
                f.project_id,
                f.status,
                f.admin_response,
                f.responded_at,
                f.created_at,
                f.rating_overall_support,
                f.rating_quality_of_life_impact,
                f.rating_community_alignment,
                f.rating_transparency,
                f.rating_feasibility_confidence,
                p.projectName as project_name
            FROM public_feedback f
            LEFT JOIN kemri_projects p ON f.project_id = p.id
            WHERE ${whereClause}
            ORDER BY f.created_at DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);
        const [feedbacks] = await pool.query(feedbackQuery, queryParams);

        res.json({
            feedbacks,
            pagination: {
                total: totalFeedbacks,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalFeedbacks / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

/**
 * @route GET /api/public/feedback/admin
 * @description Get all feedback for admin interface (including unmoderated)
 * @access Protected (Admin)
 */
router.get('/feedback/admin', async (req, res) => {
    try {
        const { 
            status, 
            projectId,
            search,
            moderation_status,
            page = 1, 
            limit = 10 
        } = req.query;

        let whereConditions = ['1=1']; // Admin can see all feedback
        const queryParams = [];

        if (status && status !== 'all') {
            whereConditions.push('f.status = ?');
            queryParams.push(status);
        }

        if (moderation_status && moderation_status !== 'all') {
            whereConditions.push('f.moderation_status = ?');
            queryParams.push(moderation_status);
        }

        if (projectId) {
            whereConditions.push('f.project_id = ?');
            queryParams.push(projectId);
        }

        if (search) {
            whereConditions.push('(f.name LIKE ? OR f.subject LIKE ? OR f.message LIKE ? OR p.projectName LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM public_feedback f
            LEFT JOIN kemri_projects p ON f.project_id = p.id
            WHERE ${whereClause}
        `;

        const [countResult] = await pool.query(countQuery, queryParams);
        const totalFeedbacks = countResult[0].total;

        // Get paginated feedback
        const feedbackQuery = `
            SELECT 
                f.id,
                f.name,
                f.email,
                f.phone,
                f.subject,
                f.message,
                f.project_id,
                f.status,
                f.admin_response,
                f.responded_at,
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
            WHERE ${whereClause}
            ORDER BY f.created_at DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);
        const [feedbacks] = await pool.query(feedbackQuery, queryParams);

        res.json({
            feedbacks,
            pagination: {
                total: totalFeedbacks,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalFeedbacks / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching admin feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

module.exports = router;

