import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  LocationCity,
  Visibility,
  TrendingUp,
  ExpandMore
} from '@mui/icons-material';
import WardProjectsModal from './WardProjectsModal';
import { getWardStats } from '../services/publicApi';
import { formatCurrency } from '../utils/formatters';

const WardSummaryTable = ({ finYearId, filters = {} }) => {
  const theme = useTheme();
  const [wardsBySubCounty, setWardsBySubCounty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSubCounty, setExpandedSubCounty] = useState(null);

  useEffect(() => {
    fetchWardStats();
  }, [finYearId, filters]);

  const fetchWardStats = async () => {
    try {
      setLoading(true);
      const data = await getWardStats(finYearId, filters);
      
      // Group wards by sub-county
      const grouped = (data || []).reduce((acc, ward) => {
        const subCountyName = ward.subcounty_name || 'Unassigned';
        if (!acc[subCountyName]) {
          acc[subCountyName] = {
            subCountyName,
            wards: [],
            totalProjects: 0,
            totalBudget: 0
          };
        }
        acc[subCountyName].wards.push(ward);
        acc[subCountyName].totalProjects += ward.project_count || 0;
        acc[subCountyName].totalBudget += parseFloat(ward.total_budget) || 0;
        return acc;
      }, {});
      
      // Sort wards within each subcounty by project count
      Object.values(grouped).forEach(subCounty => {
        subCounty.wards.sort((a, b) => (b.project_count || 0) - (a.project_count || 0));
      });
      
      setWardsBySubCounty(grouped);
      setError(null);
      
      // Auto-expand first sub-county
      const firstSubCounty = Object.keys(grouped)[0];
      if (firstSubCounty) {
        setExpandedSubCounty(firstSubCounty);
      }
    } catch (err) {
      console.error('Error fetching ward stats:', err);
      setError('Failed to load ward statistics');
      setWardsBySubCounty({});
    } finally {
      setLoading(false);
    }
  };

  const handleWardClick = (ward) => {
    setSelectedWard(ward);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWard(null);
  };

  const handleAccordionChange = (subCountyName) => (event, isExpanded) => {
    setExpandedSubCounty(isExpanded ? subCountyName : null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const subCounties = Object.values(wardsBySubCounty);
  
  if (subCounties.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <LocationCity sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No ward data available
        </Typography>
      </Paper>
    );
  }

  // Calculate grand totals
  const grandTotals = subCounties.reduce((acc, sc) => ({
    projects: acc.projects + sc.totalProjects,
    budget: acc.budget + sc.totalBudget,
    wards: acc.wards + sc.wards.length
  }), { projects: 0, budget: 0, wards: 0 });

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocationCity color="secondary" />
          <Typography variant="h5" fontWeight="bold">
            Ward-Level Project Distribution
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Projects distributed across {grandTotals.wards} wards in {subCounties.length} sub-counties
        </Typography>
        <Typography variant="caption" color="text.secondary" fontStyle="italic">
          Click on any sub-county to expand and view wards, then click a ward to see its projects
        </Typography>
      </Box>

      {/* Grand Total Summary Card */}
      <Paper 
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box display="flex" justifyContent="space-around" alignItems="center" flexWrap="wrap" gap={2}>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold">
              {grandTotals.wards}
            </Typography>
            <Typography variant="body2">
              Total Wards
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold">
              {grandTotals.projects}
            </Typography>
            <Typography variant="body2">
              Total Projects
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(grandTotals.budget)}
            </Typography>
            <Typography variant="body2">
              Total Budget
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Wards Grouped by Sub-County */}
      <Box>
        {subCounties.map((subCounty, scIndex) => (
          <Accordion
            key={scIndex}
            expanded={expandedSubCounty === subCounty.subCountyName}
            onChange={handleAccordionChange(subCounty.subCountyName)}
            sx={{
              mb: 2,
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              boxShadow: 2,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.12)
                }
              }}
            >
              <Box sx={{ width: '100%', pr: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationCity sx={{ color: 'secondary.main' }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {subCounty.subCountyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {subCounty.wards.length} wards • {subCounty.totalProjects} projects
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body1" fontWeight="bold" color="secondary.main">
                      {formatCurrency(subCounty.totalBudget)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Budget
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.05)
                      }}
                    >
                      <TableCell sx={{ fontWeight: 'bold' }}>Ward Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>No. of Projects</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Budget</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCounty.wards.map((ward, wardIndex) => (
                      <TableRow
                        key={wardIndex}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.secondary.main, 0.03),
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          onClick={() => handleWardClick(ward)}
                          sx={{
                            fontWeight: 500,
                            '&:hover': {
                              color: theme.palette.secondary.main
                            }
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationCity sx={{ fontSize: 18, color: 'text.secondary' }} />
                            {ward.ward_name}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={ward.project_count || 0}
                            size="medium"
                            color="secondary"
                            sx={{ fontWeight: 'bold', minWidth: 60 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium" color="secondary.main">
                            {formatCurrency(ward.total_budget || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Ward Projects">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleWardClick(ward)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Sub-County Subtotal Row */}
                    <TableRow
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.15),
                        '& td': {
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          borderTop: `2px solid ${theme.palette.secondary.main}`
                        }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <TrendingUp sx={{ color: 'secondary.main' }} />
                          {subCounty.subCountyName} Subtotal
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={subCounty.totalProjects}
                          size="medium"
                          color="secondary"
                          sx={{ fontWeight: 'bold', minWidth: 60 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="secondary.main">
                          {formatCurrency(subCounty.totalBudget)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Ward Projects Modal */}
      {selectedWard && (
        <WardProjectsModal
          open={modalOpen}
          onClose={handleCloseModal}
          ward={selectedWard}
          finYearId={finYearId}
        />
      )}
    </>
  );
};

export default WardSummaryTable;


