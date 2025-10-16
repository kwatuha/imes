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
       m.sender_id,
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
     WHERE m.is_deleted = 0
     ORDER BY m.created_at DESC
     LIMIT 3