import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { axiosInstance } from '../api';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Initialize Socket.IO connection
  useEffect(() => {
    console.log('ChatContext - Initializing socket connection...');
    console.log('ChatContext - User:', user);
    console.log('ChatContext - Token exists:', !!token);
    
    if (user && token) {
      // Connect through nginx proxy for socket.io
      // Always use port 8080 for socket connections since that's where nginx routes socket.io
      const socketUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8080' 
        : window.location.protocol + '//' + window.location.host;
      console.log('ChatContext - Creating socket connection to', socketUrl);
      console.log('ChatContext - window.location:', window.location);
      const newSocket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('ChatContext - Connected to chat server');
        setIsConnected(true);
        newSocket.emit('join_rooms');
        // Fetch rooms when connected
        fetchRooms();
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('ChatContext - Connection error:', error);
        console.error('ChatContext - Error details:', error.message, error.description);
        setIsConnected(false);
      });

      // Handle new messages
      newSocket.on('new_message', (messageData) => {
        const { roomId } = messageData;
        setMessages(prev => ({
          ...prev,
          [roomId]: [...(prev[roomId] || []), messageData]
        }));

        // Update unread count if not in active room
        if (activeRoom !== roomId) {
          setUnreadCounts(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + 1
          }));
        }
      });

      // Handle typing indicators
      newSocket.on('user_typing', (data) => {
        const { userId, firstName, lastName, roomId } = data;
        setTypingUsers(prev => ({
          ...prev,
          [roomId]: {
            ...prev[roomId],
            [userId]: `${firstName} ${lastName}`
          }
        }));
      });

      newSocket.on('user_stopped_typing', (data) => {
        const { userId, roomId } = data;
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          if (newTyping[roomId]) {
            delete newTyping[roomId][userId];
            if (Object.keys(newTyping[roomId]).length === 0) {
              delete newTyping[roomId];
            }
          }
          return newTyping;
        });
      });

      // Handle user join/leave
      newSocket.on('user_joined', (data) => {
        console.log(`${data.firstName} ${data.lastName} joined the room`);
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      });

      newSocket.on('user_left', (data) => {
        console.log(`${data.firstName} ${data.lastName} left the room`);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });

      // Handle message reactions
      newSocket.on('message_reaction', (data) => {
        const { messageId, userId, firstName, lastName, reactionType, action } = data;
        // Update message reactions in state
        // This would require more complex state management for reactions
        console.log(`${firstName} ${lastName} ${action}ed reaction ${reactionType} to message ${messageId}`);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  // Fetch chat rooms
  const fetchRooms = useCallback(async () => {
    try {
      console.log('ChatContext - fetchRooms called');
      console.log('ChatContext - axiosInstance baseURL:', axiosInstance.defaults.baseURL);
      const response = await axiosInstance.get('/chat/rooms');
      console.log('ChatContext - Chat rooms response:', response.data);
      if (response.data.success) {
        setRooms(response.data.rooms);
        console.log('ChatContext - Set rooms count:', response.data.rooms.length);
        console.log('ChatContext - Rooms:', response.data.rooms);
        
        // Initialize unread counts
        const counts = {};
        response.data.rooms.forEach(room => {
          counts[room.room_id] = room.unread_count || 0;
        });
        setUnreadCounts(counts);
      } else {
        console.error('ChatContext - fetchRooms failed:', response.data);
      }
    } catch (error) {
      console.error('ChatContext - Error fetching chat rooms:', error);
      console.error('ChatContext - Error details:', error.response?.data);
      console.error('ChatContext - Error status:', error.response?.status);
    }
  }, []);

  // Fetch rooms on mount if user is authenticated
  useEffect(() => {
    console.log('ChatContext - useEffect triggered. User:', !!user, 'Token:', !!token);
    if (user && token) {
      console.log('User authenticated, fetching rooms...');
      fetchRooms();
    } else {
      console.log('ChatContext - User or token not available:', { user: !!user, token: !!token });
    }
  }, [user, token, fetchRooms]);

  // Fetch messages for a room
  const fetchMessages = useCallback(async (roomId, page = 1) => {
    try {
      const response = await axiosInstance.get(`/chat/rooms/${roomId}/messages?page=${page}&limit=50`);
      if (response.data.success) {
        setMessages(prev => ({
          ...prev,
          [roomId]: response.data.messages
        }));
        
        // Clear unread count for this room
        setUnreadCounts(prev => ({
          ...prev,
          [roomId]: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback((roomId, messageText, replyToMessageId = null) => {
    console.log('ChatContext - sendMessage called');
    console.log('ChatContext - roomId:', roomId);
    console.log('ChatContext - messageText:', messageText);
    console.log('ChatContext - socket:', !!socket);
    console.log('ChatContext - isConnected:', isConnected);
    
    if (socket && isConnected) {
      console.log('ChatContext - Emitting send_message event');
      socket.emit('send_message', {
        roomId,
        message_text: messageText,
        message_type: 'text',
        reply_to_message_id: replyToMessageId
      });
    } else {
      console.log('ChatContext - Cannot send message. socket:', !!socket, 'isConnected:', isConnected);
    }
  }, [socket, isConnected]);

  // Join room
  const joinRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
      setActiveRoom(roomId);
      fetchMessages(roomId);
    }
  }, [socket, isConnected, fetchMessages]);

  // Leave room
  const leaveRoom = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
      if (activeRoom === roomId) {
        setActiveRoom(null);
      }
    }
  }, [socket, isConnected, activeRoom]);

  // Create new room
  const createRoom = useCallback(async (roomData) => {
    try {
      console.log('ChatContext - Creating room with data:', roomData);
      const response = await axiosInstance.post('/chat/rooms', roomData);
      console.log('ChatContext - Create room response:', response.data);
      
      if (response.data.success) {
        console.log('ChatContext - Room created successfully, refreshing rooms...');
        await fetchRooms(); // Refresh rooms list
        return response.data.room_id;
      } else {
        console.error('ChatContext - Room creation failed:', response.data);
        throw new Error(response.data.message || 'Room creation failed');
      }
    } catch (error) {
      console.error('ChatContext - Error creating room:', error);
      console.error('ChatContext - Error response:', error.response?.data);
      throw error;
    }
  }, [fetchRooms]);

  // Fetch room participants
  const fetchParticipants = useCallback(async (roomId) => {
    try {
      console.log('ChatContext - Fetching participants for room:', roomId);
      console.log('ChatContext - axiosInstance baseURL:', axiosInstance.defaults.baseURL);
      const response = await axiosInstance.get(`/chat/rooms/${roomId}/participants`);
      console.log('ChatContext - Participants response status:', response.status);
      console.log('ChatContext - Participants response:', response.data);
      if (response.data.success) {
        console.log('ChatContext - Returning participants:', response.data.participants);
        return response.data.participants;
      } else {
        console.error('ChatContext - fetchParticipants failed:', response.data);
        return [];
      }
    } catch (error) {
      console.error('ChatContext - Error fetching participants:', error);
      console.error('ChatContext - Error status:', error.response?.status);
      console.error('ChatContext - Error details:', error.response?.data);
      return [];
    }
  }, []);

  // Upload file
  const uploadFile = useCallback(async (roomId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosInstance.post(`/chat/rooms/${roomId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // File upload creates a message automatically
        return response.data;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, []);

  // Start typing indicator
  const startTyping = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { roomId });
    }
  }, [socket, isConnected]);

  // Stop typing indicator
  const stopTyping = useCallback((roomId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { roomId });
    }
  }, [socket, isConnected]);

  // Add reaction to message
  const addReaction = useCallback((messageId, reactionType) => {
    if (socket && isConnected) {
      socket.emit('add_reaction', { messageId, reactionType });
    }
  }, [socket, isConnected]);

  // Remove reaction from message
  const removeReaction = useCallback((messageId, reactionType) => {
    if (socket && isConnected) {
      socket.emit('remove_reaction', { messageId, reactionType });
    }
  }, [socket, isConnected]);

  // Get total unread count
  const getTotalUnreadCount = useCallback(() => {
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  }, [unreadCounts]);

  // Get typing users for a room
  const getTypingUsers = useCallback((roomId) => {
    return typingUsers[roomId] ? Object.values(typingUsers[roomId]) : [];
  }, [typingUsers]);

  const value = {
    // Connection state
    isConnected,
    socket,
    
    // Data
    rooms,
    activeRoom,
    messages,
    unreadCounts,
    onlineUsers,
    
    // Actions
    fetchRooms,
    fetchMessages,
    fetchParticipants,
    sendMessage,
    joinRoom,
    leaveRoom,
    createRoom,
    uploadFile,
    setActiveRoom,
    
    // Typing indicators
    startTyping,
    stopTyping,
    getTypingUsers,
    
    // Reactions
    addReaction,
    removeReaction,
    
    // Utilities
    getTotalUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext };
export default ChatProvider;
