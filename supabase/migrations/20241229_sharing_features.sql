-- Migration pour les fonctionnalités de partage de projets
-- Date: 2024-12-29

-- Ajouter les colonnes de partage à la table projects (si elle existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        ALTER TABLE public.projects
        ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS share_token VARCHAR(255) UNIQUE,
        ADD COLUMN IF NOT EXISTS share_password VARCHAR(255),
        ADD COLUMN IF NOT EXISTS share_views INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;
    END IF;
END $$;

-- Ajouter les colonnes de partage à la table manuscripts (si elle existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        ALTER TABLE public.manuscripts
        ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS share_token VARCHAR(255) UNIQUE,
        ADD COLUMN IF NOT EXISTS share_password VARCHAR(255),
        ADD COLUMN IF NOT EXISTS share_views INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ;
    END IF;
END $$;

-- Ajouter les colonnes pour le profil auteur
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS author_avatar VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_website VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_twitter VARCHAR(100),
ADD COLUMN IF NOT EXISTS author_instagram VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_public_profile BOOLEAN DEFAULT false;

-- Index pour améliorer les performances (conditionnels)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        CREATE INDEX IF NOT EXISTS idx_projects_share_token ON public.projects(share_token);
        CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);
        CREATE INDEX IF NOT EXISTS idx_projects_share_views ON public.projects(share_views DESC);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        CREATE INDEX IF NOT EXISTS idx_manuscripts_share_token ON public.manuscripts(share_token);
        CREATE INDEX IF NOT EXISTS idx_manuscripts_is_public ON public.manuscripts(is_public);
        CREATE INDEX IF NOT EXISTS idx_manuscripts_share_views ON public.manuscripts(share_views DESC);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_public_profile ON public.profiles(is_public_profile);

-- Table pour les personnages générés (optionnel, pour sauvegarde)
CREATE TABLE IF NOT EXISTS character_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    archetype VARCHAR(100),
    age VARCHAR(50),
    gender VARCHAR(50),
    appearance JSONB,
    personality TEXT,
    background TEXT,
    motivation TEXT,
    strength TEXT,
    flaw TEXT,
    arc TEXT,
    relationships JSONB,
    quotes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la bibliothèque de personnages
CREATE INDEX IF NOT EXISTS idx_character_library_user_id ON character_library(user_id);
CREATE INDEX IF NOT EXISTS idx_character_library_archetype ON character_library(archetype);

-- Table pour les prompts favoris (optionnel)
CREATE TABLE IF NOT EXISTS favorite_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les prompts favoris
CREATE INDEX IF NOT EXISTS idx_favorite_prompts_user_id ON favorite_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_prompts_category ON favorite_prompts(category);

-- Politique RLS pour le partage public (conditionnelle pour projects)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
        DROP POLICY IF EXISTS "Anyone can view public projects" ON public.projects;
        DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
        
        CREATE POLICY "Users can view own projects"
            ON public.projects FOR SELECT
            USING (auth.uid() = user_id);
        
        CREATE POLICY "Anyone can view public projects"
            ON public.projects FOR SELECT
            USING (is_public = true);
        
        CREATE POLICY "Users can update own projects"
            ON public.projects FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Politique RLS pour le partage public (conditionnelle pour manuscripts)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own manuscripts" ON public.manuscripts;
        DROP POLICY IF EXISTS "Anyone can view public manuscripts" ON public.manuscripts;
        DROP POLICY IF EXISTS "Users can update own manuscripts" ON public.manuscripts;
        
        CREATE POLICY "Users can view own manuscripts"
            ON public.manuscripts FOR SELECT
            USING (auth.uid() = user_id);
        
        CREATE POLICY "Anyone can view public manuscripts"
            ON public.manuscripts FOR SELECT
            USING (is_public = true);
        
        CREATE POLICY "Users can update own manuscripts"
            ON public.manuscripts FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Politique RLS pour les personnages
ALTER TABLE character_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own characters" ON character_library;

CREATE POLICY "Users can manage own characters"
    ON character_library FOR ALL
    USING (auth.uid() = user_id);

-- Politique RLS pour les prompts favoris
ALTER TABLE favorite_prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own favorite prompts" ON favorite_prompts;

CREATE POLICY "Users can manage own favorite prompts"
    ON favorite_prompts FOR ALL
    USING (auth.uid() = user_id);

-- Politique RLS pour les profils publics
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Tout le monde peut voir les profils publics
CREATE POLICY "Anyone can view public profiles"
    ON profiles FOR SELECT
    USING (is_public_profile = true OR auth.uid() = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Fonction pour générer automatiquement un token de partage unique
CREATE OR REPLACE FUNCTION generate_unique_share_token()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_public = true AND NEW.share_token IS NULL THEN
        NEW.share_token := encode(gen_random_bytes(16), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer le token automatiquement (conditionnels)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        DROP TRIGGER IF EXISTS auto_generate_share_token ON public.projects;
        CREATE TRIGGER auto_generate_share_token
            BEFORE INSERT OR UPDATE ON public.projects
            FOR EACH ROW
            EXECUTE FUNCTION generate_unique_share_token();
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        DROP TRIGGER IF EXISTS auto_generate_share_token ON public.manuscripts;
        CREATE TRIGGER auto_generate_share_token
            BEFORE INSERT OR UPDATE ON public.manuscripts
            FOR EACH ROW
            EXECUTE FUNCTION generate_unique_share_token();
    END IF;
END $$;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_character_library_updated_at ON character_library;
CREATE TRIGGER update_character_library_updated_at
    BEFORE UPDATE ON character_library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Vue pour les statistiques de partage (pour l'admin) - utilise manuscripts si disponible, sinon projects
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        EXECUTE 'CREATE OR REPLACE VIEW sharing_stats AS
        SELECT
            COUNT(*) FILTER (WHERE is_public = true) as public_projects,
            COUNT(*) FILTER (WHERE share_password IS NOT NULL) as password_protected,
            SUM(share_views) as total_views,
            AVG(share_views) FILTER (WHERE is_public = true) as avg_views_per_project,
            COUNT(DISTINCT user_id) FILTER (WHERE is_public = true) as users_sharing
        FROM public.manuscripts';
    ELSIF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        EXECUTE 'CREATE OR REPLACE VIEW sharing_stats AS
        SELECT
            COUNT(*) FILTER (WHERE is_public = true) as public_projects,
            COUNT(*) FILTER (WHERE share_password IS NOT NULL) as password_protected,
            SUM(share_views) as total_views,
            AVG(share_views) FILTER (WHERE is_public = true) as avg_views_per_project,
            COUNT(DISTINCT user_id) FILTER (WHERE is_public = true) as users_sharing
        FROM public.projects';
    END IF;
END $$;

-- Commentaires pour documentation (conditionnels)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
        COMMENT ON COLUMN public.projects.is_public IS 'Si vrai, le projet est accessible publiquement via share_token';
        COMMENT ON COLUMN public.projects.share_token IS 'Token unique pour accéder au projet partagé';
        COMMENT ON COLUMN public.projects.share_password IS 'Mot de passe optionnel pour protéger le partage';
        COMMENT ON COLUMN public.projects.share_views IS 'Nombre de fois que le projet partagé a été vu';
        COMMENT ON COLUMN public.projects.last_viewed_at IS 'Dernière date de consultation du projet partagé';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'manuscripts') THEN
        COMMENT ON COLUMN public.manuscripts.is_public IS 'Si vrai, le projet est accessible publiquement via share_token';
        COMMENT ON COLUMN public.manuscripts.share_token IS 'Token unique pour accéder au projet partagé';
        COMMENT ON COLUMN public.manuscripts.share_password IS 'Mot de passe optionnel pour protéger le partage';
        COMMENT ON COLUMN public.manuscripts.share_views IS 'Nombre de fois que le projet partagé a été vu';
        COMMENT ON COLUMN public.manuscripts.last_viewed_at IS 'Dernière date de consultation du projet partagé';
    END IF;
END $$;

COMMENT ON COLUMN profiles.author_bio IS 'Biographie publique de l''auteur';
COMMENT ON COLUMN profiles.author_avatar IS 'URL de l''avatar de l''auteur';
COMMENT ON COLUMN profiles.is_public_profile IS 'Si vrai, le profil auteur est visible publiquement';

COMMENT ON TABLE character_library IS 'Bibliothèque de personnages générés et sauvegardés par les utilisateurs';
COMMENT ON TABLE favorite_prompts IS 'Prompts d''illustration favoris des utilisateurs';
