-- Add subject_id to past_papers and resources tables to establish formal relationships
-- This allows for efficient counting and filtering by subject

-- 1. Add column to past_papers
ALTER TABLE past_papers ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL;

-- 2. Add column to resources
ALTER TABLE resources ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL;

-- 3. Backfill subject_id for past_papers based on name and level
UPDATE past_papers p
SET subject_id = s.id
FROM subjects s
WHERE p.subject = s.name AND p.level = s.level
AND p.subject_id IS NULL;

-- 4. Backfill subject_id for resources based on name and level
UPDATE resources r
SET subject_id = s.id
FROM subjects s
WHERE r.subject = s.name AND r.level = s.level
AND r.subject_id IS NULL;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_past_papers_subject_id ON past_papers(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON resources(subject_id);

-- 6. Update getSubjects query in app/academics/library/actions.ts will now work automatically
-- because PostgREST will use the foreign key for 'past_papers(count)'
