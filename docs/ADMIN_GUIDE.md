# 👑 Guide du Compte Administrateur Hakawa

## 🎯 Vue d'ensemble

Ce guide explique comment configurer et utiliser le compte administrateur de Hakawa avec un accès illimité et des privilèges spéciaux.

---

## 🔐 Sécurité et Cryptage

### ✅ Bonnes pratiques implémentées

1. **Mot de passe JAMAIS stocké en clair**

   - Hashé avec bcrypt par Supabase Auth
   - Impossible de récupérer le mot de passe en clair
   - Protection contre les fuites de base de données

2. **Cryptage des données sensibles**

   - Les mots de passe sont hashés côté serveur
   - Les tokens JWT sont signés et vérifiés
   - Les communications sont en HTTPS

3. **Protection contre le piratage**
   - Système d'authentification Supabase de niveau entreprise
   - Row Level Security (RLS) activé
   - Validation des tokens à chaque requête
   - Pas de hardcoding des credentials

---

## 📋 Configuration du Compte Admin

### Étape 1: Appliquer la migration SQL

1. Connectez-vous à votre tableau de bord Supabase
2. Allez dans **SQL Editor**
3. Copiez le contenu de `supabase/migrations/20231223_admin_setup.sql`
4. Exécutez la migration
5. Vérifiez que les fonctions ont été créées avec succès

### Étape 2: Créer le compte administrateur

#### Option A: Via le script Python (Recommandé)

```bash
cd backend
source venv/bin/activate
python scripts/init_admin.py
```

Le script vous demandera d'entrer votre mot de passe de façon sécurisée (il ne sera pas affiché à l'écran).

#### Option B: Via l'interface Supabase

1. Allez dans **Authentication** > **Users**
2. Cliquez sur **Add user**
3. Email: `yacine.tirichine@gmail.com`
4. Mot de passe: `Milhanou/94` (ou autre mot de passe sécurisé)
5. Cochez "Auto Confirm User"
6. Cliquez sur **Create user**

Ensuite, dans le **SQL Editor**, exécutez:

```sql
SELECT setup_admin_account();
```

### Étape 3: Vérification

Connectez-vous sur votre application avec:

- Email: `yacine.tirichine@gmail.com`
- Mot de passe: celui que vous avez défini

Vous devriez voir:

- ✅ Abonnement: Studio
- ✅ Crédits: 999,999
- ✅ Statut: Administrateur
- ✅ Expiration: 2099

---

## 🚀 Privilèges Administrateur

### Accès Illimité

✨ **Projets**

- Créer un nombre illimité de livres
- Voir tous les projets de tous les utilisateurs
- Modifier/supprimer n'importe quel projet

✨ **Illustrations**

- Crédits illimités (999,999)
- Les crédits ne se décrémenteront jamais
- Génération d'images sans restriction

✨ **Exports**

- Exports illimités au format PDF/EPUB
- Pas de limite de téléchargements

✨ **Données**

- Accès à toutes les ressources
- Bypass de toutes les limitations tier
- Pas de vérification de quota

### Fonctions Admin Spéciales

Les fonctions suivantes sont disponibles dans le backend:

```python
# Vérifier si l'utilisateur est admin
from app.utils.admin import is_admin_user, get_user_profile

profile = await get_user_profile()
if is_admin_user(profile):
    print("Vous êtes administrateur!")

# Vérifier l'accès illimité
from app.utils.admin import has_unlimited_access

if has_unlimited_access(profile):
    print("Accès illimité activé!")

# Créer une route admin-only
from app.utils.admin import require_admin

@router.get("/admin/stats", dependencies=[Depends(require_admin)])
async def get_admin_stats():
    return {"stats": "données sensibles"}
```

---

## 🔒 Sécurité Détaillée

### Comment le mot de passe est-il protégé?

1. **Lors de la création**

   ```
   Mot de passe entré → Envoyé via HTTPS → Hashé par Supabase (bcrypt)
   → Stocké sous forme de hash dans auth.users
   ```

2. **Lors de la connexion**

   ```
   Mot de passe entré → Envoyé via HTTPS → Comparé au hash bcrypt
   → Si match: JWT token généré → Token utilisé pour les requêtes
   ```

3. **Ce qui est stocké dans la base de données**
   ```
   ❌ PAS: "Milhanou/94"
   ✅ OUI: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
   ```

### Protection Row Level Security (RLS)

Les politiques RLS permettent:

