# 🔐 GUIDE DE SÉCURITÉ HAKAWA

## Vue d'ensemble

Hakawa implémente plusieurs couches de sécurité pour protéger les données des utilisateurs et prévenir les attaques courantes.

---

## 🛡️ Mesures de sécurité implémentées

### 1. Authentification et Autorisation

#### ✅ Supabase Auth

- **JWT tokens** sécurisés avec rotation automatique
- **OAuth 2.0** avec Google
- **Tokens de session** avec expiration
- **Refresh tokens** pour la persistance

#### ✅ Row Level Security (RLS)

```sql
-- Les utilisateurs ne peuvent accéder qu'à leurs propres données
CREATE POLICY "Users can CRUD own projects"
ON public.projects FOR ALL
USING (auth.uid() = user_id);
```

#### ✅ Protection des routes

- Routes protégées avec `ProtectedRoute` component
- Vérification des rôles admin
- Middleware de validation des tokens

### 2. Protection contre les attaques

#### ✅ Rate Limiting

```python
# 100 requêtes/minute par IP
# 10 générations IA/minute
# 5 images/minute
```

**Implémenté dans** : `/backend/app/utils/security.py`

#### ✅ CORS (Cross-Origin Resource Sharing)

```python
allow_origins=[
    "http://localhost:5173",
    "https://votre-domaine.com"
]
```

#### ✅ CSRF Protection

- Headers de sécurité
- Validation des tokens
- SameSite cookies

#### ✅ XSS Prevention

```python
# Sanitization des entrées
SecurityMiddleware.sanitize_input(data)

# Content Security Policy
"Content-Security-Policy": "default-src 'self'"
```

#### ✅ SQL Injection Prevention

- **Supabase** utilise des requêtes paramétrées
- **SQLAlchemy** ORM avec protection native
- Validation avec **Pydantic**

### 3. Headers de sécurité

```python
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000",
    "Content-Security-Policy": "default-src 'self'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
}
```

### 4. Validation des données

#### ✅ Validation des mots de passe

```python
# Minimum 8 caractères
# 1 majuscule
# 1 minuscule
# 1 chiffre
```

#### ✅ Validation des entrées

- **Pydantic schemas** pour toutes les APIs
- **Zod schemas** pour le frontend
- Limitation de taille des contenus

### 5. Audit et Logs

#### ✅ Table audit_logs

```sql
CREATE TABLE audit_logs (
    user_id UUID,
    action TEXT,
    metadata JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ
);
```

**Actions trackées** :

- Connexions/déconnexions
- Modifications de profil
- Créations/suppressions de projets
- Générations IA
- Exports

### 6. Protection des données sensibles

#### ✅ Chiffrement

- **Passwords** : hachés avec bcrypt (via Supabase)
- **API Keys** : stockées en variables d'environnement
- **Tokens** : JWT avec expiration

#### ✅ Anonymisation

```sql
-- Fonction pour anonymiser un utilisateur supprimé
CREATE FUNCTION anonymize_user_data(user_id)
```

#### ✅ Variables d'environnement

```bash
# ❌ JAMAIS commitées dans Git
backend/.env
frontend/.env

# ✅ Templates sans clés
backend/.env.example
frontend/.env.example
```

---

## 🚨 Bonnes pratiques

### Pour les développeurs

1. **Ne jamais committer de secrets**

   ```bash
   # Vérifier avant chaque commit
   git diff --cached
   ```

2. **Toujours valider les entrées utilisateur**

   ```python
   # Backend
   from pydantic import BaseModel, validator

   # Frontend
   import { z } from 'zod'
   ```

3. **Utiliser HTTPS en production**

   ```nginx
   # Force HTTPS
   server {
       listen 80;
       return 301 https://$host$request_uri;
   }
   ```

4. **Limiter les permissions**
   ```sql
   -- Ne donner que les permissions nécessaires
   GRANT SELECT, INSERT ON projects TO authenticated;
   ```

### Pour les administrateurs

1. **Activer 2FA sur tous les comptes admin**
2. **Surveiller les logs régulièrement**
3. **Faire des backups quotidiens**
4. **Mettre à jour les dépendances**
   ```bash
   npm audit fix
   pip install -U -r requirements.txt
   ```

---

## 🔍 Tests de sécurité

### Tests à effectuer régulièrement

1. **Scan de vulnérabilités**

   ```bash
   npm audit
   pip-audit
   ```

2. **Test des endpoints**

   - Essayer d'accéder aux données d'autres users
   - Tester le rate limiting
   - Vérifier les CORS

3. **Validation des tokens**
   - Token expiré
   - Token invalide
   - Token révoqué

---

## 🆘 En cas d'incident de sécurité

### Procédure d'urgence

1. **Identifier l'incident**

   - Consulter les logs (`audit_logs`)
   - Identifier les comptes compromis

2. **Contenir la menace**

   ```sql
   -- Révoquer tous les tokens d'un utilisateur
   UPDATE auth.users SET refresh_token = NULL WHERE id = 'user_id';

   -- Bloquer un utilisateur
   UPDATE profiles SET is_banned = TRUE WHERE id = 'user_id';
   ```

3. **Notifier les utilisateurs concernés**

   - Email de sécurité
   - Demande de changement de mot de passe

4. **Corriger la faille**

   - Patch de sécurité
   - Mise à jour des dépendances
   - Renforcement des contrôles

5. **Post-mortem**
   - Documenter l'incident
   - Améliorer les procédures

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/managing-user-data)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Activer HTTPS
- [ ] Configurer les CORS correctement
- [ ] Limiter les origins autorisés
- [ ] Activer tous les headers de sécurité
- [ ] Configurer le rate limiting
- [ ] Mettre en place les backups
- [ ] Activer les logs d'audit
- [ ] Tester toutes les routes protégées
- [ ] Vérifier les permissions Supabase RLS
- [ ] Configurer un WAF (Web Application Firewall)
- [ ] Mettre en place un système de monitoring
- [ ] Préparer un plan de réponse aux incidents
