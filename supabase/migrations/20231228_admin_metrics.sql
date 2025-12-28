-- ════════════════════════════════════════════════════
-- HAKAWA - ADMIN METRICS FUNCTIONS
-- ════════════════════════════════════════════════════
-- Fonctions SQL pour les métriques admin
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- FONCTION : Top utilisateurs par nombre de projets
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_top_users_by_projects(limit_count INT DEFAULT 10)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    full_name TEXT,
    project_count BIGINT,
    subscription_tier TEXT
)
LANGUAGE SQL
STABLE
AS $$
    SELECT 
        p.id as user_id,
        p.email,
        p.full_name,
        COUNT(pr.id) as project_count,
        p.subscription_tier
    FROM public.profiles p
    LEFT JOIN public.projects pr ON p.id = pr.user_id
    GROUP BY p.id, p.email, p.full_name, p.subscription_tier
    ORDER BY project_count DESC
    LIMIT limit_count;
$$;

-- ────────────────────────────────────────────────────
-- FONCTION : Statistiques globales de la plateforme
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON
LANGUAGE SQL
STABLE
AS $$
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'total_projects', (SELECT COUNT(*) FROM public.projects),
        'total_illustrations', (SELECT COUNT(*) FROM public.illustrations),
        'total_exports', (SELECT COUNT(*) FROM public.exports),
        'users_by_tier', (
            SELECT json_object_agg(subscription_tier, count)
            FROM (
                SELECT subscription_tier, COUNT(*) as count
                FROM public.profiles
                GROUP BY subscription_tier
            ) tier_counts
        ),
        'projects_by_status', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM public.projects
                GROUP BY status
            ) status_counts
        )
    );
$$;

-- ────────────────────────────────────────────────────
-- FONCTION : Activité récente (dernières 24h, 7j, 30j)
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_recent_activity(days INT DEFAULT 7)
RETURNS JSON
LANGUAGE SQL
STABLE
AS $$
    SELECT json_build_object(
        'period_days', days,
        'new_users', (
            SELECT COUNT(*) 
            FROM public.profiles 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days
        ),
        'new_projects', (
            SELECT COUNT(*) 
            FROM public.projects 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days
        ),
        'new_illustrations', (
            SELECT COUNT(*) 
            FROM public.illustrations 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days
        ),
        'new_exports', (
            SELECT COUNT(*) 
            FROM public.exports 
            WHERE created_at >= NOW() - INTERVAL '1 day' * days
        )
    );
$$;

-- ────────────────────────────────────────────────────
-- FONCTION : Métriques d'utilisation par utilisateur
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_user_usage_metrics(target_user_id UUID)
RETURNS JSON
LANGUAGE SQL
STABLE
AS $$
    SELECT json_build_object(
        'user_id', target_user_id,
        'total_projects', (
            SELECT COUNT(*) 
            FROM public.projects 
            WHERE user_id = target_user_id
        ),
        'total_chapters', (
            SELECT COUNT(*) 
            FROM public.chapters c
            JOIN public.projects p ON c.project_id = p.id
            WHERE p.user_id = target_user_id
        ),
        'total_illustrations', (
            SELECT COUNT(*) 
            FROM public.illustrations i
            JOIN public.projects p ON i.project_id = p.id
            WHERE p.user_id = target_user_id
        ),
        'total_exports', (
            SELECT COUNT(*) 
            FROM public.exports e
            JOIN public.projects p ON e.project_id = p.id
            WHERE p.user_id = target_user_id
        ),
        'credits_remaining', (
            SELECT credits_illustrations 
            FROM public.profiles 
            WHERE id = target_user_id
        )
    );
$$;

-- ────────────────────────────────────────────────────
-- VUES MATERIALISEES pour performance
-- ────────────────────────────────────────────────────

-- Vue: Statistiques quotidiennes
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats AS
SELECT 
    DATE(created_at) as stat_date,
    'users' as entity_type,
    COUNT(*) as count
FROM public.profiles
GROUP BY DATE(created_at)
UNION ALL
SELECT 
    DATE(created_at) as stat_date,
    'projects' as entity_type,
    COUNT(*) as count
FROM public.projects
GROUP BY DATE(created_at)
UNION ALL
SELECT 
    DATE(created_at) as stat_date,
    'illustrations' as entity_type,
    COUNT(*) as count
FROM public.illustrations
GROUP BY DATE(created_at);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_type ON daily_stats(entity_type);

-- Rafraîchir la vue (à exécuter quotidiennement via cron)
-- REFRESH MATERIALIZED VIEW daily_stats;

-- ────────────────────────────────────────────────────
-- FONCTION : Refresh automatique des stats
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION refresh_daily_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW daily_stats;
    RAISE NOTICE 'Daily stats refreshed at %', NOW();
END;
$$;

-- ────────────────────────────────────────────────────
-- PERMISSIONS : Seuls les admins peuvent exécuter
-- ────────────────────────────────────────────────────
REVOKE ALL ON FUNCTION get_top_users_by_projects FROM PUBLIC;
REVOKE ALL ON FUNCTION get_platform_stats FROM PUBLIC;
REVOKE ALL ON FUNCTION get_recent_activity FROM PUBLIC;
REVOKE ALL ON FUNCTION get_user_usage_metrics FROM PUBLIC;

-- Autoriser pour les utilisateurs authentifiés (vérification admin côté API)
GRANT EXECUTE ON FUNCTION get_top_users_by_projects TO authenticated;
GRANT EXECUTE ON FUNCTION get_platform_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_usage_metrics TO authenticated;
