"""
Hakawa API - Main application
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from app.api import (
    auth,
    projects,
    chapters,
    generation,
    images,
    exports,
    conversations,
    profiles,
    chatbot,
)
from app.utils.security import SECURITY_HEADERS, check_rate_limit
import time

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API pour la création de livres assistée par IA",
    debug=settings.app_debug,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware (protection contre Host Header Injection)
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "*.hakawa.com"]
)


# Middleware de sécurité global
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Ajoute les headers de sécurité et vérifie le rate limiting"""

    # Rate limiting
    await check_rate_limit(request)

    # Process request
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    # Ajouter headers de sécurité
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value

    # Ajouter temps de traitement
    response.headers["X-Process-Time"] = str(process_time)

    return response


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "message": "Bienvenue sur l'API Hakawa 🌙",
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["profiles"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(
    chapters.router, prefix="/api/projects/{project_id}/chapters", tags=["chapters"]
)
app.include_router(
    conversations.router, prefix="/api/conversations", tags=["conversations"]
)
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
app.include_router(chatbot.router)
app.include_router(exports.router, prefix="/api/exports", tags=["exports"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.app_debug)
