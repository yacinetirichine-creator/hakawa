-- ════════════════════════════════════════════════════
-- HAKAWA - STRIPE INTEGRATION
-- ════════════════════════════════════════════════════
-- Ajoute les champs nécessaires pour l'intégration Stripe
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- Ajouter les colonnes Stripe au profil
-- ────────────────────────────────────────────────────
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

-- ────────────────────────────────────────────────────
-- Créer un index sur stripe_customer_id pour les recherches
-- ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON public.profiles(stripe_customer_id);

-- ────────────────────────────────────────────────────
-- Table pour historique des paiements
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Informations Stripe
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Montant et devise
    amount INTEGER NOT NULL, -- en centimes
    currency TEXT DEFAULT 'eur',
    
    -- Statut
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    
    -- Type de paiement
    payment_type TEXT CHECK (payment_type IN ('subscription', 'one_time', 'addon')),
    
    -- Plan
    plan_tier TEXT,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index sur payment_history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id
ON public.payment_history(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_intent
ON public.payment_history(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_payment_history_created_at
ON public.payment_history(created_at DESC);

-- ────────────────────────────────────────────────────
-- Table pour les codes promo
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Code
    code TEXT UNIQUE NOT NULL,
    
    -- Réduction
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL, -- pourcentage (ex: 20 pour 20%) ou montant en centimes
    
    -- Limites
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    -- Restrictions
    allowed_plans TEXT[], -- Plans éligibles (null = tous)
    min_amount INTEGER, -- Montant minimum en centimes
    
    -- Métadonnées
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Activé
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- Table pour les utilisations de codes promo
-- ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Paiement associé
    payment_id UUID REFERENCES public.payment_history(id) ON DELETE SET NULL,
    
    -- Montant de la réduction appliquée
    discount_amount INTEGER NOT NULL,
    
    -- Timestamp
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contrainte: un utilisateur ne peut utiliser un code promo qu'une fois
    UNIQUE(promo_code_id, user_id)
);

-- ────────────────────────────────────────────────────
-- Fonction: Trigger pour mettre à jour updated_at
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur payment_history
DROP TRIGGER IF EXISTS update_payment_history_updated_at ON public.payment_history;
CREATE TRIGGER update_payment_history_updated_at
    BEFORE UPDATE ON public.payment_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Appliquer le trigger sur promo_codes
DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON public.promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
    BEFORE UPDATE ON public.promo_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────
-- RLS Policies
-- ────────────────────────────────────────────────────

-- Payment History: Les utilisateurs ne voient que leur propre historique
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_view_own_payment_history" ON public.payment_history;
CREATE POLICY "users_view_own_payment_history"
    ON public.payment_history
    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

-- Les utilisateurs ne peuvent pas modifier leur historique
DROP POLICY IF EXISTS "no_user_modifications_payment_history" ON public.payment_history;
CREATE POLICY "no_user_modifications_payment_history"
    ON public.payment_history
    FOR UPDATE
    USING (is_admin());

-- Promo codes: Public en lecture, admin seulement en écriture
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "promo_codes_public_read" ON public.promo_codes;
CREATE POLICY "promo_codes_public_read"
    ON public.promo_codes
    FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "promo_codes_admin_all" ON public.promo_codes;
CREATE POLICY "promo_codes_admin_all"
    ON public.promo_codes
    FOR ALL
    USING (is_admin());

-- Promo redemptions: Utilisateurs voient leurs propres utilisations
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_view_own_promo_redemptions" ON public.promo_redemptions;
CREATE POLICY "users_view_own_promo_redemptions"
    ON public.promo_redemptions
    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

-- ────────────────────────────────────────────────────
-- Fonction: Créer une entrée dans l'historique de paiement
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_payment(
    p_user_id UUID,
    p_amount INTEGER,
    p_currency TEXT,
    p_status TEXT,
    p_plan_tier TEXT DEFAULT NULL,
    p_billing_period TEXT DEFAULT NULL,
    p_stripe_payment_intent_id TEXT DEFAULT NULL,
    p_stripe_invoice_id TEXT DEFAULT NULL,
    p_stripe_subscription_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    payment_id UUID;
BEGIN
    INSERT INTO public.payment_history (
        user_id,
        amount,
        currency,
        status,
        payment_type,
        plan_tier,
        billing_period,
        stripe_payment_intent_id,
        stripe_invoice_id,
        stripe_subscription_id,
        paid_at
    )
    VALUES (
        p_user_id,
        p_amount,
        p_currency,
        p_status,
        'subscription',
        p_plan_tier,
        p_billing_period,
        p_stripe_payment_intent_id,
        p_stripe_invoice_id,
        p_stripe_subscription_id,
        CASE WHEN p_status = 'succeeded' THEN NOW() ELSE NULL END
    )
    RETURNING id INTO payment_id;
    
    RETURN payment_id;
END;
$$;

-- ────────────────────────────────────────────────────
-- Commentaires
-- ────────────────────────────────────────────────────
COMMENT ON TABLE public.payment_history IS 
    'Historique de tous les paiements effectués via Stripe';

COMMENT ON TABLE public.promo_codes IS 
    'Codes promotionnels pour réductions';

COMMENT ON TABLE public.promo_redemptions IS 
    'Utilisations des codes promo par les utilisateurs';

COMMENT ON FUNCTION log_payment IS 
    'Enregistre un paiement dans l''historique';

-- ────────────────────────────────────────────────────
-- Données de test: Codes promo Early Bird
-- ────────────────────────────────────────────────────
INSERT INTO public.promo_codes (code, discount_type, discount_value, max_redemptions, description, valid_until)
VALUES
    ('EARLYBIRD', 'percentage', 50, 200, 'Early Bird - 50% de réduction à vie sur Conteur', '2025-03-31 23:59:59+00'),
    ('LAUNCH2025', 'percentage', 30, 500, 'Lancement 2025 - 30% de réduction', '2025-02-28 23:59:59+00'),
    ('AUTEUR10', 'percentage', 10, NULL, '10% de réduction sur plan Auteur', NULL)
ON CONFLICT (code) DO NOTHING;

-- ════════════════════════════════════════════════════
-- FIN DE LA MIGRATION
-- ════════════════════════════════════════════════════
