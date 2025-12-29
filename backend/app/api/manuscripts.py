"""
API endpoints for manuscript upload and improvement
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Form
from typing import Optional
import os
import uuid
from datetime import datetime
import PyPDF2
import docx
import io

from app.utils.supabase import supabase
from app.services.ai_service import AIService
from app.api.auth import get_user_profile

router = APIRouter(prefix="/api/manuscripts", tags=["manuscripts"])
ai_service = AIService()

# Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".txt", ".docx", ".pdf"}


def extract_text_from_txt(file_content: bytes) -> str:
    """Extract text from TXT file"""
    try:
        return file_content.decode("utf-8")
    except UnicodeDecodeError:
        # Try with different encodings
        for encoding in ["latin-1", "cp1252", "iso-8859-1"]:
            try:
                return file_content.decode(encoding)
            except:
                continue
        raise HTTPException(status_code=400, detail="Unable to decode text file")


def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        return "\n\n".join([paragraph.text for paragraph in doc.paragraphs])
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error reading DOCX file: {str(e)}"
        )


def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF file: {str(e)}")


@router.post("/upload")
async def upload_manuscript(
    file: UploadFile = File(...),
    project_id: str = Form(...),
    improvement_type: str = Form("correction"),  # correction, enhancement, restructure
    user=Depends(get_user_profile),
):
    """
    Upload a manuscript file (TXT, DOCX, PDF) and analyze it

    improvement_type:
    - correction: Fix spelling/grammar
    - enhancement: Improve style and flow
    - restructure: Suggest better chapter organization
    """

    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file content
    file_content = await file.read()

    # Validate file size
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024} MB",
        )

    # Extract text based on file type
    if file_ext == ".txt":
        text = extract_text_from_txt(file_content)
    elif file_ext == ".docx":
        text = extract_text_from_docx(file_content)
    elif file_ext == ".pdf":
        text = extract_text_from_pdf(file_content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    if not text.strip():
        raise HTTPException(status_code=400, detail="File is empty or contains no text")

    # Verify project ownership
    project = (
        supabase.table("projects")
        .select("id, user_id, title")
        .eq("id", project_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")

    # Store manuscript in database
    manuscript_id = str(uuid.uuid4())
    manuscript_data = {
        "id": manuscript_id,
        "project_id": project_id,
        "user_id": user["id"],
        "filename": file.filename,
        "file_type": file_ext[1:],  # Remove dot
        "original_text": text,
        "word_count": len(text.split()),
        "improvement_type": improvement_type,
        "status": "analyzing",
        "created_at": datetime.utcnow().isoformat(),
    }

    result = supabase.table("manuscripts").insert(manuscript_data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to store manuscript")

    # Return initial response (analysis will happen in background or via separate endpoint)
    return {
        "manuscript_id": manuscript_id,
        "filename": file.filename,
        "word_count": manuscript_data["word_count"],
        "status": "analyzing",
        "message": "Manuscript uploaded successfully. Analysis in progress...",
    }


@router.post("/{manuscript_id}/analyze")
async def analyze_manuscript(manuscript_id: str, user=Depends(get_user_profile)):
    """
    Analyze uploaded manuscript and generate improvement suggestions
    """

    # Get manuscript
    manuscript = (
        supabase.table("manuscripts")
        .select("*")
        .eq("id", manuscript_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not manuscript.data:
        raise HTTPException(status_code=404, detail="Manuscript not found")

    manuscript_data = manuscript.data[0]
    text = manuscript_data["original_text"]
    improvement_type = manuscript_data["improvement_type"]

    # Generate AI analysis based on improvement type
    if improvement_type == "correction":
        prompt = f"""Tu es un correcteur professionnel. Analyse ce texte et identifie :
- Fautes d'orthographe
- Erreurs de grammaire
- Problèmes de ponctuation
- Incohérences

Texte à corriger (max 2000 premiers mots):
{' '.join(text.split()[:2000])}

Fournis un résumé des erreurs trouvées et des suggestions de correction."""

    elif improvement_type == "enhancement":
        prompt = f"""Tu es un éditeur littéraire. Analyse ce texte et suggère des améliorations pour :
- Style et fluidité
- Vocabulaire et expressions
- Rythme narratif
- Descriptions et dialogues

Texte (max 2000 premiers mots):
{' '.join(text.split()[:2000])}

