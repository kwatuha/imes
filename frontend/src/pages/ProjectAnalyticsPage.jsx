import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
    Fade,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import {
    TrendingUp,
    Assessment,
    Business,
    AttachMoney,
    CheckCircle,
    Schedule,
    Analytics as AnalyticsIcon,
    BarChart as BarChartIcon,
    PieChart as PieChartIcon,
    ShowChart
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import projectService from '../api/projectService';
import reportsService from '../api/reportsService';
import { getProjectStatusBackgroundColor } from '../utils/projectStatusColors';
import { groupStatusesByNormalized } from '../utils/projectStatusNormalizer';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B6B', '#6B66FF'];

export default function ProjectAnalyticsPage() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState(12);
    const [activeTab, setActiveTab] = useState(0);
    
    // Data states
    const [summary, setSummary] = useState(null);
    const [projectTrends, setProjectTrends] = useState([]);
    const [financialTrends, setFinancialTrends] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [statusDistribution, setStatusDistribution] = useState([]);
    const [budgetByStatus, setBudgetByStatus] = useState([]);
    const [completionTrends, setCompletionTrends] = useState([]);
    const [departmentPerformance, setDepartmentPerformance] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, [months]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            
            // Fetch all analytics data in parallel
            const [
                statusCounts,
                departmentSummary,
                yearlyTrends,
                financialStatus,
                projectStatusSummary
            ] = await Promise.all([
                projectService.analytics.getProjectStatusCounts().catch((err) => { console.error('Error fetching status counts:', err); return []; }),
                reportsService.getDepartmentSummaryReport({}).catch((err) => { console.error('Error fetching department summary:', err); return []; }),
                reportsService.getYearlyTrendsReport({}).catch((err) => { console.error('Error fetching yearly trends:', err); return []; }),
                reportsService.getFinancialStatusByProjectStatus({}).catch((err) => { console.error('Error fetching financial status:', err); return []; }),
                reportsService.getProjectStatusSummary({}).catch((err) => { console.error('Error fetching project status summary:', err); return []; })
            ]);

            // Debug: Log received data
            console.log('Analytics data received:', {
                statusCounts: statusCounts?.length || 0,
                departmentSummary: departmentSummary?.length || 0,
                yearlyTrends: yearlyTrends?.length || 0,
                financialStatus: financialStatus?.length || 0,
                projectStatusSummary: projectStatusSummary?.length || 0
            });

            // Process and set summary data
            const totalProjects = departmentSummary.reduce((sum, dept) => sum + (dept.numProjects || 0), 0);
            const completedProjects = statusCounts.find(item => {
                const normalized = item.status?.toLowerCase();
                return normalized === 'completed' || normalized === 'done' || normalized === 'finished';
            })?.count || 0;
            
            const totalBudget = departmentSummary.reduce((sum, dept) => sum + (parseFloat(dept.allocatedBudget) || 0), 0);
            const totalPaid = departmentSummary.reduce((sum, dept) => sum + (parseFloat(dept.amountPaid) || 0), 0);
            const monthlyBudget = totalPaid / (months || 1);

            setSummary({
                totalProjects,
                completedProjects,
                totalBudget,
                monthlyBudget,
                totalPaid,
                totalDepartments: departmentSummary.length
            });

            // Process project trends
            // Backend /yearly-trends returns array with { name, projectCount, totalBudget, totalPaid }
            // Transform to expected format for project trends
            const trendsData = Array.isArray(yearlyTrends) ? yearlyTrends : (yearlyTrends?.projectPerformance || []);
            setProjectTrends(trendsData.map(item => ({
                name: item.name || item.year || 'Unknown',
                totalProjects: item.projectCount || item.totalProjects || 0,
                completedProjects: item.completedProjects || 0,
                completionRate: parseFloat(item.completionRate) || 0
            })));

            // Process financial trends
            // Backend /yearly-trends returns array with { name, projectCount, totalBudget, totalPaid }
            // Transform to expected format for financial trends
            const financialData = Array.isArray(yearlyTrends) ? yearlyTrends : (yearlyTrends?.financialTrends || []);
            setFinancialTrends(financialData.map(item => {
                const totalBudget = parseFloat(item.totalBudget) || 0;
                const totalPaid = parseFloat(item.totalPaid || item.totalExpenditure) || 0;
                const absorptionRate = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;
                return {
                    name: item.name || item.year || 'Unknown',
                    totalBudget: totalBudget,
                    totalExpenditure: totalPaid,
                    absorptionRate: parseFloat(absorptionRate.toFixed(2))
                };
            }));

            // Process department data
            setDepartmentData(departmentSummary.map(dept => ({
                name: dept.departmentAlias || dept.departmentName || 'Unknown',
                projects: dept.numProjects || 0,
                budget: parseFloat(dept.allocatedBudget) || 0,
                paid: parseFloat(dept.amountPaid) || 0,
                progress: parseFloat(dept.percentCompleted) || 0
            })));

            // Process status distribution
            const groupedStatuses = groupStatusesByNormalized(statusCounts, 'status', 'count');
            setStatusDistribution(groupedStatuses.map(item => ({
                name: item.name,
                value: item.value,
                color: getProjectStatusBackgroundColor(item.name)
            })));

            // Process budget by status
            const groupedBudget = groupStatusesByNormalized(financialStatus, 'status', 'totalBudget');
            setBudgetByStatus(groupedBudget.map(item => ({
                name: item.name,
                budget: parseFloat(item.value) || 0,
                color: getProjectStatusBackgroundColor(item.name)
            })));

            // Process completion trends
            const completionData = trendsData.map(item => ({
                name: item.name || item.year || 'Unknown',
                completionRate: parseFloat(item.completionRate) || 0,
                avgDuration: parseFloat(item.avgDuration) || 0
            }));
            setCompletionTrends(completionData);

            // Process department performance
            setDepartmentPerformance(departmentSummary.map(dept => ({
                name: dept.departmentAlias || dept.departmentName || 'Unknown',
                progress: parseFloat(dept.percentCompleted) || 0,
                budgetUtilization: parseFloat(dept.percentAbsorptionRate) || 0,
                healthScore: dept.healthScore || 0
            })));

        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return `KSh ${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `KSh ${(value / 1000).toFixed(0)}K`;
        } else {
            return `KSh ${value.toLocaleString()}`;
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '400px',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading analytics...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: '100%' }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Project Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Comprehensive project performance metrics and statistics
                    </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Time Period</InputLabel>
                    <Select
                        value={months}
                        label="Time Period"
                        onChange={(e) => setMonths(e.target.value)}
                    >
                        <MenuItem value={6}>Last 6 months</MenuItem>
                        <MenuItem value={12}>Last 12 months</MenuItem>
                        <MenuItem value={24}>Last 24 months</MenuItem>
                        <MenuItem value={36}>Last 36 months</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Summary Cards */}
            {summary && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in timeout={800}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}>
                                <CardHeader
                                    sx={{ pb: 1 }}
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Business sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Total Projects
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        {summary.totalProjects || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        All registered projects
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in timeout={1000}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}>
                                <CardHeader
                                    sx={{ pb: 1 }}
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AttachMoney sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Total Budget
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        {formatCurrency(summary.totalBudget || 0)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        All-time allocated budget
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in timeout={1200}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}>
                                <CardHeader
                                    sx={{ pb: 1 }}
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <TrendingUp sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Monthly Budget
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        {formatCurrency(summary.monthlyBudget || 0)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Average per month
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Fade in timeout={1400}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-2px)'
                                }
                            }}>
                                <CardHeader
                                    sx={{ pb: 1 }}
                                    title={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                Completed
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                        {summary.completedProjects || 0}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {summary.totalProjects > 0 
                                            ? `${Math.round((summary.completedProjects / summary.totalProjects) * 100)}% completion rate`
                                            : 'No projects'
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            )}

            {/* Tabbed Analytics Sections */}
            <Card sx={{ 
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: '12px'
            }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48
                        }
                    }}
                >
                    <Tab icon={<BarChartIcon />} iconPosition="start" label="Project Trends" />
                    <Tab icon={<AttachMoney />} iconPosition="start" label="Financial Trends" />
                    <Tab icon={<PieChartIcon />} iconPosition="start" label="Status Distribution" />
                    <Tab icon={<Business />} iconPosition="start" label="Department Analytics" />
                    <Tab icon={<ShowChart />} iconPosition="start" label="Performance Metrics" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Project Trends Tab */}
                    {activeTab === 0 && (
                        <Fade in timeout={600}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={8}>
                                        <Card variant="outlined" sx={{ mb: 3 }}>
                                            <CardHeader
                                                title="Project Completion Trends"
                                                subheader="Yearly project completion statistics"
                                            />
                                            <CardContent>
                                                {projectTrends.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No project trend data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <BarChart data={projectTrends}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="totalProjects" fill="#3b82f6" name="Total Projects" radius={[4, 4, 0, 0]} />
                                                            <Bar dataKey="completedProjects" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Completion Rate Trend"
                                                subheader="Percentage completion over time"
                                            />
                                            <CardContent>
                                                {completionTrends.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No completion data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <LineChart data={completionTrends}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis />
                                                            <Tooltip formatter={(value) => `${value}%`} />
                                                            <Legend />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="completionRate" 
                                                                stroke="#3b82f6" 
                                                                strokeWidth={2}
                                                                dot={{ r: 4 }}
                                                                name="Completion Rate %"
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Project Trends Summary"
                                                subheader="Detailed yearly breakdown"
                                            />
                                            <CardContent>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Year</strong></TableCell>
                                                                <TableCell align="right"><strong>Total Projects</strong></TableCell>
                                                                <TableCell align="right"><strong>Completed</strong></TableCell>
                                                                <TableCell align="right"><strong>Completion Rate</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {projectTrends.map((row, index) => (
                                                                <TableRow key={index} hover>
                                                                    <TableCell>{row.name}</TableCell>
                                                                    <TableCell align="right">{row.totalProjects}</TableCell>
                                                                    <TableCell align="right">{row.completedProjects}</TableCell>
                                                                    <TableCell align="right">
                                                                        <Chip 
                                                                            label={`${row.completionRate.toFixed(1)}%`}
                                                                            size="small"
                                                                            color={row.completionRate >= 80 ? 'success' : row.completionRate >= 60 ? 'warning' : 'error'}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}

                    {/* Financial Trends Tab */}
                    {activeTab === 1 && (
                        <Fade in timeout={600}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ mb: 3 }}>
                                            <CardHeader
                                                title="Financial Performance Trends"
                                                subheader="Budget vs expenditure over time"
                                            />
                                            <CardContent>
                                                {financialTrends.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No financial trend data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <LineChart data={financialTrends}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                                            <Legend />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="totalBudget" 
                                                                stroke="#3b82f6" 
                                                                strokeWidth={2}
                                                                dot={{ r: 4 }}
                                                                name="Total Budget"
                                                            />
                                                            <Line 
                                                                type="monotone" 
                                                                dataKey="totalExpenditure" 
                                                                stroke="#ef4444" 
                                                                strokeWidth={2}
                                                                dot={{ r: 4 }}
                                                                name="Total Expenditure"
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Absorption Rate Trend"
                                                subheader="Budget absorption percentage"
                                            />
                                            <CardContent>
                                                {financialTrends.length === 0 ? (
                                                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <BarChart data={financialTrends}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" />
                                                            <YAxis tickFormatter={(value) => `${value}%`} />
                                                            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                                                            <Bar dataKey="absorptionRate" fill="#10b981" radius={[4, 4, 0, 0]} name="Absorption Rate %" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Budget Allocation by Status"
                                                subheader="Financial distribution across project statuses"
                                            />
                                            <CardContent>
                                                {budgetByStatus.length === 0 ? (
                                                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No budget data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <PieChart>
                                                            <Pie
                                                                data={budgetByStatus}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                dataKey="budget"
                                                            >
                                                                {budgetByStatus.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}

                    {/* Status Distribution Tab */}
                    {activeTab === 2 && (
                        <Fade in timeout={600}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Project Status Distribution"
                                                subheader="Projects categorized by status"
                                            />
                                            <CardContent>
                                                {statusDistribution.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No status data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <PieChart>
                                                            <Pie
                                                                data={statusDistribution}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                outerRadius={120}
                                                                fill="#8884d8"
                                                                dataKey="value"
                                                            >
                                                                {statusDistribution.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Status Breakdown"
                                                subheader="Detailed status statistics"
                                            />
                                            <CardContent>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Status</strong></TableCell>
                                                                <TableCell align="right"><strong>Count</strong></TableCell>
                                                                <TableCell align="right"><strong>Percentage</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {statusDistribution
                                                                .sort((a, b) => b.value - a.value)
                                                                .map((row, index) => {
                                                                    const total = statusDistribution.reduce((sum, item) => sum + item.value, 0);
                                                                    const percentage = total > 0 ? (row.value / total * 100).toFixed(1) : 0;
                                                                    return (
                                                                        <TableRow key={index} hover>
                                                                            <TableCell>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <Box 
                                                                                        sx={{ 
                                                                                            width: 12, 
                                                                                            height: 12, 
                                                                                            borderRadius: '50%', 
                                                                                            bgcolor: row.color 
                                                                                        }} 
                                                                                    />
                                                                                    {row.name}
                                                                                </Box>
                                                                            </TableCell>
                                                                            <TableCell align="right">{row.value}</TableCell>
                                                                            <TableCell align="right">
                                                                                <Chip 
                                                                                    label={`${percentage}%`}
                                                                                    size="small"
                                                                                    sx={{ bgcolor: row.color, color: 'white' }}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}

                    {/* Department Analytics Tab */}
                    {activeTab === 3 && (
                        <Fade in timeout={600}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Card variant="outlined" sx={{ mb: 3 }}>
                                            <CardHeader
                                                title="Department Project Distribution"
                                                subheader="Projects and budget by department"
                                            />
                                            <CardContent>
                                                {departmentData.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No department data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <BarChart data={departmentData.slice(0, 10)}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="projects" fill="#3b82f6" name="Projects" radius={[4, 4, 0, 0]} />
                                                            <Bar dataKey="budget" fill="#10b981" name="Budget (KSh)" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Department Performance Details"
                                                subheader="Comprehensive department statistics"
                                            />
                                            <CardContent>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Department</strong></TableCell>
                                                                <TableCell align="right"><strong>Projects</strong></TableCell>
                                                                <TableCell align="right"><strong>Budget</strong></TableCell>
                                                                <TableCell align="right"><strong>Paid</strong></TableCell>
                                                                <TableCell align="right"><strong>Progress</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {departmentData
                                                                .sort((a, b) => b.projects - a.projects)
                                                                .map((row, index) => (
                                                                    <TableRow key={index} hover>
                                                                        <TableCell><strong>{row.name}</strong></TableCell>
                                                                        <TableCell align="right">{row.projects}</TableCell>
                                                                        <TableCell align="right">{formatCurrency(row.budget)}</TableCell>
                                                                        <TableCell align="right">{formatCurrency(row.paid)}</TableCell>
                                                                        <TableCell align="right">
                                                                            <Chip 
                                                                                label={`${row.progress.toFixed(1)}%`}
                                                                                size="small"
                                                                                color={row.progress >= 80 ? 'success' : row.progress >= 50 ? 'warning' : 'error'}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}

                    {/* Performance Metrics Tab */}
                    {activeTab === 4 && (
                        <Fade in timeout={600}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Department Progress"
                                                subheader="Completion progress by department"
                                            />
                                            <CardContent>
                                                {departmentPerformance.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No performance data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <BarChart 
                                                            data={departmentPerformance.slice(0, 10)}
                                                            layout="vertical"
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis type="number" domain={[0, 100]} />
                                                            <YAxis type="category" dataKey="name" width={120} />
                                                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                                            <Bar dataKey="progress" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Progress %" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card variant="outlined">
                                            <CardHeader
                                                title="Budget Utilization"
                                                subheader="Budget absorption by department"
                                            />
                                            <CardContent>
                                                {departmentPerformance.length === 0 ? (
                                                    <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Typography color="text.secondary">No utilization data available</Typography>
                                                    </Box>
                                                ) : (
                                                    <ResponsiveContainer width="100%" height={400}>
                                                        <BarChart 
                                                            data={departmentPerformance.slice(0, 10)}
                                                            layout="vertical"
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis type="number" domain={[0, 100]} />
                                                            <YAxis type="category" dataKey="name" width={120} />
                                                            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                                                            <Bar dataKey="budgetUtilization" fill="#10b981" radius={[0, 4, 4, 0]} name="Budget Utilization %" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Card>
        </Box>
    );
}

