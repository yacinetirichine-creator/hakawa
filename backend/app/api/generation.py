"""
Text generation routes - VERSION CORRIGÉE
Endpoints pour la génération de texte, plans et chapitres
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.models.schemas import GenerationRequest, GenerationResponse
from app.services.ai_service import AIService
from app.utils.admin import get_user_profile, assert_project_access
from app.utils.supabase import supabase
import json

router = APIRouter()
ai_service = AIService()


# ═══════════════════════════════════════════════════════════════
# SCHEMAS ADDITIONNELS
# ═══════════════════════════════════════════════════════════════


class PlanGenerationRequest(BaseModel):
    project_id: str
    num_chapters: int = 10


class ChapterGenerationRequest(BaseModel):
    chapter_id: str
    instruction: Optional[str] = None


class ContinueRequest(BaseModel):
    text: str
    max_tokens: int = 500


class ImproveRequest(BaseModel):
    text: str
    instruction: str = "Améliore ce texte"


# ═══════════════════════════════════════════════════════════════
# ENDPOINTS DE BASE
# ═══════════════════════════════════════════════════════════════


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


@router.post("/continue", response_model=GenerationResponse)
async def continue_writing(
    request: ContinueRequest, profile: dict = Depends(get_user_profile)
):
    """Continue writing from existing text"""
    try:
        result = await ai_service.continue_text(request.text, request.max_tokens)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/improve", response_model=GenerationResponse)
async def improve_text(
    request: ImproveRequest,
    profile: dict = Depends(get_user_profile),
):
    """Improve existing text"""
    try:
        result = await ai_service.improve_text(request.text, request.instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════
# GÉNÉRATION DE PLAN
# ═══════════════════════════════════════════════════════════════


@router.post("/plan")
async def generate_plan(
    request: PlanGenerationRequest, profile: dict = Depends(get_user_profile)
):
    """
    Génère un plan de chapitres pour un projet.
    Supprime les chapitres existants et en crée de nouveaux.

    Returns: Liste des chapitres créés
    """
    try:
        # Vérifier l'accès au projet
        assert_project_access(profile, request.project_id)

        # Récupérer le projet pour le contexte
        project_result = (
            supabase.table("projects")
            .select("*")
            .eq("id", request.project_id)
            .execute()
        )
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")

        project = project_result.data[0]

        # Construire le prompt pour générer le plan
        prompt = f"""Tu es un expert en structure narrative et en création de livres. 
Génère un plan détaillé et captivant pour ce livre :

📖 INFORMATIONS DU LIVRE :
- Titre : {project.get('title', 'Sans titre')}
- Pitch : {project.get('pitch', 'Non défini')}
- Genre : {project.get('genre', 'Non défini')}
- Style : {project.get('style', 'roman')}
- Public cible : {project.get('target_audience', 'adult')}
- Thèmes : {', '.join(project.get('themes', [])) or 'Non définis'}

📝 INSTRUCTIONS :
Génère exactement {request.num_chapters} chapitres avec une progression narrative cohérente.
Chaque chapitre doit avoir un arc narratif qui contribue à l'histoire globale.

Pour chaque chapitre, fournis :
1. Un titre accrocheur et évocateur
2. Un résumé de 2-3 phrases décrivant les événements clés

