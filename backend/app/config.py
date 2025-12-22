"""Configuration settings for Hakawa API."""

from __future__ import annotations

import secrets
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    model_config = SettingsConfigDict(
        case_sensitive=False,
        env_file=".env",
        env_file_encoding="utf-8",
    )

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

    # Stripe
    stripe_secret_key: Optional[str] = None
    stripe_publishable_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None

    # Stripe Price IDs (monthly)
    stripe_price_conteur_monthly: Optional[str] = None
    stripe_price_auteur_monthly: Optional[str] = None
    stripe_price_studio_monthly: Optional[str] = None

    # Stripe Price IDs (annual)
    stripe_price_conteur_annual: Optional[str] = None
    stripe_price_auteur_annual: Optional[str] = None
    stripe_price_studio_annual: Optional[str] = None

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

    # Rate limiting
    rate_limit_enabled: bool = True

    # Storage (optional)
    exports_local_dir: str = "./generated/exports"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        if not self.session_secret_key:
            self.session_secret_key = secrets.token_urlsafe(32)

        if not self.encryption_key:
            from cryptography.fernet import Fernet

            self.encryption_key = Fernet.generate_key().decode()

        if self.app_env == "production":
            self._validate_production_config()

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
        # Monitoring can be optional depending on deployment
        assert (
            self.require_email_verification
        ), "Email verification must be enabled in production"
        assert self.rate_limit_enabled, "Rate limiting must be enabled in production"


settings = Settings()
