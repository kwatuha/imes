import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, Paper, CircularProgress, Alert, Snackbar, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Card, CardContent,
  CardActions, Chip, Divider, Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { 
  CloudUpload as CloudUploadIcon, 
  Download as DownloadIcon, 
  Cancel as CancelIcon, 
  Add as AddIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Map as MapIcon,
  AccountTree as AccountTreeIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import * as XLSX from 'xlsx';

/**
 * Helper function to check if the user has a specific privilege.
 */
const checkUserPrivilege = (user, privilegeName) => {
  return user && user.privileges && Array.isArray(user.privileges) && user.privileges.includes(privilegeName);
};

// Import type configurations
const IMPORT_TYPES = [
  {
    id: 'projects',
    name: 'Projects',
    description: 'Import project data including milestones, activities, and budgets',
    icon: <BusinessIcon />,
    privilege: 'project.create',
    endpoint: '/projects/import-data',
    templateEndpoint: '/projects/template',
    color: 'primary'
  },
  {
    id: 'strategic-plans',
    name: 'Strategic Plans',
    description: 'Import CIDP strategic plans, programs, and subprograms',
    icon: <AssessmentIcon />,
    privilege: 'strategic_plan.import',
    endpoint: '/strategy/import-cidp',
    templateEndpoint: '/strategy/template',
    color: 'secondary'
  },
  {
    id: 'map-data',
    name: 'Map Data',
    description: 'Import geographic data for projects and resources',
    icon: <MapIcon />,
    privilege: 'maps.import',
    endpoint: '/maps/import-data',
    templateEndpoint: '/maps/template',
    color: 'success'
  },
  {
    id: 'participants',
    name: 'Participants',
    description: 'Import participant and stakeholder data',
    icon: <AccountTreeIcon />,
    privilege: 'participants.create',
    endpoint: '/participants/import-data',
    templateEndpoint: '/participants/template',
    color: 'warning'
  },
  {
    id: 'comprehensive-projects',
    name: 'Comprehensive Project Details',
    description: 'Import complete project data including strategic plans, programs, sub-programs, workplans, activities, milestones, and budgets',
    icon: <BusinessIcon />,
    privilege: 'project.create',
    endpoint: '/comprehensive-projects/preview',
    templateEndpoint: '/comprehensive-projects/template',
    color: 'info'
  }
];

// Optional static template paths (served from frontend public/ with Vite base '/impes')
const STATIC_TEMPLATE_PATHS = {
  projects: '/impes/templates/projects_import_template.xlsx',
};

// Expected column headers for each template type (used for client-side fallback generation)
const TEMPLATE_HEADERS = {
  // Canonical headers for Projects as requested
  projects: [
    'projectName',
    'ProjectRefNum',
    'ProjectDescription',
    'Status',
    'budget',
    'amountPaid',
    'financialYear',
    'department',
    'sub-county',
    'ward',
    'Contracted',
    'StartDate',
    'EndDate'
  ],
  'strategic-plans': [
    'Plan Name', 'Plan Code', 'Program', 'Subprogram', 'Objective', 'Outcome', 'Output',
    'Indicator', 'Baseline', 'Target', 'Year', 'Budget (KES)', 'Department'
  ],
  'map-data': [
    'Entity Type', 'Entity Name', 'Project Code', 'Latitude', 'Longitude', 'Geometry Type',
    'GeoJSON', 'Description', 'County', 'Sub-County', 'Ward'
  ],
  participants: [
    'Individual ID', 'First Name', 'Last Name', 'Gender', 'Date of Birth', 'Phone', 'Email',
    'County', 'Sub-County', 'Ward', 'Village', 'Enrollment Date', 'Notes'
  ]
};

// Optional: header variants shown in a second row to guide users
const TEMPLATE_HEADER_VARIANTS = {
  projects: {
    projectName: ['Project Name', 'Name', 'Title'],
    ProjectRefNum: ['Project Ref Num', 'Ref', 'Ref Num', 'Reference', 'Project Reference', 'ProjectReference'],
    ProjectDescription: ['Description', 'Project Description', 'Details'],
    Status: ['Project Status', 'Current Status'],
    budget: ['Budget', 'Estimated Cost', 'Budget (KES)'],
    amountPaid: ['Amount Paid', 'Disbursed', 'Expenditure'],
    financialYear: ['FY', 'Financial Year', 'Year'],
    department: ['Department', 'Implementing Department', 'Directorate'],
    'sub-county': ['Subcounty', 'Sub County', 'Sub-County'],
    ward: ['Ward', 'Ward Name'],
    Contracted: ['Is Contracted', 'Contracted?', 'Contract Status'],
    StartDate: ['Start Date', 'Project Start Date', 'Commencement Date'],
    EndDate: ['End Date', 'Project End Date', 'Completion Date']
  }
};

function CentralImportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedImportType, setSelectedImportType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [importReport, setImportReport] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [parsedHeaders, setParsedHeaders] = useState([]);
  const [fullParsedData, setFullParsedData] = useState([]);
  const [mappingSummary, setMappingSummary] = useState(null);
  const [showMappingPreview, setShowMappingPreview] = useState(false);
  
  const fileInputRef = useRef(null);

  const currentImportType = IMPORT_TYPES.find(type => type.id === selectedImportType);

  const handleImportTypeChange = (event) => {
    const typeId = event.target.value;
    setSelectedImportType(typeId);
    // Reset all data when changing import type
    setSelectedFile(null);
    setImportReport(null);
    setPreviewData(null);
    setParsedHeaders([]);
    setFullParsedData([]);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImportReport(null);
    setPreviewData(null);
    setParsedHeaders([]);
    setFullParsedData([]);
  };

  const handleUploadForPreview = async () => {
    if (!currentImportType) {
      setSnackbar({ open: true, message: 'Please select an import type first.', severity: 'warning' });
      return;
    }

    if (!checkUserPrivilege(user, currentImportType.privilege)) {
      setSnackbar({ open: true, message: `You do not have permission to import ${currentImportType.name.toLowerCase()}.`, severity: 'error' });
      return;
    }

    if (!selectedFile) {
      setSnackbar({ open: true, message: 'Please select a file to import.', severity: 'warning' });
      return;
    }

    setLoading(true);
    setSnackbar({ open: true, message: 'Parsing file for preview...', severity: 'info' });
    setImportReport(null);
    setPreviewData(null);
    setParsedHeaders([]);
    setFullParsedData([]);

    const formData = new FormData();
    // Use backend-expected field names per import type
    const fileFieldName = currentImportType.id === 'strategic-plans' ? 'importFile' : 'file';
    formData.append(fileFieldName, selectedFile);

    try {
      let response;
      
      // Route to appropriate API based on import type
      switch (currentImportType.id) {
        case 'projects':
          response = await apiService.projects.previewProjectImport(formData);
          break;
        case 'strategic-plans':
          response = await apiService.strategy.previewStrategicPlanData(formData);
          break;
        case 'map-data':
          response = await apiService.projectMaps.previewMapDataImport(formData);
          break;
        case 'participants':
          response = await apiService.participants.previewParticipantImport(formData);
          break;
        case 'comprehensive-projects':
          response = await apiService.comprehensiveProjects.previewComprehensiveImport(formData);
          break;
        default:
          throw new Error('Unknown import type');
      }

      setSnackbar({ open: true, message: response.message, severity: 'success' });
      setPreviewData(response.previewData);
      // Use mapped keys from preview objects to display correct columns
      const derivedHeaders = Array.isArray(response.previewData) && response.previewData.length > 0
        ? Object.keys(response.previewData[0])
        : (response.headers || []);
      setParsedHeaders(derivedHeaders);
      setFullParsedData(response.fullData);
      setImportReport({
        success: true,
        message: response.message,
        details: {
          unrecognizedHeaders: response.unrecognizedHeaders || [],
        }
      });

      // Check metadata mapping for projects import
      if (currentImportType.id === 'projects' && response.fullData && response.fullData.length > 0) {
        try {
          const mappingResponse = await apiService.projects.checkMetadataMapping({ dataToImport: response.fullData });
          if (mappingResponse.success) {
            setMappingSummary(mappingResponse.mappingSummary);
            setShowMappingPreview(true);
          }
        } catch (mappingErr) {
          console.error('Metadata mapping check error:', mappingErr);
          // Don't block import if mapping check fails, just log it
        }
      }

    } catch (err) {
      console.error('File parsing error:', err);
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to parse file for preview.', severity: 'error' });
      setImportReport({ success: false, message: err.response?.data?.message || 'Failed to parse file for preview.' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!currentImportType) {
      setSnackbar({ open: true, message: 'Please select an import type first.', severity: 'warning' });
      return;
    }

    if (!checkUserPrivilege(user, currentImportType.privilege)) {
      setSnackbar({ open: true, message: `You do not have permission to confirm ${currentImportType.name.toLowerCase()} import.`, severity: 'error' });
      return;
    }

    if (!fullParsedData || fullParsedData.length === 0) {
      setSnackbar({ open: true, message: 'No data to confirm import.', severity: 'warning' });
      return;
    }

    setLoading(true);
    setSnackbar({ open: true, message: 'Confirming import and saving data...', severity: 'info' });
    setImportReport(null);

    try {
      let response;
      
      // Route to appropriate API based on import type
      switch (currentImportType.id) {
        case 'projects':
          response = await apiService.projects.confirmProjectImport({ dataToImport: fullParsedData });
          break;
        case 'strategic-plans':
          response = await apiService.strategy.confirmStrategicPlanImport({ dataToImport: fullParsedData });
          break;
        case 'map-data':
          response = await apiService.projectMaps.confirmMapDataImport({ dataToImport: fullParsedData });
          break;
        case 'participants':
          response = await apiService.participants.confirmParticipantImport({ dataToImport: fullParsedData });
          break;
        case 'comprehensive-projects':
          response = await apiService.comprehensiveProjects.confirmComprehensiveImport({ dataToImport: fullParsedData });
          break;
        default:
          throw new Error('Unknown import type');
      }

      setSnackbar({ open: true, message: response.message, severity: 'success' });
      setImportReport(response);
      setSelectedFile(null);
      setPreviewData(null);
      setParsedHeaders([]);
      setFullParsedData([]);
      
      // Navigate back to appropriate page after successful import
      setTimeout(() => {
        switch (currentImportType.id) {
          case 'projects':
            navigate('/projects');
            break;
          case 'strategic-plans':
            navigate('/strategic-planning');
            break;
          case 'map-data':
            navigate('/maps');
            break;
          case 'participants':
            navigate('/participants');
            break;
          case 'comprehensive-projects':
            navigate('/projects');
            break;
          default:
            navigate('/dashboard');
        }
      }, 2000);

    } catch (err) {
      console.error('Import confirmation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to confirm import.';
      const errorDetails = err.response?.data?.details || (err.response?.data?.errors ? { errors: err.response.data.errors } : null);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      setImportReport({ 
        success: false, 
        message: errorMessage,
        details: errorDetails
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImport = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setParsedHeaders([]);
    setFullParsedData([]);
    setImportReport(null);
    setMappingSummary(null);
    setShowMappingPreview(false);
    setSnackbar({ open: true, message: 'Import process cancelled.', severity: 'info' });
  };

  const handleDownloadTemplate = async () => {
    if (!currentImportType) {
      setSnackbar({ open: true, message: 'Please select an import type first.', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      let response;
      
      // Route to appropriate template endpoint
      switch (currentImportType.id) {
        case 'projects':
          response = await apiService.projects.downloadProjectTemplate();
          break;
        case 'strategic-plans':
          response = await apiService.strategy.downloadStrategicPlanTemplate();
          break;
        case 'map-data':
          response = await apiService.projectMaps.downloadMapDataTemplate();
          break;
        case 'participants':
          response = await apiService.participants.downloadParticipantTemplate();
          break;
        default:
          throw new Error('Unknown import type');
      }

      // Create a blob URL and a link to download the file
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentImportType.name.toLowerCase().replace(' ', '_')}_import_template.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: 'Template downloaded successfully!', severity: 'success' });
    } catch (error) {
      // Fallback 1: Check for a static template under frontend public/templates
      try {
        const staticPath = STATIC_TEMPLATE_PATHS[currentImportType.id];
        if (staticPath) {
          const res = await fetch(staticPath);
          if (!res.ok) throw new Error('Static template not found');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentImportType.name.toLowerCase().replace(' ', '_')}_import_template.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          setSnackbar({ open: true, message: 'Template downloaded from static assets.', severity: 'success' });
          return;
        }
      } catch (staticErr) {
        // proceed to fallback generation
      }

      // Fallback 2: generate a header-only template client-side if server/static template is unavailable
      try {
        const headers = TEMPLATE_HEADERS[currentImportType.id] || [];
        if (headers.length === 0) throw new Error('No fallback headers defined for this import type.');
        // Build a second row with variants where available
        let data = [headers];
        const variantsMap = (TEMPLATE_HEADER_VARIANTS[currentImportType.id] || {});
        const variantRow = headers.map((h) => {
          const variants = variantsMap[h];
          return variants && variants.length ? `Variants: ${variants.join(' | ')}` : '';
        });
        if (variantRow.some((cell) => cell)) {
          data.push(variantRow);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        // Optional: Freeze top row
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentImportType.name.toLowerCase().replace(' ', '_')}_import_template.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setSnackbar({ open: true, message: 'Template generated with expected headers.', severity: 'success' });
      } catch (fallbackError) {
        setSnackbar({ open: true, message: 'Failed to download or generate template.', severity: 'error' });
        console.error('Template download/generation error:', error, fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  
  const isUploadButtonDisabled = !selectedFile || loading || !currentImportType || !checkUserPrivilege(user, currentImportType.privilege);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 0.5 }}>Central Data Import Hub</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose the type of data you want to import and upload your Excel file
      </Typography>

      {/* Import Type Selection */}
      <Paper elevation={2} sx={{ p: 1.5, borderRadius: '8px', mb: 2 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ mb: 1, fontSize: '0.9rem' }}>Select Import Type</Typography>
        <FormControl fullWidth size="small" sx={{ mb: selectedImportType ? 1 : 0 }}>
          <InputLabel>Import Type</InputLabel>
          <Select
            value={selectedImportType}
            onChange={handleImportTypeChange}
            label="Import Type"
          >
            {IMPORT_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ fontSize: '1.1rem' }}>{type.icon}</Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{type.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {type.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Compact Import Type Info */}
        {selectedImportType && (
          <Box sx={{ 
            mt: 1, 
            p: 1, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ fontSize: '1rem', color: 'primary.main' }}>{currentImportType.icon}</Box>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                {currentImportType.name}
              </Typography>
            </Box>
            <Chip 
              label={currentImportType.privilege} 
              color={currentImportType.color} 
              size="small"
              sx={{ height: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 'auto' }}>
              {currentImportType.description}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* File Upload Section */}
      {selectedImportType && (
        <Paper elevation={2} sx={{ p: 2, borderRadius: '8px' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 1.5 }}>Upload Excel File (.xlsx)</Typography>
          
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                fullWidth
                disabled={loading}
              >
                Download Template
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={8} md={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload-input"
                  ref={fileInputRef}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={selectedFile ? selectedFile.name : ''}
                  placeholder="No file selected"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button 
                        component="label" 
                        htmlFor="file-upload-input" 
                        variant="text" 
                        startIcon={<AddIcon />}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Choose File
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              {!previewData && (
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUploadForPreview}
                  disabled={isUploadButtonDisabled}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload & Preview'}
                </Button>
              )}

              {previewData && !showMappingPreview && (
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleConfirmImport}
                    disabled={loading || !checkUserPrivilege(user, currentImportType.privilege)}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Import'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelImport}
                    disabled={loading}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
          
          {/* Metadata Mapping Preview - Only for Projects */}
          {showMappingPreview && mappingSummary && currentImportType.id === 'projects' && (
            <Box sx={{ mt: 2 }}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: '8px', border: '1.5px solid', borderColor: 'primary.main' }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon color="primary" fontSize="small" />
                  Metadata Mapping Preview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.85rem' }}>
                  Review how your data will be mapped to existing metadata. Items marked as "Will be Created" need to be created manually before importing, or they will be skipped during import.
                </Typography>
                <Alert severity="info" sx={{ mb: 1.5, py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    <strong>Note:</strong> The system checks both names and aliases when matching metadata. 
                    Items not found will be skipped during import. Please create missing metadata in the Metadata Management section before proceeding.
                  </Typography>
                </Alert>

                <Grid container spacing={1.5}>
                  {/* Departments */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ '& .MuiCardContent-root': { py: 1.5, '&:last-child': { pb: 1.5 } } }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem' }}>
                          Departments ({mappingSummary.departments.existing.length + mappingSummary.departments.new.length})
                        </Typography>
                        {mappingSummary.departments.existing.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircleIcon fontSize="small" /> {mappingSummary.departments.existing.length} Existing
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.departments.existing.map((dept, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={dept} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {mappingSummary.departments.new.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <AddCircleIcon fontSize="small" /> {mappingSummary.departments.new.length} Need to be Created
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.departments.new.map((dept, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <AddCircleIcon fontSize="small" color="warning" />
                                  </ListItemIcon>
                                  <ListItemText primary={dept} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Directorates (Sections) */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ '& .MuiCardContent-root': { py: 1.5, '&:last-child': { pb: 1.5 } } }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem' }}>
                          Directorates ({mappingSummary.directorates.existing.length + mappingSummary.directorates.new.length})
                        </Typography>
                        {mappingSummary.directorates.existing.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircleIcon fontSize="small" /> {mappingSummary.directorates.existing.length} Existing
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.directorates.existing.map((dir, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={dir} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {mappingSummary.directorates.new.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <AddCircleIcon fontSize="small" /> {mappingSummary.directorates.new.length} Need to be Created
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.directorates.new.map((dir, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <AddCircleIcon fontSize="small" color="warning" />
                                  </ListItemIcon>
                                  <ListItemText primary={dir} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Sub-counties */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ '& .MuiCardContent-root': { py: 1.5, '&:last-child': { pb: 1.5 } } }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem' }}>
                          Sub-counties ({mappingSummary.subcounties.existing.length + mappingSummary.subcounties.new.length})
                        </Typography>
                        {mappingSummary.subcounties.existing.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircleIcon fontSize="small" /> {mappingSummary.subcounties.existing.length} Existing
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.subcounties.existing.map((sc, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={sc} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {mappingSummary.subcounties.new.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <AddCircleIcon fontSize="small" /> {mappingSummary.subcounties.new.length} Need to be Created
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.subcounties.new.map((sc, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <AddCircleIcon fontSize="small" color="warning" />
                                  </ListItemIcon>
                                  <ListItemText primary={sc} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Wards */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ '& .MuiCardContent-root': { py: 1.5, '&:last-child': { pb: 1.5 } } }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem' }}>
                          Wards ({mappingSummary.wards.existing.length + mappingSummary.wards.new.length})
                        </Typography>
                        {mappingSummary.wards.existing.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircleIcon fontSize="small" /> {mappingSummary.wards.existing.length} Existing
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.wards.existing.map((ward, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={ward} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {mappingSummary.wards.new.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <AddCircleIcon fontSize="small" /> {mappingSummary.wards.new.length} Need to be Created
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.wards.new.map((ward, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <AddCircleIcon fontSize="small" color="warning" />
                                  </ListItemIcon>
                                  <ListItemText primary={ward} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Financial Years */}
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ '& .MuiCardContent-root': { py: 1.5, '&:last-child': { pb: 1.5 } } }}>
                      <CardContent>
                        <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon fontSize="small" />
                          Financial Years ({mappingSummary.financialYears?.existing.length + mappingSummary.financialYears?.new.length || 0})
                        </Typography>
                        {mappingSummary.financialYears?.existing.length > 0 && (
                          <Box sx={{ mb: 0.75 }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <CheckCircleIcon fontSize="small" /> {mappingSummary.financialYears.existing.length} Existing
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.financialYears.existing.map((fy, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon fontSize="small" color="success" />
                                  </ListItemIcon>
                                  <ListItemText primary={fy} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {mappingSummary.financialYears?.new.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}>
                              <AddCircleIcon fontSize="small" /> {mappingSummary.financialYears.new.length} Need to be Created
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                              {mappingSummary.financialYears.new.map((fy, idx) => (
                                <ListItem key={idx} sx={{ py: 0, px: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <AddCircleIcon fontSize="small" color="warning" />
                                  </ListItemIcon>
                                  <ListItemText primary={fy} primaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {(!mappingSummary.financialYears || (mappingSummary.financialYears.existing.length === 0 && mappingSummary.financialYears.new.length === 0)) && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                            No financial years found in import data
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Warnings for unmatched metadata */}
                {mappingSummary.rowsWithUnmatchedMetadata.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 1.5, py: 1 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom sx={{ fontSize: '0.875rem' }}>
                      <WarningIcon sx={{ verticalAlign: 'middle', mr: 0.5, fontSize: '1rem' }} />
                      Warning: {mappingSummary.rowsWithUnmatchedMetadata.length} row(s) contain metadata that cannot be matched
                    </Typography>
                    <Box component="ul" sx={{ mt: 0.75, mb: 0, pl: 2 }}>
                      {mappingSummary.rowsWithUnmatchedMetadata.slice(0, 10).map((row, idx) => (
                        <li key={idx}>
                          <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
                            Row {row.rowNumber} ({row.projectName}): {row.unmatched.join(', ')}
                          </Typography>
                        </li>
                      ))}
                      {mappingSummary.rowsWithUnmatchedMetadata.length > 10 && (
                        <li>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            ... and {mappingSummary.rowsWithUnmatchedMetadata.length - 10} more
                          </Typography>
                        </li>
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ mt: 0.75, display: 'block', fontSize: '0.75rem' }}>
                      These rows will be imported, but the unmatched metadata will not be linked. Please ensure metadata names match exactly.
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ mt: 1.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setShowMappingPreview(false);
                      setMappingSummary(null);
                    }}
                  >
                    Back to Preview
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => setShowMappingPreview(false)}
                  >
                    Proceed to Import
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}

          {importReport && (
            <Box sx={{ mt: 2, p: 1.5, border: '1px solid', borderColor: importReport.success ? 'success.main' : 'error.main', borderRadius: '8px' }}>
              <Typography variant="subtitle1" fontWeight={600} color={importReport.success ? 'success.main' : 'error.main'} sx={{ mb: 0.5 }}>
                Import Report: {importReport.success ? 'Success' : 'Failed'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{importReport.message}</Typography>
              {importReport.details && (
                <Box sx={{ mt: 2 }}>
                  {importReport.details.errors && Array.isArray(importReport.details.errors) && importReport.details.errors.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold" color="error.main">
                        Errors ({importReport.details.errorCount || importReport.details.errors.length} of {importReport.details.totalRows || 'unknown'} rows):
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1, maxHeight: '300px', overflow: 'auto' }}>
                        {importReport.details.errors.map((error, idx) => (
                          <li key={idx}>
                            <Typography variant="body2" component="span">{error}</Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  )}
                  {importReport.details.error && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold" color="error.main">Error Details:</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mt: 0.5 }}>
                        {importReport.details.error}
                      </Typography>
                    </Box>
                  )}
                  {!importReport.details.errors && !importReport.details.error && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Check the browser console for more details.
                      </Typography>
                    </Box>
                  )}
                  {importReport.details.projectsCreated !== undefined && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Projects Created: {importReport.details.projectsCreated}</Typography>
                      <Typography variant="body2">Projects Updated: {importReport.details.projectsUpdated}</Typography>
                      <Typography variant="body2">Links Created: {importReport.details.linksCreated}</Typography>
                    </Box>
                  )}
                  {importReport.details && !importReport.details.errors && !importReport.details.error && importReport.details.projectsCreated === undefined && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">Details:</Typography>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.8rem' }}>
                        {JSON.stringify(importReport.details, null, 2)}
                      </pre>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {previewData && previewData.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 1 }}>Data Preview (First {previewData.length} Rows)</Typography>
              <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 350, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {parsedHeaders.map((header, index) => (
                        <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {parsedHeaders.map((header, colIndex) => (
                          <TableCell key={`${rowIndex}-${colIndex}`}>{String(row[header] || '')}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {importReport && importReport.details && importReport.details.unrecognizedHeaders && importReport.details.unrecognizedHeaders.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                      Warning: The following headers were found in your file but are not recognized by the system: {importReport.details.unrecognizedHeaders.join(', ')}. Data in these columns will be ignored.
                  </Alert>
              )}
            </Box>
          )}
        </Paper>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CentralImportPage;

