import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Construction,
  HourglassEmpty,
  ShoppingCart,
  Warning,
  Assessment,
  Dashboard,
  Business,
  LocationOn,
  PhotoLibrary,
  Feedback,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProjectsModal from '../components/ProjectsModal';
import { getOverviewStats } from '../services/publicApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ filterType: '', filterValue: '', title: '' });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getOverviewStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Container>
    );
  }

  const handleCardClick = (status, title) => {
    setModalConfig({
      filterType: status === 'all' ? '' : 'status',
      filterValue: status === 'all' ? '' : status,
      title: title
    });
    setModalOpen(true);
  };

  const statsCards = [
    {
      title: 'All Projects',
      count: stats?.total_projects || 0,
      budget: stats?.total_budget || 0,
      color: '#1976d2',
      icon: Assessment,
      onClick: () => handleCardClick('all', 'All Projects')
    },
    {
      title: 'Completed Projects',
      count: stats?.completed_projects || 0,
      budget: stats?.completed_budget || 0,
      color: '#4caf50',
      icon: CheckCircle,
      onClick: () => handleCardClick('Completed', 'Completed Projects')
    },
    {
      title: 'Ongoing Projects',
      count: stats?.ongoing_projects || 0,
      budget: stats?.ongoing_budget || 0,
      color: '#2196f3',
      icon: Construction,
      onClick: () => handleCardClick('Ongoing', 'Ongoing Projects')
    },
    {
      title: 'Not Started Projects',
      count: stats?.not_started_projects || 0,
      budget: stats?.not_started_budget || 0,
      color: '#ff9800',
      icon: HourglassEmpty,
      onClick: () => handleCardClick('Not Started', 'Not Started Projects')
    },
    {
      title: 'Under Procurement Projects',
      count: stats?.under_procurement_projects || 0,
      budget: stats?.under_procurement_budget || 0,
      color: '#9c27b0',
      icon: ShoppingCart,
      onClick: () => handleCardClick('Under Procurement', 'Under Procurement Projects')
    },
    {
      title: 'Stalled Projects',
      count: stats?.stalled_projects || 0,
      budget: stats?.stalled_budget || 0,
      color: '#f44336',
      icon: Warning,
      onClick: () => handleCardClick('Stalled', 'Stalled Projects')
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" fontWeight="bold" gutterBottom align="center">
            County Projects Monitoring & Tracking System
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            A Unified Platform For Transparency And Accountability
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              View Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/projects')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Browse Projects
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Quick Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ mb: 4 }}>
          Quick Stats
        </Typography>
        
        <Grid container spacing={3}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Detailed Dashboard Promo */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Paper
          elevation={4}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 4,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'none\'/%3E%3Cpath d=\'M20 50a30 30 0 1 0 60 0 30 30 0 1 0-60 0\' fill=\'%23fff\' opacity=\'0.05\'/%3E%3C/svg%3E")',
              opacity: 0.1
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Dashboard sx={{ fontSize: 48 }} />
              <Typography variant="h4" fontWeight="bold">
                Explore Detailed Analytics
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.95 }}>
              View comprehensive department and regional breakdowns of all county projects
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Business />
                  <Typography variant="body1">Department Summaries</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocationOn />
                  <Typography variant="body1">Sub-County Distribution</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assessment />
                  <Typography variant="body1">Interactive Tables</Typography>
                </Box>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/dashboard')}
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transform: 'translateX(4px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              View Full Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ mb: 4 }}>
            Platform Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Assessment sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Transparency
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track all county projects in real-time with complete transparency and open access to project information.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Accountability
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor project progress, budgets, and completion status to ensure accountability at every level.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Construction sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Efficiency
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Streamlined project management and tracking system for improved efficiency and better outcomes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Links Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" sx={{ mb: 4 }}>
          Quick Access
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  backgroundColor: '#f8f9fa'
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Dashboard sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department & regional analytics
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  backgroundColor: '#f8f9fa'
                }
              }}
              onClick={() => navigate('/projects')}
            >
              <PhotoLibrary sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Projects Gallery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse all projects with photos
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  backgroundColor: '#f8f9fa'
                }
              }}
              onClick={() => navigate('/public-feedback')}
            >
              <Feedback sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                View Feedback
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read citizen feedback & responses
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                  backgroundColor: '#f8f9fa'
                }
              }}
              onClick={() => navigate('/feedback')}
            >
              <Warning sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Submit Feedback
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share your thoughts on projects
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Have Feedback or Questions?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We value your input. Share your feedback or ask questions about any project.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/feedback')}
        >
          Submit Feedback
        </Button>
      </Container>

      {/* Projects Modal */}
      <ProjectsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filterType={modalConfig.filterType}
        filterValue={modalConfig.filterValue}
        title={modalConfig.title}
      />
    </Box>
  );
};

export default HomePage;

