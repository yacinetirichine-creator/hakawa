"""
API endpoints for user image uploads
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from typing import Optional, List
import os
import uuid
from datetime import datetime, timedelta
from PIL import Image
import io

from app.utils.supabase import supabase
from app.utils.admin import get_user_profile

router = APIRouter(prefix="/api/user-images", tags=["user-images"])

# Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_TOTAL_STORAGE_MB = (
    500  # 500 MB par utilisateur (free), peut être augmenté selon abonnement
)
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Storage limits par tier
STORAGE_LIMITS = {
    "free": 100,  # MB
    "conteur": 500,  # MB
    "auteur": 2000,  # 2 GB
    "studio": 10000,  # 10 GB
}


def validate_image(file_content: bytes, filename: str) -> dict:
    """Validate image file and extract metadata"""
    try:
        img = Image.open(io.BytesIO(file_content))

        # Get image info
        width, height = img.size
        format_name = img.format.lower() if img.format else None

        # Validate dimensions (max 4096x4096)
        if width > 4096 or height > 4096:
            raise HTTPException(
                status_code=400,
                detail="Image too large. Maximum dimensions: 4096x4096 pixels",
            )

        # Validate format
        if format_name not in ["jpeg", "png", "webp"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image format: {format_name}. Allowed: JPEG, PNG, WebP",
            )

        return {
            "width": width,
            "height": height,
            "format": format_name,
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")


def check_storage_limit(user_id: str, user_tier: str, new_file_size: int) -> None:
    """Check if user has enough storage space"""

    # Get current storage usage
    result = supabase.rpc("get_user_storage_usage", {"p_user_id": user_id}).execute()

    if result.data and len(result.data) > 0:
        current_usage_mb = float(result.data[0].get("total_size_mb", 0))
    else:
        current_usage_mb = 0

    # Get limit for user's tier
    limit_mb = STORAGE_LIMITS.get(user_tier, STORAGE_LIMITS["free"])

    # Calculate new total
    new_total_mb = current_usage_mb + (new_file_size / 1024 / 1024)

    if new_total_mb > limit_mb:
        raise HTTPException(
            status_code=413,
            detail=f"Storage limit exceeded. Current: {current_usage_mb:.2f} MB, Limit: {limit_mb} MB. Upgrade your plan for more storage.",
        )


@router.post("/upload")
async def upload_user_image(
    file: UploadFile = File(...),
    project_id: Optional[str] = Form(None),
    chapter_id: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    alt_text: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),  # Comma-separated tags
    usage_type: str = Form("illustration"),
    user=Depends(get_user_profile),
):
    """
    Upload a personal image

    usage_type: illustration, cover, character, background, other
    """

    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}",
        )

    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file
    file_content = await file.read()
    file_size = len(file_content)

    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024} MB",
        )

    # Check storage limit
    check_storage_limit(user["id"], user.get("subscription_tier", "free"), file_size)

    # Validate image and get metadata
    image_meta = validate_image(file_content, file.filename)

    # Generate unique filename
    image_id = str(uuid.uuid4())
    storage_filename = f"{image_id}{file_ext}"
    storage_path = f"{user['id']}/{storage_filename}"

    try:
        # Upload to Supabase Storage
        upload_result = supabase.storage.from_("user-images").upload(
            storage_path,
            file_content,
            {
                "content-type": file.content_type,
                "cache-control": "3600",
                "upsert": "false",
            },
        )

        # Get public URL (signed URL valid for 1 year)
        public_url = supabase.storage.from_("user-images").create_signed_url(
            storage_path, 31536000  # 1 year in seconds
        )

        # Parse tags
        tags_list = []
        if tags:
            tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

        # Save to database
        image_data = {
            "id": image_id,
            "user_id": user["id"],
            "project_id": project_id,
            "chapter_id": chapter_id,
            "filename": storage_filename,
            "original_filename": file.filename,
            "file_type": image_meta["format"],
            "file_size": file_size,
            "storage_path": storage_path,
            "public_url": (
                public_url["signedURL"] if isinstance(public_url, dict) else public_url
            ),
            "width": image_meta["width"],
            "height": image_meta["height"],
            "format": image_meta["format"],
            "description": description,
            "alt_text": alt_text or file.filename,
            "tags": tags_list,
            "usage_type": usage_type,
            "created_at": datetime.utcnow().isoformat(),
        }

        result = supabase.table("user_images").insert(image_data).execute()

        if not result.data:
            # Rollback storage upload
            supabase.storage.from_("user-images").remove([storage_path])
            raise HTTPException(status_code=500, detail="Failed to save image metadata")

        return result.data[0]

    except Exception as e:
        # Attempt to cleanup storage if database insert failed
        try:
            supabase.storage.from_("user-images").remove([storage_path])
        except:
            pass

        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/")
async def get_user_images(
    project_id: Optional[str] = None,
    usage_type: Optional[str] = None,
    limit: int = 50,
    user=Depends(get_user_profile),
):
    """Get user's uploaded images"""

    query = supabase.table("user_images").select("*").eq("user_id", user["id"])

    if project_id:
        query = query.eq("project_id", project_id)

    if usage_type:
        query = query.eq("usage_type", usage_type)

    result = query.order("created_at", desc=True).limit(limit).execute()

    return result.data or []


