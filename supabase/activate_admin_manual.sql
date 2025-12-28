-- ════════════════════════════════════════════════════
-- HAKAWA - MISE À JOUR MANUELLE COMPTE ADMIN
-- ════════════════════════════════════════════════════
-- Si setup_admin_account() n'a pas fonctionné,
-- exécutez cette requête pour activer les droits admin
-- ════════════════════════════════════════════════════

-- Récupérer l'ID de l'utilisateur
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Trouver l'ID de l'utilisateur
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'contact@hakawa.app';

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur contact@hakawa.app non trouvé dans auth.users';
    END IF;

    -- Mettre à jour le profil avec les droits admin
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
        'Hakawa Admin',
        'studio',
        '2099-12-31 23:59:59+00',
        999999,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = 'contact@hakawa.app',
        full_name = 'Hakawa Admin',
        subscription_tier = 'studio',
        subscription_expires_at = '2099-12-31 23:59:59+00',
        credits_illustrations = 999999,
        is_admin = TRUE,
        updated_at = NOW();

    RAISE NOTICE 'Compte admin activé pour contact@hakawa.app avec ID %', admin_user_id;
END $$;

-- Vérifier le résultat
SELECT 
    id,
    email,
    full_name,
    subscription_tier,
    is_admin,
    credits_illustrations,
    subscription_expires_at
FROM public.profiles
WHERE email = 'contact@hakawa.app';
