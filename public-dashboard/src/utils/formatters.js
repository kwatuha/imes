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

// Get status color (case-insensitive)
export const getStatusColor = (status) => {
  if (!status) return '#757575';
  
  // Normalize status to title case for consistent matching
  const normalizeStatus = (s) => {
    if (!s) return '';
    // Convert to lowercase first, then capitalize first letter of each word
    return s.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const normalizedStatus = normalizeStatus(status);
  
  const statusColors = {
    'Completed': '#4caf50',
    'Ongoing': '#2196f3',
    'Not Started': '#ff9800',
    'Under Procurement': '#9c27b0',
    'Stalled': '#f44336',
    'Cancelled': '#757575',
    'In Progress': '#2196f3',
    'At Risk': '#f44336',
    'Delayed': '#f44336',
    'Initiated': '#ff9800',
    'Closed': '#757575',
    // Handle phased statuses (will be matched via normalized status)
    'Phase I Completed': '#4caf50',
    'Phase Ii Completed': '#4caf50',
    'Phase Iii Completed': '#4caf50',
    'Phase Iv Completed': '#4caf50',
    'Phase I Ongoing': '#2196f3',
    'Phase Ii Ongoing': '#2196f3',
    'Phase Iii Ongoing': '#2196f3',
    'Phase Iv Ongoing': '#2196f3',
    'Phase I Ongoing (Foundation)': '#2196f3',
  };
  
  // Try exact match first, then normalized match
  return statusColors[status] || statusColors[normalizedStatus] || '#757575';
};

// Format status to sentence case (Title Case) for better display
export const formatStatus = (status) => {
  if (!status) return '';
  
  // Convert to title case: first letter of each word capitalized, rest lowercase
  return status
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Handle special cases like "I", "II", "III", "IV" in phased statuses
      // Check if previous word is "phase" to identify Roman numerals
      const isRomanNumeral = (index > 0 && array[index - 1] === 'phase') && 
                             (word === 'i' || word === 'ii' || word === 'iii' || word === 'iv');
      
      if (isRomanNumeral) {
        return word.toUpperCase();
      }
      
      // Handle words in parentheses - capitalize first letter after opening paren
      if (word.startsWith('(')) {
        const afterParen = word.slice(1);
        return '(' + afterParen.charAt(0).toUpperCase() + afterParen.slice(1);
      }
      
      // Capitalize first letter of word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};


