-- Migration for Virtual Tour System

-- 1. Tour Stops (Panoramic Locations)
CREATE TABLE IF NOT EXISTS public.tour_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    initial_yaw NUMERIC DEFAULT 0,
    initial_pitch NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tour Hotspots (Interactive points within a stop)
CREATE TABLE IF NOT EXISTS public.tour_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID REFERENCES public.tour_stops(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    target_stop_id UUID REFERENCES public.tour_stops(id) ON DELETE SET NULL,
    type TEXT DEFAULT 'scene', -- 'scene', 'info', 'link'
    yaw NUMERIC NOT NULL,
    pitch NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.tour_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_hotspots ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Public Read Access
CREATE POLICY "Public Read Tour Stops" ON public.tour_stops FOR SELECT USING (true);
CREATE POLICY "Public Read Tour Hotspots" ON public.tour_hotspots FOR SELECT USING (true);

-- Authenticated Manage Access (Admin Only)
CREATE POLICY "Auth Manage Tour Stops" ON public.tour_stops FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth Manage Tour Hotspots" ON public.tour_hotspots FOR ALL TO authenticated USING (true);
