import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Search,
  ExpandMore,
  Comment,
  CheckCircle,
  Schedule,
  Reply,
  Person,
  Business,
  CalendarToday,
  FilterList,
  Email,
  Phone,
  Close,
  Send,
  Visibility
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const FeedbackManagementPage = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
      });
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/public/feedback?${params.toString()}`
      );

      setFeedbacks(response.data.feedbacks || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpandedId(isExpanded ? id : null);
  };

  const handleOpenResponseModal = (feedback) => {
    setSelectedFeedback(feedback);
    setResponse(feedback.admin_response || '');
    setResponseModalOpen(true);
  };

  const handleCloseResponseModal = () => {
    setResponseModalOpen(false);
    setSelectedFeedback(null);
    setResponse('');
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(
        `${API_BASE_URL}/api/public/feedback/${selectedFeedback.id}/respond`,
        {
          admin_response: response,
          responded_by: user?.id || user?.userId,
        }
      );

      setSuccessMessage('Response submitted successfully!');
      handleCloseResponseModal();
      fetchFeedbacks();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting response:', err);
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (feedbackId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/public/feedback/${feedbackId}/status`,
        {
          status: newStatus
        }
      );

      setSuccessMessage(`Status updated to ${newStatus}`);
      fetchFeedbacks();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Pending Review', color: '#ff9800', icon: <Schedule /> },
      'reviewed': { label: 'Under Review', color: '#2196f3', icon: <Schedule /> },
      'responded': { label: 'Responded', color: '#4caf50', icon: <CheckCircle /> },
      'archived': { label: 'Archived', color: '#757575', icon: <CheckCircle /> }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && feedbacks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Public Feedback Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and respond to citizen feedback on projects
        </Typography>
      </Box>

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Comment sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {feedbacks.length}
              </Typography>
              <Typography variant="body2">
                Total Feedback
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {feedbacks.filter(f => f.status === 'pending').length}
              </Typography>
              <Typography variant="body2">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {feedbacks.filter(f => f.status === 'responded').length}
              </Typography>
              <Typography variant="body2">
                Responded
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Reply sx={{ fontSize: '2.5rem', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {feedbacks.filter(f => f.status === 'reviewed').length}
              </Typography>
              <Typography variant="body2">
                Under Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Filter Feedback
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by project name, feedback, or citizen name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Feedback</MenuItem>
                <MenuItem value="pending">Pending Review</MenuItem>
                <MenuItem value="reviewed">Under Review</MenuItem>
                <MenuItem value="responded">Responded</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Feedback List */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Feedback Items ({feedbacks.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any feedback to view details and respond
        </Typography>
      </Box>

      {feedbacks.length > 0 ? (
        <>
          {feedbacks.map((feedback) => {
            const statusInfo = getStatusInfo(feedback.status);
            
            return (
              <Accordion 
                key={feedback.id}
                expanded={expandedId === feedback.id}
                onChange={handleAccordionChange(feedback.id)}
                sx={{ 
                  mb: 2,
                  borderRadius: '12px !important',
                  '&:before': { display: 'none' },
                  boxShadow: expandedId === feedback.id ? 4 : 1,
                  border: expandedId === feedback.id ? `2px solid ${statusInfo.color}` : '1px solid #e0e0e0'
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    '&:hover': { backgroundColor: '#f8f9fa' },
                    borderRadius: '12px'
                  }}
                >
                  <Box sx={{ width: '100%', pr: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Avatar sx={{ bgcolor: statusInfo.color, width: 32, height: 32 }}>
                          {statusInfo.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {feedback.project_name || 'General Feedback'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feedback.subject || 'No subject'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 3, ml: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {feedback.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(feedback.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ pt: 0 }}>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Feedback Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                      CITIZEN FEEDBACK
                    </Typography>
                    
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        backgroundColor: '#f8f9fa',
                        borderLeft: '4px solid #2196f3',
                        borderRadius: '8px'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="bold">
                          {feedback.name}
                        </Typography>
                      </Box>
                      
                      {feedback.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {feedback.email}
                          </Typography>
                        </Box>
                      )}

                      {feedback.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {feedback.phone}
                          </Typography>
                        </Box>
                      )}
                      
                      {feedback.project_name && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Business sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Project: <strong>{feedback.project_name}</strong>
                          </Typography>
                        </Box>
                      )}
                      
                      <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                        {feedback.message}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Submitted on {formatDate(feedback.created_at)}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Official Response */}
                  {feedback.status === 'responded' && feedback.admin_response && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>
                        OFFICIAL RESPONSE
                      </Typography>
                      
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          backgroundColor: '#e8f5e9',
                          borderLeft: '4px solid #4caf50',
                          borderRadius: '8px'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Reply sx={{ fontSize: 18, color: 'success.main' }} />
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            County Response
                          </Typography>
                        </Box>
                        
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {feedback.admin_response}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                          Responded on {formatDate(feedback.responded_at)}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {feedback.status !== 'responded' && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Reply />}
                        onClick={() => handleOpenResponseModal(feedback)}
                      >
                        Respond to Feedback
                      </Button>
                    )}

                    {feedback.status === 'responded' && (
                      <Button
                        variant="outlined"
                        startIcon={<Reply />}
                        onClick={() => handleOpenResponseModal(feedback)}
                      >
                        Update Response
                      </Button>
                    )}

                    {feedback.status === 'pending' && (
                      <Button
                        variant="outlined"
                        color="info"
                        startIcon={<Visibility />}
                        onClick={() => handleUpdateStatus(feedback.id, 'reviewed')}
                      >
                        Mark as Under Review
                      </Button>
                    )}

                    {feedback.status === 'responded' && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleUpdateStatus(feedback.id, 'archived')}
                      >
                        Archive
                      </Button>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper 
          elevation={1} 
          sx={{ 
            p: 8, 
            textAlign: 'center',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Comment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No feedback found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter !== 'all' 
              ? `No feedback with status "${statusFilter}"` 
              : 'No feedback has been submitted yet'}
          </Typography>
        </Paper>
      )}

      {/* Response Modal */}
      <Dialog
        open={responseModalOpen}
        onClose={handleCloseResponseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Respond to Feedback
            </Typography>
            <IconButton onClick={handleCloseResponseModal} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedFeedback && (
            <>
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Original Feedback
                </Typography>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  From: {selectedFeedback.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Project: {selectedFeedback.project_name || 'General Feedback'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {selectedFeedback.message}
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={8}
                label="Your Response"
                placeholder="Enter your official response to this feedback..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                variant="outlined"
                helperText="This response will be visible to the public"
              />
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseResponseModal} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
            onClick={handleSubmitResponse}
            disabled={submitting || !response.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Response'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedbackManagementPage;

