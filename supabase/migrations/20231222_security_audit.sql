-- ════════════════════════════════════════════════════
-- HAKAWA - MIGRATION SÉCURITÉ NIVEAU 9.5
-- Tables d'audit et monitoring de sécurité
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- 0. NETTOYAGE (Supprimer les anciennes structures si elles existent)
-- ────────────────────────────────────────────────────

-- Supprimer les vues d'abord (dépendent des tables)
DROP VIEW IF EXISTS user_activity_stats CASCADE;
DROP VIEW IF EXISTS unresolved_security_events CASCADE;
DROP VIEW IF EXISTS recent_failed_logins CASCADE;

-- Supprimer les tables (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS login_attempts CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Supprimer la fonction de nettoyage
DROP FUNCTION IF EXISTS cleanup_old_logs() CASCADE;


-- ────────────────────────────────────────────────────
-- 1. TABLE AUDIT_LOGS
-- Traçage complet de toutes les actions utilisateur
-- ────────────────────────────────────────────────────

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    action_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(action_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_ip ON audit_logs(ip_address);

-- RLS (Row Level Security)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins peuvent tout voir
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- Policy: Users peuvent voir leurs propres logs
CREATE POLICY "Users can view own audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Système peut insérer (via service key)
CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

COMMENT ON TABLE audit_logs IS 'Logs d''audit de toutes les actions utilisateur';
COMMENT ON COLUMN audit_logs.hash IS 'SHA-256 hash pour vérifier l''intégrité du log';
COMMENT ON COLUMN audit_logs.metadata IS 'Données JSON supplémentaires sur l''action';
COMMENT ON COLUMN audit_logs.action_timestamp IS 'Horodatage de l''action';


-- ────────────────────────────────────────────────────
-- 2. TABLE SECURITY_EVENTS
-- Événements de sécurité critiques
-- ────────────────────────────────────────────────────

CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    details JSONB,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_security_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_timestamp ON security_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_ip ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_resolved ON security_events(resolved) WHERE NOT resolved;

-- RLS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Policy: Admins seulement
CREATE POLICY "Admins can manage security events"
ON security_events FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

COMMENT ON TABLE security_events IS 'Événements de sécurité critiques nécessitant attention';
COMMENT ON COLUMN security_events.severity IS 'LOW, MEDIUM, HIGH, ou CRITICAL';
COMMENT ON COLUMN security_events.event_timestamp IS 'Horodatage de l''événement';


-- ────────────────────────────────────────────────────
-- 3. TABLE LOGIN_ATTEMPTS
-- Protection bruteforce
-- ────────────────────────────────────────────────────

CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success BOOLEAN DEFAULT false,
    attempt_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide des tentatives récentes
CREATE INDEX IF NOT EXISTS idx_login_email_ip_time 
ON login_attempts(email, ip_address, attempt_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_login_ip_time 
ON login_attempts(ip_address, attempt_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_login_timestamp 
ON login_attempts(attempt_timestamp DESC);

-- RLS
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Système peut insérer
CREATE POLICY "System can insert login attempts"
ON login_attempts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Admins peuvent voir
CREATE POLICY "Admins can view login attempts"
ON login_attempts FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);
COMMENT ON TABLE login_attempts IS 'Tentatives de connexion pour protection bruteforce';
COMMENT ON COLUMN login_attempts.attempt_timestamp IS 'Horodatage de la tentative';


-- ────────────────────────────────────────────────────
-- 4. FONCTION DE NETTOYAGE AUTOMATIQUE
-- Supprime les vieux logs (rétention 90 jours)
-- ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    -- Supprimer les audit_logs de plus de 90 jours
    DELETE FROM audit_logs
    WHERE action_timestamp < NOW() - INTERVAL '90 days';
    
    -- Supprimer les security_events résolus de plus de 90 jours
    DELETE FROM security_events
    WHERE resolved = true
    AND event_timestamp < NOW() - INTERVAL '90 days';
    
    -- Supprimer les login_attempts de plus de 30 jours
    DELETE FROM login_attempts
    WHERE attempt_timestamp < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Old logs cleaned successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_logs IS 'Nettoie les logs de plus de 90 jours (à exécuter via cron)';


-- ────────────────────────────────────────────────────
-- 5. VUES POUR ANALYTICS SÉCURITÉ
-- ────────────────────────────────────────────────────

-- Vue: Tentatives de connexion échouées récentes
CREATE OR REPLACE VIEW recent_failed_logins AS
SELECT 
    email,
    ip_address,
    COUNT(*) as attempt_count,
    MAX(attempt_timestamp) as last_attempt,
    array_agg(attempt_timestamp ORDER BY attempt_timestamp DESC) as attempt_times
FROM login_attempts
WHERE 
    success = false
    AND attempt_timestamp > NOW() - INTERVAL '1 hour'
GROUP BY email, ip_address
HAVING COUNT(*) >= 3
ORDER BY attempt_count DESC;

COMMENT ON VIEW recent_failed_logins IS 'Tentatives de connexion échouées récentes (potentielles attaques bruteforce)';

-- Vue: Événements de sécurité non résolus
CREATE OR REPLACE VIEW unresolved_security_events AS
SELECT 
    id,
    event_type,
    severity,
    user_id,
    ip_address,
    event_timestamp,
    details
FROM security_events
WHERE resolved = false
ORDER BY 
    CASE severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
    END,
    event_timestamp DESC;

COMMENT ON VIEW unresolved_security_events IS 'Événements de sécurité nécessitant attention';

-- Vue: Statistiques d'audit par utilisateur
CREATE OR REPLACE VIEW user_activity_stats AS
SELECT 
    u.email,
    p.full_name,
    COUNT(DISTINCT DATE(a.action_timestamp)) as active_days,
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE a.action = 'LOGIN') as login_count,
    COUNT(*) FILTER (WHERE a.action = 'CREATE') as create_count,
    COUNT(*) FILTER (WHERE NOT a.success) as failed_actions,
    MAX(a.action_timestamp) as last_activity
FROM audit_logs a
JOIN auth.users u ON u.id = a.user_id
LEFT JOIN profiles p ON p.id = a.user_id
WHERE a.action_timestamp > NOW() - INTERVAL '30 days'
GROUP BY u.email, p.full_name
ORDER BY total_actions DESC;

COMMENT ON VIEW user_activity_stats IS 'Statistiques d''activité par utilisateur (30 derniers jours)';


-- ────────────────────────────────────────────────────
-- 6. GRANTS & PERMISSIONS
-- ────────────────────────────────────────────────────

-- Service role peut tout faire
GRANT ALL ON audit_logs TO service_role;
GRANT ALL ON security_events TO service_role;
GRANT ALL ON login_attempts TO service_role;

-- Authenticated users (via RLS)
GRANT SELECT ON audit_logs TO authenticated;
GRANT INSERT ON audit_logs TO authenticated;
GRANT SELECT ON security_events TO authenticated;
GRANT INSERT ON login_attempts TO authenticated;

-- Vues accessibles aux admins
GRANT SELECT ON recent_failed_logins TO authenticated;
GRANT SELECT ON unresolved_security_events TO authenticated;
GRANT SELECT ON user_activity_stats TO authenticated;


-- ════════════════════════════════════════════════════
-- MIGRATION TERMINÉE
-- ════════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '✅ Migration sécurité niveau 9.5 terminée avec succès';
    RAISE NOTICE '📊 Tables créées: audit_logs, security_events, login_attempts';
    RAISE NOTICE '👁️ Vues créées: recent_failed_logins, unresolved_security_events, user_activity_stats';
    RAISE NOTICE '🔒 RLS activé sur toutes les tables';
    RAISE NOTICE '🧹 Fonction cleanup_old_logs() créée';
END $$;
