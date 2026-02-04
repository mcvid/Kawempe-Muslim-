-- Students Table Migration
-- This table stores student records for the school.

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    admission_number TEXT UNIQUE,
    parent_name TEXT,
    parent_contact TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_students_class ON students(class_name);
CREATE INDEX idx_students_admission ON students(admission_number);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read students
CREATE POLICY "Allow read for authenticated users" ON students
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Allow admins to manage students
CREATE POLICY "Allow all for admins" ON students
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM school_profiles
            WHERE school_profiles.id = auth.uid()
            AND school_profiles.role = 'admin'
        )
    );
