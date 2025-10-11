// Format currency in KES (Kenyan Shillings)
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'Ksh 0';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format number with commas, no currency symbol
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
  
  return `Ksh ${formatted}`;
};

// Format large numbers with commas
export const formatNumber = (num) => {
  if (!num || num === 0) return '0';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  return new Intl.NumberFormat('en-US').format(number);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Format percentage
export const formatPercentage = (value) => {
  if (!value || value === 0) return '0%';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(1)}%`;
};

// Get status color
export const getStatusColor = (status) => {
  const statusColors = {
    'Completed': '#4caf50',
    'Ongoing': '#2196f3',
    'Not Started': '#ff9800',
    'Under Procurement': '#9c27b0',
    'Stalled': '#f44336',
    'Cancelled': '#757575',
  };
  
  return statusColors[status] || '#757575';
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


