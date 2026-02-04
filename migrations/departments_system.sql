-- Migration to set up Departments and enhance Staff/Subjects schema

-- 1. Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT, -- Header image for the department
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Update Subjects Table to link to Departments
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

-- 3. Update Teachers Table for enhanced profile and hierarchy
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS primary_subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS title TEXT; -- e.g., Mr., Ms., Dr.
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'teacher'; -- 'hod', 'senior_teacher', 'teacher'
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS hierarchy_order INTEGER DEFAULT 0;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS bio TEXT;

-- 4. Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Departments: Public Read, Auth Manage
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read departments') THEN
        CREATE POLICY "Allow public read departments" ON public.departments FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow auth manage departments') THEN
        CREATE POLICY "Allow auth manage departments" ON public.departments FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 6. Seed some initial departments
INSERT INTO public.departments (name, slug, sort_order) VALUES
('Science', 'science', 1),
('Languages', 'languages', 2),
('Humanities', 'humanities', 3),
('Mathematics', 'mathematics', 4),
('Vocational', 'vocational', 5)
ON CONFLICT (slug) DO NOTHING;

-- 7. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON public.departments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