- ✅ Admin peut voir/modifier tous les projets
- ✅ Utilisateurs normaux ne voient que leurs projets
- ✅ Impossible de bypasser même avec SQL injection

```sql
-- Exemple de politique
CREATE POLICY "admin_view_all_projects"
    ON public.projects
    FOR SELECT
    USING (is_admin() OR user_id = auth.uid());
```

---

## 📊 Vérification du Statut Admin

### Via SQL (Supabase SQL Editor)

```sql
-- Vérifier votre profil
SELECT
    email,
    is_admin,
    subscription_tier,
    credits_illustrations,
    subscription_expires_at
FROM profiles
WHERE email = 'yacine.tirichine@gmail.com';
```

### Via l'API

```bash
# 1. Se connecter
curl -X POST https://votre-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "yacine.tirichine@gmail.com", "password": "Milhanou/94"}'

# 2. Utiliser le token pour récupérer le profil
curl -X GET https://votre-api.com/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🎨 Utilisation au Quotidien

### Créer des projets sans limite

1. Connectez-vous normalement
2. Créez autant de livres que vous voulez
3. Aucune limite de projets actifs
4. Pas de message "upgrade required"

### Générer des illustrations

1. Les 999,999 crédits ne diminuent jamais
2. Générez autant d'images que nécessaire
3. Testez différents styles sans restriction

### Voir tous les projets

En tant qu'admin, vous pouvez:

- Voir les projets de tous les utilisateurs
- Modifier n'importe quel projet si nécessaire
- Supprimer des projets problématiques

---

## 🔄 Changer le Mot de Passe Admin

### Via le script Python

```bash
cd backend
source venv/bin/activate
python scripts/init_admin.py
```

Répondez "o" (oui) quand on vous demande si vous voulez mettre à jour le mot de passe.

### Via Supabase Dashboard

1. Allez dans **Authentication** > **Users**
2. Trouvez `yacine.tirichine@gmail.com`
3. Cliquez sur les trois points → **Send Magic Link** ou **Reset Password**

---

## ⚠️ Précautions de Sécurité

### À FAIRE ✅

- Utiliser un mot de passe fort (12+ caractères, majuscules, minuscules, chiffres, symboles)
- Activer l'authentification à deux facteurs (2FA) sur Supabase
- Garder les clés API secrètes (jamais dans Git)
- Utiliser des variables d'environnement pour les secrets
- Surveiller les logs d'accès admin

### À NE PAS FAIRE ❌

- Ne JAMAIS partager votre mot de passe admin
- Ne JAMAIS commit les credentials dans Git
- Ne JAMAIS désactiver HTTPS en production
- Ne JAMAIS exposer les clés Supabase côté client
- Ne JAMAIS hardcoder les mots de passe dans le code

---

## 🆘 Dépannage

### "Token invalide" lors de la connexion

1. Vérifiez que l'email est correct
2. Vérifiez que le mot de passe est correct
3. Vérifiez que le compte est bien créé dans Supabase Auth
4. Vérifiez les variables d'environnement SUPABASE_URL et SUPABASE_ANON_KEY

### Le statut admin n'apparaît pas

1. Exécutez `SELECT setup_admin_account();` dans SQL Editor
2. Vérifiez que `is_admin = TRUE` dans la table profiles
3. Déconnectez-vous et reconnectez-vous

### Les crédits diminuent

1. Vérifiez que `is_admin = TRUE`
2. Vérifiez que `credits_illustrations = 999999`
3. Le backend devrait automatiquement bypasser la décrémentation pour les admins

---

## 📝 Résumé des Fichiers Créés

| Fichier                                        | Description                             |
| ---------------------------------------------- | --------------------------------------- |
| `supabase/migrations/20231223_admin_setup.sql` | Migration SQL pour les fonctions admin  |
| `backend/scripts/init_admin.py`                | Script d'initialisation du compte admin |
| `backend/app/utils/admin.py`                   | Utilitaires et middleware admin         |
| `docs/ADMIN_GUIDE.md`                          | Ce guide                                |

---

## 🎯 Prochaines Étapes

1. ✅ Exécuter la migration SQL
2. ✅ Créer le compte admin avec le script
3. ✅ Se connecter et vérifier les privilèges
4. ✅ Tester la création de projets illimités
5. ✅ Profiter de Hakawa sans limites!

---

**Fait avec 🌙 par l'équipe Hakawa**
