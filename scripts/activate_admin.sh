#!/bin/bash

# ════════════════════════════════════════════════════
# HAKAWA - SCRIPT D'ACTIVATION COMPTE ADMIN
# ════════════════════════════════════════════════════
# Ce script active les droits admin pour contact@hakawa.app
# ════════════════════════════════════════════════════

echo "🔐 Activation du compte admin contact@hakawa.app..."
echo ""

# Charger les variables d'environnement
if [ -f "../backend/.env" ]; then
    source ../backend/.env
else
    echo "❌ Fichier .env non trouvé dans backend/"
    exit 1
fi

# Vérifier que les variables sont chargées
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Variables SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes"
    exit 1
fi

echo "📡 Connexion à Supabase..."
echo "   URL: $SUPABASE_URL"
echo ""

# Exécuter le script SQL d'activation
echo "🔄 Exécution du script d'activation admin..."

RESPONSE=$(curl -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/activate_admin_account" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"admin_email": "contact@hakawa.app"}' \
  2>/dev/null)

# Si la fonction n'existe pas, utiliser une requête SQL directe via PostgREST
if echo "$RESPONSE" | grep -q "not found"; then
    echo "⚠️  Fonction RPC non trouvée, tentative avec SQL direct..."
    
    # Créer un fichier SQL temporaire
    cat > /tmp/activate_admin.sql << 'EOF'
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'contact@hakawa.app';

    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Utilisateur contact@hakawa.app non trouvé - créez-le d''abord via Supabase';
    ELSE
        INSERT INTO public.profiles (
            id, email, full_name, subscription_tier,
            subscription_expires_at, credits_illustrations,
            is_admin, created_at, updated_at
        )
        VALUES (
            admin_user_id, 'contact@hakawa.app', 'Hakawa Admin', 'studio',
            '2099-12-31 23:59:59+00', 999999,
            TRUE, NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            email = 'contact@hakawa.app',
            subscription_tier = 'studio',
            subscription_expires_at = '2099-12-31 23:59:59+00',
            credits_illustrations = 999999,
            is_admin = TRUE,
            updated_at = NOW();
        
        RAISE NOTICE 'Compte admin activé pour contact@hakawa.app';
    END IF;
END $$;
EOF

    echo ""
    echo "📋 Pour activer manuellement le compte admin:"
    echo "   1. Allez sur https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju/editor"
    echo "   2. Ouvrez l'éditeur SQL"
    echo "   3. Copiez et exécutez le contenu de: /tmp/activate_admin.sql"
    echo ""
    echo "Ou bien:"
    echo "   Exécutez: cat /tmp/activate_admin.sql"
    echo ""
fi

# Vérifier le profil
echo "🔍 Vérification du profil admin..."
PROFILE=$(curl -X GET \
  "${SUPABASE_URL}/rest/v1/profiles?email=eq.contact@hakawa.app&select=*" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  2>/dev/null)

echo "$PROFILE" | jq '.' 2>/dev/null || echo "$PROFILE"
echo ""

# Instructions pour Google OAuth
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 CONFIGURATION GOOGLE OAUTH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pour activer Google OAuth:"
echo ""
echo "1. Allez sur: https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju/auth/providers"
echo ""
echo "2. Activez Google et ajoutez:"
echo "   • Client ID (from Google Cloud Console)"
echo "   • Client Secret (from Google Cloud Console)"
echo ""
echo "3. Dans Google Cloud Console (https://console.cloud.google.com):"
echo "   • Créez un projet OAuth 2.0"
echo "   • Ajoutez l'URL de callback:"
echo "     https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback"
echo ""
echo "4. Consultez le guide complet: docs/GOOGLE_OAUTH_SETUP.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Script terminé!"
echo ""
echo "⚠️  IMPORTANT:"
echo "   Si le compte contact@hakawa.app n'existe pas encore,"
echo "   créez-le d'abord via:"
echo "   https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju/auth/users"
echo ""
