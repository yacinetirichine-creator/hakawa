"""
Middleware de sécurité pour Hakawa API
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import time
from collections import defaultdict
from datetime import datetime, timedelta
from app.utils.supabase import supabase_admin
import hashlib
import secrets

security = HTTPBearer()

# Rate limiting en mémoire (à remplacer par Redis en production)
rate_limit_store = defaultdict(list)

# Stockage des sessions actives
active_sessions = {}

# Blacklist de tokens révoqués
revoked_tokens = set()


class SecurityMiddleware:
    """Middleware de sécurité centralisé"""

    @staticmethod
    def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
        """Hash un mot de passe avec bcrypt"""
        if not salt:
            salt = secrets.token_hex(16)

        pwd_hash = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000
        )
        return pwd_hash.hex(), salt

    @staticmethod
    def verify_password(password: str, pwd_hash: str, salt: str) -> bool:
        """Vérifie un mot de passe"""
        new_hash, _ = SecurityMiddleware.hash_password(password, salt)
        return new_hash == pwd_hash

    @staticmethod
    async def verify_token(token: str) -> dict:
        """Vérifie un token JWT Supabase"""
        if token in revoked_tokens:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token révoqué"
            )

        try:
            user = supabase_admin.auth.get_user(token)
            return user
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide"
            )

    @staticmethod
    def rate_limit(
        identifier: str, max_requests: int = 100, window_seconds: int = 60
    ) -> bool:
        """
        Rate limiting simple

        Args:
            identifier: IP ou user_id
            max_requests: Nombre max de requêtes
            window_seconds: Fenêtre de temps en secondes

        Returns:
            True si autorisé, False si limite dépassée
        """
        now = time.time()
        window_start = now - window_seconds

        # Nettoyer les anciennes requêtes
        rate_limit_store[identifier] = [
            req_time
            for req_time in rate_limit_store[identifier]
            if req_time > window_start
        ]

        # Vérifier la limite
        if len(rate_limit_store[identifier]) >= max_requests:
            return False

        # Ajouter la requête actuelle
        rate_limit_store[identifier].append(now)
        return True

    @staticmethod
    def sanitize_input(data: str) -> str:
        """Nettoie les entrées utilisateur pour prévenir les injections"""
        # Supprimer les caractères dangereux
        dangerous_chars = ["<", ">", '"', "'", "&", ";", "|", "`"]
        for char in dangerous_chars:
            data = data.replace(char, "")
        return data.strip()

    @staticmethod
    def validate_content(content: str, max_length: int = 50000) -> str:
        """Valide le contenu texte"""
        if len(content) > max_length:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Contenu trop long (max {max_length} caractères)",
            )
        return SecurityMiddleware.sanitize_input(content)


async def require_auth(credentials: HTTPAuthorizationCredentials = security):
    """Dependency pour vérifier l'authentification"""
    token = credentials.credentials
    user = await SecurityMiddleware.verify_token(token)
    return user


async def require_admin(credentials: HTTPAuthorizationCredentials = security):
    """Dependency pour vérifier les droits admin"""
    user = await require_auth(credentials)

    # Vérifier si l'utilisateur est admin
    profile = (
        supabase_admin.table("profiles").select("is_admin").eq("id", user.id).execute()
    )

    if not profile.data or not profile.data[0].get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Accès administrateur requis"
        )

    return user


async def check_rate_limit(request: Request):
    """Middleware de rate limiting"""
    # Utiliser l'IP comme identifiant
    client_ip = request.client.host

    # Limites différentes selon l'endpoint
    if "/api/generation" in str(request.url):
        max_requests = 10  # 10 générations par minute
        window = 60
    elif "/api/images" in str(request.url):
        max_requests = 5  # 5 images par minute
        window = 60
    else:
        max_requests = 100  # 100 requêtes par minute
        window = 60

    if not SecurityMiddleware.rate_limit(client_ip, max_requests, window):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Trop de requêtes. Veuillez réessayer plus tard.",
        )


def log_security_event(user_id: str, event_type: str, details: dict):
    """Enregistre un événement de sécurité"""
    try:
        supabase_admin.table("audit_logs").insert(
            {
                "user_id": user_id,
                "action": event_type,
                "metadata": details,
                "created_at": datetime.utcnow().isoformat(),
            }
        ).execute()
    except Exception as e:
        print(f"Error logging security event: {e}")


# Headers de sécurité
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}
