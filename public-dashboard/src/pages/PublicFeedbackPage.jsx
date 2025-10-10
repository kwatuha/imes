import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
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
  Pagination
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
  FilterList
} from '@mui/icons-material';
import { formatDate } from '../utils/formatters';
import { getFeedbackList } from '../services/publicApi';

const PublicFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, statusFilter, searchTerm]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const filters = { page, limit: 10 };
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await getFeedbackList(filters);
      setFeedbacks(data.feedbacks || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      // For demo, use mock data
      setFeedbacks(generateMockFeedback());
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const generateMockFeedback = () => {
    // Mock feedback data for demonstration
    return [
      {
        id: 1,
        name: 'John Kamau',
        project_name: 'Kwa Vonza Earth Dam Construction',
        subject: 'Excellent Progress',
        message: 'The project is progressing well. The community is very happy with the water access improvements.',
        status: 'responded',
        created_at: '2025-10-08T10:30:00',
        admin_response: 'Thank you for your positive feedback! We are committed to ensuring quality water access for all communities.',
        responded_at: '2025-10-09T14:20:00'
      },
      {
        id: 2,
        name: 'Mary Wambui',
        project_name: 'Tractor Hire Subsidy Rollout (Phase II)',
        subject: 'Request for Extension',
        message: 'Can this program be extended to our ward as well? Many farmers would benefit from affordable tractor services.',
        status: 'reviewed',
        created_at: '2025-10-07T15:45:00',
        admin_response: null,
        responded_at: null
      },
      {
        id: 3,
        name: 'Peter Mwangi',
        project_name: 'Community Health Volunteer Kits Procurement',
        subject: 'Kit Quality Issue',
        message: 'Some of the items in the health kits are missing. Can this be looked into?',
        status: 'pending',
        created_at: '2025-10-10T09:15:00',
        admin_response: null,
        responded_at: null
      }
    ];
  };

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpandedId(isExpanded ? id : null);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Project-Based Feedback Forum
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We welcome your feedback on any of the projects. Your input is valuable in enhancing our services 
          and improving overall service delivery to the citizens.
        </Typography>
      </Box>

      {/* Info Banner */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          💡 Transparency & Accountability
        </Typography>
        <Typography variant="body2">
          All feedback is reviewed by county officials. Responses are provided to ensure accountability 
          and continuous improvement in project delivery.
        </Typography>
      </Alert>

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
              placeholder="Search by project name, feedback, or name..."
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
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

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

      {/* Feedback List */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Recent Feedback ({feedbacks.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on any feedback to view full details and official responses
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
                        {feedback.email && (
                          <Typography variant="caption" color="text.secondary">
                            • {feedback.email}
                          </Typography>
                        )}
                      </Box>
                      
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
                    <Box>
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

                  {/* Pending/Reviewed Status Messages */}
                  {feedback.status === 'pending' && (
                    <Alert severity="info" sx={{ borderRadius: '8px' }}>
                      This feedback is pending review by county officials. You will be notified once a response is provided.
                    </Alert>
                  )}

                  {feedback.status === 'reviewed' && (
                    <Alert severity="warning" sx={{ borderRadius: '8px' }}>
                      This feedback is currently under review. A response will be provided shortly.
                    </Alert>
                  )}
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
            No feedback yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share your thoughts on county projects!
          </Typography>
        </Paper>
      )}

      {/* Call to Action */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Have feedback on a project?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Visit our Projects Gallery to browse projects and share your feedback
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/projects"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            px: 4
          }}
        >
          Browse Projects
        </Button>
      </Box>
    </Container>
  );
};

export default PublicFeedbackPage;

