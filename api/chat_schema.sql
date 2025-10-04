-- Chat System Database Schema
-- This script creates the necessary tables for the internal chat/communication system

-- Chat Rooms/Channels
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `room_id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) NOT NULL,
  `room_type` enum('direct','group','project','department','role') NOT NULL,
  `project_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`room_id`),
  KEY `fk_chat_rooms_project` (`project_id`),
  KEY `fk_chat_rooms_creator` (`created_by`),
  KEY `fk_chat_rooms_role` (`role_id`),
  CONSTRAINT `fk_chat_rooms_creator` FOREIGN KEY (`created_by`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_rooms_project` FOREIGN KEY (`project_id`) REFERENCES `kemri_projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_rooms_role` FOREIGN KEY (`role_id`) REFERENCES `kemri_roles` (`roleId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Chat Messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message_text` text,
  `message_type` enum('text','file','image','system','announcement') DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `reply_to_message_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `edited_at` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`message_id`),
  KEY `fk_chat_messages_room` (`room_id`),
  KEY `fk_chat_messages_sender` (`sender_id`),
  KEY `fk_chat_messages_reply` (`reply_to_message_id`),
  KEY `idx_chat_messages_created_at` (`created_at`),
  CONSTRAINT `fk_chat_messages_reply` FOREIGN KEY (`reply_to_message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_chat_messages_room` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Room Participants
CREATE TABLE IF NOT EXISTS `chat_room_participants` (
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `is_muted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`room_id`,`user_id`),
  KEY `fk_chat_participants_user` (`user_id`),
  CONSTRAINT `fk_chat_participants_room` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`room_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_participants_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Message Reactions (optional feature)
CREATE TABLE IF NOT EXISTS `chat_message_reactions` (
  `message_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction_type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`,`user_id`,`reaction_type`),
  KEY `fk_chat_reactions_user` (`user_id`),
  CONSTRAINT `fk_chat_reactions_message` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`message_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `kemri_users` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Add chat privileges to the system
INSERT IGNORE INTO `kemri_privileges` (`privilegeName`, `description`) VALUES
('chat.create_room', 'Create new chat rooms'),
('chat.join_room', 'Join existing chat rooms'),
('chat.send_message', 'Send messages in chat rooms'),
('chat.upload_file', 'Upload files in chat'),
('chat.moderate', 'Moderate chat rooms (delete messages, manage participants)'),
('chat.view_all_rooms', 'View all chat rooms (admin privilege)');

-- Grant chat permissions to admin role (roleId = 1)
INSERT IGNORE INTO `kemri_role_privileges` (`roleId`, `privilegeId`, `createdAt`) 
SELECT 1, p.privilegeId, NOW()
FROM `kemri_privileges` p 
WHERE p.privilegeName LIKE 'chat.%';

-- Grant basic chat permissions to manager role (roleId = 2)
INSERT IGNORE INTO `kemri_role_privileges` (`roleId`, `privilegeId`, `createdAt`) 
SELECT 2, p.privilegeId, NOW()
FROM `kemri_privileges` p 
WHERE p.privilegeName IN ('chat.join_room', 'chat.send_message', 'chat.upload_file', 'chat.create_room');

-- Grant basic chat permissions to project_lead role (roleId = 5)
INSERT IGNORE INTO `kemri_role_privileges` (`roleId`, `privilegeId`, `createdAt`) 
SELECT 5, p.privilegeId, NOW()
FROM `kemri_privileges` p 
WHERE p.privilegeName IN ('chat.join_room', 'chat.send_message', 'chat.upload_file');

-- Create some default chat rooms
INSERT IGNORE INTO `chat_rooms` (`room_name`, `room_type`, `created_by`, `description`) VALUES
('General Discussion', 'group', 1, 'General team discussions and announcements'),
('Project Updates', 'group', 1, 'Share project updates and milestones'),
('Technical Support', 'group', 1, 'Technical questions and IT support');

-- Create role-based chat rooms for each role
INSERT IGNORE INTO `chat_rooms` (`room_name`, `room_type`, `role_id`, `created_by`, `description`) 
SELECT 
    CONCAT(r.roleName, ' Discussion'),
    'role',
    r.roleId,
    1,
    CONCAT('Discussion room for ', r.roleName, ' role members')
FROM `kemri_roles` r 
WHERE r.roleId > 0;

-- Add admin user to default rooms (assuming admin userId = 1)
INSERT IGNORE INTO `chat_room_participants` (`room_id`, `user_id`, `is_admin`) 
SELECT r.room_id, 1, 1
FROM `chat_rooms` r 
WHERE r.room_name IN ('General Discussion', 'Project Updates', 'Technical Support');

-- Automatically add users to their role-based chat rooms
INSERT IGNORE INTO `chat_room_participants` (`room_id`, `user_id`, `is_admin`)
SELECT 
    r.room_id,
    u.userId,
    0
FROM `chat_rooms` r
INNER JOIN `kemri_users` u ON r.role_id = u.roleId
WHERE r.room_type = 'role' AND r.role_id IS NOT NULL
ON DUPLICATE KEY UPDATE 
    `last_read_at` = `last_read_at`;

-- Create indexes for better performance
CREATE INDEX `idx_chat_rooms_type` ON `chat_rooms` (`room_type`);
CREATE INDEX `idx_chat_rooms_active` ON `chat_rooms` (`is_active`);
CREATE INDEX `idx_chat_messages_room_created` ON `chat_messages` (`room_id`, `created_at`);
CREATE INDEX `idx_chat_participants_user` ON `chat_room_participants` (`user_id`);

-- Create a procedure to add users to role-based rooms when their role changes
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AddUserToRoleRooms(IN user_id INT, IN new_role_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE room_id INT;
    DECLARE room_cursor CURSOR FOR 
        SELECT room_id FROM chat_rooms 
        WHERE room_type = 'role' AND role_id = new_role_id AND is_active = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN room_cursor;
    
    read_loop: LOOP
        FETCH room_cursor INTO room_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Add user to role-based room if not already a participant
        INSERT IGNORE INTO chat_room_participants (room_id, user_id, is_admin) 
        VALUES (room_id, user_id, 0);
    END LOOP;
    
    CLOSE room_cursor;
END //
DELIMITER ;

-- Create a trigger to automatically add users to role-based rooms when their role changes
DELIMITER //
CREATE TRIGGER IF NOT EXISTS user_role_change_trigger
AFTER UPDATE ON kemri_users
FOR EACH ROW
BEGIN
    IF OLD.roleId != NEW.roleId THEN
        -- Remove user from old role-based rooms
        DELETE crp FROM chat_room_participants crp
        INNER JOIN chat_rooms r ON crp.room_id = r.room_id
        WHERE crp.user_id = NEW.userId 
        AND r.room_type = 'role' 
        AND r.role_id = OLD.roleId
        AND crp.is_admin = 0; -- Don't remove admins
        
        -- Add user to new role-based rooms
        CALL AddUserToRoleRooms(NEW.userId, NEW.roleId);
    END IF;
END //
DELIMITER ;

-- Verification queries
SELECT 'Chat schema created successfully' as status;
SELECT COUNT(*) as chat_privileges FROM kemri_privileges WHERE privilegeName LIKE 'chat.%';
SELECT COUNT(*) as default_rooms FROM chat_rooms WHERE room_type = 'group';
SELECT COUNT(*) as role_rooms FROM chat_rooms WHERE room_type = 'role';
