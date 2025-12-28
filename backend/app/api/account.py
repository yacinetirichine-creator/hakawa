"""
API endpoint pour la gestion des comptes utilisateurs
"""

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.utils.admin import get_user_profile
from app.utils.supabase import supabase

router = APIRouter(prefix="/api/account", tags=["account"])


class SubscriptionUpdate(BaseModel):
    tier: str
    payment_method: Optional[str] = None


class AccountDeletion(BaseModel):
    confirm: bool
    reason: Optional[str] = None


@router.get("/me")
async def get_my_account(profile=Depends(get_user_profile)):
    """
    Récupère les informations complètes du compte utilisateur
    """
    try:
        # Récupérer les projets
        projects = (
            supabase.table("projects")
            .select("*", count="exact")
            .eq("user_id", profile["id"])
            .execute()
        )

        # Récupérer les illustrations
        illustrations = (
            supabase.table("illustrations")
            .select("*", count="exact")
            .in_("project_id", [p["id"] for p in projects.data])
            .execute()
            if projects.data
            else None
        )

        # Récupérer les exports
        exports = (
            supabase.table("exports")
            .select("*", count="exact")
            .in_("project_id", [p["id"] for p in projects.data])
            .execute()
            if projects.data
            else None
        )

        return {
            "success": True,
            "profile": profile,
            "stats": {
                "projects_count": projects.count or 0,
                "illustrations_count": illustrations.count or 0 if illustrations else 0,
                "exports_count": exports.count or 0 if exports else 0,
                "credits_remaining": profile.get("credits_illustrations", 0),
            },
            "subscription": {
                "tier": profile.get("subscription_tier", "free"),
                "expires_at": profile.get("subscription_expires_at"),
                "is_active": profile.get("subscription_expires_at")
                and datetime.fromisoformat(
                    profile.get("subscription_expires_at").replace("Z", "+00:00")
                )
                > datetime.now(),
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération du compte: {str(e)}",
        )


@router.put("/subscription")
async def update_subscription(
    subscription: SubscriptionUpdate, profile=Depends(get_user_profile)
):
    """
    Met à jour l'abonnement de l'utilisateur

    Note: Pour une vraie mise à jour, passez par Stripe webhook
    Cette route est pour les upgrades/downgrades manuels ou tests
    """
    try:
        allowed_tiers = ["free", "creator", "author", "studio"]
        if subscription.tier not in allowed_tiers:
            raise HTTPException(
                status_code=400,
                detail=f"Tier invalide. Valeurs autorisées: {allowed_tiers}",
            )

        # Si downgrade vers free
        if subscription.tier == "free":
            update_data = {
                "subscription_tier": "free",
                "subscription_expires_at": None,
                "updated_at": datetime.now().isoformat(),
            }
        else:
            # Pour les autres tiers, on devrait normalement passer par Stripe
            # Ici c'est simplifié pour la démo
            raise HTTPException(
                status_code=400,
                detail="Pour upgrader votre abonnement, veuillez utiliser le système de paiement Stripe",
            )

        result = (
            supabase.table("profiles")
            .update(update_data)
            .eq("id", profile["id"])
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Profil introuvable")

        return {
            "success": True,
            "message": f"Abonnement mis à jour vers {subscription.tier}",
            "profile": result.data[0],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la mise à jour de l'abonnement: {str(e)}",
        )


@router.delete("/delete")
async def delete_my_account(
    deletion: AccountDeletion, profile=Depends(get_user_profile)
):
    """
    Supprime le compte utilisateur et toutes ses données

    ATTENTION: Cette action est irréversible !
    Tous les projets, illustrations, chapitres et exports seront supprimés.
    """
    try:
        if not deletion.confirm:
            raise HTTPException(
                status_code=400,
                detail="Vous devez confirmer la suppression en passant confirm=true",
            )

        user_id = profile["id"]

        # Log la raison (pour analytics)
        if deletion.reason:
            print(f"User {user_id} deleting account. Reason: {deletion.reason}")

        # 1. Supprimer les exports
        supabase.table("exports").delete().in_(
            "project_id",
            supabase.table("projects")
            .select("id")
            .eq("user_id", user_id)
            .execute()
            .data,
        ).execute()

        # 2. Supprimer les illustrations
        supabase.table("illustrations").delete().in_(
            "project_id",
            supabase.table("projects")
            .select("id")
            .eq("user_id", user_id)
            .execute()
            .data,
        ).execute()

        # 3. Supprimer les chapitres
        supabase.table("chapters").delete().in_(
            "project_id",
            supabase.table("projects")
            .select("id")
            .eq("user_id", user_id)
            .execute()
            .data,
        ).execute()

        # 4. Supprimer les conversations
        supabase.table("conversations").delete().eq("user_id", user_id).execute()

        # 5. Supprimer les projets
        supabase.table("projects").delete().eq("user_id", user_id).execute()

        # 6. Supprimer le profil
        supabase.table("profiles").delete().eq("id", user_id).execute()

        # 7. Supprimer l'utilisateur Auth (si possible)
        # Note: Cela nécessite les droits service_role, à faire côté admin

        return {
            "success": True,
            "message": "Votre compte a été supprimé avec succès. Nous sommes désolés de vous voir partir.",
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur lors de la suppression du compte: {str(e)}"
        )


@router.get("/export-data")
async def export_my_data(profile=Depends(get_user_profile)):
    """
    Export RGPD: Récupère toutes les données de l'utilisateur
    """
    try:
        user_id = profile["id"]

        # Récupérer toutes les données
        projects = (
            supabase.table("projects").select("*").eq("user_id", user_id).execute()
        )

        project_ids = [p["id"] for p in projects.data] if projects.data else []

        chapters = (
            supabase.table("chapters")
            .select("*")
            .in_("project_id", project_ids)
            .execute()
            if project_ids
            else None
        )
        illustrations = (
            supabase.table("illustrations")
            .select("*")
            .in_("project_id", project_ids)
            .execute()
            if project_ids
            else None
        )
        exports = (
            supabase.table("exports")
            .select("*")
            .in_("project_id", project_ids)
            .execute()
            if project_ids
            else None
        )
        conversations = (
            supabase.table("conversations").select("*").eq("user_id", user_id).execute()
        )

        return {
            "success": True,
            "message": "Export complet de vos données (RGPD)",
            "data": {
                "profile": profile,
                "projects": projects.data if projects.data else [],
                "chapters": chapters.data if chapters and chapters.data else [],
                "illustrations": (
                    illustrations.data if illustrations and illustrations.data else []
                ),
                "exports": exports.data if exports and exports.data else [],
                "conversations": conversations.data if conversations.data else [],
            },
            "exported_at": datetime.now().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur lors de l'export des données: {str(e)}"
        )
