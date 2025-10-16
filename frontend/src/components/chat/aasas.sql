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