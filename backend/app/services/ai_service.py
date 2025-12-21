"""
AI Service for text generation using Anthropic Claude
"""

from anthropic import Anthropic
from app.config import settings
from app.models.schemas import GenerationResponse
from app.utils.supabase import supabase
from typing import List, Optional


class AIService:
    def __init__(self):
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = "claude-sonnet-4-20250514"

    async def generate_text(
        self, prompt: str, context: str = None, max_tokens: int = 2000
    ) -> GenerationResponse:
        """Generate text using Claude"""

        # Build the full prompt
        full_prompt = prompt
        if context:
            full_prompt = f"Contexte:\n{context}\n\nDemande:\n{prompt}"

        # Call Claude API
        message = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": full_prompt}],
        )

        # Extract response
        text = message.content[0].text
        tokens_used = message.usage.input_tokens + message.usage.output_tokens

        return GenerationResponse(text=text, tokens_used=tokens_used)

    async def continue_text(
        self, text: str, max_tokens: int = 500
    ) -> GenerationResponse:
        """Continue writing from existing text"""
        prompt = f"""Continue cette histoire de manière naturelle et cohérente:

{text}

Continue l'histoire (ne répète pas le texte existant, continue juste là où ça s'arrête):"""

        return await self.generate_text(prompt, max_tokens=max_tokens)

    async def improve_text(self, text: str, instruction: str) -> GenerationResponse:
        """Improve existing text based on instruction"""
        prompt = f"""{instruction}

Texte à améliorer:
{text}

Texte amélioré:"""

        return await self.generate_text(prompt, max_tokens=2000)

    async def chat_response(
        self,
        user_message: str,
        phase: str = "exploration",
        history: List[dict] = None,
        project_id: Optional[str] = None,
    ) -> str:
        """
        Generate chat response based on phase and context
        """
        # Get project context if available
        project_context = ""
        if project_id:
            project = (
                supabase.table("projects")
                .select(
                    "title, pitch, genre, style, target_audience, characters, universe, themes"
                )
                .eq("id", project_id)
                .execute()
            )
            if project.data:
                p = project.data[0]
                project_context = f"""
Projet actuel:
- Titre: {p.get('title', 'Sans titre')}
- Pitch: {p.get('pitch', 'Aucun')}
- Genre: {p.get('genre', 'Non défini')}
- Style: {p.get('style', 'Non défini')}
- Public: {p.get('target_audience', 'Non défini')}
"""

        # Build system prompt based on phase
        system_prompts = {
            "exploration": """Tu es un assistant créatif bienveillant qui aide les auteurs à explorer leurs idées de livre.
Tu poses des questions ouvertes, tu encourages la créativité, et tu aides à développer les concepts.
Reste positif, curieux, et inspirant. Utilise un ton chaleureux et amical.
Ne génère pas de texte complet, concentre-toi sur l'exploration des idées.""",
            "planning": """Tu es un expert en structure narrative qui aide à planifier un livre.
Tu aides à créer des personnages cohérents, un arc narratif solide, et une structure de chapitres.
Sois méthodique mais créatif. Pose des questions pour clarifier la vision de l'auteur.
Propose des suggestions concrètes pour la structure du livre.""",
            "writing": """Tu es un assistant d'écriture qui aide à rédiger et améliorer le contenu.
Tu peux générer des passages, améliorer le style, suggérer des alternatives.
Respecte le style et le ton choisis par l'auteur. Sois constructif dans tes suggestions.
Aide à maintenir la cohérence narrative.""",
            "illustration": """Tu es un expert en description visuelle et en prompts pour génération d'images.
Tu aides à créer des descriptions détaillées pour les illustrations.
Tu comprends différents styles visuels (manga, BD, réaliste, etc.).
Génère des prompts précis et évocateurs pour les générateurs d'images.""",
        }

        system_prompt = system_prompts.get(phase, system_prompts["exploration"])

        # Build messages for Claude
        messages = []
        if history:
            # Add conversation history (limit to last 10 messages)
            for msg in history[-10:]:
                if msg.get("role") in ["user", "assistant"]:
                    messages.append({"role": msg["role"], "content": msg["content"]})

        # Add current message
        current_content = user_message
        if project_context:
            current_content = f"{project_context}\n\n{user_message}"

        messages.append({"role": "user", "content": current_content})

        # Call Claude
        response = self.client.messages.create(
            model=self.model,
            max_tokens=1500,
            system=system_prompt,
            messages=messages,
        )

        return response.content[0].text
