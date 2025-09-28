import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton,
  Alert, Snackbar, Stack, Collapse, Accordion, AccordionSummary, AccordionDetails,
  Grid, useTheme
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import apiService from '../api';
import useDepartmentData from '../hooks/useDepartmentData';

// Reusable Delete Confirmation Dialog
const DeleteConfirmDialog = ({ open, onClose, onConfirm, itemToDeleteName, itemType }) => {
  console.log('DeleteConfirmDialog props:', { open, itemToDeleteName, itemType });
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this {itemType} "{itemToDeleteName}"? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

const DepartmentAndSectionManagement = () => {
  const { hasPrivilege } = useAuth();
  const theme = useTheme();

  const {
    departments, loading, setLoading, snackbar, setSnackbar,
    fetchDepartmentsAndSections,
  } = useDepartmentData();

  const [dialogState, setDialogState] = useState({
    openDeptDialog: false,
    openSectionDialog: false,
    openDeleteConfirmDialog: false,
    currentDeptToEdit: null,
    currentSectionToEdit: null,
    deptFormData: { name: '', alias: '', location: '', address: '', contactPerson: '', phoneNumber: '', email: '', remarks: '' },
    sectionFormData: { name: '', alias: '', departmentId: '' },
    itemToDelete: null,
    deptFormErrors: {},
    sectionFormErrors: {}
  });

  const {
    openDeptDialog, openSectionDialog, openDeleteConfirmDialog,
    currentDeptToEdit, currentSectionToEdit,
    deptFormData, sectionFormData, itemToDelete,
    deptFormErrors, sectionFormErrors
  } = dialogState;

  const setDialogStateValue = (key, value) => {
    setDialogState(prev => ({ ...prev, [key]: value }));
  };
  
  const handleOpenCreateDeptDialog = () => {
    if (!hasPrivilege('department.create')) {
      setSnackbar({ open: true, message: "Permission denied to create departments.", severity: 'error' });
      return;
    }
    setDialogStateValue('currentDeptToEdit', null);
    setDialogStateValue('deptFormData', { name: '', alias: '', location: '', address: '', contactPerson: '', phoneNumber: '', email: '', remarks: '' });
    setDialogStateValue('deptFormErrors', {});
    setDialogStateValue('openDeptDialog', true);
  };

  const handleOpenEditDeptDialog = (department) => {
    if (!hasPrivilege('department.update')) {
      setSnackbar({ open: true, message: "Permission denied to update departments.", severity: 'error' });
      return;
    }
    setDialogStateValue('currentDeptToEdit', department);
    setDialogStateValue('deptFormData', { 
      name: department.name || '', 
      alias: department.alias || '', 
      location: department.location || '',
      address: department.address || '',
      contactPerson: department.contactPerson || '',
      phoneNumber: department.phoneNumber || '',
      email: department.email || '',
      remarks: department.remarks || ''
    });
    setDialogStateValue('deptFormErrors', {});
    setDialogStateValue('openDeptDialog', true);
  };

  const handleDeptFormChange = (e) => {
    const { name, value } = e.target;
    setDialogState(prev => ({ 
      ...prev, 
      deptFormData: { 
        ...prev.deptFormData, 
        [name]: value 
      } 
    }));

    // Real-time validation for name field
    if (name === 'name') {
      const trimmedName = value.trim();
      if (trimmedName) {
        const isDuplicate = departments.some(dept => 
          dept.name.toLowerCase() === trimmedName.toLowerCase() && 
          (!currentDeptToEdit || dept.departmentId !== currentDeptToEdit.departmentId)
        );
        if (isDuplicate) {
          setDialogState(prev => ({
            ...prev,
            deptFormErrors: {
              ...prev.deptFormErrors,
              name: 'A department with this name already exists.'
            }
          }));
        } else {
          setDialogState(prev => ({
            ...prev,
            deptFormErrors: {
              ...prev.deptFormErrors,
              name: ''
            }
          }));
        }
      } else {
        setDialogState(prev => ({
          ...prev,
          deptFormErrors: {
            ...prev.deptFormErrors,
            name: ''
          }
        }));
      }
    }
  };

  const validateDeptForm = () => {
    let errors = {};
    if (!deptFormData.name) {
      errors.name = 'Name is required.';
    } else {
      // Check for duplicate names (case-insensitive)
      const trimmedName = deptFormData.name.trim();
      const isDuplicate = departments.some(dept => 
        dept.name.toLowerCase() === trimmedName.toLowerCase() && 
        (!currentDeptToEdit || dept.departmentId !== currentDeptToEdit.departmentId)
      );
      if (isDuplicate) {
        errors.name = 'A department with this name already exists.';
      }
    }
    if (deptFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deptFormData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    setDialogStateValue('deptFormErrors', errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeptSubmit = async () => {
    if (!validateDeptForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      if (currentDeptToEdit) {
        console.log('Updating department:', currentDeptToEdit.departmentId, deptFormData);
        await apiService.metadata.departments.updateDepartment(currentDeptToEdit.departmentId, deptFormData);
        setSnackbar({ open: true, message: 'Department updated successfully!', severity: 'success' });
      } else {
        console.log('Creating department:', deptFormData);
        await apiService.metadata.departments.createDepartment(deptFormData);
        setSnackbar({ open: true, message: 'Department created successfully!', severity: 'success' });
      }
      setDialogStateValue('openDeptDialog', false);
      fetchDepartmentsAndSections();
    } catch (error) {
      console.error('Department save error:', error);
      let errorMessage = error.response?.data?.message || error.message || 'Failed to save department.';
      
      // Handle duplicate name error specifically
      if (error.response?.status === 409) {
        errorMessage = 'A department with this name already exists.';
        // Set the name field error for immediate feedback
        setDialogState(prev => ({
          ...prev,
          deptFormErrors: {
            ...prev.deptFormErrors,
            name: errorMessage
          }
        }));
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenCreateSectionDialog = (departmentId) => {
      if (!hasPrivilege('section.create')) {
        setSnackbar({ open: true, message: "Permission denied to create sections.", severity: 'error' });
        return;
      }
      setDialogStateValue('currentSectionToEdit', { departmentId });
      setDialogStateValue('sectionFormData', { departmentId, name: '', alias: '' });
      setDialogStateValue('sectionFormErrors', {});
      setDialogStateValue('openSectionDialog', true);
  };
  
  const handleOpenEditSectionDialog = (section) => {
    console.log('Opening edit section dialog for:', section);
    if (!hasPrivilege('section.update')) {
      setSnackbar({ open: true, message: "Permission denied to update sections.", severity: 'error' });
      return;
    }
    const formData = { name: section.name, alias: section.alias, departmentId: section.departmentId };
    console.log('Setting section form data to:', formData);
    setDialogStateValue('currentSectionToEdit', section);
    setDialogStateValue('sectionFormData', formData);
    setDialogStateValue('sectionFormErrors', {});
    setDialogStateValue('openSectionDialog', true);
  };

  const handleCloseSectionDialog = () => {
    setDialogStateValue('openSectionDialog', false);
    setDialogStateValue('currentSectionToEdit', null);
    setDialogStateValue('sectionFormErrors', {});
  };
  
  const handleSectionFormChange = (e) => {
      const { name, value } = e.target;
      console.log('Section form change:', { name, value });
      setDialogState(prev => ({ ...prev, sectionFormData: { ...prev.sectionFormData, [name]: value } }));
  };

  const validateSectionForm = () => {
    let errors = {};
    if (!sectionFormData.name) errors.name = 'Name is required.';
    setDialogStateValue('sectionFormErrors', errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSectionSubmit = async () => {
    if (!validateSectionForm()) {
      setSnackbar({ open: true, message: 'Please correct the form errors.', severity: 'error' });
      return;
    }
    setLoading(true);
    try {
      if (currentSectionToEdit?.sectionId) {
        console.log('Updating section:', currentSectionToEdit.sectionId);
        console.log('Section form data being sent:', sectionFormData);
        console.log('Current section to edit:', currentSectionToEdit);
        // CORRECTED: Call the metadata sections service for update
        await apiService.metadata.sections.updateSection(currentSectionToEdit.sectionId, sectionFormData);
        setSnackbar({ open: true, message: 'Section updated successfully!', severity: 'success' });
      } else {
        console.log('Creating section:', sectionFormData);
        // CORRECTED: Call the metadata sections service for create
        await apiService.metadata.sections.createSection(sectionFormData);
        setSnackbar({ open: true, message: 'Section created successfully!', severity: 'success' });
      }
      handleCloseSectionDialog();
      fetchDepartmentsAndSections();
    } catch (error) {
      console.error('Section save error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save section.';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Handlers ---
  const handleOpenDeleteConfirm = (item, type) => {
    console.log('Opening delete confirm for:', { item, type });
    if (type === 'department' && !hasPrivilege('department.delete')) {
      setSnackbar({ open: true, message: "Permission denied to delete departments.", severity: 'error' });
      return;
    }
    if (type === 'section' && !hasPrivilege('section.delete')) {
      setSnackbar({ open: true, message: "Permission denied to delete sections.", severity: 'error' });
      return;
    }
    const deleteItem = { 
      id: item.departmentId || item.sectionId, 
      name: item.name, 
      type 
    };
    console.log('Setting item to delete:', deleteItem);
    setDialogStateValue('itemToDelete', deleteItem);
    setDialogStateValue('openDeleteConfirmDialog', true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    setDialogStateValue('openDeleteConfirmDialog', false);
    try {
      if (itemToDelete.type === 'department') {
        console.log('Deleting department:', itemToDelete.id);
        await apiService.metadata.departments.deleteDepartment(itemToDelete.id);
        setSnackbar({ open: true, message: 'Department deleted successfully!', severity: 'success' });
      } else if (itemToDelete.type === 'section') {
        console.log('Deleting section:', itemToDelete.id);
        await apiService.metadata.sections.deleteSection(itemToDelete.id);
        setSnackbar({ open: true, message: 'Section deleted successfully!', severity: 'success' });
      }
      // Refresh the data after successful deletion
      await fetchDepartmentsAndSections();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to delete ${itemToDelete.type}.`;
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
      setDialogStateValue('itemToDelete', null);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && departments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          Departments & Sections
        </Typography>
        {hasPrivilege('department.create') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDeptDialog}
            sx={{ backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' }, color: 'white', fontWeight: 'semibold', borderRadius: '8px' }}
          >
            Add New Department
          </Button>
        )}
      </Box>

      {departments.length === 0 ? (
        <Alert severity="info">No departments found. Add a new department to get started.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: theme.shadows[2] }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.departmentId}>
                  <TableCell colSpan={2} sx={{ p: 0, borderBottom: 'none' }}>
                    <Accordion sx={{ boxShadow: 'none', '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container alignItems="center">
                          <Grid item xs={8}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{department.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{department.alias} - {department.location}</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            {hasPrivilege('department.update') && (
                              <IconButton onClick={(e) => { e.stopPropagation(); handleOpenEditDeptDialog(department); }} color="primary">
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            {hasPrivilege('department.delete') && (
                              <IconButton onClick={(e) => { e.stopPropagation(); handleOpenDeleteConfirm(department, 'department'); }} color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      </AccordionSummary>
                      <AccordionDetails sx={{ py: 1 }}>
                        <Box sx={{ pl: 4, pr: 2, pt: 2, pb: 4 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Sections for {department.name}</Typography>
                            {hasPrivilege('section.create') && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => handleOpenCreateSectionDialog(department.departmentId)}
                                >
                                  Add Section
                                </Button>
                            )}
                          </Box>
                          <TableContainer component={Paper} sx={{ mb: 2, boxShadow: theme.shadows[1] }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.secondary.main }}>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>ID</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Name</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Alias</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {department.sections.map((section) => (
                                  <TableRow key={section.sectionId}>
                                    <TableCell>{section.sectionId}</TableCell>
                                    <TableCell>{section.name}</TableCell>
                                    <TableCell>{section.alias}</TableCell>
                                    <TableCell align="right">
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        {hasPrivilege('section.update') && (
                                          <IconButton onClick={() => handleOpenEditSectionDialog(section)} color="primary">
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                        {hasPrivilege('section.delete') && (
                                          <IconButton onClick={() => handleOpenDeleteConfirm(section, 'section')} color="error">
                                            <DeleteIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Department Dialog */}
      <Dialog open={openDeptDialog} onClose={() => setDialogStateValue('openDeptDialog', false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          {currentDeptToEdit ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Department Name"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.name}
            onChange={handleDeptFormChange}
            error={!!deptFormErrors.name}
            helperText={deptFormErrors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="alias"
            label="Alias"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.alias}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.location}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.address}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="contactPerson"
            label="Contact Person"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.contactPerson}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="phoneNumber"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            value={deptFormData.phoneNumber}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={deptFormData.email}
            onChange={handleDeptFormChange}
            error={!!deptFormErrors.email}
            helperText={deptFormErrors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="remarks"
            label="Remarks"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={deptFormData.remarks}
            onChange={handleDeptFormChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setDialogStateValue('openDeptDialog', false)} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleDeptSubmit} color="primary" variant="contained">{currentDeptToEdit ? 'Update Department' : 'Create Department'}</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Section Dialog - Now used for both actions */}
      <Dialog open={openSectionDialog} onClose={handleCloseSectionDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
          {currentSectionToEdit?.sectionId ? 'Edit Section' : 'Add New Section'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default }}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Section Name"
            type="text"
            fullWidth
            variant="outlined"
            value={sectionFormData.name}
            onChange={handleSectionFormChange}
            error={!!sectionFormErrors.name}
            helperText={sectionFormErrors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="alias"
            label="Alias"
            type="text"
            fullWidth
            variant="outlined"
            value={sectionFormData.alias}
            onChange={handleSectionFormChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseSectionDialog} color="primary" variant="outlined">Cancel</Button>
          <Button onClick={handleSectionSubmit} color="primary" variant="contained">{currentSectionToEdit?.sectionId ? 'Update Section' : 'Create Section'}</Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmDialog
        open={openDeleteConfirmDialog}
        onClose={() => setDialogStateValue('openDeleteConfirmDialog', false)}
        onConfirm={handleConfirmDelete}
        itemToDeleteName={itemToDelete?.name || ''}
        itemType={itemToDelete?.type || ''}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentAndSectionManagement;