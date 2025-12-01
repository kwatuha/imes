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
  LinearProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  Pagination,
  List,
  ListItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  PhotoLibrary as PhotoLibraryIcon,
  CloudUpload as CloudUploadIcon,
  Gavel as GavelIcon,
  Flag as FlagIcon,
  Block as BlockIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const PublicApprovalManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
  
  // Moderation states
  const [moderationFeedbacks, setModerationFeedbacks] = useState([]);
  const [moderationStats, setModerationStats] = useState(null);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationPage, setModerationPage] = useState(1);
  const [moderationTotalPages, setModerationTotalPages] = useState(1);
  const [moderationFilter, setModerationFilter] = useState('pending');
  const [moderationSearch, setModerationSearch] = useState('');
  const [expandedFeedbackId, setExpandedFeedbackId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [moderationModalOpen, setModerationModalOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState('');
  const [moderationReason, setModerationReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [submittingModeration, setSubmittingModeration] = useState(false);
  const [statisticsModalFeedbacks, setStatisticsModalFeedbacks] = useState([]);
  const [statisticsModalTitle, setStatisticsModalTitle] = useState('');
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
  
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

  // Progress update states
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedProjectForProgress, setSelectedProjectForProgress] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState(0);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 4) {
      fetchModerationData();
      fetchModerationStats();
    }
  }, [activeTab, moderationPage, moderationFilter, moderationSearch]);

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

  // Moderation functions
  const fetchModerationData = async () => {
    try {
      setModerationLoading(true);
      const params = new URLSearchParams({
        page: moderationPage,
        limit: 10,
      });
      
      if (moderationFilter && moderationFilter !== 'all') {
        params.append('moderation_status', moderationFilter);
      }
      if (moderationSearch) {
        params.append('search', moderationSearch);
      }

      const response = await axiosInstance.get(`/moderate/queue?${params.toString()}`);
      setModerationFeedbacks(response.data.items || []);
      setModerationTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching moderation feedback:', err);
      setError('Failed to load moderation queue. Please try again.');
    } finally {
      setModerationLoading(false);
    }
  };

  const fetchModerationStats = async () => {
    try {
      const response = await axiosInstance.get('/moderate/statistics');
      setModerationStats(response.data);
    } catch (err) {
      console.error('Error fetching moderation statistics:', err);
    }
  };

  const handleModerationAction = (feedback, action) => {
    setSelectedFeedback(feedback);
    setModerationAction(action);
    setModerationReason('');
    setCustomReason('');
    setModeratorNotes('');
    setReopenReason('');
    setModerationModalOpen(true);
  };

  const handleCloseModerationModal = () => {
    setModerationModalOpen(false);
    setSelectedFeedback(null);
    setModerationAction('');
    setModerationReason('');
    setCustomReason('');
    setModeratorNotes('');
    setReopenReason('');
  };

  const handleModerationSubmit = async () => {
    if (!selectedFeedback) return;

    try {
      setSubmittingModeration(true);
      
      let endpoint = '';
      let payload = {
        moderator_notes: moderatorNotes
      };

      switch (moderationAction) {
        case 'approve':
          endpoint = `/moderate/${selectedFeedback.id}/approve`;
          break;
        case 'reject':
          if (!moderationReason) {
            setError('Please select a reason for rejection');
            return;
          }
          endpoint = `/moderate/${selectedFeedback.id}/reject`;
          payload = {
            moderation_reason: moderationReason,
            custom_reason: customReason,
            moderator_notes: moderatorNotes
          };
          break;
        case 'flag':
          endpoint = `/moderate/${selectedFeedback.id}/flag`;
          payload = {
            moderation_reason: moderationReason,
            custom_reason: customReason,
            moderator_notes: moderatorNotes
          };
          break;
        case 'reopen':
          if (!reopenReason && selectedFeedback.moderation_status === 'rejected') {
            setError('Please provide a reason for reopening a rejected feedback');
            return;
          }
          endpoint = `/moderate/${selectedFeedback.id}/reopen`;
          payload = {
            reopen_reason: reopenReason || `Reopened from ${selectedFeedback.moderation_status} status`,
            moderator_notes: moderatorNotes || `Reopened for further review`
          };
          break;
        default:
          throw new Error('Invalid moderation action');
      }

      await axiosInstance.post(endpoint, payload);
      
      const actionMessages = {
        'approve': 'approved',
        'reject': 'rejected',
        'flag': 'flagged',
        'reopen': 'reopened'
      };
      
      setSuccess(`Feedback ${actionMessages[moderationAction] || moderationAction} successfully`);
      handleCloseModerationModal();
      fetchModerationData();
      fetchModerationStats();
    } catch (err) {
      console.error('Error moderating feedback:', err);
      setError(`Failed to ${moderationAction} feedback. Please try again.`);
    } finally {
      setSubmittingModeration(false);
    }
  };

  const moderationReasons = [
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'spam', label: 'Spam' },
    { value: 'off_topic', label: 'Off Topic' },
    { value: 'personal_attack', label: 'Personal Attack' },
    { value: 'false_information', label: 'False Information' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'incomplete', label: 'Incomplete' },
    { value: 'language_violation', label: 'Language Violation' },
    { value: 'other', label: 'Other' }
  ];

  const getModerationStatusColor = (status) => {
    const statusMap = {
      'pending': { color: 'warning', icon: <ScheduleIcon />, label: 'Awaiting Response' },
      'approved': { color: 'success', icon: <CheckCircleIcon />, label: 'Approved' },
      'rejected': { color: 'error', icon: <CancelIcon />, label: 'Rejected (Permanent)' },
      'flagged': { color: 'warning', icon: <FlagIcon />, label: 'Flagged (Needs Review)' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const handleModerationStatCardClick = async (moderationStatus, title) => {
    try {
      setModerationLoading(true);
      
      // Fetch all feedback for the specific moderation status
      const params = new URLSearchParams({
        page: 1,
        limit: 100, // Get more items for the modal
        moderation_status: moderationStatus
      });

      const response = await axiosInstance.get(`/moderate/queue?${params.toString()}`);

      setStatisticsModalFeedbacks(response.data.items || []);
      setStatisticsModalTitle(title);
      setStatisticsModalOpen(true);
    } catch (err) {
      console.error('Error fetching feedback for modal:', err);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setModerationLoading(false);
    }
  };

  const handleCloseStatisticsModal = () => {
    setStatisticsModalOpen(false);
    setStatisticsModalFeedbacks([]);
    setStatisticsModalTitle('');
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

  const normalizeProgressToValidValue = (progress) => {
    if (progress === null || progress === undefined) return 0;
    const validValues = [0, 25, 50, 75, 100];
    // If it's already a valid value, return it
    if (validValues.includes(progress)) return progress;
    // Otherwise, round to nearest valid value
    const numProgress = parseInt(progress) || 0;
    return validValues.reduce((prev, curr) => 
      Math.abs(curr - numProgress) < Math.abs(prev - numProgress) ? curr : prev
    );
  };

  const handleOpenProgressModal = (project) => {
    setSelectedProjectForProgress(project);
    const currentProgress = project.overallProgress || 0;
    // Normalize to nearest valid value for the dropdown
    const normalizedProgress = normalizeProgressToValidValue(currentProgress);
    setSelectedProgress(normalizedProgress);
    setProgressModalOpen(true);
  };

  const handleCloseProgressModal = () => {
    setProgressModalOpen(false);
    setSelectedProjectForProgress(null);
    setSelectedProgress(0);
  };

  const handleUpdateProgress = async () => {
    if (!selectedProjectForProgress) return;

    setUpdatingProgress(true);
    setError(null);
    try {
      console.log('Updating progress:', {
        projectId: selectedProjectForProgress.id,
        projectName: selectedProjectForProgress.projectName,
        currentProgress: selectedProjectForProgress.overallProgress,
        newProgress: selectedProgress
      });
      
      const response = await axiosInstance.put(`/projects/${selectedProjectForProgress.id}/progress`, {
        overallProgress: selectedProgress
      });
      
      console.log('Progress update response:', response.data);
      setSuccess(`Project progress updated to ${selectedProgress}%`);
      handleCloseProgressModal();
      fetchAllData(); // Refresh the projects list
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err.response?.data?.error || 'Failed to update project progress');
    } finally {
      setUpdatingProgress(false);
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
      width: 300,
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
            <Tooltip title="Update Progress">
              <IconButton
                color="secondary"
                size="small"
                onClick={() => handleOpenProgressModal(params.row)}
              >
                <TrendingUpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Project Details">
              <IconButton
                color="info"
                size="small"
                onClick={() => navigate(`/projects/${params.row.id}`)}
              >
                <VisibilityIcon />
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
      case 4:
        return { data: [], columns: [], title: 'Feedback Moderation' };
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
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GavelIcon sx={{ fontSize: '1rem' }} />
                Feedback Moderation
                {moderationStats && (
                  <Chip 
                    label={moderationStats.statistics?.pending_count || 0} 
                    size="small" 
                    color="warning"
                    sx={{ height: '20px', fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            } 
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 4 ? (
            // Moderation Queue Tab
            <Box>
              {/* Statistics Cards - Interactive */}
              {moderationStats && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      onClick={() => handleModerationStatCardClick('pending', 'Awaiting Response')}
                      sx={{ 
                        background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', 
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(255, 152, 0, 0.4)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <ScheduleIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {moderationStats.statistics.pending_count}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Awaiting Response
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                          Click to view
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      onClick={() => handleModerationStatCardClick('approved', 'Approved')}
                      sx={{ 
                        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)', 
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(76, 175, 80, 0.4)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <CheckCircleIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {moderationStats.statistics.approved_count}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Approved
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                          Click to view
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      onClick={() => handleModerationStatCardClick('rejected', 'Rejected')}
                      sx={{ 
                        background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)', 
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(244, 67, 54, 0.4)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <CancelIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {moderationStats.statistics.rejected_count}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Rejected
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                          Click to view
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card 
                      onClick={() => handleModerationStatCardClick('flagged', 'Flagged')}
                      sx={{ 
                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)', 
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(156, 39, 176, 0.4)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
                        <FlagIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                        <Typography variant="h5" fontWeight="bold">
                          {moderationStats.statistics.flagged_count}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          Flagged
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.9 }}>
                          Click to view
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Filters */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search feedback..."
                      value={moderationSearch}
                      onChange={(e) => setModerationSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Moderation Status</InputLabel>
                      <Select
                        value={moderationFilter}
                        onChange={(e) => setModerationFilter(e.target.value)}
                        label="Moderation Status"
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="flagged">Flagged</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              {/* Feedback List */}
              {moderationLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                  <CircularProgress />
                </Box>
              ) : moderationFeedbacks.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No feedback found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {moderationFilter !== 'all' 
                      ? `No feedback with moderation status "${moderationFilter}"` 
                      : 'No feedback items in the moderation queue'}
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  {moderationFeedbacks.map((feedback) => {
                    const statusInfo = getModerationStatusColor(feedback.moderation_status);
                    return (
                      <Accordion
                        key={feedback.id}
                        expanded={expandedFeedbackId === feedback.id}
                        onChange={(e, isExpanded) => setExpandedFeedbackId(isExpanded ? feedback.id : null)}
                        sx={{ mb: 2 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                              <Avatar sx={{ mr: 1.5, width: 32, height: 32 }}>
                                <PersonIcon />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" component="div" fontWeight="bold">
                                  {feedback.name || 'Anonymous'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                  {feedback.subject || 'No Subject'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={statusInfo.icon}
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                              />
                            </Box>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {feedback.message}
                          </Typography>
                          
                          {feedback.moderation_status === 'flagged' && (
                            <Alert severity="warning" sx={{ mb: 1 }}>
                              ⚠️ Flagged for Review: This feedback needs further review.
                            </Alert>
                          )}
                          
                          {feedback.moderation_status === 'rejected' && (
                            <Alert severity="error" sx={{ mb: 1 }}>
                              ❌ Permanently Rejected: This feedback was permanently rejected.
                            </Alert>
                          )}

                          <Divider sx={{ my: 1.5 }} />

                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {feedback.moderation_status === 'pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleOutlineIcon />}
                                  onClick={() => handleModerationAction(feedback, 'approve')}
                                  size="small"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={<BlockIcon />}
                                  onClick={() => handleModerationAction(feedback, 'reject')}
                                  size="small"
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  startIcon={<FlagIcon />}
                                  onClick={() => handleModerationAction(feedback, 'flag')}
                                  size="small"
                                >
                                  Flag for Review
                                </Button>
                              </>
                            )}
                            
                            {feedback.moderation_status === 'flagged' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleOutlineIcon />}
                                  onClick={() => handleModerationAction(feedback, 'approve')}
                                  size="small"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  startIcon={<BlockIcon />}
                                  onClick={() => handleModerationAction(feedback, 'reject')}
                                  size="small"
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  startIcon={<ScheduleIcon />}
                                  onClick={() => handleModerationAction(feedback, 'reopen')}
                                  size="small"
                                >
                                  Reopen for Review
                                </Button>
                              </>
                            )}
                            
                            {feedback.moderation_status === 'rejected' && (
                              <>
                                <Button
                                  variant="outlined"
                                  color="info"
                                  startIcon={<ScheduleIcon />}
                                  onClick={() => handleModerationAction(feedback, 'reopen')}
                                  size="small"
                                >
                                  Reopen (Requires Justification)
                                </Button>
                              </>
                            )}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}

                  {/* Pagination */}
                  {moderationTotalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                        count={moderationTotalPages}
                        page={moderationPage}
                        onChange={(event, value) => setModerationPage(value)}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            // Other tabs (DataGrid)
            <>
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
            </>
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

      {/* Moderation Modal */}
      <Dialog
        open={moderationModalOpen}
        onClose={handleCloseModerationModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {moderationAction === 'approve' && 'Approve Feedback'}
          {moderationAction === 'reject' && 'Reject Feedback (Permanent Decision)'}
          {moderationAction === 'flag' && 'Flag Feedback for Further Review'}
          {moderationAction === 'review' && 'Review Moderation Decision'}
          {moderationAction === 'reopen' && `Reopen Feedback from ${selectedFeedback?.moderation_status || ''} Status`}
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Feedback from: {selectedFeedback.name || 'Anonymous'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Subject: {selectedFeedback.subject || 'No Subject'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedFeedback.message}
              </Typography>
            </Box>
          )}

          {/* Show warning for rejected items being reopened */}
          {moderationAction === 'reopen' && selectedFeedback?.moderation_status === 'rejected' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Warning: Reopening a Rejected Feedback
              </Typography>
              <Typography variant="body2">
                This feedback was permanently rejected. Reopening it requires a valid justification. 
                Please provide a clear reason why this rejected feedback should be reconsidered.
              </Typography>
            </Alert>
          )}

          {/* Show info for flagged items being reopened */}
          {moderationAction === 'reopen' && selectedFeedback?.moderation_status === 'flagged' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This feedback was flagged for further review. Reopening will change its status back to pending 
                so it can be reviewed again by the moderation team.
              </Typography>
            </Alert>
          )}

          {/* Reopen reason field */}
          {moderationAction === 'reopen' && (
            <TextField
              fullWidth
              label={selectedFeedback?.moderation_status === 'rejected' ? 'Justification for Reopening (Required)' : 'Reason for Reopening'}
              multiline
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              required={selectedFeedback?.moderation_status === 'rejected'}
              sx={{ mb: 2 }}
              placeholder={
                selectedFeedback?.moderation_status === 'rejected' 
                  ? 'Please explain why this rejected feedback should be reconsidered...'
                  : 'Optional: Add a reason for reopening this flagged feedback...'
              }
            />
          )}

          {(moderationAction === 'reject' || moderationAction === 'flag') && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Reason</InputLabel>
              <Select
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                label="Reason"
              >
                {moderationReasons.map((reason) => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {moderationReason === 'other' && (
            <TextField
              fullWidth
              label="Custom Reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Moderator Notes"
            multiline
            rows={4}
            value={moderatorNotes}
            onChange={(e) => setModeratorNotes(e.target.value)}
            placeholder={
              moderationAction === 'reopen' 
                ? 'Add any additional notes about reopening this feedback...'
                : 'Add any additional notes about this moderation decision...'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModerationModal}>Cancel</Button>
          <Button
            onClick={handleModerationSubmit}
            variant="contained"
            disabled={submittingModeration}
            color={
              moderationAction === 'approve' ? 'success' :
              moderationAction === 'reject' ? 'error' :
              moderationAction === 'flag' ? 'warning' :
              moderationAction === 'reopen' ? 'info' : 'primary'
            }
          >
            {submittingModeration ? <CircularProgress size={20} /> : 
             moderationAction === 'approve' ? 'Approve' :
             moderationAction === 'reject' ? 'Reject Permanently' :
             moderationAction === 'flag' ? 'Flag for Review' :
             moderationAction === 'reopen' ? 'Reopen for Review' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Update Modal */}
      <Dialog
        open={progressModalOpen}
        onClose={handleCloseProgressModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Project Progress - {selectedProjectForProgress?.projectName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Current Progress: {selectedProjectForProgress?.overallProgress != null ? `${selectedProjectForProgress.overallProgress}%` : 'Not set (0%)'}
            </Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel>Select Progress Stage</InputLabel>
              <Select
                value={selectedProgress}
                onChange={(e) => setSelectedProgress(parseInt(e.target.value))}
                label="Select Progress Stage"
              >
                <MenuItem value={0}>0% - Not Started</MenuItem>
                <MenuItem value={25}>25% - In Progress</MenuItem>
                <MenuItem value={50}>50% - Halfway</MenuItem>
                <MenuItem value={75}>75% - Nearly Complete</MenuItem>
                <MenuItem value={100}>100% - Completed</MenuItem>
              </Select>
            </FormControl>
            {selectedProgress !== (selectedProjectForProgress?.overallProgress || 0) && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Progress will be updated from {selectedProjectForProgress?.overallProgress || 0}% to {selectedProgress}%
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgressModal} disabled={updatingProgress}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProgress}
            variant="contained"
            color="primary"
            disabled={updatingProgress || selectedProgress === (selectedProjectForProgress?.overallProgress || 0)}
          >
            {updatingProgress ? <CircularProgress size={20} /> : 'Update Progress'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Statistics Modal - Shows filtered feedback when clicking stat cards */}
      <Dialog 
        open={statisticsModalOpen} 
        onClose={handleCloseStatisticsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              {statisticsModalTitle}
            </Typography>
            <IconButton onClick={handleCloseStatisticsModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {statisticsModalFeedbacks.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No feedback found in this category.
              </Typography>
            </Box>
          ) : (
            <List>
              {statisticsModalFeedbacks.map((feedback) => (
                <ListItem key={feedback.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {feedback.name || 'Anonymous'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feedback.subject || 'No Subject'}
                        </Typography>
                      </Box>
                      <Chip
                        label={getModerationStatusColor(feedback.moderation_status).label}
                        color={getModerationStatusColor(feedback.moderation_status).color}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {feedback.message}
                    </Typography>
                    
                    {feedback.project_name && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Related Project: {feedback.project_name}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Submitted: {new Date(feedback.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                    
                    {feedback.moderation_reason && (
                      <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Moderation Reason: {moderationReasons.find(r => r.value === feedback.moderation_reason)?.label}
                        </Typography>
                        {feedback.custom_reason && (
                          <Typography variant="body2">
                            Custom Reason: {feedback.custom_reason}
                          </Typography>
                        )}
                        {feedback.moderator_notes && (
                          <Typography variant="body2">
                            Moderator Notes: {feedback.moderator_notes}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ width: '100%', mt: 1 }} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatisticsModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PublicApprovalManagementPage;

