import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatCurrency, formatNumber } from '../utils/formatters';

const StatCard = ({ title, count, budget, color, icon: Icon, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%',
        borderTop: `4px solid ${color}`,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
          ...(onClick && {
            boxShadow: 8,
            '& .view-details': {
              opacity: 1
            }
          })
        }
      }}
      className="fade-in"
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ fontSize: 32, color }} />
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          gutterBottom
          sx={{ color: color }}
        >
          {formatNumber(count)}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Budget: {formatCurrency(budget)}
        </Typography>
        
        {onClick && (
          <Typography 
            variant="caption" 
            className="view-details"
            sx={{ 
              mt: 1,
              display: 'block',
              color: color,
              fontWeight: 600,
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            Click to view projects →
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

