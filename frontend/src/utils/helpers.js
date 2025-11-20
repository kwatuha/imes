// src/utils/helpers.js
export const checkUserPrivilege = (user, privilegeName) => {
  return user && user.privileges && Array.isArray(user.privileges) && user.privileges.includes(privilegeName);
};

export const formatBooleanForDisplay = (value) => {
  if (value === true || value === 'true') {
    return 'Yes';
  }
  if (value === false || value === 'false') {
    return 'No';
  }
  return 'N/A';
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'N/A';
  }
  return `KES ${numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatNumberForInput = (value) => {
  if (value === null || value === undefined || typeof value !== 'number') {
    return '';
  }
  return value.toLocaleString('en-US');
};

export const parseNumberFromFormattedInput = (value) => {
  const sanitizedValue = value.replace(/,/g, '');
  if (sanitizedValue === '') {
    return null;
  }
  const parsedValue = Number(sanitizedValue);
  return isNaN(parsedValue) ? value : parsedValue; // Return original string if not a valid number
};

export const getStatusChipColor = (status) => {
  if (!status) return 'primary';
  
  // Normalize status to title case for consistent matching
  const normalizeStatus = (s) => {
    if (!s) return '';
    return s.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const normalizedStatus = normalizeStatus(status);
  
  switch (normalizedStatus) {
    case 'Completed': return 'success';
    case 'At Risk': return 'error';
    case 'In Progress': return 'info';
    case 'On Hold': return 'warning';
    case 'Draft': return 'default';
    case 'Ongoing': return 'info';
    case 'Stalled': return 'warning';
    case 'Under Procurement': return 'info';
    default: return 'primary';
  }
};

export const getRiskChipColor = (risk) => {
  switch (risk) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
  }
};

export const CARD_CONTENT_MAX_HEIGHT = '350px';
export const riskLevels = ['High', 'Medium', 'Low'];
export const financingSources = ['GoK only', 'Development partner only', 'GoK and development partner', 'Public-private partnership', 'Private sector only'];
export const screeningOutcomes = ['No Environment Social Impact Assessment required', 'Environment Social Impact Assessment required', 'RAP category required (RAP)'];