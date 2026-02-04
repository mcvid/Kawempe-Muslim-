-- Migration to add level to classes and component support for timetables

-- 1. Add level to academic_classes
ALTER TABLE public.academic_classes ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'o-level';

-- 2. Add component_label to timetable_entries (for Paper 1, Paper 2, Practicals)
ALTER TABLE public.timetable_entries ADD COLUMN IF NOT EXISTS component_label TEXT;

-- 3. Seed levels for existing classes
UPDATE public.academic_classes SET level = 'o-level' WHERE short_name IN ('S1', 'S2', 'S3', 'S4');
UPDATE public.academic_classes SET level = 'a-level' WHERE short_name IN ('S5', 'S6');

-- 4. Update existing subjects if any are missing level (optional safety)
-- (They should already have levels from library_system.sql)
