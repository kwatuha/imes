const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Adjust the path as needed

// --- Department Summary Report Calls ---
/**
 * @route GET /api/reports/department-summary
 * @description Get aggregated project data grouped by department
 * @access Private (assuming authentication middleware is applied)
 * @returns {Array} List of departments with aggregated project metrics
 */
router.get('/department-summary', async (req, res) => {
    try {
        const { 
            finYearId, 
            status, 
            department, 
            projectType, 
            cidpPeriod, 
            financialYear, 
            startDate, 
            endDate, 
            projectStatus,
            section,
            subCounty,
            ward
        } = req.query;

        let whereConditions = ['p.voided = 0'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }

        if (status || projectStatus) {
            whereConditions.push('p.status = ?');
            queryParams.push(status || projectStatus);
        }

        if (department) {
            whereConditions.push('d.name = ?');
            queryParams.push(department);
        }

        if (projectType) {
            whereConditions.push('pc.name = ?');
            queryParams.push(projectType);
        }

        if (startDate) {
            whereConditions.push('p.startDate >= ?');
            queryParams.push(startDate);
        }

        if (endDate) {
            whereConditions.push('p.endDate <= ?');
            queryParams.push(endDate);
        }

        const sqlQuery = `
            SELECT
                d.name AS departmentName,
                d.alias AS departmentAlias,
                COUNT(p.id) AS numProjects,
                SUM(p.costOfProject) AS allocatedBudget,
                SUM(p.costOfProject) AS contractSum,
                SUM(p.paidOut) AS amountPaid,
                
                -- Calculate progress percentages using project fields directly
                CASE 
                    WHEN COUNT(p.id) > 0 THEN 
                        (COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) * 100.0 / COUNT(p.id))
                    ELSE 0 
                END AS percentCompleted,
                
                -- For quick figures, assume contract sum = allocated budget
                100.0 AS percentBudgetContracted,
                
                CASE 
                    WHEN SUM(p.costOfProject) > 0 THEN 
                        (SUM(p.paidOut) * 100.0 / SUM(p.costOfProject))
                    ELSE 0 
                END AS percentContractSumPaid,
                
                CASE 
                    WHEN SUM(p.costOfProject) > 0 THEN 
                        (SUM(p.paidOut) * 100.0 / SUM(p.costOfProject))
                    ELSE 0 
                END AS percentAbsorptionRate
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_departments d ON p.departmentId = d.departmentId AND d.voided = 0
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')} AND d.name IS NOT NULL` : 'WHERE d.name IS NOT NULL'}
            GROUP BY
                d.name, d.alias
            ORDER BY
                d.name;
        `;

        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching department summary report:', error);
        res.status(500).json({
            message: 'Error fetching department summary report',
            error: error.message
        });
    }
});

/**
 * @route GET /api/reports/projects-by-department
 * @description Get individual projects for a specific department
 * @access Private
 * @param {string} departmentName - Name of the department
 * @returns {Array} List of projects for the specified department
 */
router.get('/projects-by-department', async (req, res) => {
    try {
        const { departmentName } = req.query;

        if (!departmentName) {
            return res.status(400).json({
                message: 'Department name is required',
                error: 'Missing departmentName parameter'
            });
        }

        const sqlQuery = `
            SELECT
                p.id,
                p.projectName,
                p.projectDescription,
                p.directorate,
                p.startDate,
                p.endDate,
                p.costOfProject AS allocatedBudget,
                p.costOfProject AS contractSum,
                p.paidOut AS amountPaid,
                p.objective,
                p.expectedOutput,
                p.principalInvestigator,
                p.expectedOutcome,
                p.status,
                p.statusReason,
                p.createdAt,
                p.updatedAt,
                p.departmentId,
                cd.name AS departmentName,
                cd.alias AS departmentAlias,
                p.sectionId,
                ds.name AS sectionName,
                p.finYearId,
                fy.finYearName AS financialYearName,
                p.programId,
                pr.programme AS programName,
                p.subProgramId,
                spr.subProgramme AS subProgramName,
                p.categoryId,
                projCat.categoryName,
                s.firstName AS piFirstName,
                s.lastName AS piLastName,
                s.email AS piEmail,
                -- Calculate progress based on status
                CASE 
                    WHEN p.status = 'Completed' THEN 100
                    WHEN p.status = 'In Progress' THEN 75
                    WHEN p.status = 'At Risk' THEN 25
                    WHEN p.status = 'Delayed' THEN 50
                    WHEN p.status = 'Stalled' THEN 10
                    ELSE 0
                END AS percentCompleted,
                -- Calculate health score based on status and progress
                CASE 
                    WHEN p.status = 'Completed' THEN 100
                    WHEN p.status = 'In Progress' THEN 85
                    WHEN p.status = 'At Risk' THEN 30
                    WHEN p.status = 'Delayed' THEN 60
                    WHEN p.status = 'Stalled' THEN 20
                    ELSE 0
                END AS healthScore,
                -- Calculate absorption rate
                CASE 
                    WHEN p.costOfProject > 0 THEN 
                        ROUND((p.paidOut * 100.0 / p.costOfProject), 2)
                    ELSE 0
                END AS absorptionRate
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_departments cd ON p.departmentId = cd.departmentId AND cd.voided = 0
            LEFT JOIN
                kemri_sections ds ON p.sectionId = ds.sectionId AND ds.voided = 0
            LEFT JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId AND fy.voided = 0
            LEFT JOIN
                kemri_programs pr ON p.programId = pr.programId AND pr.voided = 0
            LEFT JOIN
                kemri_subprograms spr ON p.subProgramId = spr.subProgramId AND spr.voided = 0
            LEFT JOIN
                kemri_categories projCat ON p.categoryId = projCat.categoryId AND projCat.voided = 0
            LEFT JOIN
                kemri_staff s ON p.principalInvestigatorStaffId = s.staffId AND s.voided = 0
            WHERE
                p.voided = 0
                AND (cd.name = ? OR cd.alias = ?)
            ORDER BY
                p.projectName;
        `;

        const [rows] = await pool.query(sqlQuery, [departmentName, departmentName]);
        
        // Transform the data to match the expected format
        const transformedProjects = rows.map(project => ({
            id: project.id,
            projectName: project.projectName,
            department: project.departmentName,
            departmentAlias: project.departmentAlias,
            status: project.status,
            percentCompleted: project.percentCompleted,
            healthScore: project.healthScore,
            startDate: project.startDate,
            endDate: project.endDate,
            allocatedBudget: project.allocatedBudget,
            contractSum: project.contractSum,
            amountPaid: project.amountPaid,
            absorptionRate: project.absorptionRate,
            objective: project.objective,
            expectedOutput: project.expectedOutput,
            principalInvestigator: project.principalInvestigator,
            expectedOutcome: project.expectedOutcome,
            statusReason: project.statusReason,
            sectionName: project.sectionName,
            financialYearName: project.financialYearName,
            programName: project.programName,
            subProgramName: project.subProgramName,
            categoryName: project.categoryName,
            piFirstName: project.piFirstName,
            piLastName: project.piLastName,
            piEmail: project.piEmail
        }));

        res.status(200).json(transformedProjects);

    } catch (error) {
        console.error('Error fetching projects by department:', error);
        res.status(500).json({
            message: 'Error fetching projects by department',
            error: error.message
        });
    }
});


// --- Project Summary Report Calls ---
/**
 * @route GET /api/reports/project-status-summary
 * @description Get the count of projects by their status, with optional filters.
 */
router.get('/project-status-summary', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, wardId } = req.query;
        let whereConditions = ['p.voided = 0', 'p.status IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        // Location filters will require joins, similar to the main projects API
        // For simplicity, we'll assume a direct lookup for now
        // A more robust solution would involve conditional joins here

        const sqlQuery = `
            SELECT
                p.status AS name,
                COUNT(p.id) AS value
            FROM
                kemri_projects p
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                p.status
            ORDER BY
                name;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching project status summary:', error);
        res.status(500).json({ message: 'Error fetching project status summary', error: error.message });
    }
});