⚠️ FORMAT OBLIGATOIRE - Réponds UNIQUEMENT avec ce JSON, sans texte avant ou après :
[
  {{"title": "Titre du chapitre 1", "summary": "Résumé détaillé du chapitre 1..."}},
  {{"title": "Titre du chapitre 2", "summary": "Résumé détaillé du chapitre 2..."}},
  {{"title": "Titre du chapitre 3", "summary": "Résumé détaillé du chapitre 3..."}}
]"""

        # Générer le plan avec l'IA
        result = await ai_service.generate_text(prompt=prompt, max_tokens=3000)

        # Parser la réponse JSON
        try:
            text = result.text.strip()

            # Nettoyer les backticks markdown si présents
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            if "```" in text:
                text = (
                    text.split("```")[1].split("```")[0]
                    if text.count("```") >= 2
                    else text
                )

            text = text.strip()

            # Trouver le JSON dans la réponse
            start_idx = text.find("[")
            end_idx = text.rfind("]") + 1
            if start_idx != -1 and end_idx > start_idx:
                text = text[start_idx:end_idx]

            chapters_data = json.loads(text)

            if not isinstance(chapters_data, list):
                raise ValueError("La réponse n'est pas une liste")

        except (json.JSONDecodeError, ValueError) as e:
            # Fallback : créer des chapitres génériques
            chapters_data = [
                {"title": f"Chapitre {i}", "summary": "À développer..."}
                for i in range(1, request.num_chapters + 1)
            ]

        # Supprimer les anciens chapitres
        supabase.table("chapters").delete().eq(
            "project_id", request.project_id
        ).execute()

        # Créer les nouveaux chapitres
        created_chapters = []
        for i, ch in enumerate(chapters_data, 1):
            chapter_data = {
                "project_id": request.project_id,
                "number": i,
                "title": ch.get("title", f"Chapitre {i}"),
                "summary": ch.get("summary", ""),
                "content": "",
                "word_count": 0,
            }
            result = supabase.table("chapters").insert(chapter_data).execute()
            if result.data:
                created_chapters.append(result.data[0])

        # Mettre à jour le projet
        supabase.table("projects").update(
            {"chapter_count": len(created_chapters), "status": "planning"}
        ).eq("id", request.project_id).execute()

        return created_chapters

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur génération plan: {str(e)}")


# ═══════════════════════════════════════════════════════════════
# GÉNÉRATION DE CHAPITRE
# ═══════════════════════════════════════════════════════════════


@router.post("/chapter")
async def generate_chapter_content(
    request: ChapterGenerationRequest, profile: dict = Depends(get_user_profile)
):
    """
    Génère ou continue le contenu d'un chapitre.
    Si le chapitre a déjà du contenu, il est continué.
    Sinon, un nouveau contenu est généré.

    Returns: {generated_text, tokens_used, chapter_id}
    """
    try:
        # Récupérer le chapitre avec les infos du projet
        chapter_result = (
            supabase.table("chapters")
            .select("*")
            .eq("id", request.chapter_id)
            .execute()
        )
        if not chapter_result.data:
            raise HTTPException(status_code=404, detail="Chapter not found")

        chapter = chapter_result.data[0]
        project_id = chapter.get("project_id")

        # Récupérer le projet
        project_result = (
            supabase.table("projects").select("*").eq("id", project_id).execute()
        )
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")

        project = project_result.data[0]

        # Vérifier l'accès
        assert_project_access(profile, project_id)

        # Récupérer les chapitres précédents pour le contexte
        all_chapters = (
            supabase.table("chapters")
            .select("number, title, summary, content")
            .eq("project_id", project_id)
            .order("number")
            .execute()
        )

        # Construire le contexte des chapitres précédents
        chapters_context = ""
        for ch in all_chapters.data or []:
            if ch["number"] < chapter["number"]:
                chapters_context += f"\nChapitre {ch['number']} - {ch['title']}: {ch.get('summary', '')[:200]}"

        # Déterminer si on continue ou on écrit depuis le début
        existing_content = (chapter.get("content") or "").strip()

        if existing_content:
            # CONTINUER le chapitre existant
            prompt = f"""Tu es un écrivain talentueux. Continue l'écriture de ce chapitre de manière fluide et engageante.

📖 CONTEXTE DU LIVRE :
- Titre : {project.get('title', 'Sans titre')}
- Genre : {project.get('genre', 'Non défini')}
- Style : {project.get('style', 'roman')}
- Public : {project.get('target_audience', 'adult')}

📑 CHAPITRE ACTUEL : {chapter.get('title')}
Objectif du chapitre : {chapter.get('summary', 'Non défini')}

✍️ CONTENU EXISTANT :
{existing_content}

---
CONTINUE directement l'histoire là où elle s'arrête. 
Ne répète PAS le texte existant.
Écris environ 400-600 mots supplémentaires.
{f"Note de l'auteur : {request.instruction}" if request.instruction else ""}
"""
        else:
            # ÉCRIRE un nouveau chapitre
            prompt = f"""Tu es un écrivain talentueux. Écris un chapitre captivant pour ce livre.

📖 CONTEXTE DU LIVRE :
- Titre : {project.get('title', 'Sans titre')}
- Pitch : {project.get('pitch', 'Non défini')}
- Genre : {project.get('genre', 'Non défini')}
- Style : {project.get('style', 'roman')}
- Public : {project.get('target_audience', 'adult')}

{f"📚 CHAPITRES PRÉCÉDENTS :{chapters_context}" if chapters_context else "📚 C'est le premier chapitre."}

📑 CHAPITRE À ÉCRIRE : {chapter.get('title')}
Objectif : {chapter.get('summary', 'Développe librement ce chapitre')}

{f"✏️ INSTRUCTIONS : {request.instruction}" if request.instruction else ""}

Écris le chapitre (environ 800-1500 mots) :"""

        # Générer le contenu
        result = await ai_service.generate_text(prompt=prompt, max_tokens=3000)

        return {
            "generated_text": result.text,
            "tokens_used": result.tokens_used,
            "chapter_id": request.chapter_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Erreur génération chapitre: {str(e)}"
        )
