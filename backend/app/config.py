"""
Configuration settings for Hakawa API
"""

from pydantic_settings import BaseSettings
from typing import Optional


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

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
