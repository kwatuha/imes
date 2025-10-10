import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import ProjectsModal from '../components/ProjectsModal';
import {
  getOverviewStats,
  getDepartmentStats,
  getProjectTypeStats,
  getFinancialYears
} from '../services/publicApi';
import { formatCurrency } from '../utils/formatters';
import {
  CheckCircle,
  Construction,
  HourglassEmpty,
  ShoppingCart,
  Warning,
  Assessment
} from '@mui/icons-material';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336', '#757575'];

const DashboardPage = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [financialYears, setFinancialYears] = useState([]);
  const [stats, setStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [projectTypeStats, setProjectTypeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ filterType: '', filterValue: '', title: '' });

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    if (financialYears.length > 0 && !selectedYear) {
      // Set the most recent financial year as default
      setSelectedYear(financialYears[0].id);
    }
  }, [financialYears]);

  useEffect(() => {
    if (selectedYear !== '') {
      fetchAllData();
    }
  }, [selectedYear]);

  const fetchFinancialYears = async () => {
    try {
      const data = await getFinancialYears();
      setFinancialYears(data);
    } catch (err) {
      console.error('Error fetching financial years:', err);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const yearId = selectedYear === 'all' ? null : selectedYear;
      
      const [overviewData, deptData, typeData] = await Promise.all([
        getOverviewStats(yearId),
        getDepartmentStats(yearId),
        getProjectTypeStats(yearId)
      ]);

      setStats(overviewData);
      setDepartmentStats(deptData);
      setProjectTypeStats(typeData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const statusData = stats ? [
    { name: 'Completed', value: parseInt(stats.completed_projects), color: '#4caf50' },
    { name: 'Ongoing', value: parseInt(stats.ongoing_projects), color: '#2196f3' },
    { name: 'Not Started', value: parseInt(stats.not_started_projects), color: '#ff9800' },
    { name: 'Under Procurement', value: parseInt(stats.under_procurement_projects), color: '#9c27b0' },
    { name: 'Stalled', value: parseInt(stats.stalled_projects), color: '#f44336' }
  ].filter(item => item.value > 0) : [];

  const handleCardClick = (status, title) => {
    setModalConfig({
      filterType: status === 'all' ? 'finYearId' : 'status',
      filterValue: status === 'all' ? selectedYear : status,
      title: `${title}${selectedYear && selectedYear !== 'all' ? ` - ${financialYears.find(y => y.id === selectedYear)?.name}` : ''}`
    });
    setModalOpen(true);
  };

  const handleDepartmentClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const department = data.activePayload[0].payload;
      setModalConfig({
        filterType: 'department',
        filterValue: department.fullName,
        title: `${department.fullName} Projects${selectedYear && selectedYear !== 'all' ? ` - ${financialYears.find(y => y.id === selectedYear)?.name}` : ''}`
      });
      setModalOpen(true);
    }
  };

  const handlePieClick = (data) => {
    if (data && data.name) {
      setModalConfig({
        filterType: 'status',
        filterValue: data.name,
        title: `${data.name} Projects${selectedYear && selectedYear !== 'all' ? ` - ${financialYears.find(y => y.id === selectedYear)?.name}` : ''}`
      });
      setModalOpen(true);
    }
  };

  const handleProjectTypeClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const projectType = data.activePayload[0].payload;
      setModalConfig({
        filterType: 'projectType',
        filterValue: projectType.projectType,
        title: `${projectType.projectType} Projects${selectedYear && selectedYear !== 'all' ? ` - ${financialYears.find(y => y.id === selectedYear)?.name}` : ''}`
      });
      setModalOpen(true);
    }
  };

  const statsCards = stats ? [
    {
      title: 'All Projects',
      count: stats.total_projects || 0,
      budget: stats.total_budget || 0,
      color: '#1976d2',
      icon: Assessment,
      onClick: () => handleCardClick('all', 'All Projects')
    },
    {
      title: 'Completed',
      count: stats.completed_projects || 0,
      budget: stats.completed_budget || 0,
      color: '#4caf50',
      icon: CheckCircle,
      onClick: () => handleCardClick('Completed', 'Completed Projects')
    },
    {
      title: 'Ongoing',
      count: stats.ongoing_projects || 0,
      budget: stats.ongoing_budget || 0,
      color: '#2196f3',
      icon: Construction,
      onClick: () => handleCardClick('Ongoing', 'Ongoing Projects')
    },
    {
      title: 'Not Started',
      count: stats.not_started_projects || 0,
      budget: stats.not_started_budget || 0,
      color: '#ff9800',
      icon: HourglassEmpty,
      onClick: () => handleCardClick('Not Started', 'Not Started Projects')
    },
    {
      title: 'Under Procurement',
      count: stats.under_procurement_projects || 0,
      budget: stats.under_procurement_budget || 0,
      color: '#9c27b0',
      icon: ShoppingCart,
      onClick: () => handleCardClick('Under Procurement', 'Under Procurement Projects')
    },
    {
      title: 'Stalled',
      count: stats.stalled_projects || 0,
      budget: stats.stalled_budget || 0,
      color: '#f44336',
      icon: Warning,
      onClick: () => handleCardClick('Stalled', 'Stalled Projects')
    }
  ] : [];

  if (loading && !stats) {
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
          Public Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View comprehensive project statistics and analytics
        </Typography>
      </Box>

      {/* Financial Year Filter */}
      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Financial Year</InputLabel>
          <Select
            value={selectedYear}
            label="Financial Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <MenuItem value="all">All Financial Years</MenuItem>
            {financialYears.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Status Distribution Pie Chart */}
        {statusData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Project Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={handlePieClick}
                    cursor="pointer"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Department Budget Bar Chart */}
        {departmentStats.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Budget by Department
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={departmentStats.slice(0, 5).map(dept => ({
                    ...dept,
                    displayName: dept.departmentAlias || dept.department,
                    fullName: dept.department
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="displayName" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => [formatCurrency(value), 'Budget']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullName;
                      }
                      return label;
                    }}
                  />
                  <Bar 
                    dataKey="total_budget" 
                    fill="#1976d2" 
                    name="Budget"
                    onClick={handleDepartmentClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}

        {/* Project Type Distribution */}
        {projectTypeStats.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Projects by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="projectType" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="project_count" 
                    fill="#4caf50" 
                    name="Projects"
                    onClick={handleProjectTypeClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Projects Modal */}
      <ProjectsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filterType={modalConfig.filterType}
        filterValue={modalConfig.filterValue}
        title={modalConfig.title}
      />
    </Container>
  );
};

export default DashboardPage;

