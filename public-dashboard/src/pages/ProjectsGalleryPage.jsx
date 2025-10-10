import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  LocationOn,
  AttachMoney,
  CalendarToday,
  Comment
} from '@mui/icons-material';
import {
  getProjects,
  getFinancialYears,
  getDepartments,
  getProjectTypes
} from '../services/publicApi';
import { formatCurrency, formatDate, getStatusColor, truncateText } from '../utils/formatters';
import ProjectFeedbackModal from '../components/ProjectFeedbackModal';

const ProjectsGalleryPage = () => {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedProjectType, setSelectedProjectType] = useState('all');
  
  // Filter Options
  const [financialYears, setFinancialYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);

  const statuses = ['Completed', 'Ongoing', 'Not Started', 'Under Procurement', 'Stalled'];

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [pagination.page, selectedYear, selectedStatus, selectedDepartment, selectedProjectType, searchTerm]);

  const fetchFilterOptions = async () => {
    try {
      const [yearsData, deptsData, typesData] = await Promise.all([
        getFinancialYears(),
        getDepartments(),
        getProjectTypes()
      ]);
      setFinancialYears(yearsData);
      setDepartments(deptsData);
      setProjectTypes(typesData);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (selectedYear !== 'all') filters.finYearId = selectedYear;
      if (selectedStatus !== 'all') filters.status = selectedStatus;
      if (selectedDepartment !== 'all') filters.department = selectedDepartment;
      if (selectedProjectType !== 'all') filters.projectType = selectedProjectType;
      if (searchTerm) filters.search = searchTerm;

      const response = await getProjects(filters);
      setProjects(response.projects || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }));
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedYear('all');
    setSelectedStatus('all');
    setSelectedDepartment('all');
    setSelectedProjectType('all');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleOpenFeedback = (project) => {
    console.log('Opening feedback modal for project:', project);
    setSelectedProject({
      ...project,
      statusColor: getStatusColor(project.status)
    });
    setFeedbackModalOpen(true);
    console.log('Modal state set to true');
  };

  const ProjectCard = ({ project }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6
        }
      }}
    >
      {project.thumbnail ? (
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:3000/uploads/${project.thumbnail}`}
          alt={project.projectName}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {project.projectName?.charAt(0) || 'P'}
          </Typography>
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip 
          label={project.status}
          size="small"
          sx={{
            mb: 1,
            backgroundColor: getStatusColor(project.status),
            color: 'white',
            fontWeight: 'bold'
          }}
        />
        
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {truncateText(project.projectName, 60)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {truncateText(project.description, 100)}
        </Typography>

        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {project.department || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(project.budget)}
          </Typography>
        </Box>

        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {project.completionPercentage || 0}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={parseFloat(project.completionPercentage) || 0}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStatusColor(project.status)
              }
            }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          size="small" 
          startIcon={<Visibility />}
          sx={{ textTransform: 'none' }}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          startIcon={<Comment />}
          onClick={() => handleOpenFeedback(project)}
          color="primary"
          variant="outlined"
          sx={{ textTransform: 'none' }}
        >
          Comment
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Projects Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all county projects with detailed information
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Financial Year */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Financial Year</InputLabel>
              <Select
                value={selectedYear}
                label="Financial Year"
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <MenuItem value="all">All Years</MenuItem>
                {financialYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Status"
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Department */}
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                label="Department"
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Project Type */}
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project Category</InputLabel>
              <Select
                value={selectedProjectType}
                label="Project Category"
                onChange={(e) => {
                  setSelectedProjectType(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {projectTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Clear Filters Button */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ textTransform: 'none' }}
          >
            Clear All Filters
          </Button>
        </Box>
      </Paper>

      {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Showing {projects.length} of {pagination.total} projects
        </Typography>
        {(selectedYear !== 'all' || selectedStatus !== 'all' || selectedDepartment !== 'all' || selectedProjectType !== 'all' || searchTerm) && (
          <Chip 
            label="Filters Applied" 
            color="primary" 
            size="small"
            onDelete={handleClearFilters}
          />
        )}
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
        <>
          {projects.length > 0 ? (
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <ProjectCard project={project} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 8, 
                textAlign: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ mt: 2, textTransform: 'none' }}
              >
                Clear Filters
              </Button>
            </Paper>
          )}

          {/* Pagination */}
          {projects.length > 0 && pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={pagination.totalPages} 
                page={pagination.page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Project Feedback Modal */}
      <ProjectFeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        project={selectedProject}
      />
    </Container>
  );
};

export default ProjectsGalleryPage;

