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
                
                -- Status breakdown (including phased statuses)
                -- Completed: exact match or contains "completed" (case-insensitive)
                COUNT(CASE 
                    WHEN p.status = 'Completed' 
                    OR LOWER(p.status) LIKE '%completed%'
                    THEN 1 
                END) as completed_projects,
                COALESCE(SUM(CASE 
                    WHEN p.status = 'Completed' 
                    OR LOWER(p.status) LIKE '%completed%'
                    THEN p.costOfProject 
                END), 0) as completed_budget,
                
                -- Ongoing: exact match or contains "ongoing" (case-insensitive)
                COUNT(CASE 
                    WHEN p.status = 'Ongoing' 
                    OR (LOWER(p.status) LIKE '%ongoing%' AND LOWER(p.status) NOT LIKE '%completed%')
                    THEN 1 
                END) as ongoing_projects,
                COALESCE(SUM(CASE 
                    WHEN p.status = 'Ongoing' 
                    OR (LOWER(p.status) LIKE '%ongoing%' AND LOWER(p.status) NOT LIKE '%completed%')
                    THEN p.costOfProject 
                END), 0) as ongoing_budget,
                
                -- Not Started
                COUNT(CASE WHEN p.status = 'Not Started' THEN 1 END) as not_started_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Not Started' THEN p.costOfProject END), 0) as not_started_budget,
                
                -- Under Procurement
                COUNT(CASE WHEN p.status = 'Under Procurement' THEN 1 END) as under_procurement_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Under Procurement' THEN p.costOfProject END), 0) as under_procurement_budget,
                
                -- Stalled
                COUNT(CASE WHEN p.status = 'Stalled' THEN 1 END) as stalled_projects,
                COALESCE(SUM(CASE WHEN p.status = 'Stalled' THEN p.costOfProject END), 0) as stalled_budget,
                
                -- Phased Projects: any status containing "Phase" (case-insensitive)
                COUNT(CASE 
                    WHEN LOWER(p.status) LIKE '%phase%' 
                    THEN 1 
                END) as phased_projects,
                COALESCE(SUM(CASE 
                    WHEN LOWER(p.status) LIKE '%phase%' 
                    THEN p.costOfProject 
                END), 0) as phased_budget
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
            WHERE (fy.voided IS NULL OR fy.voided = 0)
            GROUP BY fy.finYearId, fy.finYearName, fy.startDate, fy.endDate
            HAVING COUNT(p.id) > 0
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
            // Special handling for phased projects
            if (status === 'Phase') {
                whereConditions.push('LOWER(p.status) LIKE ?');
                queryParams.push('%phase%');
            } else {
                whereConditions.push('p.status = ?');
                queryParams.push(status);
            }
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
            LEFT JOIN kemri_financialyears fy ON p.finYearId = fy.finYearId AND (fy.voided IS NULL OR fy.voided = 0)
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
            LEFT JOIN kemri_departments d ON p.departmentId = d.departmentId AND (d.voided IS NULL OR d.voided = 0)
            LEFT JOIN kemri_categories pc ON p.categoryId = pc.categoryId
            LEFT JOIN kemri_financialyears fy ON p.finYearId = fy.finYearId AND (fy.voided IS NULL OR fy.voided = 0)
            WHERE p.id = ? AND p.voided = 0
        `;

        const [projects] = await pool.query(query, [id]);

        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Get all project photos
        const photosQuery = `
            SELECT filePath, caption, createdAt as uploaded_at
            FROM kemri_project_photos
            WHERE projectId = ? AND voided = 0
            ORDER BY createdAt DESC
        `;
        const [photos] = await pool.query(photosQuery, [id]);

        // Return project data in the same format as the projects list endpoint
        res.json(projects[0]);
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ error: 'Failed to fetch project details', details: error.message });
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
                COUNT(CASE 
                    WHEN p.status = 'Completed' 
                    OR LOWER(p.status) LIKE '%completed%'
                    THEN 1 
                END) as completed_projects,
                COUNT(CASE 
                    WHEN p.status = 'Ongoing' 
                    OR (LOWER(p.status) LIKE '%ongoing%' AND LOWER(p.status) NOT LIKE '%completed%')
                    THEN 1 
                END) as ongoing_projects,
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
                COUNT(CASE 
                    WHEN p.status = 'Completed' 
                    OR LOWER(p.status) LIKE '%completed%'
                    THEN 1 
                END) as completed_projects,
                COUNT(CASE 
                    WHEN p.status = 'Ongoing' 
                    OR (LOWER(p.status) LIKE '%ongoing%' AND LOWER(p.status) NOT LIKE '%completed%')
                    THEN 1 
                END) as ongoing_projects
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
                COUNT(CASE 
                    WHEN p.status = 'Completed' 
                    OR LOWER(p.status) LIKE '%completed%'
                    THEN 1 
                END) as completed_count,
                COUNT(CASE 
                    WHEN p.status = 'Ongoing' 
                    OR (LOWER(p.status) LIKE '%ongoing%' AND LOWER(p.status) NOT LIKE '%completed%')
                    THEN 1 
                END) as ongoing_count
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

// ==================== CITIZEN PROPOSALS ====================

/**
 * @route GET /api/public/citizen-proposals
 * @description Get all citizen proposals with optional filtering
 * @access Public
 */
router.get('/citizen-proposals', async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;
        
        let whereConditions = ['voided = 0'];
        const queryParams = [];
        
        if (status && status !== 'all') {
            whereConditions.push('status = ?');
            queryParams.push(status);
        }
        
        if (category && category !== 'all') {
            whereConditions.push('category = ?');
            queryParams.push(category);
        }
        
        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM citizen_proposals WHERE ${whereClause}`;
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;
        
        // Get proposals
        const query = `
            SELECT 
                id,
                title,
                description,
                category,
                location,
                estimated_cost,
                proposer_name,
                proposer_email,
                proposer_phone,
                proposer_address,
                justification,
                expected_benefits,
                timeline,
                status,
                submission_date,
                created_at,
                updated_at
            FROM citizen_proposals
            WHERE ${whereClause}
            ORDER BY submission_date DESC
            LIMIT ? OFFSET ?
        `;
        
        queryParams.push(parseInt(limit), offset);
        const [proposals] = await pool.query(query, queryParams);
        
        res.json({
            proposals,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching citizen proposals:', error);
        res.status(500).json({ 
            error: 'Failed to fetch proposals',
            details: error.message || 'Database error occurred'
        });
    }
});

