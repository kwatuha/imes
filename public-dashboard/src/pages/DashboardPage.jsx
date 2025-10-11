import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Assessment,
  Business,
  LocationOn,
  LocationCity,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DepartmentSummaryTable from '../components/DepartmentSummaryTable';
import SubCountySummaryTable from '../components/SubCountySummaryTable';
import WardSummaryTable from '../components/WardSummaryTable';
import { getOverviewStats, getFinancialYears } from '../services/publicApi';
import { formatCurrency } from '../utils/formatters';

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const finYearFromUrl = searchParams.get('fy');
  
  const [stats, setStats] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    if (selectedFinYear) {
      fetchStats();
    }
  }, [selectedFinYear]);

  const fetchFinancialYears = async () => {
    try {
      const data = await getFinancialYears();
      setFinancialYears(data || []);
      
      // Set initial financial year
      if (finYearFromUrl) {
        const fyFromUrl = data.find(fy => fy.id === parseInt(finYearFromUrl));
        setSelectedFinYear(fyFromUrl || data[0]);
      } else {
        setSelectedFinYear(data[0]); // Most recent year
      }
    } catch (err) {
      console.error('Error fetching financial years:', err);
      setError('Failed to load financial years');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getOverviewStats(selectedFinYear?.id);
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleFinYearChange = (event, newValue) => {
    setSelectedFinYear(financialYears[newValue]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !stats) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const statsCards = [
    {
      title: 'All Projects',
      count: stats?.total_projects || 0,
      budget: stats?.total_budget || 0,
      color: '#1976d2',
      icon: Assessment
    },
    {
      title: 'Completed Projects',
      count: stats?.completed_projects || 0,
      budget: stats?.completed_budget || 0,
      color: '#4caf50',
      icon: Assessment
    },
    {
      title: 'Ongoing Projects',
      count: stats?.ongoing_projects || 0,
      budget: stats?.ongoing_budget || 0,
      color: '#2196f3',
      icon: Assessment
    },
    {
      title: 'Under Procurement',
      count: stats?.under_procurement_projects || 0,
      budget: stats?.under_procurement_budget || 0,
      color: '#9c27b0',
      icon: Assessment
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Public Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Transparency in project monitoring and implementation
        </Typography>
      </Box>

      {/* Financial Year Selector */}
      {financialYears.length > 0 && (
        <Paper sx={{ mb: 4, borderRadius: 2 }} elevation={2}>
          <Tabs
            value={financialYears.findIndex(fy => fy.id === selectedFinYear?.id)}
            onChange={handleFinYearChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            {financialYears.map((fy) => (
              <Tab
                key={fy.id}
                label={`FY ${fy.name}`}
                icon={<Assessment />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Selected Financial Year Title */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          {selectedFinYear?.name} FY Public Dashboard
        </Typography>
      </Box>

      {/* Quick Stats Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Quick Stats
        </Typography>
        <Grid container spacing={3}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Detailed Breakdown Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2 }} elevation={2}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600
            }
          }}
        >
          <Tab icon={<Business />} label="By Department" iconPosition="start" />
          <Tab icon={<LocationOn />} label="By Sub-County" iconPosition="start" />
          <Tab icon={<LocationCity />} label="By Ward" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {activeTab === 0 && (
            <DepartmentSummaryTable finYearId={selectedFinYear?.id} />
          )}
          {activeTab === 1 && (
            <SubCountySummaryTable finYearId={selectedFinYear?.id} />
          )}
          {activeTab === 2 && (
            <WardSummaryTable finYearId={selectedFinYear?.id} />
          )}
        </Box>
      </Paper>

      {/* Footer Note */}
      <Paper
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="body2" textAlign="center">
          For detailed project information and photos, visit the{' '}
          <strong>Projects Gallery</strong>
        </Typography>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
