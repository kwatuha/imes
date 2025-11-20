import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, MenuItem, ListItemIcon, Checkbox, ListItemText, Box, Typography, Button, CircularProgress, IconButton,
  Snackbar, Alert, Stack, useTheme, Tooltip,
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { getThemedDataGridSx } from '../utils/dataGridTheme';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewDetailsIcon, FilterList as FilterListIcon, BarChart as GanttChartIcon,
  ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon, Settings as SettingsIcon, Category as CategoryIcon,
  GroupAdd as GroupAddIcon, FileDownload as FileDownloadIcon, PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
// Import autoTable directly (jspdf-autotable v5+ requires direct import)
import autoTable from 'jspdf-autotable';

import { useAuth } from '../context/AuthContext.jsx';
import { checkUserPrivilege, currencyFormatter, getProjectStatusBackgroundColor, getProjectStatusTextColor, formatStatus } from '../utils/tableHelpers';
import projectTableColumnsConfig from '../configs/projectTableConfig';
import apiService from '../api';
import { tokens } from "./dashboard/theme"; // Import tokens for color styling

// Import our new, compact components and hooks
import Header from "./dashboard/Header"; // Import Header component
import ProjectFilters from '../components/ProjectFilters';
import ProjectFormDialog from '../components/ProjectFormDialog';
import useProjectData from '../hooks/useProjectData';
import useTableSort from '../hooks/useTableSort';
import useFilter from '../hooks/useFilter';
import useTableScrollShadows from '../hooks/useTableScrollShadows';
import AssignContractorModal from '../components/AssignContractorModal.jsx';

