const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();
const pool = require('../config/db');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'report-library');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx']);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safe = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        cb(null, safe);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        if (!ALLOWED_EXT.has(ext)) {
            return cb(
                new Error(
                    'Invalid file type. Allowed: PDF (.pdf), Word (.doc, .docx), Excel (.xls, .xlsx).'
                )
            );
        }
        cb(null, true);
    },
});

let tableReady = false;

const MAX_TITLE_LEN = 512;
const MAX_DESC_LEN = 8000;

async function ensureReportLibraryColumns() {
    const alters = [
        'ADD COLUMN report_title VARCHAR(512) NOT NULL DEFAULT \'\'',
        'ADD COLUMN report_description TEXT NULL',
    ];
    for (const fragment of alters) {
        try {
            await pool.query(`ALTER TABLE kemri_report_library_uploads ${fragment}`);
        } catch (e) {
            if (e.errno !== 1060 && e.code !== 'ER_DUP_FIELDNAME') throw e;
        }
    }
}

async function ensureReportLibraryTable() {
    if (tableReady) return;
    await pool.query(`
        CREATE TABLE IF NOT EXISTS kemri_report_library_uploads (
            id INT NOT NULL AUTO_INCREMENT,
            report_title VARCHAR(512) NOT NULL DEFAULT '',
            report_description TEXT NULL,
            original_file_name VARCHAR(512) NOT NULL,
            stored_file_name VARCHAR(255) NOT NULL,
            mime_type VARCHAR(128) NULL,
            file_size BIGINT NULL,
            uploaded_by_user_id INT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_report_lib_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await ensureReportLibraryColumns();
    tableReady = true;
}

function userIdFromReq(req) {
    const u = req.user;
    if (!u) return null;
    return u.userId ?? u.id ?? null;
}

/**
 * GET /api/report-library — list uploaded reports (newest first)
 */
router.get('/', async (req, res) => {
    try {
        await ensureReportLibraryTable();
        const [rows] = await pool.query(
            `SELECT id,
                    report_title AS reportTitle,
                    report_description AS reportDescription,
                    original_file_name AS originalFileName,
                    mime_type AS mimeType,
                    file_size AS fileSize,
                    uploaded_by_user_id AS uploadedByUserId,
                    created_at AS createdAt
             FROM kemri_report_library_uploads
             ORDER BY created_at DESC
             LIMIT 200`
        );
        res.json(rows);
    } catch (err) {
        console.error('report-library list:', err);
        res.status(500).json({ message: 'Failed to list reports.', error: err.message });
    }
});

/**
 * POST /api/report-library/upload — multipart field "file"
 */
router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed.' });
        }
        next();
    });
}, async (req, res) => {
    let uploadedPath;
    try {
        await ensureReportLibraryTable();
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const title = String(req.body.title || req.body.reportTitle || '')
            .trim()
            .slice(0, MAX_TITLE_LEN);
        const description = String(req.body.description || '')
            .trim()
            .slice(0, MAX_DESC_LEN);
        if (!title) {
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(400).json({ message: 'Report name is required.' });
        }
        uploadedPath = req.file.path;
        const uid = userIdFromReq(req);
        const [result] = await pool.query(
            `INSERT INTO kemri_report_library_uploads
                (report_title, report_description, original_file_name, stored_file_name, mime_type, file_size, uploaded_by_user_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                req.file.originalname,
                req.file.filename,
                req.file.mimetype || null,
                req.file.size,
                uid,
            ]
        );
        res.status(201).json({
            id: result.insertId,
            reportTitle: title,
            reportDescription: description || null,
            originalFileName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            createdAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('report-library upload:', err);
        if (uploadedPath && fs.existsSync(uploadedPath)) {
            fs.unlink(uploadedPath, () => {});
        }
        res.status(500).json({ message: 'Failed to save report.', error: err.message });
    }
});

/**
 * PATCH /api/report-library/:id — JSON body { title, description }
 */
