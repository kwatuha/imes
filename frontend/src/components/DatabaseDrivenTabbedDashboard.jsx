import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { tokens } from '../pages/dashboard/theme';
import { useDatabaseDashboardConfig } from '../hooks/useDatabaseDashboardConfig';

// Import all dashboard components
import ActiveUsersCard from './ActiveUsersCard';
import KpiCard from './KpiCard';
import ProjectTasksCard from './ProjectTasksCard';
import ProjectActivityFeed from './ProjectActivityFeed';
import ProjectAlertsCard from './ProjectAlertsCard';
import TeamDirectoryCard from './TeamDirectoryCard';
import TeamAnnouncementsCard from './TeamAnnouncementsCard';
import RecentConversationsCard from './RecentConversationsCard';
import ChartsDashboard from './dashboard/ChartsDashboard';

// Import dashboard card components
import UserStatsCard from './dashboard/cards/UserStatsCard';
import ProjectMetricsCard from './dashboard/cards/ProjectMetricsCard';
import BudgetOverviewCard from './dashboard/cards/BudgetOverviewCard';

// Contractor-specific components
import ContractorMetricsCard from './contractor/ContractorMetricsCard';
import AssignedTasksCard from './contractor/AssignedTasksCard';
import ProjectCommentsCard from './contractor/ProjectCommentsCard';
import PaymentRequestsCard from './contractor/PaymentRequestsCard';
import PaymentHistoryCard from './contractor/PaymentHistoryCard';
import FinancialSummaryCard from './contractor/FinancialSummaryCard';

// Enhanced filtered components
import RegionalProjectsCard from './dashboard/enhanced/RegionalProjectsCard';
import BudgetFilteredMetricsCard from './dashboard/enhanced/BudgetFilteredMetricsCard';

