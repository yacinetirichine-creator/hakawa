"""
Middleware et utilitaires pour la gestion des administrateurs
"""

from fastapi import HTTPException, Header, Depends
from typing import Optional
from app.utils.supabase import supabase


async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Récupère l'utilisateur actuel depuis le token JWT
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Token d'authentification manquant")

    try:
        # Extraire le token du header "Bearer {token}"
        token = authorization.replace("Bearer ", "")

        # Vérifier le token avec Supabase
        user_response = supabase.auth.get_user(token)

        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Token invalide")

        return user_response.user

    except Exception as e:
        raise HTTPException(
            status_code=401, detail=f"Authentification échouée: {str(e)}"
        )


async def get_user_profile(user=Depends(get_current_user)):
    """
    Récupère le profil complet de l'utilisateur depuis la table profiles
    """
    try:
        profile_response = (
            supabase.table("profiles").select("*").eq("id", user.id).execute()
        )

        if not profile_response.data or len(profile_response.data) == 0:
            raise HTTPException(
                status_code=404, detail="Profil utilisateur introuvable"
            )

        return profile_response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération du profil: {str(e)}",
        )


async def require_admin(profile=Depends(get_user_profile)):
    """
    Vérifie que l'utilisateur est administrateur
    Utilisez comme dépendance dans les routes qui nécessitent des droits admin

    Exemple:
        @router.get("/admin/stats", dependencies=[Depends(require_admin)])
        async def get_admin_stats():
            ...
    """
    if not profile.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="Accès refusé. Droits administrateur requis."
        )

    return profile


def is_admin_user(profile: dict) -> bool:
    """
    Vérifie si un profil a les droits administrateur

    Args:
        profile: Dictionnaire du profil utilisateur

    Returns:
        True si l'utilisateur est admin, False sinon
    """
    return profile.get("is_admin", False) == True


def has_unlimited_access(profile: dict) -> bool:
    """
    Vérifie si un utilisateur a un accès illimité
    (Admin OU subscription tier = studio avec date d'expiration lointaine)

    Args:
        profile: Dictionnaire du profil utilisateur

    Returns:
        True si accès illimité, False sinon
    """
    # Les admins ont toujours un accès illimité
    if is_admin_user(profile):
        return True

    # Vérifier le tier studio avec expiration très lointaine
    from datetime import datetime

    tier = profile.get("subscription_tier")
    expires_at = profile.get("subscription_expires_at")

    if tier == "studio" and expires_at:
        # Considérer comme illimité si l'expiration est après 2050
        expiry_date = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
        return expiry_date.year >= 2050

    return False


async def check_resource_limit(profile: dict, resource_type: str) -> bool:
    """
    Vérifie si l'utilisateur peut créer une nouvelle ressource
    Les admins bypassent toutes les limites

    Args:
        profile: Profil de l'utilisateur
        resource_type: Type de ressource ('project', 'illustration', 'export')

    Returns:
        True si la création est autorisée, False sinon
    """
    # Admin = pas de limites
    if is_admin_user(profile):
        return True

    tier = profile.get("subscription_tier", "free")
    user_id = profile.get("id")

    # Limites par tier
    limits = {
        "free": {"projects": 1, "illustrations": 10, "exports": 1},
        "conteur": {"projects": 5, "illustrations": 50, "exports": 10},
        "pro": {"projects": 20, "illustrations": 200, "exports": 50},
        "studio": {"projects": 999999, "illustrations": 999999, "exports": 999999},
    }

    tier_limits = limits.get(tier, limits["free"])

    if resource_type == "project":
        # Compter les projets existants
        projects_count = (
            supabase.table("projects")
            .select("id", count="exact")
            .eq("user_id", user_id)
            .execute()
        )
        return projects_count.count < tier_limits["projects"]

    elif resource_type == "illustration":
        # Vérifier les crédits
        credits = profile.get("credits_illustrations", 0)
        return credits > 0

    elif resource_type == "export":
        # Pour l'instant, toujours autoriser (à implémenter selon vos règles)
        return True

    return False


async def get_admin_profile(profile=Depends(require_admin)):
    """
    Shortcut pour récupérer le profil d'un admin vérifié
    """
    return profile
