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
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Assessment,
  Business,
  LocationOn,
  LocationCity,
  Dashboard as DashboardIcon,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Schedule,
  Warning,
  Star,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline,
  MoreHoriz
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import StatCard from '../components/StatCard';
import DepartmentSummaryTable from '../components/DepartmentSummaryTable';
import SubCountySummaryTable from '../components/SubCountySummaryTable';
import WardSummaryTable from '../components/WardSummaryTable';
import YearlyTrendsTable from '../components/YearlyTrendsTable';
import FilterBar from '../components/FilterBar';
import ProjectsModal from '../components/ProjectsModal';
import { getOverviewStats, getFinancialYears } from '../services/publicApi';
import { formatCurrency, getStatusColor } from '../utils/formatters';

// Chart colors - using normalized status colors for consistency
const getStatusColorForChart = (statusName) => {
  return getStatusColor(statusName);
};

const DashboardPage = () => {
  const [searchParams] = useSearchParams();
  const finYearFromUrl = searchParams.get('fy');
  
  const [stats, setStats] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    department: '',
    subcounty: '',
    ward: '',
    projectSearch: ''
  });

  // Modal states for clickable stats
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilterType, setModalFilterType] = useState('');
  const [modalFilterValue, setModalFilterValue] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    // Fetch stats when selectedFinYear changes (including when it's null for "All")
    fetchStats();
  }, [selectedFinYear, filters]);

  const fetchFinancialYears = async () => {
    try {
      const data = await getFinancialYears();
      // Backend already filters to only return years with projects
      setFinancialYears(data || []);
      
      // Set initial financial year
      if (finYearFromUrl) {
        const fyFromUrl = data.find(fy => fy.id === parseInt(finYearFromUrl));
        setSelectedFinYear(fyFromUrl || null); // null means "All"
      } else {
        // Default to "All Financial Years" so users can see all projects
        // They can then select a specific year if needed (project counts are shown)
        setSelectedFinYear(null);
      }
    } catch (err) {
      console.error('Error fetching financial years:', err);
      setError('Failed to load financial years');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Pass null for finYearId when "All" is selected (selectedFinYear is null)
      const finYearId = selectedFinYear === null ? null : selectedFinYear?.id;
      const data = await getOverviewStats(finYearId, filters);
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

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle clicking on statistics cards
  const handleStatClick = (filterType, filterValue, title) => {
    setModalFilterType(filterType);
    setModalFilterValue(filterValue);
    setModalTitle(title);
    setModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setModalFilterType('');
    setModalFilterValue('');
    setModalTitle('');
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
      icon: Assessment,
      onClick: () => handleStatClick('finYearId', selectedFinYear === null ? null : selectedFinYear?.id, 'All Projects')
    },
    {
      title: 'Completed Projects',
      count: stats?.completed_projects || 0,
      budget: stats?.completed_budget || 0,
      color: '#4caf50',
      icon: Assessment,
      onClick: () => handleStatClick('status', 'Completed', 'Completed Projects')
    },
    {
      title: 'Ongoing Projects',
      count: stats?.ongoing_projects || 0,
      budget: stats?.ongoing_budget || 0,
      color: '#2196f3',
      icon: Assessment,
      onClick: () => handleStatClick('status', 'Ongoing', 'Ongoing Projects')
    },
    {
      title: 'Stalled Projects',
      count: stats?.stalled_projects || 0,
      budget: stats?.stalled_budget || 0,
      color: '#f44336',
      icon: Warning,
      onClick: () => handleStatClick('status', 'Stalled', 'Stalled Projects')
    },
    {
      title: 'Not Started Projects',
      count: stats?.not_started_projects || 0,
      budget: stats?.not_started_budget || 0,
      color: '#ff9800',
      icon: Schedule,
      onClick: () => handleStatClick('status', 'Not Started', 'Not Started Projects')
    },
    {
      title: 'Under Procurement',
      count: stats?.under_procurement_projects || 0,
      budget: stats?.under_procurement_budget || 0,
      color: '#9c27b0',
      icon: Assessment,
      onClick: () => handleStatClick('status', 'Under Procurement', 'Under Procurement')
    },
    {
      title: 'Suspended Projects',
      count: stats?.suspended_projects || 0,
      budget: stats?.suspended_budget || 0,
      color: '#e00202',
      icon: Warning,
      onClick: () => handleStatClick('status', 'Suspended', 'Suspended Projects')
    },
    {
      title: 'Other Projects',
      count: stats?.other_projects || 0,
      budget: stats?.other_budget || 0,
      color: '#9e9e9e',
      icon: MoreHoriz,
      onClick: () => handleStatClick('status', 'Other', 'Other Projects')
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 0.75 }}>
      {/* Header */}
      <Box sx={{ mb: 0.5 }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.25}>
          <DashboardIcon sx={{ fontSize: 24, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
          Kisumu County Public Dashboard
        </Typography>
        </Box>
      </Box>

      {/* Enhanced Filter Bar */}
      <FilterBar
        financialYears={financialYears}
        selectedFinYear={selectedFinYear}
        onFinYearChange={setSelectedFinYear}
        onFiltersChange={handleFiltersChange}
        finYearId={selectedFinYear?.id}
      />

      {/* Selected Financial Year Title */}
      <Box sx={{ mb: 0.75 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ fontSize: '0.95rem' }}>
          {selectedFinYear ? `${selectedFinYear.name} FY` : 'All Financial Years'} Public Dashboard
        </Typography>
      </Box>

      {/* Quick Stats Section */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body1" fontWeight="bold" gutterBottom sx={{ mb: 0.5, fontSize: '0.9rem' }}>
          Quick Stats
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block', fontSize: '0.7rem' }}>
          Click on any statistic card below to view detailed project information
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(5, 1fr)' 
          }, 
          gap: 1.25 
        }}>
          {statsCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </Box>
      </Box>

      {/* Analytics Dashboard Section */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body1" fontWeight="bold" gutterBottom sx={{ mb: 1, fontSize: '0.9rem' }}>
          <BarChartIcon sx={{ mr: 0.75, verticalAlign: 'middle', fontSize: 18 }} />
          Performance Analytics
        </Typography>
        
        <Grid container spacing={1.5}>
          {/* Project Completion Rate */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircle color="success" sx={{ mr: 0.75, fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                    Project Completion Rate
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold" sx={{ fontSize: '1.75rem' }}>
                    {stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {stats?.completed_projects || 0} of {stats?.total_projects || 0} projects completed
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats && stats.total_projects > 0 ? (stats.completed_projects / stats.total_projects) * 100 : 0}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Utilization */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <TrendingUp color="primary" sx={{ mr: 0.75, fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                    Budget Utilization
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ fontSize: '1.75rem' }}>
                    {stats && stats.total_budget > 0 ? Math.round((stats.completed_budget / stats.total_budget) * 100) : 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {formatCurrency(stats?.completed_budget || 0)} of {formatCurrency(stats?.total_budget || 0)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats && stats.total_budget > 0 ? (stats.completed_budget / stats.total_budget) * 100 : 0}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Project Status Distribution */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <PieChart color="info" sx={{ mr: 0.75, fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                    Project Status Distribution
                  </Typography>
                </Box>
                <List dense sx={{ py: 0 }}>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="success" sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Completed" 
                      secondary={`${stats?.completed_projects || 0} projects`}
                      primaryTypographyProps={{ sx: { fontSize: '0.85rem' } }}
                      secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%`}
                      color="success" 
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Schedule color="warning" sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ongoing" 
                      secondary={`${stats?.ongoing_projects || 0} projects`}
                      primaryTypographyProps={{ sx: { fontSize: '0.85rem' } }}
                      secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.ongoing_projects / stats.total_projects) * 100) : 0}%`}
                      color="warning" 
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning color="error" sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stalled" 
                      secondary={`${stats?.stalled_projects || 0} projects`}
                      primaryTypographyProps={{ sx: { fontSize: '0.85rem' } }}
                      secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.stalled_projects / stats.total_projects) * 100) : 0}%`}
                      color="error" 
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Star color="secondary" sx={{ mr: 0.75, fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                    Performance Metrics
                  </Typography>
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="success.main" fontWeight="bold" sx={{ fontSize: '1.5rem' }}>
                        {stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ fontSize: '1.5rem' }}>
                        {stats && stats.total_budget > 0 ? Math.round((stats.completed_budget / stats.total_budget) * 100) : 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Budget Efficiency
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="info.main" fontWeight="bold" sx={{ fontSize: '1.5rem' }}>
                        {stats?.total_budget && stats?.total_projects > 0 ? formatCurrency(stats.total_budget / stats.total_projects) : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Avg Project Value
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" color="warning.main" fontWeight="bold" sx={{ fontSize: '1.5rem' }}>
                        {stats?.total_projects || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        Total Projects
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body1" fontWeight="bold" gutterBottom sx={{ mb: 1, fontSize: '0.9rem' }}>
          <Timeline sx={{ mr: 0.75, verticalAlign: 'middle', fontSize: 18 }} />
          Visual Analytics
        </Typography>
        
        <Grid container spacing={1.5}>
          {/* Project Status Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem', mb: 0.75 }}>
                  Project Status Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  {stats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: stats.completed_projects || 0 },
                            { name: 'Ongoing', value: stats.ongoing_projects || 0 },
                            { name: 'Stalled', value: stats.stalled_projects || 0 },
                            { name: 'Not Started', value: stats.not_started_projects || 0 },
                            { name: 'Under Procurement', value: stats.under_procurement_projects || 0 },
                            { name: 'Suspended', value: stats.suspended_projects || 0 },
                            { name: 'Other', value: stats.other_projects || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Completed', value: stats.completed_projects || 0 },
                            { name: 'Ongoing', value: stats.ongoing_projects || 0 },
                            { name: 'Stalled', value: stats.stalled_projects || 0 },
                            { name: 'Not Started', value: stats.not_started_projects || 0 },
                            { name: 'Under Procurement', value: stats.under_procurement_projects || 0 },
                            { name: 'Suspended', value: stats.suspended_projects || 0 },
                            { name: 'Other', value: stats.other_projects || 0 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColorForChart(entry.name)} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Allocation Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem', mb: 0.75 }}>
                  Budget Allocation by Status
                </Typography>
                <Box sx={{ height: 250 }}>
                  {stats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Completed', budget: stats.completed_budget || 0 },
                          { name: 'Ongoing', budget: stats.ongoing_budget || 0 },
                          { name: 'Stalled', budget: stats.stalled_budget || 0 },
                          { name: 'Not Started', budget: stats.not_started_budget || 0 },
                          { name: 'Under Procurement', budget: stats.under_procurement_budget || 0 },
                          { name: 'Suspended', budget: stats.suspended_budget || 0 },
                          { name: 'Other', budget: stats.other_budget || 0 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Budget']} />
                        <Bar dataKey="budget">
                          {[
                            { name: 'Completed' },
                            { name: 'Ongoing' },
                            { name: 'Stalled' },
                            { name: 'Not Started' },
                            { name: 'Under Procurement' },
                            { name: 'Suspended' },
                            { name: 'Other' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColorForChart(entry.name)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Project vs Budget Efficiency Chart */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: '0.9rem', mb: 0.75 }}>
                  Project Count vs Budget Efficiency
                </Typography>
                <Box sx={{ height: 250 }}>
                  {stats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { 
                            name: 'Completed', 
                            projects: stats.completed_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.completed_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Ongoing', 
                            projects: stats.ongoing_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.ongoing_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Stalled', 
                            projects: stats.stalled_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.stalled_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Not Started', 
                            projects: stats.not_started_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.not_started_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Under Procurement', 
                            projects: stats.under_procurement_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.under_procurement_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Suspended', 
                            projects: stats.suspended_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.suspended_budget / stats.total_budget) * 100) : 0
                          },
                          { 
                            name: 'Other', 
                            projects: stats.other_projects || 0,
                            budgetPercent: stats.total_budget > 0 ? ((stats.other_budget / stats.total_budget) * 100) : 0
                          }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="projects" name="Project Count">
                          {[
                            { name: 'Completed' },
                            { name: 'Ongoing' },
                            { name: 'Stalled' },
                            { name: 'Not Started' },
                            { name: 'Under Procurement' },
                            { name: 'Suspended' },
                            { name: 'Other' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColorForChart(entry.name)} />
                          ))}
                        </Bar>
                        <Bar yAxisId="right" dataKey="budgetPercent" fill="#82ca9d" name="Budget %" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Detailed Breakdown Tabs */}
      <Paper sx={{ mb: 1.5, borderRadius: 2 }} elevation={2}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 40,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.85rem',
              minHeight: 40,
              py: 0.75
            }
          }}
        >
          <Tab icon={<Business sx={{ fontSize: 18 }} />} label="By Department" iconPosition="start" />
          <Tab icon={<LocationOn sx={{ fontSize: 18 }} />} label="By Sub-County" iconPosition="start" />
          <Tab icon={<LocationCity sx={{ fontSize: 18 }} />} label="By Ward" iconPosition="start" />
          <Tab icon={<TrendingUp sx={{ fontSize: 18 }} />} label="Yearly Trends" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 1.5 }}>
          {activeTab === 0 && (
            <DepartmentSummaryTable finYearId={selectedFinYear === null ? null : selectedFinYear?.id} filters={filters} />
          )}
          {activeTab === 1 && (
            <SubCountySummaryTable finYearId={selectedFinYear === null ? null : selectedFinYear?.id} filters={filters} />
          )}
          {activeTab === 2 && (
            <WardSummaryTable finYearId={selectedFinYear === null ? null : selectedFinYear?.id} filters={filters} />
          )}
          {activeTab === 3 && (
            <YearlyTrendsTable filters={filters} />
          )}
        </Box>
      </Paper>

      {/* Footer Note */}
      <Paper
        sx={{
          p: 1.5,
          mt: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="caption" textAlign="center" sx={{ fontSize: '0.75rem' }}>
          For detailed project information and photos, visit the{' '}
          <strong>Projects Gallery</strong>
        </Typography>
      </Paper>

      {/* Projects Modal */}
      <ProjectsModal
        open={modalOpen}
        onClose={handleCloseModal}
        filterType={modalFilterType}
        filterValue={modalFilterValue}
        title={modalTitle}
      />
    </Container>
  );
};

export default DashboardPage;
