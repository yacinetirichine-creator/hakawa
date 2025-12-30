-- ════════════════════════════════════════════════════
-- HAKAWA - ACTIVATION ADMIN contact@hakawa.app
-- ════════════════════════════════════════════════════
-- COPIEZ ET EXÉCUTEZ CE SQL DANS SUPABASE DASHBOARD
-- https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju/editor
-- ════════════════════════════════════════════════════

-- Étape 1: Vérifier que le compte existe
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'contact@hakawa.app';

-- Étape 2: Activer les droits admin
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'contact@hakawa.app';

    -- Vérifier que l'utilisateur existe
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION '❌ Compte contact@hakawa.app non trouvé - créez-le d''abord via Supabase Auth';
    END IF;

    -- Activer les droits admin avec plan illimité
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
        'contact@hakawa.app',
        'Yacine Tirichine',
        'studio',                         -- Plan maximum
        '2099-12-31 23:59:59+00',        -- Date très lointaine = illimité
        999999,                           -- Crédits illimités
        TRUE,                             -- Admin
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        subscription_tier = 'studio',
        subscription_expires_at = '2099-12-31 23:59:59+00',
        credits_illustrations = 999999,
        is_admin = TRUE,
        updated_at = NOW();

    RAISE NOTICE '✅ Admin activé avec succès pour contact@hakawa.app (ID: %)', admin_user_id;
END $$;

-- Étape 3: Vérifier que tout est correct
SELECT 
    id,
    email,
    full_name,
    subscription_tier,
    is_admin,
    credits_illustrations,
    subscription_expires_at,
    created_at,
    updated_at
FROM public.profiles
WHERE email = 'contact@hakawa.app';

-- ════════════════════════════════════════════════════
-- RÉSULTAT ATTENDU:
-- ════════════════════════════════════════════════════
-- email: contact@hakawa.app
-- full_name: Yacine Tirichine
-- subscription_tier: studio
-- is_admin: true
-- credits_illustrations: 999999
-- subscription_expires_at: 2099-12-31 23:59:59+00
-- ════════════════════════════════════════════════════
