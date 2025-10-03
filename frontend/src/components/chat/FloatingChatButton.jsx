import React, { useState } from 'react';
import {
  Fab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  useTheme,
  Slide,
  Box
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useChat } from '../../context/ChatContext';
import { tokens } from '../../pages/dashboard/theme';
import RoomList from './RoomList';
import ChatWindow from './ChatWindow';
import CreateRoomModal from './CreateRoomModal';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FloatingChatButton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Helper function to check if current mode is a dark theme
  const isDarkMode = isDarkMode || theme.palette.mode === 'professional';
  const { getTotalUnreadCount, isConnected, fetchRooms, joinRoom } = useChat();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  const totalUnreadCount = getTotalUnreadCount();

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleRoomSelect = (room) => {
    console.log('FloatingChatButton - Room selected:', room);
    setSelectedRoom(room);
    // Join the room to fetch messages
    if (room && room.room_id) {
      console.log('FloatingChatButton - Joining room:', room.room_id);
      joinRoom(room.room_id);
    }
  };

  const handleCreateRoom = () => {
    setCreateRoomOpen(true);
  };

  const handleRoomCreated = () => {
    // Refresh the rooms list after creating a new room
    fetchRooms();
  };

  // Debug: Show connection status
  console.log('FloatingChatButton - isConnected:', isConnected);
  
  // Temporarily show button for debugging
  // if (!isConnected) {
  //   return null; // Don't show the button if not connected to chat
  // }

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={handleChatToggle}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: colors.greenAccent[500],
          '&:hover': {
            backgroundColor: colors.greenAccent[600]
          }
        }}
      >
        <Badge
          badgeContent={totalUnreadCount}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: colors.redAccent[500],
              color: 'white',
              fontSize: '0.75rem'
            }
          }}
        >
          <ChatIcon />
        </Badge>
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Transition}
        sx={{
          '& .MuiDialog-paper': {
            height: '80vh',
            backgroundColor: isDarkMode ? colors.primary[500] : colors.primary[50],
            position: 'fixed',
            bottom: 100,
            right: 24,
            top: 'auto',
            left: 'auto',
            margin: 0,
            maxWidth: '800px',
            width: '800px',
            borderRadius: 2,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
              : '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: `1px solid ${isDarkMode ? colors.primary[400] : colors.primary[200]}`
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: isDarkMode ? colors.primary[400] : colors.primary[100],
            borderBottom: `1px solid ${isDarkMode ? colors.primary[300] : colors.primary[200]}`,
            color: isDarkMode ? colors.grey[100] : colors.grey[900],
            fontWeight: 600
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon sx={{ color: colors.greenAccent[500] }} />
            <span>Team Chat</span>
          </Box>
          <IconButton 
            onClick={() => setChatOpen(false)} 
            size="small"
            sx={{ 
              color: isDarkMode ? colors.grey[300] : colors.grey[600],
              '&:hover': {
                backgroundColor: isDarkMode ? colors.primary[300] : colors.primary[200]
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, display: 'flex', height: '100%' }}>
          <Grid container sx={{ height: '100%' }}>
            <Grid 
              item 
              xs={4} 
              sx={{ 
                borderRight: `1px solid ${colors.primary[200]}`,
                minHeight: '500px'
              }}
            >
              <RoomList
                onRoomSelect={handleRoomSelect}
                selectedRoom={selectedRoom}
                onCreateRoom={handleCreateRoom}
              />
            </Grid>
            <Grid item xs={8} sx={{ minHeight: '500px' }}>
              <ChatWindow
                room={selectedRoom}
                onClose={() => setSelectedRoom(null)}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      
      {/* Create Room Modal */}
      <CreateRoomModal
        open={createRoomOpen}
        onClose={() => setCreateRoomOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </>
  );
};

export default FloatingChatButton;

