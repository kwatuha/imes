import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const PublicApprovalManagementPage = () => {
  const theme = useTheme();
  const { user, hasPrivilege } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [countyProjects, setCountyProjects] = useState([]);
  const [citizenProposals, setCitizenProposals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // Dialog states
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvalAction, setApprovalAction] = useState(null); // 'approve', 'reject', or 'request_revision'
  
  // Photo management states
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoDescription, setPhotoDescription] = useState('');
  const photoFileInputRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all items regardless of approval status (admin view)
      const [projectsRes, countyProjectsRes, proposalsRes, announcementsRes] = await Promise.all([
        axiosInstance.get('/projects'),
        axiosInstance.get('/county-proposed-projects'),
        axiosInstance.get('/citizen-proposals'),
        axiosInstance.get('/project-announcements')
      ]);
      
      // Handle different response structures
      const projectsData = Array.isArray(projectsRes.data?.projects) 
        ? projectsRes.data.projects 
        : Array.isArray(projectsRes.data) 
          ? projectsRes.data 
          : [];
      const countyProjectsData = Array.isArray(countyProjectsRes.data?.projects) 
        ? countyProjectsRes.data.projects 
        : Array.isArray(countyProjectsRes.data) 
          ? countyProjectsRes.data 
          : [];
      const proposals = Array.isArray(proposalsRes.data?.proposals) 
        ? proposalsRes.data.proposals 
        : Array.isArray(proposalsRes.data) 
          ? proposalsRes.data 
          : [];
      const announcements = Array.isArray(announcementsRes.data?.announcements) 
        ? announcementsRes.data.announcements 
        : Array.isArray(announcementsRes.data) 
          ? announcementsRes.data 
          : [];
      
      console.log('Fetched data:', { 
        projects: projectsData.length, 
        countyProjects: countyProjectsData.length,
        proposals: proposals.length, 
        announcements: announcements.length
      });
      
      // Normalize approval and revision fields to be 0 or 1 (handle null/undefined/boolean/number)
      const normalizeApproval = (items) => {
        return items.map(item => {
          // Handle approved_for_public - convert boolean, null, undefined, string to 0 or 1
          let approvedForPublic = item.approved_for_public;
          if (approvedForPublic === null || approvedForPublic === undefined || approvedForPublic === '') {
            approvedForPublic = 0;
          } else if (typeof approvedForPublic === 'boolean') {
            approvedForPublic = approvedForPublic ? 1 : 0;
          } else if (typeof approvedForPublic === 'string') {
            approvedForPublic = (approvedForPublic === '1' || approvedForPublic === 'true') ? 1 : 0;
          } else {
            // Handle number (0, 1, or any other number)
            approvedForPublic = approvedForPublic ? 1 : 0;
          }
          
          // Handle revision_requested - convert boolean, null, undefined, string to 0 or 1
          let revisionRequested = item.revision_requested;
          if (revisionRequested === null || revisionRequested === undefined || revisionRequested === '') {
            revisionRequested = 0;
          } else if (typeof revisionRequested === 'boolean') {
            revisionRequested = revisionRequested ? 1 : 0;
          } else if (typeof revisionRequested === 'string') {
            revisionRequested = (revisionRequested === '1' || revisionRequested === 'true') ? 1 : 0;
          } else {
            // Handle number (0, 1, or any other number)
            revisionRequested = revisionRequested ? 1 : 0;
          }
          
          return {
            ...item,
            approved_for_public: approvedForPublic,
            revision_requested: revisionRequested
          };
        });
      };
      
      setProjects(normalizeApproval(projectsData));
      setCountyProjects(normalizeApproval(countyProjectsData));
      setCitizenProposals(normalizeApproval(proposals));
      setAnnouncements(normalizeApproval(announcements));
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load data. Please try again.';
      setError(errorMessage);
      // Set empty arrays on error to prevent further issues
      setProjects([]);
      setCountyProjects([]);
      setCitizenProposals([]);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApprovalDialog = (item, action, type) => {
    setSelectedItem({ ...item, type });
    setApprovalAction(action);
    setApprovalNotes('');
    setApprovalDialogOpen(true);
  };

  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    setSelectedItem(null);
    setApprovalNotes('');
    setApprovalAction(null);
  };

  const handleOpenPhotoModal = async (project) => {
    setSelectedProject(project);
    setPhotoModalOpen(true);
    await fetchProjectPhotos(project.id);
  };

  const handleClosePhotoModal = () => {
    setPhotoModalOpen(false);
    setSelectedProject(null);
    setPhotos([]);
    setPhotoDescription('');
    if (photoFileInputRef.current) {
      photoFileInputRef.current.value = '';
    }
  };

  // Helper function to get API base URL for image serving
  // In production, API is on port 3000, frontend can be on port 8080 (nginx) or 5174 (public dashboard)
  const getApiBaseUrl = () => {
    // Check if we have an explicit API URL in env
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl && !apiUrl.startsWith('/') && apiUrl.includes('://')) {
      // Full URL provided (e.g., http://165.22.227.234:3000/api)
      return apiUrl.replace('/api', '').replace('/public', '');
    }
    // In production, API is on port 3000
    // Frontend can be accessed via:
    // - Port 8080 (nginx proxy for main app)
    // - Port 5174 (public dashboard)
    // Both need to use port 3000 for API/image requests
    const origin = window.location.origin;
    if (origin.includes(':8080') || origin.includes(':5174')) {
      // Production: replace frontend port with 3000 for API
      return origin.replace(/:8080|:5174/, ':3000');
    }
    // Development or same origin (localhost)
    return window.location.origin;
  };

  const fetchProjectPhotos = async (projectId) => {
    setPhotosLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/photos`);
      const photosData = response.data || [];
      console.log('Fetched photos:', photosData.length, 'photos for project', projectId);
      console.log('All photos data:', photosData);
      if (photosData.length > 0) {
        console.log('First photo filePath:', photosData[0].filePath);
        // Test URL construction
        const apiBaseUrl = getApiBaseUrl();
        const testPath = photosData[0].filePath;
        let testUrl = '';
        if (testPath.startsWith('uploads/')) {
          testUrl = `${apiBaseUrl}/${testPath}`;
        } else {
          testUrl = `${apiBaseUrl}/uploads/${testPath}`;
        }
        console.log('Constructed test URL:', testUrl, 'API Base URL:', apiBaseUrl);
      }
      setPhotos(photosData);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err.response?.data?.message || 'Failed to load photos');
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  };

  const handleApprovePhoto = async (photoId, approved) => {
    try {
      await axiosInstance.put(`/project_photos/${photoId}/approval`, {
        approved_for_public: approved,
        approved_by: user?.userId,
        approved_at: new Date().toISOString()
      });
      setSuccess(`Photo ${approved ? 'approved' : 'revoked'} successfully!`);
      await fetchProjectPhotos(selectedProject.id);
    } catch (err) {
      console.error('Error updating photo approval:', err);
      setError(err.response?.data?.error || 'Failed to update photo approval');
    }
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', photoDescription.trim() || `Photo for ${selectedProject.projectName}`);

      await axiosInstance.post(`/projects/${selectedProject.id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Photo uploaded successfully!');
      setPhotoDescription('');
      await fetchProjectPhotos(selectedProject.id);
      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleApproveReject = async () => {
    if (!selectedItem) return;
    
    setLoading(true);
    setError(null);
    try {
      const endpoint = getEndpointForType(selectedItem.type);
      const isApproved = approvalAction === 'approve';
      const isRevisionRequest = approvalAction === 'request_revision';
      
      // Use the correct endpoint format
      const approvalEndpoint = endpoint === '/citizen-proposals' 
        ? `/citizen-proposals/${selectedItem.id}/approval`
        : endpoint === '/projects'
        ? `/projects/${selectedItem.id}/approval`
        : `${endpoint}/${selectedItem.id}/approval`;
      
      const requestData = isRevisionRequest ? {
        revision_requested: true,
        revision_notes: approvalNotes,
        revision_requested_by: user?.userId,
        revision_requested_at: new Date().toISOString(),
        approved_for_public: false // Reset approval when revision is requested
      } : {
        approved_for_public: isApproved,
        approval_notes: approvalNotes,
        approved_by: user?.userId,
        approved_at: new Date().toISOString(),
        revision_requested: false // Clear revision request if approving/rejecting
      };
      
      const response = await axiosInstance.put(approvalEndpoint, requestData);
      
      const actionText = isRevisionRequest 
        ? 'revision requested' 
        : isApproved 
          ? 'approved' 
          : 'rejected';
      setSuccess(`${selectedItem.type} ${actionText} successfully!`);
      handleCloseApprovalDialog();
      fetchAllData();
    } catch (err) {
      console.error('Error updating approval:', err);
      setError(err.response?.data?.error || 'Failed to update approval status.');
    } finally {
      setLoading(false);
    }
  };

  const getEndpointForType = (type) => {
    switch (type) {
      case 'project':
        return '/projects';
      case 'county_project':
        return '/county-proposed-projects';
      case 'citizen_proposal':
        return '/citizen-proposals';
      case 'announcement':
        return '/project-announcements';
      default:
        return '';
    }
  };

  const getApprovalStatusChip = (item) => {
    // Handle both boolean and numeric (0/1) values from database
    const isApproved = item.approved_for_public === 1 || item.approved_for_public === true;
    const needsRevision = item.revision_requested === 1 || item.revision_requested === true;
    
    if (isApproved) {
      return <Chip label="Approved" color="success" size="small" icon={<CheckCircleIcon />} />;
    }
    if (needsRevision) {
      return <Chip label="Revision Requested" color="warning" size="small" icon={<CancelIcon />} />;
    }
    return <Chip label="Pending" color="info" size="small" icon={<CancelIcon />} />;
  };

  // Projects columns (for Projects Gallery)
  const projectsColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'projectName', headerName: 'Project Name', flex: 1, minWidth: 200 },
    { field: 'categoryName', headerName: 'Category', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'departmentName', headerName: 'Department', width: 150 },
    {
      field: 'approved_for_public',
      headerName: 'Public Status',
      width: 150,
      renderCell: (params) => getApprovalStatusChip(params.row)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isApproved = params.row.approved_for_public === 1 || params.row.approved_for_public === true;
        const needsRevision = params.row.revision_requested === 1 || params.row.revision_requested === true;
        return (
          <Stack direction="row" spacing={1}>
            {!isApproved && (
              <>
                <Tooltip title="Approve for Public">
                  <IconButton
                    color="success"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'approve', 'project')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Request Revision">
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'request_revision', 'project')}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {isApproved && (
              <Tooltip title="Revoke Approval">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'reject', 'project')}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
            {needsRevision && (
              <Tooltip title="View Revision Notes">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'view_revision', 'project')}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Manage Photos">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleOpenPhotoModal(params.row)}
              >
                <PhotoLibraryIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  // County Projects columns
  const countyProjectsColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'approved_for_public',
      headerName: 'Public Status',
      width: 150,
      renderCell: (params) => getApprovalStatusChip(params.row)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isApproved = params.row.approved_for_public === 1 || params.row.approved_for_public === true;
        const needsRevision = params.row.revision_requested === 1 || params.row.revision_requested === true;
        return (
          <Stack direction="row" spacing={1}>
            {!isApproved && (
              <>
                <Tooltip title="Approve for Public">
                  <IconButton
                    color="success"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'approve', 'county_project')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Request Revision">
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'request_revision', 'county_project')}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {isApproved && (
              <Tooltip title="Revoke Approval">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'reject', 'county_project')}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
            {needsRevision && (
              <Tooltip title="View Revision Notes">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'view_revision', 'county_project')}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      }
    }
  ];

  // Citizen Proposals columns
  const citizenProposalsColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'proposer_name', headerName: 'Proposer', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'approved_for_public',
      headerName: 'Public Status',
      width: 150,
      renderCell: (params) => getApprovalStatusChip(params.row)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isApproved = params.row.approved_for_public === 1 || params.row.approved_for_public === true;
        const needsRevision = params.row.revision_requested === 1 || params.row.revision_requested === true;
        return (
          <Stack direction="row" spacing={1}>
            {!isApproved && (
              <>
                <Tooltip title="Approve for Public">
                  <IconButton
                    color="success"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'approve', 'citizen_proposal')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Request Revision">
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'request_revision', 'citizen_proposal')}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {isApproved && (
              <Tooltip title="Revoke Approval">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'reject', 'citizen_proposal')}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
            {needsRevision && (
              <Tooltip title="View Revision Notes">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'view_revision', 'citizen_proposal')}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      }
    }
  ];

  // Announcements columns
  const announcementsColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'approved_for_public',
      headerName: 'Public Status',
      width: 150,
      renderCell: (params) => getApprovalStatusChip(params.row)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isApproved = params.row.approved_for_public === 1 || params.row.approved_for_public === true;
        const needsRevision = params.row.revision_requested === 1 || params.row.revision_requested === true;
        return (
          <Stack direction="row" spacing={1}>
            {!isApproved && (
              <>
                <Tooltip title="Approve for Public">
                  <IconButton
                    color="success"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'approve', 'announcement')}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Request Revision">
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => handleOpenApprovalDialog(params.row, 'request_revision', 'announcement')}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {isApproved && (
              <Tooltip title="Revoke Approval">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'reject', 'announcement')}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
            {needsRevision && (
              <Tooltip title="View Revision Notes">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => handleOpenApprovalDialog(params.row, 'view_revision', 'announcement')}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      }
    }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 0:
        return { data: projects, columns: projectsColumns, title: 'Projects (Gallery)' };
      case 1:
        return { data: countyProjects, columns: countyProjectsColumns, title: 'County Proposed Projects' };
      case 2:
        return { data: citizenProposals, columns: citizenProposalsColumns, title: 'Citizen Proposals' };
      case 3:
        return { data: announcements, columns: announcementsColumns, title: 'Project Announcements' };
      default:
        return { data: [], columns: [], title: '' };
    }
  };

  const currentData = getCurrentData();

  if (!hasPrivilege('public_content.approve') && user?.roleName !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">You don't have permission to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon sx={{ fontSize: 32 }} />
          Public Content Approval
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and approve content for public viewing on the public-facing website
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Projects (Gallery) (${projects.length})`} />
          <Tab label={`County Projects (${countyProjects.length})`} />
          <Tab label={`Citizen Proposals (${citizenProposals.length})`} />
          <Tab label={`Announcements (${announcements.length})`} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 600, width: '100%' }}>
              {Array.isArray(currentData.data) && currentData.data.length > 0 ? (
                <DataGrid
                  rows={currentData.data}
                  columns={currentData.columns}
                  getRowId={(row) => row.id}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-cell': {
                      borderBottom: 'none',
                    },
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No {currentData.title.toLowerCase()} found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onClose={handleCloseApprovalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {approvalAction === 'approve' 
            ? 'Approve for Public Viewing' 
            : approvalAction === 'request_revision'
            ? 'Request Revision'
            : approvalAction === 'view_revision'
            ? 'Revision Request Details'
            : 'Revoke Public Approval'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {selectedItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedItem.description?.substring(0, 100)}...
              </Typography>
              
              {approvalAction === 'view_revision' && selectedItem.revision_notes && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Revision Requested
                  </Typography>
                  <Typography variant="body2">
                    {selectedItem.revision_notes}
                  </Typography>
                  {selectedItem.revision_requested_at && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Requested on: {new Date(selectedItem.revision_requested_at).toLocaleString()}
                    </Typography>
                  )}
                </Alert>
              )}
              
              {(approvalAction === 'approve' || approvalAction === 'reject' || approvalAction === 'request_revision') && (
                <TextField
                  fullWidth
                  multiline
                  rows={approvalAction === 'request_revision' ? 6 : 4}
                  label={
                    approvalAction === 'request_revision' 
                      ? 'Revision Notes (Required) - Describe what needs to be changed'
                      : 'Notes (Optional)'
                  }
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder={
                    approvalAction === 'request_revision'
                      ? 'Please specify what changes are needed. For example: "Please update the project photo" or "The description needs more details about..."'
                      : 'Add any notes about this approval decision...'
                  }
                  required={approvalAction === 'request_revision'}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApprovalDialog}>
            {approvalAction === 'view_revision' ? 'Close' : 'Cancel'}
          </Button>
          {approvalAction !== 'view_revision' && (
            <Button
              onClick={handleApproveReject}
              variant="contained"
              color={
                approvalAction === 'approve' 
                  ? 'success' 
                  : approvalAction === 'request_revision'
                  ? 'warning'
                  : 'error'
              }
              disabled={loading || (approvalAction === 'request_revision' && !approvalNotes.trim())}
            >
              {approvalAction === 'approve' 
                ? 'Approve' 
                : approvalAction === 'request_revision'
                ? 'Request Revision'
                : 'Revoke'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Photo Management Modal */}
      <Dialog 
        open={photoModalOpen} 
        onClose={handleClosePhotoModal} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { minHeight: '60vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Manage Photos - {selectedProject?.projectName}
            </Typography>
            <Box>
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleUploadPhoto}
              />
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => photoFileInputRef.current?.click()}
                disabled={uploadingPhoto}
                size="small"
              >
                Upload Photo
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Photo Description (Optional)"
              placeholder="Enter a brief description for the photo..."
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              multiline
              rows={2}
              helperText="This description will be saved with the photo"
            />
          </Box>
          {photosLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : photos.length === 0 ? (
            <Box textAlign="center" py={4}>
              <PhotoLibraryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No photos available for this project
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => photoFileInputRef.current?.click()}
                sx={{ mt: 2 }}
              >
                Upload First Photo
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {photos.map((photo) => {
                const isApproved = photo.approved_for_public === 1 || photo.approved_for_public === true;
                
                // Construct photo URL - static files are served from API server
                // In production, API is on port 3000, frontend is on port 8080 via nginx
                // File paths in DB are like: "uploads/project-photos/filename.jpg"
                const apiBaseUrl = getApiBaseUrl();
                let photoUrl = photo.filePath || '';
                if (!photoUrl) {
                  photoUrl = '';
                } else if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
                  // Already a full URL
                  photoUrl = photoUrl;
                } else if (photoUrl.startsWith('/uploads/')) {
                  // Already has /uploads/ prefix
                  photoUrl = `${apiBaseUrl}${photoUrl}`;
                } else if (photoUrl.startsWith('uploads/')) {
                  // Has uploads/ prefix but missing leading slash
                  photoUrl = `${apiBaseUrl}/${photoUrl}`;
                } else if (photoUrl.startsWith('/')) {
                  // Absolute path from root
                  photoUrl = `${apiBaseUrl}${photoUrl}`;
                } else {
                  // Relative path - add /uploads/ prefix
                  photoUrl = `${apiBaseUrl}/uploads/${photoUrl}`;
                }
                
                console.log('Photo URL constructed:', photoUrl, 'from filePath:', photo.filePath);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={photo.photoId}>
                    <Card>
                      <Box sx={{ height: 200, position: 'relative', backgroundColor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {photoUrl ? (
                          <CardMedia
                            component="img"
                            height="200"
                            image={photoUrl}
                            alt={photo.description || photo.fileName}
                            sx={{ 
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer'
                            }}
                            onError={(e) => {
                              console.error('Failed to load image:', {
                                photoUrl,
                                filePath: photo.filePath,
                                photoId: photo.photoId,
                                projectId: photo.projectId
                              });
                              e.target.style.display = 'none';
                              // Show placeholder on error
                              const placeholder = e.target.parentElement.querySelector('.photo-placeholder');
                              if (placeholder) placeholder.style.display = 'flex';
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', photoUrl);
                            }}
                          />
                        ) : null}
                        <Box 
                          className="photo-placeholder"
                          sx={{ 
                            display: photoUrl ? 'none' : 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            p: 2,
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <PhotoLibraryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="caption" color="text.secondary">
                            No image available
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle2" noWrap title={photo.fileName}>
                          {photo.fileName}
                        </Typography>
                        {photo.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            display: 'block',
                            mt: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }} title={photo.description}>
                            {photo.description}
                          </Typography>
                        )}
                        {!photo.description && (
                          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                            No description
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          {isApproved ? (
                            <Chip label="Approved" color="success" size="small" icon={<CheckCircleIcon />} />
                          ) : (
                            <Chip label="Pending" color="warning" size="small" />
                          )}
                          {photo.isDefault && (
                            <Chip label="Default" color="primary" size="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color={isApproved ? "error" : "success"}
                          startIcon={isApproved ? <CancelIcon /> : <CheckCircleIcon />}
                          onClick={() => handleApprovePhoto(photo.photoId, !isApproved)}
                        >
                          {isApproved ? 'Revoke' : 'Approve'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
          {uploadingPhoto && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Uploading photo...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhotoModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PublicApprovalManagementPage;

