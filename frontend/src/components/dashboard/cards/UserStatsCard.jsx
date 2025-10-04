import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { People as PeopleIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';

/**
 * User Statistics Card Component
 * 
 * Displays user registration statistics including total users,
 * active users, and growth metrics with visual indicators.
 */
const UserStatsCard = ({ user, showGrowth = true, timeRange = '30d' }) => {
  // Mock data - in real implementation, this would come from props or API
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    newUsers: 45,
    growthRate: 12.5
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            User Statistics
          </Typography>
          <PeopleIcon color="primary" />
        </Box>
        
        <Box mb={2}>
          <Typography variant="h4" component="div" color="primary" fontWeight="bold">
            {stats.totalUsers.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Users
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6" color="success.main">
              {stats.activeUsers.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active Users
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="h6" color="info.main">
              {stats.newUsers}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              New ({timeRange})
            </Typography>
          </Box>
        </Box>

        {showGrowth && (
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon fontSize="small" color="success" />
            <Chip 
              label={`+${stats.growthRate}%`} 
              size="small" 
              color="success" 
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;




