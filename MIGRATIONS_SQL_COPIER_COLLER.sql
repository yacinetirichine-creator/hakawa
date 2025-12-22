-- ════════════════════════════════════════════════════════════════════
-- HAKAWA - MIGRATIONS SQL COMPLÈTES
-- ════════════════════════════════════════════════════════════════════
-- À COPIER/COLLER dans Supabase SQL Editor
-- URL: https://gmqmrrkmdtfbftstyiju.supabase.co
-- Menu: SQL Editor → New query → Coller tout → RUN
-- ════════════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════
-- MIGRATION 1 : SCHEMA INITIAL
-- ════════════════════════════════════════════════════

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────
-- PROFILES (extension de auth.users)
-- ────────────────────────────────────────────────────
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'conteur', 'pro', 'studio')),
    subscription_expires_at TIMESTAMPTZ,
    credits_illustrations INTEGER DEFAULT 0,
    is_child_mode BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- PROJECTS (Livres)
-- ────────────────────────────────────────────────────
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    title TEXT NOT NULL,
    pitch TEXT,
    genre TEXT,
    style TEXT CHECK (style IN ('roman', 'manga', 'bd', 'comic', 'enfants', 'fantasy')),
    target_audience TEXT CHECK (target_audience IN ('children', 'young_adult', 'adult')),
    
    characters JSONB DEFAULT '[]',
    universe TEXT,
    themes TEXT[],
    
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'exploring', 'planning', 'writing', 'illustrating', 'exporting', 'published')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    kdp_config JSONB DEFAULT '{
        "binding": "paperback",
        "trim_size": "6x9",
        "ink_type": "premium_color",
        "paper_type": "white"
    }',
    
    cover_front_url TEXT,
    cover_back_url TEXT,
    cover_spine_text TEXT,
    
    word_count INTEGER DEFAULT 0,
    chapter_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────
-- CHAPTERS
-- ────────────────────────────────────────────────────
CREATE TABLE public.chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    
    word_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, number)
);

-- ────────────────────────────────────────────────────
-- ILLUSTRATIONS
-- ────────────────────────────────────────────────────
CREATE TABLE public.illustrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    
    prompt TEXT NOT NULL,
    style TEXT CHECK (style IN ('manga', 'realistic', 'bd', 'comic', 'watercolor')),
    image_url TEXT NOT NULL,
    
    position_in_chapter INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- CONVERSATIONS (Chat créatif)
-- ────────────────────────────────────────────────────
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    messages JSONB DEFAULT '[]',
    phase TEXT CHECK (phase IN ('exploration', 'planning', 'writing')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- EXPORTS
-- ────────────────────────────────────────────────────
CREATE TABLE public.exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    format TEXT CHECK (format IN ('pdf', 'epub', 'kdp_interior', 'kdp_cover')),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_chapters_project_id ON public.chapters(project_id);
CREATE INDEX idx_illustrations_project_id ON public.illustrations(project_id);
CREATE INDEX idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX idx_exports_project_id ON public.exports(project_id);

-- ────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own chapters" ON public.chapters FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = chapters.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own illustrations" ON public.illustrations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = illustrations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own conversations" ON public.conversations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = conversations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own exports" ON public.exports FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = exports.project_id AND projects.user_id = auth.uid()));

-- ────────────────────────────────────────────────────
-- FUNCTIONS
-- ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ════════════════════════════════════════════════════
-- MIGRATION 2 : ADMIN SETUP
-- ════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION setup_admin_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'yacine.tirichine@gmail.com';
BEGIN
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;

    IF admin_user_id IS NOT NULL THEN
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
            'studio',
            '2099-12-31 23:59:59+00',
            999999,
            TRUE,
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
        RAISE NOTICE 'Utilisateur % non trouvé. Créez le compte d''abord.', admin_email;
    END IF;
END;
$$;

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

DROP POLICY IF EXISTS "admin_view_all_projects" ON public.projects;
CREATE POLICY "admin_view_all_projects"
    ON public.projects
    FOR SELECT
    USING (is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "admin_update_all_projects" ON public.projects;
CREATE POLICY "admin_update_all_projects"
    ON public.projects
    FOR UPDATE
    USING (is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "admin_delete_all_projects" ON public.projects;
CREATE POLICY "admin_delete_all_projects"
    ON public.projects
    FOR DELETE
    USING (is_admin() OR user_id = auth.uid());

CREATE OR REPLACE FUNCTION check_user_limits(
    user_id UUID,
    resource_type TEXT
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
    SELECT is_admin, subscription_tier INTO user_is_admin, user_tier
    FROM public.profiles
    WHERE id = user_id;

    IF user_is_admin = TRUE THEN
        RETURN TRUE;
    END IF;

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


-- ════════════════════════════════════════════════════
-- MIGRATION 3 : STRIPE INTEGRATION
-- ════════════════════════════════════════════════════

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
ON public.profiles(stripe_customer_id);

CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    stripe_subscription_id TEXT,
    
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'eur',
    
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    
    payment_type TEXT CHECK (payment_type IN ('subscription', 'one_time', 'addon')),
    
    plan_tier TEXT,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
    
    metadata JSONB DEFAULT '{}',
    
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user_id
ON public.payment_history(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_intent
ON public.payment_history(stripe_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_payment_history_created_at
ON public.payment_history(created_at DESC);

CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    code TEXT UNIQUE NOT NULL,
    
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL,
    
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    
    allowed_plans TEXT[],
    min_amount INTEGER,
    
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.promo_redemptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    payment_id UUID REFERENCES public.payment_history(id) ON DELETE SET NULL,
    
    discount_amount INTEGER NOT NULL,
    
    redeemed_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(promo_code_id, user_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_history_updated_at ON public.payment_history;
CREATE TRIGGER update_payment_history_updated_at
    BEFORE UPDATE ON public.payment_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON public.promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
    BEFORE UPDATE ON public.promo_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_view_own_payment_history" ON public.payment_history;
CREATE POLICY "users_view_own_payment_history"
    ON public.payment_history
    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "no_user_modifications_payment_history" ON public.payment_history;
CREATE POLICY "no_user_modifications_payment_history"
    ON public.payment_history
    FOR UPDATE
    USING (is_admin());

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

ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_view_own_promo_redemptions" ON public.promo_redemptions;
CREATE POLICY "users_view_own_promo_redemptions"
    ON public.promo_redemptions
    FOR SELECT
    USING (user_id = auth.uid() OR is_admin());

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

INSERT INTO public.promo_codes (code, discount_type, discount_value, max_redemptions, description, valid_until)
VALUES
    ('EARLYBIRD', 'percentage', 50, 200, 'Early Bird - 50% de réduction à vie sur Conteur', '2025-03-31 23:59:59+00'),
    ('LAUNCH2025', 'percentage', 30, 500, 'Lancement 2025 - 30% de réduction', '2025-02-28 23:59:59+00'),
    ('AUTEUR10', 'percentage', 10, NULL, '10% de réduction sur plan Auteur', NULL)
ON CONFLICT (code) DO NOTHING;


-- ════════════════════════════════════════════════════════════════════
-- ✅ MIGRATIONS TERMINÉES !
-- ════════════════════════════════════════════════════════════════════
-- Après exécution, votre base de données est prête pour Hakawa !
-- ════════════════════════════════════════════════════════════════════
