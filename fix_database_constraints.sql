-- Fix database constraints for event_registrations table
-- This script ensures the user_id column can be null to allow registrations without user accounts

-- Drop the NOT NULL constraint on user_id if it exists
ALTER TABLE event_registrations MODIFY COLUMN user_id BIGINT NULL;

-- Ensure the table structure is correct
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS student_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS student_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS department VARCHAR(255),
ADD COLUMN IF NOT EXISTS year VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(255),
ADD COLUMN IF NOT EXISTS event_name VARCHAR(255);

-- Create index for better performance on student_id lookups
CREATE INDEX IF NOT EXISTS idx_event_registrations_student_id ON event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);

-- Show the current table structure
DESCRIBE event_registrations;