import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { tokens } from '../../pages/dashboard/theme';

const ProjectAnalyticsChart = ({ data, title, type = 'bar', height = 300 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState(type);

  // Mock data for different chart types
  const chartData = {
    bar: [
      { name: 'Jan', projects: 12, completed: 8, pending: 4 },
      { name: 'Feb', projects: 15, completed: 10, pending: 5 },
      { name: 'Mar', projects: 18, completed: 12, pending: 6 },
      { name: 'Apr', projects: 22, completed: 16, pending: 6 },
      { name: 'May', projects: 25, completed: 18, pending: 7 },
      { name: 'Jun', projects: 28, completed: 20, pending: 8 },
    ],
    pie: [
      { name: 'Completed', value: 45, color: colors.greenAccent[500] },
      { name: 'In Progress', value: 30, color: colors.blueAccent[500] },
      { name: 'Pending', value: 15, color: colors.yellowAccent[500] },
      { name: 'Cancelled', value: 10, color: colors.redAccent[500] },
    ],
    line: [
      { name: 'Week 1', budget: 4000, actual: 4200 },
      { name: 'Week 2', budget: 3000, actual: 2800 },
      { name: 'Week 3', budget: 2000, actual: 2100 },
      { name: 'Week 4', budget: 2780, actual: 2900 },
      { name: 'Week 5', budget: 1890, actual: 1950 },
      { name: 'Week 6', budget: 2390, actual: 2200 },
    ],
    area: [
      { name: 'Q1', revenue: 4000, expenses: 2400 },
      { name: 'Q2', revenue: 3000, expenses: 1398 },
      { name: 'Q3', revenue: 2000, expenses: 9800 },
      { name: 'Q4', revenue: 2780, expenses: 3908 },
    ]
  };

  const currentData = chartData[chartType] || chartData.bar;

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.primary[300]} />
              <XAxis dataKey="name" stroke={colors.grey[100]} />
              <YAxis stroke={colors.grey[100]} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: colors.primary[400], 
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="projects" fill={colors.blueAccent[500]} name="Total Projects" />
              <Bar dataKey="completed" fill={colors.greenAccent[500]} name="Completed" />
              <Bar dataKey="pending" fill={colors.yellowAccent[500]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: colors.primary[400], 
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.primary[300]} />
              <XAxis dataKey="name" stroke={colors.grey[100]} />
              <YAxis stroke={colors.grey[100]} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: colors.primary[400], 
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke={colors.blueAccent[500]} 
                strokeWidth={2}
                name="Budget"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke={colors.greenAccent[500]} 
                strokeWidth={2}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.primary[300]} />
              <XAxis dataKey="name" stroke={colors.grey[100]} />
              <YAxis stroke={colors.grey[100]} />
              <RechartsTooltip 
                contentStyle={{ 
                  backgroundColor: colors.primary[400], 
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1" 
                stroke={colors.greenAccent[500]} 
                fill={colors.greenAccent[500]}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stackId="1" 
                stroke={colors.redAccent[500]} 
                fill={colors.redAccent[500]}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    // Mock trend calculation
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    return trend === 'up' ? 
      <TrendingUpIcon sx={{ color: colors.greenAccent[500] }} /> : 
      <TrendingDownIcon sx={{ color: colors.redAccent[500] }} />;
  };

  const getTrendText = () => {
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const percentage = Math.floor(Math.random() * 20) + 1;
    return trend === 'up' ? 
      `+${percentage}% from last period` : 
      `-${percentage}% from last period`;
  };

  return (
    <Card sx={{ 
      bgcolor: colors.primary[400], 
      borderRadius: 3,
      border: `1px solid ${colors.primary[300]}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${colors.primary[300]}20`,
      }
    }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color={colors.grey[100]} mb={1}>
              {title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {getTrendIcon()}
              <Typography variant="body2" color={colors.grey[300]}>
                {getTrendText()}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Data">
              <IconButton 
                size="small" 
                sx={{ 
                  color: colors.blueAccent[500],
                  '&:hover': { bgcolor: colors.blueAccent[500] + '20' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Chart">
              <IconButton 
                size="small" 
                sx={{ 
                  color: colors.greenAccent[500],
                  '&:hover': { bgcolor: colors.greenAccent[500] + '20' }
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fullscreen">
              <IconButton 
                size="small" 
                sx={{ 
                  color: colors.yellowAccent[500],
                  '&:hover': { bgcolor: colors.yellowAccent[500] + '20' }
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Controls */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: colors.grey[200] }}>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{
                  color: colors.grey[100],
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.blueAccent[500],
                  },
                }}
              >
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
                <MenuItem value="1y">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: colors.grey[200] }}>Chart Type</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                sx={{
                  color: colors.grey[100],
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary[300],
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.blueAccent[500],
                  },
                }}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
                <MenuItem value="area">Area Chart</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Chart */}
        <Box sx={{ 
          bgcolor: colors.primary[500], 
          borderRadius: 2, 
          p: 2,
          border: `1px solid ${colors.primary[300]}`
        }}>
          {renderChart()}
        </Box>

        {/* Summary Stats */}
        <Box mt={3} display="flex" justifyContent="space-around">
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[500]}>
              {currentData.reduce((sum, item) => sum + (item.projects || item.value || 0), 0)}
            </Typography>
            <Typography variant="body2" color={colors.grey[300]}>
              Total Items
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color={colors.blueAccent[500]}>
              {Math.floor(Math.random() * 20) + 80}%
            </Typography>
            <Typography variant="body2" color={colors.grey[300]}>
              Success Rate
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color={colors.yellowAccent[500]}>
              {Math.floor(Math.random() * 10) + 5}
            </Typography>
            <Typography variant="body2" color={colors.grey[300]}>
              Active Projects
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalyticsChart;
