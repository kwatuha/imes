import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Work as ProjectIcon,
  Business as DepartmentIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Circle as OnlineIcon
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import { tokens } from '../../pages/dashboard/theme';

const RoomList = ({ onRoomSelect, selectedRoom, onCreateRoom }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { rooms, unreadCounts } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, direct, group, project

  const getRoomIcon = (roomType) => {
    switch (roomType) {
      case 'direct':
        return <PersonIcon />;
      case 'group':
        return <GroupIcon />;
      case 'project':
        return <ProjectIcon />;
      case 'department':
        return <DepartmentIcon />;
      default:
        return <GroupIcon />;
    }
  };

  const getRoomTypeColor = (roomType) => {
    switch (roomType) {
      case 'direct':
        return colors.blueAccent[500];
      case 'group':
        return colors.greenAccent[500];
      case 'project':
        return colors.redAccent[500];
      case 'department':
        return colors.grey[500];
      default:
        return colors.primary[500];
    }
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.room_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.project_name && room.project_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || room.room_type === filter;
    
    return matchesSearch && matchesFilter;
  });

  const sortedRooms = filteredRooms.sort((a, b) => {
    // Sort by last message time, then by unread count, then by name
    const aTime = new Date(a.last_message_time || 0);
    const bTime = new Date(b.last_message_time || 0);
    const aUnread = unreadCounts[a.room_id] || 0;
    const bUnread = unreadCounts[b.room_id] || 0;
    
    if (aUnread > 0 && bUnread === 0) return -1;
    if (bUnread > 0 && aUnread === 0) return 1;
    
    return bTime - aTime;
  });

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e9ecef',
          backgroundColor: '#ffffff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Chat Rooms
          </Typography>
          <IconButton 
            onClick={onCreateRoom} 
            sx={{ 
              color: '#007bff',
              '&:hover': {
                backgroundColor: '#e7f3ff'
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6c757d' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff'
              }
            },
            '& .MuiOutlinedInput-input': {
              color: '#212529'
            }
          }}
        />
        
        {/* Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'direct', label: 'Direct' },
            { key: 'group', label: 'Groups' },
            { key: 'project', label: 'Projects' }
          ].map((filterOption) => (
            <Chip
              key={filterOption.key}
              label={filterOption.label}
              size="small"
              onClick={() => setFilter(filterOption.key)}
              variant={filter === filterOption.key ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: filter === filterOption.key ? '#007bff' : 'transparent',
                color: filter === filterOption.key ? '#ffffff' : '#6c757d',
                borderColor: filter === filterOption.key ? '#007bff' : '#dee2e6',
                '&:hover': {
                  backgroundColor: filter === filterOption.key ? '#0056b3' : '#e9ecef'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Room List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {sortedRooms.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              gap: 2
            }}
          >
            <Typography variant="body1" color="textSecondary">
              {searchTerm ? 'No rooms found' : 'No chat rooms available'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={onCreateRoom}
                sx={{
                  borderColor: colors.greenAccent[500],
                  color: colors.greenAccent[500]
                }}
              >
                Create Room
              </Button>
            )}
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {sortedRooms.map((room, index) => {
              const unreadCount = unreadCounts[room.room_id] || 0;
              const isSelected = selectedRoom?.room_id === room.room_id;
              
              return (
                <React.Fragment key={room.room_id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => onRoomSelect(room)}
                      selected={isSelected}
                      sx={{
                        py: 1.5,
                        px: 2,
                        backgroundColor: isSelected ? '#e7f3ff' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#f8f9fa'
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#e7f3ff',
                          '&:hover': {
                            backgroundColor: '#cce7ff'
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#007bff',
                            fontSize: '0.875rem',
                            color: '#ffffff'
                          }}
                        >
                          {getRoomIcon(room.room_type)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: unreadCount > 0 ? 'bold' : 'normal',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                color: '#212529'
                              }}
                            >
                              {room.room_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {room.last_message_time && (
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#6c757d' }}
                                >
                                  {formatLastMessageTime(room.last_message_time)}
                                </Typography>
                              )}
                              {unreadCount > 0 && (
                                <Badge
                                  badgeContent={unreadCount}
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      backgroundColor: '#007bff',
                                      color: '#ffffff',
                                      fontSize: '0.75rem',
                                      minWidth: '18px',
                                      height: '18px'
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            {room.room_type === 'project' && room.project_name && (
                              <Typography
                                variant="caption"
                                sx={{ color: '#6c757d' }}
                              >
                                Project: {room.project_name}
                              </Typography>
                            )}
                            {room.last_message && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#6c757d',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  mt: 0.5
                                }}
                              >
                                {room.last_message}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < sortedRooms.length - 1 && (
                    <Divider sx={{ borderColor: '#e9ecef' }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default RoomList;