/**
 * @route GET /api/reports/project-category-summary
 * @description Get the count of projects by their category, with optional filters.
 */
router.get('/project-category-summary', async (req, res) => {
    try {
        const { finYearId, departmentId } = req.query;
        let whereConditions = ['p.voided = 0', 'p.categoryId IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        
        const sqlQuery = `
            SELECT
                pc.categoryName AS name,
                COUNT(p.id) AS value
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_project_milestone_implementations pc ON p.categoryId = pc.categoryId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                pc.categoryName
            ORDER BY
                name;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching project category summary:', error);
        res.status(500).json({ message: 'Error fetching project category summary', error: error.message });
    }
});


// --- NEW: New Routes for Frontend Visualizations ---

/**
 * @route GET /api/reports/project-cost-by-department
 * @description Get the total budget and paid amounts grouped by department.
 */
router.get('/project-cost-by-department', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, wardId } = req.query;
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
        
        // This query returns total cost and paid amounts by department
        const sqlQuery = `
            SELECT
                d.name AS departmentName,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_departments d ON p.departmentId = d.departmentId AND d.voided = 0
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                d.name
            ORDER BY
                totalBudget DESC;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project cost by department:', error);
        res.status(500).json({ message: 'Error fetching project cost by department', error: error.message });
    }
});

/**
 * @route GET /api/reports/projects-over-time
 * @description Get the number of projects, total budget, and paid amounts grouped by financial year.
 */
router.get('/projects-over-time', async (req, res) => {
    try {
        const { departmentId, countyId, subcountyId, status } = req.query;
        let whereConditions = ['p.voided = 0', 'p.finYearId IS NOT NULL'];
        const queryParams = [];

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        if (countyId) {
            whereConditions.push('c.countyId = ?');
            queryParams.push(countyId);
        }
        if (subcountyId) {
            whereConditions.push('sc.subcountyId = ?');
            queryParams.push(subcountyId);
        }
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                fy.finYearName AS name,
                COUNT(p.id) AS value,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId
            LEFT JOIN
                kemri_project_counties pc ON p.id = pc.projectId
            LEFT JOIN
                kemri_counties c ON pc.countyId = c.countyId
            LEFT JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId
            LEFT JOIN
                kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                fy.finYearName
            ORDER BY
                fy.finYearName;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching yearly trends:', error);
        res.status(500).json({ message: 'Error fetching yearly trends', error: error.message });
    }
});


// --- Project List & Location Reports ---
/**
 * @route GET /api/reports/project-list-detailed
 * @description Get a detailed list of projects with filters.
 */
router.get('/project-list-detailed', async (req, res) => {
    try {
        const { finYearId, departmentId, status } = req.query;
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
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                p.projectName,
                p.status,
                p.costOfProject,
                p.paidOut,
                p.startDate,
                p.endDate,
                p.id,
                fy.finYearName AS financialYearName,
                d.name AS departmentName,
                pc.categoryName AS projectCategory,
                c.name as countyName,   sc.name as subCountyName, w.name as wardName
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_departments d ON p.departmentId = d.departmentId AND d.voided = 0
            LEFT JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId 
            LEFT JOIN
                kemri_project_milestone_implementations pc ON p.categoryId = pc.categoryId
            LEFT JOIN
        kemri_project_counties pcc ON p.id = pcc.projectId
        LEFT JOIN
            kemri_counties c ON pcc.countyId = c.countyId
        LEFT JOIN
            kemri_project_subcounties psc ON p.id = psc.projectId
        LEFT JOIN
            kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
        LEFT JOIN
            kemri_project_wards pw ON p.id = pw.projectId
        LEFT JOIN
            kemri_wards w ON pw.wardId = w.wardId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            ORDER BY
                p.id;
        `;
        console.log(sqlQuery)
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching detailed project list:', error);
        res.status(500).json({ message: 'Error fetching detailed project list', error: error.message });
    }
});

/**
 * @route GET /api/reports/subcounty-summary
 * @description Get project counts and financial metrics grouped by subcounty.
 */
router.get('/subcounty-summary', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, status } = req.query;
        let whereConditions = ['p.voided = 0', 'psc.subcountyId IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        if (countyId) {
            whereConditions.push('sc.countyId = ?');
            queryParams.push(countyId);
        }
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                sc.name AS name,
                c.name AS countyName,
                COUNT(p.id) AS projectCount,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId
            JOIN
                kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
            JOIN
                kemri_counties c ON sc.countyId = c.countyId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                sc.name, c.name
            ORDER BY
                name;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching subcounty summary:', error);
        res.status(500).json({ message: 'Error fetching subcounty summary', error: error.message });
    }
});

/**
 * @route GET /api/reports/ward-summary
 * @description Get project counts and financial metrics grouped by ward.
 */
router.get('/ward-summary', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, status } = req.query;
        let whereConditions = ['p.voided = 0', 'pw.wardId IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        if (countyId) {
            whereConditions.push('c.countyId = ?');
            queryParams.push(countyId);
        }
        if (subcountyId) {
            whereConditions.push('sc.subcountyId = ?');
            queryParams.push(subcountyId);
        }
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                w.name AS name,
                sc.name AS subcountyName,
                c.name AS countyName,
                COUNT(p.id) AS projectCount,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            JOIN
                kemri_project_wards pw ON p.id = pw.projectId
            JOIN
                kemri_wards w ON pw.wardId = w.wardId
            JOIN
                kemri_subcounties sc ON w.subcountyId = sc.subcountyId
            JOIN
                kemri_counties c ON sc.countyId = c.countyId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                w.name, sc.name, c.name
            ORDER BY
                name;
        `;
       
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching ward summary:', error);
        res.status(500).json({ message: 'Error fetching ward summary', error: error.message });
    }
});

/**
 * @route GET /api/reports/yearly-trends
 * @description Get total budget and paid amounts grouped by financial year.
 */
router.get('/yearly-trends', async (req, res) => {
    try {
        const { departmentId, countyId, subcountyId, status } = req.query;
        let whereConditions = ['p.voided = 0', 'p.finYearId IS NOT NULL'];
        const queryParams = [];

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        if (countyId) {
            whereConditions.push('c.countyId = ?');
            queryParams.push(countyId);
        }
        if (subcountyId) {
            whereConditions.push('sc.subcountyId = ?');
            queryParams.push(subcountyId);
        }
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                fy.finYearName AS name,
                COUNT(p.id) AS projectCount,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId
            LEFT JOIN
                kemri_project_counties pc ON p.id = pc.projectId
            LEFT JOIN
                kemri_counties c ON pc.countyId = c.countyId
            LEFT JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId
            LEFT JOIN
                kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                fy.finYearName
            ORDER BY
                fy.finYearName;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching yearly trends:', error);
        res.status(500).json({ message: 'Error fetching yearly trends', error: error.message });
    }
});

// --- NEWLY ADDED ROUTES ---

/**
 * @route GET /api/reports/projects-at-risk-budget
 * @description Get the total budget for projects that are 'At Risk' or 'Delayed'.
 */
/**
 * @route GET /api/reports/projects-at-risk-budget
 * @description Get the total budget for projects at risk compared to the total project budget.
 */
router.get('/projects-at-risk-budget', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, wardId } = req.query;
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
        // NOTE: Additional location filters can be added here if needed.

        const sqlQuery = `
            SELECT
                SUM(p.costOfProject) AS totalProjectBudget,
                SUM(CASE WHEN p.status IN ('At Risk', 'Delayed') THEN p.costOfProject ELSE 0 END) AS atRiskBudget
            FROM
                kemri_projects p
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''};
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        
        // Transform the result into a format suitable for the frontend chart
        const chartData = [
            { name: 'Total Project Budget', value: rows[0].totalProjectBudget || 0 },
            { name: 'At-Risk Budget', value: rows[0].atRiskBudget || 0 }
        ];

        res.status(200).json(chartData);

    } catch (error) {
        console.error('Error fetching at-risk budget report:', error);
        res.status(500).json({ message: 'Error fetching at-risk budget report', error: error.message });
    }
});
/**
 * @route GET /api/reports/project-status-over-time
 * @description Get the count of projects in each status, grouped by year.
 */
router.get('/project-status-over-time', async (req, res) => {
    try {
        const { finYearId, departmentId } = req.query;
        let whereConditions = ['p.voided = 0', 'p.status IS NOT NULL', 'fy.finYearName IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        
        const sqlQuery = `
            SELECT
                fy.finYearName AS year,
                p.status AS status,
                COUNT(p.id) AS projectCount
            FROM
                kemri_projects p
            JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                fy.finYearName, p.status
            ORDER BY
                fy.finYearName;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching project status over time:', error);
        res.status(500).json({ message: 'Error fetching project status over time', error: error.message });
    }
});

