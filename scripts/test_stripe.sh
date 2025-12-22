#!/bin/bash

# ════════════════════════════════════════════════════
# HAKAWA - SCRIPT DE TEST STRIPE
# ════════════════════════════════════════════════════

echo "🌙 HAKAWA - Test de l'intégration Stripe"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon dossier
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet Hakawa${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Étape 1: Vérification de l'environnement${NC}"
echo "───────────────────────────────────────────────────────────────────"

# Vérifier les variables d'environnement
cd backend

if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Fichier .env manquant${NC}"
    echo "Créez un fichier .env basé sur .env.example"
    exit 1
fi

# Vérifier la clé Stripe
if grep -q "STRIPE_SECRET_KEY=sk_test" .env; then
    echo -e "${GREEN}✅ Clé Stripe test trouvée${NC}"
else
    echo -e "${RED}❌ Clé Stripe manquante ou invalide${NC}"
    echo "Ajoutez STRIPE_SECRET_KEY dans .env"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Étape 2: Installation des dépendances${NC}"
echo "───────────────────────────────────────────────────────────────────"

# Activer l'environnement virtuel si nécessaire
if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
fi

source venv/bin/activate

# Installer stripe si nécessaire
if ! python -c "import stripe" 2>/dev/null; then
    echo "Installation de la bibliothèque Stripe..."
    pip install stripe python-dotenv
fi

echo -e "${GREEN}✅ Dépendances installées${NC}"

echo ""
echo -e "${BLUE}🔧 Étape 3: Configuration des produits Stripe${NC}"
echo "───────────────────────────────────────────────────────────────────"

python3 scripts/setup_stripe.py

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de la configuration Stripe${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Étape 4: Tests des endpoints API${NC}"
echo "───────────────────────────────────────────────────────────────────"

# Démarrer le serveur en arrière-plan
echo "Démarrage du serveur API..."
uvicorn app.main:app --reload --port 8000 &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 5

# Test 1: Endpoint pricing
echo ""
echo "Test 1: GET /api/stripe/pricing"
PRICING_RESPONSE=$(curl -s http://localhost:8000/api/stripe/pricing)

if echo "$PRICING_RESPONSE" | grep -q "plans"; then
    echo -e "${GREEN}✅ Endpoint pricing fonctionne${NC}"
    echo "Plans disponibles: $(echo $PRICING_RESPONSE | jq '.plans | length') plans"
else
    echo -e "${RED}❌ Endpoint pricing échoué${NC}"
fi

# Test 2: Health check
echo ""
echo "Test 2: GET /health"
HEALTH_RESPONSE=$(curl -s http://localhost:8000/health)

if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo -e "${GREEN}✅ API en bonne santé${NC}"
else
    echo -e "${RED}❌ API non disponible${NC}"
fi

# Arrêter le serveur
kill $SERVER_PID 2>/dev/null

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✨ Tests terminés !${NC}"
echo ""
echo -e "${YELLOW}🎯 Prochaines étapes:${NC}"
echo ""
echo "1. Ouvrez le dashboard Stripe:"
echo "   https://dashboard.stripe.com/test/products"
echo ""
echo "2. Vérifiez que les 3 produits sont créés:"
echo "   - ✨ Hakawa Conteur (19€/mois, 149€/an)"
echo "   - 📚 Hakawa Auteur (39€/mois, 319€/an)"
echo "   - 🏢 Hakawa Studio (99€/mois, 799€/an)"
echo ""
echo "3. Testez les paiements avec les cartes de test:"
echo "   - Succès: 4242 4242 4242 4242"
echo "   - Déclinée: 4000 0000 0000 0002"
echo "   - 3D Secure: 4000 0027 6000 3184"
echo ""
echo "4. Configurez le webhook Stripe:"
echo "   URL: https://votre-domaine.com/api/stripe/webhook"
echo "   Événements: checkout.session.completed,"
echo "              customer.subscription.updated,"
echo "              customer.subscription.deleted"
echo ""
echo "5. Démarrez l'application complète:"
echo "   cd .."
echo "   # Terminal 1:"
echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
echo "   # Terminal 2:"
echo "   cd frontend && npm run dev"
echo ""
echo -e "${GREEN}🌙 Bonne création avec Hakawa !${NC}"
echo ""
