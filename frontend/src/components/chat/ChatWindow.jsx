import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Chip,
  Divider,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemText,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Reply as ReplyIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { tokens } from '../../pages/dashboard/theme';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ room, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Helper function to check if current mode is a dark theme
  const isDarkMode = theme.palette.mode === 'dark';
  const { user } = useAuth();
  const {
    messages,
    sendMessage,
    joinRoom,
    uploadFile,
    fetchParticipants,
    startTyping,
    stopTyping,
    getTypingUsers,
    activeRoom
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fileUploadDialog, setFileUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [participantsDialog, setParticipantsDialog] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [leaveRoomDialog, setLeaveRoomDialog] = useState(false);
  
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Join room when component mounts or room changes
  useEffect(() => {
    if (room && room.room_id !== activeRoom) {
      joinRoom(room.room_id);
    }
  }, [room, joinRoom, activeRoom]);

  // Handle typing indicators
  useEffect(() => {
    if (isTyping && room) {
      startTyping(room.room_id);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(room.room_id);
        setIsTyping(false);
      }, 2000);
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, room, startTyping, stopTyping]);

  const handleSendMessage = () => {
    console.log('ChatWindow - handleSendMessage called');
    console.log('ChatWindow - messageText:', messageText);
    console.log('ChatWindow - room:', room);
    
    if (messageText.trim() && room) {
      console.log('ChatWindow - Sending message to room:', room.room_id);
      sendMessage(room.room_id, messageText.trim(), replyToMessage?.message_id);
      setMessageText('');
      setReplyToMessage(null);
      setIsTyping(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        stopTyping(room.room_id);
      }
    } else {
      console.log('ChatWindow - Message not sent. messageText.trim():', messageText.trim(), 'room:', !!room);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
    
    if (!isTyping && event.target.value.trim()) {
      setIsTyping(true);
    } else if (isTyping && !event.target.value.trim()) {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async () => {
    console.log('ChatWindow - handleFileUpload called');
    console.log('ChatWindow - selectedFile:', selectedFile);
    console.log('ChatWindow - room:', room);
    
    if (selectedFile && room) {
      try {
        console.log('ChatWindow - Starting file upload for room:', room.room_id);
        const result = await uploadFile(room.room_id, selectedFile);
        console.log('ChatWindow - File upload result:', result);
        setSelectedFile(null);
        setFileUploadDialog(false);
      } catch (error) {
        console.error('ChatWindow - Error uploading file:', error);
      }
    } else {
      console.log('ChatWindow - File upload not started. selectedFile:', !!selectedFile, 'room:', !!room);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileUploadDialog(true);
    }
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    messageInputRef.current?.focus();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewParticipants = async () => {
    setLoadingParticipants(true);
    setParticipantsDialog(true);
    handleMenuClose();
    
    if (room?.room_id) {
      const roomParticipants = await fetchParticipants(room.room_id);
      setParticipants(roomParticipants);
    }
    setLoadingParticipants(false);
  };

  const handleRoomSettings = () => {
    setSettingsDialog(true);
    handleMenuClose();
  };

  const handleLeaveRoom = () => {
    setLeaveRoomDialog(true);
    handleMenuClose();
  };

  if (!room) {
    return (
      <Paper
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100]
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Select a chat room to start messaging
        </Typography>
      </Paper>
    );
  }

  const roomMessages = messages[room.room_id] || [];
  const typingUsers = getTypingUsers(room.room_id);

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.primary[400]
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${colors.primary[200]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: colors.greenAccent[500] }}>
            {(room.room_type === 'group' || room.room_type === 'role') ? (
              <PersonIcon />
            ) : (
              room.room_name.charAt(0).toUpperCase()
            )}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {room.room_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {room.room_type === 'project' && room.project_name && (
                `Project: ${room.project_name}`
              )}
              {room.room_type === 'group' && `${room.participant_count} members`}
              {room.room_type === 'role' && room.role_name && (
                <Chip 
                  label={`Role: ${room.role_name}`} 
                  size="small" 
                  sx={{ 
                    backgroundColor: colors.greenAccent[500], 
                    color: colors.grey[100],
                    fontSize: '0.7rem',
                    height: '20px'
                  }} 
                />
              )}
              {room.room_type === 'role' && `${room.participant_count} members`}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <MessageList
          messages={roomMessages}
          currentUser={user}
          onReply={handleReply}
          room={room}
        />
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
      </Box>

      {/* Reply Preview */}
      {replyToMessage && (
        <Box
          sx={{
            p: 1,
            backgroundColor: isDarkMode ? colors.primary[300] : colors.primary[200],
            borderTop: `1px solid ${colors.primary[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReplyIcon fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              Replying to {replyToMessage.firstName} {replyToMessage.lastName}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {replyToMessage.message_text?.substring(0, 50)}
              {replyToMessage.message_text?.length > 50 ? '...' : ''}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setReplyToMessage(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${colors.primary[200]}`,
          backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50]
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <TextField
            ref={messageInputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={messageText}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100]
              }
            }}
          />
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ color: colors.grey[100] }}
          >
            <AttachFileIcon />
          </IconButton>
          
          <IconButton
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            sx={{
              color: messageText.trim() ? colors.greenAccent[500] : colors.grey[500]
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewParticipants}>View Participants</MenuItem>
        <MenuItem onClick={handleRoomSettings}>Room Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLeaveRoom}>Leave Room</MenuItem>
      </Menu>

      {/* File Upload Dialog */}
      <Dialog open={fileUploadDialog} onClose={() => setFileUploadDialog(false)}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Typography variant="body1">
                File: {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleFileUpload} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Participants Dialog */}
      <Dialog 
        open={participantsDialog} 
        onClose={() => setParticipantsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50],
            color: colors.grey[100]
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100], borderBottom: `1px solid ${isDarkMode ? colors.primary[300] : colors.primary[200]}` }}>
          Room Participants
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loadingParticipants ? 'Loading...' : `${participants.length} participants in this room`}
          </Typography>
          
          {loadingParticipants ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <List>
              {participants.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No participants found"
                    secondary="This room may not have any participants yet"
                  />
                </ListItem>
              ) : (
                participants.map((participant) => (
                  <ListItem key={participant.userId}>
                    <Avatar sx={{ bgcolor: colors.greenAccent[500], mr: 2 }}>
                      {participant.firstName?.charAt(0) || participant.lastName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">
                        {participant.firstName} {participant.lastName}
                        {participant.userId === user?.id ? ' (You)' : ''}
                        {participant.is_admin ? (
                          <Chip
                            label="Admin"
                            size="small"
                            sx={{
                              ml: 1,
                                  backgroundColor: colors.greenAccent[500],
                                  color: colors.grey[100],
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        ) : null}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {participant.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Joined: {new Date(participant.joined_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: colors.primary[400] }}>
          <Button onClick={() => {
            setParticipantsDialog(false);
            setParticipants([]);
          }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Room Settings Dialog */}
      <Dialog 
        open={settingsDialog} 
        onClose={() => setSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50],
            color: colors.grey[100]
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100], borderBottom: `1px solid ${isDarkMode ? colors.primary[300] : colors.primary[200]}` }}>
          Room Settings
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {room?.room_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {room?.description || 'No description available'}
            </Typography>
            <Chip 
              label={room?.room_type || 'group'} 
              size="small" 
                  sx={{
                    backgroundColor: isDarkMode ? colors.primary[300] : colors.primary[200],
                    color: colors.greenAccent[500],
                textTransform: 'capitalize'
              }}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Room settings and management features will be available here.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setSettingsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Leave Room Confirmation Dialog */}
      <Dialog 
        open={leaveRoomDialog} 
        onClose={() => setLeaveRoomDialog(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50],
            color: colors.grey[100]
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100], borderBottom: `1px solid ${isDarkMode ? colors.primary[300] : colors.primary[200]}` }}>
          Leave Room
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Are you sure you want to leave "{room?.room_name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You won't receive any new messages from this room.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: colors.primary[400] }}>
          <Button onClick={() => setLeaveRoomDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              // TODO: Implement leave room functionality
              console.log('Leaving room:', room?.room_id);
              setLeaveRoomDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Leave Room
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ChatWindow;

