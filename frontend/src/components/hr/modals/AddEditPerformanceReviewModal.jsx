import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField, FormControl, InputLabel, Select, MenuItem, Rating
} from '@mui/material';
import apiService from '../../../api';

export default function AddEditPerformanceReviewModal({
  isOpen,
  onClose,
  editedItem,
  employees,
  currentEmployeeInView,
  showNotification,
  refreshData
}) {
  const [formData, setFormData] = useState({});
  const isEditMode = !!editedItem;

  useEffect(() => {
    if (isEditMode && editedItem) {
      setFormData(editedItem);
    } else {
      setFormData({
        staffId: currentEmployeeInView ? currentEmployeeInView.staffId : '',
        reviewDate: new Date().toISOString().slice(0, 10),
        reviewScore: 3,
        comments: '',
        reviewerId: ''
      });
    }
  }, [isOpen, isEditMode, editedItem, currentEmployeeInView]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, reviewScore: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.staffId || !formData.reviewerId) {
        showNotification('Employee and Reviewer are required.', 'error');
        return;
    }

    const action = isEditMode ? 'updatePerformanceReview' : 'addPerformanceReview';
    const apiFunction = apiService.hr[action];

    if (!apiFunction) {
        showNotification(`API function for ${action} not found.`, 'error');
        return;
    }

    try {
      const payload = { ...formData };
      if (isEditMode) {
        await apiFunction(editedItem.id, payload);
      } else {
        await apiFunction(payload);
      }
      showNotification(`Performance review ${isEditMode ? 'updated' : 'added'} successfully.`, 'success');
      
      refreshData();
      onClose();
    } catch (error) {
      showNotification(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} review.`, 'error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Edit Performance Review' : 'Add Performance Review'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} id="performance-form">
          <Grid container spacing={2} sx={{ pt: 1 }}>

            {!currentEmployeeInView && (
              <Grid xs={12}>
                {/* FIX: Added minWidth to ensure label is visible */}
                <FormControl fullWidth required sx={{ minWidth: 200 }}>
                  <InputLabel>Select Employee</InputLabel>
                  <Select
                    name="staffId"
                    value={formData?.staffId || ''}
                    onChange={handleFormChange}
                    label="Select Employee"
                  >
                    {Array.isArray(employees) && employees.map((emp) => (
                      <MenuItem key={emp.staffId} value={String(emp.staffId)}>{emp.firstName} {emp.lastName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid xs={12} sm={6}>
              <TextField fullWidth name="reviewDate" label="Review Date" type="date" value={formData?.reviewDate?.slice(0, 10) || ''} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required />
            </Grid>

            <Grid xs={12} sm={6}>
              {/* FIX: Added minWidth to ensure label is visible */}
              <FormControl fullWidth required sx={{ minWidth: 200 }}>
                  <InputLabel>Reviewer</InputLabel>
                  <Select
                    name="reviewerId"
                    value={formData?.reviewerId || ''}
                    onChange={handleFormChange}
                    label="Reviewer"
                  >
                    {Array.isArray(employees) && employees.map((emp) => (
                      <MenuItem key={emp.staffId} value={String(emp.staffId)}>{emp.firstName} {emp.lastName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Grid>
            
            <Grid xs={12}>
                <InputLabel sx={{ mb: 1 }}>Performance Rating</InputLabel>
                <Rating 
                    name="reviewScore" 
                    value={Number(formData?.reviewScore) || 0} 
                    onChange={handleRatingChange} 
                    size="large"
                />
            </Grid>

            <Grid xs={12}>
              <TextField fullWidth multiline rows={4} name="comments" label="Comments" value={formData?.comments || ''} onChange={handleFormChange} />
            </Grid>

          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="performance-form" variant="contained">
          {isEditMode ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}