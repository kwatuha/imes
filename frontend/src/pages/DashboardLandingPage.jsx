import React, { useState, useEffect, useContext } from 'react';
import ProfileModal from '../components/ProfileModal';
import DatabaseDrivenTabbedDashboard from '../components/DatabaseDrivenTabbedDashboard';
import ActiveUsersCard from '../components/ActiveUsersCard';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  AccountCircle as AccountIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { tokens } from '../pages/dashboard/theme';
import useDashboardData from '../hooks/useDashboardData';
import RoleBasedDashboard from '../components/dashboard/RoleBasedDashboard';
import ChartsDashboard from '../components/dashboard/ChartsDashboard';
import ErrorBoundary from '../components/ErrorBoundary';

const DashboardLandingPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  // Use the custom hook for dashboard data
  const {
    dashboardData,
    refreshing,
    refreshDashboard,
    markNotificationAsRead,
    updateProfile,
    exportData
  } = useDashboardData();

  // Fallback data for when API is not available
  const fallbackData = {
    notifications: [
      { id: 1, type: 'timeline', title: 'New Timeline Notifications', count: 0, priority: 'low', icon: <ScheduleIcon /> },
      { id: 2, type: 'project', title: 'New Project Updates', count: 1, priority: 'medium', icon: <AssignmentIcon /> },
      { id: 3, type: 'task', title: "Today's Pending Tasks", count: 0, priority: 'high', icon: <WarningIcon /> },
      { id: 4, type: 'message', title: 'New Messages & Chats', count: 0, priority: 'low', icon: <EmailIcon /> },
    ],
    profile: {
      name: user?.username || 'John Doe',
      role: user?.roleName || 'Employee',
      email: 'kimkenal@gmail.com',
      phone: '0725044721',
      lastOnline: '2 minutes ago',
      profileComplete: 39,
      leaveDays: { taken: 0, remaining: 0 },
      about: 'working progress',
      verified: false,
    },
    metrics: {
      totalProjects: 12,
      activeProjects: 8,
      completedProjects: 4,
      pendingApprovals: 3,
      budgetUtilization: 75,
      teamMembers: 24,
    },
    recentActivity: [
      { id: 1, action: 'Project "Water Management" updated', time: '2 hours ago', type: 'project' },
      { id: 2, action: 'New team member added to "Infrastructure"', time: '4 hours ago', type: 'team' },
      { id: 3, action: 'Budget approval required for "Health Initiative"', time: '1 day ago', type: 'approval' },
    ],
  };

  // Use dashboard data or fallback
  const data = dashboardData.loading ? fallbackData : (dashboardData.notifications ? dashboardData : fallbackData);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.redAccent?.[500] || '#db4f4a';
      case 'medium': return colors.blueAccent?.[500] || '#6870fa';
      case 'low': return colors.greenAccent?.[500] || '#4cceac';
      default: return colors.grey?.[500] || '#666666';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'timeline':
      case 'schedule': return <ScheduleIcon />;
      case 'project':
      case 'assignment': return <AssignmentIcon />;
      case 'task':
      case 'warning': return <WarningIcon />;
      case 'message':
      case 'email': return <EmailIcon />;
      default: return <InfoIcon />;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Card sx={{ 
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}30`,
      borderRadius: 3,
      transition: 'all 0.3s ease',
      height: '100%',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}20`,
      }
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" color={color} mb={0.5}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: color, 
            width: { xs: 48, sm: 56 }, 
            height: { xs: 48, sm: 56 },
            boxShadow: `0 4px 15px ${color}30`
          }}>
            {icon}
          </Avatar>
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Box display="flex" alignItems="center" mt="auto">
            <TrendingUpIcon sx={{ fontSize: 16, color: colors.greenAccent?.[500] || '#4cceac', mr: 0.5 }} />
            <Typography variant="body2" color={colors.greenAccent?.[500] || '#4cceac'} fontWeight="medium">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const NotificationCard = ({ notification }) => (
    <Card sx={{ 
      border: `1px solid ${getPriorityColor(notification.priority)}30`,
      borderRadius: 2,
      transition: 'all 0.3s ease',
      background: `linear-gradient(135deg, ${getPriorityColor(notification.priority)}08, transparent)`,
      '&:hover': {
        transform: 'translateX(4px)',
        boxShadow: `0 4px 15px ${getPriorityColor(notification.priority)}20`,
        background: `linear-gradient(135deg, ${getPriorityColor(notification.priority)}12, transparent)`,
      }
    }}>
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar sx={{ 
              bgcolor: getPriorityColor(notification.priority), 
              width: 36, 
              height: 36, 
              mr: 2,
              boxShadow: `0 2px 8px ${getPriorityColor(notification.priority)}30`
            }}>
              {typeof notification.icon === 'string' ? getNotificationIcon(notification.icon) : notification.icon}
            </Avatar>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="medium" color={colors.grey[100]}>
                {notification.title}
              </Typography>
              <Typography variant="caption" color={colors.grey[400]} sx={{ textTransform: 'capitalize' }}>
                {notification.priority} priority
              </Typography>
            </Box>
          </Box>
          <Badge 
            badgeContent={notification.count} 
            color={notification.count > 0 ? "error" : "default"}
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '0.7rem',
                fontWeight: 'bold',
                minWidth: 20,
                height: 20
              } 
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  // Show loading state
  if (dashboardData.loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: colors.primary[5]
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: colors.blueAccent[500], mb: 2 }} />
          <Typography variant="h6" color={colors.grey[100]}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (dashboardData.error) {
    return (
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: colors.primary[5] }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={refreshDashboard}>
              Retry
            </Button>
          }
        >
          {dashboardData.error}
        </Alert>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: colors.primary[5],
        background: `linear-gradient(135deg, ${colors.primary[5]} 0%, ${colors.primary[4]} 100%)`,
      }}>
        {/* Welcome Header with Refresh Button */}
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: `0 4px 20px ${colors.primary[300]}20`,
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box flex={1} minWidth={200}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={colors.grey[100]} 
                mb={1}
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}
              >
                Welcome back, {data.profile.name}!
              </Typography>
              <Typography 
                variant="body1" 
                color={colors.grey[300]}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Here's what's happening in your system today
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[400] : colors.grey[600]} sx={{ display: { xs: 'none', sm: 'block' } }}>
                Last updated: {new Date().toLocaleTimeString()}
              </Typography>
              <IconButton 
                onClick={refreshDashboard} 
                disabled={refreshing}
                sx={{ 
                  bgcolor: colors.blueAccent?.[500] || '#6870fa',
                  color: 'white',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  '&:hover': { 
                    bgcolor: colors.blueAccent?.[600] || '#535ac8',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <RefreshIcon sx={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
          </Box>
        </Box>
      </Box>

        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 4 }}>
          {/* Top Row - Notifications & Profile Side by Side */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} mb={{ xs: 3, sm: 4 }}>
            {/* Notifications Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3, 
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
                boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
                border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 30px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}25`,
                }
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]}>
                      Reminders & Notifications
                    </Typography>
                    <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]} sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      fontSize: '0.75rem'
                    }}>
                      For More, click to navigate
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                    {data.notifications.map((notification) => (
                      <NotificationCard key={notification.id} notification={notification} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* User Profile Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 3, 
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
                boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
                border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 30px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}25`,
                }
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                    <Box textAlign="center">
                      <Avatar 
                        onClick={() => setProfileModalOpen(true)}
                        sx={{ 
                          width: { xs: 60, sm: 80 }, 
                          height: { xs: 60, sm: 80 }, 
                          mr: 2, 
                          bgcolor: colors.blueAccent?.[500] || '#6870fa',
                          boxShadow: `0 4px 15px ${colors.blueAccent?.[500] || '#6870fa'}30`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 6px 20px ${colors.blueAccent?.[500] || '#6870fa'}40`,
                          }
                        }}
                      >
                        <AccountIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                      </Avatar>
                      {/* Profile Completion Progress */}
                      <Box sx={{ width: { xs: 60, sm: 80 }, mt: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                          <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]} sx={{ fontSize: '0.7rem' }}>
                            Profile
                          </Typography>
                          <Typography variant="caption" color={colors.blueAccent?.[500] || '#6870fa'} fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
                            {data.profile.profileComplete}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={data.profile.profileComplete}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200],
                            '& .MuiLinearProgress-bar': {
                              bgcolor: colors.blueAccent?.[500] || '#6870fa',
                              borderRadius: 2,
                            }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box flex={1} minWidth={200}>
                      <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={1}>
                        {data.profile.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                        <Chip 
                          label={data.profile.role} 
                          size="small" 
                          sx={{ 
                            bgcolor: colors.greenAccent?.[500] || '#4cceac', 
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        {!data.profile.verified && (
                          <Chip 
                            icon={<WarningIcon />}
                            label="Not Verified" 
                            size="small" 
                            color="warning"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

              <Divider sx={{ my: 2, bgcolor: colors.primary[300] }} />

              {/* Contact Information */}
              <Box mb={2}>
                <Typography variant="subtitle2" color={colors.grey[200]} mb={1}>
                  Contact Information
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={{ fontSize: 16, mr: 1, color: colors.grey[300] }} />
                  <Typography variant="body2" color={colors.grey[300]}>
                    {data.profile.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ fontSize: 16, mr: 1, color: colors.grey[300] }} />
                  <Typography variant="body2" color={colors.grey[300]}>
                    {data.profile.phone}
                  </Typography>
                </Box>
                <Typography variant="body2" color={colors.grey[400]}>
                  Last Online: {data.profile.lastOnline}
                </Typography>
              </Box>

              {/* Leave Days */}
              <Box mb={2}>
                <Typography variant="subtitle2" color={colors.grey[200]} mb={1}>
                  Leave Days
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  {data.profile.leaveDays.taken} Leave Days Taken
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  {data.profile.leaveDays.remaining} Remaining Leave Days
                </Typography>
              </Box>

              {/* About */}
              <Box mb={2}>
                <Typography variant="subtitle2" color={colors.grey[200]} mb={1}>
                  About
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  {data.profile.about}
                </Typography>
              </Box>

              {/* Social Media */}
              <Box display="flex" gap={1}>
                <IconButton size="small" sx={{ color: colors.blueAccent[500] }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: colors.blueAccent[500] }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: colors.blueAccent[500] }}>
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

          {/* Active Users Section */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} mb={{ xs: 3, sm: 4 }}>
            <Grid item xs={12}>
              <ActiveUsersCard currentUser={user} />
            </Grid>
          </Grid>

          {/* Tabbed Dashboard */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} mb={{ xs: 3, sm: 4 }}>
            <Grid item xs={12}>
              <DatabaseDrivenTabbedDashboard user={user} dashboardData={data} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      </Box>

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={data.profile}
        onSave={(updatedProfile) => {
          updateProfile(updatedProfile);
          setProfileModalOpen(false);
        }}
      />
    </ErrorBoundary>
  );
};

export default DashboardLandingPage;