router.patch('/:id', async (req, res) => {
    try {
        await ensureReportLibraryTable();
        const id = parseInt(req.params.id, 10);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ message: 'Invalid report id.' });
        }
        const title = String(req.body.title || '')
            .trim()
            .slice(0, MAX_TITLE_LEN);
        if (!title) {
            return res.status(400).json({ message: 'Report name is required.' });
        }
        const descDb =
            req.body.description === undefined || req.body.description === null
                ? null
                : (() => {
                      const d = String(req.body.description).trim().slice(0, MAX_DESC_LEN);
                      return d === '' ? null : d;
                  })();
        const [result] = await pool.query(
            `UPDATE kemri_report_library_uploads
             SET report_title = ?, report_description = ?
             WHERE id = ?`,
            [title, descDb, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        res.json({
            id,
            reportTitle: title,
            reportDescription: descDb,
        });
    } catch (err) {
        console.error('report-library patch:', err);
        res.status(500).json({ message: 'Failed to update report.', error: err.message });
    }
});

/**
 * DELETE /api/report-library/:id — remove row and file from disk
 */
router.delete('/:id', async (req, res) => {
    try {
        await ensureReportLibraryTable();
        const id = parseInt(req.params.id, 10);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ message: 'Invalid report id.' });
        }
        const [rows] = await pool.query(
            `SELECT stored_file_name FROM kemri_report_library_uploads WHERE id = ?`,
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        const stored = rows[0].stored_file_name;
        await pool.query(`DELETE FROM kemri_report_library_uploads WHERE id = ?`, [id]);
        const fp = path.join(UPLOAD_DIR, stored);
        if (fs.existsSync(fp)) {
            fs.unlink(fp, () => {});
        }
        res.json({ ok: true });
    } catch (err) {
        console.error('report-library delete:', err);
        res.status(500).json({ message: 'Failed to delete report.', error: err.message });
    }
});

/**
 * POST /api/report-library/:id/file — replace stored file (multipart field "file")
 */
router.post(
    '/:id/file',
    (req, res, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message || 'Upload failed.' });
            }
            next();
        });
    },
    async (req, res) => {
        let newPath;
        try {
            await ensureReportLibraryTable();
            const id = parseInt(req.params.id, 10);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ message: 'Invalid report id.' });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }
            newPath = req.file.path;
            const [rows] = await pool.query(
                `SELECT stored_file_name FROM kemri_report_library_uploads WHERE id = ?`,
                [id]
            );
            if (!rows.length) {
                if (fs.existsSync(newPath)) fs.unlink(newPath, () => {});
                return res.status(404).json({ message: 'Report not found.' });
            }
            const oldStored = rows[0].stored_file_name;
            const oldPath = path.join(UPLOAD_DIR, oldStored);
            await pool.query(
                `UPDATE kemri_report_library_uploads SET
                    original_file_name = ?,
                    stored_file_name = ?,
                    mime_type = ?,
                    file_size = ?
                 WHERE id = ?`,
                [
                    req.file.originalname,
                    req.file.filename,
                    req.file.mimetype || null,
                    req.file.size,
                    id,
                ]
            );
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, () => {});
            }
            res.json({
                id,
                originalFileName: req.file.originalname,
                mimeType: req.file.mimetype,
                fileSize: req.file.size,
            });
        } catch (err) {
            console.error('report-library replace file:', err);
            if (newPath && fs.existsSync(newPath)) {
                fs.unlink(newPath, () => {});
            }
            res.status(500).json({ message: 'Failed to replace file.', error: err.message });
        }
    }
);

/**
 * GET /api/report-library/:id/download — stream file with original filename
 */
router.get('/:id/download', async (req, res) => {
    try {
        await ensureReportLibraryTable();
        const id = parseInt(req.params.id, 10);
        if (!Number.isFinite(id)) {
            return res.status(400).json({ message: 'Invalid report id.' });
        }
        const [rows] = await pool.query(
            `SELECT original_file_name, stored_file_name, mime_type FROM kemri_report_library_uploads WHERE id = ?`,
            [id]
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'Report not found.' });
        }
        const row = rows[0];
        const filePath = path.join(UPLOAD_DIR, row.stored_file_name);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File missing on server.' });
        }
        const downloadName = row.original_file_name || 'report';
        res.download(filePath, downloadName, (err) => {
            if (err && !res.headersSent) {
                res.status(500).json({ message: 'Failed to send file.' });
            }
        });
    } catch (err) {
        console.error('report-library download:', err);
        res.status(500).json({ message: 'Failed to download report.', error: err.message });
    }
});

module.exports = router;
