import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  LinearProgress,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextareaAutosize
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
  Visibility,
  Assessment,
  Forum,
  Star,
  Gavel,
  Flag,
  Block,
  CheckCircleOutline,
  Cancel,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import ModerationAnalytics from '../components/ModerationAnalytics';
import axiosInstance from '../api/axiosInstance';

const FeedbackModerationPage = () => {
  const { user } = useAuth();
  console.log('FeedbackModerationPage component rendered');
  const [activeTab, setActiveTab] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [moderationFilter, setModerationFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [moderationModalOpen, setModerationModalOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState('');
  const [moderationReason, setModerationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFeedbacks, setModalFeedbacks] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      console.log('Fetching moderation queue...');
      const params = new URLSearchParams({
        page,
        limit: 10,
      });
      
      if (moderationFilter && moderationFilter !== 'all') {
        params.append('moderation_status', moderationFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      console.log('API URL:', `/moderate/queue?${params.toString()}`);
      const response = await axiosInstance.get(
        `/moderate/queue?${params.toString()}`
      );

      console.log('Moderation API response:', response.data);
      setFeedbacks(response.data.items || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching moderation feedback:', err);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axiosInstance.get('/moderate/statistics');
      setStatistics(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStatistics();
  }, [page, moderationFilter, searchTerm]);

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpandedId(isExpanded ? id : null);
  };

  const handleStatCardClick = async (moderationStatus, title) => {
    try {
      setLoading(true);
      
      // Fetch all feedback for the specific moderation status
      const params = new URLSearchParams({
        page: 1,
        limit: 100, // Get more items for the modal
        moderation_status: moderationStatus
      });

      const response = await axiosInstance.get(
        `/moderate/queue?${params.toString()}`
      );

      setModalFeedbacks(response.data.items || []);
      setModalTitle(title);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching feedback for modal:', err);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalFeedbacks([]);
    setModalTitle('');
  };

  const handleOpenModerationModal = (feedback, action) => {
    setSelectedFeedback(feedback);
    setModerationAction(action);
    setModerationReason('');
    setCustomReason('');
    setModeratorNotes('');
    setModerationModalOpen(true);
  };

  const handleCloseModerationModal = () => {
    setModerationModalOpen(false);
    setSelectedFeedback(null);
    setModerationAction('');
    setModerationReason('');
    setCustomReason('');
    setModeratorNotes('');
  };

  const handleModerationSubmit = async () => {
    if (!selectedFeedback) return;

    try {
      setSubmitting(true);
      
      let endpoint = '';
      let payload = {
        moderator_notes: moderatorNotes
      };

      switch (moderationAction) {
        case 'approve':
          endpoint = `/moderate/${selectedFeedback.id}/approve`;
          break;
        case 'reject':
          if (!moderationReason) {
            setError('Please select a reason for rejection');
            return;
          }
          endpoint = `/moderate/${selectedFeedback.id}/reject`;
          payload = {
            moderation_reason: moderationReason,
            custom_reason: customReason,
            moderator_notes: moderatorNotes
          };
          break;
        case 'flag':
          endpoint = `/moderate/${selectedFeedback.id}/flag`;
          payload = {
            moderation_reason: moderationReason,
            custom_reason: customReason,
            moderator_notes: moderatorNotes
          };
          break;
        default:
          throw new Error('Invalid moderation action');
      }

      await axiosInstance.post(endpoint, payload);
      
      setSuccessMessage(`Feedback ${moderationAction}d successfully`);
      handleCloseModerationModal();
      fetchFeedbacks();
      fetchStatistics();
    } catch (err) {
      console.error('Error moderating feedback:', err);
      setError(`Failed to ${moderationAction} feedback. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const getModerationStatusColor = (status) => {
    const statusMap = {
      'pending': { color: 'warning', icon: <Schedule />, label: 'Pending Review' },
      'approved': { color: 'success', icon: <CheckCircle />, label: 'Approved' },
      'rejected': { color: 'error', icon: <Cancel />, label: 'Rejected' },
      'flagged': { color: 'warning', icon: <Flag />, label: 'Flagged' }
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

  const moderationReasons = [
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'spam', label: 'Spam' },
    { value: 'off_topic', label: 'Off Topic' },
    { value: 'personal_attack', label: 'Personal Attack' },
    { value: 'false_information', label: 'False Information' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'incomplete', label: 'Incomplete' },
    { value: 'language_violation', label: 'Language Violation' },
    { value: 'other', label: 'Other' }
  ];

  if (loading && feedbacks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  console.log('FeedbackModerationPage render - feedbacks:', feedbacks.length, 'loading:', loading);
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        backgroundColor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Gavel sx={{ fontSize: '2rem', color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Feedback Moderation
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
          Review and moderate citizen feedback before public display
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 3,
        backgroundColor: '#f8f9fa',
        borderRadius: 2,
        px: 2,
        py: 1
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minHeight: 48,
              px: 3,
              py: 1.5,
              borderRadius: 1,
              margin: '0 4px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-1px)'
              }
            },
            '& .Mui-selected': {
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              color: 'primary.main',
              fontWeight: 700
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '2px 2px 0 0',
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule sx={{ fontSize: '1.2rem' }} />
                Moderation Queue
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment sx={{ fontSize: '1.2rem' }} />
                Analytics
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleStatCardClick('pending', 'Pending Review')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {statistics.statistics.pending_count}
                </Typography>
                <Typography variant="body2">
                  Pending Review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleStatCardClick('approved', 'Approved')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {statistics.statistics.approved_count}
                </Typography>
                <Typography variant="body2">
                  Approved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleStatCardClick('rejected', 'Rejected')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Cancel sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {statistics.statistics.rejected_count}
                </Typography>
                <Typography variant="body2">
                  Rejected
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', 
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => handleStatCardClick('flagged', 'Flagged')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Flag sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {statistics.statistics.flagged_count}
                </Typography>
                <Typography variant="body2">
                  Flagged
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search feedback..."
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Moderation Status</InputLabel>
              <Select
                value={moderationFilter}
                onChange={(e) => setModerationFilter(e.target.value)}
                label="Moderation Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="flagged">Flagged</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Feedback List */}
      <Box>
        {feedbacks.map((feedback) => {
          const statusInfo = getModerationStatusColor(feedback.moderation_status);
          return (
            <Accordion
              key={feedback.id}
              expanded={expandedId === feedback.id}
              onChange={handleAccordionChange(feedback.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div">
                        {feedback.name || 'Anonymous'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feedback.subject || 'No Subject'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={statusInfo.icon}
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(feedback.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {feedback.message}
                  </Typography>
                  
                  {feedback.project_name && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Related Project: {feedback.project_name}
                      </Typography>
                    </Box>
                  )}

                  {feedback.moderation_reason && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Moderation Reason: {moderationReasons.find(r => r.value === feedback.moderation_reason)?.label}
                      </Typography>
                      {feedback.custom_reason && (
                        <Typography variant="body2" color="text.secondary">
                          Custom Reason: {feedback.custom_reason}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {feedback.moderator_notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Moderator Notes: {feedback.moderator_notes}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {feedback.moderation_status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleOutline />}
                        onClick={() => handleOpenModerationModal(feedback, 'approve')}
                        size="small"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Block />}
                        onClick={() => handleOpenModerationModal(feedback, 'reject')}
                        size="small"
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Flag />}
                        onClick={() => handleOpenModerationModal(feedback, 'flag')}
                        size="small"
                      >
                        Flag
                      </Button>
                    </>
                  )}
                  
                  {feedback.moderation_status !== 'pending' && (
                    <Button
                      variant="outlined"
                      startIcon={<Gavel />}
                      onClick={() => handleOpenModerationModal(feedback, 'review')}
                      size="small"
                    >
                      Review Decision
                    </Button>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Moderation Modal */}
      <Dialog
        open={moderationModalOpen}
        onClose={handleCloseModerationModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {moderationAction === 'approve' && 'Approve Feedback'}
          {moderationAction === 'reject' && 'Reject Feedback'}
          {moderationAction === 'flag' && 'Flag Feedback'}
          {moderationAction === 'review' && 'Review Moderation Decision'}
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Feedback from: {selectedFeedback.name || 'Anonymous'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Subject: {selectedFeedback.subject || 'No Subject'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedFeedback.message}
              </Typography>
            </Box>
          )}

          {(moderationAction === 'reject' || moderationAction === 'flag') && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                label="Reason"
              >
                {moderationReasons.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {moderationReason === 'other' && (
            <TextField
              fullWidth
              label="Custom Reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Moderator Notes"
            multiline
            rows={4}
            value={moderatorNotes}
            onChange={(e) => setModeratorNotes(e.target.value)}
            placeholder="Add any additional notes about this moderation decision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModerationModal}>Cancel</Button>
          <Button
            onClick={handleModerationSubmit}
            variant="contained"
            disabled={submitting}
            color={
              moderationAction === 'approve' ? 'success' :
              moderationAction === 'reject' ? 'error' :
              moderationAction === 'flag' ? 'warning' : 'primary'
            }
          >
            {submitting ? <CircularProgress size={20} /> : 
             moderationAction === 'approve' ? 'Approve' :
             moderationAction === 'reject' ? 'Reject' :
             moderationAction === 'flag' ? 'Flag' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {modalTitle}
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {modalFeedbacks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No feedback found in this category.
              </Typography>
            </Box>
          ) : (
            <List>
              {modalFeedbacks.map((feedback) => (
                <ListItem key={feedback.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }}>
                        <Person />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {feedback.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feedback.subject || 'No Subject'}
                        </Typography>
                      </Box>
                      <Chip
                        label={getModerationStatusColor(feedback.moderation_status).label}
                        color={getModerationStatusColor(feedback.moderation_status).color}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {feedback.message}
                    </Typography>
                    
                    {feedback.project_name && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Related Project: {feedback.project_name}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Submitted: {formatDate(feedback.created_at)}
                    </Typography>
                    
                    {feedback.moderation_reason && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Moderation Reason: {moderationReasons.find(r => r.value === feedback.moderation_reason)?.label}
                        </Typography>
                        {feedback.custom_reason && (
                          <Typography variant="body2">
                            Custom Reason: {feedback.custom_reason}
                          </Typography>
                        )}
                        {feedback.moderator_notes && (
                          <Typography variant="body2">
                            Moderator Notes: {feedback.moderator_notes}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ width: '100%', mt: 1 }} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 1 && (
        <ModerationAnalytics />
      )}
    </Container>
  );
};

export default FeedbackModerationPage;
