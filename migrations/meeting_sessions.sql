-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Meetings table to store scheduled and instant meetings
CREATE TABLE IF NOT EXISTS meeting_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_name TEXT UNIQUE NOT NULL, -- Daily.co room name
    room_url TEXT NOT NULL, -- Full Daily.co room URL
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meeting_type TEXT CHECK (meeting_type IN ('instant', 'scheduled')) DEFAULT 'instant',
    is_active BOOLEAN DEFAULT true,
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_meeting_sessions_room_name ON meeting_sessions(room_name);
CREATE INDEX IF NOT EXISTS idx_meeting_sessions_creator_id ON meeting_sessions(creator_id);

-- Enable RLS
ALTER TABLE meeting_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Meetings are viewable by everyone" 
    ON meeting_sessions FOR SELECT 
    USING (true);

-- Allow both authenticated and anonymous creation for now to avoid setup blockers
CREATE POLICY "Anyone can create meetings" 
    ON meeting_sessions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Creators can update their meetings" 
    ON meeting_sessions FOR UPDATE 
    USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their meetings" 
    ON meeting_sessions FOR DELETE 
    USING (auth.uid() = creator_id);
