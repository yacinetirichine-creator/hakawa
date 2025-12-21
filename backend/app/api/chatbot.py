"""
Chatbot API endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_text
from typing import Optional

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])


class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = "general"


class ChatResponse(BaseModel):
    response: str


CHATBOT_PROMPTS = {
    "hakawa_assistant": """Tu es l'assistant virtuel de Hakawa, une plateforme qui aide les utilisateurs à créer des livres illustrés pour enfants grâce à l'IA.

Contexte de Hakawa :
- Hakawa permet de créer des histoires magiques pour enfants
- L'IA aide à générer du texte et des illustrations
- Les livres peuvent être exportés au format Amazon KDP
- Différents genres : Fantasy, Science-Fiction, Aventure, Mystère, etc.
- Différents styles : Roman, Manga, BD, Comics, Livre Enfants
- Public cible : Enfants (3-10 ans), Ados, Adultes

Ton rôle :
- Répondre aux questions sur Hakawa et son fonctionnement
- Aider les utilisateurs à créer leur premier livre
- Expliquer les fonctionnalités (genres, styles, export KDP, etc.)
- Être amical, encourageant et créatif
- Parler de manière simple et accessible, adapté aux créateurs
- Utiliser des émojis pour rendre la conversation plus vivante

Réponds à la question de l'utilisateur de manière concise (2-3 phrases maximum) :""",
    "general": """Tu es un assistant IA amical et serviable. Réponds de manière concise et utile :""",
}


@router.post("", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Chatbot endpoint - responds to user messages
    """
    try:
        # Get the appropriate system prompt
        system_prompt = CHATBOT_PROMPTS.get(message.context, CHATBOT_PROMPTS["general"])

        # Generate response using Claude
        full_prompt = (
            f"{system_prompt}\n\nUtilisateur : {message.message}\n\nAssistant :"
        )

        response = await generate_text(
            prompt=full_prompt, max_tokens=300, temperature=0.7
        )

        return ChatResponse(response=response)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating chatbot response: {str(e)}"
        )


@router.get("/health")
async def chatbot_health():
    """Health check for chatbot"""
    return {"status": "ok", "service": "chatbot"}
