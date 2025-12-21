"""
Export routes - PDF/EPUB generation
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from typing import List
from app.models.schemas import ExportCreate, Export
from app.utils.supabase import supabase
from app.services.export_service import ExportService

router = APIRouter()
export_service = ExportService()


@router.get("/{project_id}", response_model=List[Export])
async def get_project_exports(project_id: str, user_id: str):
    """Get all exports for a project"""
    try:
        result = (
            supabase.table("exports")
            .select("*")
            .eq("project_id", project_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/pdf/{project_id}")
async def export_pdf(project_id: str, user_id: str):
    """Generate PDF export"""
    try:
        # Create export record
        export_data = {
            "project_id": project_id,
            "format": "pdf_interior",
            "status": "pending",
        }
        export_record = supabase.table("exports").insert(export_data).execute()
        export_id = export_record.data[0]["id"]

        # Generate PDF (async task in production)
        try:
            file_url = await export_service.generate_pdf(project_id)

            # Update export record
            supabase.table("exports").update(
                {"status": "completed", "file_url": file_url}
            ).eq("id", export_id).execute()

            return {"export_id": export_id, "status": "completed", "file_url": file_url}
        except Exception as gen_error:
            # Update as failed
            supabase.table("exports").update(
                {"status": "failed", "error_message": str(gen_error)}
            ).eq("id", export_id).execute()
            raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/epub/{project_id}")
async def export_epub(project_id: str, user_id: str):
    """Generate EPUB export"""
    try:
        # Create export record
        export_data = {
            "project_id": project_id,
            "format": "epub",
            "status": "pending",
        }
        export_record = supabase.table("exports").insert(export_data).execute()
        export_id = export_record.data[0]["id"]

        # Generate EPUB (async task in production)
        try:
            file_url = await export_service.generate_epub(project_id)

            # Update export record
            supabase.table("exports").update(
                {"status": "completed", "file_url": file_url}
            ).eq("id", export_id).execute()

            return {"export_id": export_id, "status": "completed", "file_url": file_url}
        except Exception as gen_error:
            # Update as failed
            supabase.table("exports").update(
                {"status": "failed", "error_message": str(gen_error)}
            ).eq("id", export_id).execute()
            raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{export_id}", response_model=Export)
async def get_export_status(export_id: str, user_id: str):
    """Get export status"""
    try:
        result = supabase.table("exports").select("*").eq("id", export_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Export not found")

        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/download/{export_id}")
async def download_export(export_id: str, user_id: str):
    """Download export file"""
    try:
        # Get export record
        result = supabase.table("exports").select("*").eq("id", export_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Export not found")

        export = result.data[0]

        if export["status"] != "completed":
            raise HTTPException(
                status_code=400, detail=f"Export status: {export['status']}"
            )

        if not export.get("file_url"):
            raise HTTPException(status_code=404, detail="File not found")

        # In production, redirect to Supabase Storage URL or serve file
        return {"download_url": export["file_url"]}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/kdp-package/{project_id}")
async def export_kdp_package(project_id: str, user_id: str):
    """Generate complete KDP package (interior + cover PDFs)"""
    try:
        # Create export record
        export_data = {
            "project_id": project_id,
            "format": "full_kdp",
            "status": "pending",
        }
        export_record = supabase.table("exports").insert(export_data).execute()
        export_id = export_record.data[0]["id"]

        # Generate KDP package
        try:
            result = await export_service.generate_kdp_package(project_id)

            # Update export record
            supabase.table("exports").update(
                {"status": "completed", "config": result}
            ).eq("id", export_id).execute()

            return {
                "export_id": export_id,
                "status": "completed",
                "interior_pdf": result.get("interior_pdf"),
                "cover_pdf": result.get("cover_pdf"),
            }
        except Exception as gen_error:
            # Update as failed
            supabase.table("exports").update(
                {"status": "failed", "error_message": str(gen_error)}
            ).eq("id", export_id).execute()
            raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
