-- Library System Database Schema
-- Run this in Supabase SQL Editor

-- =====================================================
-- PAST PAPERS TABLE
-- Stores exam papers organized by level, subject, and year
-- =====================================================
CREATE TABLE IF NOT EXISTS past_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    level TEXT NOT NULL, -- 'o-level', 'a-level', 'idaad', 'uce'
    year INTEGER NOT NULL,
    term INTEGER,
    paper_type TEXT DEFAULT 'Exam', -- 'Exam', 'Test', 'Assignment', 'Marking Scheme'
    file_url TEXT NOT NULL,
    file_size TEXT,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries by level
CREATE INDEX IF NOT EXISTS idx_past_papers_level ON past_papers(level);
CREATE INDEX IF NOT EXISTS idx_past_papers_subject ON past_papers(subject);
CREATE INDEX IF NOT EXISTS idx_past_papers_year ON past_papers(year);

-- =====================================================
-- RESOURCES TABLE (Notes/Study Materials)
-- Stores notes and study materials organized by level and subject
-- =====================================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    level TEXT NOT NULL, -- 'o-level', 'a-level', 'idaad', 'uce'
    year INTEGER,
    resource_type TEXT DEFAULT 'Notes', -- 'Notes', 'Guide', 'Textbook', 'Video'
    description TEXT,
    file_url TEXT NOT NULL,
    file_size TEXT,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for resources
CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);

-- =====================================================
-- SUBJECTS TABLE
-- Defines available subjects for each education level
-- =====================================================
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    level TEXT NOT NULL, -- 'o-level', 'a-level', 'idaad', 'uce'
    code TEXT, -- Subject code e.g., 'MTH', 'ENG'
    icon TEXT, -- Icon name or emoji
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint for subject name per level
CREATE UNIQUE INDEX IF NOT EXISTS idx_subjects_name_level ON subjects(name, level);

-- =====================================================
-- SEED DATA: Default subjects for each level
-- =====================================================
INSERT INTO subjects (name, level, code, sort_order) VALUES
    -- O-Level subjects
    ('Mathematics', 'o-level', 'MTH', 1),
    ('English', 'o-level', 'ENG', 2),
    ('Physics', 'o-level', 'PHY', 3),
    ('Chemistry', 'o-level', 'CHE', 4),
    ('Biology', 'o-level', 'BIO', 5),
    ('History', 'o-level', 'HIS', 6),
    ('Geography', 'o-level', 'GEO', 7),
    ('Commerce', 'o-level', 'COM', 8),
    ('Computer Studies', 'o-level', 'CMP', 9),
    ('Literature', 'o-level', 'LIT', 10),
    
    -- A-Level subjects
    ('Mathematics', 'a-level', 'MTH', 1),
    ('Physics', 'a-level', 'PHY', 2),
    ('Chemistry', 'a-level', 'CHE', 3),
    ('Biology', 'a-level', 'BIO', 4),
    ('Economics', 'a-level', 'ECO', 5),
    ('History', 'a-level', 'HIS', 6),
    ('Geography', 'a-level', 'GEO', 7),
    ('Literature', 'a-level', 'LIT', 8),
    ('Divinity', 'a-level', 'DIV', 9),
    ('General Paper', 'a-level', 'GP', 10),
    
    -- UCE subjects
    ('Mathematics', 'uce', 'MTH', 1),
    ('English', 'uce', 'ENG', 2),
    ('Science', 'uce', 'SCI', 3),
    ('Social Studies', 'uce', 'SST', 4),
    
    -- Idaad subjects
    ('Arabic', 'idaad', 'ARB', 1),
    ('Islamic Studies', 'idaad', 'ISL', 2),
    ('Fiqh', 'idaad', 'FQH', 3),
    ('Quran', 'idaad', 'QRN', 4),
    ('Hadith', 'idaad', 'HDT', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS and add policies for public read access
-- =====================================================
ALTER TABLE past_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read past_papers" ON past_papers FOR SELECT USING (true);
CREATE POLICY "Public can read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Public can read subjects" ON subjects FOR SELECT USING (true);

-- Authenticated users can manage (for admin)
CREATE POLICY "Authenticated can insert past_papers" ON past_papers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update past_papers" ON past_papers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete past_papers" ON past_papers FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert resources" ON resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update resources" ON resources FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete resources" ON resources FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert subjects" ON subjects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update subjects" ON subjects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete subjects" ON subjects FOR DELETE TO authenticated USING (true);
