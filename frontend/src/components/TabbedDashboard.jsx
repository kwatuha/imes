import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { tokens } from '../pages/dashboard/theme';
import ActiveUsersCard from './ActiveUsersCard';
import ProjectTasksCard from './ProjectTasksCard';
import ProjectActivityFeed from './ProjectActivityFeed';
import ProjectAlertsCard from './ProjectAlertsCard';
import RoleBasedDashboard from './dashboard/RoleBasedDashboard';
import ChartsDashboard from './dashboard/ChartsDashboard';
import TeamDirectoryCard from './TeamDirectoryCard';
import TeamAnnouncementsCard from './TeamAnnouncementsCard';
import RecentConversationsCard from './RecentConversationsCard';

const TabbedDashboard = ({ user, dashboardData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const tabProps = (index) => ({
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Tab Navigation */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200],
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        borderRadius: '12px 12px 0 0',
        px: 2,
        py: 1
      }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[700],
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textTransform: 'none',
              minHeight: 48,
              px: 3,
              '&:hover': {
                color: colors.blueAccent?.[500] || '#6870fa',
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
              },
              '&.Mui-selected': {
                color: colors.blueAccent?.[500] || '#6870fa',
                fontWeight: 'bold',
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
                borderRadius: '8px 8px 0 0',
              },
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            icon={<DashboardIcon />}
            iconPosition="start"
            label="Overview"
            {...tabProps(0)}
            sx={{ minWidth: 120 }}
          />
          <Tab
            icon={<AssignmentIcon />}
            iconPosition="start"
            label="Projects"
            {...tabProps(1)}
            sx={{ minWidth: 120 }}
          />
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="Collaboration"
            {...tabProps(2)}
            sx={{ minWidth: 120 }}
          />
          <Tab
            icon={<AnalyticsIcon />}
            iconPosition="start"
            label="Analytics"
            {...tabProps(3)}
            sx={{ minWidth: 120 }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ 
        bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
        borderRadius: '0 0 12px 12px',
        minHeight: '600px'
      }}>
        {/* Overview Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Key Metrics */}
            <Grid item xs={12}>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={3}>
                Key Performance Indicators
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent?.[500] || '#4caf50'} mb={1}>
                        {dashboardData?.metrics?.completedProjects || 18}
                      </Typography>
                      <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                        Completed
                      </Typography>
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                        This quarter
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
                      <Typography variant="h4" fontWeight="bold" color={colors.yellowAccent?.[500] || '#ff9800'} mb={1}>
                        {dashboardData?.metrics?.activeProjects || 6}
                      </Typography>
                      <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                        Active
                      </Typography>
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                        In progress
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
                      <Typography variant="h4" fontWeight="bold" color={colors.redAccent?.[500] || '#f44336'} mb={1}>
                        {dashboardData?.metrics?.overdueProjects || 2}
                      </Typography>
                      <Typography variant="h6" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                        Overdue
                      </Typography>
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                        Need attention
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3, 
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
                boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
                border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={3}>
                    Quick Stats
                  </Typography>
                  {/* Quick Stats Content */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                          Team Performance
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={colors.blueAccent?.[500] || '#6870fa'}>
                          85%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200], 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '85%', 
                          height: '100%', 
                          bgcolor: colors.blueAccent?.[500] || '#6870fa',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                          Project Completion
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={colors.greenAccent?.[500] || '#4caf50'}>
                          72%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200], 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '72%', 
                          height: '100%', 
                          bgcolor: colors.greenAccent?.[500] || '#4caf50',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                          Budget Utilization
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={colors.yellowAccent?.[500] || '#ff9800'}>
                          68%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200], 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '68%', 
                          height: '100%', 
                          bgcolor: colors.yellowAccent?.[500] || '#ff9800',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                    <Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                          Quality Score
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={colors.redAccent?.[500] || '#f44336'}>
                          92%
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200], 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '92%', 
                          height: '100%', 
                          bgcolor: colors.redAccent?.[500] || '#f44336',
                          borderRadius: 4
                        }} />
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3, 
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100],
                boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
                border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={3}>
                    Recent Activity
                  </Typography>
                  {/* Recent Activity Content */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        bgcolor: colors.greenAccent?.[500] || '#4caf50', 
                        borderRadius: '50%' 
                      }} />
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                        Project "Water Management" completed successfully
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        bgcolor: colors.blueAccent?.[500] || '#6870fa', 
                        borderRadius: '50%' 
                      }} />
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                        New task assigned: Site inspection for Healthcare project
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        bgcolor: colors.yellowAccent?.[500] || '#ff9800', 
                        borderRadius: '50%' 
                      }} />
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                        Budget approval pending for Education project
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        bgcolor: colors.redAccent?.[500] || '#f44336', 
                        borderRadius: '50%' 
                      }} />
                      <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                        High risk alert: Road Infrastructure project
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Projects Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} lg={4}>
              <ProjectTasksCard currentUser={user} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ProjectActivityFeed currentUser={user} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ProjectAlertsCard currentUser={user} />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Collaboration Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} lg={4}>
              <TeamDirectoryCard currentUser={user} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TeamAnnouncementsCard currentUser={user} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <RecentConversationsCard currentUser={user} />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12}>
              <ChartsDashboard user={user} dashboardData={dashboardData} />
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default TabbedDashboard;
