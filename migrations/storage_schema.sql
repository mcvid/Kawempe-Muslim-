-- Migration to set up missing storage buckets and database tables

-- 1. STORAGE BUCKETS
-- Note: These inserts might fail if executed multiple times, but are standard for Supabase migrations
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('academic_resources', 'academic_resources', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('campus_tours', 'campus_tours', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications', 'applications', false) -- Private for student privacy
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE POLICIES (Images - Public Read, Auth Manage)
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Auth Manage Images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'images');

-- 3. STORAGE POLICIES (Academic Resources - Public Read, Auth Manage)
CREATE POLICY "Public Read Resources" ON storage.objects FOR SELECT USING (bucket_id = 'academic_resources');
CREATE POLICY "Auth Manage Resources" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'academic_resources');

-- 4. STORAGE POLICIES (Campus Tours - Public Read, Auth Manage)
CREATE POLICY "Public Read Tours" ON storage.objects FOR SELECT USING (bucket_id = 'campus_tours');
CREATE POLICY "Auth Manage Tours" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'campus_tours');

-- 5. STORAGE POLICIES (Applications - Auth Read, Public Write)
CREATE POLICY "Auth Read Applications" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'applications');
CREATE POLICY "Public Write Applications" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'applications');

-- 6. DATABASE TABLES

-- Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    video_url TEXT,
    page_path TEXT NOT NULL DEFAULT '/',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Admission Applications Table
CREATE TABLE IF NOT EXISTS public.admission_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    gender TEXT,
    date_of_birth DATE,
    address TEXT,
    entry_class TEXT,
    disability TEXT,
    description TEXT,
    parent_details JSONB,
    interests JSONB,
    documents JSONB,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    department TEXT,
    subjects TEXT[],
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    class_name TEXT,
    gender TEXT,
    admission_number TEXT UNIQUE,
    parent_name TEXT,
    parent_contact TEXT,
    status TEXT DEFAULT 'enrolled',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ENABLE RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- Public Read
CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read hero_slides" ON public.hero_slides FOR SELECT USING (true);

-- Authenticated Manage
CREATE POLICY "Allow auth manage gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow auth manage hero_slides" ON public.hero_slides FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow auth manage admissions" ON public.admission_applications FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow auth manage teachers" ON public.teachers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow auth manage students" ON public.students FOR ALL TO authenticated USING (true);

-- Public Insert for Admissions
CREATE POLICY "Allow public insert admissions" ON public.admission_applications FOR INSERT WITH CHECK (true);
