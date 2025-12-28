-- ════════════════════════════════════════════════════
-- HAKAWA - CREATION COMPTE ADMIN
-- ════════════════════════════════════════════════════
-- Email: contact@hakawa.app
-- Ce script configure le compte administrateur
-- ════════════════════════════════════════════════════

-- ÉTAPE 1: Exécuter cette fonction pour configurer l'admin
SELECT setup_admin_account();

-- ÉTAPE 2: Vérifier que le compte a été créé
SELECT 
    id,
    email,
    full_name,
    subscription_tier,
    is_admin,
    credits_illustrations
FROM public.profiles
WHERE email = 'contact@hakawa.app';

-- Si le compte n'existe pas encore dans auth.users,
-- créez-le d'abord via Authentication > Users dans Supabase Dashboard
-- avec l'email: contact@hakawa.app
-- et le mot de passe: Milhanou141511
-- Puis réexécutez SELECT setup_admin_account();
