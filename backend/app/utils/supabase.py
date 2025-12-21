"""
Supabase client utility
"""

from supabase import create_client, Client
from app.config import settings

# Create Supabase client
supabase: Client = create_client(settings.supabase_url, settings.supabase_anon_key)

# Create admin client (for server-side operations)
supabase_admin: Client = create_client(
    settings.supabase_url, settings.supabase_service_key
)
