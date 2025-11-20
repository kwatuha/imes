import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Assessment,
  Business,
  LocationOn,
  LocationCity
} from '@mui/icons-material';
import { getDepartments, getSubCounties, getWardStats } from '../services/publicApi';

const FilterBar = ({ 
  financialYears, 
  selectedFinYear, 
  onFinYearChange,
  onFiltersChange,
  finYearId 
}) => {
  const [departments, setDepartments] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSubcounty, setSelectedSubcounty] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    // Update wards when subcounty changes
    if (selectedSubcounty) {
      fetchWardsForSubcounty(selectedSubcounty);
    } else {
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedSubcounty]);

  useEffect(() => {
    // Apply filters whenever any filter changes
    const filters = {
      department: selectedDepartment,
      subcounty: selectedSubcounty,
      ward: selectedWard,
      projectSearch: projectSearch.trim()
    };
    onFiltersChange(filters);
  }, [selectedDepartment, selectedSubcounty, selectedWard, projectSearch]); // Remove onFiltersChange from dependencies to prevent infinite loops

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const [deptData, subcountyData] = await Promise.all([
        getDepartments(),
        getSubCounties()
      ]);
      
      setDepartments(deptData || []);
      setSubcounties(subcountyData || []);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWardsForSubcounty = async (subcountyId) => {
    try {
      const wardData = await getWardStats(finYearId);
      // Filter wards by subcounty ID
      const filteredWards = wardData.filter(ward => 
        ward.subcounty_id === subcountyId || ward.subcountyId === subcountyId
      );
      setWards(filteredWards);
    } catch (err) {
      console.error('Error fetching wards:', err);
      setWards([]);
    }
  };

  const handleClearFilters = () => {
    setSelectedDepartment('');
    setSelectedSubcounty('');
    setSelectedWard('');
    setProjectSearch('');
  };

  const hasActiveFilters = selectedDepartment || selectedSubcounty || selectedWard || projectSearch.trim();

  return (
    <Paper sx={{ mb: 4, borderRadius: 2, p: 3 }} elevation={2}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <FilterList color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Dashboard Filters
        </Typography>
        {hasActiveFilters && (
          <Chip 
            label="Filters Active" 
            color="primary" 
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      <Grid container spacing={3} alignItems="center">
        {/* Financial Year Dropdown */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="financial-year-label">Financial Year</InputLabel>
            <Select
              labelId="financial-year-label"
              value={selectedFinYear === null ? 'all' : (selectedFinYear?.id || '')}
              label="Financial Year"
              onChange={(e) => {
                if (e.target.value === 'all') {
                  onFinYearChange(null); // null means "All"
                } else {
                  const fy = financialYears.find(f => f.id === e.target.value);
                  onFinYearChange(fy);
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Assessment sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">
                <Typography variant="body2" fontWeight="bold">
                  All Financial Years
                </Typography>
              </MenuItem>
              {financialYears.map((fy) => (
                <MenuItem key={fy.id} value={fy.id}>
                  <Typography variant="body2">
                    {fy.name} ({fy.project_count || 0} projects)
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Department Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              value={selectedDepartment}
              label="Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Business sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>All Departments</em>
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.departmentId || dept.id} value={dept.departmentId || dept.id}>
                  <Typography variant="body2" noWrap>
                    {dept.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Subcounty Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="subcounty-label">Subcounty</InputLabel>
            <Select
              labelId="subcounty-label"
              value={selectedSubcounty}
              label="Subcounty"
              onChange={(e) => setSelectedSubcounty(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>All Subcounties</em>
              </MenuItem>
              {subcounties.map((subcounty) => (
                <MenuItem key={subcounty.subcountyId || subcounty.id} value={subcounty.subcountyId || subcounty.id}>
                  <Typography variant="body2" noWrap>
                    {subcounty.name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ward Filter */}
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small" disabled={!selectedSubcounty}>
            <InputLabel id="ward-label">Ward</InputLabel>
            <Select
              labelId="ward-label"
              value={selectedWard}
              label="Ward"
              onChange={(e) => setSelectedWard(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LocationCity sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>All Wards</em>
              </MenuItem>
              {wards.map((ward) => (
                <MenuItem key={ward.wardId || ward.id} value={ward.wardId || ward.id}>
                  <Typography variant="body2" noWrap>
                    {ward.name || ward.ward_name}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Project Search */}
        <Grid item xs={12} sm={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Search Projects"
            placeholder="Type project name..."
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: projectSearch && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setProjectSearch('')}
                    edge="end"
                  >
                    <Clear sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Clear Filters Button */}
        <Grid item xs={12} sm={12} md={1}>
          <Box display="flex" justifyContent="center">
            <IconButton
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              sx={{
                backgroundColor: hasActiveFilters ? 'error.light' : 'grey.200',
                color: hasActiveFilters ? 'white' : 'grey.500',
                '&:hover': {
                  backgroundColor: hasActiveFilters ? 'error.main' : 'grey.300'
                }
              }}
            >
              <Clear />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Active Filters:
            </Typography>
            {selectedDepartment && (
              <Chip
                label={`Department: ${departments.find(d => (d.departmentId || d.id) === selectedDepartment)?.name}`}
                size="small"
                onDelete={() => setSelectedDepartment('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedSubcounty && (
              <Chip
                label={`Subcounty: ${subcounties.find(s => (s.subcountyId || s.id) === selectedSubcounty)?.name}`}
                size="small"
                onDelete={() => setSelectedSubcounty('')}
                color="secondary"
                variant="outlined"
              />
            )}
            {selectedWard && (
              <Chip
                label={`Ward: ${wards.find(w => (w.wardId || w.id) === selectedWard)?.name || wards.find(w => (w.wardId || w.id) === selectedWard)?.ward_name}`}
                size="small"
                onDelete={() => setSelectedWard('')}
                color="info"
                variant="outlined"
              />
            )}
            {projectSearch && (
              <Chip
                label={`Search: "${projectSearch}"`}
                size="small"
                onDelete={() => setProjectSearch('')}
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default FilterBar;
