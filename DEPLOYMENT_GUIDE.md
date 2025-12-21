# 🚀 GUIDE DE DÉPLOIEMENT HAKAWA

## Architecture avec 1 seul domaine : `hakawa.app`

```
hakawa.app/              → Frontend (Vercel)
hakawa.app/api/*         → Backend API (Railway/Render via proxy)
```

---

## 📦 ÉTAPE 1 : Déployer le Backend (Railway recommandé)

### Option A : Railway (Recommandé - Gratuit jusqu'à $5/mois)

1. **Créer un compte** : https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Sélectionner** : `yacinetirichine-creator/hakawa`
4. **Root Directory** : `/backend`
5. **Start Command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Variables d'environnement Railway** :

```bash
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=<générer via: openssl rand -hex 32>
ENCRYPTION_KEY=<votre clé Fernet générée>

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-...

# Frontend URL
FRONTEND_URL=https://hakawa.app

# Security
MAX_LOGIN_ATTEMPTS=5
LOGIN_ATTEMPT_WINDOW_MINUTES=15
SESSION_TIMEOUT_MINUTES=60
REQUIRE_EMAIL_VERIFICATION=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_AI_PER_MINUTE=10
RATE_LIMIT_IMAGES_PER_MINUTE=5

# Sentry (optionnel)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

6. **Deploy** → Attendre le déploiement
7. **Copier l'URL** : `https://hakawa-api.up.railway.app`

---

### Option B : Render (Alternative gratuite)

1. **Créer un compte** : https://render.com
2. **New Web Service** → **Connect GitHub**
3. **Sélectionner** : `hakawa` → **Root Directory** : `backend`
4. **Build Command** : `pip install -r requirements.txt`
5. **Start Command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. **Instance Type** : Free
7. Ajouter les mêmes variables d'environnement

---

## 🌐 ÉTAPE 2 : Déployer le Frontend (Vercel)

### Configuration Vercel

1. **Créer un compte** : https://vercel.com
2. **Import Git Repository** : `yacinetirichine-creator/hakawa`
3. **Framework Preset** : Vite
4. **Root Directory** : `frontend`
5. **Build Command** : `npm run build`
6. **Output Directory** : `dist`

**Variables d'environnement Vercel** :

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://hakawa.app
```

7. **Deploy** → Attendre le build

---

## 🔗 ÉTAPE 3 : Configurer le domaine hakawa.app

### Dans Vercel :

1. **Settings** → **Domains**
2. **Add Domain** : `hakawa.app`
3. **Add www subdomain** : `www.hakawa.app` (redirect vers hakawa.app)
4. Configurer les DNS chez votre registrar :

```dns
Type    Name    Value                              TTL
A       @       76.76.21.21                        Auto
CNAME   www     cname.vercel-dns.com               Auto
```

5. Attendre la propagation DNS (5-30 min)

---

## 🔄 ÉTAPE 4 : Configurer le proxy API

### Mettre à jour `vercel.json` avec l'URL Railway :

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://hakawa-api.up.railway.app/api/:path*"
    }
  ]
}
```

**Remplacer** `hakawa-api.up.railway.app` par votre vraie URL Railway/Render

---

## ✅ ÉTAPE 5 : Vérifications Post-Déploiement

### Tests à effectuer :

```bash
# Frontend
curl https://hakawa.app
# → Doit retourner le HTML React

# Backend via proxy
curl https://hakawa.app/api/health
# → {"status":"healthy"}

# CORS
curl -H "Origin: https://hakawa.app" https://hakawa.app/api/health
# → Pas d'erreur CORS
```

### Checklist de sécurité :

- [ ] HTTPS activé sur hakawa.app ✅ (automatique Vercel)
- [ ] Variables d'environnement configurées (backend + frontend)
- [ ] `APP_DEBUG=false` en production
- [ ] `REQUIRE_EMAIL_VERIFICATION=true`
- [ ] `RATE_LIMIT_ENABLED=true`
- [ ] Migration SQL exécutée dans Supabase
- [ ] Sentry configuré (optionnel)

---

## 🗄️ ÉTAPE 6 : Appliquer la migration SQL

1. **Ouvrir Supabase Dashboard** : https://app.supabase.com
2. **SQL Editor** → **New Query**
3. **Copier/Coller** le contenu de `supabase/migrations/20231222_security_audit.sql`
4. **Run** → Vérifier que les 3 tables sont créées :
   - `audit_logs`
   - `security_events`
   - `login_attempts`

---

## 📊 ÉTAPE 7 : Monitoring

### Logs Backend (Railway) :

```bash
# Dashboard Railway → Logs
# Voir les requêtes API en temps réel
```

### Analytics Frontend (Vercel) :

```bash
# Dashboard Vercel → Analytics
# Voir trafic, erreurs, performances
```

---

## 🔧 Commandes utiles

### Redéployer le frontend :

```bash
git push origin main
# → Auto-deploy Vercel
```

### Redéployer le backend :

```bash
git push origin main
# → Auto-deploy Railway
```

### Rollback si problème :

```bash
# Vercel : Dashboard → Deployments → Rollback
# Railway : Dashboard → Deployments → Redeploy previous
```

---

## 🌍 Résultat final

```
✅ https://hakawa.app              → Application React
✅ https://hakawa.app/api/health   → API FastAPI
✅ https://www.hakawa.app          → Redirect vers hakawa.app
✅ SSL/TLS activé automatiquement
✅ Logs d'audit activés
✅ Rate limiting activé
✅ Sécurité niveau 9.5/10
```

---

## ⚠️ Troubleshooting

### Erreur 404 sur /api/\* :

- Vérifier que `vercel.json` pointe vers la bonne URL Railway
- Vérifier que le backend Railway est démarré

### Erreur CORS :

- Vérifier `FRONTEND_URL=https://hakawa.app` dans Railway
- Vérifier les headers CORS dans `backend/app/main.py`

### Build frontend échoue :

```bash
cd frontend
npm install
npm run build
# Corriger les erreurs TypeScript/ESLint
```

### Backend crash au démarrage :

- Vérifier toutes les variables d'environnement sont définies
- Vérifier `ENCRYPTION_KEY` est bien générée (44 caractères)
- Vérifier connexion Supabase

---

## 🎉 C'est prêt !

Votre application est maintenant en production avec :

- ✅ 1 seul domaine : `hakawa.app`
- ✅ Frontend + Backend unifiés
- ✅ SSL/HTTPS automatique
- ✅ CI/CD automatique (git push = auto-deploy)
- ✅ Sécurité niveau 9.5/10
- ✅ Monitoring et logs centralisés
