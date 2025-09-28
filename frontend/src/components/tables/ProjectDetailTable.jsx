import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    TablePagination,
    Chip,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Collapse,
    TableFooter,
    LinearProgress,
    Fade
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    TrendingUp,
    TrendingDown,
    Warning,
    CheckCircle,
    Schedule,
    AttachMoney,
    Business
} from '@mui/icons-material';
import { getProjectStatusBackgroundColor } from '../../utils/projectStatusColors';

const ProjectDetailTable = ({ 
    data, 
    columns, 
    title, 
    onRowClick,
    showDepartmentGrouping = false,
    exportable = true 
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('');
    const [order, setOrder] = useState('asc');
    const [expandedRows, setExpandedRows] = useState({});

    // Handle sorting
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle row expansion
    const handleExpandRow = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    // Sort data
    const sortedData = useMemo(() => {
        if (!orderBy) return data;
        
        return [...data].sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];
            
            // Handle numeric values
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            // Handle string values
            aValue = String(aValue || '').toLowerCase();
            bValue = String(bValue || '').toLowerCase();
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, orderBy, order]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    // Render status chip
    const renderStatusChip = (status) => (
        <Chip
            label={status}
            size="small"
            sx={{
                backgroundColor: getProjectStatusBackgroundColor(status),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem'
            }}
        />
    );

    // Render progress bar
    const renderProgressBar = (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '100px' }}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{
                    flexGrow: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: value >= 80 ? '#4caf50' : value >= 50 ? '#ff9800' : '#f44336',
                        borderRadius: 3
                    }
                }}
            />
            <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: '35px' }}>
                {typeof value === 'number' ? value.toFixed(2) : value}%
            </Typography>
        </Box>
    );

    // Render currency
    const renderCurrency = (amount) => {
        if (amount >= 1000000) {
            return `KSh ${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `KSh ${(amount / 1000).toFixed(0)}K`;
        } else {
            return `KSh ${amount?.toLocaleString() || '0'}`;
        }
    };

    // Render cell content based on column type
    const renderCellContent = (row, column) => {
        const value = row[column.id];
        
        switch (column.type) {
            case 'status':
                return renderStatusChip(value);
            case 'progress':
                return renderProgressBar(value);
            case 'currency':
                return renderCurrency(value);
            case 'number':
                return value?.toLocaleString() || '0';
            default:
                return value || '-';
        }
    };

    return (
        <Fade in timeout={800}>
            <Paper sx={{ 
                width: '100%', 
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
            }}>
                {/* Table Header */}
                <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Detailed view of {data.length} records
                    </Typography>
                </Box>

                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                {showDepartmentGrouping && (
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: '50px' }}>
                                        Expand
                                    </TableCell>
                                )}
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        sx={{ 
                                            fontWeight: 'bold',
                                            minWidth: column.minWidth || '100px',
                                            backgroundColor: 'rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row, index) => (
                                <React.Fragment key={row.id || index}>
                                    <TableRow 
                                        hover
                                        onClick={() => onRowClick?.(row)}
                                        sx={{ 
                                            cursor: onRowClick ? 'pointer' : 'default',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0,0,0,0.04)'
                                            }
                                        }}
                                    >
                                        {showDepartmentGrouping && (
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleExpandRow(row.id);
                                                    }}
                                                >
                                                    {expandedRows[row.id] ? <ExpandLess /> : <ExpandMore />}
                                                </IconButton>
                                            </TableCell>
                                        )}
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {renderCellContent(row, column)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    
                                    {/* Expandable row content for department grouping */}
                                    {showDepartmentGrouping && expandedRows[row.id] && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length + 1} sx={{ py: 0 }}>
                                                <Collapse in={expandedRows[row.id]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                            Projects in {row.department}
                                                        </Typography>
                                                        {/* Render sub-projects here */}
                                                        <Typography variant="body2" color="text.secondary">
                                                            Individual project details would be displayed here
                                                        </Typography>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '1px solid rgba(0,0,0,0.1)',
                        backgroundColor: 'rgba(0,0,0,0.02)'
                    }}
                />
            </Paper>
        </Fade>
    );
};

export default ProjectDetailTable;
