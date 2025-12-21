-- ════════════════════════════════════════════════════
-- HAKAWA - SÉCURITÉ ET ADMINISTRATION
-- ════════════════════════════════════════════════════

-- Ajouter colonne is_admin si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Ajouter colonne last_login
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'last_login'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN last_login TIMESTAMPTZ;
    END IF;
END $$;

-- ────────────────────────────────────────────────────
-- TABLE AUDIT LOGS (traçabilité)
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- ────────────────────────────────────────────────────
-- TABLE RATE LIMITING (protection contre abus)
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON public.rate_limits(user_id, action_type);

-- ────────────────────────────────────────────────────
-- FONCTION : Enregistrer les connexions
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_user_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET last_login = NOW()
    WHERE id = NEW.id;
    
    INSERT INTO public.audit_logs (user_id, action, metadata)
    VALUES (NEW.id, 'user_login', jsonb_build_object('method', 'email'));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────
-- FONCTION : Vérifier les limites de taux
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_action_type TEXT,
    p_max_count INTEGER,
    p_window_minutes INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Nettoyer les anciennes entrées
    DELETE FROM public.rate_limits
    WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND window_start < NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Compter les actions dans la fenêtre
    SELECT COALESCE(SUM(count), 0) INTO v_count
    FROM public.rate_limits
    WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND window_start >= NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Si la limite est dépassée
    IF v_count >= p_max_count THEN
        RETURN FALSE;
    END IF;
    
    -- Enregistrer l'action
    INSERT INTO public.rate_limits (user_id, action_type)
    VALUES (p_user_id, p_action_type);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────
-- FONCTION : Nettoyer les données sensibles
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION anonymize_user_data(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Anonymiser le profil
    UPDATE public.profiles
    SET 
        email = 'deleted_' || id || '@hakawa.com',
        full_name = 'Utilisateur supprimé',
        avatar_url = NULL
    WHERE id = p_user_id;
    
    -- Anonymiser les projets
    UPDATE public.projects
    SET title = 'Projet supprimé'
    WHERE user_id = p_user_id;
    
    -- Log de l'action
    INSERT INTO public.audit_logs (user_id, action)
    VALUES (p_user_id, 'user_anonymized');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────
-- RLS pour audit_logs
-- ────────────────────────────────────────────────────
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir les logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = TRUE
        )
    );

-- ────────────────────────────────────────────────────
-- RLS pour rate_limits
-- ────────────────────────────────────────────────────
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres limites
CREATE POLICY "Users can view own rate limits" ON public.rate_limits
    FOR SELECT
    USING (auth.uid() = user_id);

-- Seuls les admins peuvent modifier
CREATE POLICY "Admins can manage rate limits" ON public.rate_limits
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = TRUE
        )
    );

-- ────────────────────────────────────────────────────
-- TRIGGER : Mise à jour automatique
-- ────────────────────────────────────────────────────
CREATE TRIGGER profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at();
