"""
Projects routes
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import Project, ProjectCreate, ProjectUpdate
from app.utils.supabase import supabase
from app.utils.admin import get_user_profile, is_admin_user, check_resource_limit

router = APIRouter()


@router.get("/", response_model=List[Project])
async def get_projects(user_id: str, profile: dict = Depends(get_user_profile)):
    """Get all projects for a user (admin can see all projects)"""
    try:
        # Si admin, peut voir tous les projets OU filtrer par user_id
        # Si user normal, voir uniquement ses projets
        if is_admin_user(profile):
            # Admin: si user_id fourni, filtrer, sinon tout voir
            if user_id and user_id != "all":
                result = (
                    supabase.table("projects")
                    .select("*")
                    .eq("user_id", user_id)
                    .execute()
                )
            else:
                # Voir tous les projets de tous les utilisateurs
                result = supabase.table("projects").select("*").execute()
        else:
            # Utilisateur normal: seulement ses projets
            result = (
                supabase.table("projects")
                .select("*")
                .eq("user_id", profile["id"])
                .execute()
            )

        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=Project)
async def create_project(
    project: ProjectCreate, profile: dict = Depends(get_user_profile)
):
    """Create a new project (admin has unlimited access)"""
    try:
        # Vérifier les limites (bypassed pour admin)
        can_create = await check_resource_limit(profile, "project")
        if not can_create:
            raise HTTPException(
                status_code=403,
                detail="Limite de projets atteinte pour votre abonnement. Passez à un plan supérieur.",
            )

        project_data = project.model_dump()
        project_data["user_id"] = profile["id"]

        result = supabase.table("projects").insert(project_data).execute()
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, profile: dict = Depends(get_user_profile)):
    """Get a specific project (admin can access any project)"""
    try:
        query = supabase.table("projects").select("*").eq("id", project_id)

        # Si pas admin, vérifier que c'est bien son projet
        if not is_admin_user(profile):
            query = query.eq("user_id", profile["id"])

        result = query.execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str, project: ProjectUpdate, profile: dict = Depends(get_user_profile)
):
    """Update a project (admin can update any project)"""
    try:
        project_data = project.model_dump(exclude_unset=True)

        query = supabase.table("projects").update(project_data).eq("id", project_id)

        # Si pas admin, vérifier que c'est bien son projet
        if not is_admin_user(profile):
            query = query.eq("user_id", profile["id"])

        result = query.execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}")
async def delete_project(project_id: str, profile: dict = Depends(get_user_profile)):
    """Delete a project (admin can delete any project)"""
    try:
        query = supabase.table("projects").delete().eq("id", project_id)

        # Si pas admin, vérifier que c'est bien son projet
        if not is_admin_user(profile):
            query = query.eq("user_id", profile["id"])

        result = query.execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
