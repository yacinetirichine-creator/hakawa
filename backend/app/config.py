"""
Configuration settings for Hakawa API
"""

from pydantic_settings import BaseSettings
from typing import Optional
import secrets
import os


class Settings(BaseSettings):
    """Application settings"""

    # Application
    app_name: str = "Hakawa API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    app_debug: bool = True
    app_secret_key: str

    # Frontend URL (for CORS)
    frontend_url: str = "http://localhost:5173"

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str

    # AI Services
    anthropic_api_key: str
    replicate_api_token: str

    # Stripe (optional for now)
    stripe_secret_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    stripe_price_conteur: Optional[str] = None
    stripe_price_pro: Optional[str] = None
    stripe_price_studio: Optional[str] = None

    # Monitoring (optional)
    sentry_dsn: Optional[str] = None

    # Security
    session_secret_key: Optional[str] = None
    password_min_length: int = 8
    token_expiry_hours: int = 24
    encryption_key: Optional[str] = None
    max_login_attempts: int = 5
    login_attempt_window_minutes: int = 15
    session_timeout_minutes: int = 60
    require_email_verification: bool = True
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Generate session secret if not provided
        if not self.session_secret_key:
            self.session_secret_key = secrets.token_urlsafe(32)
        
        # Generate encryption key if not provided
        if not self.encryption_key:
            from cryptography.fernet import Fernet
            self.encryption_key = Fernet.generate_key().decode()

        # Security validation in production
        if self.app_env == "production":
            self._validate_production_config()
        case_sensitive = False

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Generate session secret if not provided
        if not self.session_secret_key:
            self.session_secret_key = secrets.token_urlsafe(32)
    def _validate_production_config(self):
        """Validate critical settings for production"""
        assert not self.app_debug, "DEBUG must be False in production"
        assert (
            self.app_secret_key and len(self.app_secret_key) >= 32
        ), "SECRET_KEY must be strong"
        assert (
            self.encryption_key and len(self.encryption_key) >= 32
        ), "ENCRYPTION_KEY must be strong"
        assert self.frontend_url.startswith(
            "https://"
        ), "Frontend URL must use HTTPS in production"
        assert self.sentry_dsn, "Sentry DSN required for production monitoring"
        assert self.require_email_verification, "Email verification must be enabled in production"
        assert self.rate_limit_enabled, "Rate limiting must be enabled in production"
        ), "SECRET_KEY must be strong"
        assert self.frontend_url.startswith(
            "https://"
        ), "Frontend URL must use HTTPS in production"
        assert self.sentry_dsn, "Sentry DSN required for production monitoring"


settings = Settings()
