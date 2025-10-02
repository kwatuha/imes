import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Autocomplete,
  useTheme,
  Alert
} from '@mui/material';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { tokens } from '../../pages/dashboard/theme';
import { axiosInstance } from '../../api';

const CreateRoomModal = ({ open, onClose, onRoomCreated }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { createRoom } = useChat();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    room_name: '',
    room_type: 'group',
    description: '',
    project_id: null,
    participants: []
  });
  
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users and projects when modal opens
  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchProjects();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      console.log('CreateRoomModal - Fetching users...');
      const response = await axiosInstance.get('/users/users');
      console.log('CreateRoomModal - Users response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter out current user
        const otherUsers = response.data.filter(u => u.userId !== user.userId);
        console.log('CreateRoomModal - Filtered users:', otherUsers);
        setUsers(otherUsers);
      } else {
        console.log('CreateRoomModal - Response data is not an array:', response.data);
      }
    } catch (error) {
      console.error('CreateRoomModal - Error fetching users:', error);
      console.error('CreateRoomModal - Error details:', error.response?.data);
    }
  };

  const fetchProjects = async () => {
    try {
      console.log('CreateRoomModal - Fetching projects...');
      const response = await axiosInstance.get('/projects');
      console.log('CreateRoomModal - Projects response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('CreateRoomModal - Projects loaded:', response.data.length);
        setProjects(response.data);
      } else {
        console.log('CreateRoomModal - Projects response data is not an array:', response.data);
      }
    } catch (error) {
      console.error('CreateRoomModal - Error fetching projects:', error);
      console.error('CreateRoomModal - Error details:', error.response?.data);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
    console.log('CreateRoomModal - Starting room creation...');
    console.log('CreateRoomModal - Form data:', formData);
    
    if (!formData.room_name.trim()) {
      setError('Room name is required');
      return;
    }

    if (formData.room_type === 'direct' && formData.participants.length !== 1) {
      setError('Direct messages require exactly one participant');
      return;
    }

    if (formData.room_type === 'project' && !formData.project_id) {
      setError('Project is required for project rooms');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomData = {
        room_name: formData.room_name.trim(),
        room_type: formData.room_type,
        description: formData.description.trim(),
        project_id: formData.project_id,
        participant_ids: formData.participants.map(p => p.userId)
      };

      console.log('CreateRoomModal - Sending room data:', roomData);
      const roomId = await createRoom(roomData);
      console.log('CreateRoomModal - Room created with ID:', roomId);
      
      if (roomId) {
        onRoomCreated();
        handleClose();
      } else {
        setError('Room creation returned no ID');
      }
    } catch (error) {
      console.error('CreateRoomModal - Error creating room:', error);
      console.error('CreateRoomModal - Error details:', error.response?.data);
      console.error('CreateRoomModal - Error status:', error.response?.status);
      
      let errorMessage = 'Failed to create room';
      if (error.response?.status === 401) {
        errorMessage = 'You are not authorized to create chat rooms. Please contact your administrator.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create chat rooms. Please contact your administrator.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      room_name: '',
      room_type: 'group',
      description: '',
      project_id: null,
      participants: []
    });
    setError('');
    onClose();
  };

  const getRoomTypeDescription = (type) => {
    switch (type) {
      case 'direct':
        return 'Private conversation between two people';
      case 'group':
        return 'Group conversation with multiple participants';
      case 'project':
        return 'Project-specific discussion room';
      case 'department':
        return 'Department-wide communication';
      default:
        return '';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[500],
          color: colors.grey[100],
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
            : '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary[400],
          borderBottom: `1px solid ${colors.primary[300]}`,
          color: colors.grey[100],
          fontWeight: 600,
          fontSize: '1.25rem'
        }}
      >
        Create New Chat Room
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Room Name */}
          <TextField
            label="Room Name"
            value={formData.room_name}
            onChange={(e) => handleInputChange('room_name', e.target.value)}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary[400],
                '&:hover': {
                  backgroundColor: colors.primary[300]
                },
                '&.Mui-focused': {
                  backgroundColor: colors.primary[500]
                }
              },
              '& .MuiInputLabel-root': {
                color: colors.grey[400]
              },
              '& .MuiOutlinedInput-input': {
                color: colors.grey[100]
              }
            }}
          />

          {/* Room Type */}
          <FormControl fullWidth>
            <InputLabel sx={{ color: colors.grey[400] }}>Room Type</InputLabel>
            <Select
              value={formData.room_type}
              onChange={(e) => handleInputChange('room_type', e.target.value)}
              label="Room Type"
              sx={{
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                '&:hover': {
                  backgroundColor: colors.primary[300]
                },
                '&.Mui-focused': {
                  backgroundColor: colors.primary[500]
                }
              }}
            >
              <MenuItem value="group">Group Chat</MenuItem>
              <MenuItem value="direct">Direct Message</MenuItem>
              <MenuItem value="project">Project Room</MenuItem>
              <MenuItem value="department">Department Room</MenuItem>
            </Select>
            <Typography variant="caption" sx={{ mt: 1, color: colors.grey[400] }}>
              {getRoomTypeDescription(formData.room_type)}
            </Typography>
          </FormControl>

          {/* Project Selection (for project rooms) */}
          {formData.room_type === 'project' && (
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.grey[400] }}>Project</InputLabel>
              <Select
                value={formData.project_id || ''}
                onChange={(e) => handleInputChange('project_id', e.target.value)}
                label="Project"
                sx={{
                  backgroundColor: '#f8f9fa',
                  color: '#212529',
                  '&:hover': {
                    backgroundColor: '#e9ecef'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#ffffff'
                  }
                }}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Participants */}
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
            isOptionEqualToValue={(option, value) => option.userId === value.userId}
            value={formData.participants}
            onChange={(event, newValue) => handleInputChange('participants', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={`${option.firstName} ${option.lastName}`}
                  {...getTagProps({ index })}
                  key={option.userId}
                  sx={{
                    borderColor: '#007bff',
                    color: '#007bff',
                    backgroundColor: '#e7f3ff',
                    '&:hover': {
                      backgroundColor: '#cce7ff'
                    }
                  }}
                />
              ))
            }
            renderOption={(props, option) => (
              <li {...props} key={option.userId}>
                {`${option.firstName} ${option.lastName} (${option.email})`}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Participants"
                placeholder="Select participants..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#6c757d'
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#212529'
                  }
                }}
              />
            )}
            sx={{
              '& .MuiAutocomplete-popupIndicator': {
                color: colors.grey[100]
              }
            }}
          />

          {/* Description */}
          <TextField
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.primary[400],
                '&:hover': {
                  backgroundColor: colors.primary[300]
                },
                '&.Mui-focused': {
                  backgroundColor: colors.primary[500]
                }
              },
              '& .MuiInputLabel-root': {
                color: colors.grey[400]
              },
              '& .MuiOutlinedInput-input': {
                color: colors.grey[100]
              }
            }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2, backgroundColor: colors.primary[400], borderTop: `1px solid ${colors.primary[300]}` }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: colors.grey[400],
            '&:hover': {
              backgroundColor: colors.primary[300]
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: colors.greenAccent[500],
            color: colors.grey[100],
            '&:hover': {
              backgroundColor: colors.greenAccent[600]
            },
            '&:disabled': {
              backgroundColor: colors.grey[500],
              color: colors.grey[100]
            }
          }}
        >
          {loading ? 'Creating...' : 'Create Room'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomModal;