/**
 * @route POST /api/public/citizen-proposals
 * @description Submit a new citizen proposal
 * @access Public
 */
router.post('/citizen-proposals', async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            location,
            estimatedCost,
            proposerName,
            proposerEmail,
            proposerPhone,
            proposerAddress,
            justification,
            expectedBenefits,
            timeline
        } = req.body;
        
        // Validate required fields
        if (!title || !description || !category || !location || estimatedCost === undefined || estimatedCost === null || 
            !proposerName || !proposerEmail || !proposerPhone || !justification || 
            !expectedBenefits || !timeline) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: {
                    title: !title,
                    description: !description,
                    category: !category,
                    location: !location,
                    estimatedCost: estimatedCost === undefined || estimatedCost === null,
                    proposerName: !proposerName,
                    proposerEmail: !proposerEmail,
                    proposerPhone: !proposerPhone,
                    justification: !justification,
                    expectedBenefits: !expectedBenefits,
                    timeline: !timeline
                }
            });
        }
        
        // Validate estimatedCost is a valid number
        const cost = parseFloat(estimatedCost);
        if (isNaN(cost) || cost <= 0) {
            return res.status(400).json({ error: 'Estimated cost must be a valid positive number' });
        }
        
        const query = `
            INSERT INTO citizen_proposals (
                title, description, category, location, estimated_cost,
                proposer_name, proposer_email, proposer_phone, proposer_address,
                justification, expected_benefits, timeline, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review')
        `;
        
        const [result] = await pool.query(query, [
            title, description, category, location, cost,
            proposerName, proposerEmail, proposerPhone, proposerAddress || '',
            justification, expectedBenefits, timeline
        ]);
        
        res.status(201).json({
            message: 'Proposal submitted successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error submitting proposal:', error);
        res.status(500).json({ 
            error: 'Failed to submit proposal',
            details: error.message || 'Database error occurred'
        });
    }
});

/**
 * @route GET /api/public/citizen-proposals/:id
 * @description Get a specific citizen proposal by ID
 * @access Public
 */