function ProjectManagementPage() {
  const { user, loading: authLoading, hasPrivilege } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // Initialize colors
  const isLight = theme.palette.mode === 'light';
  const ui = {
    headerBg: isLight ? colors.blueAccent[100] : colors.blueAccent[700],
    headerText: isLight ? colors.blueAccent[900] : '#fff',
    bodyBg: isLight ? theme.palette.background.paper : colors.primary[400],
    border: isLight ? theme.palette.grey[300] : colors.blueAccent[700],
    footerBg: isLight ? theme.palette.grey[50] : colors.blueAccent[700],
    actionIcon: isLight ? theme.palette.text.primary : colors.grey[100],
    danger: isLight ? theme.palette.error.main : colors.redAccent[500],
    primaryOutline: isLight ? theme.palette.primary.main : colors.blueAccent[500],
    primaryOutlineHoverBg: isLight ? theme.palette.action.hover : colors.blueAccent[700],
    elevatedShadow: isLight ? '0 1px 6px rgba(0,0,0,0.06)' : '0 4px 20px rgba(0, 0, 0, 0.15), 0 -2px 10px rgba(0, 0, 0, 0.1)'
  };

  // Custom hook for filters: state and handlers
  const { filterState, handleFilterChange, handleClearFilters } = useFilter();

  // Custom hook for data fetching and global state
  const {
    projects, loading, error, snackbar,
    setSnackbar, allMetadata, fetchProjects,
  } = useProjectData(user, authLoading, filterState);

  // Debug: Log project data structure (remove after debugging)
  useEffect(() => {
    if (projects && projects.length > 0) {
      console.log('Sample project data:', projects[0]);
      console.log('Fields check:', {
        departmentName: projects[0].departmentName,
        financialYearName: projects[0].financialYearName,
        subcountyNames: projects[0].subcountyNames,
        wardNames: projects[0].wardNames,
        directorate: projects[0].directorate,
        sectionName: projects[0].sectionName,
        Contracted: projects[0].Contracted
      });
    }
  }, [projects]);

  // Custom hook for table sorting
  const { order, orderBy, handleRequestSort, sortedData: sortedProjects } = useTableSort(projects || []);

  // Custom hook for table scroll shadows (no longer needed for DataGrid)
  const { tableContainerRef, showLeftShadow, showRightShadow, handleScrollRight, handleScrollLeft } = useTableScrollShadows(projects || []);

  // States for column visibility and menu
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    const savedVisibility = localStorage.getItem('projectTableColumnVisibility');
    if (savedVisibility) {
      try {
        return JSON.parse(savedVisibility);
      } catch (e) {
        console.error("Failed to parse saved column visibility from localStorage", e);
      }
    }
    
    // Default visibility - show essential columns, hide others
    const defaultVisibility = {};
    projectTableColumnsConfig.forEach(col => {
      defaultVisibility[col.field || col.id] = col.show;
    });
    return defaultVisibility;
  });

  // Dialog state for create/edit
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
  // State for Assign Contractor modal
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState(null);
  
  // State for pagination
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  
  // State for export loading
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  
  // Calculate optimal height based on page size
  const calculateGridHeight = () => {
    const rowHeight = 52; // Standard DataGrid row height
    const headerHeight = 56; // Column header height
    const footerHeight = 52; // Pagination footer height
    const padding = 32; // Extra padding
    
    const totalHeight = headerHeight + (paginationModel.pageSize * rowHeight) + footerHeight + padding;
    return Math.max(totalHeight, 400); // Minimum height of 400px
  };

  const handleOpenFormDialog = (project = null) => {
    if (project && !checkUserPrivilege(user, 'project.update')) {
      setSnackbar({ open: true, message: 'You do not have permission to edit projects.', severity: 'error' });
      return;
    }
    if (!project && !checkUserPrivilege(user, 'project.create')) {
      setSnackbar({ open: true, message: 'You do not have permission to create projects.', severity: 'error' });
      return;
    }
    setCurrentProject(project);
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setCurrentProject(null);
  };

  // Handlers for Assign Contractor modal
  const handleOpenAssignModal = (project) => {
      setSelectedProjectForAssignment(project);
      setOpenAssignModal(true);
  };
  
  const handleCloseAssignModal = () => {
      setOpenAssignModal(false);
      setSelectedProjectForAssignment(null);
      fetchProjects(); // Refresh projects list after a change
  };

  const handleFormSuccess = () => {
    handleCloseFormDialog();
    fetchProjects(); // Re-fetch projects to refresh the table
  };

  const handleDeleteProject = async (projectId) => {
    if (!checkUserPrivilege(user, 'project.delete')) {
      setSnackbar({ open: true, message: 'You do not have permission to delete projects.', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      try {
        await apiService.projects.deleteProject(projectId);
        setSnackbar({ open: true, message: 'Project deleted successfully!', severity: 'success' });
        fetchProjects();
      } catch (err) {
        setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete project.', severity: 'error' });
      }
    }
  };

  const handleViewDetails = useCallback((projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  }, [navigate]);

  const handleViewGanttChart = useCallback((projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}/gantt-chart`);
    }
  }, [navigate]);

  const handleViewKdspDetails = useCallback((projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}/kdsp-details`);
    }
  }, [navigate]);

  const handleCloseSnackbar = (event, reason) => { if (reason === 'clickaway') return; setSnackbar({ ...snackbar, open: false }); };

  const handleExportToExcel = () => {
    setExportingExcel(true);
    try {
      // Get visible columns, excluding actions column
      const visibleColumns = columns.filter(col => 
        columnVisibilityModel[col.field] !== false && col.field !== 'actions'
      );
      
      // Prepare data for export
      const dataToExport = projects.map((project, index) => {
        const row = {};
        visibleColumns.forEach(col => {
          if (col.field === 'rowNumber') {
            // Use index + 1 for row numbering
            row[col.headerName] = index + 1;
          } else {
            // Get the value using valueGetter if available, otherwise use the field directly
            let value = project[col.field];
            if (col.valueGetter) {
              try {
                value = col.valueGetter({ row: project, value: project[col.field] });
              } catch (e) {
                // If valueGetter fails, use direct value
                value = project[col.field];
              }
            }
            // Format the value for display
            if (value === null || value === undefined || value === '') {
              value = 'N/A';
            } else if (col.field === 'costOfProject' || col.field === 'paidOut' || col.field === 'Contracted') {
              // Format currency values
              if (!isNaN(parseFloat(value))) {
                value = parseFloat(value);
              }
            } else if (col.field === 'startDate' || col.field === 'endDate') {
              // Format dates
              if (value) {
                value = new Date(value).toLocaleDateString();
              }
            }
            row[col.headerName] = value;
          }
        });
        return row;
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `projects_export_${dateStr}.xlsx`;
      
      // Write file
      XLSX.writeFile(workbook, filename);
      setSnackbar({ open: true, message: 'Projects exported to Excel successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setSnackbar({ open: true, message: 'Failed to export to Excel. Please try again.', severity: 'error' });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportToPDF = () => {
    setExportingPdf(true);
    try {
      // Get visible columns (excluding actions)
      const visibleColumns = columns.filter(col => 
        columnVisibilityModel[col.field] !== false && col.field !== 'actions'
      );
      
      // Prepare headers
      const headers = visibleColumns.map(col => col.headerName);
      
      // Prepare data rows
      const dataRows = projects.map((project, index) => {
        return visibleColumns.map(col => {
          if (col.field === 'rowNumber') {
            return index + 1;
          }
          
          // Get the value using valueGetter if available, otherwise use the field directly
          let value = project[col.field];
          if (col.valueGetter) {
            try {
              value = col.valueGetter({ row: project, value: project[col.field] });
            } catch (e) {
              value = project[col.field];
            }
          }
          
          // Format the value for display
          if (value === null || value === undefined || value === '') {
            return 'N/A';
          } else if (col.field === 'costOfProject' || col.field === 'paidOut' || col.field === 'Contracted') {
            // Format currency values
            if (!isNaN(parseFloat(value))) {
              return currencyFormatter.format(parseFloat(value));
            }
            return String(value);
          } else if (col.field === 'startDate' || col.field === 'endDate') {
            // Format dates
            if (value) {
              return new Date(value).toLocaleDateString();
            }
            return 'N/A';
          }
          
          return String(value);
        });
      });
      
      // Create PDF - use the same pattern as other report components
      const doc = new jsPDF('landscape', 'pt', 'a4');
      
      // Use autoTable directly (jspdf-autotable v5+ requires passing doc as first parameter)
      autoTable(doc, {
        head: [headers],
        body: dataRows,
        startY: 20,
        styles: { 
          fontSize: 8, 
          cellPadding: 2,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontStyle: 'bold' 
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 20, left: 40, right: 40 },
      });
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `projects_export_${dateStr}.pdf`;
      
      // Save PDF
      doc.save(filename);
      setSnackbar({ open: true, message: 'Projects exported to PDF successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      setSnackbar({ open: true, message: err.message || 'Failed to export to PDF. Please try again.', severity: 'error' });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleResetColumns = () => {
    const defaultVisibility = {};
    projectTableColumnsConfig.forEach(col => {
      defaultVisibility[col.field || col.id] = col.show;
    });
    setColumnVisibilityModel(defaultVisibility);
    localStorage.setItem('projectTableColumnVisibility', JSON.stringify(defaultVisibility));
    setSnackbar({ open: true, message: 'Columns reset to defaults', severity: 'info' });
  };

  if (authLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /><Typography sx={{ ml: 2 }}>Loading authentication data...</Typography></Box>;

  // Define columns for DataGrid
  const columns = projectTableColumnsConfig.map((col, index) => {
    const dataGridColumn = {
      field: col.id, // Use col.id directly as the field name
      headerName: col.label,
      flex: col.flex,
      width: col.width,
      minWidth: col.minWidth,
      sortable: col.sortable,
      sticky: col.sticky, // Preserve sticky property
    };

    switch (col.id) {
      case 'rowNumber':
        dataGridColumn.valueGetter = (params) => {
          if (!params) return '';
          // Use the row's position in the data array
          const rowIndex = projects.findIndex(project => project.id === params.id);
          return rowIndex !== -1 ? rowIndex + 1 : '';
        };
        dataGridColumn.renderCell = (params) => {
          if (!params) return '';
          // Use the row's position in the data array
          const rowIndex = projects.findIndex(project => project.id === params.id);
          return rowIndex !== -1 ? rowIndex + 1 : '';
        };
        dataGridColumn.sortable = false;
        dataGridColumn.filterable = false;
        break;
      
      case 'projectName':
        // No special handling needed - DataGrid will use the field mapping automatically
        break;
      case 'status':
        dataGridColumn.renderCell = (params) => {
          if (!params) return null;
          return (
            <Box sx={{ backgroundColor: getProjectStatusBackgroundColor(params.value), color: getProjectStatusTextColor(params.value), padding: '4px 8px', borderRadius: '4px', minWidth: '80px', textAlign: 'center', fontWeight: 'bold' }}>
              {formatStatus(params.value)}
            </Box>
          );
        };
        break;
      case 'costOfProject':
      case 'paidOut':
        dataGridColumn.renderCell = (params) => {
          if (!params) return 'N/A';
          return !isNaN(parseFloat(params.value)) ? currencyFormatter.format(parseFloat(params.value)) : 'N/A';
        };
        break;
      case 'startDate':
      case 'endDate':
        dataGridColumn.renderCell = (params) => {
          if (!params) return 'N/A';
          return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
        };
        break;
      case 'directorate':
        dataGridColumn.valueGetter = (params) => {
          if (!params || !params.row) return '';
          // Use directorate if available, otherwise fall back to section
          return params.row.directorate || params.row.section || params.row.sectionName || '';
        };
        dataGridColumn.renderCell = (params) => {
          if (!params || !params.row) return 'N/A';
          const value = params.row.directorate || params.row.section || params.row.sectionName;
          return value || 'N/A';
        };
        break;
      case 'Contracted':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.Contracted || '';
        };
        dataGridColumn.renderCell = (params) => {
          if (!params || !params.row) return 'N/A';
          const value = params.row.Contracted;
          if (value === null || value === undefined) return 'N/A';
          // Format as currency if it's a number
          if (!isNaN(parseFloat(value))) {
            return currencyFormatter.format(parseFloat(value));
          }
          return value || 'N/A';
        };
        break;
      case 'departmentName':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.departmentName || '';
        };
        dataGridColumn.renderCell = (params) => {
          const value = params?.row?.departmentName;
          return value || 'N/A';
        };
        break;
      case 'financialYearName':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.financialYearName || '';
        };
        dataGridColumn.renderCell = (params) => {
          const value = params?.row?.financialYearName;
          return value || 'N/A';
        };
        break;
      case 'subcountyNames':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.subcountyNames || '';
        };
        dataGridColumn.renderCell = (params) => {
          const value = params?.row?.subcountyNames;
          return value || 'N/A';
        };
        break;
      case 'wardNames':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.wardNames || '';
        };
        dataGridColumn.renderCell = (params) => {
          const value = params?.row?.wardNames;
          return value || 'N/A';
        };
        break;
      case 'countyNames':
        dataGridColumn.valueGetter = (params) => {
          return params?.row?.countyNames || '';
        };
        dataGridColumn.renderCell = (params) => {
          const value = params?.row?.countyNames;
          return value || 'N/A';
        };
        break;
      case 'principalInvestigator':
        dataGridColumn.valueGetter = (params) => {
          if (!params || !params.row) return 'N/A';
          return params.row.pi_firstName || params.row.principalInvestigator || 'N/A';
        };
        break;
      case 'actions':
        dataGridColumn.renderCell = (params) => {
          if (!params) return null;
          if (!params.row) return null;
          const canUpdate = checkUserPrivilege(user, 'project.update');
          const canDelete = checkUserPrivilege(user, 'project.delete');
          const canAssignContractor = checkUserPrivilege(user, 'projects.assign_contractor');
          const canViewGantt = checkUserPrivilege(user, 'project.read_gantt_chart');
          const canViewKdsp = checkUserPrivilege(user, 'project.read_kdsp_details');
          
          return (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {canAssignContractor && (
              <Tooltip title="Assign Contractors">
                <IconButton sx={{ color: ui.actionIcon }} onClick={() => handleOpenAssignModal(params.row)}>
                  <GroupAddIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={canUpdate ? "Edit" : "You don't have permission to edit projects"}>
              <span>
                <IconButton 
                  sx={{ color: ui.actionIcon }} 
                  onClick={() => canUpdate && handleOpenFormDialog(params.row)}
                  disabled={!canUpdate}
                >
                  <EditIcon />
                </IconButton>
              </span>
              </Tooltip>
            <Tooltip title={canDelete ? "Delete" : "You don't have permission to delete projects"}>
              <span>
                <IconButton 
                  sx={{ color: ui.danger }} 
                  onClick={() => canDelete && handleDeleteProject(params.row.id)}
                  disabled={!canDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
              </Tooltip>
            {canViewGantt && (
              <Tooltip title="Gantt Chart">
                <IconButton sx={{ color: ui.actionIcon }} onClick={() => handleViewGanttChart(params.row.id)}>
                  <GanttChartIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View Details">
              <IconButton sx={{ color: ui.actionIcon }} onClick={() => handleViewDetails(params.row.id)}>
                <ViewDetailsIcon />
              </IconButton>
            </Tooltip>
            {canViewKdsp && (
              <Tooltip title="View KDSP Details">
                <Button variant="outlined" onClick={() => handleViewKdspDetails(params.row.id)} size="small" sx={{ whiteSpace: 'nowrap', color: ui.actionIcon, borderColor: ui.actionIcon }}>
                  KDSP
                </Button>
              </Tooltip>
            )}
          </Stack>
          );
        };
        dataGridColumn.sortable = false;
        dataGridColumn.filterable = false;
        dataGridColumn.headerAlign = 'right';
        dataGridColumn.align = 'right';
        break;
      default:
        dataGridColumn.valueGetter = (params) => {
          if (!params) return 'N/A';
          return params.value || 'N/A';
        };
        break;
    }
    return dataGridColumn;
  });

  return (
    <Box m="20px">
      <Header title="PROJECTS" subtitle="Registry of Projects" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Stack direction="row" spacing={1}>
          {hasPrivilege('projectcategory.read_all') && (
              <Button
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  onClick={() => navigate('/settings/project-categories')}
                  sx={{ borderColor: ui.primaryOutline, color: ui.primaryOutline, '&:hover': { backgroundColor: ui.primaryOutlineHoverBg }, fontWeight: 'semibold', borderRadius: '8px', boxShadow: ui.elevatedShadow }}
              >
                  Manage Categories
              </Button>
          )}
          <Button variant="outlined" startIcon={<SettingsIcon />} onClick={handleResetColumns}
            sx={{ color: isLight ? theme.palette.text.primary : colors.grey[100], borderColor: isLight ? theme.palette.divider : colors.grey[400], '&:hover': { backgroundColor: isLight ? theme.palette.action.hover : colors.primary[500], borderColor: isLight ? theme.palette.text.primary : colors.grey[100] } }}
          >Reset to Defaults</Button>
          {checkUserPrivilege(user, 'project.create') && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenFormDialog()}
              sx={{ backgroundColor: isLight ? theme.palette.success.main : colors.greenAccent[600], '&:hover': { backgroundColor: isLight ? theme.palette.success.dark : colors.greenAccent[700] }, color: '#fff' }}
            >
              Add New Project
            </Button>
          )}
          {projects && projects.length > 0 && (
            <>
              <Button 
                variant="outlined" 
                startIcon={exportingExcel ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
                onClick={handleExportToExcel}
                disabled={exportingExcel || exportingPdf || loading}
                sx={{ 
                  color: isLight ? '#276E4B' : colors.greenAccent[500], 
                  borderColor: isLight ? '#276E4B' : colors.greenAccent[500], 
                  '&:hover': { 
                    backgroundColor: isLight ? '#E8F5E9' : colors.greenAccent[600], 
                    borderColor: isLight ? '#276E4B' : colors.greenAccent[400] 
                  },
                  '&:disabled': {
                    borderColor: isLight ? theme.palette.action.disabled : colors.grey[700],
                    color: isLight ? theme.palette.action.disabled : colors.grey[500]
                  }
                }}
              >
                {exportingExcel ? 'Exporting...' : 'Export to Excel'}
              </Button>
              <Button 
                variant="outlined" 
                startIcon={exportingPdf ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                onClick={handleExportToPDF}
                disabled={exportingExcel || exportingPdf || loading}
                sx={{ 
                  color: isLight ? '#E11D48' : colors.redAccent[500], 
                  borderColor: isLight ? '#E11D48' : colors.redAccent[500], 
                  '&:hover': { 
                    backgroundColor: isLight ? '#FFEBEE' : colors.redAccent[600], 
                    borderColor: isLight ? '#E11D48' : colors.redAccent[400] 
                  },
                  '&:disabled': {
                    borderColor: isLight ? theme.palette.action.disabled : colors.grey[700],
                    color: isLight ? theme.palette.action.disabled : colors.grey[500]
                  }
                }}
              >
                {exportingPdf ? 'Generating PDF...' : 'Export to PDF'}
              </Button>
            </>
          )}
        </Stack>
      </Box>

      <ProjectFilters
        filterState={filterState}
        handleFilterChange={handleFilterChange}
        handleApplyFilters={() => fetchProjects()}
        handleClearFilters={() => { handleClearFilters(); }}
        allMetadata={allMetadata || {}}
      />

      {loading && (<Box display="flex" justifyContent="center" alignItems="center" height="200px"><CircularProgress /><Typography sx={{ ml: 2 }}>Loading projects...</Typography></Box>)}
      {error && (<Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>)}
      {!loading && !error && projects.length === 0 && checkUserPrivilege(user, 'project.read_all') && (<Alert severity="info" sx={{ mt: 2 }}>No projects found. Adjust filters or add a new project.</Alert>)}
      {!loading && !error && projects.length === 0 && !checkUserPrivilege(user, 'project.read_all') && (<Alert severity="warning" sx={{ mt: 2 }}>You do not have the necessary permissions to view any projects.</Alert>)}

      
      {!loading && !error && projects && projects.length > 0 && columns && columns.length > 0 && (
        <Box
          sx={{
            mt: 0, // Remove the top margin to eliminate gap
            backgroundColor: ui.bodyBg,
            borderRadius: '0 0 12px 12px', // Only round bottom corners since it connects to filters above
            overflow: 'hidden',
            boxShadow: ui.elevatedShadow, // Add top shadow to connect with filters
            border: `1px solid ${ui.border}`,
            borderTop: 'none', // Remove top border since it connects to filters above
            height: `${calculateGridHeight()}px`,
            width: '100%',
            ...getThemedDataGridSx(theme, colors),
          }}
        >
          <DataGrid
            rows={projects || []}
            columns={columns}
            getRowId={(row) => row?.id || Math.random()}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => {
              setColumnVisibilityModel(newModel);
              localStorage.setItem('projectTableColumnVisibility', JSON.stringify(newModel));
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            initialState={{
              sorting: {
                sortModel: [{ field: orderBy, sort: order }],
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            checkboxSelection={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            disableDensitySelector={false}
            autoHeight={false}
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
      )}

      <ProjectFormDialog
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
        currentProject={currentProject}
        onFormSuccess={handleFormSuccess}
        setSnackbar={setSnackbar}
        allMetadata={allMetadata || {}}
        user={user}
      />
      
      <AssignContractorModal
          open={openAssignModal}
          onClose={handleCloseAssignModal}
          project={selectedProjectForAssignment}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectManagementPage;