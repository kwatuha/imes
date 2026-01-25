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
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
            {title}
          </Typography>
          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ fontSize: 24, color }} />
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom
          sx={{ color: color, fontSize: '1.5rem', mb: 0.5 }}
        >
          {formatNumber(count)}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.75rem' }}>
          Budget: {formatCurrency(budget)}
        </Typography>
        
        {onClick && (
          <Typography 
            variant="caption" 
            className="view-details"
            sx={{ 
              mt: 0.5,
              display: 'block',
              color: color,
              fontWeight: 600,
              opacity: 0,
              transition: 'opacity 0.3s ease',
              fontSize: '0.7rem'
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

