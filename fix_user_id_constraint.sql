-- Fix user_id constraint to allow NULL values
ALTER TABLE event_registrations MODIFY COLUMN user_id BIGINT NULL;