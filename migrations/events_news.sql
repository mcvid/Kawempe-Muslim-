-- Migration for Events and News systems

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT,
    author_name TEXT,
    author_image TEXT,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_news_likes(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.news
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- News Comments Table
CREATE TABLE IF NOT EXISTS public.news_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES public.news(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_news_comments(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.news
    SET comments_count = COALESCE(comments_count, 0) + 1
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

-- Public read access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for events') THEN
        CREATE POLICY "Allow public read access for events" ON public.events FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for news') THEN
        CREATE POLICY "Allow public read access for news" ON public.news 
        FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access for comments') THEN
        CREATE POLICY "Allow public read access for comments" ON public.news_comments FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert for comments') THEN
        CREATE POLICY "Allow public insert for comments" ON public.news_comments FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Authenticated user management
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage events') THEN
        CREATE POLICY "Allow authenticated users to manage events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated users to manage news') THEN
        CREATE POLICY "Allow authenticated users to manage news" ON public.news FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
