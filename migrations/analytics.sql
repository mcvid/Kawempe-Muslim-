-- Migration for Site Analytics and Visit Tracking

-- Create a table to store site-wide statistics
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id TEXT PRIMARY KEY,
    count BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to site analytics"
    ON public.site_analytics
    FOR SELECT
    TO authenticated
    USING (true);

-- Initialize the total_visits row
INSERT INTO public.site_analytics (id, count)
VALUES ('total_visits', 0)
ON CONFLICT (id) DO NOTHING;

-- Create the RPC function to increment visits
-- Using SECURITY DEFINER to allow the function to update the table even if the user doesn't have direct UPDATE permissions
CREATE OR REPLACE FUNCTION public.increment_visit_count()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.site_analytics
    SET count = count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = 'total_visits';
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.increment_visit_count() TO anon, authenticated;
