"""
API endpoint pour les statistiques et métriques admin
"""

from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from typing import Optional
from app.utils.admin import get_user_profile, require_admin
from app.utils.supabase import supabase

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/metrics", dependencies=[Depends(require_admin)])
async def get_admin_metrics(
    days: Optional[int] = 30, profile=Depends(get_user_profile)
):
    """
    Récupère les métriques globales pour l'admin

    Args:
        days: Nombre de jours pour les statistiques (défaut: 30)

    Returns:
        Dictionnaire avec toutes les métriques
    """
    try:
        # Calculer la date de début
        start_date = (datetime.now() - timedelta(days=days)).isoformat()

        # 1. Statistiques des utilisateurs
        users_total = (
            supabase.table("profiles").select("*", count="exact", head=True).execute()
        )
        users_new = (
            supabase.table("profiles")
            .select("*", count="exact", head=True)
            .gte("created_at", start_date)
            .execute()
        )

        # Par tier
        users_by_tier = {}
        for tier in ["free", "creator", "author", "studio"]:
            count = (
                supabase.table("profiles")
                .select("*", count="exact", head=True)
                .eq("subscription_tier", tier)
                .execute()
            )
            users_by_tier[tier] = count.count or 0

        # 2. Statistiques des projets
        projects_total = (
            supabase.table("projects").select("*", count="exact", head=True).execute()
        )
        projects_new = (
            supabase.table("projects")
            .select("*", count="exact", head=True)
            .gte("created_at", start_date)
            .execute()
        )

        # Par statut
        projects_by_status = {}
        for status in ["draft", "in_progress", "completed"]:
            count = (
                supabase.table("projects")
                .select("*", count="exact", head=True)
                .eq("status", status)
                .execute()
            )
            projects_by_status[status] = count.count or 0

        # 3. Statistiques des illustrations
        illustrations_total = (
            supabase.table("illustrations")
            .select("*", count="exact", head=True)
            .execute()
        )
        illustrations_new = (
            supabase.table("illustrations")
            .select("*", count="exact", head=True)
            .gte("created_at", start_date)
            .execute()
        )

        # Par style
        illustrations_by_style = {}
        styles = ["manga", "realistic", "comic", "watercolor", "oil_painting"]
        for style in styles:
            count = (
                supabase.table("illustrations")
                .select("*", count="exact", head=True)
                .eq("style", style)
                .execute()
            )
            illustrations_by_style[style] = count.count or 0

        # 4. Statistiques des exports
        exports_total = (
            supabase.table("exports").select("*", count="exact", head=True).execute()
        )
        exports_new = (
            supabase.table("exports")
            .select("*", count="exact", head=True)
            .gte("created_at", start_date)
            .execute()
        )

        # Par format
        exports_by_format = {}
        for format_type in ["pdf", "epub"]:
            count = (
                supabase.table("exports")
                .select("*", count="exact", head=True)
                .eq("format", format_type)
                .execute()
            )
            exports_by_format[format_type] = count.count or 0

        # 5. Activité récente (dernières 24h)
        yesterday = (datetime.now() - timedelta(days=1)).isoformat()
        activity_24h = {
            "new_users": supabase.table("profiles")
            .select("*", count="exact", head=True)
            .gte("created_at", yesterday)
            .execute()
            .count
            or 0,
            "new_projects": supabase.table("projects")
            .select("*", count="exact", head=True)
            .gte("created_at", yesterday)
            .execute()
            .count
            or 0,
            "new_illustrations": supabase.table("illustrations")
            .select("*", count="exact", head=True)
            .gte("created_at", yesterday)
            .execute()
            .count
            or 0,
            "new_exports": supabase.table("exports")
            .select("*", count="exact", head=True)
            .gte("created_at", yesterday)
            .execute()
            .count
            or 0,
        }

        # 6. Top utilisateurs (plus actifs)
        top_users = supabase.rpc(
            "get_top_users_by_projects", {"limit_count": 10}
        ).execute()

        # 7. Revenus (si Stripe est configuré)
        revenue_data = {
            "total_mrr": 0,  # Monthly Recurring Revenue
            "subscriptions_active": users_by_tier.get("creator", 0)
            + users_by_tier.get("author", 0)
            + users_by_tier.get("studio", 0),
        }

        return {
            "success": True,
            "period_days": days,
            "users": {
                "total": users_total.count or 0,
                "new": users_new.count or 0,
                "by_tier": users_by_tier,
            },
            "projects": {
                "total": projects_total.count or 0,
                "new": projects_new.count or 0,
                "by_status": projects_by_status,
            },
            "illustrations": {
                "total": illustrations_total.count or 0,
                "new": illustrations_new.count or 0,
                "by_style": illustrations_by_style,
            },
            "exports": {
                "total": exports_total.count or 0,
                "new": exports_new.count or 0,
                "by_format": exports_by_format,
            },
            "activity_24h": activity_24h,
            "top_users": top_users.data if top_users.data else [],
            "revenue": revenue_data,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des métriques: {str(e)}",
        )


