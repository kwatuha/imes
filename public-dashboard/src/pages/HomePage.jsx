import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Construction,
  HourglassEmpty,
  ShoppingCart,
  Warning,
  Assessment
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

      {/* About Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Transparency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all county projects in real-time with complete transparency and open access to project information.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Accountability
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor project progress, budgets, and completion status to ensure accountability at every level.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                <Construction sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Efficiency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Streamlined project management and tracking system for improved efficiency and better outcomes.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

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

