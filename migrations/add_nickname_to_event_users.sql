-- Add nickname column to event_users table
ALTER TABLE event_users ADD COLUMN IF NOT EXISTS nickname TEXT;
