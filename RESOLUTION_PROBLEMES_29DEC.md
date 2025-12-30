# 🔧 Guide de Résolution des Problèmes Identifiés

## Date: 29 décembre 2025

---

## ✅ Problèmes Corrigés Automatiquement

### 1. Fichier .env Frontend Manquant

- **Problème**: Le frontend n'avait pas de fichier `.env` avec les clés Supabase
- **Solution**: Créé `/workspaces/hakawa/frontend/.env` avec:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Statut**: ✅ CORRIGÉ - Frontend redémarré

### 2. Détection Admin Incorrecte

- **Problème**: `isAdmin()` cherchait `@hakawa.com` au lieu de `@hakawa.app`
- **Fichier**: `frontend/src/contexts/AuthContext.jsx`
- **Solution**: Ajouté `@hakawa.app` et `@hakawa.com` dans la détection
- **Statut**: ✅ CORRIGÉ

---

## 🔐 Problème 1: Compte Admin Non Activé

### Diagnostic

Votre compte `contact@hakawa.app` existe mais n'a probablement pas:

- ❌ Le flag `is_admin = TRUE`
- ❌ Le plan `subscription_tier = 'studio'`
- ❌ Les crédits illimités

### Solution A: Activation via Script (Recommandé)

```bash
cd /workspaces/hakawa/scripts
./activate_admin.sh
```

### Solution B: Activation Manuelle via Supabase Dashboard

1. **Allez sur Supabase Dashboard**:

   ```
   https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju
   ```

2. **Ouvrez l'éditeur SQL**:

   - Cliquez sur "SQL Editor" dans le menu gauche
   - Créez une nouvelle requête

3. **Copiez-collez ce SQL**:

```sql
-- Vérifier si le compte existe
SELECT id, email FROM auth.users WHERE email = 'contact@hakawa.app';

-- Si le compte existe, l'activer en tant qu'admin
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Récupérer l'ID
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'contact@hakawa.app';

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Compte non trouvé - créez-le d''abord';
    END IF;

    -- Activer les droits admin
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
        'contact@hakawa.app',
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

    RAISE NOTICE 'Admin activé avec ID: %', admin_user_id;
END $$;

-- Vérifier le résultat
SELECT
    email,
    full_name,
    subscription_tier,
    is_admin,
    credits_illustrations
FROM public.profiles
WHERE email = 'contact@hakawa.app';
```

4. **Exécutez la requête** (bouton "Run" ou Ctrl+Enter)

5. **Déconnectez-vous et reconnectez-vous** sur http://localhost:5173

---

## 🔑 Problème 2: Google OAuth Ne Fonctionne Pas

### Diagnostic

L'erreur "ERR_CONNECTION_REFUSED" indique que:

- ❌ Google OAuth n'est pas configuré dans Supabase
- ❌ Ou les URLs de callback ne sont pas correctes

### Solution: Configurer Google OAuth

#### Étape 1: Créer les Credentials Google

1. **Allez sur Google Cloud Console**:

   ```
   https://console.cloud.google.com/
   ```

2. **Créez ou sélectionnez un projet**

3. **Activez Google+ API**:

   - Menu: APIs & Services → Library
   - Cherchez "Google+ API"
   - Cliquez "Enable"

4. **Créez les OAuth Credentials**:

   - Menu: APIs & Services → Credentials
   - Cliquez "Create Credentials" → "OAuth client ID"
   - Type: "Web application"
   - Nom: "Hakawa"

5. **Ajoutez les Authorized redirect URIs**:

   ```
   http://localhost:5173
   https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
   ```

6. **Notez**:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`

#### Étape 2: Configurer Supabase

1. **Allez sur Supabase Auth Providers**:

   ```
   https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju/auth/providers
   ```

2. **Activez Google**:

   - Trouvez "Google" dans la liste
   - Cliquez "Enable"

3. **Remplissez les champs**:

   - **Client ID**: Collez le Client ID de Google
   - **Client Secret**: Collez le Client Secret de Google
   - **Authorized Client IDs**: (laissez vide pour web)

4. **Sauvegardez**

5. **Testez**:
   - Allez sur http://localhost:5173/login
   - Cliquez sur "Se connecter avec Google"
   - Devrait rediriger vers Google

---

## 📋 Vérifications Post-Installation

### 1. Vérifier que les serveurs tournent

```bash
# Backend
curl http://localhost:8000/health

# Frontend
curl http://localhost:5173
```

### 2. Tester l'authentification

1. Allez sur: http://localhost:5173/login
2. Connectez-vous avec `contact@hakawa.app`
3. Vérifiez que vous voyez:
   - ✅ Dashboard Admin dans le menu
   - ✅ Plan: Studio (ou illimité)
   - ✅ Crédits: 999999

### 3. Tester Google OAuth

1. Allez sur: http://localhost:5173/login
2. Cliquez "Se connecter avec Google"
3. Devrait ouvrir la page Google
4. Après authentification, retour sur le dashboard

---

## 🆘 Si les Problèmes Persistent

### Compte Admin ne s'affiche pas comme admin

**Vérifiez dans Supabase**:

```sql
SELECT id, email, is_admin, subscription_tier
FROM profiles
WHERE email = 'contact@hakawa.app';
```

Devrait retourner:

- `is_admin`: `true`
- `subscription_tier`: `'studio'`

**Si non**, ré-exécutez le SQL d'activation.

### Google OAuth affiche toujours une erreur

**Vérifiez**:

1. Google OAuth est activé dans Supabase Dashboard
2. Client ID et Secret sont corrects
3. L'URL de callback est exactement:
   ```
   https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
   ```
4. Le projet Google Cloud a Google+ API activée

**Debug**:

- Ouvrez la console du navigateur (F12)
- Regardez l'onglet "Network" lors du clic sur Google
- Vérifiez les erreurs

---

## 📞 Contact

Si vous avez encore des problèmes, fournissez:

1. Capture d'écran de l'erreur
2. Console du navigateur (F12 → Console)
3. Résultat de la requête SQL de vérification du profil

---

## 🎯 Résumé des Actions

- [x] Créé `/workspaces/hakawa/frontend/.env`
- [x] Corrigé la détection admin dans `AuthContext.jsx`
- [x] Créé le script d'activation admin
- [ ] **À FAIRE**: Exécuter le SQL d'activation admin dans Supabase
- [ ] **À FAIRE**: Configurer Google OAuth dans Google Cloud + Supabase

---

_Dernière mise à jour: 29 décembre 2025_
