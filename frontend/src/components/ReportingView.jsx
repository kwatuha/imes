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
    Button,
    IconButton,
    Tooltip,
    Stack
} from '@mui/material';
import { tokens } from '../pages/dashboard/theme';
import { TrendingUp, Assessment, PieChart, BarChart, Timeline, Business, AttachMoney, CheckCircle, Warning, Speed, TrendingDown, Schedule, FilterList, ShowChart, Analytics, GetApp, PictureAsPdf, Print, Refresh, FileDownload } from '@mui/icons-material';

// Import your chart components and new filter component
import CircularChart from './charts/CircularChart';
import LineBarComboChart from './charts/LineBarComboChart';
import BudgetAllocationChart from './charts/BudgetAllocationChart';
import ProjectStatusDistributionChart from './charts/ProjectStatusDistributionChart';
import DashboardFilters from './DashboardFilters';
import { getProjectStatusBackgroundColor } from '../utils/projectStatusColors';
import { groupStatusesByNormalized, normalizeProjectStatus } from '../utils/projectStatusNormalizer';
import projectService from '../api/projectService';
import reportsService from '../api/reportsService';
import ProjectDetailTable from './tables/ProjectDetailTable';
import DepartmentProjectsModal from './modals/DepartmentProjectsModal';
import YearProjectsModal from './modals/YearProjectsModal';
import { 
    overviewTableColumns, 
    financialTableColumns, 
    analyticsTableColumns,
    transformOverviewData,
    transformFinancialData,
    transformAnalyticsData
} from './tables/TableConfigs';