@router.get("/storage-usage")
async def get_storage_usage(user=Depends(get_user_profile)):
    """Get user's storage usage statistics"""

    result = supabase.rpc("get_user_storage_usage", {"p_user_id": user["id"]}).execute()

    tier = user.get("subscription_tier", "free")
    limit_mb = STORAGE_LIMITS.get(tier, STORAGE_LIMITS["free"])

    if result.data and len(result.data) > 0:
        usage = result.data[0]
        usage_mb = float(usage.get("total_size_mb", 0))
    else:
        usage = {"total_images": 0, "total_size_bytes": 0, "total_size_mb": 0}
        usage_mb = 0

    return {
        **usage,
        "limit_mb": limit_mb,
        "limit_bytes": limit_mb * 1024 * 1024,
        "usage_percent": round((usage_mb / limit_mb) * 100, 2) if limit_mb > 0 else 0,
        "subscription_tier": tier,
    }


@router.get("/{image_id}")
async def get_image(image_id: str, user=Depends(get_user_profile)):
    """Get image details"""

    result = (
        supabase.table("user_images")
        .select("*")
        .eq("id", image_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Image not found")

    return result.data[0]


@router.patch("/{image_id}")
async def update_image(
    image_id: str,
    description: Optional[str] = None,
    alt_text: Optional[str] = None,
    tags: Optional[List[str]] = None,
    usage_type: Optional[str] = None,
    project_id: Optional[str] = None,
    chapter_id: Optional[str] = None,
    user=Depends(get_user_profile),
):
    """Update image metadata"""

    # Verify ownership
    image = (
        supabase.table("user_images")
        .select("id")
        .eq("id", image_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not image.data:
        raise HTTPException(status_code=404, detail="Image not found")

    # Build update data
    update_data = {"updated_at": datetime.utcnow().isoformat()}

    if description is not None:
        update_data["description"] = description
    if alt_text is not None:
        update_data["alt_text"] = alt_text
    if tags is not None:
        update_data["tags"] = tags
    if usage_type is not None:
        update_data["usage_type"] = usage_type
    if project_id is not None:
        update_data["project_id"] = project_id
    if chapter_id is not None:
        update_data["chapter_id"] = chapter_id

    result = (
        supabase.table("user_images").update(update_data).eq("id", image_id).execute()
    )

    return result.data[0] if result.data else {}


@router.delete("/{image_id}")
async def delete_image(image_id: str, user=Depends(get_user_profile)):
    """Delete an image"""

    # Get image info
    image = (
        supabase.table("user_images")
        .select("*")
        .eq("id", image_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not image.data:
        raise HTTPException(status_code=404, detail="Image not found")

    image_data = image.data[0]
    storage_path = image_data["storage_path"]

    try:
        # Delete from storage
        supabase.storage.from_("user-images").remove([storage_path])

        # Delete from database
        supabase.table("user_images").delete().eq("id", image_id).execute()

        return {"message": "Image deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")


@router.post("/bulk-delete")
async def bulk_delete_images(
    image_ids: List[str],
    user=Depends(get_user_profile),
):
    """Delete multiple images at once"""

    # Get images
    images = (
        supabase.table("user_images")
        .select("id, storage_path")
        .in_("id", image_ids)
        .eq("user_id", user["id"])
        .execute()
    )

    if not images.data:
        raise HTTPException(status_code=404, detail="No images found")

    # Collect storage paths
    storage_paths = [img["storage_path"] for img in images.data]
    found_ids = [img["id"] for img in images.data]

    try:
        # Delete from storage
        if storage_paths:
            supabase.storage.from_("user-images").remove(storage_paths)

        # Delete from database
        supabase.table("user_images").delete().in_("id", found_ids).execute()

        return {
            "message": f"{len(found_ids)} images deleted successfully",
            "deleted_count": len(found_ids),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk delete failed: {str(e)}")