router.get('/citizen-proposals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                id,
                title,
                description,
                category,
                location,
                estimated_cost,
                proposer_name,
                proposer_email,
                proposer_phone,
                proposer_address,
                justification,
                expected_benefits,
                timeline,
                status,
                submission_date,
                review_notes,
                created_at,
                updated_at
            FROM citizen_proposals
            WHERE id = ? AND voided = 0
        `;
        
        const [proposals] = await pool.query(query, [id]);
        
        if (proposals.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        
        res.json(proposals[0]);
    } catch (error) {
        console.error('Error fetching proposal:', error);
        res.status(500).json({ error: 'Failed to fetch proposal' });
    }
});

// ==================== COUNTY PROPOSED PROJECTS ====================

/**
 * @route GET /api/public/county-proposed-projects
 * @description Get all county proposed projects with optional filtering
 * @access Public
 */
router.get('/county-proposed-projects', async (req, res) => {
    try {
        const { category, status, priority, page = 1, limit = 20 } = req.query;
        
        let whereConditions = ['cpp.voided = 0'];
        const queryParams = [];
        
        if (category && category !== 'All') {
            whereConditions.push('cpp.category = ?');
            queryParams.push(category);
        }
        
        if (status && status !== 'All') {
            whereConditions.push('cpp.status = ?');
            queryParams.push(status);
        }
        
        if (priority && priority !== 'All') {
            whereConditions.push('cpp.priority = ?');
            queryParams.push(priority);
        }
        
        const whereClause = whereConditions.join(' AND ');
        const offset = (page - 1) * limit;
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM county_proposed_projects cpp WHERE ${whereClause}`;
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0].total;
        
        // Get projects with milestones
        const query = `
            SELECT 
                cpp.id,
                cpp.title,
                cpp.description,
                cpp.category,
                cpp.location,
                cpp.estimated_cost,
                cpp.justification,
                cpp.expected_benefits,
                cpp.timeline,
                cpp.status,
                cpp.priority,
                cpp.department,
                cpp.project_manager,
                cpp.contact,
                cpp.start_date,
                cpp.end_date,
                cpp.progress,
                cpp.budget_allocated,
                cpp.budget_utilized,
                cpp.stakeholders,
                cpp.risks,
                cpp.created_at,
                cpp.updated_at
            FROM county_proposed_projects cpp
            WHERE ${whereClause}
            ORDER BY cpp.created_at DESC
            LIMIT ? OFFSET ?
        `;
        
        queryParams.push(parseInt(limit), offset);
        const [projects] = await pool.query(query, queryParams);
        
        // Get milestones for each project
        for (let project of projects) {
            const milestonesQuery = `
                SELECT 
                    id,
                    name,
                    description,
                    target_date,
                    completed,
                    completed_date,
                    sequence_order
                FROM county_proposed_project_milestones
                WHERE project_id = ?
                ORDER BY sequence_order, target_date
            `;
            const [milestones] = await pool.query(milestonesQuery, [project.id]);
            project.milestones = milestones;
        }
        
        res.json({
            projects,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching county proposed projects:', error);
        res.status(500).json({ 
            error: 'Failed to fetch projects',
            details: error.message || 'Database error occurred'
        });
    }
});

/**
 * @route GET /api/public/county-proposed-projects/:id
 * @description Get a specific county proposed project by ID
 * @access Public
 */
router.get('/county-proposed-projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                cpp.id,
                cpp.title,
                cpp.description,
                cpp.category,
                cpp.location,
                cpp.estimated_cost,
                cpp.justification,
                cpp.expected_benefits,
                cpp.timeline,
                cpp.status,
                cpp.priority,
                cpp.department,
                cpp.project_manager,
                cpp.contact,
                cpp.start_date,
                cpp.end_date,
                cpp.progress,
                cpp.budget_allocated,
                cpp.budget_utilized,
                cpp.stakeholders,
                cpp.risks,
                cpp.created_at,
                cpp.updated_at
            FROM county_proposed_projects cpp
            WHERE cpp.id = ? AND cpp.voided = 0
        `;
        
        const [projects] = await pool.query(query, [id]);
        
        if (projects.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        const project = projects[0];
        
        // Get milestones
        const milestonesQuery = `
            SELECT 
                id,
                name,
                description,
                target_date,
                completed,
                completed_date,
                sequence_order
            FROM county_proposed_project_milestones
            WHERE project_id = ?
            ORDER BY sequence_order, target_date
        `;
        const [milestones] = await pool.query(milestonesQuery, [id]);
        project.milestones = milestones;
        
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// ==================== PROJECT ANNOUNCEMENTS ====================

/**
 * @route GET /api/public/announcements
 * @description Get all project announcements with optional filtering
 * @access Public
 */
router.get('/announcements', async (req, res) => {
    try {
        const { category, status, page = 1, limit = 20 } = req.query;
        
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
            details: error.message || 'Database error occurred'
        });
    }
});

/**
 * @route GET /api/public/announcements/:id
 * @description Get a specific announcement by ID
 * @access Public
 */
router.get('/announcements/:id', async (req, res) => {
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
        res.status(500).json({ error: 'Failed to fetch announcement' });
    }
});

module.exports = router;

