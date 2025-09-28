// src/utils/dataGridTheme.js
// Centralized DataGrid styling based on the current MUI theme and our Professional tokens

export function getThemedDataGridSx(theme, colors, overrides = {}) {
  const isLight = theme.palette.mode === 'light';

  return {
    // Frame
    borderRadius: '12px',
    border: `1px solid ${isLight ? theme.palette.grey[300] : colors.blueAccent[700]}`,

    // Root and cells
    '& .MuiDataGrid-root': { border: 'none' },
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
      color: isLight ? theme.palette.text.primary : undefined,
      fontSize: 13,
      lineHeight: 1.4,
    },

    // Header
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: `${isLight ? colors.blueAccent[100] : colors.blueAccent[700]} !important`,
      borderBottom: `1px solid ${isLight ? '#e0e7ff' : 'transparent'}`,
      minHeight: '48px',
      height: '48px',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: `${isLight ? colors.blueAccent[100] : colors.blueAccent[700]} !important`,
      position: 'relative',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      color: `${isLight ? colors.blueAccent[900] : '#ffffff'} !important`,
      fontWeight: 700,
      letterSpacing: 0.2,
      textTransform: 'none',
      lineHeight: 1.2,
    },
    '& .MuiDataGrid-columnSeparator': {
      color: `${isLight ? colors.blueAccent[300] : colors.grey[300]} !important`,
    },
    // Avoid text overlap with icons
    '& .MuiDataGrid-columnHeaderTitleContainer': {
      paddingRight: '40px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      alignItems: 'center',
    },
    // Icons
    '& .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-menuIcon': {
      position: 'absolute',
      right: 6,
      top: '50%',
      transform: 'translateY(-50%)',
      visibility: 'hidden',
      opacity: 0.9,
      color: isLight ? colors.blueAccent[700] : '#ffffff',
    },
    '& .MuiDataGrid-columnHeader:hover .MuiDataGrid-iconButtonContainer, & .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon': {
      visibility: 'visible',
      opacity: 1,
    },
    '& .MuiDataGrid-sortIcon': {
      position: 'absolute',
      right: 28,
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: 1,
      color: isLight ? colors.blueAccent[700] : '#ffffff',
      pointerEvents: 'none',
      zIndex: 1,
    },

    // Body
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: isLight ? theme.palette.background.paper : colors.primary[400],
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: `${isLight ? '#f5f8ff' : '#101827'} !important`,
    },
    '& .MuiDataGrid-row:nth-of-type(odd)': {
      backgroundColor: `${isLight ? '#fbfdff' : 'transparent'} !important`,
    },

    // Toolbar
    '& .MuiDataGrid-toolbarContainer': {
      p: 1,
      borderBottom: `1px solid ${isLight ? '#e0e7ff' : 'transparent'}`,
      backgroundColor: `${isLight ? colors.blueAccent[100] : 'transparent'}`,
    },

    // Footer / pagination
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none',
      backgroundColor: `${isLight ? colors.blueAccent[100] : colors.blueAccent[700]} !important`,
      color: `${isLight ? colors.blueAccent[900] : '#ffffff'}`,
    },
    '& .MuiTablePagination-toolbar': {
      color: `${isLight ? colors.blueAccent[900] : '#ffffff'}`,
    },
    '& .MuiTablePagination-actions .MuiSvgIcon-root, & .MuiTablePagination-actions .MuiIconButton-root': {
      color: '#ffffff',
    },
    '& .MuiInputBase-root': {
      color: `${isLight ? colors.blueAccent[900] : '#ffffff'}`,
      '& .MuiSvgIcon-root': { color: `${isLight ? colors.blueAccent[900] : '#ffffff'}` },
    },

    // Merge custom overrides last
    ...overrides,
  };
}



