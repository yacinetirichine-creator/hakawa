-- ════════════════════════════════════════════════════
-- HAKAWA DATABASE SCHEMA
-- ════════════════════════════════════════════════════

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────
-- PROFILES (extension de auth.users)
-- ────────────────────────────────────────────────────
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'conteur', 'pro', 'studio')),
    subscription_expires_at TIMESTAMPTZ,
    credits_illustrations INTEGER DEFAULT 0,
    is_child_mode BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- PROJECTS (Livres)
-- ────────────────────────────────────────────────────
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Infos générales
    title TEXT NOT NULL,
    pitch TEXT,
    genre TEXT,
    style TEXT CHECK (style IN ('roman', 'manga', 'bd', 'comic', 'enfants', 'fantasy')),
    target_audience TEXT CHECK (target_audience IN ('children', 'young_adult', 'adult')),
    
    -- Personnages et univers
    characters JSONB DEFAULT '[]',
    universe TEXT,
    themes TEXT[],
    
    -- Progression
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'exploring', 'planning', 'writing', 'illustrating', 'exporting', 'published')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Configuration KDP
    kdp_config JSONB DEFAULT '{
        "binding": "paperback",
        "trim_size": "6x9",
        "ink_type": "premium_color",
        "paper_type": "white"
    }',
    
    -- Couverture
    cover_front_url TEXT,
    cover_back_url TEXT,
    cover_spine_text TEXT,
    
    -- Métadonnées
    word_count INTEGER DEFAULT 0,
    chapter_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────
-- CHAPTERS
-- ────────────────────────────────────────────────────
CREATE TABLE public.chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    
    word_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, number)
);

-- ────────────────────────────────────────────────────
-- ILLUSTRATIONS
-- ────────────────────────────────────────────────────
CREATE TABLE public.illustrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    
    prompt TEXT NOT NULL,
    style TEXT CHECK (style IN ('manga', 'realistic', 'bd', 'comic', 'watercolor')),
    image_url TEXT NOT NULL,
    
    position_in_chapter INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- CONVERSATIONS (Chat créatif)
-- ────────────────────────────────────────────────────
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    messages JSONB DEFAULT '[]',
    phase TEXT CHECK (phase IN ('exploration', 'planning', 'writing')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- EXPORTS
-- ────────────────────────────────────────────────────
CREATE TABLE public.exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    format TEXT CHECK (format IN ('pdf', 'epub', 'kdp_interior', 'kdp_cover')),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_chapters_project_id ON public.chapters(project_id);
CREATE INDEX idx_illustrations_project_id ON public.illustrations(project_id);
CREATE INDEX idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX idx_exports_project_id ON public.exports(project_id);

-- ────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Policies : Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own chapters" ON public.chapters FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = chapters.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own illustrations" ON public.illustrations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = illustrations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own conversations" ON public.conversations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = conversations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own exports" ON public.exports FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = exports.project_id AND projects.user_id = auth.uid()));

-- ────────────────────────────────────────────────────
-- FUNCTIONS
-- ────────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
