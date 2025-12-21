"""
Pydantic schemas for API validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class SubscriptionTier(str, Enum):
    FREE = "free"
    CONTEUR = "conteur"
    PRO = "pro"
    STUDIO = "studio"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    EXPLORING = "exploring"
    PLANNING = "planning"
    WRITING = "writing"
    ILLUSTRATING = "illustrating"
    EXPORTING = "exporting"
    PUBLISHED = "published"


class ProjectStyle(str, Enum):
    ROMAN = "roman"
    MANGA = "manga"
    BD = "bd"
    COMIC = "comic"
    ENFANTS = "enfants"
    FANTASY = "fantasy"


class TargetAudience(str, Enum):
    CHILDREN = "children"
    YOUNG_ADULT = "young_adult"
    ADULT = "adult"


# User Schemas
class UserProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    credits_illustrations: int = 0
    is_child_mode: bool = False
    created_at: datetime
    updated_at: datetime


# Project Schemas
class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    pitch: Optional[str] = None
    genre: Optional[str] = None
    style: Optional[ProjectStyle] = None
    target_audience: Optional[TargetAudience] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    pitch: Optional[str] = None
    genre: Optional[str] = None
    style: Optional[ProjectStyle] = None
    target_audience: Optional[TargetAudience] = None
    status: Optional[ProjectStatus] = None
    characters: Optional[List[dict]] = None
    universe: Optional[str] = None
    themes: Optional[List[str]] = None


class Project(BaseModel):
    id: str
    user_id: str
    title: str
    pitch: Optional[str] = None
    genre: Optional[str] = None
    style: Optional[ProjectStyle] = None
    target_audience: Optional[TargetAudience] = None
    characters: List[dict] = []
    universe: Optional[str] = None
    themes: List[str] = []
    status: ProjectStatus = ProjectStatus.DRAFT
    progress: int = 0
    word_count: int = 0
    chapter_count: int = 0
    cover_front_url: Optional[str] = None
    cover_back_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Chapter Schemas
class ChapterCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    summary: Optional[str] = None


class ChapterUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    summary: Optional[str] = None


class Chapter(BaseModel):
    id: str
    project_id: str
    number: int
    title: str
    content: Optional[str] = None
    summary: Optional[str] = None
    word_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Generation Schemas
class GenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    context: Optional[str] = None
    max_tokens: int = Field(default=2000, ge=100, le=4000)


class GenerationResponse(BaseModel):
    text: str
    tokens_used: int


# Image Generation Schemas
class ImageStyle(str, Enum):
    MANGA = "manga"
    REALISTIC = "realistic"
    BD = "bd"
    COMIC = "comic"
    WATERCOLOR = "watercolor"


class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    style: ImageStyle = ImageStyle.REALISTIC
    negative_prompt: Optional[str] = None


class ImageGenerationResponse(BaseModel):
    image_url: str
    style: ImageStyle
