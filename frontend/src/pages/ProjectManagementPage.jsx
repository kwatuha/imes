import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, MenuItem, ListItemIcon, Checkbox, ListItemText, Box, Typography, Button, CircularProgress, IconButton,
  Snackbar, Alert, Stack, useTheme, Tooltip, Grid, Card, CardContent, TextField, InputAdornment, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { getThemedDataGridSx } from '../utils/dataGridTheme';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewDetailsIcon, FilterList as FilterListIcon, BarChart as GanttChartIcon,
  ArrowForward as ArrowForwardIcon, ArrowBack as ArrowBackIcon, Settings as SettingsIcon, Category as CategoryIcon,
  GroupAdd as GroupAddIcon, FileDownload as FileDownloadIcon, PictureAsPdf as PictureAsPdfIcon,
  Assignment as AssignmentIcon, AttachMoney as MoneyIcon, CheckCircle as CheckCircleIcon, 
  HourglassEmpty as HourglassIcon, AccountBalance as ContractedIcon, Payment as PaidIcon,
  Search as SearchIcon, Clear as ClearIcon, PlayArrow as PlayArrowIcon, Pause as PauseIcon,
  Warning as WarningIcon, Cancel as CancelIcon, Schedule as ScheduleIcon, CheckCircleOutline as CheckCircleOutlineIcon
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
import ProjectFormDialog from '../components/ProjectFormDialog';
import useProjectData from '../hooks/useProjectData';
import useTableSort from '../hooks/useTableSort';
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

  // Custom hook for data fetching and global state
  // Pass empty filterState since we're using DataGrid filters and global search instead
  // Use useMemo to create a stable empty object to prevent infinite re-renders
  const emptyFilterState = useMemo(() => ({}), []);
  const {
    projects, loading, error, snackbar,
    setSnackbar, allMetadata, fetchProjects,
  } = useProjectData(user, authLoading, emptyFilterState);

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

  // State for global search (must be declared before filteredProjects)
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return (projects || []).filter(project => {
      // Search in multiple fields
      const searchableFields = [
        project.projectName || '',
        project.id?.toString() || '',
        project.departmentName || '',
        project.departmentAlias || '',
        project.financialYearName || '',
        project.programName || '',
        project.subProgramName || '',
        project.countyNames || '',
        project.subcountyNames || '',
        project.wardNames || '',
        project.directorate || '',
        project.sectionName || '',
        project.principalInvestigator || '',
        project.pi_firstName || '',
        project.status || '',
        project.description || '',
      ];

      return searchableFields.some(field => 
        field.toLowerCase().includes(query)
      );
    });
  }, [projects, searchQuery]);

  // Custom hook for table sorting
  const { order, orderBy, handleRequestSort, sortedData: sortedProjects } = useTableSort(filteredProjects || []);

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
      defaultVisibility[col.id] = col.show;
    });
    // Always show actions column
    defaultVisibility['actions'] = true;
    return defaultVisibility;
  });

  // Dialog state for create/edit
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
  // State for delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
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

  // Calculate summary statistics from projects
  const summaryStats = useMemo(() => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalBudget: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        totalContracted: 0,
        totalPaidOut: 0,
        completionRate: 0,
      };
    }

    const totalBudget = projects.reduce((sum, p) => {
      const cost = parseFloat(p.costOfProject) || 0;
      return sum + cost;
    }, 0);

    const totalContracted = projects.reduce((sum, p) => {
      const contracted = parseFloat(p.Contracted) || 0;
      return sum + contracted;
    }, 0);

    const totalPaidOut = projects.reduce((sum, p) => {
      const paid = parseFloat(p.paidOut) || 0;
      return sum + paid;
    }, 0);

    const completedProjects = projects.filter(p => 
      p.status === 'Completed' || p.status === 'Closed'
    ).length;

    const inProgressProjects = projects.filter(p => 
      p.status === 'In Progress' || p.status === 'Planning' || p.status === 'Initiated'
    ).length;

    const completionRate = projects.length > 0 
      ? Math.round((completedProjects / projects.length) * 100) 
      : 0;

    return {
      totalProjects: projects.length,
      totalBudget,
      completedProjects,
      inProgressProjects,
      totalContracted,
      totalPaidOut,
      completionRate,
    };
  }, [projects]);

  const handleOpenFormDialog = async (project = null) => {
    if (project && !checkUserPrivilege(user, 'project.update')) {
      setSnackbar({ open: true, message: 'You do not have permission to edit projects.', severity: 'error' });
      return;
    }
    if (!project && !checkUserPrivilege(user, 'project.create')) {
      setSnackbar({ open: true, message: 'You do not have permission to create projects.', severity: 'error' });
      return;
    }
    
    // If editing, fetch full project details to ensure all fields (especially finYearId) are available
    if (project && project.id) {
      try {
        const fullProjectData = await apiService.projects.getProjectById(project.id);
        setCurrentProject(fullProjectData);
      } catch (error) {
        console.error('Error fetching full project details:', error);
        // Fallback to using the row data if fetch fails
        setCurrentProject(project);
      }
    } else {
      setCurrentProject(project);
    }
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

  const handleDeleteProject = (project) => {
    if (!checkUserPrivilege(user, 'project.delete')) {
      setSnackbar({ open: true, message: 'You do not have permission to delete projects.', severity: 'error' });
      return;
    }
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      await apiService.projects.deleteProject(projectToDelete.id);
      setSnackbar({ open: true, message: 'Project deleted successfully!', severity: 'success' });
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to delete project.', severity: 'error' });
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
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
      
      // Prepare data for export (use filtered projects if search is active)
      const projectsToExport = searchQuery ? filteredProjects : projects;
      const dataToExport = projectsToExport.map((project, index) => {
        const row = {};
        visibleColumns.forEach(col => {
          if (col.field === 'rowNumber') {
            // Use index + 1 for row numbering
            row[col.headerName] = index + 1;
          } else {
            // Get the value using valueGetter if available, otherwise use the field directly
            let value = project[col.field];
            
            // For exports, use full department name instead of alias
            if (col.field === 'departmentName') {
              value = project.departmentName || 'N/A';
            } else if (col.valueGetter) {
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
      const filename = searchQuery 
        ? `projects_export_filtered_${dateStr}.xlsx`
        : `projects_export_${dateStr}.xlsx`;
      
      // Write file
      XLSX.writeFile(workbook, filename);
      setSnackbar({ 
        open: true, 
        message: `Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to Excel successfully!`, 
        severity: 'success' 
      });
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
      
      // Prepare data rows (use filtered projects if search is active)
      const projectsToExport = searchQuery ? filteredProjects : projects;
      const dataRows = projectsToExport.map((project, index) => {
        return visibleColumns.map(col => {
          if (col.field === 'rowNumber') {
            return index + 1;
          }
          
          // Get the value using valueGetter if available, otherwise use the field directly
          let value = project[col.field];
          
          // For exports, use full department name instead of alias
          if (col.field === 'departmentName') {
            value = project.departmentName || 'N/A';
          } else if (col.valueGetter) {
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
      const filename = searchQuery 
        ? `projects_export_filtered_${dateStr}.pdf`
        : `projects_export_${dateStr}.pdf`;
      
      // Save PDF
      doc.save(filename);
      setSnackbar({ 
        open: true, 
        message: `Exported ${projectsToExport.length} project${projectsToExport.length !== 1 ? 's' : ''} to PDF successfully!`, 
        severity: 'success' 
      });
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
          // Use the row's position in the filtered data array
          const rowIndex = filteredProjects.findIndex(project => project.id === params.id);
          return rowIndex !== -1 ? rowIndex + 1 : '';
        };
        dataGridColumn.renderCell = (params) => {
          if (!params) return '';
          // Use the row's position in the filtered data array
          const rowIndex = filteredProjects.findIndex(project => project.id === params.id);
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
          if (!params || !params.value) return null;
          
          const status = params.value;
          const normalizedStatus = status?.toLowerCase() || '';
          
          // Get status icon based on status
          const getStatusIcon = () => {
            if (normalizedStatus.includes('completed') || normalizedStatus.includes('closed')) {
              return <CheckCircleIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('progress') || normalizedStatus.includes('ongoing') || normalizedStatus.includes('initiated')) {
              return <PlayArrowIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('hold') || normalizedStatus.includes('paused')) {
              return <PauseIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('risk') || normalizedStatus.includes('at risk')) {
              return <WarningIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('canceled')) {
              return <CancelIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('stalled') || normalizedStatus.includes('delayed')) {
              return <ScheduleIcon sx={{ fontSize: 16 }} />;
            } else if (normalizedStatus.includes('planning') || normalizedStatus.includes('not started')) {
              return <ScheduleIcon sx={{ fontSize: 16 }} />;
            }
            return <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />;
          };
          
          const bgColor = getProjectStatusBackgroundColor(status);
          const textColor = getProjectStatusTextColor(status);
          
          return (
            <Chip
              icon={getStatusIcon()}
              label={formatStatus(status)}
              size="small"
              sx={{
                backgroundColor: bgColor,
                color: textColor,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: '26px',
                minWidth: '100px',
                '& .MuiChip-icon': {
                  color: textColor,
                  marginLeft: '6px',
                },
                '& .MuiChip-label': {
                  paddingLeft: '4px',
                  paddingRight: '8px',
                },
                boxShadow: isLight 
                  ? '0 2px 4px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)' 
                  : '0 2px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px',
                transition: 'all 0.2s ease-in-out',
                cursor: 'default',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: isLight 
                    ? '0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)' 
                    : '0 4px 10px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
                  borderColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
                }
              }}
            />
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
          // Show alias in table if available, otherwise fall back to name
          return params?.row?.departmentAlias || params?.row?.departmentName || '';
        };
        dataGridColumn.renderCell = (params) => {
          // Show alias in table if available, otherwise fall back to name
          const value = params?.row?.departmentAlias || params?.row?.departmentName;
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
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ minWidth: '180px' }}>
            {canAssignContractor && (
              <Tooltip title="Assign Contractors">
                <IconButton size="small" sx={{ color: ui.actionIcon }} onClick={() => handleOpenAssignModal(params.row)}>
                  <GroupAddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={canUpdate ? "Edit" : "You don't have permission to edit projects"}>
              <span>
                <IconButton 
                  size="small"
                  sx={{ color: ui.actionIcon }} 
                  onClick={() => canUpdate && handleOpenFormDialog(params.row)}
                  disabled={!canUpdate}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
              </Tooltip>
            <Tooltip title={canDelete ? "Delete" : "You don't have permission to delete projects"}>
              <span>
                <IconButton 
                  size="small"
                  sx={{ color: ui.danger }} 
                  onClick={() => canDelete && handleDeleteProject(params.row.id)}
                  disabled={!canDelete}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
              </Tooltip>
            {canViewGantt && (
              <Tooltip title="Gantt Chart">
                <IconButton size="small" sx={{ color: ui.actionIcon }} onClick={() => handleViewGanttChart(params.row.id)}>
                  <GanttChartIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View Details">
              <IconButton size="small" sx={{ color: ui.actionIcon }} onClick={() => handleViewDetails(params.row.id)}>
                <ViewDetailsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {canViewKdsp && (
              <Tooltip title="View KDSP Details">
                <Button variant="outlined" onClick={() => handleViewKdspDetails(params.row.id)} size="small" sx={{ whiteSpace: 'nowrap', color: ui.actionIcon, borderColor: ui.actionIcon, fontSize: '0.75rem', py: 0.25, px: 1 }}>
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
        // Ensure actions column has proper width
        if (!dataGridColumn.width && !dataGridColumn.flex) {
          dataGridColumn.width = 200;
        }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {hasPrivilege('projectcategory.read_all') && (
              <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CategoryIcon sx={{ fontSize: 18 }} />}
                  onClick={() => navigate('/settings/project-categories')}
                  sx={{ borderColor: ui.primaryOutline, color: ui.primaryOutline, '&:hover': { backgroundColor: ui.primaryOutlineHoverBg }, fontWeight: 'semibold', borderRadius: '8px', boxShadow: ui.elevatedShadow, fontSize: '0.8125rem', py: 0.5, px: 1.5 }}
              >
                  Manage Categories
              </Button>
          )}
          <Button variant="outlined" size="small" startIcon={<SettingsIcon sx={{ fontSize: 18 }} />} onClick={handleResetColumns}
            sx={{ color: isLight ? theme.palette.text.primary : colors.grey[100], borderColor: isLight ? theme.palette.divider : colors.grey[400], '&:hover': { backgroundColor: isLight ? theme.palette.action.hover : colors.primary[500], borderColor: isLight ? theme.palette.text.primary : colors.grey[100] }, fontSize: '0.8125rem', py: 0.5, px: 1.5 }}
          >Reset to Defaults</Button>
          {checkUserPrivilege(user, 'project.create') && (
            <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 18 }} />} onClick={() => handleOpenFormDialog()}
              sx={{ backgroundColor: isLight ? theme.palette.success.main : colors.greenAccent[600], '&:hover': { backgroundColor: isLight ? theme.palette.success.dark : colors.greenAccent[700] }, color: '#fff', fontSize: '0.8125rem', py: 0.5, px: 1.5 }}
            >
              Add New Project
            </Button>
          )}
          {filteredProjects && filteredProjects.length > 0 && (
            <>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={exportingExcel ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon sx={{ fontSize: 18 }} />}
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
                  },
                  fontSize: '0.8125rem', py: 0.5, px: 1.5
                }}
              >
                {exportingExcel ? 'Exporting...' : 'Export to Excel'}
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={exportingPdf ? <CircularProgress size={16} color="inherit" /> : <PictureAsPdfIcon sx={{ fontSize: 18 }} />}
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
                  },
                  fontSize: '0.8125rem', py: 0.5, px: 1.5
                }}
              >
                {exportingPdf ? 'Generating PDF...' : 'Export to PDF'}
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Global Search Bar */}
      <Box sx={{ mb: 1.5, mt: 1.5 }}>
        <TextField
          fullWidth
          placeholder="Search projects by name, ID, department, location, status, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: isLight ? colors.grey[600] : colors.grey[300], fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchQuery('')}
                  edge="end"
                  size="small"
                  sx={{ color: isLight ? colors.grey[600] : colors.grey[300] }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isLight ? theme.palette.background.paper : colors.primary[500],
              borderRadius: '8px',
              height: '36px',
              '&:hover': {
                backgroundColor: isLight ? theme.palette.action.hover : colors.primary[600],
              },
              '&.Mui-focused': {
                backgroundColor: isLight ? theme.palette.background.paper : colors.primary[500],
                boxShadow: `0 0 0 2px ${colors.blueAccent[500]}40`,
              },
            },
            '& .MuiOutlinedInput-input': {
              color: isLight ? theme.palette.text.primary : colors.grey[100],
              py: 0.75,
              fontSize: '0.875rem',
            },
          }}
        />
        {searchQuery && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`}
              size="small"
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: '#fff',
                fontWeight: 600,
              }}
            />
            {filteredProjects.length !== projects.length && (
              <Chip
                label={`Filtered from ${projects.length} total`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: colors.blueAccent[500],
                  color: isLight ? colors.blueAccent[700] : colors.blueAccent[300],
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Summary Statistics Cards - Show all projects stats, but indicate if search is active */}
      {!loading && !error && projects && projects.length > 0 && (
        <Grid container spacing={1} sx={{ mb: 1.5, mt: 1 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.blueAccent[800]}, ${colors.blueAccent[700]})`,
                borderTop: `3px solid ${colors.blueAccent[500]}`,
                border: isLight ? `1px solid ${colors.blueAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    Total Projects
                  </Typography>
                  <AssignmentIcon sx={{ color: colors.blueAccent[500], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {summaryStats.totalProjects.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  {summaryStats.completionRate}% completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.greenAccent[800]}, ${colors.greenAccent[700]})`,
                borderTop: `3px solid ${colors.greenAccent[500]}`,
                border: isLight ? `1px solid ${colors.greenAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    Total Budget
                  </Typography>
                  <MoneyIcon sx={{ color: colors.greenAccent[500], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {currencyFormatter.format(summaryStats.totalBudget)}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  Allocated funds
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.greenAccent[800]}, ${colors.greenAccent[700]})`,
                borderTop: `3px solid ${colors.greenAccent[600]}`,
                border: isLight ? `1px solid ${colors.greenAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    Completed
                  </Typography>
                  <CheckCircleIcon sx={{ color: colors.greenAccent[600], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {summaryStats.completedProjects}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  {summaryStats.totalProjects > 0 
                    ? Math.round((summaryStats.completedProjects / summaryStats.totalProjects) * 100) 
                    : 0}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.blueAccent[800]}, ${colors.blueAccent[700]})`,
                borderTop: `3px solid ${colors.blueAccent[400]}`,
                border: isLight ? `1px solid ${colors.blueAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    In Progress
                  </Typography>
                  <HourglassIcon sx={{ color: colors.blueAccent[400], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {summaryStats.inProgressProjects}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  Active projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.orange?.[800] || colors.yellowAccent[800]}, ${colors.orange?.[700] || colors.yellowAccent[700]})`,
                borderTop: `3px solid ${colors.orange?.[500] || colors.yellowAccent[500]}`,
                border: isLight ? `1px solid ${colors.orange?.[200] || colors.yellowAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    Contracted
                  </Typography>
                  <ContractedIcon sx={{ color: colors.orange?.[500] || colors.yellowAccent[500], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {currencyFormatter.format(summaryStats.totalContracted)}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  {summaryStats.totalBudget > 0 
                    ? Math.round((summaryStats.totalContracted / summaryStats.totalBudget) * 100) 
                    : 0}% of budget
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%',
                background: isLight 
                  ? theme.palette.background.paper
                  : `linear-gradient(135deg, ${colors.greenAccent[800]}, ${colors.greenAccent[700]})`,
                borderTop: `3px solid ${colors.greenAccent[400]}`,
                border: isLight ? `1px solid ${colors.greenAccent[200]}` : 'none',
                boxShadow: ui.elevatedShadow,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0, 0, 0, 0.25)',
                }
              }}
            >
              <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.25}>
                  <Typography variant="caption" sx={{ color: isLight ? '#1a1a1a' : colors.grey[100], fontWeight: 600, fontSize: '0.7rem' }}>
                    Paid Out
                  </Typography>
                  <PaidIcon sx={{ color: colors.greenAccent[400], fontSize: 18 }} />
                </Box>
                <Typography variant="h5" sx={{ color: isLight ? '#000000' : '#fff', fontWeight: 'bold', fontSize: '1.25rem', mb: 0.125 }}>
                  {currencyFormatter.format(summaryStats.totalPaidOut)}
                </Typography>
                <Typography variant="caption" sx={{ color: isLight ? '#424242' : colors.grey[300], fontWeight: 400, fontSize: '0.65rem' }}>
                  {summaryStats.totalContracted > 0 
                    ? Math.round((summaryStats.totalPaidOut / summaryStats.totalContracted) * 100) 
                    : 0}% of contracted
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {loading && (<Box display="flex" justifyContent="center" alignItems="center" height="200px"><CircularProgress /><Typography sx={{ ml: 2 }}>Loading projects...</Typography></Box>)}
      {error && (<Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>)}
      {!loading && !error && projects.length === 0 && checkUserPrivilege(user, 'project.read_all') && (<Alert severity="info" sx={{ mt: 2 }}>No projects found. Use the search bar or column filters to find projects, or add a new project.</Alert>)}
      {!loading && !error && projects.length === 0 && !checkUserPrivilege(user, 'project.read_all') && (<Alert severity="warning" sx={{ mt: 2 }}>You do not have the necessary permissions to view any projects.</Alert>)}
      {!loading && !error && projects.length > 0 && searchQuery && filteredProjects.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No projects match your search query "{searchQuery}". Try different keywords or clear the search.
        </Alert>
      )}

      
      {!loading && !error && filteredProjects && filteredProjects.length > 0 && columns && columns.length > 0 && (
        <Box
          sx={{
            mt: 2,
            backgroundColor: ui.bodyBg,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: ui.elevatedShadow,
            border: `1px solid ${ui.border}`,
            height: `${calculateGridHeight()}px`,
            width: '100%',
            ...getThemedDataGridSx(theme, colors),
          }}
        >
          <DataGrid
            rows={filteredProjects || []}
            columns={columns}
            getRowId={(row) => row?.id || Math.random()}
            columnVisibilityModel={{
              ...columnVisibilityModel,
              actions: true, // Always show actions column
            }}
            onColumnVisibilityModelChange={(newModel) => {
              // Ensure actions column is always visible
              const updatedModel = { ...newModel, actions: true };
              setColumnVisibilityModel(updatedModel);
              localStorage.setItem('projectTableColumnVisibility', JSON.stringify(updatedModel));
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete "{projectToDelete?.projectName || 'this project'}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ProjectManagementPage;