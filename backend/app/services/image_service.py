"""
Image generation service using Replicate
"""

import replicate
from app.config import settings
from app.models.schemas import ImageStyle, ImageGenerationResponse


class ImageService:
    def __init__(self):
        self.client = replicate.Client(api_token=settings.replicate_api_token)

        # Model mapping by style
        self.models = {
            ImageStyle.MANGA: "cjwbw/anything-v4.0:42a996d39a96aedc57b2e0aa8105dea39c9c89d9d266caf6bb4327a1c191b061",
            ImageStyle.REALISTIC: "black-forest-labs/flux-1.1-pro",
            ImageStyle.BD: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            ImageStyle.COMIC: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            ImageStyle.WATERCOLOR: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        }

    async def generate_image(
        self,
        prompt: str,
        style: ImageStyle = ImageStyle.REALISTIC,
        negative_prompt: str = None,
    ) -> ImageGenerationResponse:
        """Generate an image using Replicate"""

        # Get the model for this style
        model = self.models.get(style, self.models[ImageStyle.REALISTIC])

        # Enhance prompt based on style
        enhanced_prompt = self._enhance_prompt(prompt, style)

        # Default negative prompt
        if not negative_prompt:
            negative_prompt = "ugly, blurry, low quality, distorted, deformed"

        # Generate image
        try:
            output = self.client.run(
                model,
                input={
                    "prompt": enhanced_prompt,
                    "negative_prompt": negative_prompt,
                    "width": 1024,
                    "height": 1024,
                    "num_outputs": 1,
                },
            )

            # Get image URL (output format varies by model)
            if isinstance(output, list):
                image_url = output[0]
            else:
                image_url = str(output)

            return ImageGenerationResponse(image_url=image_url, style=style)
        except Exception as e:
            raise Exception(f"Image generation failed: {str(e)}")

    def _enhance_prompt(self, prompt: str, style: ImageStyle) -> str:
        """Enhance prompt based on style"""
        style_prefixes = {
            ImageStyle.MANGA: "anime style, manga illustration, ",
            ImageStyle.REALISTIC: "highly detailed, photorealistic, ",
            ImageStyle.BD: "comic book style, BD européenne, ligne claire, ",
            ImageStyle.COMIC: "comic book art, dynamic illustration, ",
            ImageStyle.WATERCOLOR: "watercolor painting, soft colors, artistic, ",
        }

        prefix = style_prefixes.get(style, "")
        return f"{prefix}{prompt}"
