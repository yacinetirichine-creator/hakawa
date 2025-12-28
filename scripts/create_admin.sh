#!/bin/bash

# Script pour créer le compte admin Hakawa
# Email: contact@hakawa.app
# Mot de passe: Milhanou141511

echo "🌙 HAKAWA - Création du compte administrateur"
echo "=============================================="
echo ""
echo "Email: contact@hakawa.app"
echo ""

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Vérifier que les variables sont définies
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ ERREUR: Variables SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes"
    echo "Assurez-vous que le fichier .env contient ces variables"
    exit 1
fi

# Appeler le script Python avec le mot de passe
cd backend
source venv/bin/activate 2>/dev/null || {
    echo "⚠️  Virtual environment non trouvé. Création..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
}

# Passer le mot de passe au script Python
echo "Milhanou141511" | python scripts/init_admin.py

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "Vous pouvez maintenant vous connecter avec:"
echo "  Email: contact@hakawa.app"
echo "  Mot de passe: Milhanou141511"
echo ""
