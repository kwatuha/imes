import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, IconButton,
  Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, 
  Stack, useTheme, Tooltip, Grid, Paper, Chip, Autocomplete,
  Tabs, Tab, Card, CardContent, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Visibility as ViewIcon,
  Approval as ApprovalIcon,
  AccountBalanceWallet as WalletIcon,
  PendingActions as PendingIcon,
  TrendingUp as TrendingUpIcon,
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import budgetService from '../api/budgetService';
import metaDataService from '../api/metaDataService';
import projectService from '../api/projectService';
import { useAuth } from '../context/AuthContext.jsx';
import { tokens } from "../pages/dashboard/theme";
import { formatCurrency, formatToSentenceCase } from '../utils/helpers';

function BudgetManagementPage() {
  const { user, hasPrivilege } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Container-based state
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [containerItems, setContainerItems] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Containers, 1: Container Details
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    finYearId: '',
    departmentId: '',
    status: '',
    search: ''
  });

  // Metadata for dropdowns
  const [financialYears, setFinancialYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openChangeRequestDialog, setOpenChangeRequestDialog] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentChangeRequest, setCurrentChangeRequest] = useState(null);
  const [formData, setFormData] = useState({
    budgetName: '',
    finYearId: '',
    departmentId: '',
    description: '',
    requiresApprovalForChanges: true
  });
  const [itemFormData, setItemFormData] = useState({
    projectId: '',
    projectName: '',
    departmentId: '',
    subcountyId: '',
    wardId: '',
    amount: '',
    remarks: '',
    changeReason: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [itemFormErrors, setItemFormErrors] = useState({});

  // Delete Confirmation States
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [budgetToDeleteId, setBudgetToDeleteId] = useState(null);
  const [budgetToDeleteName, setBudgetToDeleteName] = useState('');

  // Fetch metadata
  const fetchMetadata = useCallback(async () => {
    try {
      const [fyData, deptData, subcountyData] = await Promise.all([
        metaDataService.financialYears.getAllFinancialYears(),
        metaDataService.departments.getAllDepartments(),
        metaDataService.subcounties.getAllSubcounties()
      ]);
      
      // Deduplicate financial years by finYearName, keeping the most recent one
      const uniqueFinancialYears = (fyData || []).reduce((acc, fy) => {
        const existing = acc.find(item => 
          item.finYearName?.toLowerCase().trim() === fy.finYearName?.toLowerCase().trim()
        );
        if (!existing || (fy.finYearId > existing.finYearId)) {
          // Remove existing if found, then add new one
          if (existing) {
            const index = acc.indexOf(existing);
            acc.splice(index, 1);
          }
          acc.push(fy);
        }
        return acc;
      }, []);
      
      // Sort by startDate descending, then by finYearName
      uniqueFinancialYears.sort((a, b) => {
        if (a.startDate && b.startDate) {
          return new Date(b.startDate) - new Date(a.startDate);
        }
        if (a.startDate) return -1;
        if (b.startDate) return 1;
        return (b.finYearName || '').localeCompare(a.finYearName || '');
      });
      
      setFinancialYears(uniqueFinancialYears);
      setDepartments(deptData || []);
      setSubcounties(subcountyData || []);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  }, []);

  // Fetch projects for autocomplete
  const fetchProjects = useCallback(async () => {
    try {
      const data = await projectService.projects.getProjects({ limit: 1000 });
      setProjects(data.projects || data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  // Fetch wards when subcounty changes (for item form)
  useEffect(() => {
    if (itemFormData.subcountyId) {
      metaDataService.subcounties.getWardsBySubcounty(itemFormData.subcountyId)
        .then(data => setWards(data || []))
        .catch(err => {
          console.error('Error fetching wards:', err);
          setWards([]);
        });
    } else {
      setWards([]);
      setItemFormData(prev => ({ ...prev, wardId: '' }));
    }
  }, [itemFormData.subcountyId]);

  // Fetch budget containers
  const fetchContainers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      };
      
      console.log('Fetching containers with params:', params);
      const data = await budgetService.getBudgetContainers(params);
      console.log('Fetched budget containers data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array?', Array.isArray(data));
      console.log('Data keys:', Object.keys(data || {}));
      console.log('Containers array:', data.budgets);
      console.log('Containers count:', data.budgets?.length || 0);
      console.log('Pagination:', data.pagination);
      
      // Handle different response structures
      let containersList = [];
      if (Array.isArray(data)) {
        containersList = data;
      } else if (data?.budgets && Array.isArray(data.budgets)) {
        containersList = data.budgets;
      } else if (data?.containers && Array.isArray(data.containers)) {
        containersList = data.containers;
      } else if (data && typeof data === 'object') {
        // Try to find any array property
        const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        if (arrayKey) {
          containersList = data[arrayKey];
        }
      }
      
      console.log('Final containers list to set:', containersList);
      console.log('Final containers count:', containersList.length);
      
      setContainers(containersList);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || containersList.length,
        totalPages: data.pagination?.totalPages || Math.ceil(containersList.length / pagination.limit)
      }));
    } catch (err) {
      console.error('Error fetching budget containers:', err);
      console.error('Error type:', typeof err);
      console.error('Error keys:', Object.keys(err || {}));
      console.error('Error response:', err.response);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      console.error('Full error:', JSON.stringify(err, null, 2));
      
      // Build a more detailed error message
      // Note: axios interceptor returns error.response.data, so err might be the data object itself
      let errorMessage = "Failed to load budget containers.";
      
      // Handle case where err is the response.data object (from axios interceptor)
      // The axios interceptor returns error.response.data, so err is the data object
      if (err && typeof err === 'object') {
        // Check for common error message fields
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error) {
          errorMessage = err.error;
        } else if (err.msg) {
          errorMessage = err.msg;
        } else if (typeof err === 'string') {
          errorMessage = err;
        } else {
          // If it's an object but no clear message, stringify it
          errorMessage = JSON.stringify(err);
        }
      } 
      // Handle case where err is the full error object (shouldn't happen with axios interceptor, but just in case)
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Add status code if available
      if (err.response?.status) {
        errorMessage += ` (Status: ${err.response.status})`;
      } else if (err.status) {
        errorMessage += ` (Status: ${err.status})`;
      }
      
      setError(errorMessage);
      setContainers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Fetch container details with items
  const fetchContainerDetails = useCallback(async (budgetId) => {
    try {
      const data = await budgetService.getBudgetContainer(budgetId);
      setSelectedContainer(data);
      setContainerItems(data.items || []);
      setPendingChanges(data.pendingChanges || []);
    } catch (err) {
      console.error('Error fetching container details:', err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to load container details.', 
        severity: 'error' 
      });
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    fetchProjects();
  }, [fetchMetadata, fetchProjects]);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  // Handlers
  const handleOpenCreateContainerDialog = () => {
    setCurrentBudget(null);
    setFormData({
      budgetName: '',
      finYearId: '',
      departmentId: '',
      description: '',
      requiresApprovalForChanges: true
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (container) => {
    setCurrentBudget(container);
    setFormData({
      budgetName: container.budgetName || '',
      finYearId: container.finYearId || '',
      departmentId: container.departmentId || '',
      description: container.description || '',
      requiresApprovalForChanges: container.requiresApprovalForChanges !== 0
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleViewContainer = async (container) => {
    setSelectedContainer(container);
    setActiveTab(1);
    await fetchContainerDetails(container.budgetId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBudget(null);
    setFormErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProjectSelect = (event, value) => {
    if (value) {
      setFormData(prev => ({
        ...prev,
        projectId: value.id,
        projectName: value.projectName || value.project_name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        projectId: '',
        projectName: ''
      }));
    }
  };

  const validateContainerForm = () => {
    let errors = {};
    if (!formData.budgetName?.trim()) errors.budgetName = 'Budget Name is required.';
    if (!formData.finYearId) errors.finYearId = 'Financial Year is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleContainerSubmit = async () => {
    if (!validateContainerForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = {
        budgetName: formData.budgetName,
        finYearId: formData.finYearId,
        departmentId: formData.departmentId || null,
        description: formData.description || null,
        requiresApprovalForChanges: formData.requiresApprovalForChanges !== false
      };

      if (currentBudget) {
        await budgetService.updateBudgetContainer(currentBudget.budgetId, dataToSubmit);
        setSnackbar({ open: true, message: 'Budget container updated successfully!', severity: 'success' });
      } else {
        await budgetService.createBudgetContainer(dataToSubmit);
        setSnackbar({ open: true, message: 'Budget container created successfully!', severity: 'success' });
      }
      handleCloseDialog();
      // Reset to first page and refresh
      setPagination(prev => ({ ...prev, page: 1 }));
      await fetchContainers();
    } catch (err) {
      console.error("Submit container error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save budget container.';
      const errorDetails = err.response?.data?.details;
      const errorHint = err.response?.data?.hint;
      const statusCode = err.response?.status;
      
      let userMessage = errorMessage;
      if (statusCode === 403) {
        userMessage = 'You do not have permission to create budget containers. Please contact an administrator.';
      } else if (statusCode === 401) {
        userMessage = 'Authentication required. Please log in again.';
      } else if (statusCode === 400) {
        userMessage = errorMessage; // Use the validation error message
      } else if (errorHint) {
        userMessage = `${errorMessage}\n\n${errorHint}`;
      } else if (errorDetails) {
        userMessage = `${errorMessage}\n\nDetails: ${errorDetails}`;
      }
      
      setSnackbar({ 
        open: true, 
        message: userMessage, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveContainer = async (budgetId) => {
    if (!window.confirm('Are you sure you want to approve this budget? It will be locked and require change requests for modifications.')) {
      return;
    }

    setLoading(true);
    try {
      await budgetService.approveBudgetContainer(budgetId);
      setSnackbar({ open: true, message: 'Budget approved and locked successfully!', severity: 'success' });
      fetchContainers();
      if (selectedContainer?.budgetId === budgetId) {
        await fetchContainerDetails(budgetId);
      }
    } catch (err) {
      console.error("Approve container error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to approve budget.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Item Management Handlers
  const handleOpenAddItemDialog = () => {
    setCurrentItem(null);
    setItemFormData({
      projectId: '',
      projectName: '',
      departmentId: '',
      subcountyId: '',
      wardId: '',
      amount: '',
      remarks: '',
      changeReason: ''
    });
    setItemFormErrors({});
    setOpenItemDialog(true);
  };

  const handleOpenEditItemDialog = (item) => {
    setCurrentItem(item);
    setItemFormData({
      projectId: item.projectId || '',
      projectName: item.projectName || '',
      departmentId: item.departmentId || '',
      subcountyId: item.subcountyId || '',
      wardId: item.wardId || '',
      amount: item.amount || '',
      remarks: item.remarks || '',
      changeReason: ''
    });
    setItemFormErrors({});
    setOpenItemDialog(true);
  };

  const handleCloseItemDialog = () => {
    setOpenItemDialog(false);
    setCurrentItem(null);
    setItemFormData({
      projectId: '',
      projectName: '',
      departmentId: '',
      subcountyId: '',
      wardId: '',
      amount: '',
      remarks: '',
      changeReason: ''
    });
    setItemFormErrors({});
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({ ...prev, [name]: value }));
    if (itemFormErrors[name]) {
      setItemFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProjectSelectForItem = (event, value) => {
    if (value) {
      setItemFormData(prev => ({
        ...prev,
        projectId: value.id,
        projectName: value.projectName || value.project_name || ''
      }));
    } else {
      setItemFormData(prev => ({
        ...prev,
        projectId: '',
        projectName: ''
      }));
    }
  };

  const validateItemForm = () => {
    let errors = {};
    if (!itemFormData.projectName?.trim()) errors.projectName = 'Project Name is required.';
    if (!itemFormData.departmentId) errors.departmentId = 'Department is required.';
    if (!itemFormData.amount || parseFloat(itemFormData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0.';
    }
    
    // If container is approved and frozen, change reason is required
    if (selectedContainer?.status === 'Approved' && selectedContainer?.isFrozen === 1) {
      if (!itemFormData.changeReason?.trim()) {
        errors.changeReason = 'Change reason is required for approved budgets.';
      }
    }
    
    setItemFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleItemSubmit = async () => {
    if (!validateItemForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = {
        projectId: itemFormData.projectId || null,
        projectName: itemFormData.projectName,
        departmentId: itemFormData.departmentId,
        subcountyId: itemFormData.subcountyId || null,
        wardId: itemFormData.wardId || null,
        amount: parseFloat(itemFormData.amount),
        remarks: itemFormData.remarks || null,
        changeReason: itemFormData.changeReason || null
      };

      if (currentItem) {
        const result = await budgetService.updateBudgetItem(currentItem.itemId, dataToSubmit);
        if (result.message?.includes('pending approval')) {
          setSnackbar({ open: true, message: 'Change request created and pending approval!', severity: 'info' });
        } else {
          setSnackbar({ open: true, message: 'Budget item updated successfully!', severity: 'success' });
        }
      } else {
        const result = await budgetService.addBudgetItem(selectedContainer.budgetId, dataToSubmit);
        if (result.message?.includes('pending approval')) {
          setSnackbar({ open: true, message: 'Change request created and pending approval!', severity: 'info' });
        } else {
          setSnackbar({ open: true, message: 'Budget item added successfully!', severity: 'success' });
        }
      }
      handleCloseItemDialog();
      await fetchContainerDetails(selectedContainer.budgetId);
    } catch (err) {
      console.error("Submit item error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to save budget item.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from the budget?')) {
      return;
    }

    setLoading(true);
    try {
      const changeReason = selectedContainer?.status === 'Approved' && selectedContainer?.isFrozen === 1
        ? prompt('Change reason is required for approved budgets. Please provide a reason:')
        : null;
      
      if (selectedContainer?.status === 'Approved' && selectedContainer?.isFrozen === 1 && !changeReason) {
        setSnackbar({ open: true, message: 'Change reason is required.', severity: 'error' });
        setLoading(false);
        return;
      }

      const result = await budgetService.removeBudgetItem(itemId, changeReason);
      if (result.message?.includes('pending approval')) {
        setSnackbar({ open: true, message: 'Change request created and pending approval!', severity: 'info' });
      } else {
        setSnackbar({ open: true, message: 'Budget item removed successfully!', severity: 'success' });
      }
      await fetchContainerDetails(selectedContainer.budgetId);
    } catch (err) {
      console.error("Remove item error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to remove budget item.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Change Request Handlers
  const handleApproveChangeRequest = async (changeId) => {
    const reviewNotes = prompt('Enter review notes (optional):') || null;
    
    setLoading(true);
    try {
      await budgetService.approveChangeRequest(changeId, reviewNotes);
      setSnackbar({ open: true, message: 'Change request approved and applied successfully!', severity: 'success' });
      await fetchContainerDetails(selectedContainer.budgetId);
    } catch (err) {
      console.error("Approve change request error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to approve change request.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectChangeRequest = async (changeId) => {
    const reviewNotes = prompt('Enter rejection reason (required):');
    if (!reviewNotes) {
      setSnackbar({ open: true, message: 'Rejection reason is required.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      await budgetService.rejectChangeRequest(changeId, reviewNotes);
      setSnackbar({ open: true, message: 'Change request rejected successfully!', severity: 'success' });
      await fetchContainerDetails(selectedContainer.budgetId);
    } catch (err) {
      console.error("Reject change request error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to reject change request.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteConfirmDialog = (budgetId, projectName) => {
    setBudgetToDeleteId(budgetId);
    setBudgetToDeleteName(projectName);
    setOpenDeleteConfirmDialog(true);
  };

  const handleCloseDeleteConfirmDialog = () => {
    setOpenDeleteConfirmDialog(false);
    setBudgetToDeleteId(null);
    setBudgetToDeleteName('');
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    handleCloseDeleteConfirmDialog();
    try {
      // Note: Container deletion would need to be implemented in the backend
      // For now, we'll show an error
      setSnackbar({ 
        open: true, 
        message: 'Container deletion not yet implemented. Use soft delete via voided flag.', 
        severity: 'warning' 
      });
      fetchContainers();
    } catch (err) {
      console.error("Delete container error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to delete budget container.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Export functions
  const handleExportItemsToExcel = () => {
    setExportingExcel(true);
    try {
      const headers = ['Project Name', 'Department', 'Subcounty', 'Ward', 'Amount (KES)', 'Remarks'];
      const dataRows = containerItems.map(item => [
        formatToSentenceCase(item.projectName) || 'N/A',
        item.departmentName || 'N/A',
        formatToSentenceCase(item.subcountyName) || 'N/A',
        formatToSentenceCase(item.wardName) || 'N/A',
        item.amount || 0,
        item.remarks || ''
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Budget Items');
      
      // Auto-size columns
      const colWidths = headers.map((_, colIndex) => {
        const maxLength = Math.max(
          headers[colIndex].length,
          ...dataRows.map(row => String(row[colIndex] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `budget_items_${selectedContainer?.budgetName?.replace(/[^a-z0-9]/gi, '_') || 'export'}_${dateStr}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      setSnackbar({ 
        open: true, 
        message: `Exported ${containerItems.length} item(s) to Excel successfully!`, 
        severity: 'success' 
      });
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setSnackbar({ open: true, message: 'Failed to export to Excel. Please try again.', severity: 'error' });
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportItemsToPDF = () => {
    setExportingPdf(true);
    try {
      const headers = ['Project Name', 'Department', 'Subcounty', 'Ward', 'Amount (KES)', 'Remarks'];
      const dataRows = containerItems.map(item => [
        formatToSentenceCase(item.projectName) || 'N/A',
        item.departmentName || 'N/A',
        formatToSentenceCase(item.subcountyName) || 'N/A',
        formatToSentenceCase(item.wardName) || 'N/A',
        formatCurrency(item.amount || 0),
        item.remarks || ''
      ]);

      const doc = new jsPDF('landscape', 'pt', 'a4');
      
      // Add title
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(selectedContainer?.budgetName || 'Budget Items', 40, 30);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Financial Year: ${selectedContainer?.finYearName || 'N/A'}`, 40, 50);
      doc.text(`Total Items: ${containerItems.length}`, 40, 65);
      doc.text(`Total Amount: ${formatCurrency(selectedContainer?.totalAmount || 0)}`, 40, 80);

      // Add table
      autoTable(doc, {
        head: [headers],
        body: dataRows,
        startY: 95,
        styles: { 
          fontSize: 8, 
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: { 
          fillColor: [41, 128, 185], 
          textColor: 255, 
          fontStyle: 'bold' 
        },
        columnStyles: {
          4: { halign: 'right' } // Right align amount column
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 95, left: 40, right: 40 },
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `budget_items_${selectedContainer?.budgetName?.replace(/[^a-z0-9]/gi, '_') || 'export'}_${dateStr}.pdf`;
      doc.save(filename);
      
      setSnackbar({ 
        open: true, 
        message: `Exported ${containerItems.length} item(s) to PDF successfully!`, 
        severity: 'success' 
      });
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      setSnackbar({ open: true, message: 'Failed to export to PDF. Please try again.', severity: 'error' });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      finYearId: '',
      departmentId: '',
      status: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Draft': 'default',
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'error',
      'Cancelled': 'default'
    };
    return statusColors[status] || 'default';
  };

  const containerColumns = [
    { 
      field: 'budgetId', 
      headerName: 'ID', 
      width: 70,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'budgetName', 
      headerName: 'Budget Name', 
      flex: 2, 
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} noWrap>
          {params.row.budgetName || 'N/A'}
        </Typography>
      )
    },
    { 
      field: 'finYearName', 
      headerName: 'Year', 
      flex: 1, 
      minWidth: 100 
    },
    { 
      field: 'departmentName', 
      headerName: 'Department', 
      flex: 1.2, 
      minWidth: 120 
    },
    { 
      field: 'totalAmount', 
      headerName: 'Amount', 
      flex: 1, 
      minWidth: 130,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} color="success.main">
          {formatCurrency(params.row.totalAmount || 0)}
        </Typography>
      )
    },
    { 
      field: 'itemCount', 
      headerName: 'Items', 
      width: 80,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.row.itemCount || 0} 
          size="small" 
          sx={{ height: 24, fontSize: '0.75rem' }}
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
          <Chip 
            label={params.row.status} 
            color={getStatusColor(params.row.status)}
            size="small"
            sx={{ height: 24, fontSize: '0.75rem' }}
          />
          {params.row.isFrozen === 1 && (
            <LockIcon fontSize="small" color="action" sx={{ fontSize: 16 }} />
          )}
        </Stack>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isApproved = params.row.status === 'Approved';
        const isFrozen = params.row.isFrozen === 1;
        const canApprove = hasPrivilege?.('budget.approve') && !isApproved;
        
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton 
                color="primary" 
                size="small"
                onClick={() => handleViewContainer(params.row)}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isFrozen && (
              <Tooltip title="Edit">
                <IconButton 
                  color="primary" 
                  size="small"
                  onClick={() => handleOpenEditDialog(params.row)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {canApprove && (
              <Tooltip title="Approve">
                <IconButton 
                  color="success" 
                  size="small"
                  onClick={() => handleApproveContainer(params.row.budgetId)}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!containers || containers.length === 0) {
      return {
        totalBudgets: 0,
        totalAmount: 0,
        totalItems: 0,
        approvedCount: 0,
        pendingCount: 0,
        draftCount: 0
      };
    }

    const totalBudgets = containers.length;
    const totalAmount = containers.reduce((sum, container) => {
      return sum + (parseFloat(container.totalAmount) || 0);
    }, 0);
    const totalItems = containers.reduce((sum, container) => {
      return sum + (parseInt(container.itemCount) || 0);
    }, 0);
    const approvedCount = containers.filter(c => c.status === 'Approved').length;
    const pendingCount = containers.filter(c => c.status === 'Pending' || c.status === 'Pending Approval').length;
    const draftCount = containers.filter(c => c.status === 'Draft').length;

    return {
      totalBudgets,
      totalAmount,
      totalItems,
      approvedCount,
      pendingCount,
      draftCount
    };
  }, [containers]);

  // Show loading only on initial load
  if (loading && containers.length === 0 && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading budget containers...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Compact Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MoneyIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Box>
            <Typography variant="h5" component="h1" sx={{ color: theme.palette.primary.main, fontWeight: 700, lineHeight: 1.2 }}>
              Budget Management
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              Manage containers & track approvals
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateContainerDialog}
          sx={{ 
            backgroundColor: '#16a34a', 
            '&:hover': { backgroundColor: '#15803d' }, 
            color: 'white', 
            fontWeight: 600, 
            borderRadius: '6px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            px: 2,
            py: 0.75
          }}
        >
          New Container
        </Button>
      </Box>

      {/* Summary Statistics Cards */}
      {activeTab === 0 && containers.length > 0 && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', fontWeight: 600 }}>
                    Total Budgets
                  </Typography>
                  <WalletIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {summaryStats.totalBudgets}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                  {summaryStats.totalItems} items
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', fontWeight: 600 }}>
                    Total Amount
                  </Typography>
                  <MoneyIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {formatCurrency(summaryStats.totalAmount)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                  All budgets
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', fontWeight: 600 }}>
                    Approved
                  </Typography>
                  <CheckCircleIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {summaryStats.approvedCount}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                  {summaryStats.totalBudgets > 0 ? Math.round((summaryStats.approvedCount / summaryStats.totalBudgets) * 100) : 0}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                border: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', fontWeight: 600 }}>
                    Pending
                  </Typography>
                  <PendingIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {summaryStats.pendingCount}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                  Awaiting approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card 
              elevation={0}
              sx={{ 
                background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                color: 'white',
                border: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem', fontWeight: 600 }}>
                    Draft
                  </Typography>
                  <EditIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {summaryStats.draftCount}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem' }}>
                  In progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Compact Tabs */}
      <Paper elevation={0} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ minHeight: 40 }}
        >
          <Tab 
            label="Containers" 
            icon={<MoneyIcon sx={{ fontSize: 18 }} />} 
            iconPosition="start"
            sx={{ minHeight: 40, py: 1, textTransform: 'none', fontWeight: 600 }}
          />
          {selectedContainer && (
            <Tab 
              label={selectedContainer.budgetName || 'Details'} 
              icon={<ViewIcon sx={{ fontSize: 18 }} />} 
              iconPosition="start"
              sx={{ minHeight: 40, py: 1, textTransform: 'none', fontWeight: 600 }}
            />
          )}
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>

      {/* Compact Filters */}
      <Paper elevation={0} sx={{ p: 1.5, mb: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Budget name..."
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
            />
          </Grid>
          <Grid item xs={6} sm={2.5} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.finYearId}
                label="Year"
                onChange={(e) => handleFilterChange('finYearId', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {financialYears.map((fy) => (
                  <MenuItem key={fy.finYearId} value={fy.finYearId}>
                    {fy.finYearName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2.5} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
              <InputLabel>Dept</InputLabel>
              <Select
                value={filters.departmentId}
                label="Dept"
                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2} md={1.5}>
            <FormControl fullWidth size="small" sx={{ minWidth: 100, bgcolor: 'background.paper' }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={1} md={1}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              sx={{ height: '40px', minWidth: 'auto' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

          {/* Compact Containers Table */}
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            <Box
              height="calc(100vh - 320px)"
              minHeight={400}
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 1,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderBottom: "2px solid",
                  borderColor: "divider",
                  fontWeight: 600,
                  fontSize: '0.875rem',
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: 'transparent',
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid",
                  borderColor: "divider",
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                },
              }}
            >
            {containers && containers.length > 0 ? (
              <DataGrid
                rows={containers}
                columns={containerColumns}
                getRowId={(row) => row.budgetId}
                paginationMode="server"
                rowCount={pagination.total}
                page={pagination.page - 1}
                pageSize={pagination.limit}
                onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage + 1 }))}
                onPageSizeChange={(newPageSize) => setPagination(prev => ({ ...prev, limit: newPageSize, page: 1 }))}
                rowsPerPageOptions={[25, 50, 100]}
              />
            ) : !loading ? (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" gap={1.5} p={4}>
                <MoneyIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">No budget containers found</Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {error ? `Error: ${error}` : 'Create a new container to get started'}
                </Typography>
                {containers.length === 0 && pagination.total > 0 && (
                  <Typography variant="caption" color="warning.main" sx={{ mt: 1 }}>
                    {pagination.total} container(s) may be filtered out. Try clearing filters.
                  </Typography>
                )}
              </Box>
            ) : null}
            </Box>
          </Paper>
        </>
      )}

      {activeTab === 1 && selectedContainer && (
        <Box>
          {/* Compact Container Details Header */}
          <Card elevation={0} sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1.5}>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {selectedContainer.budgetName}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap" gap={0.5}>
                    <Chip 
                      label={selectedContainer.status} 
                      color={getStatusColor(selectedContainer.status)}
                      size="small"
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                    {selectedContainer.isFrozen === 1 && (
                      <Chip 
                        icon={<LockIcon sx={{ fontSize: 14 }} />}
                        label="Locked" 
                        color="warning"
                        size="small"
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    )}
                  </Stack>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewIcon />}
                  onClick={() => setActiveTab(0)}
                  sx={{ ml: 2 }}
                >
                  Back
                </Button>
              </Box>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Financial Year</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedContainer.finYearName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Department</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedContainer.departmentName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary" display="block">Total Amount</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">
                    {formatCurrency(selectedContainer.totalAmount || 0)}
                  </Typography>
                </Grid>
              </Grid>
              {selectedContainer.description && (
                <Box mt={1.5} pt={1.5} borderTop={1} borderColor="divider">
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Description</Typography>
                  <Typography variant="body2">{selectedContainer.description}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Compact Budget Items */}
          <Card elevation={0} sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Budget Items <Chip label={containerItems.length} size="small" sx={{ ml: 1, height: 20 }} />
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {containerItems.length > 0 && (
                    <>
                      <Tooltip title="Export to Excel">
                        <IconButton
                          size="small"
                          onClick={handleExportItemsToExcel}
                          disabled={exportingExcel}
                          sx={{ 
                            border: 1, 
                            borderColor: 'divider',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          {exportingExcel ? (
                            <CircularProgress size={16} />
                          ) : (
                            <FileDownloadIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export to PDF">
                        <IconButton
                          size="small"
                          onClick={handleExportItemsToPDF}
                          disabled={exportingPdf}
                          sx={{ 
                            border: 1, 
                            borderColor: 'divider',
                            '&:hover': { bgcolor: 'action.hover' }
                          }}
                        >
                          {exportingPdf ? (
                            <CircularProgress size={16} />
                          ) : (
                            <PictureAsPdfIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {selectedContainer.status !== 'Approved' || selectedContainer.isFrozen !== 1 ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleOpenAddItemDialog}
                      sx={{ height: 32 }}
                    >
                      Add Item
                    </Button>
                  ) : (
                    <Chip 
                      icon={<LockIcon sx={{ fontSize: 14 }} />}
                      label="Locked" 
                      color="warning"
                      size="small"
                      sx={{ height: 24 }}
                    />
                  )}
                </Stack>
              </Box>
              <TableContainer>
                <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: '0.813rem' } }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, width: 50, textAlign: 'center', fontSize: '0.75rem' }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }}>Project Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }}>Subcounty</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }}>Ward</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }} align="right">Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700, py: 0.75, fontSize: '0.813rem' }} align="center" width={90}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {containerItems.length > 0 ? (
                      containerItems.map((item, index) => (
                        <TableRow 
                          key={item.itemId} 
                          hover
                          sx={{ 
                            '&:nth-of-type(even)': { bgcolor: 'action.hover' },
                            '&:hover': { bgcolor: 'action.selected' }
                          }}
                        >
                          <TableCell sx={{ py: 0.75, textAlign: 'center', fontWeight: 600, color: 'text.secondary', fontSize: '0.813rem' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ py: 0.75, fontSize: '0.813rem' }}>{formatToSentenceCase(item.projectName) || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 0.75, fontSize: '0.813rem' }}>{item.departmentName || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 0.75, fontSize: '0.813rem' }}>{formatToSentenceCase(item.subcountyName) || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 0.75, fontSize: '0.813rem' }}>{formatToSentenceCase(item.wardName) || 'N/A'}</TableCell>
                          <TableCell sx={{ py: 0.75, align: 'right', fontWeight: 600, fontSize: '0.813rem', color: 'success.main' }}>
                            {formatCurrency(item.amount || 0)}
                          </TableCell>
                          <TableCell sx={{ py: 0.5 }} align="center">
                            <Stack direction="row" spacing={1}>
                              {selectedContainer.status !== 'Approved' || selectedContainer.isFrozen !== 1 ? (
                                <>
                                  <Tooltip title="Edit">
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleOpenEditItemDialog(item)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove">
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleRemoveItem(item.itemId)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <Tooltip title="Use change request to modify">
                                  <IconButton size="small" disabled>
                                    <LockIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No items in this budget container
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Compact Pending Change Requests */}
          {pendingChanges.length > 0 && (
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Pending Change Requests <Chip label={pendingChanges.length} size="small" sx={{ ml: 1, height: 20 }} />
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, py: 1 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 1 }}>Reason</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 1 }}>Requested By</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 1 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 1 }} align="center" width={120}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingChanges.map((change) => (
                        <TableRow key={change.changeId} hover>
                          <TableCell sx={{ py: 1 }}>{change.changeType}</TableCell>
                          <TableCell sx={{ py: 1 }}>{change.changeReason}</TableCell>
                          <TableCell sx={{ py: 1 }}>
                            {change.requestedByFirstName} {change.requestedByLastName}
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>{new Date(change.requestedAt).toLocaleDateString()}</TableCell>
                          <TableCell sx={{ py: 0.5 }} align="center">
                            {hasPrivilege?.('budget.approve') && change.status === 'Pending Approval' && (
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Approve">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleApproveChangeRequest(change.changeId)}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleRejectChangeRequest(change.changeId)}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            )}
                            {change.status !== 'Pending Approval' && (
                              <Chip 
                                label={change.status} 
                                color={change.status === 'Approved' ? 'success' : 'error'}
                                size="small"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Create/Edit Container Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyIcon />
          {currentBudget ? 'Edit Budget Container' : 'Create Budget Container'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                name="budgetName"
                label="Budget Name *"
                value={formData.budgetName}
                onChange={handleFormChange}
                error={!!formErrors.budgetName}
                helperText={formErrors.budgetName || 'e.g., "2025/2026 Budget"'}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" error={!!formErrors.finYearId} sx={{ minWidth: 200 }}>
                <InputLabel>Financial Year *</InputLabel>
                <Select
                  name="finYearId"
                  label="Financial Year *"
                  value={formData.finYearId}
                  onChange={handleFormChange}
                >
                  {financialYears.map((fy) => (
                    <MenuItem key={fy.finYearId} value={fy.finYearId}>
                      {fy.finYearName}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.finYearId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {formErrors.finYearId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  label="Department"
                  value={formData.departmentId}
                  onChange={handleFormChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Budget description and notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleContainerSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : (currentBudget ? 'Update Container' : 'Create Container')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirmDialog} onClose={handleCloseDeleteConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete budget for "{budgetToDeleteName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Item Dialog */}
      <Dialog open={openItemDialog} onClose={handleCloseItemDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyIcon />
          {currentItem ? 'Edit Budget Item' : 'Add Budget Item'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default, pt: 2 }}>
          {selectedContainer?.status === 'Approved' && selectedContainer?.isFrozen === 1 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This budget is approved and locked. Adding/modifying items will create a change request that requires approval.
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={projects}
                getOptionLabel={(option) => option.projectName || option.project_name || ''}
                value={projects.find(p => p.id === itemFormData.projectId) || null}
                onChange={handleProjectSelectForItem}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Link to Project (Optional)"
                    placeholder="Search and select a project..."
                    margin="dense"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                name="projectName"
                label="Project Name *"
                value={itemFormData.projectName}
                onChange={handleItemFormChange}
                error={!!itemFormErrors.projectName}
                helperText={itemFormErrors.projectName || 'Enter the project name for this budget item'}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" error={!!itemFormErrors.departmentId} sx={{ minWidth: 200 }}>
                <InputLabel>Department *</InputLabel>
                <Select
                  name="departmentId"
                  label="Department *"
                  value={itemFormData.departmentId}
                  onChange={handleItemFormChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {itemFormErrors.departmentId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {itemFormErrors.departmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" sx={{ minWidth: 200 }}>
                <InputLabel>Subcounty</InputLabel>
                <Select
                  name="subcountyId"
                  label="Subcounty"
                  value={itemFormData.subcountyId}
                  onChange={handleItemFormChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {subcounties.map((sc) => (
                    <MenuItem key={sc.subcountyId} value={sc.subcountyId}>
                      {sc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense" disabled={!itemFormData.subcountyId} sx={{ minWidth: 200 }}>
                <InputLabel>Ward</InputLabel>
                <Select
                  name="wardId"
                  label="Ward"
                  value={itemFormData.wardId}
                  onChange={handleItemFormChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {wards.map((ward) => (
                    <MenuItem key={ward.wardId} value={ward.wardId}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="dense"
                name="amount"
                label="Amount (KES) *"
                type="number"
                value={itemFormData.amount}
                onChange={handleItemFormChange}
                error={!!itemFormErrors.amount}
                helperText={itemFormErrors.amount || 'Enter the budget amount'}
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>KES</Typography>
                }}
              />
            </Grid>

            {(selectedContainer?.status === 'Approved' && selectedContainer?.isFrozen === 1) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="dense"
                  name="changeReason"
                  label="Change Reason *"
                  multiline
                  rows={2}
                  value={itemFormData.changeReason}
                  onChange={handleItemFormChange}
                  error={!!itemFormErrors.changeReason}
                  helperText={itemFormErrors.changeReason || 'Explain why this change is needed'}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                name="remarks"
                label="Remarks"
                multiline
                rows={3}
                value={itemFormData.remarks}
                onChange={handleItemFormChange}
                placeholder="Additional notes or remarks..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseItemDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleItemSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : (currentItem ? 'Update Item' : 'Add Item')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BudgetManagementPage;

