-- Migration: Create school_profiles table for School ID authentication
-- This table stores user profiles linked to Supabase Auth

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create role enum
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Create school_profiles table
CREATE TABLE IF NOT EXISTS school_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id TEXT UNIQUE NOT NULL,  -- STU-0142, T-009, ADM-001
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    class_level TEXT,  -- S1, S2, S3, S4, S5, S6 (for students)
    classes_taught TEXT[] DEFAULT '{}',  -- For teachers: ['S3', 'S4']
    subjects TEXT[] DEFAULT '{}',  -- ['Math', 'English', 'Physics']
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    first_login BOOLEAN DEFAULT true,  -- True until they set their password
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by school_id
CREATE INDEX idx_school_profiles_school_id ON school_profiles(school_id);
CREATE INDEX idx_school_profiles_role ON school_profiles(role);
CREATE INDEX idx_school_profiles_class_level ON school_profiles(class_level);

-- Enable Row Level Security
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON school_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile (except role and school_id)
CREATE POLICY "Users can update own profile"
    ON school_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
    ON school_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM school_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Admins can insert new profiles
CREATE POLICY "Admins can insert profiles"
    ON school_profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM school_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update profiles"
    ON school_profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM school_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_school_profiles_updated_at
    BEFORE UPDATE ON school_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (you can remove this in production)
-- Note: These will need corresponding auth.users entries to work
-- This is just for reference on the data format

COMMENT ON TABLE school_profiles IS 'Stores school user profiles with permanent IDs (STU-XXXX, T-XXX, ADM-XXX)';
COMMENT ON COLUMN school_profiles.school_id IS 'Permanent school ID that never changes (e.g., STU-0142)';
COMMENT ON COLUMN school_profiles.class_level IS 'Current class for students (S1-S6), updated when promoted';
COMMENT ON COLUMN school_profiles.classes_taught IS 'Array of classes a teacher teaches';
COMMENT ON COLUMN school_profiles.first_login IS 'True until user sets their password for the first time';
