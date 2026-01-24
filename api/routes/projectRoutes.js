const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const pool = require('../config/db'); // Import the database connection pool
const multer = require('multer');
const xlsx = require('xlsx');

// --- Consolidated Imports for All Sub-Routers ---
const appointmentScheduleRoutes = require('./appointmentScheduleRoutes');
const projectAttachmentRoutes = require('./projectAttachmentRoutes');
const projectCertificateRoutes = require('./projectCertificateRoutes');
const projectFeedbackRoutes = require('./projectFeedbackRoutes');
const projectMapRoutes = require('./projectMapRoutes');
const projectMonitoringRoutes = require('./projectMonitoringRoutes');
const projectObservationRoutes = require('./projectObservationRoutes');
const projectPaymentRoutes = require('./projectPaymentRoutes');
const projectSchedulingRoutes = require('./projectSchedulingRoutes');
const projectCategoryRoutes = require('./metadata/projectCategoryRoutes');
const projectWarningRoutes = require('./projectWarningRoutes');
const projectProposalRatingRoutes = require('./projectProposalRatingRoutes');
const { projectRouter: projectPhotoRouter, photoRouter } = require('./projectPhotoRoutes'); 
const projectAssignmentRoutes = require('./projectAssignmentRoutes');


// Base SQL query for project details with all left joins
const BASE_PROJECT_SELECT_JOINS = `
    SELECT
        p.id,
        p.projectName,
        p.projectDescription,
        p.directorate,
        p.startDate,
        p.endDate,
        p.costOfProject,
        p.paidOut,
        p.objective,
        p.expectedOutput,
        p.principalInvestigator,
        p.expectedOutcome,
        p.status,
        p.statusReason,
        p.ProjectRefNum,
        p.Contracted,
        p.createdAt,
        p.updatedAt,
        p.voided,
        p.principalInvestigatorStaffId,
        s.firstName AS piFirstName,
        s.lastName AS piLastName,
        s.email AS piEmail,
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
        p.userId AS creatorUserId,
        u.firstName AS creatorFirstName,
        u.lastName AS creatorLastName,
        p.approved_for_public,
        p.approved_by,
        p.approved_at,
        p.approval_notes,
        p.revision_requested,
        p.revision_notes,
        p.revision_requested_by,
        p.revision_requested_at,
        p.revision_submitted_at,
        p.overallProgress,
        GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ') AS countyNames,
        GROUP_CONCAT(DISTINCT sc.name ORDER BY sc.name SEPARATOR ', ') AS subcountyNames,
        GROUP_CONCAT(DISTINCT w.name ORDER BY w.name SEPARATOR ', ') AS wardNames
    FROM
        kemri_projects p
    LEFT JOIN
        kemri_staff s ON p.principalInvestigatorStaffId = s.staffId
    LEFT JOIN
        kemri_departments cd ON p.departmentId = cd.departmentId AND (cd.voided IS NULL OR cd.voided = 0)
    LEFT JOIN
        kemri_sections ds ON p.sectionId = ds.sectionId AND (ds.voided IS NULL OR ds.voided = 0)
    LEFT JOIN
        kemri_financialyears fy ON p.finYearId = fy.finYearId AND (fy.voided IS NULL OR fy.voided = 0)
    LEFT JOIN
        kemri_programs pr ON p.programId = pr.programId
    LEFT JOIN
        kemri_subprograms spr ON p.subProgramId = spr.subProgramId
    LEFT JOIN
        kemri_project_counties pc ON p.id = pc.projectId AND (pc.voided IS NULL OR pc.voided = 0)
    LEFT JOIN
        kemri_counties c ON pc.countyId = c.countyId
    LEFT JOIN
        kemri_project_subcounties psc ON p.id = psc.projectId AND (psc.voided IS NULL OR psc.voided = 0)
    LEFT JOIN
        kemri_subcounties sc ON psc.subcountyId = sc.subcountyId AND (sc.voided IS NULL OR sc.voided = 0)
    LEFT JOIN
        kemri_project_wards pw ON p.id = pw.projectId AND (pw.voided IS NULL OR pw.voided = 0)
    LEFT JOIN
        kemri_wards w ON pw.wardId = w.wardId AND (w.voided IS NULL OR w.voided = 0)
    LEFT JOIN
        kemri_project_milestone_implementations projCat ON p.categoryId = projCat.categoryId
    LEFT JOIN
        kemri_users u ON p.userId = u.userId
`;

// Corrected full query for fetching a single project by ID
const GET_SINGLE_PROJECT_QUERY = `
    ${BASE_PROJECT_SELECT_JOINS}
    WHERE p.id = ? AND p.voided = 0
    GROUP BY p.id;
`;

// --- Validation Middleware ---
const validateProject = (req, res, next) => {
    const { projectName } = req.body;
    if (!projectName || !projectName.trim()) {
        return res.status(400).json({ message: 'Missing required field: projectName' });
    }
    next();
};

// Utility function to check if project exists
const checkProjectExists = async (projectId) => {
    const [rows] = await pool.query('SELECT id FROM kemri_projects WHERE id = ? AND voided = 0', [projectId]);
    return rows.length > 0;
};

// Helper function to extract all coordinates from a GeoJSON geometry object
const extractCoordinates = (geometry) => {
    if (!geometry) return [];
    if (geometry.type === 'Point') return [geometry.coordinates];
    if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') return geometry.coordinates;
    if (geometry.type === 'Polygon') return geometry.coordinates[0];
    if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat(Infinity);
    return [];
};


// --- CRUD Operations for Projects (kemri_projects) ---

// Define junction table routers
const projectCountiesRouter = express.Router({ mergeParams: true });
const projectSubcountiesRouter = express.Router({ mergeParams: true });
const projectWardsRouter = express.Router({ mergeParams: true });

// Mount other route files
router.use('/appointmentschedules', appointmentScheduleRoutes);
router.use('/project_attachments', projectAttachmentRoutes);
router.use('/project_certificates', projectCertificateRoutes);
router.use('/project_feedback', projectFeedbackRoutes);
router.use('/project_maps', projectMapRoutes);
router.use('/project_observations', projectObservationRoutes);
router.use('/project_payments', projectPaymentRoutes);
router.use('/projectscheduling', projectSchedulingRoutes);
router.use('/projectcategories', projectCategoryRoutes);
router.use('/:projectId/monitoring', projectMonitoringRoutes);


// Mount junction table routers
router.use('/:projectId/counties', projectCountiesRouter);
router.use('/:projectId/subcounties', projectSubcountiesRouter);
router.use('/:projectId/wards', projectWardsRouter);
router.use('/:projectId/photos', projectPhotoRouter);

// --- Project Import Endpoints (MUST come before parameterized routes) ---
// Multer storage for temp uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Header normalization and mapping for Projects
const normalizeHeader = (header) => String(header || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const projectHeaderMap = {
    // Canonical -> Variants (normalized)
    projectName: ['projectname', 'name', 'title', 'project', 'project_name', 'project name'],
    ProjectDescription: ['projectdescription', 'description', 'details', 'projectdesc'],
    ProjectRefNum: ['projectrefnum', 'projectrefnumber', 'ref', 'refnum', 'refnumber', 'reference', 'projectreference', 'projectref', 'project ref num', 'project ref number'],
    Status: ['status', 'projectstatus', 'currentstatus'],
    budget: ['budget', 'estimatedcost', 'budgetkes', 'projectcost', 'costofproject'],
    amountPaid: ['amountpaid', 'disbursed', 'expenditure', 'paidout', 'amount paid'],
    financialYear: ['financialyear', 'financial-year', 'financial year', 'fy', 'adp', 'year'],
    department: ['department', 'implementingdepartment'],
    directorate: ['directorate'],
    'sub-county': ['subcounty', 'subcountyname', 'subcountyid', 'sub-county', 'subcounty_', 'sub county'],
    ward: ['ward', 'wardname', 'wardid'],
    Contracted: ['contracted', 'contractamount', 'contractedamount', 'contractsum', 'contract value', 'contract value (kes)'],
    StartDate: ['startdate', 'projectstartdate', 'commencementdate', 'start', 'start date'],
    EndDate: ['enddate', 'projectenddate', 'completiondate', 'end', 'end date']
};

// Reverse lookup: normalized variant -> canonical
const variantToCanonical = (() => {
    const map = {};
    Object.entries(projectHeaderMap).forEach(([canonical, variants]) => {
        variants.forEach(v => { map[v] = canonical; });
    });
    return map;
})();

// Helper function to validate and fix invalid dates
// Returns: { year, month, day, corrected, originalDay }
const validateAndFixDate = (year, month, day) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Check for leap year (February can have 29 days)
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
        daysInMonth[1] = 29;
    }
    
    const maxDays = daysInMonth[month - 1];
    const originalDay = day;
    if (day > maxDays) {
        // Fix invalid dates: e.g., June 31 -> June 30, February 30 -> February 28/29
        const fixedDay = maxDays;
        console.warn(`Fixed invalid date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} -> ${year}-${String(month).padStart(2, '0')}-${String(fixedDay).padStart(2, '0')}`);
        return { year, month, day: fixedDay, corrected: true, originalDay };
    }
    
    return { year, month, day, corrected: false, originalDay };
};