// --- NEW: Summary KPIs Route ---
/**
 * @route GET /api/reports/summary-kpis
 * @description Get high-level summary KPIs (total projects, budget, paid) with filters.
 */
router.get('/summary-kpis', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, wardId, status } = req.query;
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
        if (countyId) {
            whereConditions.push('pc.countyId = ?');
            queryParams.push(countyId);
        }
        if (subcountyId) {
            whereConditions.push('psc.subcountyId = ?');
            queryParams.push(subcountyId);
        }
        if (wardId) {
            whereConditions.push('pw.wardId = ?');
            queryParams.push(wardId);
        }
        if (status) {
            whereConditions.push('p.status = ?');
            queryParams.push(status);
        }

        const sqlQuery = `
            SELECT
                COUNT(DISTINCT p.id) AS totalProjects,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_project_counties pc ON p.id = pc.projectId
            LEFT JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId
            LEFT JOIN
                kemri_project_wards pw ON p.id = pw.projectId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''};
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows[0] || {});

    } catch (error) {
        console.error('Error fetching summary KPIs:', error);
        res.status(500).json({ message: 'Error fetching summary KPIs', error: error.message });
    }
});

/**
 * @route GET /api/reports/projects-by-status-and-year
 * @description Get the count of projects in each status, grouped by financial year.
 */
router.get('/projects-by-status-and-year', async (req, res) => {
    try {
        const { departmentId, countyId, subcountyId, wardId } = req.query;
        let whereConditions = ['p.voided = 0', 'p.status IS NOT NULL', 'fy.finYearName IS NOT NULL'];
        const queryParams = [];

        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        if (countyId) {
            whereConditions.push('c.countyId = ?');
            queryParams.push(countyId);
        }
        if (subcountyId) {
            whereConditions.push('sc.subcountyId = ?');
            queryParams.push(subcountyId);
        }
        if (wardId) {
            whereConditions.push('w.wardId = ?');
            queryParams.push(wardId);
        }

        const sqlQuery = `
            SELECT
                fy.finYearName AS year,
                p.status AS status,
                COUNT(p.id) AS projectCount
            FROM
                kemri_projects p
            JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId
            LEFT JOIN
                kemri_project_counties pc ON p.id = pc.projectId
            LEFT JOIN
                kemri_counties c ON pc.countyId = c.countyId
            LEFT JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId
            LEFT JOIN
                kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
            LEFT JOIN
                kemri_project_wards pw ON p.id = pw.projectId
            LEFT JOIN
                kemri_wards w ON pw.wardId = w.wardId
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                fy.finYearName, p.status
            ORDER BY
                fy.finYearName, p.status;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching projects by status and year:', error);
        res.status(500).json({ message: 'Error fetching projects by status and year', error: error.message });
    }
});

