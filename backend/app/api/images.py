"""
Image generation routes
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import (
    ImageGenerationRequest,
    ImageGenerationResponse,
    IllustrationCreate,
    Illustration,
    IllustrationUpdate,
)
from app.services.image_service import ImageService
from app.utils.supabase import supabase

router = APIRouter()
image_service = ImageService()


@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """Generate an image using Replicate"""
    try:
        result = await image_service.generate_image(
            prompt=request.prompt,
            style=request.style,
            negative_prompt=request.negative_prompt,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}/illustrations", response_model=List[Illustration])
async def get_project_illustrations(project_id: str, user_id: str):
    """Get all illustrations for a project"""
    try:
        result = (
            supabase.table("illustrations")
            .select("*")
            .eq("project_id", project_id)
            .order("created_at", desc=False)
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/illustrations", response_model=Illustration)
async def create_illustration(
    project_id: str, illustration: IllustrationCreate, user_id: str
):
    """Create/Generate a new illustration"""
    try:
        # Generate image
        image_result = await image_service.generate_image(
            prompt=illustration.prompt,
            style=illustration.style,
            negative_prompt=illustration.negative_prompt,
        )

        # Save to database
        illustration_data = {
            "project_id": project_id,
            "image_url": image_result.image_url,
            "prompt": illustration.prompt,
            "negative_prompt": illustration.negative_prompt,
            "style": illustration.style.value,
            "position": illustration.position,
            "chapter_id": illustration.chapter_id,
        }

        result = supabase.table("illustrations").insert(illustration_data).execute()

        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/illustrations/{illustration_id}", response_model=Illustration)
async def update_illustration(
    illustration_id: str, illustration: IllustrationUpdate, user_id: str
):
    """Update illustration metadata"""
    try:
        update_data = illustration.model_dump(exclude_unset=True)

        result = (
            supabase.table("illustrations")
            .update(update_data)
            .eq("id", illustration_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Illustration not found")

        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/illustrations/{illustration_id}")
async def delete_illustration(illustration_id: str, user_id: str):
    """Delete an illustration"""
    try:
        result = (
            supabase.table("illustrations").delete().eq("id", illustration_id).execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="Illustration not found")

        return {"deleted": True, "id": illustration_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{project_id}/cover/{position}")
async def set_cover_image(
    project_id: str, position: str, illustration_id: str, user_id: str
):
    """Set an illustration as cover (front or back)"""
    try:
        if position not in ["front", "back"]:
            raise HTTPException(
                status_code=400, detail="Position must be 'front' or 'back'"
            )

        # Get illustration
        illustration = (
            supabase.table("illustrations")
            .select("image_url")
            .eq("id", illustration_id)
            .execute()
        )

        if not illustration.data:
            raise HTTPException(status_code=404, detail="Illustration not found")

        # Update project
        field_name = f"cover_{position}_url"
        result = (
            supabase.table("projects")
            .update({field_name: illustration.data[0]["image_url"]})
            .eq("id", project_id)
            .execute()
        )

        # Update illustration position
        supabase.table("illustrations").update({"position": f"cover_{position}"}).eq(
            "id", illustration_id
        ).execute()

        return {"updated": True, "position": position}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
