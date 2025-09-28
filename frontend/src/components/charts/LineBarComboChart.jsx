// src/components/charts/LineBarComboChart.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const LineBarComboChart = ({
    title, data, barKeys, xAxisKey, yAxisLabelLeft
}) => {
    // Helper function to format currency
    const formatCurrencyCompact = (value) => {
        if (value === 0) return 'KES 0';
        if (!value) return '';
        const absValue = Math.abs(value);
        if (absValue >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`;
        if (absValue >= 1000) return `KES ${(value / 1000).toFixed(0)}K`;
        return `KES ${value.toFixed(0)}`;
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '200px'
                }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333' }}>
                        {dataItem.departmentName || label}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '14px' }}>
                            <span style={{ fontWeight: 'bold' }}>{entry.name}:</span> {formatCurrencyCompact(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
            
            {/* Set explicit height for the ResponsiveContainer */}
            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                    data={data}
                    // Optimized margins for better scalability
                    margin={{ top: 20, right: 20, left: 20, bottom: data.length > 5 ? 100 : 80 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    {/* X-Axis with rotated labels - optimized for more departments */}
                    <XAxis
                        dataKey={xAxisKey}
                        angle={-45}
                        textAnchor="end"
                        height={data.length > 5 ? 120 : 100} 
                        interval={0}
                        fontSize={data.length > 8 ? 10 : 12}
                        tick={{ fontSize: data.length > 8 ? 10 : 12 }}
                    />

                    {/* Y-Axis with formatted labels */}
                    <YAxis
                        yAxisId="left"
                        label={{ value: yAxisLabelLeft, angle: -90, position: 'insideLeft', dx: -10 }}
                        tickFormatter={formatCurrencyCompact}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Legend with fixed position */}
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                    />

                    {/* Bars */}
                    {barKeys.map((key, index) => (
                        <Bar
                            key={key}
                            yAxisId="left"
                            dataKey={key}
                            fill={['#1f77b4', '#ff7f0e', '#2ca02c'][index % 3]}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default LineBarComboChart;