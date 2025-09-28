// src/components/charts/CircularChart.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const CircularChart = ({ title, data, type }) => {
    const chartData = data.map((item) => ({
        ...item,
        name: item.name || item.status,
        value: item.value || item.count,
        // Use project status color if no color is provided and this looks like a status
        // This ensures consistent colors across the application for project statuses
        color: item.color || (item.name && getProjectStatusBackgroundColor(item.name)) || '#8884d8'
    }));

    const innerRadius = type === 'donut' ? 10 : 0;
    const outerRadius = 80;
    const colors = chartData.map(item => item.color);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
            
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        paddingAngle={5}
                        // Only show labels for donut chart if desired, or adjust for pie chart
                        label={type === 'donut' ? ({ name, percent }) => `${(percent * 100).toFixed(0)}%` : undefined} 
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {/* Legend correctly positioned */}
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }} // Add padding to separate from chart
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CircularChart;