// Enhanced parseDateToYMD that tracks corrections
// Returns: { date: string, corrected: boolean, originalValue: string, correctionMessage: string } or null
const parseDateToYMD = (value, trackCorrections = false) => {
    if (!value) return trackCorrections ? null : null;
    const originalValue = String(value);
    
    if (value instanceof Date && !isNaN(value.getTime())) {
        const yyyy = value.getFullYear();
        const mm = value.getMonth() + 1;
        const dd = value.getDate();
        const fixed = validateAndFixDate(yyyy, mm, dd);
        const dateStr = `${fixed.year}-${String(fixed.month).padStart(2, '0')}-${String(fixed.day).padStart(2, '0')}`;
        
        if (trackCorrections && fixed.corrected) {
            return {
                date: dateStr,
                corrected: true,
                originalValue: originalValue,
                correctionMessage: `Date corrected from ${yyyy}-${String(mm).padStart(2, '0')}-${String(fixed.originalDay).padStart(2, '0')} to ${dateStr} (invalid day for month)`
            };
        }
        return trackCorrections ? { date: dateStr, corrected: false, originalValue: originalValue } : dateStr;
    }
    if (typeof value !== 'string') return trackCorrections ? value : value;
    const s = value.trim();
    
    // Fix common typos in month names (e.g., "0ct" -> "Oct", "0CT" -> "OCT")
    let normalized = s.replace(/\b0ct\b/gi, 'Oct').replace(/\b0ctober\b/gi, 'October');
    
    // Try to parse as text date (e.g., "6 Oct 2025", "6 October 2025", "Oct 6, 2025")
    const monthNames = {
        'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
        'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6,
        'jul': 7, 'july': 7, 'aug': 8, 'august': 8, 'sep': 9, 'september': 9,
        'oct': 10, 'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
    };
    
    // Pattern: DD Month YYYY or Month DD, YYYY or DD-Month-YYYY
    let m = normalized.match(/\b(\d{1,2})\s+([a-z]+)\s+(\d{4})\b/i);
    if (m) {
        const day = parseInt(m[1], 10);
        const monthName = m[2].toLowerCase();
        const year = parseInt(m[3], 10);
        if (monthNames[monthName] && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
            const month = monthNames[monthName];
            const fixed = validateAndFixDate(year, month, day);
            const dateStr = `${fixed.year}-${String(fixed.month).padStart(2, '0')}-${String(fixed.day).padStart(2, '0')}`;
            if (trackCorrections && fixed.corrected) {
                return {
                    date: dateStr,
                    corrected: true,
                    originalValue: originalValue,
                    correctionMessage: `Date corrected from ${year}-${String(month).padStart(2, '0')}-${String(fixed.originalDay).padStart(2, '0')} to ${dateStr} (invalid day for month)`
                };
            }
            return trackCorrections ? { date: dateStr, corrected: false, originalValue: originalValue } : dateStr;
        }
    }
    
    // Pattern: Month DD, YYYY or Month DD YYYY
    m = normalized.match(/\b([a-z]+)\s+(\d{1,2}),?\s+(\d{4})\b/i);
    if (m) {
        const monthName = m[1].toLowerCase();
        const day = parseInt(m[2], 10);
        const year = parseInt(m[3], 10);
        if (monthNames[monthName] && day >= 1 && day <= 31 && year >= 1900 && year <= 2100) {
            const month = monthNames[monthName];
            const fixed = validateAndFixDate(year, month, day);
            const dateStr = `${fixed.year}-${String(fixed.month).padStart(2, '0')}-${String(fixed.day).padStart(2, '0')}`;
            if (trackCorrections && fixed.corrected) {
                return {
                    date: dateStr,
                    corrected: true,
                    originalValue: originalValue,
                    correctionMessage: `Date corrected from ${year}-${String(month).padStart(2, '0')}-${String(fixed.originalDay).padStart(2, '0')} to ${dateStr} (invalid day for month)`
                };
            }
            return trackCorrections ? { date: dateStr, corrected: false, originalValue: originalValue } : dateStr;
        }
    }
    
    // Replace multiple separators with a single dash for easier parsing
    const norm = normalized.replace(/[\.\/]/g, '-');
    // Try YYYY-MM-DD
    m = norm.match(/^\s*(\d{4})-(\d{1,2})-(\d{1,2})\s*$/);
    if (m) {
        const yyyy = parseInt(m[1], 10);
        const mm = parseInt(m[2], 10);
        const dd = parseInt(m[3], 10);
        if (yyyy >= 1900 && yyyy <= 2100 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
            const fixed = validateAndFixDate(yyyy, mm, dd);
            const dateStr = `${fixed.year}-${String(fixed.month).padStart(2, '0')}-${String(fixed.day).padStart(2, '0')}`;
            if (trackCorrections && fixed.corrected) {
                return {
                    date: dateStr,
                    corrected: true,
                    originalValue: originalValue,
                    correctionMessage: `Date corrected from ${yyyy}-${String(mm).padStart(2, '0')}-${String(fixed.originalDay).padStart(2, '0')} to ${dateStr} (invalid day for month)`
                };
            }
            return trackCorrections ? { date: dateStr, corrected: false, originalValue: originalValue } : dateStr;
        }
    }
    // Try DD-MM-YYYY or MM-DD-YYYY (need to detect which format)
    // Common patterns: MM/DD/YYYY (US) or DD/MM/YYYY (European)
    // Since we see "06/31/2025", this is likely MM/DD/YYYY format
    m = norm.match(/^\s*(\d{1,2})-(\d{1,2})-(\d{4})\s*$/);
    if (m) {
        const first = parseInt(m[1], 10);
        const second = parseInt(m[2], 10);
        const yyyy = parseInt(m[3], 10);
        
        if (yyyy >= 1900 && yyyy <= 2100) {
            let mm, dd;
            // Heuristic: If first number > 12, it's likely DD-MM-YYYY format
            if (first > 12 && second <= 12) {
                // DD-MM-YYYY format
                dd = first;
                mm = second;
            } else if (first <= 12 && second <= 31) {
                // MM-DD-YYYY format (US format - more common in Excel)
                mm = first;
                dd = second;
            } else {
                // Try DD-MM-YYYY as fallback
                dd = first;
                mm = second;
            }
            
            if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
                const fixed = validateAndFixDate(yyyy, mm, dd);
                const dateStr = `${fixed.year}-${String(fixed.month).padStart(2, '0')}-${String(fixed.day).padStart(2, '0')}`;
                if (trackCorrections && fixed.corrected) {
                    return {
                        date: dateStr,
                        corrected: true,
                        originalValue: originalValue,
                        correctionMessage: `Date corrected from ${yyyy}-${String(mm).padStart(2, '0')}-${String(fixed.originalDay).padStart(2, '0')} to ${dateStr} (invalid day for month)`
                    };
                }
                return trackCorrections ? { date: dateStr, corrected: false, originalValue: originalValue } : dateStr;
            }
        }
    }
    
    // If all parsing fails, return null instead of the original string to avoid database errors
    console.warn(`Could not parse date: "${s}"`);
    return trackCorrections ? null : null;
};

const mapRowUsingHeaderMap = (headers, row, trackCorrections = false) => {
    const obj = {};
    const corrections = [];
    
    for (let i = 0; i < headers.length; i++) {
        const rawHeader = headers[i];
        const normalized = normalizeHeader(rawHeader);
        const canonical = variantToCanonical[normalized] || rawHeader; // keep unknowns
        let value = row[i];
        
        // Normalize dates (Excel Date objects or strings) to YYYY-MM-DD
        if (canonical === 'StartDate' || canonical === 'EndDate' || /date/i.test(String(canonical))) {
            const dateResult = parseDateToYMD(value, trackCorrections);
            if (trackCorrections && dateResult && dateResult.corrected) {
                corrections.push({
                    field: canonical,
                    originalValue: dateResult.originalValue,
                    correctedValue: dateResult.date,
                    message: dateResult.correctionMessage
                });
                value = dateResult.date;
            } else if (trackCorrections && dateResult && dateResult.date) {
                value = dateResult.date;
            } else if (!trackCorrections) {
                value = dateResult;
            }
        }
        
        obj[canonical] = value === '' ? null : value;
    }
    
    if (trackCorrections) {
        return { row: obj, corrections };
    }
    return obj;
};
/**
 * @route POST /api/projects/import-data
 * @description Preview project data from uploaded file
 */
router.post('/import-data', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const filePath = req.file.path;
    try {
        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length < 2) {
            fs.unlink(filePath, () => {});
            return res.status(400).json({ success: false, message: 'Uploaded Excel file is empty or has no data rows.' });
        }

        const headers = rawData[0];
        // Filter out completely empty rows to avoid processing millions of empty rows
        const dataRows = rawData.slice(1).filter(row => {
            if (!row || !Array.isArray(row)) return false;
            // Check if row has any non-empty cells
            return row.some(cell => {
                return cell !== undefined && cell !== null && cell !== '';
            });
        });

        // Build unrecognized headers list
        const normalizedKnown = new Set(Object.keys(variantToCanonical));
        const unrecognizedHeaders = [];
        headers.forEach(h => {
            const norm = normalizeHeader(h);
            if (!normalizedKnown.has(norm) && !Object.prototype.hasOwnProperty.call(projectHeaderMap, h)) {
                // Allow canonical headers to pass even if not normalized in map
                const isCanonical = Object.keys(projectHeaderMap).includes(h);
                if (!isCanonical && !unrecognizedHeaders.includes(h)) {
                    unrecognizedHeaders.push(h);
                }
            }
        });

        // Track corrections during preview
        const allCorrections = [];
        const fullDataWithCorrections = dataRows.map(r => {
            const result = mapRowUsingHeaderMap(headers, r, true);
            if (result.corrections && result.corrections.length > 0) {
                allCorrections.push(...result.corrections.map(c => ({
                    ...c,
                    row: dataRows.indexOf(r) + 2 // Excel row number (1-indexed header + row index)
                })));
            }
            return result.row;
        }).filter(row => {
            // Skip rows where project name is empty, null, or has less than 3 characters
            const projectName = (row.projectName || row.Project_Name || row['Project Name'] || '').toString().trim();
            return projectName && projectName.length >= 3;
        });
        
        const fullData = fullDataWithCorrections;
        const previewLimit = 10;
        const previewData = fullData.slice(0, previewLimit);

        fs.unlink(filePath, () => {});
        return res.status(200).json({
            success: true,
            message: `File parsed successfully. Review ${previewData.length} of ${fullData.length} rows.${allCorrections.length > 0 ? ` ${allCorrections.length} data correction(s) applied.` : ''}`,
            previewData,
            headers,
            fullData,
            unrecognizedHeaders,
            corrections: allCorrections.length > 0 ? allCorrections : undefined
        });
    } catch (err) {
        fs.unlink(filePath, () => {});
        console.error('Project import preview error:', err);
        return res.status(500).json({ success: false, message: `File parsing failed: ${err.message}` });
    }
});

/**
 * @route POST /api/projects/check-metadata-mapping
 * @description Check metadata mappings for import data (departments, directorates, wards, subcounties)
 */
