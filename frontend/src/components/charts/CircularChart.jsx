// src/components/charts/CircularChart.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getProjectStatusBackgroundColor } from '../../utils/projectStatusColors';

// Custom Tooltip for better readability
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const dataItem = payload[0].payload;
        return (
            <Box sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{dataItem.name}</Typography>
                <Typography variant="body2">{`Value: ${dataItem.value}`}</Typography>
            </Box>
        );
    }
    return null;
};

// Custom Legend Component that wraps
const CustomLegend = ({ data }) => {
    return (
        <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '6px 10px',
            px: 0.5
        }}>
            {data.map((entry, index) => (
                <Box 
                    key={`legend-${index}`}
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.4,
                    }}
                >
                    <Box 
                        sx={{ 
                            width: 9, 
                            height: 9, 
                            backgroundColor: entry.color,
                            borderRadius: '2px',
                            flexShrink: 0
                        }} 
                    />
                    <Typography variant="caption" sx={{ fontSize: '9px', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                        {entry.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

const CircularChart = ({ title, data, type }) => {
    const chartData = data.map((item) => ({
        ...item,
        name: item.name || item.status,
        value: item.value || item.count,
        // Use project status color if no color is provided and this looks like a status
        // This ensures consistent colors across the application for project statuses
        color: item.color || (item.name && getProjectStatusBackgroundColor(item.name)) || '#8884d8'
    }));

    // Calculate responsive radius based on container size
    const innerRadius = type === 'donut' ? 15 : 0;
    const colors = chartData.map(item => item.color);

    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', overflow: 'visible', p: 0.5 }}>
            {title && (
                <Typography variant="h6" align="center" sx={{ mb: 1, flexShrink: 0 }}>
                    {title}
                </Typography>
            )}
            
            <Box sx={{ 
                width: '100%', 
                flex: '1 1 auto', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'stretch', 
                justifyContent: 'space-between', 
                minHeight: 0,
                overflow: 'visible',
                position: 'relative'
            }}>
                <Box sx={{ 
                    width: '100%', 
                    flex: '1 1 auto', 
                    minHeight: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 1
                }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius="40%"
                                outerRadius="75%"
                                fill="#8884d8"
                                paddingAngle={3}
                                // Only show labels for donut chart if desired, or adjust for pie chart
                                label={type === 'donut' ? ({ name, percent }) => `${(percent * 100).toFixed(0)}%` : undefined} 
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
                <Box sx={{ flexShrink: 0, mt: 1 }}>
                    <CustomLegend data={chartData} />
                </Box>
            </Box>
        </Box>
    );
};

export default CircularChart;