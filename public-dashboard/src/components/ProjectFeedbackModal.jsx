import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import {
  Close,
  Send,
  Comment,
  LocationOn,
  Business
} from '@mui/icons-material';
import { submitFeedback } from '../services/publicApi';
import { formatCurrency, formatDate } from '../utils/formatters';

const ProjectFeedbackModal = ({ open, onClose, project }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit button clicked');
    console.log('Form data:', formData);
    console.log('Project ID:', project.id);
    
    // Validation
    if (!formData.name || !formData.message) {
      console.log('Validation failed:', { name: formData.name, message: formData.message });
      setError('Name and message are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const feedbackData = {
        ...formData,
        projectId: project.id,
        subject: formData.subject || `Feedback on: ${project.projectName}`
      };
      
      console.log('Submitting feedback:', feedbackData);
      
      // Submit feedback with project ID
      const result = await submitFeedback(feedbackData);
      
      console.log('Feedback submission result:', result);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(`Failed to submit feedback: ${err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  console.log('ProjectFeedbackModal - open:', open, 'project:', project);

  if (!project) {
    console.log('ProjectFeedbackModal - No project provided, returning null');
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Comment sx={{ fontSize: '2rem' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Submit Feedback
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Share your thoughts about this project
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleClose}
            disabled={loading}
            sx={{ 
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Project Information */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            PROJECT DETAILS
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {project.projectName}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {project.department || 'N/A'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Budget: <strong>{formatCurrency(project.budget)}</strong>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Chip 
                label={project.status}
                size="small"
                sx={{
                  backgroundColor: project.statusColor || '#757575',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Chip 
                label={`${project.completionPercentage || 0}% Complete`}
                size="small"
                sx={{ ml: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your feedback! Your input has been submitted successfully.
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="Enter your full name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="your.email@example.com"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="+254 700 000 000"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject (Optional)"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading || success}
                placeholder={`Feedback about ${project.projectName}`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={5}
                label="Your Feedback"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={loading || success}
                placeholder="Please share your feedback, suggestions, or concerns about this project..."
                helperText="Your feedback helps us improve project delivery and transparency"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || success}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
          }}
        >
          {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectFeedbackModal;

