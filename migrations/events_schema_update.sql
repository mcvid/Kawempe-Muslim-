-- Migration for Enhanced Events System
-- Includes Interests, Guest Users, and Personalization

-- 1. Create Event Interests Table
CREATE TABLE IF NOT EXISTS public.event_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'Academic', 'Sports', 'Music'
    icon TEXT, -- Lucide icon name or emoji
    is_mandatory BOOLEAN DEFAULT false, -- If true, user cannot deselect (e.g., 'Academic')
    color TEXT DEFAULT 'bg-blue-500', -- Default color for UI
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Event Users Table (Lightweight profile for "Guest" users specific to events)
CREATE TABLE IF NOT EXISTS public.event_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    avatar_url TEXT, -- Store generated avatar or uploaded one
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create User Interests Junction Table
CREATE TABLE IF NOT EXISTS public.event_user_interests (
    user_id UUID REFERENCES public.event_users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES public.event_interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, interest_id)
);

-- 4. Update Events Table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS interest_id UUID REFERENCES public.event_interests(id),
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false; -- For the 'Sticky category'

-- 5. Enable RLS
ALTER TABLE public.event_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_user_interests ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Open for this specific feature as per "Guest" requirement, strictly for demo/MVP)
-- In production, we might want to restrict `event_users` to only be created by the app client with some rudimentary checks, 
-- but for now we allow public access to facilitate the flow described.

-- Event Interests: Public Read
CREATE POLICY "Allow public read access for event_interests" ON public.event_interests FOR SELECT USING (true);

-- Event Users: Public Insert (Registration) and Select (Personalization)
CREATE POLICY "Allow public insert for event_users" ON public.event_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access for event_users" ON public.event_users FOR SELECT USING (true); -- CAUTION: exposes user names, okay for MVP
CREATE POLICY "Allow public update for event_users" ON public.event_users FOR UPDATE USING (true);

-- User Interests: Public Access
CREATE POLICY "Allow public access for event_user_interests" ON public.event_user_interests FOR ALL USING (true);

-- 7. Seed Data for Interests
INSERT INTO public.event_interests (name, icon, is_mandatory, color) VALUES
('Academic', 'BookOpen', true, 'bg-blue-600'),
('Sports', 'Trophy', false, 'bg-orange-500'),
('Music', 'Music', false, 'bg-purple-500'),
('Arts', 'Palette', false, 'bg-pink-500'),
('Technology', 'Cpu', false, 'bg-cyan-500'),
('Social', 'Users', false, 'bg-green-500')
ON CONFLICT (name) DO NOTHING;

-- 8. Seed Data for Events
INSERT INTO public.events (title, description, event_date, location, category, interest_id, image_url, is_featured) 
SELECT 
    'Science Fair 2025', 
    'Annual school science fair displaying student projects.', 
    NOW() + INTERVAL '2 days', 
    'Main Hall', 
    'Academic', 
    (SELECT id FROM public.event_interests WHERE name = 'Academic'),
    'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?q=80&w=1000&auto=format&fit=crop', 
    true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Science Fair 2025');

INSERT INTO public.events (title, description, event_date, location, category, interest_id, image_url, is_featured) 
SELECT 
    'Inter-House Basketball', 
    'Finals for the inter-house basketball tournament.', 
    NOW() + INTERVAL '5 days', 
    'Basketball Court', 
    'Sports', 
    (SELECT id FROM public.event_interests WHERE name = 'Sports'),
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop', 
    false
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Inter-House Basketball');

INSERT INTO public.events (title, description, event_date, location, category, interest_id, image_url, is_featured) 
SELECT 
    'Choir Practice', 
    'Weekly choir practice for the upcoming concert.', 
    NOW() + INTERVAL '1 day', 
    'Music Room', 
    'Music', 
    (SELECT id FROM public.event_interests WHERE name = 'Music'),
    'https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop', 
    false
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Choir Practice');
