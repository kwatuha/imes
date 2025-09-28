import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Chip,
    Grid,
    Card,
    CardContent,
    Divider,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Close,
    Business,
    AttachMoney,
    TrendingUp,
    Schedule,
    CheckCircle,
    Warning
} from '@mui/icons-material';
import ProjectDetailTable from '../tables/ProjectDetailTable';
import { transformOverviewData } from '../tables/TableConfigs';
import reportsService from '../../api/reportsService';

const DepartmentProjectsModal = ({ open, onClose, departmentData }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isUsingMockData, setIsUsingMockData] = useState(false);

    useEffect(() => {
        if (open && departmentData) {
            fetchDepartmentProjects();
        }
    }, [open, departmentData]);

    const fetchDepartmentProjects = async () => {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching projects for department:', departmentData.department);
        
        try {
            // Fetch actual projects for the department from the API
            console.log('Making API call to get projects by department...');
            const response = await reportsService.getProjectsByDepartment(departmentData.department);
            console.log('API response:', response);
            
            if (response && response.length > 0) {
                console.log('Using real data from API:', response.length, 'projects');
                console.log('Sample project data:', response[0]);
                setProjects(response);
                setIsUsingMockData(false);
            } else {
                console.log('API returned empty data, using mock data');
                // Use mock data if API doesn't return data
                setProjects(generateMockProjects(departmentData));
                setIsUsingMockData(true);
            }
        } catch (err) {
            console.error('API call failed, using mock data:', err);
            // Use mock data for demonstration
            setProjects(generateMockProjects(departmentData));
            setIsUsingMockData(true);
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockProjects = (dept) => {
        // Generate mock project data based on department
        const projectCount = Math.floor(Math.random() * 8) + 3; // 3-10 projects
        return Array.from({ length: projectCount }, (_, index) => ({
            id: `proj-${dept.departmentId}-${index}`,
            projectName: `${dept.department} Project ${index + 1}`,
            department: dept.department,
            status: ['Completed', 'In Progress', 'At Risk', 'Delayed'][Math.floor(Math.random() * 4)],
            percentCompleted: Math.floor(Math.random() * 100),
            healthScore: Math.floor(Math.random() * 100),
            startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            allocatedBudget: Math.floor(Math.random() * 5000000) + 100000,
            contractSum: Math.floor(Math.random() * 5000000) + 100000,
            amountPaid: Math.floor(Math.random() * 3000000) + 50000
        }));
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `KSh ${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `KSh ${(amount / 1000).toFixed(0)}K`;
        } else {
            return `KSh ${amount.toLocaleString()}`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.error('Error formatting date:', dateString, error);
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Completed': '#4caf50',
            'In Progress': '#2196f3',
            'At Risk': '#f44336',
            'Delayed': '#ff9800'
        };
        return colors[status] || '#757575';
    };

    const calculateDepartmentStats = () => {
        if (!projects.length) return null;
        
        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
        const atRiskProjects = projects.filter(p => p.status === 'At Risk').length;
        const totalBudget = projects.reduce((sum, p) => {
            const budget = parseFloat(p.allocatedBudget) || 0;
            console.log('Project budget:', p.projectName, 'allocatedBudget:', p.allocatedBudget, 'parsed:', budget);
            return sum + budget;
        }, 0);
        const totalPaid = projects.reduce((sum, p) => {
            const paid = parseFloat(p.amountPaid) || 0;
            return sum + paid;
        }, 0);
        const avgProgress = projects.reduce((sum, p) => sum + (p.percentCompleted || 0), 0) / totalProjects;

        console.log('Total budget calculated:', totalBudget);
        console.log('Total paid calculated:', totalPaid);
        
        return {
            totalProjects,
            completedProjects,
            inProgressProjects,
            atRiskProjects,
            totalBudget,
            totalPaid,
            avgProgress: Math.round(avgProgress)
        };
    };

    const stats = calculateDepartmentStats();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{ 
                pb: 1,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                position: 'relative'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Business sx={{ fontSize: '2rem' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {departmentData?.department} - Project Details
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                Individual project breakdown and performance metrics
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton 
                        onClick={onClose}
                        sx={{ 
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <>
                        {/* Department Summary Stats */}
                        {stats && (
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                        color: 'white',
                                        borderRadius: '12px'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <CheckCircle sx={{ fontSize: '2rem', mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {stats.completedProjects}
                                            </Typography>
                                            <Typography variant="body2">
                                                Completed Projects
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                                        color: 'white',
                                        borderRadius: '12px'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <TrendingUp sx={{ fontSize: '2rem', mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {stats.inProgressProjects}
                                            </Typography>
                                            <Typography variant="body2">
                                                In Progress
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                                        color: 'white',
                                        borderRadius: '12px'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Warning sx={{ fontSize: '2rem', mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {stats.atRiskProjects}
                                            </Typography>
                                            <Typography variant="body2">
                                                At Risk
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                                        color: 'white',
                                        borderRadius: '12px'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <AttachMoney sx={{ fontSize: '2rem', mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {formatCurrency(stats.totalBudget)}
                                            </Typography>
                                            <Typography variant="body2">
                                                Total Budget
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid item xs={12} md={3}>
                                    <Card sx={{ 
                                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                        color: 'white',
                                        borderRadius: '12px'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Business sx={{ fontSize: '2rem', mb: 1 }} />
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                {formatCurrency(stats.totalPaid)}
                                            </Typography>
                                            <Typography variant="body2">
                                                Total Paid
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        <Divider sx={{ mb: 3 }} />

                        {/* Data Source Notice */}
                        {isUsingMockData ? (
                            <Alert 
                                severity="info" 
                                sx={{ 
                                    mb: 3,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                                    border: '1px solid rgba(33, 150, 243, 0.2)'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    📊 Demo Mode: This shows sample project data for demonstration purposes. 
                                    In production, this would display actual projects from the database.
                                </Typography>
                            </Alert>
                        ) : (
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mb: 3,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                                    border: '1px solid rgba(76, 175, 80, 0.2)'
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    ✅ Live Data: Showing actual projects from the database for {departmentData?.department} department.
                                </Typography>
                            </Alert>
                        )}

                        {/* Projects Table */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Individual Projects ({projects.length})
                            </Typography>
                            <Chip 
                                label={isUsingMockData ? "Demo Data" : "Live Data"} 
                                color={isUsingMockData ? "info" : "success"} 
                                size="small"
                                sx={{ 
                                    background: isUsingMockData 
                                        ? 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
                                        : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                        
                        <ProjectDetailTable
                            data={projects.map((project, index) => ({
                                id: project.id,
                                rowNumber: index + 1,
                                projectName: project.projectName || project.name,
                                department: project.department || project.departmentName,
                                status: project.status,
                                percentCompleted: project.percentCompleted || 0,
                                healthScore: project.healthScore || 0,
                                allocatedBudget: parseFloat(project.allocatedBudget) || 0,
                                contractSum: parseFloat(project.contractSum) || 0,
                                amountPaid: parseFloat(project.amountPaid) || 0,
                                absorptionRate: parseFloat(project.absorptionRate) || 0,
                                startDate: formatDate(project.startDate),
                                endDate: formatDate(project.endDate)
                            }))}
                            columns={[
                                {
                                    id: 'rowNumber',
                                    label: '#',
                                    minWidth: 60,
                                    type: 'number'
                                },
                                {
                                    id: 'projectName',
                                    label: 'Project Name',
                                    minWidth: 200,
                                    type: 'text'
                                },
                                {
                                    id: 'status',
                                    label: 'Status',
                                    minWidth: 120,
                                    type: 'status'
                                },
                                {
                                    id: 'percentCompleted',
                                    label: 'Progress',
                                    minWidth: 120,
                                    type: 'progress'
                                },
                                {
                                    id: 'healthScore',
                                    label: 'Health Score',
                                    minWidth: 100,
                                    type: 'number'
                                },
                                {
                                    id: 'allocatedBudget',
                                    label: 'Allocated Budget',
                                    minWidth: 140,
                                    type: 'currency'
                                },
                                {
                                    id: 'contractSum',
                                    label: 'Contract Sum',
                                    minWidth: 140,
                                    type: 'currency'
                                },
                                {
                                    id: 'amountPaid',
                                    label: 'Amount Paid',
                                    minWidth: 140,
                                    type: 'currency'
                                },
                                {
                                    id: 'absorptionRate',
                                    label: 'Absorption Rate',
                                    minWidth: 120,
                                    type: 'progress'
                                },
                                {
                                    id: 'startDate',
                                    label: 'Start Date',
                                    minWidth: 120,
                                    type: 'date'
                                },
                                {
                                    id: 'endDate',
                                    label: 'End Date',
                                    minWidth: 120,
                                    type: 'date'
                                }
                            ]}
                            title=""
                            onRowClick={(row) => console.log('Project clicked:', row)}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Close
                </Button>
                <Button 
                    variant="contained"
                    sx={{ 
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                    }}
                >
                    Export Projects
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DepartmentProjectsModal;
