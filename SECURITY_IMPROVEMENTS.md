# Guide de Sécurité Avancée - Recommandations Production

## 🔐 Améliorations Sécurité Prioritaires

### 1. GESTION DES SECRETS (CRITIQUE)

#### ❌ Problème Actuel

Les clés API sont en variables d'environnement (risque d'exposition)

#### ✅ Solutions Recommandées

**Option A : AWS Secrets Manager** (Recommandé)

```python
# backend/app/utils/secrets.py
import boto3
from botocore.exceptions import ClientError

def get_secret(secret_name):
    """Récupère un secret depuis AWS Secrets Manager"""
    client = boto3.client('secretsmanager', region_name='eu-west-1')

    try:
        response = client.get_secret_value(SecretId=secret_name)
        return response['SecretString']
    except ClientError as e:
        raise Exception(f"Erreur récupération secret: {e}")

# Utilisation
ANTHROPIC_API_KEY = get_secret("prod/hakawa/anthropic_key")
```

**Option B : HashiCorp Vault** (Pour infrastructure complexe)
**Option C : Supabase Vault** (Déjà intégré)

#### Actions Immédiates

1. Migrer toutes les clés API vers un gestionnaire de secrets
2. Activer la rotation automatique des clés (30-90 jours)
3. Séparer strictement dev/staging/prod
4. Ne JAMAIS commiter de fichiers `.env`

---

### 2. RATE LIMITING EN PRODUCTION

#### ❌ Problème Actuel

```python
# Rate limiting en mémoire (perdu au redémarrage)
rate_limit_store = defaultdict(list)
```

#### ✅ Solution : Redis

**Installation**

```bash
pip install redis
```

**Implémentation**

```python
# backend/app/utils/redis_rate_limiter.py
import redis
import time
from typing import Optional

class RedisRateLimiter:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)

    def check_rate_limit(
        self,
        identifier: str,
        max_requests: int = 100,
        window_seconds: int = 60
    ) -> bool:
        """
        Rate limiting avec Redis

        Returns:
            True si autorisé, False si limite atteinte
        """
        key = f"rate_limit:{identifier}"
        current = int(time.time())

        # Nettoyer les anciennes requêtes
        self.redis.zremrangebyscore(key, 0, current - window_seconds)

        # Compter les requêtes actuelles
        count = self.redis.zcard(key)

        if count >= max_requests:
            return False

        # Ajouter la requête actuelle
        self.redis.zadd(key, {current: current})
        self.redis.expire(key, window_seconds)

        return True

# Usage dans main.py
from app.utils.redis_rate_limiter import RedisRateLimiter

rate_limiter = RedisRateLimiter(settings.redis_url)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host

    if not rate_limiter.check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Trop de requêtes"
        )

    return await call_next(request)
```

**Configuration .env**

```bash
REDIS_URL=redis://localhost:6379
# Production: redis://redis.railway.internal:6379
```

---

### 3. MONITORING ET ALERTES

#### ✅ Intégration Sentry (Recommandé)

**Installation**

```bash
pip install sentry-sdk[fastapi]
```

**Configuration backend/app/main.py**

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

# Initialiser Sentry
sentry_sdk.init(
    dsn=settings.sentry_dsn,
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,  # 10% des transactions
    environment=settings.app_env,  # dev/staging/prod

    # Filtrer les données sensibles
    before_send=lambda event, hint: filter_sensitive_data(event)
)

def filter_sensitive_data(event):
    """Empêche l'envoi de données sensibles à Sentry"""
    # Supprimer headers sensibles
    if 'request' in event and 'headers' in event['request']:
        event['request']['headers'].pop('Authorization', None)
        event['request']['headers'].pop('Cookie', None)

    return event
```

**Alertes personnalisées**

```python
from app.utils.audit import AuditLogger, SecurityEvent

async def detect_suspicious_activity(user_id: str, action: str):
    """Détecte et alerte sur activité suspecte"""

    # Trop de tentatives échouées
    failed_attempts = await get_failed_login_count(user_id)

    if failed_attempts > 5:
        # Logger dans audit
        await AuditLogger.log_security_event(
            event_type=SecurityEvent.BRUTE_FORCE,
            severity=Severity.HIGH,
            user_id=user_id
        )

        # Alerter dans Sentry
        sentry_sdk.capture_message(
            f"Tentative de force brute détectée: {user_id}",
            level="warning"
        )

        # Bloquer temporairement
        await block_user_temporarily(user_id, minutes=15)
```

---

### 4. PROTECTION DDOS

#### ✅ Cloudflare (Recommandé)

**Configuration DNS**

1. Créer compte Cloudflare
2. Pointer le DNS vers Cloudflare
3. Activer proxy orange (protection DDOS)

**Règles de sécurité**

```
Firewall Rules:
- Bloquer pays à risque
- Rate limiting global (10,000 req/min)
- Challenge si score menace > 14
- Bloquer User-Agents suspects
```

**WAF (Web Application Firewall)**

- Protection OWASP Top 10
- Blocage injections SQL
- Protection XSS
- Détection bots malveillants

---

### 5. BACKUP ET DISASTER RECOVERY

#### ✅ Stratégie de Backup

**Supabase (Base de données)**

```bash
# Backup automatique quotidien
# Point-in-time recovery (7 jours)
# Configurer dans Dashboard Supabase:
# Settings > Database > Point-in-time Recovery
```

**Exports chiffrés**

```python
# backend/app/utils/backup.py
from app.utils.encryption import get_encryption_service
import boto3

