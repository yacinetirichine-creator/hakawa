"""
Export routes (PDF, EPUB)
"""

from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/pdf/{project_id}")
async def export_pdf(project_id: str):
    """Export project as PDF for KDP"""
    try:
        # TODO: Implement PDF export
        return {"message": "PDF export not yet implemented"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/epub/{project_id}")
async def export_epub(project_id: str):
    """Export project as EPUB"""
    try:
        # TODO: Implement EPUB export
        return {"message": "EPUB export not yet implemented"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
