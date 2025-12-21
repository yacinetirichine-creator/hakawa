"""
User profiles routes
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.models.schemas import UserProfile, UserProfileUpdate
from app.utils.supabase import supabase

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_my_profile(user_id: str):
    """Get current user's profile"""
    try:
        result = supabase.table("profiles").select("*").eq("id", user_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/me", response_model=UserProfile)
async def update_my_profile(profile_data: UserProfileUpdate, user_id: str):
    """Update current user's profile"""
    try:
        update_data = profile_data.model_dump(exclude_unset=True)

        result = (
            supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me/stats")
async def get_my_stats(user_id: str):
    """Get user statistics"""
    try:
        # Get projects count
        projects = (
            supabase.table("projects")
            .select("id, status, word_count, chapter_count")
            .eq("user_id", user_id)
            .execute()
        )

        total_projects = len(projects.data)
        total_words = sum(p.get("word_count", 0) for p in projects.data)
        total_chapters = sum(p.get("chapter_count", 0) for p in projects.data)

        # Count by status
        status_counts = {}
        for project in projects.data:
            status = project.get("status", "draft")
            status_counts[status] = status_counts.get(status, 0) + 1

        # Get illustrations count
        illustrations = (
            supabase.table("illustrations")
            .select("id", count="exact")
            .in_("project_id", [p["id"] for p in projects.data])
            .execute()
        )

        return {
            "total_projects": total_projects,
            "total_words": total_words,
            "total_chapters": total_chapters,
            "total_illustrations": illustrations.count if illustrations.count else 0,
            "projects_by_status": status_counts,
            "published_books": status_counts.get("published", 0),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/me/child-mode")
async def toggle_child_mode(enabled: bool, user_id: str):
    """Toggle child mode"""
    try:
        result = (
            supabase.table("profiles")
            .update({"is_child_mode": enabled})
            .eq("id", user_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        return {"is_child_mode": enabled, "updated": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me/credits")
async def get_credits(user_id: str):
    """Get user's illustration credits"""
    try:
        result = (
            supabase.table("profiles")
            .select("credits_illustrations, subscription_tier")
            .eq("id", user_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        profile = result.data[0]
        return {
            "credits_illustrations": profile.get("credits_illustrations", 0),
            "subscription_tier": profile.get("subscription_tier", "free"),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
