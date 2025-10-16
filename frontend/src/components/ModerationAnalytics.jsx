import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  CheckCircle,
  Cancel,
  Flag,
  Person,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  AccessTime,
  Warning
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const ModerationAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/moderate/analytics');
      setAnalytics(response.data.analytics);
    } catch (err) {
      console.error('Error fetching moderation analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (hours) => {
    if (hours < 1) return '< 1 hour';
    if (hours < 24) return `${Math.round(hours)} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  const getReasonLabel = (reason) => {
    const reasonLabels = {
      'inappropriate_content': 'Inappropriate Content',
      'spam': 'Spam',
      'off_topic': 'Off Topic',
      'personal_attack': 'Personal Attack',
      'false_information': 'False Information',
      'duplicate': 'Duplicate',
      'incomplete': 'Incomplete',
      'language_violation': 'Language Violation',
      'other': 'Other'
    };
    return reasonLabels[reason] || reason;
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'success',
      'rejected': 'error',
      'flagged': 'warning',
      'pending': 'info'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No analytics data available
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Moderation Analytics
      </Typography>

      {/* Response Time Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTime color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Average Response Time</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {formatTime(analytics.responseTimeStats?.avg_response_hours || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.responseTimeStats?.total_moderated || 0} items moderated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Timeline color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Fastest Response</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {formatTime(analytics.responseTimeStats?.min_response_hours || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Slowest Response</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {formatTime(analytics.responseTimeStats?.max_response_hours || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Needs improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Moderation Reasons Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <Flag sx={{ mr: 1, verticalAlign: 'middle' }} />
            Moderation Reasons Breakdown
          </Typography>
          {analytics.reasonBreakdown && analytics.reasonBreakdown.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reason</TableCell>
                    <TableCell align="center">Count</TableCell>
                    <TableCell align="center">Percentage</TableCell>
                    <TableCell align="center">Visual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.reasonBreakdown.map((reason, index) => (
                    <TableRow key={reason.moderation_reason}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {getReasonLabel(reason.moderation_reason)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={reason.count} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {reason.percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ width: '100%', maxWidth: 200 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={reason.percentage} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No moderation reasons data available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Moderator Activity */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
            Moderator Activity
          </Typography>
          {analytics.moderatorActivity && analytics.moderatorActivity.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Moderator</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Approved</TableCell>
                    <TableCell align="center">Rejected</TableCell>
                    <TableCell align="center">Flagged</TableCell>
                    <TableCell align="center">Avg Response Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.moderatorActivity.map((moderator, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {moderator.moderator_name?.charAt(0) || 'M'}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">
                            {moderator.moderator_name || 'Unknown'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={moderator.total_moderated} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={moderator.approved_count} color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={moderator.rejected_count} color="error" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={moderator.flagged_count} color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {Math.round(moderator.avg_response_time_minutes)} min
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No moderator activity data available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Ratings Analysis */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
            Ratings Analysis by Moderation Status
          </Typography>
          {analytics.ratingsByStatus && analytics.ratingsByStatus.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Count</TableCell>
                    <TableCell align="center">Overall Support</TableCell>
                    <TableCell align="center">Quality Impact</TableCell>
                    <TableCell align="center">Community Alignment</TableCell>
                    <TableCell align="center">Transparency</TableCell>
                    <TableCell align="center">Feasibility</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.ratingsByStatus.map((rating, index) => (
                    <TableRow key={rating.moderation_status}>
                      <TableCell>
                        <Chip 
                          label={rating.moderation_status} 
                          color={getStatusColor(rating.moderation_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {rating.count}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {rating.avg_overall_support || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {rating.avg_quality_impact || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {rating.avg_community_alignment || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {rating.avg_transparency || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {rating.avg_feasibility_confidence || 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No ratings data available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Recent Moderation Trends */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Moderation Trends (Last 30 Days)
          </Typography>
          {analytics.moderationTrends && analytics.moderationTrends.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Approved</TableCell>
                    <TableCell align="center">Rejected</TableCell>
                    <TableCell align="center">Flagged</TableCell>
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.moderationTrends.slice(0, 10).map((trend, index) => (
                    <TableRow key={trend.date}>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(trend.date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={trend.approved} color="success" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={trend.rejected} color="error" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={trend.flagged} color="warning" size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="bold">
                          {trend.total_moderated}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No moderation trends data available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ModerationAnalytics;
