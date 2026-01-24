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
import { formatCurrency } from '../utils/formatters';

// Chart colors
const COLORS = ['#4caf50', '#ff9800', '#f44336', '#9e9e9e', '#2196f3'];

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
      title: 'Other Projects',
      count: stats?.other_projects || 0,
      budget: stats?.other_budget || 0,
      color: '#9e9e9e',
      icon: MoreHoriz,
      onClick: () => handleStatClick('status', 'Other', 'Other Projects')
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 1.5 }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
          <DashboardIcon sx={{ fontSize: 28, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
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
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {selectedFinYear ? `${selectedFinYear.name} FY` : 'All Financial Years'} Public Dashboard
        </Typography>
      </Box>

      {/* Quick Stats Section */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
          Quick Stats
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          Click on any statistic card below to view detailed project information
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(5, 1fr)' 
          }, 
          gap: 2 
        }}>
          {statsCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </Box>
      </Box>

      {/* Analytics Dashboard Section */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
          Performance Analytics
        </Typography>
        
        <Grid container spacing={2}>
          {/* Project Completion Rate */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Project Completion Rate
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" color="success.main" fontWeight="bold">
                    {stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats?.completed_projects || 0} of {stats?.total_projects || 0} projects completed
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats && stats.total_projects > 0 ? (stats.completed_projects / stats.total_projects) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Budget Utilization */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Budget Utilization
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" color="primary.main" fontWeight="bold">
                    {stats && stats.total_budget > 0 ? Math.round((stats.completed_budget / stats.total_budget) * 100) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(stats?.completed_budget || 0)} of {formatCurrency(stats?.total_budget || 0)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats && stats.total_budget > 0 ? (stats.completed_budget / stats.total_budget) * 100 : 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Project Status Distribution */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PieChart color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Project Status Distribution
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Completed" 
                      secondary={`${stats?.completed_projects || 0} projects`}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%`}
                      color="success" 
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ongoing" 
                      secondary={`${stats?.ongoing_projects || 0} projects`}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.ongoing_projects / stats.total_projects) * 100) : 0}%`}
                      color="warning" 
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stalled" 
                      secondary={`${stats?.stalled_projects || 0} projects`}
                    />
                    <Chip 
                      label={`${stats && stats.total_projects > 0 ? Math.round((stats.stalled_projects / stats.total_projects) * 100) : 0}%`}
                      color="error" 
                      size="small"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Star color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Performance Metrics
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {stats && stats.total_projects > 0 ? Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {stats && stats.total_budget > 0 ? Math.round((stats.completed_budget / stats.total_budget) * 100) : 0}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Budget Efficiency
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main" fontWeight="bold">
                        {stats?.total_budget && stats?.total_projects > 0 ? formatCurrency(stats.total_budget / stats.total_projects) : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg Project Value
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main" fontWeight="bold">
                        {stats?.total_projects || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          <Timeline sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
          Visual Analytics
        </Typography>
        
        <Grid container spacing={2}>
          {/* Project Status Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Project Status Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  {stats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: stats.completed_projects || 0 },
                            { name: 'Ongoing', value: stats.ongoing_projects || 0 },
                            { name: 'Stalled', value: stats.stalled_projects || 0 },
                            { name: 'Not Started', value: stats.not_started_projects || 0 },
                            { name: 'Under Procurement', value: stats.under_procurement_projects || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Completed', value: stats.completed_projects || 0 },
                            { name: 'Ongoing', value: stats.ongoing_projects || 0 },
                            { name: 'Stalled', value: stats.stalled_projects || 0 },
                            { name: 'Not Started', value: stats.not_started_projects || 0 },
                            { name: 'Under Procurement', value: stats.under_procurement_projects || 0 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Budget Allocation by Status
                </Typography>
                <Box sx={{ height: 300 }}>
                  {stats ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Completed', budget: stats.completed_budget || 0 },
                          { name: 'Ongoing', budget: stats.ongoing_budget || 0 },
                          { name: 'Stalled', budget: stats.stalled_budget || 0 },
                          { name: 'Not Started', budget: stats.not_started_budget || 0 },
                          { name: 'Under Procurement', budget: stats.under_procurement_budget || 0 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Budget']} />
                        <Bar dataKey="budget" fill="#8884d8" />
                      </BarChart>
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

          {/* Project vs Budget Efficiency Chart */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Project Count vs Budget Efficiency
                </Typography>
                <Box sx={{ height: 300 }}>
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
                          }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="projects" fill="#8884d8" name="Project Count" />
                        <Bar yAxisId="right" dataKey="budgetPercent" fill="#82ca9d" name="Budget %" />
                      </BarChart>
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
        </Grid>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Detailed Breakdown Tabs */}
      <Paper sx={{ mb: 2.5, borderRadius: 2 }} elevation={2}>
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
          <Tab icon={<TrendingUp />} label="Yearly Trends" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 2 }}>
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