@router.get("/users", dependencies=[Depends(require_admin)])
async def get_all_users(
    limit: int = 50,
    offset: int = 0,
    tier: Optional[str] = None,
    search: Optional[str] = None,
):
    """
    Récupère la liste de tous les utilisateurs avec filtres
    """
    try:
        query = supabase.table("profiles").select("*")

        if tier:
            query = query.eq("subscription_tier", tier)

        if search:
            query = query.or_(f"email.ilike.%{search}%,full_name.ilike.%{search}%")

        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)

        result = query.execute()

        # Compter le total
        count_query = supabase.table("profiles").select("*", count="exact", head=True)
        if tier:
            count_query = count_query.eq("subscription_tier", tier)
        if search:
            count_query = count_query.or_(
                f"email.ilike.%{search}%,full_name.ilike.%{search}%"
            )

        total = count_query.execute().count or 0

        return {
            "success": True,
            "users": result.data,
            "total": total,
            "limit": limit,
            "offset": offset,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des utilisateurs: {str(e)}",
        )


@router.get("/users/{user_id}", dependencies=[Depends(require_admin)])
async def get_user_details(user_id: str):
    """
    Récupère les détails complets d'un utilisateur
    """
    try:
        # Profile
        profile = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not profile.data:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        # Projets
        projects = (
            supabase.table("projects").select("*").eq("user_id", user_id).execute()
        )

        # Illustrations
        illustrations = (
            supabase.table("illustrations")
            .select("*")
            .in_("project_id", [p["id"] for p in projects.data])
            .execute()
        )

        # Exports
        exports = (
            supabase.table("exports")
            .select("*")
            .in_("project_id", [p["id"] for p in projects.data])
            .execute()
        )

        return {
            "success": True,
            "profile": profile.data[0],
            "stats": {
                "projects_count": len(projects.data),
                "illustrations_count": (
                    len(illustrations.data) if illustrations.data else 0
                ),
                "exports_count": len(exports.data) if exports.data else 0,
            },
            "projects": projects.data,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des détails: {str(e)}",
        )


@router.put("/users/{user_id}/tier", dependencies=[Depends(require_admin)])
async def update_user_tier(user_id: str, tier: str):
    """
    Met à jour le tier d'abonnement d'un utilisateur
    """
    try:
        allowed_tiers = ["free", "creator", "author", "studio"]
        if tier not in allowed_tiers:
            raise HTTPException(
                status_code=400,
                detail=f"Tier invalide. Valeurs autorisées: {allowed_tiers}",
            )

        result = (
            supabase.table("profiles")
            .update(
                {"subscription_tier": tier, "updated_at": datetime.now().isoformat()}
            )
            .eq("id", user_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        return {
            "success": True,
            "message": f"Tier mis à jour vers {tier}",
            "profile": result.data[0],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur lors de la mise à jour: {str(e)}"
        )


@router.delete("/users/{user_id}", dependencies=[Depends(require_admin)])
async def delete_user(user_id: str):
    """
    Supprime un utilisateur et toutes ses données
    ATTENTION: Cette action est irréversible
    """
    try:
        # Supprimer les projets (cascadera vers illustrations, chapitres, exports)
        supabase.table("projects").delete().eq("user_id", user_id).execute()

        # Supprimer le profil
        result = supabase.table("profiles").delete().eq("id", user_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        return {"success": True, "message": "Utilisateur supprimé avec succès"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur lors de la suppression: {str(e)}"
        )
