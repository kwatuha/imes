import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, IconButton,
  Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, 
  Stack, useTheme, Tooltip, Grid, Paper, Chip, Autocomplete
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import budgetService from '../api/budgetService';
import metaDataService from '../api/metaDataService';
import projectService from '../api/projectService';
import { useAuth } from '../context/AuthContext.jsx';
import { tokens } from "../pages/dashboard/theme";
import { formatCurrency } from '../utils/helpers';

function BudgetManagementPage() {
  const { user, hasPrivilege } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  
  // Filter states
  const [filters, setFilters] = useState({
    finYearId: '',
    departmentId: '',
    subcountyId: '',
    wardId: '',
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
  const [currentBudget, setCurrentBudget] = useState(null);
  const [formData, setFormData] = useState({
    finYearId: '',
    projectId: '',
    projectName: '',
    departmentId: '',
    subcountyId: '',
    wardId: '',
    amount: '',
    remarks: '',
    status: 'Draft'
  });
  const [formErrors, setFormErrors] = useState({});

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
      setFinancialYears(fyData || []);
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

  // Fetch wards when subcounty changes
  useEffect(() => {
    if (formData.subcountyId) {
      metaDataService.subcounties.getWardsBySubcounty(formData.subcountyId)
        .then(data => setWards(data || []))
        .catch(err => {
          console.error('Error fetching wards:', err);
          setWards([]);
        });
    } else {
      setWards([]);
      setFormData(prev => ({ ...prev, wardId: '' }));
    }
  }, [formData.subcountyId]);

  // Fetch budgets
  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      };
      
      const data = await budgetService.getBudgets(params);
      setBudgets(data.budgets || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 0
      }));
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError(err.message || "Failed to load budgets.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchMetadata();
    fetchProjects();
  }, [fetchMetadata, fetchProjects]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Handlers
  const handleOpenCreateDialog = () => {
    setCurrentBudget(null);
    setFormData({
      finYearId: '',
      projectId: '',
      projectName: '',
      departmentId: '',
      subcountyId: '',
      wardId: '',
      amount: '',
      remarks: '',
      status: 'Draft'
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (budget) => {
    setCurrentBudget(budget);
    setFormData({
      finYearId: budget.finYearId || '',
      projectId: budget.projectId || '',
      projectName: budget.projectName || '',
      departmentId: budget.departmentId || '',
      subcountyId: budget.subcountyId || '',
      wardId: budget.wardId || '',
      amount: budget.amount || '',
      remarks: budget.remarks || '',
      status: budget.status || 'Draft'
    });
    setFormErrors({});
    setOpenDialog(true);
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

  const validateForm = () => {
    let errors = {};
    if (!formData.finYearId) errors.finYearId = 'Financial Year is required.';
    if (!formData.projectName?.trim()) errors.projectName = 'Project Name is required.';
    if (!formData.departmentId) errors.departmentId = 'Department is required.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleFormSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount),
        projectId: formData.projectId || null,
        subcountyId: formData.subcountyId || null,
        wardId: formData.wardId || null,
        remarks: formData.remarks || null
      };

      if (currentBudget) {
        await budgetService.updateBudget(currentBudget.budgetId, dataToSubmit);
        setSnackbar({ open: true, message: 'Budget updated successfully!', severity: 'success' });
      } else {
        await budgetService.createBudget(dataToSubmit);
        setSnackbar({ open: true, message: 'Budget created successfully!', severity: 'success' });
      }
      handleCloseDialog();
      fetchBudgets();
    } catch (err) {
      console.error("Submit budget error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to save budget.', 
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
      await budgetService.deleteBudget(budgetToDeleteId);
      setSnackbar({ open: true, message: 'Budget deleted successfully!', severity: 'success' });
      fetchBudgets();
    } catch (err) {
      console.error("Delete budget error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || err.message || 'Failed to delete budget.', 
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      finYearId: '',
      departmentId: '',
      subcountyId: '',
      wardId: '',
      status: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'default',
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'error',
      'Cancelled': 'default'
    };
    return colors[status] || 'default';
  };

  const columns = [
    { field: 'budgetId', headerName: 'ID', flex: 0.5, minWidth: 60 },
    { 
      field: 'projectName', 
      headerName: 'Project Name', 
      flex: 2, 
      minWidth: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.projectName || params.row.linkedProjectName || 'N/A'}
          </Typography>
          {params.row.linkedProjectName && params.row.projectName && (
            <Typography variant="caption" color="text.secondary">
              (Linked: {params.row.linkedProjectName})
            </Typography>
          )}
        </Box>
      )
    },
    { 
      field: 'financialYearName', 
      headerName: 'Financial Year', 
      flex: 1, 
      minWidth: 120 
    },
    { 
      field: 'departmentName', 
      headerName: 'Department', 
      flex: 1.5, 
      minWidth: 150 
    },
    { 
      field: 'subcountyName', 
      headerName: 'Subcounty', 
      flex: 1, 
      minWidth: 120 
    },
    { 
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1, 
      minWidth: 120 
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1, 
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" color="success.main">
          {formatCurrency(params.row.amount)}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8, 
      minWidth: 100,
      renderCell: (params) => (
        <Chip 
          label={params.row.status} 
          color={getStatusColor(params.row.status)}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton 
              color="primary" 
              size="small"
              onClick={() => handleOpenEditDialog(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              size="small"
              onClick={() => handleOpenDeleteConfirmDialog(
                params.row.budgetId, 
                params.row.projectName || 'this budget'
              )}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading && budgets.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading budgets...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Budget Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage approved budgets for projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ 
            backgroundColor: '#16a34a', 
            '&:hover': { backgroundColor: '#15803d' }, 
            color: 'white', 
            fontWeight: 'semibold', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}
        >
          Add New Budget
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Filters
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Search Projects"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by project name..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Financial Year</InputLabel>
              <Select
                value={filters.finYearId}
                label="Financial Year"
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.departmentId}
                label="Department"
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Subcounty</InputLabel>
              <Select
                value={filters.subcountyId}
                label="Subcounty"
                onChange={(e) => handleFilterChange('subcountyId', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {subcounties.map((sc) => (
                  <MenuItem key={sc.subcountyId} value={sc.subcountyId}>
                    {sc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
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
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Budgets Table */}
      <Box
        m="20px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: `${colors.blueAccent[700]} !important`,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: `${colors.blueAccent[700]} !important`,
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {budgets && budgets.length > 0 ? (
          <DataGrid
            rows={budgets}
            columns={columns}
            getRowId={(row) => row.budgetId}
            paginationMode="server"
            rowCount={pagination.total}
            page={pagination.page - 1}
            pageSize={pagination.limit}
            onPageChange={(newPage) => setPagination(prev => ({ ...prev, page: newPage + 1 }))}
            onPageSizeChange={(newPageSize) => setPagination(prev => ({ ...prev, limit: newPageSize, page: 1 }))}
            rowsPerPageOptions={[25, 50, 100]}
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="h6">No budgets found. Add a new budget to get started.</Typography>
          </Box>
        )}
      </Box>

      {/* Create/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoneyIcon />
          {currentBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default, pt: 2 }}>
          <Grid container spacing={2}>
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
              <FormControl fullWidth margin="dense" error={!!formErrors.departmentId} sx={{ minWidth: 200 }}>
                <InputLabel>Department *</InputLabel>
                <Select
                  name="departmentId"
                  label="Department *"
                  value={formData.departmentId}
                  onChange={handleFormChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.departmentId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {formErrors.departmentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={projects}
                getOptionLabel={(option) => option.projectName || option.project_name || ''}
                value={projects.find(p => p.id === formData.projectId) || null}
                onChange={handleProjectSelect}
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
                value={formData.projectName}
                onChange={handleFormChange}
                error={!!formErrors.projectName}
                helperText={formErrors.projectName || 'Enter the project name for this budget'}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Subcounty</InputLabel>
                <Select
                  name="subcountyId"
                  label="Subcounty"
                  value={formData.subcountyId}
                  onChange={handleFormChange}
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
              <FormControl fullWidth margin="dense" disabled={!formData.subcountyId}>
                <InputLabel>Ward</InputLabel>
                <Select
                  name="wardId"
                  label="Ward"
                  value={formData.wardId}
                  onChange={handleFormChange}
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
                value={formData.amount}
                onChange={handleFormChange}
                error={!!formErrors.amount}
                helperText={formErrors.amount || 'Enter the approved budget amount'}
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>KES</Typography>
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                name="remarks"
                label="Remarks"
                multiline
                rows={3}
                value={formData.remarks}
                onChange={handleFormChange}
                placeholder="Additional notes or remarks..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleFormSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : (currentBudget ? 'Update Budget' : 'Create Budget')}
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

