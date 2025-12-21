"""
AI Service for text generation using Anthropic Claude
"""

from anthropic import Anthropic
from app.config import settings
from app.models.schemas import GenerationResponse


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
