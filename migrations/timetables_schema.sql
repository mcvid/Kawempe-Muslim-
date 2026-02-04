-- Timetables System Schema
-- Run this in Supabase SQL Editor

-- 1. Academic Classes (e.g., S1, S2, S3)
CREATE TABLE IF NOT EXISTS public.academic_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- 'Senior One', 'Senior Two'
    short_name TEXT NOT NULL UNIQUE, -- 'S1', 'S2'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Class Streams (e.g., East, West, North)
CREATE TABLE IF NOT EXISTS public.class_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES academic_classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- 'East', 'West'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(class_id, name)
);

-- 3. Timetable Metadata
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES class_streams(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL, -- '2026'
    term TEXT NOT NULL, -- 'Term 1'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Timetable Entries (The actual slots)
CREATE TABLE IF NOT EXISTS public.timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id UUID REFERENCES timetables(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL, -- 'Monday', 'Tuesday', ...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL, -- Link to existing subjects
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL, -- Link to existing teachers
    custom_label TEXT, -- For breaks or special events like 'Lunch', 'Assembly'
    room TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_class_streams_class ON class_streams(class_id);
CREATE INDEX IF NOT EXISTS idx_timetables_stream ON timetables(stream_id);
CREATE INDEX IF NOT EXISTS idx_entries_timetable ON timetable_entries(timetable_id);

-- 6. RLS Policies
ALTER TABLE public.academic_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent "policy already exists" errors during re-runs
DROP POLICY IF EXISTS "Public read classes" ON public.academic_classes;
DROP POLICY IF EXISTS "Public read streams" ON public.class_streams;
DROP POLICY IF EXISTS "Public read timetables" ON public.timetables;
DROP POLICY IF EXISTS "Public read entries" ON public.timetable_entries;

DROP POLICY IF EXISTS "Auth manage classes" ON public.academic_classes;
DROP POLICY IF EXISTS "Auth manage streams" ON public.class_streams;
DROP POLICY IF EXISTS "Auth manage timetables" ON public.timetables;
DROP POLICY IF EXISTS "Auth manage entries" ON public.timetable_entries;

-- Public Read
CREATE POLICY "Public read classes" ON public.academic_classes FOR SELECT USING (true);
CREATE POLICY "Public read streams" ON public.class_streams FOR SELECT USING (true);
CREATE POLICY "Public read timetables" ON public.timetables FOR SELECT USING (true);
CREATE POLICY "Public read entries" ON public.timetable_entries FOR SELECT USING (true);

-- Auth Manage
CREATE POLICY "Auth manage classes" ON public.academic_classes FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth manage streams" ON public.class_streams FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth manage timetables" ON public.timetables FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth manage entries" ON public.timetable_entries FOR ALL TO authenticated USING (true);

-- 7. Seed Initial Classes (S1 - S6)
INSERT INTO public.academic_classes (name, short_name, sort_order) VALUES
('Senior One', 'S1', 1),
('Senior Two', 'S2', 2),
('Senior Three', 'S3', 3),
('Senior Four', 'S4', 4),
('Senior Five', 'S5', 5),
('Senior Six', 'S6', 6)
ON CONFLICT (short_name) DO NOTHING;