/**
 * @route GET /api/reports/financial-status-by-project-status
 * @description Get the total budget and paid amounts grouped by project status.
 */
router.get('/financial-status-by-project-status', async (req, res) => {
    try {
        const { finYearId, departmentId, countyId, subcountyId, wardId } = req.query;
        let whereConditions = ['p.voided = 0', 'p.status IS NOT NULL'];
        const queryParams = [];

        if (finYearId) {
            whereConditions.push('p.finYearId = ?');
            queryParams.push(finYearId);
        }
        if (departmentId) {
            whereConditions.push('p.departmentId = ?');
            queryParams.push(departmentId);
        }
        // Location filters can be added here with appropriate joins
        // For example, if (countyId) { whereConditions.push('c.countyId = ?'); queryParams.push(countyId); }

        const sqlQuery = `
            SELECT
                p.status AS status,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid
            FROM
                kemri_projects p
            ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''}
            GROUP BY
                p.status
            ORDER BY
                p.status;
        `;
        
        const [rows] = await pool.query(sqlQuery, queryParams);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Error fetching financial status by project status:', error);
        res.status(500).json({ message: 'Error fetching financial status by project status', error: error.message });
    }
});

// --- Filter Options Endpoints ---
/**
 * @route GET /api/reports/filter-options
 * @description Get all available filter options for the dashboard
 * @access Public (for now)
 * @returns {Object} Object containing arrays of filter options
 */
