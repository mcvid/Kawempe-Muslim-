-- Migration to support multiple subjects per teacher

CREATE TABLE IF NOT EXISTS public.teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(teacher_id, subject_id)
);

-- Enable RLS
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read teacher_subjects') THEN
        CREATE POLICY "Allow public read teacher_subjects" ON public.teacher_subjects FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow auth manage teacher_subjects') THEN
        CREATE POLICY "Allow auth manage teacher_subjects" ON public.teacher_subjects FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- Migration: Copy existing primary_subject_id to teacher_subjects
INSERT INTO public.teacher_subjects (teacher_id, subject_id)
SELECT id, primary_subject_id FROM public.teachers WHERE primary_subject_id IS NOT NULL
ON CONFLICT DO NOTHING;
