// src/components/DashboardFilters.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    IconButton,
    Typography,
    Collapse,
    Paper // Added Paper for a cleaner filter container
} from '@mui/material';
import { ClearAll as ClearAllIcon, KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import reportsService from '../api/reportsService';

const DashboardFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [open, setOpen] = useState(true); // State for collapse functionality
    const [filterOptions, setFilterOptions] = useState({
        departments: [],
        projectTypes: [],
        projectStatuses: [],
        financialYears: [],
        sections: [],
        subCounties: [],
        wards: []
    });
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const handleToggleCollapse = () => {
        setOpen(!open);
    };

    // Fetch filter options on component mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setIsLoadingOptions(true);
                const options = await reportsService.getFilterOptions();
                setFilterOptions(options);
            } catch (error) {
                console.error('Error fetching filter options:', error);
                // Keep empty arrays as fallback
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchFilterOptions();
    }, []);

    return (
        <Paper elevation={2} sx={{ mb: 4, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: open ? 2 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>FILTER YOUR REPORT BY:</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<ClearAllIcon />}
                        onClick={onClearFilters}
                        sx={{ mr: 1 }}
                    >
                        Clear All Filters
                    </Button>
                    <IconButton onClick={handleToggleCollapse} size="small">
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={open}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    {/* Row 1 */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="cidp-period-label">Filter by CIDP Period</InputLabel>
                        <Select
                            labelId="cidp-period-label"
                            id="cidp-period-select"
                            value={filters.cidpPeriod}
                            label="Filter by CIDP Period"
                            onChange={(e) => onFilterChange('cidpPeriod', e.target.value)}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            <MenuItem value="CIDP 2023-2027">CIDP 2023-2027</MenuItem>
                            <MenuItem value="CIDP 2018-2022">CIDP 2018-2022</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="financial-year-label">Filter by ADP / Financial Year</InputLabel>
                        <Select
                            labelId="financial-year-label"
                            id="financial-year-select"
                            value={filters.financialYear}
                            label="Filter by ADP / Financial Year"
                            onChange={(e) => onFilterChange('financialYear', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.financialYears.map((year) => (
                                <MenuItem key={year.id} value={year.id}>
                                    {year.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        id="start-date"
                        label="Start Date"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ minWidth: 180 }}
                    />
                    <TextField
                        id="end-date"
                        label="End Date"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ minWidth: 180 }}
                    />

                    {/* Row 2 */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="project-type-label">Filter by Project Type</InputLabel>
                        <Select
                            labelId="project-type-label"
                            id="project-type-select"
                            value={filters.projectType}
                            label="Filter by Project Type"
                            onChange={(e) => onFilterChange('projectType', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.projectTypes.map((type) => (
                                <MenuItem key={type.name} value={type.name}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="project-status-label">Filter by Project Status</InputLabel>
                        <Select
                            labelId="project-status-label"
                            id="project-status-select"
                            value={filters.projectStatus}
                            label="Filter by Project Status"
                            onChange={(e) => onFilterChange('projectStatus', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.projectStatuses.map((status) => (
                                <MenuItem key={status.name} value={status.name}>
                                    {status.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="department-label">Filter By Department</InputLabel>
                        <Select
                            labelId="department-label"
                            id="department-select"
                            value={filters.department}
                            label="Filter By Department"
                            onChange={(e) => onFilterChange('department', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.departments.map((dept) => (
                                <MenuItem key={dept.name} value={dept.name}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Row 3 */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="section-label">Filter By Section</InputLabel>
                        <Select
                            labelId="section-label"
                            id="section-select"
                            value={filters.section}
                            label="Filter By Section"
                            onChange={(e) => onFilterChange('section', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.sections.map((section) => (
                                <MenuItem key={section.name} value={section.name}>
                                    {section.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="sub-county-label">Filter By Sub-County</InputLabel>
                        <Select
                            labelId="sub-county-label"
                            id="sub-county-select"
                            value={filters.subCounty}
                            label="Filter By Sub-County"
                            onChange={(e) => onFilterChange('subCounty', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.subCounties.map((subCounty) => (
                                <MenuItem key={subCounty.name} value={subCounty.name}>
                                    {subCounty.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="ward-label">Filter By Ward</InputLabel>
                        <Select
                            labelId="ward-label"
                            id="ward-select"
                            value={filters.ward}
                            label="Filter By Ward"
                            onChange={(e) => onFilterChange('ward', e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {filterOptions.wards.map((ward) => (
                                <MenuItem key={ward.name} value={ward.name}>
                                    {ward.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default DashboardFilters;