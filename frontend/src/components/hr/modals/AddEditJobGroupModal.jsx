import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField
} from '@mui/material';
import apiService from '../../../api';

export default function AddEditJobGroupModal({
  isOpen,
  onClose,
  editedItem,
  showNotification,
  refreshData
}) {
  const [formData, setFormData] = useState({});
  const isEditMode = !!editedItem;

  useEffect(() => {
    setFormData(isEditMode ? editedItem : {
      groupName: '',
      salaryScale: '',
      description: ''
    });
  }, [isEditMode, editedItem]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isEditMode ? 'updateJobGroup' : 'addJobGroup';
    const apiFunction = apiService.hr[`${action.charAt(0).toLowerCase() + action.slice(1)}`];

    if (!apiFunction) {
      showNotification(`API function for ${action} not found.`, 'error');
      return;
    }

    try {
      const payload = { ...formData, userId: 1 };
      if (isEditMode) {
        await apiFunction(editedItem.id, payload);
      } else {
        await apiFunction(payload);
      }
      showNotification(`Job group ${isEditMode ? 'updated' : 'added'} successfully.`, 'success');
      onClose();
      refreshData();
    } catch (error) {
      showNotification(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} job group.`, 'error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        {isEditMode ? 'Edit Job Group' : 'Add New Job Group'}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField autoFocus margin="dense" name="groupName" label="Group Name" type="text" fullWidth value={formData?.groupName || ''} onChange={handleFormChange} required /></Grid>
            <Grid item xs={12}><TextField margin="dense" name="salaryScale" label="Salary Scale" type="number" fullWidth value={formData?.salaryScale || ''} onChange={handleFormChange} required /></Grid>
            <Grid item xs={12}><TextField margin="dense" name="description" label="Description" type="text" fullWidth multiline rows={2} value={formData?.description || ''} onChange={handleFormChange} /></Grid>
          </Grid>
          <DialogActions>
            <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained" color="success">
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
