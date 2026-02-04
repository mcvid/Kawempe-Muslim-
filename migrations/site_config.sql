-- Create site_config table for general website settings
CREATE TABLE IF NOT EXISTS public.site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access for site_config" ON public.site_config
    FOR SELECT USING (true);

-- Allow authenticated users to manage site_config
CREATE POLICY "Allow authenticated users to manage site_config" ON public.site_config
    FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.site_config
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Insert default announcement
INSERT INTO public.site_config (key, value)
VALUES ('announcement', jsonb_build_object(
    'id', 'initial',
    'enabled', false,
    'title', 'Welcome to the Official Site',
    'message', 'Stay tuned for the latest updates and highlights!',
    'type', 'celebration',
    'startAt', now(),
    'endAt', now() + interval '7 days',
    'dismissible', true
))
ON CONFLICT (key) DO NOTHING;
