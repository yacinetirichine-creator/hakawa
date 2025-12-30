# 🔐 Configuration Google OAuth - Guide Rapide

## 🎯 Objectif

Permettre aux utilisateurs de se connecter avec leur compte Google.

---

## 📋 Prérequis

- Un compte Google
- Accès à Google Cloud Console
- Accès à Supabase Dashboard

---

## 🚀 Étapes de Configuration

### Partie 1: Google Cloud Console (15 minutes)

#### 1.1 Créer ou Sélectionner un Projet

1. Allez sur: https://console.cloud.google.com/
2. Cliquez sur le sélecteur de projet (en haut)
3. Créez un nouveau projet "Hakawa" ou sélectionnez un existant

#### 1.2 Activer Google+ API

1. Dans le menu, allez sur: **APIs & Services** → **Library**
2. Cherchez: `Google+ API`
3. Cliquez dessus puis sur **ENABLE**

#### 1.3 Configurer l'Écran de Consentement

1. Menu: **APIs & Services** → **OAuth consent screen**
2. Choisissez: **External** (pour permettre tout utilisateur Google)
3. Remplissez:
   - **App name**: Hakawa
   - **User support email**: contact@hakawa.app
   - **Developer contact email**: contact@hakawa.app
4. **Scopes**: Ajoutez (si demandé):
   - `email`
   - `profile`
   - `openid`
5. **Test users** (optionnel en dev): Ajoutez votre email
6. Cliquez **SAVE AND CONTINUE** jusqu'à la fin

#### 1.4 Créer les OAuth Credentials

1. Menu: **APIs & Services** → **Credentials**
2. Cliquez: **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **Hakawa Web Client**
5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   ```
6. **Authorized redirect URIs** (IMPORTANT):

   ```
   http://localhost:5173
   https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
   ```

7. Cliquez **CREATE**

8. **📋 NOTEZ CES VALEURS** (vous en aurez besoin):
   ```
   Client ID: xxxxxxxxxx.apps.googleusercontent.com
   Client secret: xxxxxxxxxx
   ```

---

### Partie 2: Supabase Dashboard (5 minutes)

#### 2.1 Accéder aux Auth Providers

1. Allez sur: https://supabase.com/dashboard/project/gmqmrrkmdtfbftstyiju
2. Menu: **Authentication** → **Providers**
3. Trouvez **Google** dans la liste

#### 2.2 Configurer Google Provider

1. Cliquez sur **Google** pour l'éditer
2. **Activez** le toggle "Enable Sign in with Google"
3. Remplissez:

   **Client ID (for OAuth)**:

   ```
   [Collez le Client ID de Google Cloud Console]
   ```

   **Client Secret (for OAuth)**:

   ```
   [Collez le Client Secret de Google Cloud Console]
   ```

4. **Authorized Client IDs**: Laissez vide (pour web)

5. Cliquez **SAVE**

---

## ✅ Vérification

### Test 1: URL de Callback

1. Vérifiez que cette URL est bien dans Google Cloud Console:

   ```
   https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
   ```

2. Cette URL est visible dans Supabase sous le provider Google

### Test 2: Connexion

1. Allez sur: http://localhost:5173/login
2. Cliquez sur "Se connecter avec Google"
3. Devrait ouvrir une popup Google
4. Sélectionnez votre compte Google
5. Acceptez les permissions
6. Devrait revenir sur le dashboard

---

## 🐛 Problèmes Courants

### Erreur: "redirect_uri_mismatch"

**Cause**: L'URL de callback n'est pas dans Google Cloud Console

**Solution**:

1. Retournez dans Google Cloud Console
2. Credentials → Votre OAuth Client
3. Ajoutez exactement:
   ```
   https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
   ```

### Erreur: "ERR_CONNECTION_REFUSED"

**Cause**: Google OAuth pas activé dans Supabase

**Solution**:

1. Vérifiez que Google est bien activé dans Supabase
2. Vérifiez que Client ID et Secret sont corrects

### Erreur: "Access blocked: This app's request is invalid"

**Cause**: Écran de consentement mal configuré

**Solution**:

1. Retournez dans OAuth consent screen
2. Vérifiez que l'app est en status "Testing" ou "Published"
3. Ajoutez votre email dans "Test users"

---

## 📸 Screenshots Références

### Google Cloud Console

**Authorized redirect URIs** devrait ressembler à:

```
✓ http://localhost:5173
✓ https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
```

### Supabase Dashboard

**Google Provider** devrait montrer:

```
✓ Enable Sign in with Google: ON
✓ Client ID: [rempli]
✓ Client Secret: [rempli]
```

---

## 🎉 Une Fois Configuré

Les utilisateurs pourront:

- Se connecter avec Google
- S'inscrire avec Google
- Un profil sera automatiquement créé dans `profiles`
- L'email Google sera utilisé comme email principal

---

## 📝 Notes Importantes

1. **En Production**: Ajoutez votre domaine de production dans:

   - Google Cloud Console (Authorized origins et redirect URIs)
   - Remplacez `localhost:5173` par votre domaine

2. **Sécurité**: Ne partagez JAMAIS le Client Secret

3. **OAuth Consent Screen**:
   - En "Testing" = Limité aux test users
   - En "Production" = Accessible à tous (nécessite vérification Google)

---

## 🆘 Besoin d'Aide?

Si ça ne fonctionne toujours pas:

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Network"
3. Cliquez sur "Se connecter avec Google"
4. Regardez les erreurs dans les requêtes
5. Partagez les erreurs pour debug

---

_Guide créé le 29 décembre 2025_
