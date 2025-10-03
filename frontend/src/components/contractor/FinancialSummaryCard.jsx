import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon,
  Schedule as PendingIcon,
} from '@mui/icons-material';
import { tokens } from '../../pages/dashboard/theme';

const FinancialSummaryCard = ({ currentUser }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Mock financial summary data
  const financialData = {
    totalEarnings: 450000,
    pendingPayments: 85000,
    completedPayments: 365000,
    monthlyEarnings: 125000,
    averagePayment: 37500,
    paymentSuccessRate: 95,
    onTimePaymentRate: 88,
    totalInvoices: 12,
    paidInvoices: 11,
    pendingInvoices: 1,
    overdueInvoices: 0,
    monthlyGrowth: 15,
    quarterlyGrowth: 25,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return colors.greenAccent?.[500] || '#4caf50';
    if (growth < 0) return colors.redAccent?.[500] || '#f44336';
    return colors.grey[400];
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUpIcon />;
    if (growth < 0) return <TrendingDownIcon />;
    return null;
  };

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 3, 
      bgcolor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[50],
      boxShadow: `0 4px 20px ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}15`,
      border: `1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}30`,
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: colors.greenAccent?.[500] || '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MoneyIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]}>
              Financial Summary
            </Typography>
            <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
              Earnings and payment overview
            </Typography>
          </Box>
        </Box>

        {/* Key Financial Metrics */}
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(140px, 1fr))" gap={2} mb={3}>
          <Box sx={{ 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100], 
            borderRadius: 2,
            border: `1px solid ${colors.greenAccent?.[500] || '#4caf50'}30`,
            textAlign: 'center'
          }}>
            <Typography variant="h5" color={colors.greenAccent?.[500] || '#4caf50'} fontWeight="bold">
              {formatCurrency(financialData.totalEarnings)}
            </Typography>
            <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
              Total Earnings
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100], 
            borderRadius: 2,
            border: `1px solid ${colors.yellowAccent?.[500] || '#ff9800'}30`,
            textAlign: 'center'
          }}>
            <Typography variant="h5" color={colors.yellowAccent?.[500] || '#ff9800'} fontWeight="bold">
              {formatCurrency(financialData.pendingPayments)}
            </Typography>
            <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
              Pending Payments
            </Typography>
          </Box>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100], 
            borderRadius: 2,
            border: `1px solid ${colors.blueAccent?.[500] || '#2196f3'}30`,
            textAlign: 'center'
          }}>
            <Typography variant="h5" color={colors.blueAccent?.[500] || '#2196f3'} fontWeight="bold">
              {formatCurrency(financialData.monthlyEarnings)}
            </Typography>
            <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
              This Month
            </Typography>
          </Box>
        </Box>

        {/* Growth Indicators */}
        <Box sx={{ mb: 3, p: 2, bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100], borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Growth Trends
          </Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
              Monthly Growth
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {getGrowthIcon(financialData.monthlyGrowth)}
              <Typography variant="body2" color={getGrowthColor(financialData.monthlyGrowth)} fontWeight="bold">
                +{financialData.monthlyGrowth}%
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
              Quarterly Growth
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              {getGrowthIcon(financialData.quarterlyGrowth)}
              <Typography variant="body2" color={getGrowthColor(financialData.quarterlyGrowth)} fontWeight="bold">
                +{financialData.quarterlyGrowth}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Payment Performance */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Payment Performance
          </Typography>
          
          {/* Payment Success Rate */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                Payment Success Rate
              </Typography>
              <Typography variant="body2" color={colors.greenAccent?.[500] || '#4caf50'} fontWeight="bold">
                {financialData.paymentSuccessRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={financialData.paymentSuccessRate}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: colors.greenAccent?.[500] || '#4caf50',
                  borderRadius: 3,
                }
              }}
            />
          </Box>

          {/* On-Time Payment Rate */}
          <Box mb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
                On-Time Payment Rate
              </Typography>
              <Typography variant="body2" color={colors.blueAccent?.[500] || '#2196f3'} fontWeight="bold">
                {financialData.onTimePaymentRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={financialData.onTimePaymentRate}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: colors.blueAccent?.[500] || '#2196f3',
                  borderRadius: 3,
                }
              }}
            />
          </Box>
        </Box>

        {/* Invoice Summary */}
        <Box sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.primary[100], borderRadius: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" color={theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[900]} mb={2}>
            Invoice Summary
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box textAlign="center">
              <Typography variant="h6" color={colors.greenAccent?.[500] || '#4caf50'} fontWeight="bold">
                {financialData.paidInvoices}
              </Typography>
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                Paid Invoices
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h6" color={colors.yellowAccent?.[500] || '#ff9800'} fontWeight="bold">
                {financialData.pendingInvoices}
              </Typography>
              <Typography variant="caption" color={theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[600]}>
                Pending Invoices
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} pt={2} borderTop={`1px solid ${theme.palette.mode === 'dark' ? colors.primary[300] : colors.primary[200]}`}>
            <Typography variant="body2" color={theme.palette.mode === 'dark' ? colors.grey[200] : colors.grey[700]}>
              Total Invoices: {financialData.totalInvoices}
            </Typography>
            <Typography variant="body2" color={colors.blueAccent?.[500] || '#2196f3'} fontWeight="bold">
              Avg: {formatCurrency(financialData.averagePayment)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FinancialSummaryCard;





