# 💳 Guide Complet d'Intégration Stripe - Hakawa

## 🎯 Vue d'ensemble

Ce guide vous permet de configurer complètement l'intégration Stripe pour Hakawa avec les 3 plans tarifaires définis dans l'étude de pricing.

---

## 📋 Prérequis

- [x] Compte Stripe créé (https://dashboard.stripe.com)
- [x] Clé API Stripe test (`sk_test_...`)
- [x] Backend Hakawa fonctionnel
- [x] Frontend Hakawa fonctionnel
- [x] Python 3.8+ avec pip
- [x] Node.js 16+ avec npm

---

## 🚀 Étape 1: Configuration Stripe Dashboard

### 1.1 Créer un compte Stripe

1. Allez sur https://dashboard.stripe.com/register
2. Créez votre compte avec votre email professionnel
3. Complétez les informations de votre entreprise

### 1.2 Activer le mode test

1. Dans le dashboard Stripe, activez le **mode test** (toggle en haut à droite)
2. Vous verrez "Mode test" indiqué en orange

### 1.3 Récupérer les clés API

1. Allez dans **Developers** > **API keys**
2. Copiez :
   - **Publishable key** (commence par `pk_test_`)
   - **Secret key** (commence par `sk_test_`)

⚠️ **IMPORTANT**: NE JAMAIS committer ces clés dans Git !

---

## 🔧 Étape 2: Configuration Backend

### 2.1 Ajouter les variables d'environnement

Créez ou modifiez `backend/.env` :

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe_test
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# Price IDs (seront générés automatiquement)
STRIPE_PRICE_CONTEUR_MONTHLY=
STRIPE_PRICE_CONTEUR_ANNUAL=
STRIPE_PRICE_AUTEUR_MONTHLY=
STRIPE_PRICE_AUTEUR_ANNUAL=
STRIPE_PRICE_STUDIO_MONTHLY=
STRIPE_PRICE_STUDIO_ANNUAL=
```

### 2.2 Installer les dépendances

```bash
cd backend
source venv/bin/activate
pip install stripe python-dotenv
```

### 2.3 Créer les produits dans Stripe

```bash
python scripts/setup_stripe.py
```

Ce script va :

1. ✅ Se connecter à Stripe avec votre clé API
2. ✅ Créer 3 produits (Conteur, Auteur, Studio)
3. ✅ Créer 6 prix (mensuel et annuel pour chaque plan)
4. ✅ Afficher les Price IDs à copier dans `.env`

**Exemple de sortie** :

```
✅ Produit créé: Hakawa Conteur (prod_xxxxx)
✅ Prix mensuel: price_xxxxx (19€/mois)
✅ Prix annuel: price_xxxxx (149€/an = 12.42€/mois)
💎 Économie annuelle: 79.00€
```

### 2.4 Copier les Price IDs dans .env

Copiez les `price_xxxxx` affichés par le script dans votre fichier `.env` :

```bash
STRIPE_PRICE_CONTEUR_MONTHLY=price_xxxxx
STRIPE_PRICE_CONTEUR_ANNUAL=price_xxxxx
STRIPE_PRICE_AUTEUR_MONTHLY=price_xxxxx
STRIPE_PRICE_AUTEUR_ANNUAL=price_xxxxx
STRIPE_PRICE_STUDIO_MONTHLY=price_xxxxx
STRIPE_PRICE_STUDIO_ANNUAL=price_xxxxx
```

---

## 🎨 Étape 3: Configuration Frontend

### 3.1 Ajouter la clé publique Stripe

Créez ou modifiez `frontend/.env` :

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
VITE_API_URL=http://localhost:8000
```

### 3.2 Installer les dépendances

```bash
cd frontend
npm install @stripe/stripe-js
```

---

## 🗄️ Étape 4: Migration Base de Données

### 4.1 Appliquer la migration Stripe

Dans Supabase SQL Editor, exécutez :

```sql
-- Contenu de: supabase/migrations/20231223_stripe_integration.sql
```

Cela va créer :

- ✅ Colonnes `stripe_customer_id`, `stripe_subscription_id` dans `profiles`
- ✅ Table `payment_history` pour l'historique des paiements
- ✅ Table `promo_codes` pour les codes promotionnels
- ✅ Table `promo_redemptions` pour l'utilisation des codes
- ✅ Politiques RLS appropriées

---

## 🧪 Étape 5: Tests

### 5.1 Test automatique

```bash
cd /chemin/vers/hakawa
./scripts/test_stripe.sh
```

Ce script va :

1. Vérifier l'environnement
2. Créer les produits Stripe
3. Tester les endpoints API
4. Afficher un rapport complet

### 5.2 Test manuel du flux complet

#### A. Démarrer l'application

**Terminal 1 - Backend** :

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend** :

```bash
cd frontend
npm run dev
```

#### B. Tester l'inscription

1. Ouvrez http://localhost:5173
2. Créez un nouveau compte
3. Vérifiez que le profil est créé en mode gratuit

#### C. Tester la page pricing

1. Allez sur http://localhost:5173/pricing
2. Vérifiez que les 4 plans s'affichent :
   - 🌙 Gratuit (0€)
   - ✨ Conteur (19€/mois ou 149€/an)
   - 📚 Auteur (39€/mois ou 319€/an)
   - 🏢 Studio (99€/mois ou 799€/an)

#### D. Tester un paiement

1. Connectez-vous
2. Cliquez sur "Essayer 7 jours" sur le plan Conteur
3. Vous serez redirigé vers Stripe Checkout
4. Utilisez une **carte de test** :
   - Numéro: `4242 4242 4242 4242`
   - Date: N'importe quelle date future (ex: 12/25)
   - CVC: N'importe quel 3 chiffres (ex: 123)
   - Code postal: N'importe lequel
5. Complétez le paiement
6. Vous serez redirigé vers `/dashboard?payment=success`
7. Vérifiez que :
   - Votre plan est passé à "Conteur"
   - Vous avez 20 crédits d'illustration
   - La date d'expiration est dans 1 mois

#### E. Tester la gestion d'abonnement

1. Allez sur http://localhost:5173/dashboard/subscription
2. Cliquez sur "Gérer mon abonnement"
3. Vous serez redirigé vers le portail client Stripe
4. Testez :
   - Changer de plan
   - Mettre à jour le moyen de paiement
   - Voir l'historique
   - Annuler l'abonnement

---

## 🔗 Étape 6: Configuration Webhooks

Les webhooks permettent à Stripe de notifier votre backend des événements (paiement réussi, abonnement annulé, etc.).

### 6.1 En développement (Stripe CLI)

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

Copiez le `signing secret` affiché et ajoutez-le dans `backend/.env` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 6.2 En production

1. Allez dans **Developers** > **Webhooks** dans Stripe Dashboard
2. Cliquez sur **Add endpoint**
3. URL: `https://votre-domaine.com/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le `Signing secret` dans votre `.env` production

---

## 🎁 Étape 7: Codes Promo (Optionnel)

### 7.1 Créer un code promo dans Supabase

```sql
INSERT INTO public.promo_codes (
    code,
    discount_type,
    discount_value,
    max_redemptions,
    description,
    valid_until
)
VALUES (
    'EARLYBIRD',
    'percentage',
    50,
    200,
    'Early Bird - 50% de réduction',
    '2025-03-31 23:59:59+00'
);
```

### 7.2 Créer un coupon dans Stripe

1. Allez dans **Products** > **Coupons**
2. Créez les coupons correspondants
3. Les utilisateurs pourront les appliquer au checkout

---

## 🧪 Cartes de Test Stripe

| Scénario                  | Numéro de carte       |
| ------------------------- | --------------------- |
| ✅ **Paiement réussi**    | `4242 4242 4242 4242` |
| ❌ **Paiement décliné**   | `4000 0000 0000 0002` |
| 🔐 **3D Secure requis**   | `4000 0027 6000 3184` |
| 💳 **Fonds insuffisants** | `4000 0000 0000 9995` |
| ⏰ **Carte expirée**      | `4000 0000 0000 0069` |

**Pour toutes** :

- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres
- Code postal : N'importe lequel

Plus de cartes : https://stripe.com/docs/testing

---

## 📊 Étape 8: Vérification

### 8.1 Checklist Backend

- [ ] Variables d'environnement configurées
- [ ] Produits Stripe créés
- [ ] Migration SQL appliquée
- [ ] API `/api/stripe/pricing` fonctionne
- [ ] API `/api/stripe/create-checkout-session` fonctionne
- [ ] Webhook configuré et testé

### 8.2 Checklist Frontend

- [ ] Page `/pricing` s'affiche correctement
- [ ] Page `/dashboard/subscription` fonctionne
- [ ] Redirection vers Stripe Checkout OK
- [ ] Retour après paiement OK
- [ ] Affichage du plan mis à jour

### 8.3 Checklist Stripe Dashboard

- [ ] 3 produits créés (Conteur, Auteur, Studio)
- [ ] 6 prix créés (2 par produit)
- [ ] Mode test activé
- [ ] Webhooks configurés
- [ ] Coupons créés (optionnel)

---

## 🐛 Dépannage

### Erreur: "No such price"

**Cause** : Les Price IDs dans `.env` ne correspondent pas à ceux de Stripe

**Solution** :

```bash
cd backend
python scripts/setup_stripe.py
# Copier les nouveaux Price IDs dans .env
```

### Erreur: "Invalid API Key"

**Cause** : La clé Stripe est incorrecte ou manquante

**Solution** :

- Vérifier que `STRIPE_SECRET_KEY` est bien défini dans `.env`
- Vérifier que la clé commence par `sk_test_`

### Webhook ne fonctionne pas

**Cause** : Le signing secret est incorrect

**Solution** :

```bash
# En dev
stripe listen --forward-to localhost:8000/api/stripe/webhook

# En prod
Vérifier le signing secret dans Stripe Dashboard > Webhooks
```

### Plan non mis à jour après paiement

**Cause** : Le webhook n'a pas été reçu ou traité

**Solution** :

1. Vérifier les logs du backend
2. Vérifier les événements dans Stripe Dashboard > Events
3. Retester le webhook

---

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

---

## ✅ Récapitulatif

Vous avez maintenant :

1. ✅ **Backend configuré** avec toutes les routes Stripe
2. ✅ **Frontend** avec pages Pricing et Subscription
3. ✅ **Base de données** avec tables pour paiements et codes promo
4. ✅ **Produits Stripe** créés automatiquement
5. ✅ **Webhooks** configurés pour gérer les événements
6. ✅ **Tests** complets avec cartes de test

🎉 **Votre système de paiement Hakawa est prêt !**

---

## 🚀 Déploiement en Production

Avant de passer en production :

1. [ ] Désactiver le mode test Stripe
2. [ ] Créer les produits en mode production
3. [ ] Mettre à jour les clés API (`sk_live_...`, `pk_live_...`)
4. [ ] Configurer les webhooks production
5. [ ] Tester avec une vraie carte
6. [ ] Activer le suivi dans Stripe Dashboard

---

**🌙 Hakawa - L'art de raconter, réinventé**

_Document créé le 22 décembre 2025_