router.post('/check-metadata-mapping', async (req, res) => {
    const { dataToImport } = req.body || {};
    if (!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) {
        return res.status(400).json({ success: false, message: 'No data provided for metadata mapping check.' });
    }

    // Enhanced normalization: trim, normalize spaces/slashes, handle apostrophes, collapse multiple spaces
    const normalizeStr = (v) => {
        if (typeof v !== 'string') return v;
        let normalized = v.trim();
        // Remove apostrophes (handle different apostrophe characters: ', ', ', `, and Unicode variants)
        // Use a more comprehensive pattern to catch all apostrophe-like characters
        normalized = normalized.replace(/[''"`\u0027\u2018\u2019\u201A\u201B\u2032\u2035]/g, '');
        // Normalize slashes: remove spaces around existing slashes
        normalized = normalized.replace(/\s*\/\s*/g, '/');
        // Collapse multiple spaces to single space
        normalized = normalized.replace(/\s+/g, ' ');
        // Don't automatically convert spaces to slashes - this causes issues with names like "Kisumu Central"
        // The matching logic will handle both space and slash variations
        return normalized;
    };

    // Normalize alias for matching: remove &, commas, and spaces, then lowercase
    // This allows "WECV&NR", "WECVNR", "WE,CV,NR" to all match
    const normalizeAlias = (v) => {
        if (typeof v !== 'string') return v;
        return normalizeStr(v)
            .replace(/[&,]/g, '')  // Remove ampersands and commas
            .replace(/\s+/g, '')   // Remove all spaces
            .toLowerCase();         // Lowercase for case-insensitive matching
    };

    let connection;
    const mappingSummary = {
        departments: { existing: [], new: [], unmatched: [] },
        directorates: { existing: [], new: [], unmatched: [] },
        wards: { existing: [], new: [], unmatched: [] },
        subcounties: { existing: [], new: [], unmatched: [] },
        financialYears: { existing: [], new: [], unmatched: [] },
        totalRows: dataToImport.length,
        rowsWithUnmatchedMetadata: []
    };

    try {
        connection = await pool.getConnection();

        // Collect unique values from all rows
        const uniqueDepartments = new Set();
        const uniqueDirectorates = new Set();
        const uniqueWards = new Set();
        const uniqueSubcounties = new Set();
        const uniqueFinancialYears = new Set();

        dataToImport.forEach((row, index) => {
            // Skip rows where project name is empty, null, or has less than 3 characters
            const projectName = (row.projectName || row.Project_Name || row['Project Name'] || '').toString().trim();
            if (!projectName || projectName.length < 3) {
                return; // Skip this row
            }
            
            const dept = normalizeStr(row.department || row.Department);
            const directorate = normalizeStr(row.directorate || row.Directorate);
            const ward = normalizeStr(row.ward || row.Ward || row['Ward Name']);
            const subcounty = normalizeStr(row['sub-county'] || row.SubCounty || row['Sub County'] || row.Subcounty);
            const finYear = normalizeStr(row.financialYear || row.FinancialYear || row['Financial Year'] || row.ADP || row.Year);

            if (dept) uniqueDepartments.add(dept);
            if (directorate) uniqueDirectorates.add(directorate);
            if (ward) uniqueWards.add(ward);
            if (subcounty) uniqueSubcounties.add(subcounty);
            if (finYear) uniqueFinancialYears.add(finYear);
        });

        // Check departments (by name and alias)
        if (uniqueDepartments.size > 0) {
            const deptList = Array.from(uniqueDepartments);
            // Get all departments and check manually (to handle comma-separated aliases properly)
            const [allDepts] = await connection.query(
                `SELECT name, alias FROM kemri_departments 
                 WHERE (voided IS NULL OR voided = 0)`
            );
            const existingNames = new Set();
            const existingAliases = new Set();
            const aliasMap = new Map(); // Map alias -> name for tracking
            
            allDepts.forEach(d => {
                if (d.name) existingNames.add(normalizeStr(d.name).toLowerCase()); // Store lowercase for case-insensitive matching
                if (d.alias) {
                    // Store normalized alias (without &, commas, spaces) for flexible matching
                    const normalizedAlias = normalizeAlias(d.alias);
                    existingAliases.add(normalizedAlias);
                    aliasMap.set(normalizedAlias, d.name);
                    
                    // Also store split parts (for backwards compatibility)
                    const aliases = d.alias.split(',').map(a => normalizeStr(a).toLowerCase());
                    aliases.forEach(a => {
                        existingAliases.add(a);
                        aliasMap.set(a, d.name);
                    });
                    
                    // Also store full alias string (normalized)
                    const fullAlias = normalizeStr(d.alias).toLowerCase();
                    existingAliases.add(fullAlias);
                    aliasMap.set(fullAlias, d.name);
                }
            });
            
            deptList.forEach(dept => {
                const normalizedDept = normalizeStr(dept).toLowerCase(); // Case-insensitive matching
                const normalizedDeptAlias = normalizeAlias(dept); // Alias-style normalization (no &, commas, spaces)
                let found = false;
                
                // Check against existing names (case-insensitive) - direct Set lookup
                if (existingNames.has(normalizedDept)) {
                    mappingSummary.departments.existing.push(dept);
                    found = true;
                }
                
                // Check against aliases (case-insensitive) - try both normalizations
                if (!found && (existingAliases.has(normalizedDept) || existingAliases.has(normalizedDeptAlias))) {
                    mappingSummary.departments.existing.push(dept);
                    found = true;
                }
                
                if (!found) {
                    mappingSummary.departments.new.push(dept);
                }
            });
        }

        // Check directorates (sections) - by name and alias
        if (uniqueDirectorates.size > 0) {
            const dirList = Array.from(uniqueDirectorates);
            // Get all sections and check manually (to handle comma-separated aliases properly)
            const [allSections] = await connection.query(
                `SELECT name, alias FROM kemri_sections 
                 WHERE (voided IS NULL OR voided = 0)`
            );
            const existingNames = new Set();
            const existingAliases = new Set();
            
            allSections.forEach(d => {
                if (d.name) existingNames.add(normalizeStr(d.name).toLowerCase()); // Store lowercase for case-insensitive matching
                if (d.alias) {
                    // Store normalized alias (without &, commas, spaces) for flexible matching
                    const normalizedAlias = normalizeAlias(d.alias);
                    existingAliases.add(normalizedAlias);
                    
                    // Also store split parts (for backwards compatibility)
                    const aliases = d.alias.split(',').map(a => normalizeStr(a).toLowerCase());
                    aliases.forEach(a => existingAliases.add(a));
                    
                    // Also store full alias string (normalized)
                    const fullAlias = normalizeStr(d.alias).toLowerCase();
                    existingAliases.add(fullAlias);
                }
            });
            
            dirList.forEach(dir => {
                const normalizedDir = normalizeStr(dir).toLowerCase(); // Case-insensitive matching
                const normalizedDirAlias = normalizeAlias(dir); // Alias-style normalization (no &, commas, spaces)
                let found = false;
                
                // Check against existing names (case-insensitive) - direct Set lookup
                if (existingNames.has(normalizedDir)) {
                    mappingSummary.directorates.existing.push(dir);
                    found = true;
                }
                
                // Check against aliases (case-insensitive) - try both normalizations
                if (!found && (existingAliases.has(normalizedDir) || existingAliases.has(normalizedDirAlias))) {
                    mappingSummary.directorates.existing.push(dir);
                    found = true;
                }
                
                if (!found) {
                    mappingSummary.directorates.new.push(dir);
                }
            });
        }

        // Check wards (case-insensitive matching)
        if (uniqueWards.size > 0) {
            const wardList = Array.from(uniqueWards);
            // Get all wards and do case-insensitive matching
            const [allWards] = await connection.query(
                `SELECT name FROM kemri_wards WHERE (voided IS NULL OR voided = 0)`
            );
            // Create a case-insensitive map: lowercase name -> actual name
            // Store both the normalized version and variations (with/without slashes, word order variations)
            const wardNameMap = new Map();
            const wardWordSetMap = new Map(); // Map of sorted word sets -> actual name (for order-independent matching)
            
            allWards.forEach(w => {
                if (w.name) {
                    const normalized = normalizeStr(w.name).toLowerCase();
                    wardNameMap.set(normalized, w.name);
                    // Also store with space converted to slash and vice versa for flexible matching
                    const withSlash = normalized.replace(/\s+/g, '/');
                    if (withSlash !== normalized) {
                        wardNameMap.set(withSlash, w.name);
                    }
                    const withSpace = normalized.replace(/\//g, ' ');
                    if (withSpace !== normalized) {
                        wardNameMap.set(withSpace, w.name);
                    }
                    
                    // Create a word set for order-independent matching
                    const words = normalized.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                    if (words) {
                        wardWordSetMap.set(words, w.name);
                    }
                }
            });
            
            wardList.forEach(ward => {
                // Strip "Ward" suffix if present (case-insensitive)
                let wardName = normalizeStr(ward).toLowerCase();
                wardName = wardName.replace(/\s+ward\s*$/i, '').trim();
                
                let found = false;
                
                // Try exact match first
                if (wardNameMap.has(wardName)) {
                    mappingSummary.wards.existing.push(ward);
                    found = true;
                } else {
                    // Try with space converted to slash (for compound names like "Masogo Nyangoma" -> "Masogo/Nyangoma")
                    const withSlash = wardName.replace(/\s+/g, '/');
                    if (wardNameMap.has(withSlash)) {
                        mappingSummary.wards.existing.push(ward);
                        found = true;
                    } else {
                        // Try with slash converted to space (for cases like "KISUMU/CENTRAL" -> "KISUMU CENTRAL")
                        const withSpace = wardName.replace(/\//g, ' ');
                        if (wardNameMap.has(withSpace)) {
                            mappingSummary.wards.existing.push(ward);
                            found = true;
                        } else {
                            // Try order-independent matching (e.g., "Nyangoma Masogo" matches "Masogo/Nyangoma")
                            const words = wardName.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                            if (words && wardWordSetMap.has(words)) {
                                mappingSummary.wards.existing.push(ward);
                                found = true;
                            }
                        }
                    }
                }
                
                if (!found) {
                    mappingSummary.wards.new.push(ward);
                }
            });
        }

        // Check subcounties (case-insensitive matching)
        if (uniqueSubcounties.size > 0) {
            const subcountyList = Array.from(uniqueSubcounties);
            // Get all subcounties and do case-insensitive matching
            const [allSubcounties] = await connection.query(
                `SELECT name FROM kemri_subcounties WHERE (voided IS NULL OR voided = 0)`
            );
            // Create a case-insensitive map: lowercase name -> actual name
            // Store both the normalized version and variations (with/without slashes, word order variations)
            const subcountyNameMap = new Map();
            const subcountyWordSetMap = new Map(); // Map of sorted word sets -> actual name (for order-independent matching)
            
            allSubcounties.forEach(s => {
                if (s.name) {
                    const normalized = normalizeStr(s.name).toLowerCase();
                    subcountyNameMap.set(normalized, s.name);
                    // Also store with space converted to slash and vice versa for flexible matching
                    const withSlash = normalized.replace(/\s+/g, '/');
                    if (withSlash !== normalized) {
                        subcountyNameMap.set(withSlash, s.name);
                    }
                    const withSpace = normalized.replace(/\//g, ' ');
                    if (withSpace !== normalized) {
                        subcountyNameMap.set(withSpace, s.name);
                    }
                    
                    // Create a word set for order-independent matching
                    const words = normalized.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                    if (words) {
                        subcountyWordSetMap.set(words, s.name);
                    }
                }
            });
            
            subcountyList.forEach(subcounty => {
                // Strip "SC" or "Subcounty" or "Sub County" suffix if present (case-insensitive)
                let subcountyName = normalizeStr(subcounty).toLowerCase();
                subcountyName = subcountyName.replace(/\s+sc\s*$/i, '').trim();
                subcountyName = subcountyName.replace(/\s+subcounty\s*$/i, '').trim();
                subcountyName = subcountyName.replace(/\s+sub\s+county\s*$/i, '').trim();
                
                let found = false;
                
                // Try exact match first
                if (subcountyNameMap.has(subcountyName)) {
                    mappingSummary.subcounties.existing.push(subcounty);
                    found = true;
                } else {
                    // Try with space converted to slash (for compound names)
                    const withSlash = subcountyName.replace(/\s+/g, '/');
                    if (subcountyNameMap.has(withSlash)) {
                        mappingSummary.subcounties.existing.push(subcounty);
                        found = true;
                    } else {
                        // Try with slash converted to space
                        const withSpace = subcountyName.replace(/\//g, ' ');
                        if (subcountyNameMap.has(withSpace)) {
                            mappingSummary.subcounties.existing.push(subcounty);
                            found = true;
                        } else {
                            // Try order-independent matching (e.g., "Nyangoma Masogo" matches "Masogo/Nyangoma")
                            const words = subcountyName.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                            if (words && subcountyWordSetMap.has(words)) {
                                mappingSummary.subcounties.existing.push(subcounty);
                                found = true;
                            }
                        }
                    }
                }
                
                if (!found) {
                    mappingSummary.subcounties.new.push(subcounty);
                }
            });
        }

        // Check financial years (with flexible matching for formats like "FY2014/2015", "fy2014/2015", "2014/2015", "2014-2015", "fy 2014-2015")
        if (uniqueFinancialYears.size > 0) {
            const fyList = Array.from(uniqueFinancialYears);
            // Get all financial years and do flexible matching (exclude voided)
            const [allFYs] = await connection.query(
                `SELECT finYearName FROM kemri_financialyears WHERE (voided IS NULL OR voided = 0)`
            );
            
            // Normalize financial year name: strip FY prefix, normalize separators to slash, lowercase
            // Also handles concatenated years like "20232024" -> "2023/2024"
            const normalizeFinancialYear = (name, trackCorrections = false) => {
                if (!name) return trackCorrections ? { normalized: '', corrected: false, originalValue: '' } : '';
                
                const originalValue = String(name).trim();
                
                // Convert to string if not already, and normalize
                let strValue = '';
                if (typeof name === 'string') {
                    strValue = name.trim();
                } else {
                    strValue = String(name || '').trim();
                }
                
                if (!strValue) return trackCorrections ? { normalized: '', corrected: false, originalValue: originalValue } : '';
                
                let normalized = strValue.toLowerCase();
                let wasCorrected = false;
                
                // Check for concatenated years like "20232024" (8 digits) or "2023-2024" (without separator)
                // Pattern: 4 digits followed by 4 digits (e.g., "20232024")
                const concatenatedMatch = normalized.match(/^(\d{4})(\d{4})$/);
                if (concatenatedMatch) {
                    const year1 = concatenatedMatch[1];
                    const year2 = concatenatedMatch[2];
                    // Validate years are reasonable (1900-2100 range and consecutive)
                    const y1 = parseInt(year1, 10);
                    const y2 = parseInt(year2, 10);
                    if (y1 >= 1900 && y1 <= 2100 && y2 >= 1900 && y2 <= 2100 && y2 === y1 + 1) {
                        normalized = `${year1}/${year2}`;
                        wasCorrected = true;
                    }
                }
                
                // Remove FY or fy prefix (with optional space)
                normalized = normalized.replace(/^fy\s*/i, '');
                // Normalize all separators (space, dash) to slash
                normalized = normalized.replace(/[\s\-]/g, '/');
                // Remove any extra slashes
                normalized = normalized.replace(/\/+/g, '/');
                const finalNormalized = normalized.trim();
                
                if (trackCorrections && wasCorrected) {
                    return {
                        normalized: finalNormalized,
                        corrected: true,
                        originalValue: originalValue,
                        correctionMessage: `Financial year corrected from "${originalValue}" to "${finalNormalized}" (concatenated years split)`
                    };
                }
                
                return trackCorrections ? {
                    normalized: finalNormalized,
                    corrected: false,
                    originalValue: originalValue,
                    correctionMessage: null
                } : finalNormalized;
            };
            
            // Create a map: normalized year (e.g., "2014/2015") -> actual database name (e.g., "FY2014/2015")
            const fyNormalizedMap = new Map();
            
            allFYs.forEach(fy => {
                if (fy.finYearName) {
                    const normalized = normalizeFinancialYear(fy.finYearName);
                    // Store the normalized version pointing to the actual database name
                    fyNormalizedMap.set(normalized, fy.finYearName);
                }
            });
            
            fyList.forEach(fy => {
                const normalizedFY = normalizeFinancialYear(fy);
                let found = false;
                
                // Check if normalized version exists in database
                if (normalizedFY && fyNormalizedMap.has(normalizedFY)) {
                    mappingSummary.financialYears.existing.push(fy);
                    found = true;
                }
                
                if (!found) {
                    mappingSummary.financialYears.new.push(fy);
                }
            });
        }

        // Identify rows with unmatched metadata (for warnings)
        dataToImport.forEach((row, index) => {
            // Skip rows where project name is empty, null, or has less than 3 characters
            const projectName = (row.projectName || row.Project_Name || row['Project Name'] || '').toString().trim();
            if (!projectName || projectName.length < 3) {
                return; // Skip this row
            }
            
            const dept = normalizeStr(row.department || row.Department);
            const ward = normalizeStr(row.ward || row.Ward || row['Ward Name']);
            const subcounty = normalizeStr(row['sub-county'] || row.SubCounty || row['Sub County'] || row.Subcounty);
            const finYear = normalizeStr(row.financialYear || row.FinancialYear || row['Financial Year'] || row.ADP || row.Year);
            
            const unmatched = [];
            if (dept && !mappingSummary.departments.existing.includes(dept) && !mappingSummary.departments.new.includes(dept)) {
                unmatched.push(`Department: ${dept}`);
            }
            if (ward && !mappingSummary.wards.existing.includes(ward) && !mappingSummary.wards.new.includes(ward)) {
                unmatched.push(`Ward: ${ward}`);
            }
            if (subcounty && !mappingSummary.subcounties.existing.includes(subcounty) && !mappingSummary.subcounties.new.includes(subcounty)) {
                unmatched.push(`Sub-county: ${subcounty}`);
            }
            if (finYear && !mappingSummary.financialYears.existing.includes(finYear) && !mappingSummary.financialYears.new.includes(finYear)) {
                unmatched.push(`Financial Year: ${finYear}`);
            }
            
            if (unmatched.length > 0) {
                mappingSummary.rowsWithUnmatchedMetadata.push({
                    rowNumber: index + 2, // +2 because index is 0-based and Excel rows start at 2 (header + 1)
                    projectName: normalizeStr(row.projectName || row.Project_Name || row['Project Name']) || 
                                normalizeStr(row.ProjectRefNum || row.Project_Ref_Num || row['Project Ref Num']) || 
                                `Row ${index + 2}`,
                    unmatched: unmatched
                });
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Metadata mapping check completed',
            mappingSummary
        });
    } catch (err) {
        console.error('Metadata mapping check error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to check metadata mappings',
            error: err.message 
        });
    } finally {
        if (connection) connection.release();
    }
});

/**
 * @route POST /api/projects/confirm-import-data
 * @description Confirm and import project data
 */
router.post('/confirm-import-data', async (req, res) => {
    const { dataToImport } = req.body || {};
    if (!dataToImport || !Array.isArray(dataToImport) || dataToImport.length === 0) {
        return res.status(400).json({ success: false, message: 'No data provided for import confirmation.' });
    }

    const toBool = (v) => {
        if (typeof v === 'number') return v !== 0;
        if (typeof v === 'boolean') return v;
        if (typeof v === 'string') {
            const s = v.trim().toLowerCase();
            return ['1','true','yes','y','contracted'].includes(s);
        }
        return false;
    };

    // Enhanced normalization: trim, normalize spaces/slashes, handle apostrophes, collapse multiple spaces
    const normalizeStr = (v) => {
        if (typeof v !== 'string') return v;
        let normalized = v.trim();
        // Remove apostrophes (handle different apostrophe characters: ', ', ', `, and Unicode variants)
        // Use a more comprehensive pattern to catch all apostrophe-like characters
        normalized = normalized.replace(/[''"`\u0027\u2018\u2019\u201A\u201B\u2032\u2035]/g, '');
        // Normalize slashes: remove spaces around existing slashes
        normalized = normalized.replace(/\s*\/\s*/g, '/');
        // Collapse multiple spaces to single space
        normalized = normalized.replace(/\s+/g, ' ');
        // Don't automatically convert spaces to slashes - this causes issues with names like "Kisumu Central"
        // The matching logic will handle both space and slash variations
        return normalized;
    };

    // Normalize alias for matching: remove &, commas, and spaces, then lowercase
    // This allows "WECV&NR", "WECVNR", "WE,CV,NR" to all match
    const normalizeAlias = (v) => {
        if (typeof v !== 'string') return v;
        return normalizeStr(v)
            .replace(/[&,]/g, '')  // Remove ampersands and commas
            .replace(/\s+/g, '')   // Remove all spaces
            .toLowerCase();         // Lowercase for case-insensitive matching
    };

    let connection;
    const summary = { 
        projectsCreated: 0, 
        projectsUpdated: 0, 
        linksCreated: 0, 
        errors: [],
        dataCorrections: [], // Track date and financial year corrections
        skippedMetadata: {
            departments: [],
            directorates: [],
            wards: [],
            subcounties: [],
            financialYears: []
        }
    };

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        for (let i = 0; i < dataToImport.length; i++) {
            const row = dataToImport[i] || {};
            try {
                const projectName = normalizeStr(row.projectName || row.Project_Name || row['Project Name']);
                const projectRef = normalizeStr(row.ProjectRefNum || row.Project_Ref_Num || row['Project Ref Num']);
                
                // Skip rows where project name is empty, null, or has less than 3 characters
                const projectNameStr = (projectName || '').toString().trim();
                if (!projectNameStr || projectNameStr.length < 3) {
                    continue; // Skip this row
                }
                
                if (!projectName && !projectRef) {
                    throw new Error('Missing projectName and ProjectRefNum');
                }

                // Resolve departmentId by name or alias (DO NOT create if missing) - case-insensitive
                const departmentName = normalizeStr(row.department || row.Department);
                let departmentId = null;
                if (departmentName) {
                    // Get all departments and check manually (to handle comma-separated aliases properly)
                    const [allDepts] = await connection.query(
                        `SELECT departmentId, name, alias FROM kemri_departments 
                         WHERE (voided IS NULL OR voided = 0)`
                    );
                    const normalizedDeptName = departmentName.toLowerCase(); // Case-insensitive matching
                    let found = false;
                    for (const dept of allDepts) {
                        // Check name (case-insensitive)
                        if (dept.name && normalizeStr(dept.name).toLowerCase() === normalizedDeptName) {
                            departmentId = dept.departmentId;
                            found = true;
                            break;
                        }
                        // Check alias - both full alias and split parts (case-insensitive)
                        // Also check with alias normalization (ignoring &, commas, spaces)
                        if (dept.alias) {
                            const fullAlias = normalizeStr(dept.alias).toLowerCase();
                            const normalizedAlias = normalizeAlias(dept.alias);
                            const normalizedDeptAlias = normalizeAlias(departmentName);
                            
                            if (fullAlias === normalizedDeptName || normalizedAlias === normalizedDeptAlias) {
                                departmentId = dept.departmentId;
                                found = true;
                                break;
                            }
                            // Check split aliases (case-insensitive)
                            const aliases = dept.alias.split(',').map(a => normalizeStr(a).toLowerCase());
                            if (aliases.includes(normalizedDeptName)) {
                                departmentId = dept.departmentId;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        // Track skipped metadata
                        if (!summary.skippedMetadata.departments.includes(departmentName)) {
                            summary.skippedMetadata.departments.push(departmentName);
                        }
                    }
                }

                // Resolve sectionId (directorate) by name or alias (DO NOT create if missing) - case-insensitive
                const directorateName = normalizeStr(row.directorate || row.Directorate);
                let sectionId = null;
                if (directorateName) {
                    // Get all sections and check manually (to handle comma-separated aliases properly)
                    const [allSections] = await connection.query(
                        `SELECT sectionId, name, alias, departmentId FROM kemri_sections 
                         WHERE (voided IS NULL OR voided = 0)`
                    );
                    const normalizedDirName = directorateName.toLowerCase(); // Case-insensitive matching
                    let matchingSections = [];
                    
                    for (const section of allSections) {
                        let matches = false;
                        // Check name (case-insensitive)
                        if (section.name && normalizeStr(section.name).toLowerCase() === normalizedDirName) {
                            matches = true;
                        }
                        // Check alias - both full alias and split parts (case-insensitive)
                        // Also check with alias normalization (ignoring &, commas, spaces)
                        if (!matches && section.alias) {
                            const fullAlias = normalizeStr(section.alias).toLowerCase();
                            const normalizedAlias = normalizeAlias(section.alias);
                            const normalizedDirAlias = normalizeAlias(directorateName);
                            
                            if (fullAlias === normalizedDirName || normalizedAlias === normalizedDirAlias) {
                                matches = true;
                            } else {
                                // Check split aliases (case-insensitive)
                                const aliases = section.alias.split(',').map(a => normalizeStr(a).toLowerCase());
                                if (aliases.includes(normalizedDirName)) {
                                    matches = true;
                                }
                            }
                        }
                        
                        if (matches) {
                            matchingSections.push(section);
                        }
                    }
                    
                    if (matchingSections.length > 0) {
                        // If we have a departmentId, prefer sections that belong to that department
                        if (departmentId) {
                            const matchingInDept = matchingSections.find(s => s.departmentId === departmentId);
                            if (matchingInDept) {
                                sectionId = matchingInDept.sectionId;
                            } else {
                                // If no match in department, use the first matching section
                                sectionId = matchingSections[0].sectionId;
                            }
                        } else {
                            // No departmentId, use the first matching section
                            sectionId = matchingSections[0].sectionId;
                        }
                    } else {
                        // Track skipped metadata
                        if (!summary.skippedMetadata.directorates.includes(directorateName)) {
                            summary.skippedMetadata.directorates.push(directorateName);
                        }
                    }
                }

                // Resolve financial year id by name (DO NOT create if missing) - with flexible matching
                const finYearName = normalizeStr(row.financialYear || row.FinancialYear || row['Financial Year'] || row.ADP || row.Year);
                let finYearId = null;
                if (finYearName) {
                    // Normalize financial year name: strip FY prefix, normalize separators, handle concatenated years
                    const normalizeFinancialYear = (name, trackCorrections = false) => {
                        if (!name) return trackCorrections ? { normalized: '', corrected: false, originalValue: '' } : '';
                        
                        const originalValue = String(name).trim();
                        let strValue = '';
                        if (typeof name === 'string') {
                            strValue = name.trim();
                        } else {
                            strValue = String(name || '').trim();
                        }
                        
                        if (!strValue) return trackCorrections ? { normalized: '', corrected: false, originalValue: originalValue } : '';
                        
                        let normalized = normalizeStr(strValue).toLowerCase();
                        let wasCorrected = false;
                        
                        // Check for concatenated years like "20232024" (8 digits)
                        const concatenatedMatch = normalized.match(/^(\d{4})(\d{4})$/);
                        if (concatenatedMatch) {
                            const year1 = concatenatedMatch[1];
                            const year2 = concatenatedMatch[2];
                            const y1 = parseInt(year1, 10);
                            const y2 = parseInt(year2, 10);
                            if (y1 >= 1900 && y1 <= 2100 && y2 >= 1900 && y2 <= 2100 && y2 === y1 + 1) {
                                normalized = `${year1}/${year2}`;
                                wasCorrected = true;
                            }
                        }
                        
                        // Remove FY or fy prefix (with optional space)
                        normalized = normalized.replace(/^fy\s*/i, '');
                        // Normalize all separators (space, dash) to slash
                        normalized = normalized.replace(/[\s\-]/g, '/');
                        // Remove any extra slashes
                        normalized = normalized.replace(/\/+/g, '/');
                        const finalNormalized = normalized.trim();
                        
                        if (trackCorrections && wasCorrected) {
                            return {
                                normalized: finalNormalized,
                                corrected: true,
                                originalValue: originalValue,
                                correctionMessage: `Financial year corrected from "${originalValue}" to "${finalNormalized}" (concatenated years split)`
                            };
                        }
                        
                        return trackCorrections ? {
                            normalized: finalNormalized,
                            corrected: false,
                            originalValue: originalValue
                        } : finalNormalized;
                    };
                    
                    const fyResult = normalizeFinancialYear(finYearName, true);
                    const normalizedFYName = fyResult.normalized || fyResult;
                    
                    if (fyResult.corrected) {
                        summary.dataCorrections.push({
                            row: i + 2,
                            field: 'financialYear',
                            originalValue: fyResult.originalValue,
                            correctedValue: normalizedFYName,
                            message: fyResult.correctionMessage
                        });
                    }
                    
                    // Fetch all financial years and match using normalized names
                    const [allFYs] = await connection.query(
                        'SELECT finYearId, finYearName FROM kemri_financialyears WHERE (voided IS NULL OR voided = 0)'
                    );
                    
                    let fyRows = [];
                    for (const fy of allFYs) {
                        if (fy.finYearName) {
                            const dbNormalized = normalizeFinancialYear(fy.finYearName, false);
                            if (dbNormalized === normalizedFYName) {
                                fyRows = [{ finYearId: fy.finYearId }];
                                break;
                            }
                        }
                    }
                    
                    if (fyRows.length > 0) {
                        finYearId = fyRows[0].finYearId;
                    } else {
                        // Track skipped metadata
                        if (!summary.skippedMetadata.financialYears.includes(finYearName)) {
                            summary.skippedMetadata.financialYears.push(finYearName);
                        }
                    }
                }

                // Prepare project payload
                const toMoney = (v) => (v != null ? Number(String(v).replace(/,/g, '')) : null);
                // Ensure dates are in YYYY-MM-DD format - track corrections
                const normalizeDate = (dateValue, fieldName) => {
                    if (!dateValue) return { date: null, corrected: false };
                    try {
                        // If already in YYYY-MM-DD format, return as-is
                        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
                            return { date: dateValue.split(' ')[0], corrected: false }; // Take only date part if there's time
                        }
                        // Try to parse if it's a date string or object
                        const parsed = parseDateToYMD(dateValue, true);
                        // Validate the parsed date is in correct format
                        if (parsed && parsed.date && typeof parsed.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
                            if (parsed.corrected) {
                                summary.dataCorrections.push({
                                    row: i + 2,
                                    field: fieldName,
                                    originalValue: parsed.originalValue,
                                    correctedValue: parsed.date,
                                    message: parsed.correctionMessage
                                });
                            }
                            return { date: parsed.date, corrected: parsed.corrected };
                        }
                        // If parsing failed or returned invalid format, return null
                        return { date: null, corrected: false };
                    } catch (dateErr) {
                        console.warn(`Date parsing error for value "${dateValue}":`, dateErr.message);
                        return { date: null, corrected: false };
                    }
                };
                const projectPayload = {
                    projectName: projectName || null,
                    ProjectRefNum: projectRef || null,
                    projectDescription: normalizeStr(row.ProjectDescription || row.Description) || null,
                    status: normalizeStr(row.Status) || null,
                    costOfProject: toMoney(row.budget),
                    paidOut: toMoney(row.amountPaid),
                    startDate: normalizeDate(row.StartDate, 'StartDate').date,
                    endDate: normalizeDate(row.EndDate, 'EndDate').date,
                    directorate: normalizeStr(row.directorate || row.Directorate) || null,
                    sectionId: sectionId, // Store sectionId when directorate is resolved
                    departmentId: departmentId,
                    finYearId: finYearId,
                    Contracted: toMoney(row.Contracted),
                };

                // Upsert by ProjectRefNum first, else by projectName
                let projectId = null;
                if (projectPayload.ProjectRefNum) {
                    const [existByRef] = await connection.query('SELECT id FROM kemri_projects WHERE ProjectRefNum = ?', [projectPayload.ProjectRefNum]);
                    if (existByRef.length > 0) {
                        projectId = existByRef[0].id;
                        await connection.query('UPDATE kemri_projects SET ? WHERE id = ?', [projectPayload, projectId]);
                        summary.projectsUpdated++;
                    }
                }
                if (!projectId && projectPayload.projectName) {
                    const [existByName] = await connection.query('SELECT id FROM kemri_projects WHERE projectName = ?', [projectPayload.projectName]);
                    if (existByName.length > 0) {
                        projectId = existByName[0].id;
                        await connection.query('UPDATE kemri_projects SET ? WHERE id = ?', [projectPayload, projectId]);
                        summary.projectsUpdated++;
                    }
                }
                if (!projectId) {
                    const [insProj] = await connection.query('INSERT INTO kemri_projects SET ?', projectPayload);
                    projectId = insProj.insertId;
                    summary.projectsCreated++;
                }

                // Link Subcounty (DO NOT create if missing) - case-insensitive matching with flexible space/slash/word-order handling
                const subCountyName = normalizeStr(row['sub-county'] || row.SubCounty || row['Sub County'] || row.Subcounty);
                if (subCountyName) {
                    // Strip "SC" or "Subcounty" or "Sub County" suffix if present (case-insensitive)
                    let cleanedSubCountyName = normalizeStr(subCountyName).toLowerCase();
                    cleanedSubCountyName = cleanedSubCountyName.replace(/\s+sc\s*$/i, '').trim();
                    cleanedSubCountyName = cleanedSubCountyName.replace(/\s+subcounty\s*$/i, '').trim();
                    cleanedSubCountyName = cleanedSubCountyName.replace(/\s+sub\s+county\s*$/i, '').trim();
                    
                    // Use case-insensitive matching with normalized spaces around slashes and apostrophes
                    const normalizedSubCountyName = cleanedSubCountyName;
                    // Split into words and create sorted word set for order-independent matching
                    const inputWords = normalizedSubCountyName.split(/[\s\/]+/).filter(w => w.length > 0).sort();
                    const inputWordSet = inputWords.join(' ');
                    
                    // Try exact match first, then try with space/slash variations, then word-order independent
                    const normalizedDbName = `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(name), ' / ', '/'), ' /', '/'), '/ ', '/'), '''', ''))`;
                    
                    // For word-order matching, we need to fetch and check in JavaScript
                    const [scRows] = await connection.query(
                        `SELECT subcountyId, ${normalizedDbName} as normalized_name FROM kemri_subcounties 
                         WHERE (${normalizedDbName} = ? OR ${normalizedDbName} = REPLACE(?, ' ', '/') OR ${normalizedDbName} = REPLACE(?, '/', ' '))
                         AND (voided IS NULL OR voided = 0)`, 
                        [normalizedSubCountyName, normalizedSubCountyName, normalizedSubCountyName]
                    );
                    
                    // If no exact match, try word-order independent matching
                    let matchedRow = scRows[0];
                    if (!matchedRow) {
                        const [allScRows] = await connection.query(
                            `SELECT subcountyId, ${normalizedDbName} as normalized_name FROM kemri_subcounties 
                             WHERE (voided IS NULL OR voided = 0)`
                        );
                        for (const row of allScRows) {
                            if (row.normalized_name) {
                                const dbWords = row.normalized_name.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                                if (dbWords === inputWordSet) {
                                    matchedRow = row;
                                    break;
                                }
                            }
                        }
                    }
                    if (matchedRow) {
                        const subcountyId = matchedRow.subcountyId;
                        await connection.query('INSERT IGNORE INTO kemri_project_subcounties (projectId, subcountyId) VALUES (?, ?)', [projectId, subcountyId]);
                        summary.linksCreated++;
                    } else {
                        // Track skipped metadata
                        if (!summary.skippedMetadata.subcounties.includes(subCountyName)) {
                            summary.skippedMetadata.subcounties.push(subCountyName);
                        }
                    }
                }

                // Link Ward (DO NOT create if missing) - case-insensitive matching with flexible space/slash/word-order handling
                const wardName = normalizeStr(row.ward || row.Ward || row['Ward Name']);
                if (wardName) {
                    // Strip "Ward" suffix if present (case-insensitive)
                    let cleanedWardName = normalizeStr(wardName).toLowerCase();
                    cleanedWardName = cleanedWardName.replace(/\s+ward\s*$/i, '').trim();
                    
                    // Use case-insensitive matching with normalized spaces around slashes and apostrophes
                    const normalizedWardName = cleanedWardName;
                    // Split into words and create sorted word set for order-independent matching
                    const inputWords = normalizedWardName.split(/[\s\/]+/).filter(w => w.length > 0).sort();
                    const inputWordSet = inputWords.join(' ');
                    
                    // Try exact match first, then try with space/slash variations, then word-order independent
                    const normalizedDbName = `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(TRIM(name), ' / ', '/'), ' /', '/'), '/ ', '/'), '''', ''))`;
                    
                    // For word-order matching, we need to fetch and check in JavaScript
                    const [wRows] = await connection.query(
                        `SELECT wardId, ${normalizedDbName} as normalized_name FROM kemri_wards 
                         WHERE (${normalizedDbName} = ? OR ${normalizedDbName} = REPLACE(?, ' ', '/') OR ${normalizedDbName} = REPLACE(?, '/', ' '))
                         AND (voided IS NULL OR voided = 0)`, 
                        [normalizedWardName, normalizedWardName, normalizedWardName]
                    );
                    
                    // If no exact match, try word-order independent matching
                    let matchedRow = wRows[0];
                    if (!matchedRow) {
                        const [allWRows] = await connection.query(
                            `SELECT wardId, ${normalizedDbName} as normalized_name FROM kemri_wards 
                             WHERE (voided IS NULL OR voided = 0)`
                        );
                        for (const row of allWRows) {
                            if (row.normalized_name) {
                                const dbWords = row.normalized_name.split(/[\s\/]+/).filter(w => w.length > 0).sort().join(' ');
                                if (dbWords === inputWordSet) {
                                    matchedRow = row;
                                    break;
                                }
                            }
                        }
                    }
                    if (matchedRow) {
                        const wardId = matchedRow.wardId;
                        await connection.query('INSERT IGNORE INTO kemri_project_wards (projectId, wardId) VALUES (?, ?)', [projectId, wardId]);
                        summary.linksCreated++;
                    } else {
                        // Track skipped metadata
                        if (!summary.skippedMetadata.wards.includes(wardName)) {
                            summary.skippedMetadata.wards.push(wardName);
                        }
                    }
                }

                // Link Contractor (AUTO-CREATE if not exists) - with careful validation
                const contractorName = normalizeStr(row.contractor || row.Contractor || row.contractorName || row['Contractor Name']);
                if (contractorName) {
                    // Validate contractor name is not empty after normalization
                    if (!contractorName.trim()) {
                        console.warn(`Row ${i + 2}: Contractor name is empty after normalization, skipping contractor assignment`);
                    } else {
                        // Check if contractor exists by companyName (case-insensitive, normalized)
                        const normalizedContractorName = normalizeStr(contractorName).trim();
                        const [existingContractors] = await connection.query(
                            `SELECT contractorId, companyName, email FROM kemri_contractors 
                             WHERE LOWER(TRIM(REPLACE(REPLACE(companyName, '''', ''), ' ', ''))) = LOWER(REPLACE(REPLACE(?, '''', ''), ' ', ''))
                             AND (voided IS NULL OR voided = 0)
                             LIMIT 1`,
                            [normalizedContractorName]
                        );
                        
                        let contractorId = null;
                        
                        if (existingContractors.length > 0) {
                            // Contractor exists, use it
                            contractorId = existingContractors[0].contractorId;
                        } else {
                            // Contractor doesn't exist, create it with validation
                            // Validate companyName is not empty
                            if (!normalizedContractorName || normalizedContractorName.length < 2) {
                                console.warn(`Row ${i + 2}: Contractor name "${contractorName}" is too short, skipping contractor creation`);
                            } else {
                                // Extract optional fields from import data
                                const contractorEmail = normalizeStr(row.contractorEmail || row['Contractor Email'] || row.contractor_email);
                                const contractorPhone = normalizeStr(row.contractorPhone || row['Contractor Phone'] || row.contractor_phone);
                                const contactPerson = normalizeStr(row.contactPerson || row['Contact Person'] || row.contact_person);
                                
                                // Generate email if not provided (based on companyName)
                                let finalEmail = contractorEmail;
                                if (!finalEmail || !finalEmail.trim()) {
                                    // Generate a safe email from company name
                                    const emailBase = normalizedContractorName
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]/g, '')
                                        .substring(0, 50); // Limit length
                                    finalEmail = `${emailBase}@contractor.local`;
                                } else {
                                    finalEmail = finalEmail.trim().toLowerCase();
                                }
                                
                                // Check if email already exists (email has unique constraint)
                                const [emailCheck] = await connection.query(
                                    'SELECT contractorId FROM kemri_contractors WHERE email = ? AND (voided IS NULL OR voided = 0) LIMIT 1',
                                    [finalEmail]
                                );
                                
                                if (emailCheck.length > 0) {
                                    // Email exists, use that contractor instead
                                    contractorId = emailCheck[0].contractorId;
                                    console.log(`Row ${i + 2}: Email "${finalEmail}" already exists, using existing contractor ID ${contractorId}`);
                                } else {
                                    // Create new contractor
                                    const userId = 1; // TODO: Get from authenticated user
                                    try {
                                        const [insertResult] = await connection.query(
                                            'INSERT INTO kemri_contractors (companyName, contactPerson, email, phone, userId) VALUES (?, ?, ?, ?, ?)',
                                            [normalizedContractorName, contactPerson || null, finalEmail, contractorPhone || null, userId]
                                        );
                                        contractorId = insertResult.insertId;
                                        console.log(`Row ${i + 2}: Created new contractor "${normalizedContractorName}" with ID ${contractorId}`);
                                    } catch (createErr) {
                                        // Handle unique constraint violation or other errors
                                        if (createErr.code === 'ER_DUP_ENTRY') {
                                            // Email or companyName might be duplicate, try to find existing
                                            const [duplicateCheck] = await connection.query(
                                                'SELECT contractorId FROM kemri_contractors WHERE companyName = ? AND (voided IS NULL OR voided = 0) LIMIT 1',
                                                [normalizedContractorName]
                                            );
                                            if (duplicateCheck.length > 0) {
                                                contractorId = duplicateCheck[0].contractorId;
                                                console.log(`Row ${i + 2}: Found duplicate contractor "${normalizedContractorName}", using ID ${contractorId}`);
                                            } else {
                                                console.error(`Row ${i + 2}: Error creating contractor "${normalizedContractorName}":`, createErr.message);
                                                // Continue without contractor assignment
                                            }
                                        } else {
                                            console.error(`Row ${i + 2}: Error creating contractor "${normalizedContractorName}":`, createErr.message);
                                            // Continue without contractor assignment
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Link contractor to project if we have a contractorId
                        if (contractorId) {
                            try {
                                await connection.query(
                                    'INSERT IGNORE INTO kemri_project_contractor_assignments (projectId, contractorId, assignmentDate, voided) VALUES (?, ?, NOW(), 0)',
                                    [projectId, contractorId]
                                );
                                summary.linksCreated++;
                            } catch (linkErr) {
                                // Log but don't fail the import if linking fails
                                console.warn(`Row ${i + 2}: Could not link contractor ${contractorId} to project ${projectId}:`, linkErr.message);
                            }
                        }
                    }
                }

            } catch (rowErr) {
                console.error(`Error processing row ${i + 2}:`, rowErr);
                const errorMsg = `Row ${i + 2}: ${rowErr.message || String(rowErr)}`;
                summary.errors.push(errorMsg);
                // Also log the full error for debugging
                if (rowErr.stack) {
                    console.error(`Row ${i + 2} error stack:`, rowErr.stack);
                }
            }
        }

        if (summary.errors.length > 0) {
            await connection.rollback();
            console.error('Import failed with errors:', summary.errors);
            return res.status(400).json({ 
                success: false, 
                message: 'Import failed with errors. No changes committed.', 
                details: { 
                    errors: summary.errors,
                    errorCount: summary.errors.length,
                    totalRows: dataToImport.length
                } 
            });
        }

        await connection.commit();
        
        // Build a message about skipped metadata
        const skippedMessages = [];
        if (summary.skippedMetadata.departments.length > 0) {
            skippedMessages.push(`${summary.skippedMetadata.departments.length} department(s): ${summary.skippedMetadata.departments.join(', ')}`);
        }
        if (summary.skippedMetadata.wards.length > 0) {
            skippedMessages.push(`${summary.skippedMetadata.wards.length} ward(s): ${summary.skippedMetadata.wards.join(', ')}`);
        }
        if (summary.skippedMetadata.subcounties.length > 0) {
            skippedMessages.push(`${summary.skippedMetadata.subcounties.length} sub-county(ies): ${summary.skippedMetadata.subcounties.join(', ')}`);
        }
        if (summary.skippedMetadata.financialYears.length > 0) {
            skippedMessages.push(`${summary.skippedMetadata.financialYears.length} financial year(s): ${summary.skippedMetadata.financialYears.join(', ')}`);
        }
        
        let message = 'Projects imported successfully';
        if (skippedMessages.length > 0) {
            message += `. Note: Some metadata was not found and was skipped: ${skippedMessages.join('; ')}. Please create these in Metadata Management.`;
        }
        
        return res.status(200).json({ success: true, message, details: summary });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Project import confirmation error:', err);
        return res.status(500).json({ 
            success: false, 
            message: err.message || 'Failed to import projects',
            details: { error: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined }
        });
    } finally {
        if (connection) connection.release();
    }
});

/**
 * @route GET /api/projects/template
 * @description Download project import template
 */
router.get('/template', async (req, res) => {
    try {
        // Resolve the path to the projects template stored under api/templates
        const templatePath = path.resolve(__dirname, '..', 'templates', 'projects_import_template.xlsx');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({ message: 'Projects template not found on server' });
        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="projects_import_template.xlsx"');
        return res.sendFile(templatePath);
    } catch (err) {
        console.error('Error serving projects template:', err);
        return res.status(500).json({ message: 'Failed to serve projects template' });
    }
});

// --- Analytics Endpoints (MUST come before parameterized routes) ---
/**
 * @route GET /api/projects/status-counts
 * @description Get count of projects by status
 */
router.get('/status-counts', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.status AS status,
                COUNT(p.id) AS count
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.status IS NOT NULL
            GROUP BY p.status
            ORDER BY p.status
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project status counts:', error);
        res.status(500).json({ message: 'Error fetching project status counts', error: error.message });
    }
});

/**
 * @route GET /api/projects/directorate-counts
 * @description Get count of projects by directorate
 */
router.get('/directorate-counts', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.directorate AS directorate,
                COUNT(p.id) AS count
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.directorate IS NOT NULL
            GROUP BY p.directorate
            ORDER BY p.directorate
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project directorate counts:', error);
        res.status(500).json({ message: 'Error fetching project directorate counts', error: error.message });
    }
});

/**
 * @route GET /api/projects/funding-overview
 * @description Get funding overview by status
 */
router.get('/funding-overview', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.status AS status,
                SUM(p.costOfProject) AS totalBudget,
                SUM(p.paidOut) AS totalPaid,
                COUNT(p.id) AS projectCount
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.status IS NOT NULL
            GROUP BY p.status
            ORDER BY p.status
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project funding overview:', error);
        res.status(500).json({ message: 'Error fetching project funding overview', error: error.message });
    }
});

/**
 * @route GET /api/projects/pi-counts
 * @description Get count of projects by principal investigator
 */
router.get('/pi-counts', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.principalInvestigator AS pi,
                COUNT(p.id) AS count
            FROM kemri_projects p
            WHERE p.voided = 0 AND p.principalInvestigator IS NOT NULL
            GROUP BY p.principalInvestigator
            ORDER BY count DESC
            LIMIT 10
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project PI counts:', error);
        res.status(500).json({ message: 'Error fetching project PI counts', error: error.message });
    }
});

/**
 * @route GET /api/projects/participants-per-project
 * @description Get participants per project
 */
router.get('/participants-per-project', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.projectName AS projectName,
                COUNT(pp.participantId) AS participantCount
            FROM kemri_projects p
            LEFT JOIN kemri_project_participants pp ON p.id = pp.projectId
            WHERE p.voided = 0
            GROUP BY p.id, p.projectName
            ORDER BY participantCount DESC
            LIMIT 10
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching participants per project:', error);
        res.status(500).json({ message: 'Error fetching participants per project', error: error.message });
    }
});

// NEW: Contractor Assignment Routes
/**
 * @route GET /api/projects/:projectId/contractors
 * @description Get all contractors assigned to a specific project.
 * @access Private
 */
router.get('/:projectId/contractors', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT c.* FROM kemri_contractors c
             JOIN kemri_project_contractor_assignments pca ON c.contractorId = pca.contractorId
             WHERE pca.projectId = ?`,
            [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching contractors for project:', error);
        res.status(500).json({ message: 'Error fetching contractors for project', error: error.message });
    }
});

/**
 * @route POST /api/projects/:projectId/assign-contractor
 * @description Assign a contractor to a project.
 * @access Private
 */
router.post('/:projectId/assign-contractor', async (req, res) => {
    const { projectId } = req.params;
    const { contractorId } = req.body;
    
    if (!contractorId) {
        return res.status(400).json({ message: 'Contractor ID is required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO kemri_project_contractor_assignments (projectId, contractorId) VALUES (?, ?)',
            [projectId, contractorId]
        );
        res.status(201).json({ message: 'Contractor assigned to project successfully.', assignmentId: result.insertId });
    } catch (error) {
        console.error('Error assigning contractor to project:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This contractor is already assigned to this project.' });
        }
        res.status(500).json({ message: 'Error assigning contractor to project', error: error.message });
    }
});

/**
 * @route DELETE /api/projects/:projectId/remove-contractor/:contractorId
 * @description Remove a contractor's assignment from a project.
 * @access Private
 */
router.delete('/:projectId/remove-contractor/:contractorId', async (req, res) => {
    const { projectId, contractorId } = req.params;
    try {
        const [result] = await pool.query(
            'DELETE FROM kemri_project_contractor_assignments WHERE projectId = ? AND contractorId = ?',
            [projectId, contractorId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error removing contractor assignment:', error);
        res.status(500).json({ message: 'Error removing contractor assignment', error: error.message });
    }
});


// NEW: Route for fetching payment requests for a project
router.get('/:projectId/payment-requests', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM kemri_project_payment_requests WHERE projectId = ? ORDER BY submittedAt DESC',
            [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching payment requests for project:', error);
        res.status(500).json({ message: 'Error fetching payment requests for project', error: error.message });
    }
});



// NEW: Route for fetching contractor photos for a project
router.get('/:projectId/contractor-photos', async (req, res) => {
    const { projectId } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM kemri_contractor_photos WHERE projectId = ? ORDER BY submittedAt DESC',
            [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching contractor photos for project:', error);
        res.status(500).json({ message: 'Error fetching contractor photos for project', error: error.message });
    }
});


/**
 * @route GET /api/projects/maps-data
 * @description Get all project and GeoJSON data for the map, with optional filters.
 * @access Private
 */
router.get('/maps-data', async (req, res) => {
    const { countyId, subcountyId, wardId, projectType } = req.query;
    
    let query = `
        SELECT
            p.id,
            p.projectName,
            p.projectDescription,
            p.status,
            pm.mapId,
            pm.map AS geoJson
        FROM
            kemri_projects p
        JOIN
            kemri_project_maps pm ON p.id = pm.projectId
        WHERE 1=1
    `;

    const queryParams = [];
    
    // Add filtering based on the junction tables
    if (countyId) {
        query += ` AND p.id IN (
            SELECT projectId FROM kemri_project_counties WHERE countyId = ?
        )`;
        queryParams.push(countyId);
    }
    if (subcountyId) {
        query += ` AND p.id IN (
            SELECT projectId FROM kemri_project_subcounties WHERE subcountyId = ?
        )`;
        queryParams.push(subcountyId);
    }
    if (wardId) {
        query += ` AND p.id IN (
            SELECT projectId FROM kemri_project_wards WHERE wardId = ?
        )`;
        queryParams.push(wardId);
    }
    if (projectType && projectType !== 'all') {
        query += ` AND p.projectType = ?`;
        queryParams.push(projectType);
    }
    
    query += ` ORDER BY p.id;`;

    try {
        const [rows] = await pool.query(query, queryParams);

        let minLat = Infinity, minLng = Infinity, maxLat = -Infinity, maxLng = -Infinity;

        // Process GeoJSON to get a single bounding box and parse the data for the frontend
        const projectsWithGeoJson = rows.map(row => {
            try {
                const geoJson = JSON.parse(row.geoJson);
                
                const coordinates = extractCoordinates(geoJson.geometry);
                coordinates.forEach(coord => {
                    const [lng, lat] = coord;
                    if (isFinite(lat) && isFinite(lng)) {
                        minLat = Math.min(minLat, lat);
                        minLng = Math.min(minLng, lng);
                        maxLat = Math.max(maxLat, lat);
                        maxLng = Math.max(maxLng, lng);
                    }
                });

                return {
                    id: row.id,
                    projectName: row.projectName,
                    projectDescription: row.projectDescription,
                    status: row.status,
                    geoJson: geoJson,
                };
            } catch (e) {
                console.error("Error parsing GeoJSON for project:", row.id, e);
                return null;
            }
        }).filter(item => item !== null);

        const boundingBox = isFinite(minLat) ? { minLat, minLng, maxLat, maxLng } : null;

        const responseData = {
            projects: projectsWithGeoJson,
            boundingBox: boundingBox
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching filtered map data:', error);
        res.status(500).json({ message: 'Error fetching filtered map data', error: error.message });
    }
});


/**
 * @route GET /api/projects/
 * @description Get all active projects with optional filtering
 * @returns {Array} List of projects with joined data
 */
router.get('/', async (req, res) => {
    try {
        const {
            projectName, startDate, endDate, status, departmentId, sectionId,
            finYearId, programId, subProgramId, countyId, subcountyId, wardId, categoryId
        } = req.query;

        // Base SQL query without location joins
        const BASE_PROJECT_SELECT = `
            SELECT
                p.id,
                p.projectName,
                p.projectDescription,
                p.directorate,
                p.startDate,
                p.endDate,
                p.costOfProject,
                p.paidOut,
                p.objective,
                p.expectedOutput,
                p.principalInvestigator,
                p.expectedOutcome,
                p.status,
                p.statusReason,
                p.ProjectRefNum,
                p.Contracted,
                p.createdAt,
                p.updatedAt,
                p.voided,
                p.principalInvestigatorStaffId,
                s.firstName AS piFirstName,
                s.lastName AS piLastName,
                s.email AS piEmail,
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
                p.userId AS creatorUserId,
                u.firstName AS creatorFirstName,
                u.lastName AS creatorLastName,
                p.approved_for_public,
                p.approved_by,
                p.approved_at,
                p.approval_notes,
                p.revision_requested,
                p.revision_notes,
                p.revision_requested_by,
                p.revision_requested_at,
                p.revision_submitted_at,
                p.overallProgress
        `;
        
        // This part dynamically builds the query.
        let fromAndJoinClauses = `
            FROM
                kemri_projects p
            LEFT JOIN
                kemri_staff s ON p.principalInvestigatorStaffId = s.staffId
            LEFT JOIN
                kemri_departments cd ON p.departmentId = cd.departmentId AND (cd.voided IS NULL OR cd.voided = 0)
            LEFT JOIN
                kemri_sections ds ON p.sectionId = ds.sectionId AND (ds.voided IS NULL OR ds.voided = 0)
            LEFT JOIN
                kemri_financialyears fy ON p.finYearId = fy.finYearId AND (fy.voided IS NULL OR fy.voided = 0)
            LEFT JOIN
                kemri_programs pr ON p.programId = pr.programId
            LEFT JOIN
                kemri_subprograms spr ON p.subProgramId = spr.subProgramId
            LEFT JOIN
                kemri_project_milestone_implementations projCat ON p.categoryId = projCat.categoryId
            LEFT JOIN
                kemri_users u ON p.userId = u.userId
            LEFT JOIN
                kemri_project_counties pc ON p.id = pc.projectId AND (pc.voided IS NULL OR pc.voided = 0)
            LEFT JOIN
                kemri_counties c ON pc.countyId = c.countyId
            LEFT JOIN
                kemri_project_subcounties psc ON p.id = psc.projectId AND (psc.voided IS NULL OR psc.voided = 0)
            LEFT JOIN
                kemri_subcounties sc ON psc.subcountyId = sc.subcountyId AND (sc.voided IS NULL OR sc.voided = 0)
            LEFT JOIN
                kemri_project_wards pw ON p.id = pw.projectId AND (pw.voided IS NULL OR pw.voided = 0)
            LEFT JOIN
                kemri_wards w ON pw.wardId = w.wardId AND (w.voided IS NULL OR w.voided = 0)
        `;

        let queryParams = [];
        let whereConditions = ['p.voided = 0'];
        let locationSelectClauses = 'GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ", ") AS countyNames, GROUP_CONCAT(DISTINCT sc.name ORDER BY sc.name SEPARATOR ", ") AS subcountyNames, GROUP_CONCAT(DISTINCT w.name ORDER BY w.name SEPARATOR ", ") AS wardNames';

        // Add location filters if provided
        if (countyId) {
            whereConditions.push('pc.countyId = ?');
            queryParams.push(parseInt(countyId));
        }
        if (subcountyId) {
            whereConditions.push('psc.subcountyId = ?');
            queryParams.push(parseInt(subcountyId));
        }
        if (wardId) {
            whereConditions.push('pw.wardId = ?');
            queryParams.push(parseInt(wardId));
        }

        // Add other non-location filters
        if (projectName) { whereConditions.push('p.projectName LIKE ?'); queryParams.push(`%${projectName}%`); }
        if (startDate) { whereConditions.push('p.startDate >= ?'); queryParams.push(startDate); }
        if (endDate) { whereConditions.push('p.endDate <= ?'); queryParams.push(endDate); }
        if (status) { whereConditions.push('p.status = ?'); queryParams.push(status); }
        if (departmentId) { whereConditions.push('p.departmentId = ?'); queryParams.push(parseInt(departmentId)); }
        if (sectionId) { whereConditions.push('p.sectionId = ?'); queryParams.push(parseInt(sectionId)); }
        if (finYearId) { whereConditions.push('p.finYearId = ?'); queryParams.push(parseInt(finYearId)); }
        if (programId) { whereConditions.push('p.programId = ?'); queryParams.push(parseInt(programId)); }
        if (subProgramId) { whereConditions.push('p.subProgramId = ?'); queryParams.push(parseInt(subProgramId)); }
        if (categoryId) { whereConditions.push('p.categoryId = ?'); queryParams.push(parseInt(categoryId)); }

        // Build the final query
        let query = `${BASE_PROJECT_SELECT}, ${locationSelectClauses} ${fromAndJoinClauses}`;

        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        query += ` GROUP BY p.id ORDER BY p.id`;

        const [rows] = await pool.query(query, queryParams);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});


// ==================== PROJECT APPROVAL ROUTE (must be before /:id route) ====================

/**
 * @route PUT /api/projects/:id/approval
 * @description Approve, revoke, or request revision for a project (for public viewing)
 * @access Protected - requires public_content.approve privilege or admin role
 */
router.put('/:id/approval', async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Authentication required' 
        });
    }
    
    // Check if user is admin or has public_content.approve privilege
    const isAdmin = req.user?.roleName === 'admin';
    const hasPrivilege = req.user?.privileges?.includes('public_content.approve');
    
    if (!isAdmin && !hasPrivilege) {
        return res.status(403).json({ 
            error: 'Access denied. You do not have the necessary privileges to perform this action.' 
        });
    }
    
    try {
        const { id } = req.params;
        const { 
            approved_for_public, 
            approval_notes, 
            approved_by, 
            approved_at,
            revision_requested,
            revision_notes,
            revision_requested_by,
            revision_requested_at
        } = req.body;

        // Build update query dynamically
        let updateFields = [];
        let updateValues = [];

        if (revision_requested !== undefined) {
            updateFields.push('revision_requested = ?');
            updateValues.push(revision_requested ? 1 : 0);
            
            if (revision_requested) {
                updateFields.push('revision_notes = ?');
                updateFields.push('revision_requested_by = ?');
                updateFields.push('revision_requested_at = ?');
                updateValues.push(revision_notes || null);
                updateValues.push(revision_requested_by || req.user.userId);
                // Convert ISO string to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
                const revisionRequestedAt = revision_requested_at ? new Date(revision_requested_at) : new Date();
                updateValues.push(revisionRequestedAt.toISOString().slice(0, 19).replace('T', ' '));
                // Reset approval when revision is requested
                updateFields.push('approved_for_public = 0');
            } else {
                // Clear revision fields
                updateFields.push('revision_notes = NULL');
                updateFields.push('revision_requested_by = NULL');
                updateFields.push('revision_requested_at = NULL');
            }
        }

        if (approved_for_public !== undefined) {
            updateFields.push('approved_for_public = ?');
            updateFields.push('approval_notes = ?');
            updateFields.push('approved_by = ?');
            updateFields.push('approved_at = ?');
            updateValues.push(approved_for_public ? 1 : 0);
            updateValues.push(approval_notes || null);
            updateValues.push(approved_by || req.user.userId);
            // Convert ISO string to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
            const approvedAt = approved_at ? new Date(approved_at) : new Date();
            updateValues.push(approvedAt.toISOString().slice(0, 19).replace('T', ' '));
            
            // Clear revision request when approving/rejecting
            if (revision_requested === undefined) {
                updateFields.push('revision_requested = 0');
                updateFields.push('revision_notes = NULL');
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No update fields provided' });
        }

        updateValues.push(id);

        const query = `
            UPDATE kemri_projects
            SET ${updateFields.join(', ')}
            WHERE id = ? AND voided = 0
        `;

        console.log('=== PROJECT APPROVAL UPDATE ===');
        console.log('Project ID:', id);
        console.log('Update query:', query);
        console.log('Update values:', updateValues);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('User:', JSON.stringify(req.user, null, 2));
        console.log('Update fields count:', updateFields.length);
        console.log('Update values count:', updateValues.length);

        const [result] = await pool.query(query, updateValues);

        console.log('Update result:', JSON.stringify(result, null, 2));
        console.log('Affected rows:', result.affectedRows);
        console.log('==============================');

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        let message = 'Project updated successfully';
        if (revision_requested) {
            message = 'Revision requested successfully';
        } else if (approved_for_public !== undefined) {
            message = `Project ${approved_for_public ? 'approved' : 'revoked'} for public viewing`;
        }

        res.json({
            success: true,
            message
        });
    } catch (error) {
        console.error('=== ERROR UPDATING PROJECT APPROVAL ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Request params:', req.params);
        console.error('Request body:', req.body);
        console.error('========================================');
        res.status(500).json({ 
            error: 'Failed to update approval status',
            details: error.message 
        });
    }
});

/**
 * @route PUT /api/projects/:id/progress
 * @description Update overall progress for a project (0, 25, 50, 75, 100)
 * @access Protected - requires public_content.approve privilege or admin role
 */
router.put('/:id/progress', async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Authentication required' 
        });
    }
    
    // Check if user is admin or has public_content.approve privilege
    const isAdmin = req.user?.roleName === 'admin';
    const hasPrivilege = req.user?.privileges?.includes('public_content.approve');
    
    if (!isAdmin && !hasPrivilege) {
        return res.status(403).json({ 
            error: 'Access denied. You do not have the necessary privileges to perform this action.' 
        });
    }
    
    try {
        const { id } = req.params;
        const { overallProgress } = req.body;

        // Validate progress value
        const validProgressValues = [0, 25, 50, 75, 100];
        if (overallProgress === undefined || overallProgress === null) {
            return res.status(400).json({ error: 'overallProgress is required' });
        }
        
        const progressValue = parseInt(overallProgress);
        if (isNaN(progressValue) || !validProgressValues.includes(progressValue)) {
            return res.status(400).json({ 
                error: 'overallProgress must be one of: 0, 25, 50, 75, 100' 
            });
        }

        // Update the project's overallProgress
        const query = `
            UPDATE kemri_projects
            SET overallProgress = ?
            WHERE id = ? AND voided = 0
        `;

        console.log('=== UPDATING PROJECT PROGRESS ===');
        console.log('Project ID:', id);
        console.log('Progress Value:', progressValue);
        console.log('Query:', query);
        console.log('Query Params:', [progressValue, id]);

        const [result] = await pool.query(query, [progressValue, id]);

        console.log('Update result:', {
            affectedRows: result.affectedRows,
            insertId: result.insertId,
            changedRows: result.changedRows
        });

        if (result.affectedRows === 0) {
            console.log('No rows affected - project not found or already voided');
            return res.status(404).json({ error: 'Project not found' });
        }

        // Verify the update by fetching the updated value
        const [verifyRows] = await pool.query(
            'SELECT overallProgress FROM kemri_projects WHERE id = ? AND voided = 0',
            [id]
        );
        
        if (verifyRows.length > 0) {
            console.log('Verified updated progress:', verifyRows[0].overallProgress);
        }

        console.log('=== PROGRESS UPDATE SUCCESSFUL ===');

        res.json({
            success: true,
            message: `Project progress updated to ${progressValue}%`,
            overallProgress: progressValue
        });
    } catch (error) {
        console.error('Error updating project progress:', error);
        res.status(500).json({ 
            error: 'Failed to update project progress',
            details: error.message 
        });
    }
});

/**
 * @route GET /api/projects/:id
 * @description Get a single active project by ID with joined data
 * @returns {Object} Project details with joined data
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'Invalid project ID' });
    }
    try {
        const [rows] = await pool.query(GET_SINGLE_PROJECT_QUERY, [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
});

/**
 * @route POST /api/projects/
 * @description Create a new project, with optional milestone generation
 * @returns {Object} Created project with joined data
 */
router.post('/', validateProject, async (req, res) => {
    const { categoryId, ...projectData } = req.body;
    
    // TODO: Get userId from authenticated user (e.g., req.user.userId)
    const userId = 1; // Placeholder for now

    const newProject = {
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        userId,
        ...projectData,
    };

    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query('INSERT INTO kemri_projects SET ?', newProject);
            const newProjectId = result.insertId;

            // NEW: Automatically create milestones from the category template
            if (categoryId) {
                const [milestoneTemplates] = await connection.query(
                    'SELECT milestoneName, description, sequenceOrder FROM category_milestones WHERE categoryId = ?',
                    [categoryId]
                );

                if (milestoneTemplates.length > 0) {
                    const milestoneValues = milestoneTemplates.map(m => [
                        newProjectId,
                        m.milestoneName,
                        m.description,
                        m.sequenceOrder,
                        'Not Started', // Initial status
                        userId, // Creator of the milestone
                        new Date().toISOString().slice(0, 19).replace('T', ' '),
                    ]);

                    await connection.query(
                        'INSERT INTO kemri_project_milestones (projectId, milestoneName, description, sequenceOrder, status, userId, createdAt) VALUES ?',
                        [milestoneValues]
                    );
                }
            }

            const [rows] = await connection.query(GET_SINGLE_PROJECT_QUERY, [newProjectId]);
            await connection.commit();
            res.status(201).json(rows[0] || { id: newProjectId, message: 'Project created' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
});

// NEW: API Route to Apply Latest Milestone Templates
/**
 * @route POST /api/projects/:projectId/apply-template
 * @description Applies the latest milestones from a category template to an existing project.
 * @access Private (requires authentication and privilege)
 */
router.post('/apply-template/:projectId', async (req, res) => {
    const { projectId } = req.params;
    // TODO: Get userId from authenticated user (e.g., req.user.userId)
    const userId = 1; // Placeholder for now

    try {
        const [projectRows] = await pool.query('SELECT categoryId FROM kemri_projects WHERE id = ? AND voided = 0', [projectId]);
        const project = projectRows[0];

        if (!project || !project.categoryId) {
            return res.status(400).json({ message: 'Project not found or has no associated category' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [milestoneTemplates] = await connection.query(
                'SELECT milestoneName, description, sequenceOrder FROM category_milestones WHERE categoryId = ?',
                [project.categoryId]
            );

            // Fetch existing milestone names for the project to prevent duplicates
            const [existingMilestones] = await connection.query(
                'SELECT milestoneName FROM kemri_project_milestones WHERE projectId = ?',
                [projectId]
            );
            const existingMilestoneNames = new Set(existingMilestones.map(m => m.milestoneName));

            // Filter out templates that already exist in the project
            const milestonesToAdd = milestoneTemplates.filter(m => !existingMilestoneNames.has(m.milestoneName));

            if (milestonesToAdd.length > 0) {
                const milestoneValues = milestonesToAdd.map(m => [
                    projectId,
                    m.milestoneName,
                    m.description,
                    m.sequenceOrder,
                    'Not Started', // Initial status
                    userId, // Creator of the milestone
                    new Date().toISOString().slice(0, 19).replace('T', ' '),
                ]);

                await connection.query(
                    'INSERT INTO kemri_project_milestones (projectId, milestoneName, description, sequenceOrder, status, userId, createdAt) VALUES ?',
                    [milestoneValues]
                );
            }

            await connection.commit();
            res.status(200).json({ message: `${milestonesToAdd.length} new milestones applied from template` });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error applying milestone template:', error);
        res.status(500).json({ message: 'Error applying milestone template', error: error.message });
    }
});

/**
 * @route PUT /api/projects/:id
 * @description Update an existing project
 * @returns {Object} Updated project with joined data
 */
router.put('/:id', validateProject, async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) { return res.status(400).json({ message: 'Invalid project ID' }); }
    const updatedFields = { ...req.body };
    delete updatedFields.id;
    
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query('UPDATE kemri_projects SET ? WHERE id = ? AND voided = 0', [updatedFields, id]);
            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Project not found or already deleted' });
            }
            const [rows] = await connection.query(GET_SINGLE_PROJECT_QUERY, [id]);
            await connection.commit();
            res.status(200).json(rows[0]);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});

/**
 * @route DELETE /api/projects/:id
 * @description Soft delete a project
 * @returns No content on success
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) { return res.status(400).json({ message: 'Invalid project ID' }); }
    
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query('UPDATE kemri_projects SET voided = 1 WHERE id = ? AND voided = 0', [id]);
            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Project not found or already deleted' });
            }
            await connection.commit();
            res.status(200).json({ message: 'Project soft-deleted successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error soft-deleting project:', error);
        res.status(500).json({ message: 'Error soft-deleting project', error: error.message });
    }
});

// --- Junction Table Routes ---
router.get('/:projectId/counties', async (req, res) => {
    const { projectId } = req.params;
    if (isNaN(parseInt(projectId))) { return res.status(400).json({ message: 'Invalid project ID' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const [rows] = await pool.query(
            `SELECT pc.countyId, c.name AS countyName, pc.assignedAt
             FROM kemri_project_counties pc
             JOIN kemri_counties c ON pc.countyId = c.countyId
             WHERE pc.projectId = ?`, [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project counties:', error);
        res.status(500).json({ message: 'Error fetching project counties', error: error.message });
    }
});
router.post('/:projectId/counties', async (req, res) => {
    const { projectId } = req.params;
    const { countyId } = req.body;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(countyId))) { return res.status(400).json({ message: 'Invalid projectId or countyId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO kemri_project_counties (projectId, countyId, assignedAt) VALUES (?, ?, NOW())', [projectId, countyId]
            );
            await connection.commit();
            res.status(201).json({ projectId: parseInt(projectId), countyId: parseInt(countyId), assignedAt: new Date() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally { connection.release(); }
    } catch (error) {
        console.error('Error adding project county association:', error);
        if (error.code === 'ER_DUP_ENTRY') { return res.status(409).json({ message: 'This county is already associated with this project' }); }
        res.status(500).json({ message: 'Error adding project county association', error: error.message });
    }
});
router.delete('/:countyId', async (req, res) => {
    const { projectId, countyId } = req.params;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(countyId))) { return res.status(400).json({ message: 'Invalid projectId or countyId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'DELETE FROM kemri_project_counties WHERE projectId = ? AND countyId = ?', [projectId, countyId]
            );
            if (result.affectedRows === 0) { await connection.rollback(); return res.status(404).json({ message: 'Project-county association not found' }); }
            await connection.commit();
            res.status(204).send();
        } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
    } catch (error) {
        console.error('Error deleting project county association:', error);
        res.status(500).json({ message: 'Error deleting project county association', error: error.message });
    }
});

router.get('/:projectId/subcounties', async (req, res) => {
    const { projectId } = req.params;
    if (isNaN(parseInt(projectId))) { return res.status(400).json({ message: 'Invalid project ID' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const [rows] = await pool.query(
            `SELECT psc.subcountyId, sc.name AS subcountyName, sc.geoLat, sc.geoLon, psc.assignedAt
             FROM kemri_project_subcounties psc
             JOIN kemri_subcounties sc ON psc.subcountyId = sc.subcountyId
             WHERE psc.projectId = ? AND sc.voided = 0`, [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project subcounties:', error);
        res.status(500).json({ message: 'Error fetching project subcounties', error: error.message });
    }
});
router.post('/:projectId/subcounties', async (req, res) => {
    const { projectId } = req.params;
    const { subcountyId } = req.body;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(subcountyId))) { return res.status(400).json({ message: 'Invalid projectId or subcountyId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO kemri_project_subcounties (projectId, subcountyId, assignedAt) VALUES (?, ?, NOW())', [projectId, subcountyId]
            );
            await connection.commit();
            res.status(201).json({ projectId: parseInt(projectId), subcountyId: parseInt(subcountyId), assignedAt: new Date() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally { connection.release(); }
    } catch (error) {
        console.error('Error adding project subcounty association:', error);
        if (error.code === 'ER_DUP_ENTRY') { return res.status(409).json({ message: 'This subcounty is already associated with this project' }); }
        res.status(500).json({ message: 'Error adding project subcounty association', error: error.message });
    }
});
router.delete('/:subcountyId', async (req, res) => {
    const { projectId, subcountyId } = req.params;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(subcountyId))) { return res.status(400).json({ message: 'Invalid projectId or subcountyId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'DELETE FROM kemri_project_subcounties WHERE projectId = ? AND subcountyId = ?', [projectId, subcountyId]
            );
            if (result.affectedRows === 0) { await connection.rollback(); return res.status(404).json({ message: 'Project-subcounty association not found' }); }
            await connection.commit();
            res.status(204).send();
        } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
    } catch (error)
    {
        console.error('Error deleting project subcounty association:', error);
        res.status(500).json({ message: 'Error deleting project subcounty association', error: error.message });
    }
});

router.get('/:projectId/wards', async (req, res) => {
    const { projectId } = req.params;
    if (isNaN(parseInt(projectId))) { return res.status(400).json({ message: 'Invalid project ID' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const [rows] = await pool.query(
            `SELECT pw.wardId, w.name AS wardName, w.geoLat, w.geoLon, pw.assignedAt
             FROM kemri_project_wards pw
             JOIN kemri_wards w ON pw.wardId = w.wardId
             WHERE pw.projectId = ? AND w.voided = 0`, [projectId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching project wards:', error);
        res.status(500).json({ message: 'Error fetching project wards', error: error.message });
    }
});
router.post('/:projectId/wards', async (req, res) => {
    const { projectId } = req.params;
    const { wardId } = req.body;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(wardId))) { return res.status(400).json({ message: 'Invalid projectId or wardId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO kemri_project_wards (projectId, wardId, assignedAt) VALUES (?, ?, NOW())', [projectId, wardId]
            );
            await connection.commit();
            res.status(201).json({ projectId: parseInt(projectId), wardId: parseInt(wardId), assignedAt: new Date() });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally { connection.release(); }
    } catch (error) {
        console.error('Error adding project ward association:', error);
        if (error.code === 'ER_DUP_ENTRY') { return res.status(409).json({ message: 'This ward is already associated with this project' }); }
        res.status(500).json({ message: 'Error adding project ward association', error: error.message });
    }
});
router.delete('/:wardId', async (req, res) => {
    const { projectId, wardId } = req.params;
    if (isNaN(parseInt(projectId)) || isNaN(parseInt(wardId))) { return res.status(400).json({ message: 'Invalid projectId or wardId' }); }
    if (!(await checkProjectExists(projectId))) { return res.status(404).json({ message: 'Project not found' }); }
    try {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [result] = await connection.query(
                'DELETE FROM kemri_project_wards WHERE projectId = ? AND wardId = ?', [projectId, wardId]
            );
            if (result.affectedRows === 0) { await connection.rollback(); return res.status(404).json({ message: 'Project-ward association not found' }); }
            await connection.commit();
            res.status(204).send();
        } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); }
    } catch (error)
    {
        console.error('Error deleting project ward association:', error);
        res.status(500).json({ message: 'Error deleting project ward association', error: error.message });
    }
});


/* */

module.exports = router;