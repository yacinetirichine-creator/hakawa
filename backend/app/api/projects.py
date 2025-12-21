"""
Projects routes
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import Project, ProjectCreate, ProjectUpdate
from app.utils.supabase import supabase

router = APIRouter()


@router.get("/", response_model=List[Project])
async def get_projects(user_id: str):
    """Get all projects for a user"""
    try:
        result = supabase.table("projects").select("*").eq("user_id", user_id).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=Project)
async def create_project(project: ProjectCreate, user_id: str):
    """Create a new project"""
    try:
        project_data = project.model_dump()
        project_data["user_id"] = user_id

        result = supabase.table("projects").insert(project_data).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, user_id: str):
    """Get a specific project"""
    try:
        result = (
            supabase.table("projects")
            .select("*")
            .eq("id", project_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectUpdate, user_id: str):
    """Update a project"""
    try:
        project_data = project.model_dump(exclude_unset=True)

        result = (
            supabase.table("projects")
            .update(project_data)
            .eq("id", project_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}")
async def delete_project(project_id: str, user_id: str):
    """Delete a project"""
    try:
        result = (
            supabase.table("projects")
            .delete()
            .eq("id", project_id)
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"message": "Project deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
