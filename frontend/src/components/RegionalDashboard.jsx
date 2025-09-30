import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardHeader,
    useTheme,
    Fade,
    Slide,
    Chip,
    Paper,
    Divider,
    LinearProgress,
    Tabs,
    Tab,
    Container,
    Button
} from '@mui/material';
import { tokens } from '../pages/dashboard/theme';
import { TrendingUp, Assessment, PieChart, BarChart, Timeline, Business, AttachMoney, CheckCircle, Warning, Speed, TrendingDown, Schedule, FilterList, ShowChart, Analytics } from '@mui/icons-material';

// Import your chart components and new filter component
import CircularChart from './charts/CircularChart';
import LineBarComboChart from './charts/LineBarComboChart';
import BudgetAllocationChart from './charts/BudgetAllocationChart';
import ProjectStatusDistributionChart from './charts/ProjectStatusDistributionChart';
import DashboardFilters from './DashboardFilters';
import { getProjectStatusBackgroundColor } from '../utils/projectStatusColors';
import projectService from '../api/projectService';
import reportsService from '../api/reportsService';
import regionalService from '../api/regionalService';
import ProjectDetailTable from './tables/ProjectDetailTable';
import DepartmentProjectsModal from './modals/DepartmentProjectsModal';
import YearProjectsModal from './modals/YearProjectsModal';
import SubCountyProjectsModal from './modals/SubCountyProjectsModal';
import WardProjectsModal from './modals/WardProjectsModal';
import EnhancedOverviewTab from './EnhancedOverviewTab';
import EnhancedYearlyTrendsTab from './EnhancedYearlyTrendsTab';
import { DEFAULT_COUNTY, DEFAULT_SUBCOUNTY } from '../configs/appConfig';
import { 
    overviewTableColumns, 
    financialTableColumns, 
    analyticsTableColumns,
    transformOverviewData,
    transformFinancialData,
    transformAnalyticsData
} from './tables/TableConfigs';