router.get('/filter-options', async (req, res) => {
    try {
        // Get departments
        const [departments] = await pool.execute(`
            SELECT DISTINCT d.name, d.alias 
            FROM kemri_departments d
            INNER JOIN kemri_projects p ON d.departmentId = p.departmentId
            WHERE p.voided = 0
            ORDER BY d.name
        `);

        // Get project types/categories (since projects don't have categoryId, get all categories)
        const [projectTypes] = await pool.execute(`
            SELECT DISTINCT pc.categoryName as name 
            FROM kemri_categories pc
            WHERE pc.voided = 0 OR pc.voided IS NULL
            ORDER BY pc.categoryName
        `);

        // Get project statuses
        const [projectStatuses] = await pool.execute(`
            SELECT DISTINCT p.status 
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.status IS NOT NULL AND p.status != ''
            ORDER BY p.status
        `);

        // Get financial years (since projects don't have finYearId, get all financial years)
        const [financialYears] = await pool.execute(`
            SELECT DISTINCT fy.finYearName as name, fy.finYearId as id
            FROM kemri_financialyears fy
            WHERE fy.voided = 0 OR fy.voided IS NULL
            ORDER BY fy.finYearName DESC
        `);

        // Get sections (using sectionId - we'll need to join with sections table if it exists)
        const [sections] = await pool.execute(`
            SELECT DISTINCT p.sectionId as name
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.sectionId IS NOT NULL
            ORDER BY p.sectionId
        `);

        // Get sub-counties (not available in current schema)
        const subCounties = [];

        // Get wards (not available in current schema)
        const wards = [];

        res.json({
            departments: departments.map(d => ({ name: d.name, alias: d.alias })),
            projectTypes: projectTypes.map(pt => ({ name: pt.name })),
            projectStatuses: projectStatuses.map(ps => ({ name: ps.status })),
            financialYears: financialYears.map(fy => ({ id: fy.id, name: fy.name })),
            sections: sections.map(s => ({ name: s.section })),
            subCounties: subCounties.map(sc => ({ name: sc.subCounty })),
            wards: wards.map(w => ({ name: w.ward }))
        });

    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ 
            error: 'Failed to fetch filter options',
            details: error.message 
        });
    }
});

