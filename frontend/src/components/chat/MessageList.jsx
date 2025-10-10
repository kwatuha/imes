import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Chip,
  useTheme
} from '@mui/material';
import {
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { tokens } from '../../pages/dashboard/theme';

const MessageList = ({ messages, currentUser, onReply, room }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Helper function to check if current mode is a dark theme
  const isDarkMode = theme.palette.mode === 'dark';
  const messagesEndRef = useRef(null);

  // Debug: Log message structure for all rooms
  useEffect(() => {
    if (messages && messages.length > 0) {
      console.log('MessageList - Messages structure for room:', {
        roomId: room?.room_id,
        roomType: room?.room_type,
        roomName: room?.room_name,
        messageCount: messages.length,
        senders: [...new Set(messages.map(m => m.sender_id))],
        currentUser: currentUser,
        currentUserId: currentUser?.id,
        currentUserActualId: currentUser?.actualUserId,
        messagesWithSenderInfo: messages.map(m => ({
          message_id: m.message_id,
          sender_id: m.sender_id,
          sender_id_type: typeof m.sender_id,
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email,
          hasSenderInfo: !!(m.firstName && m.lastName),
          message_preview: m.message_text?.substring(0, 20) + '...',
          isCurrentUserMessage: m.sender_id === (currentUser?.id || currentUser?.actualUserId)
        }))
      });
    }
  }, [messages, room, currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDownload = (message) => {
    if (!message.file_url || !message.file_name) return;
    
    // Use the correct environment variable name and construct the proper URL
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiBaseUrl.replace('/api', ''); // Remove /api suffix for static files
    const fileUrl = `${baseUrl}${message.file_url}`;
    
    console.log('Download URL:', fileUrl);
    
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = message.file_name;
    link.target = '_blank';
    
    // Add to DOM, click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMessage = (message, index) => {
    // Handle type conversion for user ID comparison
    const currentUserId = currentUser?.id || currentUser?.actualUserId;
    const messageSenderId = message.sender_id;
    const isCurrentUser = String(messageSenderId) === String(currentUserId);
    
    const showAvatar = (
      index === 0 || 
      messages[index - 1]?.sender_id !== message.sender_id ||
      new Date(message.created_at).getTime() - new Date(messages[index - 1]?.created_at).getTime() > 300000 // 5 minutes
    );
    
    // Debug: Log message rendering details
    if (room?.room_type === 'role' || room?.room_type === 'group') {
      console.log('MessageList - Rendering message:', {
        messageId: message.message_id,
        senderId: message.sender_id,
        firstName: message.firstName,
        lastName: message.lastName,
        isCurrentUser,
        showAvatar,
        roomType: room?.room_type,
        hasSenderInfo: !!(message.firstName && message.lastName),
        currentUser: currentUser,
        currentUserId: currentUser?.id || currentUser?.actualUserId,
        userIdComparison: {
          messageSenderId: message.sender_id,
          currentUserId: currentUser?.id || currentUser?.actualUserId,
          isEqual: isCurrentUser,
          messageSenderIdType: typeof messageSenderId,
          currentUserIdType: typeof currentUserId,
          stringComparison: String(messageSenderId) === String(currentUserId)
        }
      });
    }
    
    const showDateSeparator = index === 0 || 
      formatDate(message.created_at) !== formatDate(messages[index - 1]?.created_at);

    return (
      <React.Fragment key={message.message_id}>
        {/* Date Separator */}
        {showDateSeparator && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              my: 2
            }}
          >
            <Chip
              label={formatDate(message.created_at)}
              size="small"
              sx={{
                backgroundColor: isDarkMode ? colors.primary[300] : colors.primary[200],
                color: colors.grey[100]
              }}
            />
          </Box>
        )}

        {/* Message */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            mb: 1,
            px: 2
          }}
        >
          {/* Avatar */}
          {showAvatar && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: isCurrentUser 
                  ? (isDarkMode ? colors.blueAccent[500] : colors.blueAccent[500])
                  : (isDarkMode ? colors.greenAccent[500] : colors.greenAccent[500]),
                fontSize: '0.875rem',
                color: 'white',
                fontWeight: 600,
                boxShadow: !isDarkMode 
                  ? `0 2px 8px ${isCurrentUser ? colors.blueAccent[100] : colors.greenAccent[100]}40`
                  : 'none'
              }}
            >
              {message.firstName?.charAt(0) || '?'}{message.lastName?.charAt(0) || '?'}
            </Avatar>
          )}
          
          {!showAvatar && (
            <Box sx={{ width: 40 }} /> // Spacer for alignment
          )}

          {/* Message Content */}
          <Box
            sx={{
              maxWidth: '70%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Sender Name (for group and role-based chats) */}
            {(room?.room_type === 'group' || room?.room_type === 'role') && (
              <Typography
                variant="caption"
                sx={{
                  color: isCurrentUser 
                    ? (isDarkMode ? colors.blueAccent[400] : colors.blueAccent[600])
                    : (isDarkMode ? colors.grey[300] : colors.grey[600]),
                  mb: 0.5,
                  ml: showAvatar ? 1 : 0,
                  fontWeight: isCurrentUser ? 600 : 500,
                  textShadow: !isDarkMode && isCurrentUser ? `0 1px 2px ${colors.blueAccent[100]}40` : 'none'
                }}
              >
                {message.firstName || 'Unknown'} {message.lastName || 'User'}
                {isCurrentUser && ' (You)'}
              </Typography>
            )}

            {/* Reply Preview */}
            {message.reply_to_message_id && (
              <Paper
                sx={{
                  p: 1,
                  mb: 0.5,
                  backgroundColor: isDarkMode ? colors.primary[300] : colors.primary[200],
                  borderLeft: `3px solid ${colors.greenAccent[500]}`,
                  maxWidth: '100%'
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  {message.reply_user_firstName} {message.reply_user_lastName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {message.reply_message_text}
                </Typography>
              </Paper>
            )}

            {/* Message Bubble */}
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: isCurrentUser 
                  ? (isDarkMode ? colors.blueAccent[600] : colors.blueAccent[100])
                  : (isDarkMode ? colors.grey[700] : colors.grey[50]),
                color: isCurrentUser 
                  ? (isDarkMode ? colors.grey[100] : colors.blueAccent[700])
                  : (isDarkMode ? colors.grey[100] : colors.grey[700]),
                borderRadius: 2,
                borderTopLeftRadius: isCurrentUser ? 2 : (showAvatar ? 2 : 0.5),
                borderTopRightRadius: isCurrentUser ? (showAvatar ? 2 : 0.5) : 2,
                position: 'relative',
                boxShadow: isDarkMode 
                  ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                  : isCurrentUser 
                    ? `0 4px 16px ${colors.blueAccent[100]}40, 0 2px 8px ${colors.blueAccent[100]}20`
                    : `0 2px 8px ${colors.grey[100]}60, 0 1px 4px ${colors.grey[100]}40`,
                border: !isDarkMode ? `1px solid ${isCurrentUser ? colors.blueAccent[200] : colors.grey[200]}` : 'none',
                '&:hover .message-actions': {
                  opacity: 1
                }
              }}
            >
              {/* File/Image Message */}
              {message.message_type === 'file' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon />
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: isCurrentUser 
                          ? (isDarkMode ? colors.grey[100] : colors.blueAccent[700])
                          : (isDarkMode ? colors.grey[100] : colors.grey[700])
                      }}
                    >
                      {message.file_name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: isCurrentUser 
                          ? (isDarkMode ? colors.grey[200] : colors.blueAccent[600])
                          : (isDarkMode ? colors.grey[300] : colors.grey[600]),
                        fontWeight: 500
                      }}
                    >
                      {message.file_size && `${(message.file_size / 1024 / 1024).toFixed(2)} MB`}
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDownload(message)}
                    sx={{ 
                      color: colors.grey[300],
                      '&:hover': {
                        backgroundColor: colors.primary[200],
                        color: colors.greenAccent[500]
                      }
                    }}
                    title="Download file"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {message.message_type === 'image' && (
                <Box>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${message.file_url}`}
                      alt={message.file_name}
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px'
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleDownload(message)}
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)'
                        }
                      }}
                      title="Download image"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {message.file_name && (
                    <Typography 
                      variant="caption" 
                      display="block" 
                      sx={{ 
                        mt: 0.5,
                        color: isCurrentUser 
                          ? (isDarkMode ? colors.grey[200] : colors.blueAccent[600])
                          : (isDarkMode ? colors.grey[300] : colors.grey[600]),
                        fontWeight: 500
                      }}
                    >
                      {message.file_name}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Text Message */}
              {message.message_type === 'text' && message.message_text && (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: isCurrentUser 
                      ? (isDarkMode ? colors.grey[100] : colors.blueAccent[700])
                      : (isDarkMode ? colors.grey[100] : colors.grey[700]),
                    fontWeight: 500,
                    lineHeight: 1.5
                  }}
                >
                  {message.message_text}
                </Typography>
              )}

              {/* System Message */}
              {message.message_type === 'system' && (
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    color: colors.grey[300]
                  }}
                >
                  {message.message_text}
                </Typography>
              )}

              {/* Message Actions */}
              <Box
                className="message-actions"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: isCurrentUser ? 'auto' : -10,
                  left: isCurrentUser ? -10 : 'auto',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  gap: 0.5
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onReply(message)}
                  sx={{
                    backgroundColor: isDarkMode ? colors.grey[600] : colors.blueAccent[100],
                    color: isDarkMode ? colors.grey[100] : colors.blueAccent[600],
                    border: !isDarkMode ? `1px solid ${colors.blueAccent[200]}` : 'none',
                    '&:hover': {
                      backgroundColor: isDarkMode ? colors.grey[500] : colors.blueAccent[200],
                      transform: 'translateY(-1px)',
                      boxShadow: !isDarkMode ? `0 2px 8px ${colors.blueAccent[100]}40` : 'none'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode ? colors.grey[600] : colors.blueAccent[100],
                    color: isDarkMode ? colors.grey[100] : colors.blueAccent[600],
                    border: !isDarkMode ? `1px solid ${colors.blueAccent[200]}` : 'none',
                    '&:hover': {
                      backgroundColor: isDarkMode ? colors.grey[500] : colors.blueAccent[200],
                      transform: 'translateY(-1px)',
                      boxShadow: !isDarkMode ? `0 2px 8px ${colors.blueAccent[100]}40` : 'none'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>

            {/* Timestamp */}
            <Typography
              variant="caption"
              sx={{
                color: isDarkMode ? colors.grey[400] : colors.grey[600],
                mt: 0.5,
                mx: 1,
                opacity: 0.9,
                fontWeight: 500
              }}
            >
              {formatTime(message.created_at)}
              {message.edited_at && (
                <span style={{ fontStyle: 'italic' }}> (edited)</span>
              )}
            </Typography>
          </Box>
        </Box>
      </React.Fragment>
    );
  };

  return (
    <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              py: 1,
              backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[50]
            }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No messages yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start the conversation by sending a message
          </Typography>
        </Box>
      ) : (
        <>
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} />
        </>
      )}
    </Box>
  );
};

export default MessageList;

