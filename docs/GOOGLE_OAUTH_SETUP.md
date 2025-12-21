# 🔒 Configuration Google OAuth pour Supabase

## Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le **Project ID**

### 2. Activer l'API Google+

1. Dans Google Cloud Console, allez dans **APIs & Services** → **Library**
2. Recherchez "Google+ API"
3. Cliquez sur **Enable**

### 3. Créer les identifiants OAuth

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **OAuth client ID**
3. Si demandé, configurez l'écran de consentement OAuth :

   - Type d'application : **External**
   - Nom de l'application : **Hakawa**
   - Email d'assistance : votre email
   - Logo : (optionnel)
   - Domaines autorisés : `hakawa.com` (ou votre domaine)
   - Portées : email, profile, openid

4. Type d'application : **Web application**
5. Nom : **Hakawa Web**

### 4. Configurer les URLs de redirection

**Important** : Ajoutez ces URLs de redirection autorisées :

#### Pour le développement local :

```
http://localhost:5173
http://localhost:3000
```

#### Pour Supabase :

```
https://gmqmrrkmdtfbftstyiju.supabase.co/auth/v1/callback
```

#### Pour production (quand vous aurez un domaine) :

```
https://votre-domaine.com
https://api.votre-domaine.com/auth/v1/callback
```

### 5. Récupérer les identifiants

Après création, vous obtiendrez :

- **Client ID** : `123456789-abc...xyz.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-...`

**CONSERVEZ-LES EN SÉCURITÉ !**

### 6. Configurer Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet Hakawa
3. Allez dans **Authentication** → **Providers**
4. Activez **Google**
5. Entrez :
   - **Client ID** : (copié de Google Cloud)
   - **Client Secret** : (copié de Google Cloud)
6. Cliquez sur **Save**

### 7. Tester l'authentification

Le code frontend est déjà configuré dans :

- `/frontend/src/pages/Login.jsx`
- `/frontend/src/pages/Register.jsx`
- `/frontend/src/contexts/AuthContext.jsx`

La fonction `signInWithGoogle()` redirigera automatiquement vers Google.

### 8. Variables d'environnement

Aucune variable supplémentaire n'est nécessaire dans le frontend, tout est géré par Supabase.

Pour le backend, si vous voulez valider les tokens Google :

```bash
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
```

## Sécurité

✅ **Déjà implémenté** :

- CORS configuré
- Rate limiting
- Validation des tokens
- Protection CSRF
- Headers de sécurité
- Row Level Security (RLS) dans Supabase

## En production

Avant de déployer en production :

1. Changez le type d'application OAuth en "Internal" si vous êtes sur Google Workspace
2. Vérifiez les URLs de redirection
3. Activez les logs d'audit
4. Configurez un domaine personnalisé pour Supabase
5. Ajoutez une politique de confidentialité et des conditions d'utilisation

## Support

Si vous rencontrez des problèmes :

- Vérifiez les logs dans Supabase Dashboard → Logs
- Vérifiez la console développeur du navigateur
- Assurez-vous que les URLs de redirection sont exactement les mêmes
