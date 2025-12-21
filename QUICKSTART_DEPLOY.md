# 🚀 DÉPLOIEMENT RAPIDE HAKAWA

## ⚡ Guide Express (5 minutes)

### 1️⃣ Backend (Railway) - 2 min

```bash
# 1. Aller sur https://railway.app
# 2. "New Project" → "Deploy from GitHub"
# 3. Sélectionner : hakawa
# 4. Root Directory : /backend
# 5. Copier l'URL générée (ex: hakawa-production.up.railway.app)
```

**Variables d'environnement Railway** (onglet Variables) :

```
APP_ENV=production
APP_DEBUG=false
APP_SECRET_KEY=<openssl rand -hex 32>
ENCRYPTION_KEY=<votre clé Fernet>
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://hakawa.app
REQUIRE_EMAIL_VERIFICATION=true
RATE_LIMIT_ENABLED=true
```

---

### 2️⃣ Frontend (Vercel) - 2 min

```bash
# 1. Aller sur https://vercel.com
# 2. "Import Git Repository" → hakawa
# 3. Root Directory : frontend
# 4. Framework: Vite
# 5. Build Command : npm run build
# 6. Output Directory : dist
```

**Variables d'environnement Vercel** (onglet Environment Variables) :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://hakawa.app
```

---

### 3️⃣ Connecter le domaine - 1 min

**Dans Vercel** → Settings → Domains :

- Ajouter : `hakawa.app`
- Ajouter : `www.hakawa.app` (auto-redirect)

**Mettre à jour DNS** chez votre registrar :

```
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

---

### 4️⃣ Lier Frontend ↔ Backend

**Éditer `vercel.json`** et remplacer :

```json
"destination": "https://hakawa-api.railway.app/api/:path*"
```

Par votre vraie URL Railway (étape 1)

**Commit** :

```bash
git add vercel.json
git commit -m "chore: Configure Railway backend URL"
git push
```

→ Vercel va auto-redéployer avec la bonne route API

---

### 5️⃣ Appliquer migration SQL

1. **Supabase Dashboard** → SQL Editor
2. Copier/coller `supabase/migrations/20231222_security_audit.sql`
3. Run

---

## ✅ Vérifications

```bash
# Frontend
curl https://hakawa.app
# → HTML React ✅

# API via proxy
curl https://hakawa.app/api/health
# → {"status":"healthy"} ✅

# Backend direct
curl https://hakawa-production.up.railway.app/health
# → {"status":"healthy"} ✅
```

---

## 🎉 C'est prêt !

```
✅ https://hakawa.app              → Frontend React
✅ https://hakawa.app/api/*        → Backend FastAPI (proxied)
✅ SSL/HTTPS automatique
✅ CI/CD : git push = auto-deploy
✅ Sécurité 9.5/10
```

**Prochaines fois** : juste `git push` et tout se redéploie automatiquement ! 🚀
