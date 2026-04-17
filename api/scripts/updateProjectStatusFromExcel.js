require('dotenv').config();
const path = require('path');
const xlsx = require('xlsx');
const pool = require('../config/db');

const DEFAULT_FILE = '/home/dev/dev/imes_working/v5/roads_status/reports_data/data/projects_export_update_status.xlsx';

function cleanStatus(value) {
    return (value ?? '').toString().trim();
}

function toProjectId(value) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function updateProjectStatusFromExcel() {
    const filePath = process.argv[2] || DEFAULT_FILE;

    console.log(`Reading Excel file: ${filePath}`);

    const workbook = xlsx.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null });

    console.log(`Loaded ${rows.length} data rows from sheet "${sheetName}"`);

    const validRows = [];
    const skippedRows = [];

    rows.forEach((row, index) => {
        const rowNumber = index + 2;
        const projectId = toProjectId(row.ID);
        const newStatus = cleanStatus(row.Status_update);

        if (!projectId || !newStatus) {
            skippedRows.push({
                rowNumber,
                id: row.ID,
                projectName: row['Project Name'],
                statusUpdate: row.Status_update,
                reason: !projectId ? 'Missing/invalid ID' : 'Missing Status_update',
            });
            return;
        }

        validRows.push({
            rowNumber,
            projectId,
            projectName: row['Project Name'],
            previousStatusText: cleanStatus(row.Status),
            newStatus,
        });
    });

    console.log(`Valid updates: ${validRows.length}`);
    console.log(`Skipped rows: ${skippedRows.length}`);

    if (!validRows.length) {
        console.log('No valid rows found. Nothing to update.');
        return;
    }

    const uniqueProjectIds = [...new Set(validRows.map((row) => row.projectId))];
    const placeholders = uniqueProjectIds.map(() => '?').join(', ');
    const [existingProjects] = await pool.query(
        `SELECT id, projectName, status FROM kemri_projects WHERE id IN (${placeholders}) AND voided = 0`,
        uniqueProjectIds
    );

    const existingById = new Map(existingProjects.map((project) => [project.id, project]));
    const missingProjects = [];
    const changes = [];
    const unchanged = [];

    validRows.forEach((row) => {
        const project = existingById.get(row.projectId);
        if (!project) {
            missingProjects.push(row);
            return;
        }

        const currentStatus = cleanStatus(project.status);
        if (currentStatus === row.newStatus) {
            unchanged.push({
                ...row,
                currentStatus,
            });
            return;
        }

        changes.push({
            ...row,
            currentStatus,
            dbProjectName: project.projectName,
        });
    });

    console.log(`Projects found in DB: ${existingProjects.length}`);
    console.log(`Status changes needed: ${changes.length}`);
    console.log(`Already matching: ${unchanged.length}`);
    console.log(`Missing project IDs: ${missingProjects.length}`);

    if (changes.length) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const change of changes) {
                await connection.query(
                    'UPDATE kemri_projects SET status = ? WHERE id = ? AND voided = 0',
                    [change.newStatus, change.projectId]
                );
            }

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Updated: ${changes.length}`);
    console.log(`Unchanged: ${unchanged.length}`);
    console.log(`Missing in DB: ${missingProjects.length}`);
    console.log(`Skipped invalid rows: ${skippedRows.length}`);

    if (changes.length) {
        console.log('\nSample updated rows:');
        changes.slice(0, 10).forEach((change) => {
            console.log(
                `  ID ${change.projectId}: "${change.dbProjectName || change.projectName}" | "${change.currentStatus || '(blank)'}" -> "${change.newStatus}"`
            );
        });
    }

    if (missingProjects.length) {
        console.log('\nMissing project IDs (sample):');
        missingProjects.slice(0, 10).forEach((row) => {
            console.log(`  Row ${row.rowNumber}: ID ${row.projectId} | ${row.projectName || '(no name)'}`);
        });
    }

    if (skippedRows.length) {
        console.log('\nSkipped rows (sample):');
        skippedRows.slice(0, 10).forEach((row) => {
            console.log(`  Row ${row.rowNumber}: ${row.reason}`);
        });
    }
}

updateProjectStatusFromExcel()
    .catch((error) => {
        console.error('Error updating project statuses from Excel:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
