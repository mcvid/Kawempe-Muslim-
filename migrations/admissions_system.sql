-- Migration for Admissions Management System

-- 1. Admissions Settings
CREATE TABLE IF NOT EXISTS public.admissions_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    academic_year TEXT,
    inquiry_email TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial setting if not exists
INSERT INTO public.admissions_settings (title, description, academic_year, inquiry_email)
VALUES ('Kawempe Muslim Admissions', 'Join our excellence-driven academic community.', '2026/2027', 'admissions@kawempemuslim.sch.ug')
ON CONFLICT DO NOTHING;

-- 2. Admission Procedure Steps
CREATE TABLE IF NOT EXISTS public.admissions_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Admission Requirements
CREATE TABLE IF NOT EXISTS public.admissions_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Admissions Inquiries
CREATE TABLE IF NOT EXISTS public.admissions_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Admission Downloads/Resources
CREATE TABLE IF NOT EXISTS public.admissions_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Update existing tables
-- Add missing columns to admission_applications
ALTER TABLE public.admission_applications 
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS religion TEXT,
ADD COLUMN IF NOT EXISTS program TEXT,
ADD COLUMN IF NOT EXISTS previous_school TEXT,
ADD COLUMN IF NOT EXISTS ple_aggregates TEXT,
ADD COLUMN IF NOT EXISTS uce_aggregates TEXT,
ADD COLUMN IF NOT EXISTS parent_name TEXT,
ADD COLUMN IF NOT EXISTS parent_phone TEXT,
ADD COLUMN IF NOT EXISTS parent_email TEXT,
ADD COLUMN IF NOT EXISTS parent_occupation TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS result_slip_url TEXT,
ADD COLUMN IF NOT EXISTS class_applying_for TEXT;

-- Update students table to match approval logic
ALTER TABLE public.students
RENAME COLUMN name TO student_name;

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS student_reg_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS parent_email TEXT,
ADD COLUMN IF NOT EXISTS parent_phone TEXT,
ADD COLUMN IF NOT EXISTS house TEXT,
ADD COLUMN IF NOT EXISTS class_grade TEXT,
ADD COLUMN IF NOT EXISTS valid_until DATE;

-- 8. Enable RLS
ALTER TABLE public.admissions_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES

-- Public Read
CREATE POLICY "Public Read Settings" ON public.admissions_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Steps" ON public.admissions_steps FOR SELECT USING (true);
CREATE POLICY "Public Read Reqs" ON public.admissions_requirements FOR SELECT USING (true);
CREATE POLICY "Public Read Downloads" ON public.admissions_downloads FOR SELECT USING (true);

-- Authenticated Manage
CREATE POLICY "Auth Manage Settings" ON public.admissions_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Steps" ON public.admissions_steps FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Reqs" ON public.admissions_requirements FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Inquiries" ON public.admissions_inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Downloads" ON public.admissions_downloads FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Newsletter" ON public.newsletter_subscriptions FOR ALL TO authenticated USING (true);

-- Public Insert
CREATE POLICY "Public Insert Inquiries" ON public.admissions_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