// --- Annual Trends Endpoints ---
/**
 * @route GET /api/reports/annual-trends
 * @description Get 5-year historical trends data
 * @access Public (for now)
 * @returns {Object} Object containing arrays of trend data
 */
router.get('/annual-trends', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 4; // 5 years of data
        
        // Get project performance trends
        const [projectPerformance] = await pool.execute(`
            SELECT 
                YEAR(p.startDate) as year,
                COUNT(p.id) as totalProjects,
                COUNT(CASE WHEN p.status = 'Completed' THEN 1 END) as completedProjects,
                AVG(p.overallProgress) as avgProgress,
                AVG(DATEDIFF(p.endDate, p.startDate)) as avgDuration
            FROM kemri_projects p
            WHERE p.voided = 0 
                AND YEAR(p.startDate) >= ?
                AND YEAR(p.startDate) <= ?
            GROUP BY YEAR(p.startDate)
            ORDER BY year
        `, [startYear, currentYear]);

        // Get financial trends
        const [financialTrends] = await pool.execute(`
            SELECT 
                YEAR(p.startDate) as year,
                SUM(p.costOfProject) as totalBudget,
                SUM(p.paidOut) as totalExpenditure,
                CASE 
                    WHEN SUM(p.costOfProject) > 0 THEN 
                        (SUM(p.paidOut) * 100.0 / SUM(p.costOfProject))
                    ELSE 0 
                END as absorptionRate
            FROM kemri_projects p
            WHERE p.voided = 0 
                AND YEAR(p.startDate) >= ?
                AND YEAR(p.startDate) <= ?
            GROUP BY YEAR(p.startDate)
            ORDER BY year
        `, [startYear, currentYear]);

        // Get department trends
        const [departmentTrends] = await pool.execute(`
            SELECT 
                YEAR(p.startDate) as year,
                d.name as departmentName,
                d.alias as departmentAlias,
                COUNT(p.id) as projectCount,
                SUM(p.costOfProject) as departmentBudget,
                SUM(p.paidOut) as departmentExpenditure
            FROM kemri_projects p
            INNER JOIN kemri_departments d ON p.departmentId = d.departmentId
            WHERE p.voided = 0 
                AND YEAR(p.startDate) >= ?
                AND YEAR(p.startDate) <= ?
            GROUP BY YEAR(p.startDate), d.departmentId, d.name, d.alias
            ORDER BY year, d.name
        `, [startYear, currentYear]);

        // Get project status trends
        const [statusTrends] = await pool.execute(`
            SELECT 
                YEAR(p.startDate) as year,
                p.status,
                COUNT(p.id) as count
            FROM kemri_projects p
            WHERE p.voided = 0 
                AND YEAR(p.startDate) >= ?
                AND YEAR(p.startDate) <= ?
                AND p.status IS NOT NULL
            GROUP BY YEAR(p.startDate), p.status
            ORDER BY year, p.status
        `, [startYear, currentYear]);

        // Calculate year-over-year growth rates
        const calculateGrowthRate = (current, previous) => {
            const currentNum = parseFloat(current) || 0;
            const previousNum = parseFloat(previous) || 0;
            if (previousNum === 0) return 0;
            return ((currentNum - previousNum) / previousNum * 100).toFixed(1);
        };

        // Process project performance with growth rates
        const processedProjectPerformance = projectPerformance.map((item, index) => {
            const previous = index > 0 ? projectPerformance[index - 1] : null;
            return {
                ...item,
                completionRate: item.totalProjects > 0 ? 
                    ((item.completedProjects / item.totalProjects) * 100).toFixed(1) : 0,
                growthRate: previous ? 
                    calculateGrowthRate(item.totalProjects, previous.totalProjects) : 0
            };
        });

        // Process financial trends with growth rates
        const processedFinancialTrends = financialTrends.map((item, index) => {
            const previous = index > 0 ? financialTrends[index - 1] : null;
            return {
                ...item,
                totalBudget: parseFloat(item.totalBudget) || 0,
                totalExpenditure: parseFloat(item.totalExpenditure) || 0,
                absorptionRate: parseFloat(item.absorptionRate) || 0,
                growthRate: previous ? 
                    calculateGrowthRate(parseFloat(item.totalBudget) || 0, parseFloat(previous.totalBudget) || 0) : 0,
                budgetEfficiency: (parseFloat(item.totalBudget) || 0) > 0 ? 
                    ((parseFloat(item.totalExpenditure) || 0) / (parseFloat(item.totalBudget) || 0) * 100).toFixed(1) : 0
            };
        });

        // Ensure we have data for all years in the range, even if they're empty
        const allYears = Array.from({length: 5}, (_, i) => startYear + i);
        
        // Fill in missing years with zero data
        const completeProjectPerformance = allYears.map(year => {
            const existing = processedProjectPerformance.find(item => item.year === year);
            return existing || {
                year: year,
                totalProjects: 0,
                completedProjects: 0,
                avgProgress: 0,
                avgDuration: 0,
                completionRate: 0,
                growthRate: 0
            };
        });

        const completeFinancialTrends = allYears.map(year => {
            const existing = processedFinancialTrends.find(item => item.year === year);
            return existing || {
                year: year,
                totalBudget: 0,
                totalExpenditure: 0,
                absorptionRate: 0,
                growthRate: 0,
                budgetEfficiency: 0
            };
        });

        res.json({
            projectPerformance: completeProjectPerformance,
            financialTrends: completeFinancialTrends,
            departmentTrends: departmentTrends,
            statusTrends: statusTrends,
            yearRange: {
                start: startYear,
                end: currentYear,
                years: allYears
            }
        });

    } catch (error) {
        console.error('Error fetching annual trends:', error);
        res.status(500).json({ 
            error: 'Failed to fetch annual trends',
            details: error.message 
        });
    }
});

module.exports = router;