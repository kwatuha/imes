import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  Backdrop,
  CircularProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableChartIcon from '@mui/icons-material/TableChart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DownloadIcon from '@mui/icons-material/Download';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import reportsService from '../api/reportsService';
import { downloadMEReportSummaryPdf } from '../utils/meReportPdfExport';

const ACCEPT_UPLOAD =
  'application/pdf,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MAX_REPORT_NAME = 512;
const MAX_REPORT_DESC = 8000;

function formatBytes(n) {
  if (n == null || Number.isNaN(n)) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(i ? 1 : 0)} ${u[i]}`;
}

function TabPanel({ children, value, index }) {
  if (value !== index) return null;
  return (
    <Box role="tabpanel" sx={{ pt: 2 }} id={`report-lib-tabpanel-${index}`}>
      {children}
    </Box>
  );
}

export default function ReportLibraryPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Working…');
  const [uploadedReports, setUploadedReports] = useState([]);
  const [listError, setListError] = useState(null);
  const [uploadHint, setUploadHint] = useState(null);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [replaceFile, setReplaceFile] = useState(null);

  const loadUploadedReports = useCallback(async () => {
    setListError(null);
    try {
      const rows = await reportsService.listReportLibraryUploads();
      setUploadedReports(Array.isArray(rows) ? rows : []);
    } catch (e) {
      console.error(e);
      const msg =
        typeof e === 'object' && e && (e.message || e.msg)
          ? e.message || e.msg
          : 'Could not load uploaded reports.';
      setListError(msg);
      setUploadedReports([]);
    }
  }, []);

  useEffect(() => {
    loadUploadedReports();
  }, [loadUploadedReports]);

  const run = useCallback(async (fn, message = 'Working…') => {
    setLoadingMessage(message);
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      const msg =
        typeof e === 'object' && e && (e.message || e.msg)
          ? e.message || e.msg
          : 'Something went wrong. Please try again.';
      window.alert(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadExcel = () =>
    run(
      async () => {
        const { blob, fileName } = await reportsService.downloadMEReport();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      'Generating Report …'
    );

  const handleSummaryPdf = () =>
    run(() => downloadMEReportSummaryPdf(), 'Generating Report …');

  const handleDownloadUploaded = (id, fallbackName) =>
    run(
      async () => {
        const { blob, fileName } = await reportsService.downloadReportLibraryFile(
          id,
          fallbackName
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      },
      'Downloading…'
    );

  const openEdit = (row) => {
    setEditingId(row.id);
    setEditTitle(row.reportTitle || '');
    setEditDescription(row.reportDescription || '');
    setReplaceFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setReplaceFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const handleSaveEdit = () => {
    const title = editTitle.trim();
    if (!title) {
      window.alert('Report name is required.');
      return;
    }
    if (editingId == null) return;
    run(async () => {
      await reportsService.updateReportLibrary(editingId, {
        title,
        description: editDescription,
      });
      if (replaceFile) {
        await reportsService.replaceReportLibraryFile(editingId, replaceFile);
      }
      await loadUploadedReports();
      closeEdit();
    }, 'Saving…');
  };

  const handleDeleteUploaded = (row) => {
    const label = row.reportTitle || row.originalFileName || `report #${row.id}`;
    if (!window.confirm(`Delete “${label}” from the library? This cannot be undone.`)) {
      return;
    }
    run(async () => {
      await reportsService.deleteReportLibrary(row.id);
      await loadUploadedReports();
    }, 'Removing…');
  };

  const onReplaceFilePicked = (e) => {
    const file = e.target?.files?.[0];
    if (!file) {
      setReplaceFile(null);
      return;
    }
    const lower = file.name.toLowerCase();
    const ok =
      lower.endsWith('.pdf') ||
      lower.endsWith('.doc') ||
      lower.endsWith('.docx') ||
      lower.endsWith('.xls') ||
      lower.endsWith('.xlsx');
    if (!ok) {
      window.alert(
        'Please choose a PDF, Word (.doc / .docx), or Excel (.xls / .xlsx) file.'
      );
      e.target.value = '';
      setReplaceFile(null);
      return;
    }
    setReplaceFile(file);
  };

  const onFileSelected = async (e) => {
    const file = e.target?.files?.[0];
    e.target.value = '';
    if (!file) return;

    const lower = file.name.toLowerCase();
    const ok =
      lower.endsWith('.pdf') ||
      lower.endsWith('.doc') ||
      lower.endsWith('.docx') ||
      lower.endsWith('.xls') ||
      lower.endsWith('.xlsx');
    if (!ok) {
      window.alert(
        'Please choose a PDF, Word (.doc / .docx), or Excel (.xls / .xlsx) file.'
      );
      return;
    }

    const title = reportName.trim();
    if (!title) {
      window.alert('Please enter a report name before uploading.');
      return;
    }

    setUploadHint(null);
    await run(async () => {
      await reportsService.uploadReportLibraryFile(file, {
        title,
        description: reportDescription.trim() || undefined,
      });
      setUploadHint(`Uploaded “${title}”. It now appears under Download reports.`);
      setReportName('');
      setReportDescription('');
      await loadUploadedReports();
      setTab(0);
    }, 'Uploading…');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Report library
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Download official exports or upload documents for your team. Uploaded files appear below;
        you can edit the name, description, or replace the file, or delete an entry if it was added
        by mistake.
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 1 }}
        >
          <Tab icon={<CloudDownloadIcon />} iconPosition="start" label="Download reports" />
          <Tab icon={<CloudUploadIcon />} iconPosition="start" label="Upload reports" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <TabPanel value={tab} index={0}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Monitoring &amp; evaluation (M&amp;E)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The Excel report includes the full project list (Projects sheet) plus Summary, yearly,
              and coverage. A printable PDF shows summary (status, yearly, and coverage).
            </Typography>

            <Stack spacing={1.5} alignItems="flex-start">
              <Button
                variant="contained"
                startIcon={<TableChartIcon />}
                onClick={handleDownloadExcel}
                disabled={loading}
              >
                {'Download Project List & Summaries(Excel)'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<SummarizeIcon />}
                onClick={handleSummaryPdf}
                disabled={loading}
              >
                {'Download summary, yearly & coverage (PDF)'}
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Uploaded reports
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Files uploaded on the Upload tab are listed here. Download a copy, or use Edit to
              change the title, description, or attached file, or Delete to remove the entry.
            </Typography>
            {uploadHint && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUploadHint(null)}>
                {uploadHint}
              </Alert>
            )}
            {listError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {listError}
              </Alert>
            )}
            {!listError && uploadedReports.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No uploaded reports yet.
              </Typography>
            )}
            {uploadedReports.length > 0 && (
              <List dense disablePadding sx={{ bgcolor: 'action.hover', borderRadius: 1 }}>
                {uploadedReports.map((row) => (
                  <ListItem
                    key={row.id}
                    sx={{ py: 1, px: 2, alignItems: 'flex-start' }}
                    secondaryAction={
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        justifyContent="flex-end"
                        sx={{ maxWidth: 280 }}
                      >
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() =>
                            handleDownloadUploaded(row.id, row.originalFileName || 'report')
                          }
                          disabled={loading}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => openEdit(row)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleDeleteUploaded(row)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </Stack>
                    }
                  >
                    <InsertDriveFileIcon sx={{ mr: 1.5, mt: 0.25, color: 'primary.main' }} />
                    <ListItemText
                      primary={row.reportTitle || row.originalFileName || `Report #${row.id}`}
                      secondary={
                        <>
                          {row.reportDescription ? (
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ display: 'block', mb: 0.75, whiteSpace: 'pre-wrap' }}
                            >
                              {row.reportDescription}
                            </Typography>
                          ) : null}
                          <Typography component="span" variant="caption" color="text.secondary">
                            {row.originalFileName ? `${row.originalFileName} · ` : ''}
                            {row.createdAt
                              ? new Date(row.createdAt).toLocaleString()
                              : ''}
                            {row.fileSize != null ? ` · ${formatBytes(row.fileSize)}` : ''}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      secondaryTypographyProps={{ component: 'div', variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Name the report, add an optional short description, then choose a file. Allowed
              types: <strong>PDF</strong>, <strong>Word</strong> (.doc, .docx), and{' '}
              <strong>Excel</strong> (.xls, .xlsx). Maximum size 50&nbsp;MB.
            </Typography>
            <Stack spacing={2} sx={{ maxWidth: 560, mb: 2 }}>
              <TextField
                label="Report name"
                required
                fullWidth
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                inputProps={{ maxLength: MAX_REPORT_NAME }}
                helperText={`Shown in the download list (${reportName.length}/${MAX_REPORT_NAME})`}
              />
              <TextField
                label="Brief description"
                fullWidth
                multiline
                minRows={3}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                inputProps={{ maxLength: MAX_REPORT_DESC }}
                placeholder="Optional context for colleagues (topic, period, scope…)"
                helperText={`${reportDescription.length}/${MAX_REPORT_DESC} characters`}
              />
            </Stack>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept={ACCEPT_UPLOAD}
              onChange={onFileSelected}
            />
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || !reportName.trim()}
            >
              Select file and upload
            </Button>
          </TabPanel>
        </Box>
      </Paper>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (t) => t.zIndex.modal + 10,
        }}
        open={loading && !editOpen}
        aria-busy={loading && !editOpen}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" size={48} />
          <Typography variant="body1" component="p">
            {loadingMessage}
          </Typography>
        </Stack>
      </Backdrop>

      <Dialog
        open={editOpen}
        onClose={loading && editOpen ? undefined : closeEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit uploaded report</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Report name"
              required
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              inputProps={{ maxLength: MAX_REPORT_NAME }}
            />
            <TextField
              label="Brief description"
              fullWidth
              multiline
              minRows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              inputProps={{ maxLength: MAX_REPORT_DESC }}
            />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Replace file (optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Leave unchanged to keep the current file. Same types as upload: PDF, Word, Excel.
              </Typography>
              <input
                ref={editFileInputRef}
                type="file"
                accept={ACCEPT_UPLOAD}
                onChange={onReplaceFilePicked}
              />
              {replaceFile ? (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Selected: {replaceFile.name}
                </Typography>
              ) : null}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEdit} disabled={loading && editOpen}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={(loading && editOpen) || !editTitle.trim()}
          >
            {loading && editOpen ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
