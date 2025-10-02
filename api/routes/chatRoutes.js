const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/authenticate');
const privilegeMiddleware = require('../middleware/privilegeMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for chat file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/chat-files/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Get user's chat rooms
router.get('/rooms', authenticate, async (req, res) => {
  try {
    const userId = req.user.id || req.user.actualUserId;
    console.log('Fetching rooms for user:', userId);
    
    const query = `
      SELECT DISTINCT 
        r.room_id,
        r.room_name,
        r.room_type,
        r.description,
        r.project_id,
        r.created_at,
        p.projectName as project_name,
        (SELECT COUNT(*) FROM chat_room_participants WHERE room_id = r.room_id) as participant_count,
        (SELECT COUNT(*) FROM chat_messages WHERE room_id = r.room_id AND created_at > COALESCE(crp.last_read_at, '1970-01-01')) as unread_count,
        (SELECT message_text FROM chat_messages WHERE room_id = r.room_id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM chat_messages WHERE room_id = r.room_id ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM chat_rooms r
      INNER JOIN chat_room_participants crp ON r.room_id = crp.room_id AND crp.user_id = ?
      LEFT JOIN kemri_projects p ON r.project_id = p.id
      WHERE r.is_active = 1
      ORDER BY last_message_time DESC, r.created_at DESC
    `;
    
    const [rooms] = await db.execute(query, [userId]);
    res.json({ success: true, rooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat rooms' });
  }
});

// Create new chat room
router.post('/rooms', authenticate, privilegeMiddleware(['chat.create_room']), async (req, res) => {
  try {
    const { room_name, room_type, description, project_id, participant_ids } = req.body;
    const userId = req.user.id || req.user.actualUserId;
    
    console.log('Creating room with data:', { room_name, room_type, description, project_id, participant_ids, userId });
    
    // Insert new room
    const [result] = await db.execute(
      'INSERT INTO chat_rooms (room_name, room_type, description, project_id, created_by) VALUES (?, ?, ?, ?, ?)',
      [room_name, room_type, description, project_id === null ? null : project_id, userId]
    );
    
    const roomId = result.insertId;
    
    // Add creator as admin participant
    await db.execute(
      'INSERT INTO chat_room_participants (room_id, user_id, is_admin) VALUES (?, ?, 1)',
      [roomId, userId]
    );
    
    // Add other participants if provided
    if (participant_ids && participant_ids.length > 0) {
      console.log('Adding participants:', participant_ids);
      for (const participantId of participant_ids) {
        await db.execute(
          'INSERT INTO chat_room_participants (room_id, user_id, is_admin) VALUES (?, ?, 0)',
          [roomId, participantId]
        );
      }
    }
    
    res.json({ success: true, room_id: roomId, message: 'Chat room created successfully' });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ success: false, message: 'Failed to create chat room' });
  }
});

// Get messages for a specific room
router.get('/rooms/:roomId/messages', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.userId;
    const offset = (page - 1) * limit;
    
    // Check if user has access to this room
    const [access] = await db.execute(
      'SELECT 1 FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (access.length === 0) {
      return res.status(403).json({ success: false, message: 'Access denied to this chat room' });
    }
    
    const query = `
      SELECT 
        m.message_id,
        m.message_text,
        m.message_type,
        m.file_url,
        m.file_name,
        m.file_size,
        m.reply_to_message_id,
        m.created_at,
        m.edited_at,
        u.firstName,
        u.lastName,
        u.email,
        rm.message_text as reply_message_text,
        ru.firstName as reply_user_firstName,
        ru.lastName as reply_user_lastName
      FROM chat_messages m
      LEFT JOIN kemri_users u ON m.sender_id = u.userId
      LEFT JOIN chat_messages rm ON m.reply_to_message_id = rm.message_id
      LEFT JOIN kemri_users ru ON rm.sender_id = ru.userId
      WHERE m.room_id = ? AND m.is_deleted = 0
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [messages] = await db.execute(query, [roomId, parseInt(limit), offset]);
    
    // Update last read timestamp
    await db.execute(
      'UPDATE chat_room_participants SET last_read_at = NOW() WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// Send message to a room
router.post('/rooms/:roomId/messages', authenticate, privilegeMiddleware(['chat.send_message']), async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message_text, message_type = 'text', reply_to_message_id } = req.body;
    const userId = req.user.userId;
    
    // Check if user has access to this room
    const [access] = await db.execute(
      'SELECT 1 FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (access.length === 0) {
      return res.status(403).json({ success: false, message: 'Access denied to this chat room' });
    }
    
    // Insert message
    const [result] = await db.execute(
      'INSERT INTO chat_messages (room_id, sender_id, message_text, message_type, reply_to_message_id) VALUES (?, ?, ?, ?, ?)',
      [roomId, userId, message_text, message_type, reply_to_message_id || null]
    );
    
    // Get the complete message data for real-time broadcast
    const [messageData] = await db.execute(`
      SELECT 
        m.message_id,
        m.message_text,
        m.message_type,
        m.created_at,
        m.reply_to_message_id,
        u.firstName,
        u.lastName,
        u.email
      FROM chat_messages m
      LEFT JOIN kemri_users u ON m.sender_id = u.userId
      WHERE m.message_id = ?
    `, [result.insertId]);
    
    res.json({ 
      success: true, 
      message_id: result.insertId,
      message: 'Message sent successfully',
      messageData: messageData[0]
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// Upload file to chat
router.post('/rooms/:roomId/upload', authenticate, privilegeMiddleware(['chat.upload_file']), upload.single('file'), async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Check if user has access to this room
    const [access] = await db.execute(
      'SELECT 1 FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (access.length === 0) {
      return res.status(403).json({ success: false, message: 'Access denied to this chat room' });
    }
    
    const fileUrl = `/uploads/chat-files/${file.filename}`;
    const messageType = file.mimetype.startsWith('image/') ? 'image' : 'file';
    
    // Insert file message
    const [result] = await db.execute(
      'INSERT INTO chat_messages (room_id, sender_id, message_type, file_url, file_name, file_size) VALUES (?, ?, ?, ?, ?, ?)',
      [roomId, userId, messageType, fileUrl, file.originalname, file.size]
    );
    
    res.json({ 
      success: true, 
      message_id: result.insertId,
      file_url: fileUrl,
      file_name: file.originalname,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
});

// Join a chat room
router.post('/rooms/:roomId/join', authenticate, privilegeMiddleware(['chat.join_room']), async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    
    // Check if room exists and is active
    const [room] = await db.execute(
      'SELECT room_type FROM chat_rooms WHERE room_id = ? AND is_active = 1',
      [roomId]
    );
    
    if (room.length === 0) {
      return res.status(404).json({ success: false, message: 'Chat room not found' });
    }
    
    // Check if already a participant
    const [existing] = await db.execute(
      'SELECT 1 FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Already a member of this room' });
    }
    
    // Add user to room
    await db.execute(
      'INSERT INTO chat_room_participants (room_id, user_id) VALUES (?, ?)',
      [roomId, userId]
    );
    
    res.json({ success: true, message: 'Joined chat room successfully' });
  } catch (error) {
    console.error('Error joining chat room:', error);
    res.status(500).json({ success: false, message: 'Failed to join chat room' });
  }
});

// Leave a chat room
router.delete('/rooms/:roomId/leave', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;
    
    // Remove user from room
    const [result] = await db.execute(
      'DELETE FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Not a member of this room' });
    }
    
    res.json({ success: true, message: 'Left chat room successfully' });
  } catch (error) {
    console.error('Error leaving chat room:', error);
    res.status(500).json({ success: false, message: 'Failed to leave chat room' });
  }
});

// Get room participants
router.get('/rooms/:roomId/participants', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id || req.user.actualUserId;
    
    console.log('Fetching participants for room:', roomId, 'by user:', userId);
    
    // Check if user has access to this room
    const [access] = await db.execute(
      'SELECT 1 FROM chat_room_participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    console.log('Access check result:', access.length > 0 ? 'Granted' : 'Denied');
    
    if (access.length === 0) {
      console.log('Access denied for user', userId, 'to room', roomId);
      return res.status(403).json({ success: false, message: 'Access denied to this chat room' });
    }
    
    const query = `
      SELECT 
        u.userId,
        u.firstName,
        u.lastName,
        u.email,
        crp.joined_at,
        crp.is_admin,
        crp.is_muted
      FROM chat_room_participants crp
      LEFT JOIN kemri_users u ON crp.user_id = u.userId
      WHERE crp.room_id = ?
      ORDER BY crp.is_admin DESC, u.firstName ASC
    `;
    
    const [participants] = await db.execute(query, [roomId]);
    console.log('Found participants:', participants.length);
    console.log('Participants data:', participants);
    res.json({ success: true, participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch participants' });
  }
});

module.exports = router;

