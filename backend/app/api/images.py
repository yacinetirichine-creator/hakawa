"""
Image generation routes
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import ImageGenerationRequest, ImageGenerationResponse
from app.services.image_service import ImageService

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
