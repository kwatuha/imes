import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Chip,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Close,
  LocationOn,
  AccountBalanceWallet,
  CalendarToday,
  Business,
  Assessment,
  Comment
} from '@mui/icons-material';
import { getProjectDetails } from '../services/publicApi';
import { formatCurrency, formatDate, getStatusColor, formatStatus } from '../utils/formatters';
import ProjectFeedbackModal from './ProjectFeedbackModal';

const ProjectDetailsModal = ({ open, onClose, projectId, project }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (project) {
        // Use provided project data if available (no need to fetch)
        setProjectDetails(project);
        setLoading(false);
        setError(null);
      } else if (projectId) {
        // Only fetch if projectId is provided and no project data is available
        fetchProjectDetails();
      } else {
        setError('No project data or project ID provided');
        setLoading(false);
      }
    } else {
      // Reset state when modal closes
      setProjectDetails(null);
      setError(null);
      setLoading(false);
    }
  }, [open, projectId, project]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectDetails(projectId);
      // API returns project data directly, not wrapped in { project: ... }
      setProjectDetails(data);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFeedback = () => {
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackModalOpen(false);
  };

  if (!open) return null;

  const projectData = projectDetails || project;
  const thumbnail = projectData?.thumbnail || projectData?.photo;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
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
              <Assessment sx={{ fontSize: '2rem' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Project Details
              </Typography>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 3 }}>
              {error}
            </Alert>
          ) : projectData ? (
            <Box>
              {/* Project Photo */}
              {thumbnail && (
                <Box
                  sx={{
                    width: '100%',
                    height: '400px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={`http://165.22.227.234:3000/uploads/${thumbnail}`}
                    alt={projectData.project_name || projectData.projectName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}

              <Box sx={{ p: 3 }}>
                {/* Status Chip */}
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={formatStatus(projectData.status)}
                    size="medium"
                    sx={{
                      backgroundColor: getStatusColor(projectData.status),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      height: '32px'
                    }}
                  />
                </Box>

                {/* Project Name */}
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  {projectData.project_name || projectData.projectName}
                </Typography>

                {/* Description */}
                {projectData.description && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {projectData.description}
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Project Information Grid */}
                <Grid container spacing={3}>
                  {/* Location */}
                  {(projectData.ward_name || projectData.subcounty_name || projectData.department_name) && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <LocationOn sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Location
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {projectData.ward_name || projectData.subcounty_name || projectData.department_name || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {/* Budget */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <AccountBalanceWallet sx={{ fontSize: 24, color: 'success.main', mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Budget
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          {formatCurrency(projectData.budget || projectData.costOfProject)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Dates */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <CalendarToday sx={{ fontSize: 24, color: 'text.secondary', mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Timeline
                        </Typography>
                        <Typography variant="body2">
                          <strong>Start:</strong> {formatDate(projectData.start_date || projectData.startDate)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>End:</strong> {formatDate(projectData.end_date || projectData.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Department */}
                  {projectData.department_name && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Business sx={{ fontSize: 24, color: 'text.secondary', mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Department
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {projectData.department_name}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {/* Financial Year */}
                  {projectData.financialYear && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <CalendarToday sx={{ fontSize: 24, color: 'text.secondary', mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Financial Year
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {projectData.financialYear}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}

                  {/* Progress */}
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Project Progress
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {projectData.completionPercentage || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={parseFloat(projectData.completionPercentage) || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(projectData.status),
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No project data available
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Comment />}
            onClick={handleOpenFeedback}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Add Comment
          </Button>
          <Button 
            onClick={onClose}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Feedback Modal */}
      <ProjectFeedbackModal
        open={feedbackModalOpen}
        onClose={handleCloseFeedback}
        project={projectData ? {
          ...projectData,
          projectName: projectData.project_name || projectData.projectName,
          project_name: projectData.project_name || projectData.projectName,
          startDate: projectData.start_date || projectData.startDate,
          endDate: projectData.end_date || projectData.endDate,
          department: projectData.department_name || projectData.department,
          statusColor: getStatusColor(projectData.status)
        } : null}
      />
    </>
  );
};

export default ProjectDetailsModal;

