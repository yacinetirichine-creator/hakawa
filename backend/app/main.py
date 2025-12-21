"""
Hakawa API - Main application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, projects, chapters, generation, images, exports

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
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(
    chapters.router, prefix="/api/projects/{project_id}/chapters", tags=["chapters"]
)
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
app.include_router(exports.router, prefix="/api/exports", tags=["exports"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=settings.app_debug)