async def backup_to_s3(data: dict, backup_name: str):
    """Backup chiffré vers S3"""

    # Chiffrer les données
    encryption = get_encryption_service()
    encrypted_data = encryption.encrypt(json.dumps(data))

    # Upload vers S3
    s3 = boto3.client('s3')
    s3.put_object(
        Bucket='hakawa-backups',
        Key=f'backups/{backup_name}.enc',
        Body=encrypted_data,
        ServerSideEncryption='AES256'
    )
```

**Rotation des backups**

- Quotidien : 7 jours
- Hebdomadaire : 4 semaines
- Mensuel : 12 mois

---

### 6. HEADERS DE SÉCURITÉ RENFORCÉS

#### ✅ Améliorer les headers actuels

```python
# backend/app/utils/security.py
SECURITY_HEADERS = {
    # Existant
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    # NOUVEAUX (CSP renforcé)
    "Content-Security-Policy": (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "img-src 'self' data: https:; "
        "font-src 'self' https://fonts.gstatic.com; "
        "connect-src 'self' https://*.supabase.co https://api.anthropic.com; "
        "frame-ancestors 'none'; "
        "base-uri 'self'; "
        "form-action 'self';"
    ),

    # Permissions restrictives
    "Permissions-Policy": (
        "geolocation=(), "
        "microphone=(), "
        "camera=(), "
        "payment=(), "
        "usb=(), "
        "magnetometer=(), "
        "gyroscope=(), "
        "accelerometer=()"
    ),

    # Referrer strict
    "Referrer-Policy": "strict-origin-when-cross-origin",

    # Nouveaux headers 2024
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
}
```

---

### 7. AUDIT LOGS - OPTIMISATION

#### ✅ Archivage et analyse

```python
# backend/app/utils/audit_analyzer.py
from datetime import datetime, timedelta

class AuditAnalyzer:
    """Analyse les logs d'audit pour détecter les anomalies"""

    @staticmethod
    async def detect_anomalies():
        """Détecte les comportements anormaux"""

        # Tentatives de login échouées
        failed_logins = await supabase.table("audit_logs").select("*").eq(
            "action", "LOGIN_FAILED"
        ).gte("created_at", datetime.now() - timedelta(hours=1)).execute()

        # Grouper par IP
        ip_counts = {}
        for log in failed_logins.data:
            ip = log['ip_address']
            ip_counts[ip] = ip_counts.get(ip, 0) + 1

        # Alerter si > 10 tentatives
        for ip, count in ip_counts.items():
            if count > 10:
                await alert_suspicious_ip(ip, count)

    @staticmethod
    async def generate_security_report():
        """Génère un rapport de sécurité quotidien"""
        report = {
            "date": datetime.now().isoformat(),
            "total_events": 0,
            "security_events": [],
            "top_users": [],
            "suspicious_ips": []
        }

        # Envoyer par email aux admins
        await send_security_report(report)
```

---

### 8. VALIDATION INPUT RENFORCÉE

#### ✅ Ajouter validation stricte

```python
# backend/app/utils/input_validation.py
from pydantic import BaseModel, validator, Field
import re

class StrictInput(BaseModel):
    """Validation stricte des entrées utilisateur"""

    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., max_length=50000)

    @validator('title', 'content')
    def sanitize_input(cls, v):
        """Nettoie et valide les entrées"""

        # Supprimer caractères dangereux
        dangerous_patterns = [
            r'<script',
            r'javascript:',
            r'onerror=',
            r'onclick=',
            r'<iframe',
            r'eval\(',
            r'expression\(',
        ]

        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError("Contenu non autorisé détecté")

        # Limiter caractères spéciaux
        if re.search(r'[\x00-\x08\x0B\x0C\x0E-\x1F]', v):
            raise ValueError("Caractères de contrôle non autorisés")

        return v.strip()
```

---

## 📊 Checklist Déploiement Production

### Avant le Lancement

- [ ] Migrer secrets vers AWS Secrets Manager / Vault
- [ ] Implémenter Redis pour rate limiting
- [ ] Configurer Sentry avec alertes
- [ ] Activer Cloudflare avec DDOS protection
- [ ] Configurer backups automatiques Supabase
- [ ] Créer backups S3 chiffrés
- [ ] Renforcer CSP headers
- [ ] Tester disaster recovery
- [ ] Audit de sécurité externe (PenTest)
- [ ] Configurer monitoring (Grafana/Prometheus)

### Monitoring Continu

- [ ] Tableau de bord Sentry (erreurs temps réel)
- [ ] Alertes Slack/Email pour événements critiques
- [ ] Logs centralisés (CloudWatch / DataDog)
- [ ] Scan vulnérabilités hebdomadaire (Snyk)
- [ ] Rotation clés API mensuelle
- [ ] Revue logs audit quotidienne
- [ ] Tests de pénétration trimestriels

---

## 🎯 Score Sécurité Cible

**Actuel** : 9.5/10 ⭐⭐⭐⭐⭐

**Avec ces améliorations** : 9.8/10 ⭐⭐⭐⭐⭐

### Différence

- ✅ Secrets management professionnel
- ✅ Rate limiting distribué (Redis)
- ✅ Monitoring temps réel
- ✅ Protection DDOS enterprise
- ✅ Disaster recovery testé

---

**Note** : Ces améliorations nécessitent des services tiers (coûts) :

- Redis : ~10€/mois (Railway/Render)
- Sentry : Gratuit jusqu'à 5k events/mois
- Cloudflare : Gratuit (Pro à 20$/mois recommandé)
- AWS S3 : ~5€/mois pour backups

**Total estimé** : ~25-35€/mois pour sécurité entreprise
