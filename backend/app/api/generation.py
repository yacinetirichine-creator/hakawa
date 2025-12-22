"""
Text generation routes
"""

from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import GenerationRequest, GenerationResponse
from app.services.ai_service import AIService
from app.utils.admin import get_user_profile

router = APIRouter()
ai_service = AIService()


@router.post("/text", response_model=GenerationResponse)
async def generate_text(
    request: GenerationRequest, profile: dict = Depends(get_user_profile)
):
    """Generate text using Claude AI"""
    try:
        result = await ai_service.generate_text(
            prompt=request.prompt,
            context=request.context,
            max_tokens=request.max_tokens,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/continue")
async def continue_writing(
    text: str, max_tokens: int = 500, profile: dict = Depends(get_user_profile)
):
    """Continue writing from existing text"""
    try:
        result = await ai_service.continue_text(text, max_tokens)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/improve")
async def improve_text(
    text: str,
    instruction: str = "Améliore ce texte",
    profile: dict = Depends(get_user_profile),
):
    """Improve existing text"""
    try:
        result = await ai_service.improve_text(text, instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