const RegionalDashboard = () => {
    const theme = useTheme();

    const [dashboardData, setDashboardData] = useState({
        projectStatus: [],
        projectProgress: [],
        projectTypes: [],
        budgetAllocation: [],
        statusDistribution: [],
        wards: [],
        subCounties: []
    });
    const [trendsData, setTrendsData] = useState({
        projectPerformance: [],
        financialTrends: [],
        departmentTrends: [],
        statusTrends: [],
        yearRange: { start: 0, end: 0, years: [] }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        department: '',
        status: '',
        projectType: '',
        year: '',
        cidpPeriod: '',
        financialYear: '',
        startDate: '',
        endDate: '',
        projectStatus: '',
        section: '',
        county: DEFAULT_COUNTY.name,
        subCounty: DEFAULT_SUBCOUNTY.name,
        ward: ''
    });
    const [activeTab, setActiveTab] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [yearModalOpen, setYearModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [subcountyModalOpen, setSubcountyModalOpen] = useState(false);
    const [selectedSubcounty, setSelectedSubcounty] = useState(null);
    const [wardModalOpen, setWardModalOpen] = useState(false);
    const [selectedWard, setSelectedWard] = useState(null);

    // API Integration Functions
    const fetchProjectStatusData = async (filters) => {
        try {
            const response = await projectService.analytics.getProjectStatusCounts();
            return response.map(item => ({
                name: item.status,
                value: item.count,
                color: getProjectStatusBackgroundColor(item.status)
            }));
        } catch (error) {
            console.error('Error fetching project status data:', error);
            return [];
        }
    };

    const fetchRegionalData = async (filters) => {
        try {
            // Fetch both sub-counties and wards data
            const [subCountyResponse, wardResponse] = await Promise.all([
                regionalService.getSubCountiesData(filters),
                regionalService.getWardsData(filters)
            ]);
            
            return {
                subCounties: subCountyResponse.subCounties || [],
                wards: wardResponse.wards || []
            };
        } catch (error) {
            console.error('Error fetching regional data:', error);
            return {
                subCounties: [],
                wards: []
            };
        }
    };

    const fetchProjectTypesData = async (filters) => {
        try {
            const response = await projectService.analytics.getProjectsByDirectorateCounts();
            return response.map((item, index) => ({
                name: item.directorate,
                value: item.count,
                color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'][index % 6]
            }));
        } catch (error) {
            console.error('Error fetching project types data:', error);
            return [];
        }
    };

    const fetchBudgetAllocationData = async (filters) => {
        try {
            const response = await reportsService.getFinancialStatusByProjectStatus(filters);
            return response.map(item => ({
                name: item.status,
                contracted: parseFloat(item.totalBudget) || 0,
                paid: parseFloat(item.totalPaid) || 0,
                color: getProjectStatusBackgroundColor(item.status),
                count: item.projectCount || 0
            }));
        } catch (error) {
            console.error('Error fetching budget allocation data:', error);
            return [];
        }
    };

    const fetchProjectProgressData = async (filters) => {
        try {
            const response = await reportsService.getDepartmentSummaryReport(filters);
            return response.map(dept => ({
                department: dept.departmentAlias || dept.departmentName, // Use alias for display, fallback to name
                departmentName: dept.departmentName, // Keep full name for tooltips
                percentCompleted: dept.percentCompleted || 0,
                percentBudgetContracted: dept.percentBudgetContracted || 0,
                percentContractSumPaid: dept.percentContractSumPaid || 0,
                percentAbsorptionRate: dept.percentAbsorptionRate || 0,
                allocatedBudget: dept.allocatedBudget || 0,
                contractSum: dept.contractSum || 0,
                amountPaid: dept.amountPaid || 0,
                numProjects: dept.numProjects || 0
            }));
        } catch (error) {
            console.error('Error fetching project progress data:', error);
            return [];
        }
    };

    // Calculate financial summary metrics from department data
    const calculateFinancialSummary = (departmentData) => {
        if (!departmentData || departmentData.length === 0) {
            return {
                totalContracted: 0,
                totalPaid: 0,
                absorptionRate: 0
            };
        }

        const totalContracted = departmentData.reduce((sum, dept) => {
            const contractSum = parseFloat(dept.contractSum) || 0;
            return sum + contractSum;
        }, 0);
        
        const totalPaid = departmentData.reduce((sum, dept) => {
            const amountPaid = parseFloat(dept.amountPaid) || 0;
            return sum + amountPaid;
        }, 0);
        
        const absorptionRate = totalContracted > 0 ? (totalPaid / totalContracted) * 100 : 0;

        return {
            totalContracted,
            totalPaid,
            absorptionRate: Math.round(absorptionRate * 100) / 100 // Round to 2 decimal places
        };
    };

    const fetchStatusDistributionData = async (filters) => {
        try {
            const response = await reportsService.getProjectStatusSummary(filters);
            return response.map(item => ({
                name: item.name,
                value: item.value,
                color: getProjectStatusBackgroundColor(item.name),
                count: item.value
            }));
        } catch (error) {
            console.error('Error fetching status distribution data:', error);
            return [];
        }
    };


    // Function to load trends data
    const loadTrendsData = async () => {
        try {
            const trendsResponse = await reportsService.getAnnualTrends();
            setTrendsData(trendsResponse);
        } catch (error) {
            console.error('Error loading trends data:', error);
        }
    };

    // Function to load data from API
    const loadDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Fetch all data in parallel for better performance
            const [
                projectStatusData,
                projectTypesData,
                budgetAllocationData,
                projectProgressData,
                statusDistributionData,
                regionalData
            ] = await Promise.all([
                fetchProjectStatusData(filters),
                fetchProjectTypesData(filters),
                fetchBudgetAllocationData(filters),
                fetchProjectProgressData(filters),
                fetchStatusDistributionData(filters),
                fetchRegionalData(filters)
            ]);

            // Apply client-side filtering if needed
            let filteredProjectStatus = filters.projectStatus || filters.status
                ? projectStatusData.filter(item => {
                    if (filters.projectStatus) return item.name === filters.projectStatus;
                    if (filters.status) return item.name === filters.status;
                    return true;
                })
                : projectStatusData;
            
            let filteredProjectProgress = filters.department 
                ? projectProgressData.filter(item => item.department === filters.department) 
                : projectProgressData;
            
            let filteredProjectTypes = filters.projectType 
                ? projectTypesData.filter(item => item.name === filters.projectType) 
                : projectTypesData;
            
            let filteredBudgetAllocation = filters.projectStatus || filters.status
                ? budgetAllocationData.filter(item => {
                    if (filters.projectStatus) return item.name === filters.projectStatus;
                    if (filters.status) return item.name === filters.status;
                    return true;
                })
                : budgetAllocationData;
            
            let filteredStatusDistribution = filters.projectStatus || filters.status
                ? statusDistributionData.filter(item => {
                    if (filters.projectStatus) return item.name === filters.projectStatus;
                    if (filters.status) return item.name === filters.status;
                    return true;
                })
                : statusDistributionData;

            // Ensure all data has correct colors
            filteredProjectStatus = filteredProjectStatus.map(item => ({
                ...item,
                color: getProjectStatusBackgroundColor(item.name)
            }));

            filteredBudgetAllocation = filteredBudgetAllocation.map(item => ({
                ...item,
                color: getProjectStatusBackgroundColor(item.name)
            }));

            filteredStatusDistribution = filteredStatusDistribution.map(item => ({
                ...item,
                color: getProjectStatusBackgroundColor(item.name)
            }));

            setDashboardData({
                projectStatus: filteredProjectStatus,
                projectProgress: filteredProjectProgress,
                projectTypes: filteredProjectTypes,
                budgetAllocation: filteredBudgetAllocation,
                statusDistribution: filteredStatusDistribution,
                wards: regionalData.wards,
                subCounties: regionalData.subCounties,
            });
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        loadTrendsData();
    }, [filters]); // Re-run effect when filters change

    const handleFilterChange = (filterName, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value,
        }));
    };

    const handleRefresh = () => {
        loadDashboardData();
    };

    const handleClearFilters = () => {
        setFilters({
            department: '',
            status: '',
            projectType: '',
            year: '',
            cidpPeriod: '',
            financialYear: '',
            startDate: '',
            endDate: '',
            projectStatus: '',
            section: '',
            county: DEFAULT_COUNTY.name,
            subCounty: DEFAULT_SUBCOUNTY.name,
            ward: ''
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDepartmentClick = (departmentData) => {
        setSelectedDepartment(departmentData);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDepartment(null);
    };

    const handleYearClick = (yearData) => {
        setSelectedYear(yearData);
        setYearModalOpen(true);
    };

    const handleCloseYearModal = () => {
        setYearModalOpen(false);
        setSelectedYear(null);
    };

    const handleSubcountyClick = (subcountyData) => {
        setSelectedSubcounty(subcountyData);
        setSubcountyModalOpen(true);
    };

    const handleCloseSubcountyModal = () => {
        setSubcountyModalOpen(false);
        setSelectedSubcounty(null);
    };

    const handleWardClick = (wardData) => {
        setSelectedWard(wardData);
        setWardModalOpen(true);
    };

    const handleCloseWardModal = () => {
        setWardModalOpen(false);
        setSelectedWard(null);
    };

    const renderNoDataCard = (title) => (
        <Box sx={{ 
            p: 4, 
            border: '2px dashed rgba(0,0,0,0.1)', 
            borderRadius: '16px', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05))',
                transform: 'translate(-50%, -50%)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(1)' },
                    '50%': { opacity: 0.1, transform: 'translate(-50%, -50%) scale(1.2)' }
                }
            }
        }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', position: 'relative', zIndex: 1 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7, position: 'relative', zIndex: 1 }}>
                No data available for the selected filters.
            </Typography>
        </Box>
    );

    // KPI Cards Component
    const KPICard = ({ title, value, icon, color, subtitle, progress }) => (
        <Card sx={{ 
            height: '110px',
            borderRadius: '12px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px) scale(1.02)',
                border: `1px solid ${color}20`
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: color,
                borderRadius: '12px 12px 0 0'
            }
        }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                        {title}
                    </Typography>
                    <Box sx={{ color: color, fontSize: '1.2rem' }}>
                        {icon}
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {subtitle}
                        </Typography>
                    )}
                    {progress !== undefined && (
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ 
                                mt: 1, 
                                height: 4, 
                                borderRadius: 2,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: color,
                                    borderRadius: 2
                                }
                            }} 
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    // Calculate KPIs from dashboard data
    const totalProjects = dashboardData.projectStatus.reduce((sum, item) => sum + item.value, 0);
    const completedProjects = dashboardData.projectStatus.find(item => item.name === 'Completed')?.value || 0;
    const inProgressProjects = dashboardData.projectStatus.find(item => item.name === 'In Progress')?.value || 0;
    const atRiskProjects = dashboardData.projectStatus.find(item => item.name === 'At Risk')?.value || 0;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const totalBudget = dashboardData.budgetAllocation.reduce((sum, item) => sum + item.value, 0);
    const budgetFormatted = totalBudget >= 1000000 ? `${(totalBudget / 1000000).toFixed(1)}M` : `${(totalBudget / 1000).toFixed(0)}K`;

    // Calculate financial summary from department data
    const financialSummary = calculateFinancialSummary(dashboardData.projectProgress);
    
    // Calculate ward-specific metrics (filtered by selected sub-county)
    const allWardData = dashboardData.wards || [];
    const wardData = allWardData.filter(ward => {
        // If no sub-county is selected, include all wards
        if (!filters.subCounty) return true;
        // Filter wards by selected sub-county
        return ward.subcountyName === filters.subCounty;
    });
    
    const totalWards = wardData.length;
    const totalWardProjects = wardData.reduce((sum, ward) => sum + (parseInt(ward.totalProjects) || 0), 0);
    const totalWardBudget = wardData.reduce((sum, ward) => sum + (parseFloat(ward.totalBudget) || 0), 0);
    const totalWardPaid = wardData.reduce((sum, ward) => sum + (parseFloat(ward.totalPaid) || 0), 0);
    const avgWardAbsorptionRate = totalWards > 0 ? wardData.reduce((sum, ward) => sum + (parseFloat(ward.absorptionRate) || 0), 0) / totalWards : 0;
    const topPerformingWard = wardData.reduce((max, ward) => 
        parseFloat(ward.absorptionRate) > parseFloat(max.absorptionRate) ? ward : max, 
        { absorptionRate: 0, wardName: 'N/A' }
    );

    // Calculate sub-county-specific metrics
    const allSubCountyData = dashboardData.subCounties || [];
    const totalSubCounties = allSubCountyData.length;
    const totalSubCountyProjects = allSubCountyData.reduce((sum, subCounty) => sum + (parseInt(subCounty.totalProjects) || 0), 0);
    const totalSubCountyBudget = allSubCountyData.reduce((sum, subCounty) => sum + (parseFloat(subCounty.totalBudget) || 0), 0);
    const totalSubCountyPaid = allSubCountyData.reduce((sum, subCounty) => sum + (parseFloat(subCounty.totalPaid) || 0), 0);
    const avgSubCountyAbsorptionRate = totalSubCounties > 0 ? allSubCountyData.reduce((sum, subCounty) => sum + (parseFloat(subCounty.absorptionRate) || 0), 0) / totalSubCounties : 0;
    const topPerformingSubCounty = allSubCountyData.reduce((max, subCounty) => 
        parseFloat(subCounty.absorptionRate) > parseFloat(max.absorptionRate) ? subCounty : max, 
        { absorptionRate: 0, subcountyName: 'N/A' }
    );
    
    // Debug logging to verify calculations
    console.log('Financial Summary Debug:', {
        departmentData: dashboardData.projectProgress,
        totalContracted: financialSummary.totalContracted,
        totalPaid: financialSummary.totalPaid,
        absorptionRate: financialSummary.absorptionRate
    });
    
    // Debug logging for regional data
    console.log('Regional Data Debug:', {
        subCounties: dashboardData.subCounties,
        subCountiesCount: dashboardData.subCounties?.length || 0,
        wards: dashboardData.wards,
        wardsCount: dashboardData.wards?.length || 0
    });
    
    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `KSh ${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `KSh ${(amount / 1000).toFixed(0)}K`;
        } else {
            return `KSh ${amount.toLocaleString()}`;
        }
    };

    // Additional metrics for last row
    const averageProgress = dashboardData.projectProgress.length > 0 
        ? Math.round(dashboardData.projectProgress.reduce((sum, dept) => {
            const progress = parseFloat(dept.percentCompleted) || 0;
            return sum + progress;
        }, 0) / dashboardData.projectProgress.length)
        : 0;
    
    // Debug logging for average progress calculation
    console.log('Average Progress Debug:', {
        projectProgressData: dashboardData.projectProgress,
        progressValues: dashboardData.projectProgress.map(dept => ({
            department: dept.department,
            percentCompleted: dept.percentCompleted,
            parsed: parseFloat(dept.percentCompleted) || 0
        })),
        averageProgress: averageProgress
    });
    const totalDepartments = dashboardData.projectProgress.length;
    const delayedProjects = dashboardData.projectStatus.find(item => item.name === 'Delayed')?.value || 0;
    const stalledProjects = dashboardData.projectStatus.find(item => item.name === 'Stalled')?.value || 0;
    const healthScore = totalProjects > 0 ? Math.round(((completedProjects + inProgressProjects) / totalProjects) * 100) : 0;

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 'calc(100vh - 100px)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated background elements */}
                <Box sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' }
                    }
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '10%',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1))',
                    animation: 'float 3s ease-in-out infinite 1.5s',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' }
                    }
                }} />
                
                <CircularProgress 
                    size={60} 
                    thickness={4} 
                    sx={{ 
                        color: 'primary.main', 
                        mb: 2,
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 }
                        }
                    }} 
                />
                <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                    mb: 1
                }}>
                    Loading dashboard...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                    Preparing your analytics
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 'calc(100vh - 100px)',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 3
            }}>
                <Alert 
                    severity="error" 
                    sx={{ 
                        maxWidth: '500px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(244, 67, 54, 0.15)',
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleRefresh}
                                sx={{ 
                                    borderColor: 'error.main',
                                    color: 'error.main',
                                    '&:hover': {
                                        backgroundColor: 'error.main',
                                        color: 'white'
                                    }
                                }}
                            >
                                Retry
                            </Button>
                        </Box>
                    }
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Dashboard Error
                    </Typography>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            maxWidth: '100%', 
            overflowX: 'hidden',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            {/* Header Section */}
            <Fade in timeout={800}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1.5,
                            letterSpacing: '0.3px'
                        }}
                    >
                Project Overview Dashboard
            </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        sx={{ 
                            fontWeight: 400,
                            opacity: 0.8,
                            letterSpacing: '0.2px'
                        }}
                    >
                        Comprehensive project analytics and insights
                    </Typography>
                </Box>
            </Fade>

            <Slide direction="up" in timeout={1000}>
                <Box>
                    <DashboardFilters 
                        filters={filters} 
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                    />
                </Box>
            </Slide>

            {/* Tabbed Dashboard Interface */}
            <Box sx={{ mt: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            minHeight: '56px',
                            color: 'text.secondary',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                transform: 'translateY(-1px)'
                            }
                        },
                        '& .Mui-selected': {
                            color: 'primary.main',
                            fontWeight: '700',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '3px',
                                backgroundColor: 'primary.main',
                                borderRadius: '2px 2px 0 0'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none'
                        }
                    }}
                >
                    <Tab 
                        label="Overview" 
                        icon={<Assessment sx={{ fontSize: '1.2rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '8px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Financial" 
                        icon={<AttachMoney sx={{ fontSize: '1.2rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '8px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Sub-County" 
                        icon={<Business sx={{ fontSize: '1.2rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '8px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Wards" 
                        icon={<TrendingUp sx={{ fontSize: '1.2rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '8px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Yearly Trends" 
                        icon={<ShowChart sx={{ fontSize: '1.2rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            px: 2,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '8px !important'
                            }
                        }}
                    />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ 
                    mt: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    borderTop: 'none',
                    overflow: 'hidden',
                    p: 3
                }}>
                    <>
                    {activeTab === 0 && (
                        <EnhancedOverviewTab 
                            dashboardData={dashboardData}
                            totalProjects={totalProjects}
                            completedProjects={completedProjects}
                            totalSubCounties={totalSubCounties}
                            totalSubCountyBudget={totalSubCountyBudget}
                            healthScore={healthScore}
                            formatCurrency={formatCurrency}
                        />
                    )}

                    {activeTab === 1 && (
                        <EnhancedYearlyTrendsTab 
                            dashboardData={dashboardData}
                            totalProjects={totalProjects}
                            completedProjects={completedProjects}
                            totalSubCounties={totalSubCounties}
                            totalSubCountyBudget={totalSubCountyBudget}
                            healthScore={healthScore}
                            formatCurrency={formatCurrency}
                        />
                    )}

                    {activeTab === 2 && (
                        <Grid container spacing={3}>
                            {/* Enhanced Analytics Overview */}
                            
                            {/* Project Status Summary */}
                            <Grid item xs={12} md={6}>
                                <Fade in timeout={1200}>
                                <Card sx={{ 
                                    height: '350px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'visible',
                                    '&:hover': {
                                        boxShadow: '0 12px 40px rgba(25, 118, 210, 0.15)',
                                        transform: 'translateY(-2px)',
                                        border: '1px solid rgba(25, 118, 210, 0.3)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)',
                                        borderRadius: '12px 12px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PieChart sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                    Project Status Overview
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                        <Box sx={{ 
                                            height: '320px', 
                                            minWidth: { xs: '280px', sm: '300px' },
                                            overflow: 'visible'
                                        }}>
                                        {dashboardData.projectStatus.length > 0 ? (
                                            <CircularChart
                                                title=""
                                                data={dashboardData.projectStatus}
                                                type="donut"
                                            />
                                        ) : (
                                            renderNoDataCard("Project Status")
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                            </Fade>
                        </Grid>

                        {/* Key Performance Indicators */}
                        <Grid item xs={12} md={6}>
                            <Fade in timeout={1400}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 1.2, 
                                    height: '370px',
                                    justifyContent: 'flex-start'
                                }}>
                                    <KPICard
                                        title="Total Departments"
                                        value={dashboardData.projectProgress.length}
                                        icon={<Business />}
                                        color="#1976d2"
                                        subtitle="Departments with active projects"
                                    />
                                    <KPICard
                                        title="Budget Utilization"
                                        value={`${financialSummary.absorptionRate.toFixed(2)}%`}
                                        icon={<AttachMoney />}
                                        color="#4caf50"
                                        subtitle="Total budget utilized"
                                        progress={financialSummary.absorptionRate}
                                    />
                                    <KPICard
                                        title="Avg Projects/Dept"
                                        value={Math.round(totalProjects / dashboardData.projectProgress.length)}
                                        icon={<TrendingUp />}
                                        color="#ff9800"
                                        subtitle="Projects per department"
                                    />
                                </Box>
                            </Fade>
                        </Grid>

                        {/* Project Performance Metrics */}
                        <Grid item xs={12} md={6}>
                            <Fade in timeout={1600}>
                                <Card sx={{ 
                                    height: '350px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)'
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #2196f3, #42a5f5, #64b5f6)',
                                        borderRadius: '12px 12px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Speed sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                    Performance Metrics
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                        <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {/* Completion Rate */}
                                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px' }}>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 0.5 }}>
                                                    {completionRate}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                    Completion Rate
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={completionRate} 
                                                    sx={{ 
                                                        height: 4, 
                                                        borderRadius: 2,
                                                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#4caf50',
                                                            borderRadius: 2
                                                        }
                                                    }} 
                                                />
                                            </Box>

                                            {/* Health Score */}
                                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: '8px' }}>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 0.5 }}>
                                                    {healthScore}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                    Health Score
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={healthScore} 
                                                    sx={{ 
                                                        height: 4, 
                                                        borderRadius: 2,
                                                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#2196f3',
                                                            borderRadius: 2
                                                        }
                                                    }} 
                                                />
                                            </Box>

                                            {/* Average Progress */}
                                            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px' }}>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 0.5 }}>
                                                    {averageProgress}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                    Average Progress
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={averageProgress} 
                                                    sx={{ 
                                                        height: 4, 
                                                        borderRadius: 2,
                                                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#ff9800',
                                                            borderRadius: 2
                                                        }
                                                    }} 
                                                />
                                            </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                            </Fade>
                        </Grid>

                        {/* Issues Summary */}
                        <Grid item xs={12} md={6}>
                            <Fade in timeout={1800}>
                                <Card sx={{ 
                                    height: '350px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255, 152, 0, 0.2)'
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ffcc80)',
                                        borderRadius: '12px 12px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TrendingDown sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                    Issues Summary
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                        <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: '8px' }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336', mb: 0.5 }}>
                                                        {delayedProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Delayed
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: '8px' }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 0.5 }}>
                                                        {stalledProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Stalled
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(233, 30, 99, 0.1)', borderRadius: '8px' }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e91e63', mb: 0.5 }}>
                                                        {atRiskProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        At Risk
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                        
                        {/* Overview Detail Table */}
                        <Grid item xs={12}>
                            <Box sx={{ mt: 3 }}>
                                <ProjectDetailTable
                                    data={transformOverviewData(dashboardData.projectProgress.map(dept => ({ 
                                        id: dept.departmentId || dept.department,
                                        department: dept.departmentName || dept.department,
                                        departmentAlias: dept.departmentAlias || dept.department,
                                        percentCompleted: dept.percentCompleted || 0,
                                        healthScore: dept.healthScore || 0,
                                        numProjects: dept.numProjects || 0,
                                        allocatedBudget: dept.allocatedBudget || 0,
                                        amountPaid: dept.amountPaid || 0
                                    })))}
                                    columns={overviewTableColumns}
                                    title="Department Overview Details"
                                    onRowClick={(row) => handleDepartmentClick(row)}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    )}

                    {activeTab === 1 && (
                        <Grid container spacing={2}>
                            {/* Financial Tab Content */}
                            
                            {/* Financial Summary Cards */}
                            <Grid item xs={12} md={4}>
                                <Fade in timeout={1200}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: 1.5, 
                                        height: '400px',
                                        justifyContent: 'space-between'
                                    }}>
                                        <KPICard
                                            title="Total Contracted"
                                            value={formatCurrency(financialSummary.totalContracted)}
                                            icon={<Business />}
                                            color="#1976d2"
                                            subtitle="Contract sum across all departments"
                                        />
                                        <KPICard
                                            title="Total Paid"
                                            value={formatCurrency(financialSummary.totalPaid)}
                                            icon={<CheckCircle />}
                                            color="#4caf50"
                                            subtitle="Amount disbursed to date"
                                        />
                                        <KPICard
                                            title="Absorption Rate"
                                            value={`${financialSummary.absorptionRate.toFixed(2)}%`}
                                            icon={<TrendingUp />}
                                            color="#ff9800"
                                            subtitle="Paid vs contracted ratio"
                                            progress={financialSummary.absorptionRate}
                                        />
                                    </Box>
                                </Fade>
                            </Grid>

                            {/* Budget Allocation by Status */}
                            <Grid item xs={12} md={8}>
                                <Fade in timeout={1600}>
                                    <Card sx={{ 
                                        height: '380px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 12px 40px rgba(255, 152, 0, 0.15)',
                                            border: '1px solid rgba(255, 152, 0, 0.4)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ffcc80)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <BarChart sx={{ color: 'warning.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Budget Allocation by Status
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '300px', minWidth: '500px' }}>
                                                {dashboardData.budgetAllocation.length > 0 ? (
                                                    <BudgetAllocationChart
                                                        title=""
                                                        data={dashboardData.budgetAllocation}
                                                    />
                                                ) : (
                                                    renderNoDataCard("Budget Allocation")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Fade in timeout={1800}>
                                    <Card sx={{ 
                                        height: '380px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 12px 40px rgba(76, 175, 80, 0.15)',
                                            border: '1px solid rgba(76, 175, 80, 0.4)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #f44336, #e57373, #ef5350)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AttachMoney sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Budget Performance by Department
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '300px', minWidth: '300px' }}>
                                                {dashboardData.projectProgress.length > 0 ? (
                                                    <BudgetAllocationChart
                                                        title=""
                                                        data={dashboardData.projectProgress.map(dept => ({
                                                            name: dept.department,
                                                            contracted: dept.contractSum || 0,
                                                            paid: dept.amountPaid || 0,
                                                            color: '#4caf50',
                                                            count: dept.numProjects || 0
                                                        }))}
                                                    />
                                                ) : (
                                                    renderNoDataCard("Budget Performance")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                            
                            {/* Financial Detail Table */}
                            <Grid item xs={12}>
                                <Box sx={{ mt: 3 }}>
                                    <ProjectDetailTable
                                        data={dashboardData.projectProgress.map((dept, index) => ({ 
                                            id: dept.departmentId || dept.department || `dept-${index}`,
                                            rowNumber: index + 1,
                                            department: dept.departmentName || dept.department,
                                            departmentAlias: dept.departmentAlias || dept.department,
                                            allocatedBudget: parseFloat(dept.allocatedBudget) || 0,
                                            contractSum: parseFloat(dept.contractSum) || 0,
                                            amountPaid: parseFloat(dept.amountPaid) || 0,
                                            absorptionRate: parseFloat(dept.percentAbsorptionRate) || 0,
                                            remainingBudget: (parseFloat(dept.allocatedBudget) || 0) - (parseFloat(dept.amountPaid) || 0)
                                        }))}
                                        columns={financialTableColumns}
                                        title="Financial Details by Department"
                                        onRowClick={(row) => handleDepartmentClick(row)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 2 && (
                        <Grid container spacing={2}>
                            {/* Sub-County Tab Content */}
                            
                            {/* Project Progress (Line/Bar Combo Chart) */}
                            <Grid item xs={12} md={9}>
                                <Fade in timeout={2000}>
                                    <Card sx={{ 
                                        height: '460px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(0, 150, 136, 0.2)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #009688, #26a69a, #4db6ac)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Timeline sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Budget vs Paid by Sub-County
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '380px', minWidth: '700px' }}>
                                                {dashboardData.subCounties && dashboardData.subCounties.length > 0 ? (
                                                    <LineBarComboChart
                                                        title=""
                                                        data={dashboardData.subCounties.map(subCounty => ({
                                                            subCounty: subCounty.subcountyName || 'N/A',
                                                            totalBudget: parseFloat(subCounty.totalBudget) || 0,
                                                            totalPaid: parseFloat(subCounty.totalPaid) || 0,
                                                            absorptionRate: parseFloat(subCounty.absorptionRate) || 0
                                                        }))}
                                                        barKeys={['totalBudget', 'totalPaid']}
                                                        xAxisKey="subCounty"
                                                        yAxisLabelLeft="Budget Amount (KSh)"
                                                    />
                                                ) : (
                                                    renderNoDataCard("Sub-County Budget Analysis")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Fade in timeout={2200}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: 1.5, 
                                        height: '400px',
                                        justifyContent: 'space-between'
                                    }}>
                                        {/* Budget Efficiency */}
                                        <Card sx={{ 
                                            height: '120px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                                borderRadius: '12px 12px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Sub-County Budget Efficiency
                                                    </Typography>
                                                    <AttachMoney sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        {avgSubCountyAbsorptionRate.toFixed(2)}%
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={avgSubCountyAbsorptionRate} 
                                                        sx={{ 
                                                            height: 6, 
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: avgSubCountyAbsorptionRate >= 80 ? '#4caf50' : avgSubCountyAbsorptionRate >= 60 ? '#ff9800' : '#f44336',
                                                                borderRadius: 3
                                                            }
                                                        }} 
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                                                        {avgSubCountyAbsorptionRate >= 80 ? 'Excellent' : avgSubCountyAbsorptionRate >= 60 ? 'Good' : 'Needs Attention'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Project Timeline Metrics */}
                            <Card sx={{ 
                                            height: '120px',
                                borderRadius: '12px',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                    borderRadius: '12px 12px 0 0'
                                }
                            }}>
                                <CardContent sx={{ p: 2, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Sub-County Performance Metrics
                                        </Typography>
                                                    <Schedule sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.1rem' }}>
                                                            {totalSubCounties}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Total Sub-Counties
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                            {totalSubCountyProjects}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Sub-County Projects
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Issues Summary */}
                            <Card sx={{ 
                                            height: '120px',
                                borderRadius: '12px',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255, 152, 0, 0.2)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ffcc80)',
                                    borderRadius: '12px 12px 0 0'
                                }
                            }}>
                                <CardContent sx={{ p: 2, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                            Sub-County Budget Summary
                                        </Typography>
                                        <TrendingDown sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                                    </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}>
                                                {formatCurrency(totalSubCountyBudget)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Total Budget
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.1rem' }}>
                                                {formatCurrency(totalSubCountyPaid)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Total Paid
                                            </Typography>
                                        </Box>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                            {topPerformingSubCounty.subcountyName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Top Sub-County
                                                        </Typography>
                                                    </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                </Grid>
                
                {/* Sub-County Detail Table */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 3 }}>
                        <ProjectDetailTable
                            data={dashboardData.subCounties?.map((subCounty, index) => ({
                                id: subCounty.subcountyId || `subcounty-${index}`,
                                rowNumber: index + 1,
                                subcountyName: subCounty.subcountyName || 'N/A',
                                subcounty: subCounty.subcountyName || 'N/A',
                                subcountyId: subCounty.subcountyId || `subcounty-${index}`,
                                totalWards: parseInt(subCounty.totalWards) || 0,
                                totalProjects: parseInt(subCounty.totalProjects) || 0,
                                totalBudget: parseFloat(subCounty.totalBudget) || 0,
                                totalPaid: parseFloat(subCounty.totalPaid) || 0,
                                absorptionRate: parseFloat(subCounty.absorptionRate) || 0,
                                avgProgress: parseFloat(subCounty.avgProgress) || 0
                            })) || []}
                            columns={[
                                { id: 'rowNumber', label: '#', minWidth: 60, type: 'number' },
                                { id: 'subcountyName', label: 'Sub-County Name', minWidth: 200, type: 'text' },
                                { id: 'totalWards', label: 'Wards', minWidth: 100, type: 'number' },
                                { id: 'totalProjects', label: 'Projects', minWidth: 100, type: 'number' },
                                { id: 'totalBudget', label: 'Budget (KSh)', minWidth: 150, type: 'currency' },
                                { id: 'totalPaid', label: 'Paid (KSh)', minWidth: 150, type: 'currency' },
                                { id: 'absorptionRate', label: 'Absorption %', minWidth: 120, type: 'percentage' },
                                { id: 'avgProgress', label: 'Progress %', minWidth: 120, type: 'percentage' }
                            ]}
                            title="Sub-County Analytics Details"
                            onRowClick={(row) => handleSubcountyClick(row)}
                        />
                    </Box>
                </Grid>
            </Grid>
                    )}

                    {activeTab === 3 && (
                        <Grid container spacing={2}>
                            {/* Wards Tab Content */}
                            
                            {/* Project Progress (Line/Bar Combo Chart) */}
                            <Grid item xs={12} md={9}>
                                <Fade in timeout={2000}>
                                    <Card sx={{ 
                                        height: '400px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(0, 150, 136, 0.2)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #009688, #26a69a, #4db6ac)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Timeline sx={{ color: 'info.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Budget vs Paid by Ward - {filters.subCounty || 'All Sub-Counties'}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '320px', minWidth: '700px' }}>
                                                {dashboardData.wards && dashboardData.wards.length > 0 ? (
                                                    <LineBarComboChart
                                                        title=""
                                                        data={dashboardData.wards
                                                            .filter(ward => {
                                                                // If no sub-county is selected, show all wards
                                                                if (!filters.subCounty) return true;
                                                                // Filter wards by selected sub-county
                                                                return ward.subcountyName === filters.subCounty;
                                                            })
                                                            .map(ward => ({
                                                                ward: ward.wardName || 'N/A',
                                                                totalBudget: parseFloat(ward.totalBudget) || 0,
                                                                totalPaid: parseFloat(ward.totalPaid) || 0,
                                                                absorptionRate: parseFloat(ward.absorptionRate) || 0
                                                            }))}
                                                        barKeys={['totalBudget', 'totalPaid']}
                                                        xAxisKey="ward"
                                                        yAxisLabelLeft="Budget Amount (KSh)"
                                                    />
                                                ) : (
                                                    renderNoDataCard("Ward Budget Analysis")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Fade in timeout={2200}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: 1.5, 
                                        height: '400px',
                                        justifyContent: 'space-between'
                                    }}>
                                        {/* Budget Efficiency */}
                                        <Card sx={{ 
                                            height: '120px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                                borderRadius: '12px 12px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Ward Budget Efficiency
                                                    </Typography>
                                                    <AttachMoney sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        {avgWardAbsorptionRate.toFixed(2)}%
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={avgWardAbsorptionRate} 
                                                        sx={{ 
                                                            height: 6, 
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: avgWardAbsorptionRate >= 80 ? '#4caf50' : avgWardAbsorptionRate >= 60 ? '#ff9800' : '#f44336',
                                                                borderRadius: 3
                                                            }
                                                        }} 
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                                                        {avgWardAbsorptionRate >= 80 ? 'Excellent' : avgWardAbsorptionRate >= 60 ? 'Good' : 'Needs Attention'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Project Timeline Metrics */}
                            <Card sx={{ 
                                            height: '120px',
                                borderRadius: '12px',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                    borderRadius: '12px 12px 0 0'
                                }
                            }}>
                                <CardContent sx={{ p: 2, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Ward Performance Metrics
                                        </Typography>
                                                    <Schedule sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.1rem' }}>
                                                            {totalWards}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Total Wards
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                            {totalWardProjects}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Ward Projects
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Issues Summary */}
                            <Card sx={{ 
                                            height: '120px',
                                borderRadius: '12px',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                    border: '1px solid rgba(255, 152, 0, 0.2)'
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ffcc80)',
                                    borderRadius: '12px 12px 0 0'
                                }
                            }}>
                                <CardContent sx={{ p: 2, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                            Ward Budget Summary
                                        </Typography>
                                        <TrendingDown sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                                    </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}>
                                                {formatCurrency(totalWardBudget)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Total Budget
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.1rem' }}>
                                                {formatCurrency(totalWardPaid)}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Total Paid
                                            </Typography>
                                        </Box>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                            {topPerformingWard.wardName}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Top Ward
                                                        </Typography>
                                                    </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                </Grid>
                
                {/* Ward Detail Table */}
                <Grid item xs={12}>
                    <Box sx={{ mt: 3 }}>
                        <ProjectDetailTable
                            data={dashboardData.wards
                                ?.filter(ward => {
                                    // If no sub-county is selected, include all wards
                                    if (!filters.subCounty) return true;
                                    // Filter wards by selected sub-county
                                    return ward.subcountyName === filters.subCounty;
                                })
                                ?.map((ward, index) => ({
                                    id: ward.wardId || `ward-${index}`,
                                    rowNumber: index + 1,
                                    wardName: ward.wardName || 'N/A',
                                    subcountyName: ward.subcountyName || 'N/A',
                                    totalProjects: parseInt(ward.totalProjects) || 0,
                                    totalBudget: parseFloat(ward.totalBudget) || 0,
                                    totalPaid: parseFloat(ward.totalPaid) || 0,
                                    absorptionRate: parseFloat(ward.absorptionRate) || 0,
                                    avgProgress: parseFloat(ward.avgProgress) || 0
                                })) || []}
                            columns={[
                                { id: 'rowNumber', label: '#', minWidth: 60, type: 'number' },
                                { id: 'wardName', label: 'Ward Name', minWidth: 200, type: 'text' },
                                { id: 'subcountyName', label: 'Sub-County', minWidth: 150, type: 'text' },
                                { id: 'totalProjects', label: 'Projects', minWidth: 100, type: 'number' },
                                { id: 'totalBudget', label: 'Budget (KSh)', minWidth: 150, type: 'currency' },
                                { id: 'totalPaid', label: 'Paid (KSh)', minWidth: 150, type: 'currency' },
                                { id: 'absorptionRate', label: 'Absorption %', minWidth: 120, type: 'percentage' },
                                { id: 'avgProgress', label: 'Progress %', minWidth: 120, type: 'percentage' }
                            ]}
                            title="Ward Analytics Details"
                            onRowClick={(row) => handleWardClick(row)}
                        />
                    </Box>
                </Grid>
            </Grid>
                    )}

                    {activeTab === 4 && (
                        <Grid container spacing={2}>
                            {/* Annual Trends Tab Content */}
                            
                            {/* Project Performance Overview */}
                            <Grid item xs={12}>
                                <Fade in timeout={2000}>
                                    <Card sx={{ 
                                        height: '500px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(25, 118, 210, 0.2)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ShowChart sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Project Performance Trends ({trendsData.yearRange.start}-{trendsData.yearRange.end})
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '420px', minWidth: '900px' }}>
                                                {trendsData.projectPerformance.length > 0 ? (
                                                    <LineBarComboChart
                                                        title=""
                                                        data={trendsData.projectPerformance}
                                                        barKeys={['totalProjects', 'completedProjects']}
                                                        lineKeys={['completionRate']}
                                                        xAxisKey="year"
                                                        yAxisLabelLeft="Project Count"
                                                        yAxisLabelRight="Completion Rate (%)"
                                                    />
                                                ) : (
                                                    renderNoDataCard("Project Performance Trends")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>

                            {/* Financial Performance Trends */}
                            <Grid item xs={12} md={8}>
                                <Fade in timeout={2200}>
                                    <Card sx={{ 
                                        height: '500px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(76, 175, 80, 0.2)'
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '3px',
                                            background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                            borderRadius: '12px 12px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AttachMoney sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.95rem' }}>
                                                        Financial Performance Trends
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '420px', minWidth: '700px' }}>
                                                {trendsData.financialTrends.length > 0 ? (
                                                    <LineBarComboChart
                                                        title=""
                                                        data={trendsData.financialTrends}
                                                        barKeys={['totalBudget', 'totalExpenditure']}
                                                        lineKeys={['absorptionRate']}
                                                        xAxisKey="year"
                                                        yAxisLabelLeft="Budget Amount (KSh)"
                                                        yAxisLabelRight="Absorption Rate (%)"
                                                    />
                                                ) : (
                                                    renderNoDataCard("Financial Trends")
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>

                            {/* Department Performance Summary */}
                            <Grid item xs={12} md={4}>
                                <Fade in timeout={2400}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: 1.5, 
                                        height: '400px',
                                        justifyContent: 'space-between'
                                    }}>
                                        {/* Total Projects Over Time */}
                                        <Card sx={{ 
                                            height: '120px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(25, 118, 210, 0.2)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #1976d2, #42a5f5, #64b5f6)',
                                                borderRadius: '12px 12px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Total Projects
                                                    </Typography>
                                                    <Business sx={{ color: '#1976d2', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        {trendsData.projectPerformance.reduce((sum, item) => sum + (item.totalProjects || 0), 0)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Average Completion Rate */}
                                        <Card sx={{ 
                                            height: '120px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(76, 175, 80, 0.2)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
                                                borderRadius: '12px 12px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Avg Completion Rate
                                                    </Typography>
                                                    <CheckCircle sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        {trendsData.projectPerformance.length > 0 ? 
                                                            (trendsData.projectPerformance.reduce((sum, item) => sum + parseFloat(item.completionRate || 0), 0) / trendsData.projectPerformance.length).toFixed(1) + '%' 
                                                            : '0%'
                                                        }
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Total Budget Over Time */}
                                        <Card sx={{ 
                                            height: '120px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                                border: '1px solid rgba(255, 152, 0, 0.2)'
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'linear-gradient(90deg, #ff9800, #ffb74d, #ffcc80)',
                                                borderRadius: '12px 12px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>
                                                        Total Budget
                                                    </Typography>
                                                    <AttachMoney sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        KSh {(trendsData.financialTrends.reduce((sum, item) => sum + (item.totalBudget || 0), 0) / 1000000).toFixed(1)}M
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Fade>
                            </Grid>

                            {/* Yearly Trends Detail Report */}
                            <Grid item xs={12}>
                                <Box sx={{ mt: 3 }}>
                                    <ProjectDetailTable
                                        data={trendsData.projectPerformance.map((year, index) => ({
                                            id: year.year,
                                            rowNumber: index + 1,
                                            year: year.year,
                                            totalProjects: year.totalProjects,
                                            completedProjects: year.completedProjects,
                                            completionRate: year.completionRate + '%',
                                            avgDuration: Math.round(year.avgDuration) + ' days',
                                            growthRate: year.growthRate + '%',
                                            totalBudget: 'KSh ' + (trendsData.financialTrends[index]?.totalBudget ? 
                                                (parseFloat(trendsData.financialTrends[index].totalBudget) / 1000000).toFixed(1) + 'M' : '0M'),
                                            absorptionRate: trendsData.financialTrends[index]?.absorptionRate ? 
                                                parseFloat(trendsData.financialTrends[index].absorptionRate).toFixed(1) + '%' : '0%'
                                        }))}
                                        columns={[
                                            {
                                                id: 'rowNumber',
                                                label: '#',
                                                minWidth: 60,
                                                type: 'number'
                                            },
                                            {
                                                id: 'year',
                                                label: 'Year',
                                                minWidth: 80,
                                                type: 'text'
                                            },
                                            {
                                                id: 'totalProjects',
                                                label: 'Total Projects',
                                                minWidth: 120,
                                                type: 'number'
                                            },
                                            {
                                                id: 'completedProjects',
                                                label: 'Completed',
                                                minWidth: 100,
                                                type: 'number'
                                            },
                                            {
                                                id: 'completionRate',
                                                label: 'Completion Rate',
                                                minWidth: 130,
                                                type: 'text'
                                            },
                                            {
                                                id: 'avgDuration',
                                                label: 'Avg Duration',
                                                minWidth: 120,
                                                type: 'text'
                                            },
                                            {
                                                id: 'growthRate',
                                                label: 'Growth Rate',
                                                minWidth: 100,
                                                type: 'text'
                                            },
                                            {
                                                id: 'totalBudget',
                                                label: 'Total Budget',
                                                minWidth: 140,
                                                type: 'text'
                                            },
                                            {
                                                id: 'absorptionRate',
                                                label: 'Absorption Rate',
                                                minWidth: 130,
                                                type: 'text'
                                            }
                                        ]}
                                        title="Yearly Performance Details"
                                        onRowClick={(row) => handleYearClick(row)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                    </>
                </Box>
            </Box>
            
            {/* Footer with additional info */}
            <Fade in timeout={2200}>
                <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
                        Last updated: {new Date().toLocaleString()}
                    </Typography>
                </Box>
            </Fade>
            
            {/* Department Projects Modal */}
            <DepartmentProjectsModal
                open={modalOpen}
                onClose={handleCloseModal}
                departmentData={selectedDepartment}
            />

            {/* Year Projects Modal */}
            <YearProjectsModal
                open={yearModalOpen}
                onClose={handleCloseYearModal}
                yearData={selectedYear}
            />

            {/* SubCounty Projects Modal */}
            <SubCountyProjectsModal
                open={subcountyModalOpen}
                onClose={handleCloseSubcountyModal}
                subCounty={selectedSubcounty}
            />

            {/* Ward Projects Modal */}
            <WardProjectsModal
                open={wardModalOpen}
                onClose={handleCloseWardModal}
                wardData={selectedWard}
            />
        </Box>
    );
};

export default RegionalDashboard;