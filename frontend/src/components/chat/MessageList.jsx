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
  const messagesEndRef = useRef(null);

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
    const isCurrentUser = message.sender_id === (currentUser?.id || currentUser?.actualUserId);
    const showAvatar = !isCurrentUser && (
      index === 0 || 
      messages[index - 1]?.sender_id !== message.sender_id ||
      new Date(message.created_at).getTime() - new Date(messages[index - 1]?.created_at).getTime() > 300000 // 5 minutes
    );
    
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
                backgroundColor: colors.primary[300],
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
          {showAvatar && !isCurrentUser && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: colors.greenAccent[500],
                fontSize: '0.875rem'
              }}
            >
              {message.firstName?.charAt(0)}{message.lastName?.charAt(0)}
            </Avatar>
          )}
          
          {!showAvatar && !isCurrentUser && (
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
            {/* Sender Name (for group chats) */}
            {showAvatar && !isCurrentUser && room?.room_type === 'group' && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.grey[300],
                  mb: 0.5,
                  ml: 1
                }}
              >
                {message.firstName} {message.lastName}
              </Typography>
            )}

            {/* Reply Preview */}
            {message.reply_to_message_id && (
              <Paper
                sx={{
                  p: 1,
                  mb: 0.5,
                  backgroundColor: colors.primary[300],
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
                backgroundColor: isCurrentUser ? colors.greenAccent[500] : colors.primary[300],
                color: isCurrentUser ? colors.primary[900] : colors.grey[100],
                borderRadius: 2,
                borderTopLeftRadius: isCurrentUser ? 2 : (showAvatar ? 2 : 0.5),
                borderTopRightRadius: isCurrentUser ? (showAvatar ? 2 : 0.5) : 2,
                position: 'relative',
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
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {message.file_name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
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
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
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
                    wordBreak: 'break-word'
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
                    backgroundColor: colors.primary[400],
                    '&:hover': {
                      backgroundColor: colors.primary[300]
                    }
                  }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    backgroundColor: colors.primary[400],
                    '&:hover': {
                      backgroundColor: colors.primary[300]
                    }
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
                color: colors.grey[400],
                mt: 0.5,
                mx: 1
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
        backgroundColor: colors.primary[400]
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