Fournis des suggestions concrètes d'amélioration."""

    else:  # restructure
        prompt = f"""Tu es un consultant éditorial. Analyse la structure de ce texte :
- Organisation des chapitres
- Progression narrative
- Équilibre des parties
- Suggestions de découpage

Texte (max 2000 premiers mots):
{' '.join(text.split()[:2000])}

Propose une meilleure structure avec chapitres suggérés."""

    try:
        # Call AI service
        analysis = await ai_service.generate_text(prompt, max_tokens=2000)

        # Update manuscript with analysis
        update_data = {
            "analysis": analysis.text,
            "status": "analyzed",
            "analyzed_at": datetime.utcnow().isoformat(),
        }

        supabase.table("manuscripts").update(update_data).eq(
            "id", manuscript_id
        ).execute()

        return {
            "manuscript_id": manuscript_id,
            "status": "analyzed",
            "analysis": analysis.text,
            "improvement_type": improvement_type,
        }

    except Exception as e:
        # Update status to error
        supabase.table("manuscripts").update({"status": "error"}).eq(
            "id", manuscript_id
        ).execute()
        raise HTTPException(
            status_code=500, detail=f"Error analyzing manuscript: {str(e)}"
        )


@router.post("/{manuscript_id}/apply-improvements")
async def apply_improvements(manuscript_id: str, user=Depends(get_user_profile)):
    """
    Apply AI improvements to the manuscript text
    """

    # Get manuscript
    manuscript = (
        supabase.table("manuscripts")
        .select("*")
        .eq("id", manuscript_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not manuscript.data:
        raise HTTPException(status_code=404, detail="Manuscript not found")

    manuscript_data = manuscript.data[0]

    if manuscript_data["status"] != "analyzed":
        raise HTTPException(status_code=400, detail="Manuscript must be analyzed first")

    text = manuscript_data["original_text"]
    improvement_type = manuscript_data["improvement_type"]

    # Generate improved version
    if improvement_type == "correction":
        prompt = f"""Corrige toutes les fautes d'orthographe, de grammaire et de ponctuation dans ce texte. Ne change pas le style ni le contenu, juste corrige les erreurs.

Texte original :
{text[:8000]}  # Limit to avoid token limits

Texte corrigé :"""

    else:  # enhancement
        prompt = f"""Améliore le style de ce texte en gardant le même contenu et la même structure. Rends-le plus fluide, plus élégant, avec un meilleur vocabulaire.

Texte original :
{text[:8000]}

Texte amélioré :"""

    try:
        improved = await ai_service.generate_text(prompt, max_tokens=4000)

        # Update manuscript with improved version
        update_data = {
            "improved_text": improved.text,
            "status": "improved",
            "improved_at": datetime.utcnow().isoformat(),
        }

        supabase.table("manuscripts").update(update_data).eq(
            "id", manuscript_id
        ).execute()

        return {
            "manuscript_id": manuscript_id,
            "status": "improved",
            "improved_text": improved.text,
            "original_word_count": len(text.split()),
            "improved_word_count": len(improved.text.split()),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error applying improvements: {str(e)}"
        )


@router.get("/{manuscript_id}")
async def get_manuscript(manuscript_id: str, user=Depends(get_user_profile)):
    """Get manuscript details"""

    manuscript = (
        supabase.table("manuscripts")
        .select("*")
        .eq("id", manuscript_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not manuscript.data:
        raise HTTPException(status_code=404, detail="Manuscript not found")

    return manuscript.data[0]


@router.get("/project/{project_id}")
async def get_project_manuscripts(project_id: str, user=Depends(get_user_profile)):
    """Get all manuscripts for a project"""

    manuscripts = (
        supabase.table("manuscripts")
        .select("*")
        .eq("project_id", project_id)
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .execute()
    )

    return manuscripts.data or []


@router.delete("/{manuscript_id}")
async def delete_manuscript(manuscript_id: str, user=Depends(get_user_profile)):
    """Delete a manuscript"""

    # Verify ownership
    manuscript = (
        supabase.table("manuscripts")
        .select("id")
        .eq("id", manuscript_id)
        .eq("user_id", user["id"])
        .execute()
    )

    if not manuscript.data:
        raise HTTPException(status_code=404, detail="Manuscript not found")

    # Delete
    supabase.table("manuscripts").delete().eq("id", manuscript_id).execute()

    return {"message": "Manuscript deleted successfully"}