const ReportingView = () => {
    const theme = useTheme();

    const [dashboardData, setDashboardData] = useState({
        projectStatus: [],
        projectProgress: [],
        projectTypes: [],
        budgetAllocation: [],
        statusDistribution: []
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
        subCounty: '',
        ward: '',
        globalSearch: ''
    });
    const [activeTab, setActiveTab] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [yearModalOpen, setYearModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    // API Integration Functions
    const fetchProjectStatusData = async (filters) => {
        try {
            const response = await projectService.analytics.getProjectStatusCounts();
            console.log('ReportingView - Raw status data from API:', response);
            // Group statuses by normalized categories
            const grouped = groupStatusesByNormalized(response, 'status', 'count');
            console.log('ReportingView - Normalized grouped status data:', grouped);
            const result = grouped.map(item => ({
                name: item.name,
                value: item.value,
                color: getProjectStatusBackgroundColor(item.name)
            }));
            console.log('ReportingView - Final status data for chart:', result);
            return result;
        } catch (error) {
            console.error('Error fetching project status data:', error);
            return [];
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
                departmentAlias: dept.departmentAlias, // Keep alias for filtering
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
            // Group statuses by normalized categories
            const grouped = groupStatusesByNormalized(response, 'name', 'value');
            return grouped.map(item => ({
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
                statusDistributionData
            ] = await Promise.all([
                fetchProjectStatusData(filters),
                fetchProjectTypesData(filters),
                fetchBudgetAllocationData(filters),
                fetchProjectProgressData(filters),
                fetchStatusDistributionData(filters)
            ]);

            // Apply client-side filtering if needed
            let filteredProjectStatus = filters.projectStatus || filters.status
                ? projectStatusData.filter(item => {
                    if (filters.projectStatus) return item.name === filters.projectStatus;
                    if (filters.status) return item.name === filters.status;
                    return true;
                })
                : projectStatusData;
            
            // Filter by department - check both department (alias) and departmentName (full name)
            let filteredProjectProgress = filters.department 
                ? projectProgressData.filter(item => 
                    item.department === filters.department || 
                    item.departmentName === filters.department ||
                    item.departmentAlias === filters.department
                ) 
                : projectProgressData;
            
            // Apply global search filter if provided
            // Check if search term matches any normalized status
            const normalizedStatuses = ['Completed', 'Ongoing', 'Not started', 'Stalled', 'Under Procurement', 'Suspended', 'Other'];
            let detectedStatus = null;
            if (filters.globalSearch && !filters.projectStatus && !filters.status) {
                // Only detect status from global search if no explicit status filter is set
                const searchTerm = filters.globalSearch.toLowerCase().trim();
                
                // Check if search term matches any normalized status (case-insensitive)
                for (const status of normalizedStatuses) {
                    if (status.toLowerCase() === searchTerm || 
                        status.toLowerCase().includes(searchTerm) ||
                        searchTerm.includes(status.toLowerCase())) {
                        detectedStatus = status;
                        break;
                    }
                }
            }
            
            // Apply global search to department data
            if (filters.globalSearch) {
                const searchTerm = filters.globalSearch.toLowerCase().trim();
                filteredProjectProgress = filteredProjectProgress.filter(item => {
                    const departmentMatch = (item.department || '').toLowerCase().includes(searchTerm) ||
                                          (item.departmentName || '').toLowerCase().includes(searchTerm) ||
                                          (item.departmentAlias || '').toLowerCase().includes(searchTerm);
                    const projectCountMatch = (item.numProjects || 0).toString().includes(searchTerm);
                    return departmentMatch || projectCountMatch;
                });
            }
            
            console.log('ReportingView - Department filter debug:', {
                filterValue: filters.department,
                globalSearch: filters.globalSearch,
                detectedStatus: detectedStatus,
                totalData: projectProgressData.length,
                filteredData: filteredProjectProgress.length,
                availableDepartments: projectProgressData.map(d => ({ 
                    department: d.department, 
                    departmentName: d.departmentName,
                    departmentAlias: d.departmentAlias 
                }))
            });
            
            let filteredProjectTypes = filters.projectType 
                ? projectTypesData.filter(item => item.name === filters.projectType) 
                : projectTypesData;
            
            // Apply status filter (explicit filter takes precedence over global search detected status)
            const statusFilterValue = filters.projectStatus || filters.status || detectedStatus;
            let filteredBudgetAllocation = statusFilterValue
                ? budgetAllocationData.filter(item => item.name === statusFilterValue)
                : budgetAllocationData;
            
            let filteredStatusDistribution = statusFilterValue
                ? statusDistributionData.filter(item => item.name === statusFilterValue)
                : statusDistributionData;
            
            // Apply status filter to project status data (explicit filter takes precedence)
            if (statusFilterValue) {
                filteredProjectStatus = filteredProjectStatus.filter(item => item.name === statusFilterValue);
            }

            // Ensure all data has correct colors and verify normalization
            filteredProjectStatus = filteredProjectStatus.map(item => {
                // Double-check that status is normalized (should only be one of the 7 categories)
                const validStatuses = ['Completed', 'Ongoing', 'Not started', 'Stalled', 'Under Procurement', 'Suspended', 'Other'];
                const isNormalized = validStatuses.includes(item.name);
                if (!isNormalized) {
                    console.warn(`ReportingView - Status "${item.name}" is not normalized! Normalizing now...`);
                    const normalized = normalizeProjectStatus(item.name);
                    console.log(`ReportingView - Normalized "${item.name}" to "${normalized}"`);
                    return {
                        ...item,
                        name: normalized,
                        color: getProjectStatusBackgroundColor(normalized)
                    };
                }
                return {
                    ...item,
                    color: getProjectStatusBackgroundColor(item.name)
                };
            });
            
            // Final verification: group again to ensure no duplicates
            const finalGrouped = groupStatusesByNormalized(
                filteredProjectStatus.map(item => ({ status: item.name, count: item.value })),
                'status',
                'count'
            );
            filteredProjectStatus = finalGrouped.map(item => ({
                name: item.name,
                value: item.value,
                color: getProjectStatusBackgroundColor(item.name)
            }));
            console.log('ReportingView - Final verified normalized status data:', filteredProjectStatus);

            // Ensure budget allocation data is normalized and has correct colors
            filteredBudgetAllocation = filteredBudgetAllocation.map(item => {
                // Double-check that status is normalized (should only be one of the 7 categories)
                const validStatuses = ['Completed', 'Ongoing', 'Not started', 'Stalled', 'Under Procurement', 'Suspended', 'Other'];
                const isNormalized = validStatuses.includes(item.name);
                if (!isNormalized) {
                    console.warn(`ReportingView - Budget allocation status "${item.name}" is not normalized! Normalizing now...`);
                    const normalized = normalizeProjectStatus(item.name);
                    console.log(`ReportingView - Normalized "${item.name}" to "${normalized}"`);
                    return {
                        ...item,
                        name: normalized,
                        color: getProjectStatusBackgroundColor(normalized)
                    };
                }
                return {
                    ...item,
                    color: getProjectStatusBackgroundColor(item.name)
                };
            });
            
            // Final verification: group again to ensure no duplicates
            const budgetGrouped = {};
            filteredBudgetAllocation.forEach(item => {
                if (!budgetGrouped[item.name]) {
                    budgetGrouped[item.name] = {
                        name: item.name,
                        contracted: 0,
                        paid: 0,
                        count: 0,
                        color: item.color
                    };
                }
                budgetGrouped[item.name].contracted += item.contracted || 0;
                budgetGrouped[item.name].paid += item.paid || 0;
                budgetGrouped[item.name].count += item.count || 0;
            });
            filteredBudgetAllocation = Object.values(budgetGrouped);
            console.log('ReportingView - Final verified normalized budget allocation data:', filteredBudgetAllocation);

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
            subCounty: '',
            ward: '',
            globalSearch: ''
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

    // Export functions
    const getCurrentTableData = () => {
        if (activeTab === 0) {
            return transformOverviewData(dashboardData.projectProgress.map(dept => ({ 
                id: dept.departmentId || dept.department,
                department: dept.departmentName || dept.department,
                departmentAlias: dept.departmentAlias || dept.department,
                percentCompleted: Math.round((parseFloat(dept.percentCompleted) || 0) * 100) / 100,
                healthScore: dept.healthScore || 0,
                numProjects: dept.numProjects || 0,
                allocatedBudget: dept.allocatedBudget || 0,
                amountPaid: dept.amountPaid || 0
            })));
        } else if (activeTab === 1) {
            return dashboardData.projectProgress.map((dept, index) => ({ 
                id: dept.departmentId || dept.department || `dept-${index}`,
                rowNumber: index + 1,
                department: dept.departmentName || dept.department,
                departmentAlias: dept.departmentAlias || dept.department,
                allocatedBudget: parseFloat(dept.allocatedBudget) || 0,
                contractSum: parseFloat(dept.contractSum) || 0,
                amountPaid: parseFloat(dept.amountPaid) || 0,
                absorptionRate: Math.round((parseFloat(dept.percentAbsorptionRate) || 0) * 100) / 100,
                remainingBudget: (parseFloat(dept.allocatedBudget) || 0) - (parseFloat(dept.amountPaid) || 0)
            }));
        } else if (activeTab === 2) {
            return transformAnalyticsData(dashboardData.projectProgress);
        } else if (activeTab === 3) {
            return trendsData.projectPerformance.map((year, index) => ({
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
            }));
        }
        return [];
    };

    const getCurrentTableColumns = () => {
        if (activeTab === 0) return overviewTableColumns;
        if (activeTab === 1) return financialTableColumns;
        if (activeTab === 2) return analyticsTableColumns;
        if (activeTab === 3) return [
            { id: 'rowNumber', label: '#' },
            { id: 'year', label: 'Year' },
            { id: 'totalProjects', label: 'Total Projects' },
            { id: 'completedProjects', label: 'Completed' },
            { id: 'completionRate', label: 'Completion Rate' },
            { id: 'avgDuration', label: 'Avg Duration' },
            { id: 'growthRate', label: 'Growth Rate' },
            { id: 'totalBudget', label: 'Total Budget' },
            { id: 'absorptionRate', label: 'Absorption Rate' }
        ];
        return [];
    };

    const handleExportExcel = async () => {
        try {
            const data = getCurrentTableData();
            const columns = getCurrentTableColumns();
            
            if (data.length === 0) {
                alert('No data to export');
                return;
            }

            const dataToExport = data.map(item => {
                const row = {};
                columns.forEach(col => {
                    row[col.label] = item[col.id] !== undefined ? item[col.id] : '';
                });
                return row;
            });

            // Dynamic import for xlsx
            const XLSX = await import('xlsx');
            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
            
            // Generate filename based on active tab
            const tabNames = ['Overview', 'Financial', 'Analytics', 'Yearly Trends'];
            const filename = `Project_Dashboard_${tabNames[activeTab]}_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel. Please try again.');
        }
    };

    const handleExportPDF = () => {
        try {
            const data = getCurrentTableData();
            const columns = getCurrentTableColumns();
            
            if (data.length === 0) {
                alert('No data to export');
                return;
            }

            // Dynamic import for jsPDF
            import('jspdf').then(({ default: jsPDF }) => {
                import('jspdf-autotable').then(() => {
                    const doc = new jsPDF();
                    const headers = columns.map(col => col.label);
                    const tableData = data.map(item => 
                        columns.map(col => {
                            const value = item[col.id];
                            return value !== undefined && value !== null ? String(value) : '';
                        })
                    );

                    doc.autoTable({
                        head: [headers],
                        body: tableData,
                        styles: { fontSize: 8, cellPadding: 3 },
                        headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: 'bold' }
                    });

                    const tabNames = ['Overview', 'Financial', 'Analytics', 'Yearly Trends'];
                    const filename = `Project_Dashboard_${tabNames[activeTab]}_${new Date().toISOString().split('T')[0]}.pdf`;
                    doc.save(filename);
                });
            });
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Failed to export to PDF. Please try again.');
        }
    };

    const handlePrint = () => {
        window.print();
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
            height: '75px',
            borderRadius: '6px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: `1px solid ${color}40`,
                transform: 'translateY(-2px)'
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                borderRadius: '6px 6px 0 0'
            }
        }}>
            <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.75)', fontSize: '0.65rem' }}>
                        {title}
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: `${color}15`,
                        color: color,
                        '& svg': {
                            fontSize: '0.9rem'
                        }
                    }}>
                        {icon}
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.9)', mb: 0, fontSize: '1.1rem', lineHeight: 1.2 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.6rem', display: 'block', mt: 0.25 }}>
                            {subtitle}
                        </Typography>
                    )}
                    {progress !== undefined && (
                        <Box sx={{ 
                            mt: 0.5, 
                            height: 3, 
                            borderRadius: 1.5,
                            backgroundColor: 'rgba(0,0,0,0.08)',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ 
                                height: '100%', 
                                width: `${Math.min(progress, 100)}%`, 
                                backgroundColor: color,
                                borderRadius: 1.5,
                                transition: 'width 0.3s ease'
                            }} />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    // Calculate KPIs from dashboard data
    // Calculate totalProjects from filtered department data to reflect filters/search
    const totalProjects = dashboardData.projectProgress.reduce((sum, dept) => sum + (dept.numProjects || 0), 0);
    const completedProjects = dashboardData.projectStatus.find(item => item.name === 'Completed')?.value || 0;
    const inProgressProjects = dashboardData.projectStatus.find(item => item.name === 'Ongoing')?.value || 0;
    const atRiskProjects = dashboardData.projectStatus.find(item => item.name === 'Suspended')?.value || 0;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const totalBudget = dashboardData.budgetAllocation.reduce((sum, item) => sum + item.value, 0);
    const budgetFormatted = totalBudget >= 1000000 ? `${(totalBudget / 1000000).toFixed(1)}M` : `${(totalBudget / 1000).toFixed(0)}K`;

    // Calculate financial summary from department data
    const financialSummary = calculateFinancialSummary(dashboardData.projectProgress);
    
    // Debug logging to verify calculations
    console.log('Financial Summary Debug:', {
        departmentData: dashboardData.projectProgress,
        totalContracted: financialSummary.totalContracted,
        totalPaid: financialSummary.totalPaid,
        absorptionRate: financialSummary.absorptionRate
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
    const delayedProjects = dashboardData.projectStatus.find(item => item.name === 'Suspended')?.value || 0;
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
            p: { xs: 0.75, sm: 1 }, 
            maxWidth: '100%', 
            overflowX: 'hidden',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            {/* Header Section with Inline Filters */}
            <Fade in timeout={800}>
                <Box sx={{ 
                    mb: 1, 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between',
                    gap: 1.5,
                    flexWrap: { xs: 'wrap', md: 'nowrap' }
                }}>
                    {/* Title Section - Left */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' }, minWidth: 0 }}>
                        <Typography 
                            variant="h6" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 0,
                                fontSize: '1.125rem',
                                lineHeight: 1.2
                            }}
                        >
                            Project Overview Dashboard
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                fontSize: '0.7rem',
                                mt: 0.25,
                                display: 'block'
                            }}
                        >
                            Comprehensive project analytics and insights
                        </Typography>
                    </Box>

                    {/* Filters Section - Right */}
                    <Box sx={{ 
                        flex: { xs: '1 1 100%', md: '0 0 auto' },
                        minWidth: { xs: '100%', sm: '300px', md: '400px' },
                        maxWidth: { xs: '100%', md: '600px' }
                    }}>
                        <DashboardFilters 
                            filters={filters} 
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                            onRefresh={handleRefresh}
                            isLoading={isLoading}
                        />
                    </Box>
                </Box>
            </Fade>

            {/* Tabbed Dashboard Interface */}
            <Box sx={{ mt: 0 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '12px 12px 0 0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minHeight: '40px',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                            minHeight: '40px',
                            py: 0.5,
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
                        icon={<Assessment sx={{ fontSize: '1rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            px: 1.5,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '6px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Financial" 
                        icon={<AttachMoney sx={{ fontSize: '1rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            px: 1.5,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '6px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Analytics" 
                        icon={<TrendingUp sx={{ fontSize: '1rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            px: 1.5,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '6px !important'
                            }
                        }}
                    />
                    <Tab 
                        label="Yearly Trends" 
                        icon={<ShowChart sx={{ fontSize: '1rem' }} />} 
                        iconPosition="start"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.75,
                            px: 1.5,
                            '& .MuiTab-iconWrapper': {
                                marginRight: '6px !important'
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
                    p: 1
                }}>
                    <>
                    {activeTab === 0 && (
                        <Grid container spacing={1}>
                            {/* Overview Tab - Key Metrics Only */}
                            
                            {/* Project Status Summary */}
                            <Grid item xs={12} md={6}>
                                <Fade in timeout={1200}>
                                <Card sx={{ 
                                    height: '280px',
                                    borderRadius: '8px',
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
                                        borderRadius: '8px 8px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PieChart sx={{ color: 'primary.main', fontSize: '0.875rem' }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.8125rem' }}>
                                                    Project Status Overview
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.25, px: 1, pt: 0.75 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 0.75, pt: 0 }}>
                                        <Box sx={{ 
                                            height: '250px', 
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
                                    gap: 0.5, 
                                    height: '240px',
                                    justifyContent: 'flex-start'
                                }}>
                                    <KPICard
                                        title="Number of Projects"
                                        value={totalProjects}
                                        icon={<Assessment />}
                                        color="#1976d2"
                                        subtitle="Total projects across all departments"
                                    />
                                    <KPICard
                                        title="Total Departments"
                                        value={dashboardData.projectProgress.length}
                                        icon={<Business />}
                                        color="#4caf50"
                                        subtitle="Departments with active projects"
                                    />
                                    <KPICard
                                        title="Budget Utilization"
                                        value={`${financialSummary.absorptionRate.toFixed(2)}%`}
                                        icon={<AttachMoney />}
                                        color="#ff9800"
                                        subtitle="Total budget utilized"
                                        progress={financialSummary.absorptionRate}
                                    />
                                </Box>
                            </Fade>
                        </Grid>

                        {/* Project Performance Metrics */}
                        <Grid item xs={12} md={6}>
                            <Fade in timeout={1600}>
                                <Card sx={{ 
                                    height: '240px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)'
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'linear-gradient(90deg, #2196f3, #42a5f5)',
                                        borderRadius: '6px 6px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Speed sx={{ color: 'info.main', fontSize: '0.9rem' }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.85)', fontSize: '0.75rem' }}>
                                                    Performance Metrics
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.15, px: 0.75, pt: 0.5 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 0.75, pt: 0 }}>
                                        <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                            {/* Completion Rate */}
                                            <Box sx={{ textAlign: 'center', p: 0.75, bgcolor: 'rgba(76, 175, 80, 0.08)', borderRadius: '6px' }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 0.25, fontSize: '1rem' }}>
                                                    {completionRate}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', display: 'block', mb: 0.5, fontWeight: 500 }}>
                                                    Completion Rate
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={completionRate} 
                                                    sx={{ 
                                                        height: 3, 
                                                        borderRadius: 1.5,
                                                        backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#4caf50',
                                                            borderRadius: 1.5
                                                        }
                                                    }} 
                                                />
                                            </Box>

                                            {/* Health Score */}
                                            <Box sx={{ textAlign: 'center', p: 0.75, bgcolor: 'rgba(33, 150, 243, 0.08)', borderRadius: '6px' }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 0.25, fontSize: '1rem' }}>
                                                    {healthScore}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', display: 'block', mb: 0.5, fontWeight: 500 }}>
                                                    Health Score
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={healthScore} 
                                                    sx={{ 
                                                        height: 3, 
                                                        borderRadius: 1.5,
                                                        backgroundColor: 'rgba(33, 150, 243, 0.15)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#2196f3',
                                                            borderRadius: 1.5
                                                        }
                                                    }} 
                                                />
                                            </Box>

                                            {/* Average Progress */}
                                            <Box sx={{ textAlign: 'center', p: 0.75, bgcolor: 'rgba(255, 152, 0, 0.08)', borderRadius: '6px' }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e65100', mb: 0.25, fontSize: '1rem' }}>
                                                    {averageProgress}%
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', display: 'block', mb: 0.5, fontWeight: 500 }}>
                                                    Average Progress
                                                </Typography>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={averageProgress} 
                                                    sx={{ 
                                                        height: 3, 
                                                        borderRadius: 1.5,
                                                        backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: '#ff9800',
                                                            borderRadius: 1.5
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
                                    height: '240px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255, 152, 0, 0.2)'
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'linear-gradient(90deg, #ff9800, #ffb74d)',
                                        borderRadius: '6px 6px 0 0'
                                    }
                                }}>
                                    <CardHeader
                                        title={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TrendingDown sx={{ color: 'warning.main', fontSize: '0.9rem' }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.85)', fontSize: '0.75rem' }}>
                                                    Issues Summary
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ pb: 0.15, px: 0.75, pt: 0.5 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 0.75, pt: 0 }}>
                                        <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.75 }}>
                                                <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: 'rgba(244, 67, 54, 0.08)', borderRadius: '6px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c62828', mb: 0.25, fontSize: '1.1rem' }}>
                                                        {delayedProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', fontWeight: 500 }}>
                                                        Delayed
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: 'rgba(255, 152, 0, 0.08)', borderRadius: '6px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e65100', mb: 0.25, fontSize: '1.1rem' }}>
                                                        {stalledProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', fontWeight: 500 }}>
                                                        Stalled
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', p: 1.25, bgcolor: 'rgba(233, 30, 99, 0.08)', borderRadius: '6px' }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#c2185b', mb: 0.25, fontSize: '1.1rem' }}>
                                                        {atRiskProjects}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.65rem', fontWeight: 500 }}>
                                                        At Risk
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        </Grid>
                        
                        {/* Visual Separator */}
                        <Grid item xs={12}>
                            <Box sx={{ 
                                mt: 2.5, 
                                mb: 1.5,
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Divider 
                                    sx={{ 
                                        flex: 1,
                                        borderWidth: 2,
                                        borderColor: 'primary.main',
                                        opacity: 0.3,
                                        '&::before, &::after': {
                                            borderWidth: 2
                                        }
                                    }} 
                                />
                                <Box sx={{
                                    px: 2,
                                    py: 0.75,
                                    backgroundColor: 'primary.main',
                                    borderRadius: '20px',
                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
                                }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: 'white',
                                            fontSize: '0.8125rem',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        Detailed View
                                    </Typography>
                                </Box>
                                <Divider 
                                    sx={{ 
                                        flex: 1,
                                        borderWidth: 2,
                                        borderColor: 'primary.main',
                                        opacity: 0.3,
                                        '&::before, &::after': {
                                            borderWidth: 2
                                        }
                                    }} 
                                />
                                {/* Action Buttons */}
                                <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                                    <Tooltip title="Export to Excel">
                                        <IconButton
                                            size="small"
                                            onClick={handleExportExcel}
                                            sx={{
                                                color: '#2e7d32',
                                                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                                border: '1px solid rgba(46, 125, 50, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(46, 125, 50, 0.15)',
                                                    border: '1px solid rgba(46, 125, 50, 0.3)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                width: '32px',
                                                height: '32px'
                                            }}
                                        >
                                            <FileDownload sx={{ fontSize: '0.9rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Export to PDF">
                                        <IconButton
                                            size="small"
                                            onClick={handleExportPDF}
                                            sx={{
                                                color: '#d32f2f',
                                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                border: '1px solid rgba(211, 47, 47, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                                    border: '1px solid rgba(211, 47, 47, 0.3)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                width: '32px',
                                                height: '32px'
                                            }}
                                        >
                                            <PictureAsPdf sx={{ fontSize: '0.9rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print">
                                        <IconButton
                                            size="small"
                                            onClick={handlePrint}
                                            sx={{
                                                color: '#1976d2',
                                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                border: '1px solid rgba(25, 118, 210, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                                    border: '1px solid rgba(25, 118, 210, 0.3)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                width: '32px',
                                                height: '32px'
                                            }}
                                        >
                                            <Print sx={{ fontSize: '0.9rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Refresh Data">
                                        <IconButton
                                            size="small"
                                            onClick={handleRefresh}
                                            disabled={isLoading}
                                            sx={{
                                                color: '#ff9800',
                                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                                border: '1px solid rgba(255, 152, 0, 0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                                    border: '1px solid rgba(255, 152, 0, 0.3)',
                                                    transform: 'translateY(-1px)'
                                                },
                                                '&:disabled': {
                                                    opacity: 0.5
                                                },
                                                width: '32px',
                                                height: '32px'
                                            }}
                                        >
                                            <Refresh sx={{ fontSize: '0.9rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Overview Detail Table */}
                        <Grid item xs={12}>
                            <Box sx={{ 
                                mt: 0,
                                pt: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: '8px',
                                border: '1px solid rgba(25, 118, 210, 0.1)'
                            }}>
                                <ProjectDetailTable
                                    data={transformOverviewData(dashboardData.projectProgress.map(dept => ({ 
                                        id: dept.departmentId || dept.department,
                                        department: dept.departmentName || dept.department,
                                        departmentAlias: dept.departmentAlias || dept.department,
                                        percentCompleted: Math.round((parseFloat(dept.percentCompleted) || 0) * 100) / 100,
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
                        <Grid container spacing={1}>
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
                                        height: '340px',
                                        borderRadius: '8px',
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
                                            borderRadius: '8px 8px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <BarChart sx={{ color: 'warning.main', fontSize: '1rem' }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.8125rem' }}>
                                                        Budget Allocation by Status
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.25, px: 1, pt: 0.75 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1, pt: 0 }}>
                                            <Box sx={{ height: '280px', minWidth: '500px' }}>
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
                                        height: '340px',
                                        borderRadius: '8px',
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
                                            borderRadius: '8px 8px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AttachMoney sx={{ color: 'success.main', fontSize: '1rem' }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.8125rem' }}>
                                                        Budget Performance by Department
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.25, px: 1, pt: 0.75 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1, pt: 0 }}>
                                            <Box sx={{ height: '280px', minWidth: '300px' }}>
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
                            
                            {/* Visual Separator */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    mt: 2.5, 
                                    mb: 1.5,
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderWidth: 2,
                                            borderColor: 'success.main',
                                            opacity: 0.3,
                                            '&::before, &::after': {
                                                borderWidth: 2
                                            }
                                        }} 
                                    />
                                    <Box sx={{
                                        px: 2,
                                        py: 0.75,
                                        backgroundColor: 'success.main',
                                        borderRadius: '20px',
                                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
                                    }}>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                fontWeight: 700,
                                                color: 'white',
                                                fontSize: '0.8125rem',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Detailed View
                                        </Typography>
                                    </Box>
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderWidth: 2,
                                            borderColor: 'success.main',
                                            opacity: 0.3,
                                            '&::before, &::after': {
                                                borderWidth: 2
                                            }
                                        }} 
                                    />
                                    {/* Action Buttons */}
                                    <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                                        <Tooltip title="Export to Excel">
                                            <IconButton
                                                size="small"
                                                onClick={handleExportExcel}
                                                sx={{
                                                    color: '#2e7d32',
                                                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                                    border: '1px solid rgba(46, 125, 50, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(46, 125, 50, 0.15)',
                                                        border: '1px solid rgba(46, 125, 50, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <FileDownload sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Export to PDF">
                                            <IconButton
                                                size="small"
                                                onClick={handleExportPDF}
                                                sx={{
                                                    color: '#d32f2f',
                                                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                    border: '1px solid rgba(211, 47, 47, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                                        border: '1px solid rgba(211, 47, 47, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <PictureAsPdf sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Print">
                                            <IconButton
                                                size="small"
                                                onClick={handlePrint}
                                                sx={{
                                                    color: '#1976d2',
                                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                                        border: '1px solid rgba(25, 118, 210, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <Print sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Refresh Data">
                                            <IconButton
                                                size="small"
                                                onClick={handleRefresh}
                                                disabled={isLoading}
                                                sx={{
                                                    color: '#ff9800',
                                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                                    border: '1px solid rgba(255, 152, 0, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                                        border: '1px solid rgba(255, 152, 0, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    '&:disabled': {
                                                        opacity: 0.5
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <Refresh sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Financial Detail Table */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    mt: 0,
                                    pt: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(76, 175, 80, 0.1)'
                                }}>
                                    <ProjectDetailTable
                                        data={dashboardData.projectProgress.map((dept, index) => ({ 
                                            id: dept.departmentId || dept.department || `dept-${index}`,
                                            rowNumber: index + 1,
                                            department: dept.departmentName || dept.department,
                                            departmentAlias: dept.departmentAlias || dept.department,
                                            allocatedBudget: parseFloat(dept.allocatedBudget) || 0,
                                            contractSum: parseFloat(dept.contractSum) || 0,
                                            amountPaid: parseFloat(dept.amountPaid) || 0,
                                            absorptionRate: Math.round((parseFloat(dept.percentAbsorptionRate) || 0) * 100) / 100,
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
                            {/* Analytics Tab Content */}
                            
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
                                                        Project Progress | Stratified By Departments
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.5, px: 2, pt: 1.5 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 0 }}>
                                            <Box sx={{ height: '320px', minWidth: '700px' }}>
                                                {dashboardData.projectProgress.length > 0 ? (
                                                    <LineBarComboChart
                                                        title=""
                                                        data={dashboardData.projectProgress}
                                                        barKeys={['allocatedBudget', 'contractSum', 'amountPaid']}
                                                        xAxisKey="department"
                                                        yAxisLabelLeft="Budget/Contract Sum"
                                                    />
                                                ) : (
                                                    renderNoDataCard("Project Progress")
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
                                                        Budget Efficiency
                                                    </Typography>
                                                    <AttachMoney sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                                        {financialSummary.absorptionRate.toFixed(2)}%
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={financialSummary.absorptionRate} 
                                                        sx={{ 
                                                            height: 6, 
                                                            borderRadius: 3,
                                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: financialSummary.absorptionRate >= 80 ? '#4caf50' : financialSummary.absorptionRate >= 60 ? '#ff9800' : '#f44336',
                                                                borderRadius: 3
                                                            }
                                                        }} 
                                                    />
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                                                        {financialSummary.absorptionRate >= 80 ? 'Excellent' : financialSummary.absorptionRate >= 60 ? 'Good' : 'Needs Attention'}
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
                                                        Project Timeline Metrics
                                        </Typography>
                                                    <Schedule sx={{ color: '#4caf50', fontSize: '1.2rem' }} />
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50', fontSize: '1.1rem' }}>
                                                            {Math.round((completedProjects / totalProjects) * 100)}%
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            On-Time Delivery
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                            {Math.round((delayedProjects + stalledProjects) / totalProjects * 100)}%
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            Delayed Projects
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
                                            Issues Summary
                                        </Typography>
                                        <TrendingDown sx={{ color: '#ff9800', fontSize: '1.2rem' }} />
                                    </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '1.1rem' }}>
                                                {delayedProjects}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Delayed
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '1.1rem' }}>
                                                {stalledProjects}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                Stalled
                                            </Typography>
                                        </Box>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e91e63', fontSize: '1.1rem' }}>
                                                            {atRiskProjects}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                            At Risk
                                                        </Typography>
                                                    </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                </Grid>
                
                {/* Visual Separator */}
                <Grid item xs={12}>
                    <Box sx={{ 
                        mt: 2.5, 
                        mb: 1.5,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Divider 
                            sx={{ 
                                flex: 1,
                                borderWidth: 2,
                                borderColor: 'info.main',
                                opacity: 0.3,
                                '&::before, &::after': {
                                    borderWidth: 2
                                }
                            }} 
                        />
                        <Box sx={{
                            px: 2,
                            py: 0.75,
                            backgroundColor: 'info.main',
                            borderRadius: '20px',
                            boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)'
                        }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: '0.8125rem',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Detailed View
                            </Typography>
                        </Box>
                        <Divider 
                            sx={{ 
                                flex: 1,
                                borderWidth: 2,
                                borderColor: 'info.main',
                                opacity: 0.3,
                                '&::before, &::after': {
                                    borderWidth: 2
                                }
                            }} 
                        />
                        {/* Action Buttons */}
                        <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                            <Tooltip title="Export to Excel">
                                <IconButton
                                    size="small"
                                    onClick={handleExportExcel}
                                    sx={{
                                        color: '#2e7d32',
                                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                        border: '1px solid rgba(46, 125, 50, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(46, 125, 50, 0.15)',
                                            border: '1px solid rgba(46, 125, 50, 0.3)',
                                            transform: 'translateY(-1px)'
                                        },
                                        width: '32px',
                                        height: '32px'
                                    }}
                                >
                                    <FileDownload sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export to PDF">
                                <IconButton
                                    size="small"
                                    onClick={handleExportPDF}
                                    sx={{
                                        color: '#d32f2f',
                                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                        border: '1px solid rgba(211, 47, 47, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                            border: '1px solid rgba(211, 47, 47, 0.3)',
                                            transform: 'translateY(-1px)'
                                        },
                                        width: '32px',
                                        height: '32px'
                                    }}
                                >
                                    <PictureAsPdf sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Print">
                                <IconButton
                                    size="small"
                                    onClick={handlePrint}
                                    sx={{
                                        color: '#1976d2',
                                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                        border: '1px solid rgba(25, 118, 210, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                            border: '1px solid rgba(25, 118, 210, 0.3)',
                                            transform: 'translateY(-1px)'
                                        },
                                        width: '32px',
                                        height: '32px'
                                    }}
                                >
                                    <Print sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Refresh Data">
                                <IconButton
                                    size="small"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    sx={{
                                        color: '#ff9800',
                                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                            border: '1px solid rgba(255, 152, 0, 0.3)',
                                            transform: 'translateY(-1px)'
                                        },
                                        '&:disabled': {
                                            opacity: 0.5
                                        },
                                        width: '32px',
                                        height: '32px'
                                    }}
                                >
                                    <Refresh sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                </Grid>

                {/* Analytics Detail Table */}
                <Grid item xs={12}>
                    <Box sx={{ 
                        mt: 0,
                        pt: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '8px',
                        border: '1px solid rgba(33, 150, 243, 0.1)'
                    }}>
                        <ProjectDetailTable
                            data={transformAnalyticsData(dashboardData.projectProgress)}
                            columns={analyticsTableColumns}
                            title="Department Analytics Details"
                            onRowClick={(row) => handleDepartmentClick(row)}
                        />
                    </Box>
                </Grid>
            </Grid>
                    )}

                    {activeTab === 3 && (
                        <Grid container spacing={1}>
                            {/* Annual Trends Tab Content */}
                            
                            {/* Project Performance Overview */}
                            <Grid item xs={12}>
                                <Fade in timeout={2000}>
                                    <Card sx={{ 
                                        height: '400px',
                                        borderRadius: '8px',
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
                                            borderRadius: '8px 8px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ShowChart sx={{ color: 'primary.main', fontSize: '1rem' }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.8125rem' }}>
                                                        Project Performance Trends ({trendsData.yearRange.start}-{trendsData.yearRange.end})
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.25, px: 1, pt: 0.75 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1, pt: 0 }}>
                                            <Box sx={{ height: '340px', minWidth: '900px' }}>
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
                                        height: '400px',
                                        borderRadius: '8px',
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
                                            borderRadius: '8px 8px 0 0'
                                        }
                                    }}>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <AttachMoney sx={{ color: 'success.main', fontSize: '1rem' }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '0.8125rem' }}>
                                                        Financial Performance Trends
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ pb: 0.25, px: 1, pt: 0.75 }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, p: 1, pt: 0 }}>
                                            <Box sx={{ height: '340px', minWidth: '700px' }}>
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
                                        gap: 1, 
                                        height: '400px',
                                        justifyContent: 'space-between'
                                    }}>
                                        {/* Total Projects Over Time */}
                                        <Card sx={{ 
                                            height: '100px',
                                            borderRadius: '8px',
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
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 1.25, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Total Projects
                                                    </Typography>
                                                    <Business sx={{ color: '#1976d2', fontSize: '1rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.25, fontSize: '1.25rem' }}>
                                                        {trendsData.projectPerformance.reduce((sum, item) => sum + (item.totalProjects || 0), 0)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Average Completion Rate */}
                                        <Card sx={{ 
                                            height: '100px',
                                            borderRadius: '8px',
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
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 1.25, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Avg Completion Rate
                                                    </Typography>
                                                    <CheckCircle sx={{ color: '#4caf50', fontSize: '1rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.25, fontSize: '1.25rem' }}>
                                                        {trendsData.projectPerformance.length > 0 ? 
                                                            (trendsData.projectPerformance.reduce((sum, item) => sum + parseFloat(item.completionRate || 0), 0) / trendsData.projectPerformance.length).toFixed(1) + '%' 
                                                            : '0%'
                                                        }
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        {/* Total Budget Over Time */}
                                        <Card sx={{ 
                                            height: '100px',
                                            borderRadius: '8px',
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
                                                borderRadius: '8px 8px 0 0'
                                            }
                                        }}>
                                            <CardContent sx={{ p: 1.25, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.7rem' }}>
                                                        Total Budget
                                                    </Typography>
                                                    <AttachMoney sx={{ color: '#ff9800', fontSize: '1rem' }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.25, fontSize: '1.25rem' }}>
                                                        KSh {(trendsData.financialTrends.reduce((sum, item) => sum + (item.totalBudget || 0), 0) / 1000000).toFixed(1)}M
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                                                        Over 5 years
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Fade>
                            </Grid>

                            {/* Visual Separator */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    mt: 1.5, 
                                    mb: 1,
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderWidth: 2,
                                            borderColor: 'primary.main',
                                            opacity: 0.3,
                                            '&::before, &::after': {
                                                borderWidth: 2
                                            }
                                        }} 
                                    />
                                    <Box sx={{
                                        px: 2,
                                        py: 0.75,
                                        backgroundColor: 'primary.main',
                                        borderRadius: '20px',
                                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
                                    }}>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                fontWeight: 700,
                                                color: 'white',
                                                fontSize: '0.8125rem',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase'
                                            }}
                                        >
                                            Detailed View
                                        </Typography>
                                    </Box>
                                    <Divider 
                                        sx={{ 
                                            flex: 1,
                                            borderWidth: 2,
                                            borderColor: 'primary.main',
                                            opacity: 0.3,
                                            '&::before, &::after': {
                                                borderWidth: 2
                                            }
                                        }} 
                                    />
                                    {/* Action Buttons */}
                                    <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                                        <Tooltip title="Export to Excel">
                                            <IconButton
                                                size="small"
                                                onClick={handleExportExcel}
                                                sx={{
                                                    color: '#2e7d32',
                                                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                                                    border: '1px solid rgba(46, 125, 50, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(46, 125, 50, 0.15)',
                                                        border: '1px solid rgba(46, 125, 50, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <FileDownload sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Export to PDF">
                                            <IconButton
                                                size="small"
                                                onClick={handleExportPDF}
                                                sx={{
                                                    color: '#d32f2f',
                                                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                    border: '1px solid rgba(211, 47, 47, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                                                        border: '1px solid rgba(211, 47, 47, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <PictureAsPdf sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Print">
                                            <IconButton
                                                size="small"
                                                onClick={handlePrint}
                                                sx={{
                                                    color: '#1976d2',
                                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                                        border: '1px solid rgba(25, 118, 210, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <Print sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Refresh Data">
                                            <IconButton
                                                size="small"
                                                onClick={handleRefresh}
                                                disabled={isLoading}
                                                sx={{
                                                    color: '#ff9800',
                                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                                    border: '1px solid rgba(255, 152, 0, 0.2)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 152, 0, 0.15)',
                                                        border: '1px solid rgba(255, 152, 0, 0.3)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    '&:disabled': {
                                                        opacity: 0.5
                                                    },
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                <Refresh sx={{ fontSize: '0.9rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Yearly Trends Detail Report */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    mt: 0,
                                    pt: 1.5,
                                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(25, 118, 210, 0.1)'
                                }}>
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
        </Box>
    );
};

export default ReportingView;