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
  const { getTotalUnreadCount, isConnected, fetchRooms } = useChat();
  
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  const totalUnreadCount = getTotalUnreadCount();

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
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
            backgroundColor: '#ffffff',
            position: 'fixed',
            bottom: 100,
            right: 24,
            top: 'auto',
            left: 'auto',
            margin: 0,
            maxWidth: '800px',
            width: '800px',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e9ecef'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            color: '#2c3e50',
            fontWeight: 600
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon sx={{ color: '#007bff' }} />
            <span>Team Chat</span>
          </Box>
          <IconButton 
            onClick={() => setChatOpen(false)} 
            size="small"
            sx={{ 
              color: '#6c757d',
              '&:hover': {
                backgroundColor: '#e9ecef'
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

