-- ════════════════════════════════════════════════════
-- HAKAWA - ADMIN ACCOUNT SETUP
-- ════════════════════════════════════════════════════
-- Cette migration configure le compte administrateur
-- avec accès illimité et privilèges spéciaux
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- FONCTION : Créer ou mettre à jour le compte admin
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION setup_admin_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'yacine.tirichine@gmail.com';
BEGIN
    -- Chercher l'utilisateur dans auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;

    -- Si l'utilisateur existe, mettre à jour son profil
    IF admin_user_id IS NOT NULL THEN
        -- Mettre à jour le profil avec droits admin et accès illimité
        INSERT INTO public.profiles (
            id,
            email,
            full_name,
            subscription_tier,
            subscription_expires_at,
            credits_illustrations,
            is_admin,
            created_at,
            updated_at
        )
        VALUES (
            admin_user_id,
            admin_email,
            'Yacine Tirichine',
            'studio', -- Niveau maximum
            '2099-12-31 23:59:59+00', -- Date très lointaine = illimité
            999999, -- Crédits illimités
            TRUE, -- Admin
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            subscription_tier = 'studio',
            subscription_expires_at = '2099-12-31 23:59:59+00',
            credits_illustrations = 999999,
            is_admin = TRUE,
            updated_at = NOW();

        RAISE NOTICE 'Compte admin configuré pour: %', admin_email;
    ELSE
        RAISE NOTICE 'Utilisateur % non trouvé dans auth.users. Veuillez créer le compte d''abord.', admin_email;
    END IF;
END;
$$;

-- ────────────────────────────────────────────────────
-- POLITIQUE RLS : Admin bypass
-- ────────────────────────────────────────────────────

-- Fonction helper pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND is_admin = TRUE
    );
$$;

-- Politique pour permettre aux admins de voir tous les projets
DROP POLICY IF EXISTS "admin_view_all_projects" ON public.projects;
CREATE POLICY "admin_view_all_projects"
    ON public.projects
    FOR SELECT
    USING (is_admin() OR user_id = auth.uid());

-- Politique pour permettre aux admins de modifier tous les projets
DROP POLICY IF EXISTS "admin_update_all_projects" ON public.projects;
CREATE POLICY "admin_update_all_projects"
    ON public.projects
    FOR UPDATE
    USING (is_admin() OR user_id = auth.uid());

-- Politique pour permettre aux admins de supprimer tous les projets
DROP POLICY IF EXISTS "admin_delete_all_projects" ON public.projects;
CREATE POLICY "admin_delete_all_projects"
    ON public.projects
    FOR DELETE
    USING (is_admin() OR user_id = auth.uid());

-- ────────────────────────────────────────────────────
-- FONCTION : Vérifier les limites (bypass pour admin)
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_user_limits(
    user_id UUID,
    resource_type TEXT -- 'project', 'illustration', 'export'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_is_admin BOOLEAN;
    user_tier TEXT;
    current_count INTEGER;
    max_allowed INTEGER;
BEGIN
    -- Vérifier si admin
    SELECT is_admin, subscription_tier INTO user_is_admin, user_tier
    FROM public.profiles
    WHERE id = user_id;

    -- Admin = accès illimité
    IF user_is_admin = TRUE THEN
        RETURN TRUE;
    END IF;

    -- Vérifier les limites selon le type de ressource et le tier
    IF resource_type = 'project' THEN
        SELECT COUNT(*) INTO current_count
        FROM public.projects
        WHERE projects.user_id = check_user_limits.user_id;

        max_allowed := CASE user_tier
            WHEN 'free' THEN 1
            WHEN 'conteur' THEN 5
            WHEN 'pro' THEN 20
            WHEN 'studio' THEN 999999
            ELSE 1
        END;

        RETURN current_count < max_allowed;

    ELSIF resource_type = 'illustration' THEN
        SELECT credits_illustrations INTO current_count
        FROM public.profiles
        WHERE id = user_id;

        RETURN current_count > 0;

    ELSE
        RETURN TRUE;
    END IF;
END;
$$;

-- ────────────────────────────────────────────────────
-- COMMENTAIRES
-- ────────────────────────────────────────────────────
COMMENT ON FUNCTION setup_admin_account() IS 
    'Configure le compte yacine.tirichine@gmail.com avec droits admin et accès illimité';

COMMENT ON FUNCTION is_admin() IS 
    'Retourne TRUE si l''utilisateur connecté est administrateur';

COMMENT ON FUNCTION check_user_limits(UUID, TEXT) IS 
    'Vérifie les limites d''utilisation (bypass automatique pour admin)';

-- ────────────────────────────────────────────────────
-- NOTE IMPORTANTE
-- ────────────────────────────────────────────────────
-- Pour activer le compte admin, vous devez d'abord :
-- 1. Créer le compte via l'interface Supabase Auth ou l'API
--    avec l'email yacine.tirichine@gmail.com
-- 2. Puis exécuter : SELECT setup_admin_account();
-- ────────────────────────────────────────────────────
