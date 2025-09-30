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
import regionalService from '../api/regionalService';
import { DEFAULT_COUNTY, DEFAULT_SUBCOUNTY } from '../configs/appConfig';

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
    const [availableSubCounties, setAvailableSubCounties] = useState([]);
    const [availableWards, setAvailableWards] = useState([]);

    const handleToggleCollapse = () => {
        setOpen(!open);
    };

    // Fetch filter options on component mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setIsLoadingOptions(true);
                console.log('Fetching filter options...');
                const options = await reportsService.getFilterOptions();
                console.log('Filter options received:', options);
                setFilterOptions(options);
                
                // Load sub-counties for the default county
                await loadSubCountiesForCounty(DEFAULT_COUNTY.countyId);
                
                // Load wards for the default sub-county using the same logic as sub-county changes
                console.log('Loading initial wards for default sub-county:', DEFAULT_SUBCOUNTY.name);
                await loadWardsForSubCountyByName(DEFAULT_SUBCOUNTY.name);
            } catch (error) {
                console.error('Error fetching filter options:', error);
                // Keep empty arrays as fallback
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchFilterOptions();
    }, []);

    // Load sub-counties for a specific county
    const loadSubCountiesForCounty = async (countyId) => {
        try {
            const response = await regionalService.getSubCountiesData({ countyId });
            setAvailableSubCounties(response.subCounties || []);
        } catch (error) {
            console.error('Error fetching sub-counties:', error);
            setAvailableSubCounties([]);
        }
    };

    // Load wards for a specific sub-county by name
    const loadWardsForSubCountyByName = async (subCountyName) => {
        try {
            console.log('=== WARD LOADING DEBUG ===');
            console.log('Loading wards for sub-county name:', subCountyName);
            console.log('API Query: regionalService.getWardsData({ subCounty: "' + subCountyName + '" })');
            
            const response = await regionalService.getWardsData({ subCounty: subCountyName });
            console.log('Wards response with name:', response);
            const wards = response.wards || [];
            console.log('Wards count from API:', wards.length);
            
            // Show sample ward data to verify structure
            if (wards.length > 0) {
                console.log('Sample ward data:', wards[0]);
                console.log('All ward sub-county names:', wards.map(w => w.subcountyName));
            }
            
            // Filter wards by sub-county name as a fallback if API doesn't filter
            const filteredWards = wards.filter(ward => 
                ward.subcountyName === subCountyName
            );
            console.log('Filtered wards count:', filteredWards.length);
            console.log('Filtered ward names:', filteredWards.map(w => w.wardName));
            console.log('=== END WARD LOADING DEBUG ===');
            
            setAvailableWards(filteredWards);
        } catch (error) {
            console.error('Error fetching wards with subCounty name:', error);
            setAvailableWards([]);
        }
    };

    // Load wards for a specific sub-county by ID
    const loadWardsForSubCounty = async (subCountyId) => {
        try {
            console.log('Loading wards for sub-county ID:', subCountyId);
            // Try with subCountyId first, then fallback to subCounty name
            const response = await regionalService.getWardsData({ subCountyId });
            console.log('Wards response:', response);
            const wards = response.wards || [];
            console.log('Wards count from API:', wards.length);
            
            // Filter wards by sub-county name as a fallback if API doesn't filter
            const subCountyName = availableSubCounties.find(sc => sc.subcountyId === subCountyId)?.subcountyName;
            if (subCountyName) {
                const filteredWards = wards.filter(ward => 
                    ward.subcountyName === subCountyName
                );
                console.log('Filtered wards count:', filteredWards.length);
                setAvailableWards(filteredWards);
            } else {
                setAvailableWards(wards);
            }
        } catch (error) {
            console.error('Error fetching wards with subCountyId:', error);
            // Try with subCounty name as fallback
            try {
                const subCountyName = availableSubCounties.find(sc => sc.subcountyId === subCountyId)?.subcountyName;
                if (subCountyName) {
                    console.log('Trying with sub-county name:', subCountyName);
                    const response = await regionalService.getWardsData({ subCounty: subCountyName });
                    console.log('Wards response with name:', response);
                    const wards = response.wards || [];
                    // Filter wards by sub-county name as a fallback if API doesn't filter
                    const filteredWards = wards.filter(ward => 
                        ward.subcountyName === subCountyName
                    );
                    console.log('Filtered wards count with name:', filteredWards.length);
                    setAvailableWards(filteredWards);
                } else {
                    setAvailableWards([]);
                }
            } catch (nameError) {
                console.error('Error fetching wards with subCounty name:', nameError);
                setAvailableWards([]);
            }
        }
    };

    // Handle sub-county change
    const handleSubCountyChange = (subCountyName) => {
        console.log('Sub-county changed to:', subCountyName);
        onFilterChange('subCounty', subCountyName);
        onFilterChange('ward', ''); // Clear ward selection
        
        if (!subCountyName) {
            console.log('No sub-county selected, clearing wards');
            setAvailableWards([]);
            return;
        }
        
        // Load wards for the selected sub-county
        loadWardsForSubCountyByName(subCountyName);
    };

    // Debug logging
    console.log('DashboardFilters render - filterOptions:', filterOptions);
    console.log('DashboardFilters render - isLoadingOptions:', isLoadingOptions);
    console.log('DashboardFilters render - filters:', filters);
    console.log('DashboardFilters render - availableSubCounties:', availableSubCounties);
    console.log('DashboardFilters render - availableWards:', availableWards);
    console.log('DashboardFilters render - availableWards length:', availableWards.length);
    console.log('DashboardFilters render - current subCounty filter:', filters.subCounty);

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
                    {/* County Display */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="county-label">County</InputLabel>
                        <Select
                            labelId="county-label"
                            id="county-select"
                            value={DEFAULT_COUNTY.name}
                            label="County"
                            disabled={true}
                        >
                            <MenuItem value={DEFAULT_COUNTY.name}>
                                {DEFAULT_COUNTY.name}
                            </MenuItem>
                        </Select>
                    </FormControl>

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
                            onChange={(e) => handleSubCountyChange(e.target.value)}
                            disabled={isLoadingOptions}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {availableSubCounties.map((subCounty) => (
                                <MenuItem key={subCounty.subcountyId} value={subCounty.subcountyName}>
                                    {subCounty.subcountyName}
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
                            disabled={isLoadingOptions || availableWards.length === 0}
                        >
                            <MenuItem value=""><em>All</em></MenuItem>
                            {availableWards.map((ward) => (
                                <MenuItem key={ward.wardId} value={ward.wardName}>
                                    {ward.wardName}
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