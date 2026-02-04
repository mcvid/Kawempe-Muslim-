-- Migration to support per-subject roles (e.g. HOD in one subject, Teacher in another)

-- 1. Add role column to teacher_subjects
ALTER TABLE public.teacher_subjects 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'teacher';

-- 2. Migrate existing roles from teachers table to teacher_subjects
-- We assume the global role in public.teachers currently represents their status in their primary_subject_id
UPDATE public.teacher_subjects ts
SET role = t.role
FROM public.teachers t
WHERE ts.teacher_id = t.id 
  AND ts.subject_id = t.primary_subject_id
  AND t.role IS NOT NULL;

-- 3. (Optional) We keep teachers.role for general classification, but HOD logic will now prefer teacher_subjects.role
