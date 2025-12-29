-- ════════════════════════════════════════════════════
-- HAKAWA - MANUSCRIPTS AND USER IMAGES
-- Migration pour upload de manuscrits et images personnelles
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- TABLE: manuscripts (manuscrits uploadés)
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.manuscripts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Fichier
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('txt', 'docx', 'pdf')),
    file_size INTEGER,
    
    -- Contenu
    original_text TEXT NOT NULL,
    improved_text TEXT,
    analysis TEXT,
    
    -- Métadonnées
    word_count INTEGER DEFAULT 0,
    improvement_type TEXT DEFAULT 'correction' CHECK (improvement_type IN ('correction', 'enhancement', 'restructure')),
    
    -- Statut
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'analyzed', 'improved', 'error')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    analyzed_at TIMESTAMPTZ,
    improved_at TIMESTAMPTZ
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_manuscripts_user_id ON public.manuscripts(user_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_project_id ON public.manuscripts(project_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_status ON public.manuscripts(status);

-- ────────────────────────────────────────────────────
-- TABLE: user_images (images personnelles uploadées)
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    
    -- Fichier
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('jpg', 'jpeg', 'png', 'webp')),
    file_size INTEGER,
    
    -- Stockage
    storage_path TEXT NOT NULL UNIQUE,
    public_url TEXT,
    
    -- Métadonnées image
    width INTEGER,
    height INTEGER,
    format TEXT,
    
    -- Description et tags
    description TEXT,
    alt_text TEXT,
    tags TEXT[],
    
    -- Usage
    usage_type TEXT DEFAULT 'illustration' CHECK (usage_type IN ('illustration', 'cover', 'character', 'background', 'other')),
    is_used BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON public.user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_project_id ON public.user_images(project_id);
CREATE INDEX IF NOT EXISTS idx_user_images_usage_type ON public.user_images(usage_type);
CREATE INDEX IF NOT EXISTS idx_user_images_tags ON public.user_images USING GIN(tags);

-- ────────────────────────────────────────────────────
-- RLS POLICIES - MANUSCRIPTS
-- ────────────────────────────────────────────────────
ALTER TABLE public.manuscripts ENABLE ROW LEVEL SECURITY;

-- Utilisateurs peuvent voir leurs propres manuscrits
CREATE POLICY "Users can view their own manuscripts"
    ON public.manuscripts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Utilisateurs peuvent insérer leurs propres manuscrits
CREATE POLICY "Users can insert their own manuscripts"
    ON public.manuscripts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Utilisateurs peuvent mettre à jour leurs propres manuscrits
CREATE POLICY "Users can update their own manuscripts"
    ON public.manuscripts
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Utilisateurs peuvent supprimer leurs propres manuscrits
CREATE POLICY "Users can delete their own manuscripts"
    ON public.manuscripts
    FOR DELETE
    USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────
-- RLS POLICIES - USER_IMAGES
-- ────────────────────────────────────────────────────
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Utilisateurs peuvent voir leurs propres images
CREATE POLICY "Users can view their own images"
    ON public.user_images
    FOR SELECT
    USING (auth.uid() = user_id);

-- Utilisateurs peuvent insérer leurs propres images
CREATE POLICY "Users can insert their own images"
    ON public.user_images
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Utilisateurs peuvent mettre à jour leurs propres images
CREATE POLICY "Users can update their own images"
    ON public.user_images
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Utilisateurs peuvent supprimer leurs propres images
CREATE POLICY "Users can delete their own images"
    ON public.user_images
    FOR DELETE
    USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────
-- STORAGE BUCKET pour images utilisateurs
-- ────────────────────────────────────────────────────

-- Créer bucket pour images utilisateurs (à exécuter via Supabase Dashboard ou API)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('user-images', 'user-images', false);

-- Policy pour upload
-- CREATE POLICY "Users can upload their own images"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--         bucket_id = 'user-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy pour lecture
-- CREATE POLICY "Users can view their own images"
--     ON storage.objects
--     FOR SELECT
--     USING (
--         bucket_id = 'user-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy pour suppression
-- CREATE POLICY "Users can delete their own images"
--     ON storage.objects
--     FOR DELETE
--     USING (
--         bucket_id = 'user-images' AND
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- ────────────────────────────────────────────────────
-- FUNCTIONS UTILITAIRES
-- ────────────────────────────────────────────────────

-- Fonction pour nettoyer les anciens manuscrits (plus de 30 jours après suppression projet)
CREATE OR REPLACE FUNCTION cleanup_old_manuscripts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.manuscripts
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND project_id NOT IN (SELECT id FROM public.projects);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour calculer l'espace de stockage utilisé par un utilisateur
CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id UUID)
RETURNS TABLE (
    total_images INTEGER,
    total_size_bytes BIGINT,
    total_size_mb NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_images,
        COALESCE(SUM(file_size), 0)::BIGINT as total_size_bytes,
        ROUND((COALESCE(SUM(file_size), 0) / 1024.0 / 1024.0)::NUMERIC, 2) as total_size_mb
    FROM public.user_images
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────
-- COMMENTAIRES
-- ────────────────────────────────────────────────────

COMMENT ON TABLE public.manuscripts IS 'Manuscrits uploadés par les utilisateurs pour correction/amélioration IA';
COMMENT ON TABLE public.user_images IS 'Images personnelles uploadées par les utilisateurs pour illustrer leurs livres';

COMMENT ON COLUMN public.manuscripts.improvement_type IS 'Type d amélioration: correction (orthographe/grammaire), enhancement (style), restructure (organisation)';
COMMENT ON COLUMN public.manuscripts.status IS 'pending: en attente, analyzing: analyse en cours, analyzed: analysé, improved: amélioré, error: erreur';

COMMENT ON COLUMN public.user_images.usage_type IS 'illustration: image chapitre, cover: couverture, character: personnage, background: fond, other: autre';
COMMENT ON COLUMN public.user_images.storage_path IS 'Chemin dans Supabase Storage';
COMMENT ON COLUMN public.user_images.public_url IS 'URL publique signée (temporaire)';