const DatabaseDrivenTabbedDashboard = ({ user, dashboardData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeTab, setActiveTab] = useState(0);

  const {
    dashboardConfig,
    refreshing,
    refreshDashboardConfig,
    canAccessTab,
    canAccessComponent,
    getTabComponents,
    getAvailableTabs,
    isLoading,
    hasError,
    error,
    tabs,
    components
  } = useDatabaseDashboardConfig(user);

  // Component mapping - maps component keys to actual React components
  const componentMap = {
    // Card Components
    active_users_card: () => <ActiveUsersCard user={user} />,
    kpi_card: () => <KpiCard label="System KPIs" value={dashboardData?.metrics?.totalProjects || 24} />,
    contractor_metrics_card: () => <ContractorMetricsCard user={user} />,
    financial_summary_card: () => <FinancialSummaryCard user={user} />,
    user_stats_card: () => <UserStatsCard user={user} dashboardData={dashboardData} />,
    project_metrics_card: () => <ProjectMetricsCard user={user} dashboardData={dashboardData} />,
    budget_overview_card: () => <BudgetOverviewCard user={user} dashboardData={dashboardData} />,
    
    // Chart Components
    charts_dashboard: () => <ChartsDashboard user={user} dashboardData={dashboardData} />,
    
    // List Components
    project_tasks_card: () => <ProjectTasksCard user={user} />,
    project_activity_feed: () => <ProjectActivityFeed user={user} />,
    project_alerts_card: () => <ProjectAlertsCard user={user} />,
    team_directory_card: () => <TeamDirectoryCard user={user} />,
    team_announcements_card: () => <TeamAnnouncementsCard user={user} />,
    recent_conversations_card: () => <RecentConversationsCard user={user} />,
    
    // Contractor Components
    assigned_tasks_card: () => <AssignedTasksCard user={user} />,
    project_comments_card: () => <ProjectCommentsCard user={user} />,
    payment_requests_card: () => <PaymentRequestsCard user={user} />,
    payment_history_card: () => <PaymentHistoryCard user={user} />,
    
    // Enhanced Components
    regional_projects_card: () => <RegionalProjectsCard user={user} />,
    budget_filtered_metrics_card: () => <BudgetFilteredMetricsCard user={user} />,
    
    // Table Components (placeholder - these need proper table components)
    users_table: () => (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Users Management</Typography>
        <Typography variant="body2" color="textSecondary">
          Users table component - integrate with UserManagementPage
        </Typography>
      </Card>
    ),
    projects_table: () => (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Projects Management</Typography>
        <Typography variant="body2" color="textSecondary">
          Projects table component - integrate with ProjectManagementPage
        </Typography>
      </Card>
    ),
    
    // Widget Components
    quick_actions_widget: () => (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Typography variant="body2" color="textSecondary">
          Quick actions widget - add common admin actions
        </Typography>
      </Card>
    ),
    
    // Legacy components
    reports_overview: () => (
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Reports Overview</Typography>
        <Typography variant="body2" color="textSecondary">
          Reports overview component
        </Typography>
      </Card>
    ),
    
    // Overview components
    metrics: () => {
      return (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3, 
              bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
              border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={colors.blueAccent?.[500] || '#6870fa'} mb={1}>
                  {dashboardData?.metrics?.totalProjects || 24}
                </Typography>
                <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                  Total Projects
                </Typography>
                <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                  Across all categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3, 
              bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
              border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={colors.greenAccent?.[500] || '#4cceac'} mb={1}>
                  {dashboardData?.metrics?.activeProjects || 8}
                </Typography>
                <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                  Active Projects
                </Typography>
                <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                  Currently in progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3, 
              bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
              border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={colors.blueAccent?.[500] || '#6870fa'} mb={1}>
                  {dashboardData?.metrics?.completedProjects || 4}
                </Typography>
                <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                  Completed
                </Typography>
                <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                  Successfully finished
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 3, 
              bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
              border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color={colors.redAccent?.[500] || '#db4f4a'} mb={1}>
                  {dashboardData?.metrics?.pendingApprovals || 3}
                </Typography>
                <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                  Pending
                </Typography>
                <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                  Awaiting approval
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    },
    quickStats: () => (
      <Card sx={{ 
        height: '100%',
        borderRadius: 3, 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                Budget Utilization
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={colors.blueAccent?.[500] || '#6870fa'}>
                {dashboardData?.metrics?.budgetUtilization || 75}%
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                Team Members
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={colors.greenAccent?.[500] || '#4cceac'}>
                {dashboardData?.metrics?.teamMembers || 24}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ),
    recentActivity: () => (
      <Card sx={{ 
        height: '100%',
        borderRadius: 3, 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Recent Activity
          </Typography>
          {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
            <List>
              {dashboardData.recentActivity.map((activity, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <AssignmentIcon sx={{ color: colors.blueAccent?.[500] || '#6870fa' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
              No recent activity
            </Typography>
          )}
        </CardContent>
      </Card>
    ),
    
    // Project components
    tasks: () => <ProjectTasksCard currentUser={user} />,
    activity: () => <ProjectActivityFeed currentUser={user} />,
    alerts: () => <ProjectAlertsCard currentUser={user} />,
    
    // Collaboration components
    teamDirectory: () => <TeamDirectoryCard currentUser={user} />,
    announcements: () => <TeamAnnouncementsCard currentUser={user} />,
    conversations: () => <RecentConversationsCard currentUser={user} />,
    
    // Analytics components
    charts: () => <ChartsDashboard user={user} dashboardData={dashboardData} />,
    
    // Contractor-specific components
    contractorMetrics: () => <ContractorMetricsCard currentUser={user} />,
    assignedTasks: () => <AssignedTasksCard currentUser={user} />,
    projectComments: () => <ProjectCommentsCard currentUser={user} />,
    projectActivity: () => <ProjectActivityFeed currentUser={user} />,
    paymentRequests: () => <PaymentRequestsCard currentUser={user} />,
    paymentHistory: () => <PaymentHistoryCard currentUser={user} />,
    financialSummary: () => <FinancialSummaryCard currentUser={user} />,
    
    // Enhanced filtered components
    regionalProjects: () => <RegionalProjectsCard user={user} />,
    budgetMetrics: () => <BudgetFilteredMetricsCard user={user} />,
    wardProjects: () => <RegionalProjectsCard user={user} />,
    departmentMetrics: () => <BudgetFilteredMetricsCard user={user} />,
  };

  // Tab configuration with icons
  const tabIconMap = {
    overview: <DashboardIcon />,
    projects: <AssignmentIcon />,
    collaboration: <PeopleIcon />,
    analytics: <AnalyticsIcon />,
    payments: <MoneyIcon />,
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Render components for a specific tab
  const renderTabContent = (tabKey) => {
    const tabComponents = getTabComponents(tabKey);
    
    return (
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {tabComponents.map((componentKey) => {
          const Component = componentMap[componentKey];
          if (!Component) {
            console.warn(`Component ${componentKey} not found in componentMap`);
            return null;
          }
          
          return (
            <Grid item xs={12} key={componentKey}>
              <Component />
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading dashboard configuration...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (hasError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dashboard Configuration Error
        </Typography>
        <Typography variant="body2">
          {error || 'Failed to load dashboard configuration. Please try refreshing the page.'}
        </Typography>
      </Alert>
    );
  }

  // No tabs available
  if (!tabs || tabs.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          No Dashboard Access
        </Typography>
        <Typography variant="body2">
          You don't have access to any dashboard tabs. Please contact your administrator.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tab Navigation */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        borderRadius: 3,
        mb: 3,
        boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.mode === 'dark' ? colors.grey[50] : colors.grey[700],
              fontWeight: 'bold',
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 48,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              },
              '&.Mui-selected': {
                color: colors.blueAccent?.[500] || '#6870fa',
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[600] : colors.primary[200],
                fontWeight: 'bold',
              }
            },
            '& .MuiTabs-indicator': {
              display: 'none'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.tab_key}
              label={tab.tab_name}
              icon={tabIconMap[tab.tab_key]}
              iconPosition="start"
              sx={{ 
                minWidth: 120,
                px: 3,
                py: 1.5
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <div
          key={tab.tab_key}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`dashboard-tabpanel-${index}`}
          aria-labelledby={`dashboard-tab-${index}`}
        >
          {activeTab === index && (
            <Box sx={{ p: 3 }}>
              {renderTabContent(tab.tab_key)}
            </Box>
          )}
        </div>
      ))}
    </Box>
  );
};

export default DatabaseDrivenTabbedDashboard;
