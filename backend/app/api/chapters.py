"""
Chapters routes
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Chapter, ChapterCreate, ChapterUpdate
from app.utils.supabase import supabase

router = APIRouter()


@router.get("/", response_model=List[Chapter])
async def get_chapters(project_id: str):
    """Get all chapters for a project"""
    try:
        result = (
            supabase.table("chapters")
            .select("*")
            .eq("project_id", project_id)
            .order("number")
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/", response_model=Chapter)
async def create_chapter(project_id: str, chapter: ChapterCreate):
    """Create a new chapter"""
    try:
        # Get the next chapter number
        chapters = (
            supabase.table("chapters")
            .select("number")
            .eq("project_id", project_id)
            .execute()
        )
        next_number = max([c["number"] for c in chapters.data], default=0) + 1

        chapter_data = chapter.model_dump()
        chapter_data["project_id"] = project_id
        chapter_data["number"] = next_number

        result = supabase.table("chapters").insert(chapter_data).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{chapter_number}", response_model=Chapter)
async def get_chapter(project_id: str, chapter_number: int):
    """Get a specific chapter"""
    try:
        result = (
            supabase.table("chapters")
            .select("*")
            .eq("project_id", project_id)
            .eq("number", chapter_number)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Chapter not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{chapter_number}", response_model=Chapter)
async def update_chapter(project_id: str, chapter_number: int, chapter: ChapterUpdate):
    """Update a chapter"""
    try:
        chapter_data = chapter.model_dump(exclude_unset=True)

        # Update word count if content is provided
        if "content" in chapter_data and chapter_data["content"]:
            chapter_data["word_count"] = len(chapter_data["content"].split())

        result = (
            supabase.table("chapters")
            .update(chapter_data)
            .eq("project_id", project_id)
            .eq("number", chapter_number)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Chapter not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{chapter_number}")
async def delete_chapter(project_id: str, chapter_number: int):
    """Delete a chapter"""
    try:
        result = (
            supabase.table("chapters")
            .delete()
            .eq("project_id", project_id)
            .eq("number", chapter_number)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Chapter not found")
        return {"message": "Chapter deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
