# 🔐 CHECKLIST DE SÉCURITÉ - AVANT PRODUCTION

## ✅ Configuration Backend

- [ ] **Variables d'environnement**

  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=False`
  - [ ] `APP_SECRET_KEY` (>= 32 caractères aléatoires)
  - [ ] `SESSION_SECRET_KEY` généré automatiquement
  - [ ] Aucune clé API en dur dans le code

- [ ] **CORS**

  - [ ] `FRONTEND_URL` pointe vers le domaine de production (HTTPS)
  - [ ] Retirer `localhost` des origines autorisées

- [ ] **Rate Limiting**

  - [ ] Migrer vers Redis (actuellement en mémoire)
  - [ ] Configurer les limites par IP et par utilisateur

- [ ] **Monitoring**
  - [ ] `SENTRY_DSN` configuré
  - [ ] Logs d'erreurs activés
  - [ ] Alertes configurées

---

## ✅ Base de Données

- [ ] **Supabase**

  - [ ] RLS activé sur toutes les tables
  - [ ] Policies testées et validées
  - [ ] Backups automatiques configurés
  - [ ] Aucune clé `service_key` exposée côté frontend

- [ ] **Migrations**

  - [ ] Toutes les migrations appliquées
  - [ ] `audit_logs` table créée
  - [ ] `rate_limits` table créée
  - [ ] Fonctions `anonymize_user_data()` et `check_rate_limit()` créées

- [ ] **Audit**
  - [ ] Politique de rétention des logs (1 an)
  - [ ] CRON job pour nettoyer les vieux logs

---

## ✅ Authentification

- [ ] **Supabase Auth**

  - [ ] JWT rotation activée
  - [ ] Refresh tokens configurés
  - [ ] Email confirmation activée
  - [ ] Rate limiting sur les tentatives de connexion

- [ ] **Mots de passe**

  - [ ] Validation : min. 8 caractères, 1 majuscule, 1 chiffre
  - [ ] Stockage sécurisé (géré par Supabase)
  - [ ] Politique de reset password

- [ ] **OAuth**
  - [ ] Google OAuth configuré
  - [ ] Callback URLs en HTTPS
  - [ ] Scopes minimaux

---

## ✅ HTTPS/TLS

- [ ] **Certificat SSL**

  - [ ] Certificat valide (Let's Encrypt ou autre)
  - [ ] Redirection HTTP → HTTPS
  - [ ] HSTS activé (`Strict-Transport-Security` header)
  - [ ] Score A+ sur [SSL Labs](https://www.ssllabs.com/ssltest/)

- [ ] **Headers de sécurité**
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Content-Security-Policy` configuré
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`

---

## ✅ Frontend

- [ ] **Build de production**

  - [ ] `npm run build` sans erreurs
  - [ ] Minification activée
  - [ ] Source maps désactivées en production

- [ ] **Variables d'environnement**

  - [ ] `VITE_SUPABASE_URL` (public)
  - [ ] `VITE_SUPABASE_ANON_KEY` (public, safe)
  - [ ] Aucune clé privée exposée

- [ ] **Cookies & Consentement**
  - [ ] Bannière RGPD affichée au premier accès
  - [ ] Choix granulaire des cookies
  - [ ] Stockage du consentement

---

## ✅ RGPD & Légal

- [ ] **Pages légales**

  - [ ] Politique de confidentialité accessible (`/privacy`)
  - [ ] CGU accessibles (`/terms`)
  - [ ] Mentions légales (si applicable)
  - [ ] Email de contact valide : `privacy@hakawa.com`

- [ ] **Droits utilisateurs**

  - [ ] Accès aux données (export JSON)
  - [ ] Rectification dans les paramètres
  - [ ] Suppression de compte + anonymisation
  - [ ] Portabilité des données

- [ ] **Consentement**
  - [ ] Cookies non essentiels désactivés par défaut
  - [ ] Possibilité de retirer le consentement
  - [ ] Logs du consentement

---

## ✅ Tests de Sécurité

- [ ] **Tests manuels**

  - [ ] Injection SQL : ❌ (testé avec `' OR 1=1--`)
  - [ ] XSS : ❌ (testé avec `<script>alert('XSS')</script>`)
  - [ ] CSRF : ❌ (testé avec fausse origine)
  - [ ] Rate limiting : ✅ (testé avec 100+ requêtes)

- [ ] **Scans automatiques**
  - [ ] `npm audit` (frontend)
  - [ ] `pip check` ou `safety` (backend)
  - [ ] OWASP ZAP scan
  - [ ] Lighthouse Security audit

---

## ✅ Déploiement

- [ ] **Infrastructure**

  - [ ] Serveur backend sécurisé (Fly.io, Railway, Heroku)
  - [ ] Frontend sur CDN (Vercel, Netlify)
  - [ ] Firewall configuré
  - [ ] DDoS protection (Cloudflare)

- [ ] **CI/CD**

  - [ ] Tests de sécurité dans la pipeline
  - [ ] Scan des dépendances (Dependabot, Snyk)
  - [ ] Secrets dans GitHub Secrets (pas en clair)

- [ ] **Monitoring**
  - [ ] Sentry configuré
  - [ ] Uptime monitoring (UptimeRobot, Pingdom)
  - [ ] Alertes sur les erreurs critiques

---

## ✅ Paiements (Stripe)

- [ ] **Configuration Stripe**

  - [ ] Mode production activé
  - [ ] Webhook secret configuré
  - [ ] HTTPS obligatoire pour les webhooks
  - [ ] Test des paiements en mode test

- [ ] **Sécurité**
  - [ ] Clés secrètes côté backend uniquement
  - [ ] Validation des webhooks
  - [ ] Logs des transactions

---

## ✅ Documentation

- [ ] **Interne**

  - [ ] README.md à jour
  - [ ] SECURITY_GUIDE.md complet
  - [ ] SECURITY_AUDIT.md créé
  - [ ] Procédure de déploiement documentée

- [ ] **Externe**
  - [ ] Politique de confidentialité publiée
  - [ ] CGU publiées
  - [ ] Centre d'aide (si applicable)

---

## ✅ Plan de réponse aux incidents

- [ ] **Préparation**

  - [ ] Contact d'urgence défini
  - [ ] Procédure de breach notification (72h RGPD)
  - [ ] Plan de rollback en cas de problème

- [ ] **Détection**

  - [ ] Alertes configurées (Sentry, logs)
  - [ ] Monitoring des anomalies

- [ ] **Réaction**
  - [ ] Procédure de désactivation d'urgence
  - [ ] Communication avec les utilisateurs
  - [ ] Rapport post-incident

---

## 📋 VALIDATION FINALE

### Avant de mettre en production :

1. ✅ Tous les items de cette checklist cochés
2. ✅ Tests de sécurité passés
3. ✅ Audit de code effectué
4. ✅ Backup de la base de données
5. ✅ Plan de rollback prêt

### Premier déploiement :

1. Déployer en **staging** d'abord
2. Tester intensivement (1 semaine min)
3. Pentest externe (optionnel mais recommandé)
4. Déployer en **production**
5. Monitorer 24h/24 les 48 premières heures

---

**Date de revue :** 21 décembre 2025  
**Prochaine revue :** Avant chaque déploiement majeur

---

## 🚨 URGENCE - CONTACT SÉCURITÉ

**Email :** security@hakawa.com  
**Plateforme de Bug Bounty :** (à configurer)

Pour signaler une vulnérabilité : **Responsible Disclosure Policy** disponible sur `/security`
