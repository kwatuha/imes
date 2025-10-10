import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { Assignment as ProjectIcon } from '@mui/icons-material';

/**
 * Project Metrics Card Component
 * 
 * Overview of project statistics including total, active, 
 * and completed projects with progress indicators.
 */
const ProjectMetricsCard = ({ user, showDetails = true }) => {
  // Mock data - in real implementation, this would come from props or API
  const metrics = {
    totalProjects: 156,
    activeProjects: 89,
    completedProjects: 67,
    completionRate: 43,
    onTrackProjects: 72,
    delayedProjects: 17
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Project Metrics
          </Typography>
          <ProjectIcon color="primary" />
        </Box>
        
        <Box mb={2}>
          <Typography variant="h4" component="div" color="primary" fontWeight="bold">
            {metrics.totalProjects}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Projects
          </Typography>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">Completion Rate</Typography>
            <Typography variant="body2" fontWeight="bold">
              {metrics.completionRate}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={metrics.completionRate} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {showDetails && (
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip 
              label={`${metrics.activeProjects} Active`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${metrics.completedProjects} Completed`} 
              size="small" 
              color="success" 
              variant="outlined"
            />
            <Chip 
              label={`${metrics.onTrackProjects} On Track`} 
              size="small" 
              color="info" 
              variant="outlined"
            />
            {metrics.delayedProjects > 0 && (
              <Chip 
                label={`${metrics.delayedProjects} Delayed`} 
                size="small" 
                color="warning" 
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMetricsCard;







