# 🚀 Plan de Migration Hakawa → IONOS + MySQL

## 📊 État des lieux

### Architecture actuelle (à migrer)
```
┌─────────────────────┐     ┌─────────────────────┐
│   Supabase Auth     │     │  Supabase Database  │
│   (Authentification)│     │    (PostgreSQL)     │
│   + OAuth Google    │     │    + RLS Policies   │
└─────────────────────┘     └─────────────────────┘
```

### Architecture cible
```
┌─────────────────────┐     ┌─────────────────────┐
│   JWT + bcrypt      │     │   IONOS MySQL       │
│   (Authentification)│     │   (Base de données) │
│   + OAuth Google    │     │   + Logique backend │
└─────────────────────┘     └─────────────────────┘
```

---

## 📋 Plan d'action en 7 phases

### Phase 1 : Choix de l'offre IONOS (Jour 1)

#### Option A : VPS Linux (Recommandé) ✅
| Offre | RAM | CPU | Stockage | Prix/mois |
|-------|-----|-----|----------|-----------|
| VPS Linux S | 2 Go | 1 vCore | 80 Go SSD | ~4€ |
| VPS Linux M | 4 Go | 2 vCores | 160 Go SSD | ~8€ |
| **VPS Linux L** | **8 Go** | **4 vCores** | **240 Go SSD** | **~15€** |

**→ VPS Linux L recommandé** pour Python + FastAPI + MySQL

#### Option B : Hébergement Web (Non recommandé ❌)
- L'hébergement web IONOS ne supporte pas Python/FastAPI nativement
- Nécessiterait des workarounds complexes

#### Actions :
- [ ] Commander VPS Linux L sur IONOS
- [ ] Choisir Ubuntu 22.04 LTS comme OS
- [ ] Noter l'IP et les accès SSH
- [ ] Commander un nom de domaine ou configurer un sous-domaine

---

### Phase 2 : Configuration du serveur IONOS (Jour 1-2)

```bash
# 1. Connexion SSH
ssh root@VOTRE_IP_IONOS

# 2. Mise à jour système
apt update && apt upgrade -y

# 3. Installation des dépendances
apt install -y python3.11 python3.11-venv python3-pip nginx mysql-server certbot python3-certbot-nginx git supervisor

# 4. Sécurisation MySQL
mysql_secure_installation

# 5. Création de l'utilisateur hakawa
adduser hakawa
usermod -aG sudo hakawa

# 6. Configuration du firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 3306/tcp  # MySQL (optionnel, seulement si accès externe)
ufw enable
```

#### Configuration MySQL :
```sql
-- Connexion à MySQL
mysql -u root -p

-- Création de la base et de l'utilisateur
CREATE DATABASE hakawa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hakawa_user'@'localhost' IDENTIFIED BY 'MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON hakawa_db.* TO 'hakawa_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### Phase 3 : Conversion du schéma PostgreSQL → MySQL (Jour 2-3)

#### Fichier : `migrations/001_initial_schema.sql`

```sql
-- ════════════════════════════════════════════════════
-- HAKAWA DATABASE SCHEMA - MySQL Version
-- ════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────
-- USERS (remplace auth.users de Supabase)
-- ────────────────────────────────────────────────────
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,
    
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- PROFILES (extension des users)
-- ────────────────────────────────────────────────────
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    subscription_tier ENUM('free', 'conteur', 'pro', 'studio') DEFAULT 'free',
    subscription_expires_at DATETIME,
    credits_illustrations INT DEFAULT 0,
    is_child_mode BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_profiles_user (user_id),
    INDEX idx_profiles_stripe (stripe_customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- PROJECTS (Livres)
-- ────────────────────────────────────────────────────
CREATE TABLE projects (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    
    -- Infos générales
    title VARCHAR(255) NOT NULL,
    pitch TEXT,
    genre VARCHAR(100),
    style ENUM('roman', 'manga', 'bd', 'comic', 'enfants', 'fantasy'),
    target_audience ENUM('children', 'young_adult', 'adult'),
    
    -- Personnages et univers (JSON au lieu de JSONB)
    characters JSON DEFAULT ('[]'),
    universe TEXT,
    themes JSON DEFAULT ('[]'),
    
    -- Progression
    status ENUM('draft', 'exploring', 'planning', 'writing', 'illustrating', 'exporting', 'published') DEFAULT 'draft',
    progress TINYINT UNSIGNED DEFAULT 0,
    
    -- Configuration KDP (JSON au lieu de JSONB)
    kdp_config JSON DEFAULT ('{"binding": "paperback", "trim_size": "6x9", "ink_type": "premium_color", "paper_type": "white"}'),
    
    -- Couverture
    cover_front_url TEXT,
    cover_back_url TEXT,
    cover_spine_text VARCHAR(255),
    
    -- Métadonnées
    word_count INT UNSIGNED DEFAULT 0,
    chapter_count INT UNSIGNED DEFAULT 0,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at DATETIME,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_projects_user (user_id),
    INDEX idx_projects_status (status),
    
    CONSTRAINT chk_progress CHECK (progress >= 0 AND progress <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- CHAPTERS
-- ────────────────────────────────────────────────────
CREATE TABLE chapters (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    
    number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    summary TEXT,
    
    word_count INT UNSIGNED DEFAULT 0,
    order_index INT DEFAULT 0,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chapter_number (project_id, number),
    INDEX idx_chapters_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- ILLUSTRATIONS
-- ────────────────────────────────────────────────────
CREATE TABLE illustrations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    chapter_id CHAR(36),
    
    prompt TEXT NOT NULL,
    style ENUM('manga', 'realistic', 'bd', 'comic', 'watercolor'),
    image_url TEXT NOT NULL,
    
    position_in_chapter INT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL,
    INDEX idx_illustrations_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- CONVERSATIONS (Chat créatif)
-- ────────────────────────────────────────────────────
CREATE TABLE conversations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    
    messages JSON DEFAULT ('[]'),
    phase ENUM('exploration', 'planning', 'writing'),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_conversations_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- EXPORTS
-- ────────────────────────────────────────────────────
CREATE TABLE exports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    project_id CHAR(36) NOT NULL,
    
    format ENUM('pdf', 'epub', 'kdp_interior', 'kdp_cover'),
    file_url TEXT NOT NULL,
    file_size INT UNSIGNED,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_exports_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- REFRESH TOKENS (pour JWT)
-- ────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_tokens_user (user_id),
    INDEX idx_refresh_tokens_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- SUBSCRIPTIONS (Stripe)
-- ────────────────────────────────────────────────────
CREATE TABLE subscriptions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    status ENUM('active', 'canceled', 'past_due', 'incomplete', 'trialing') DEFAULT 'incomplete',
    current_period_start DATETIME,
    current_period_end DATETIME,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_subscriptions_user (user_id),
    INDEX idx_subscriptions_stripe (stripe_subscription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────
-- AUDIT LOGS
-- ────────────────────────────────────────────────────
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id CHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### Phase 4 : Refactoring Backend - SQLAlchemy (Jour 3-5)

#### 4.1 Nouvelles dépendances (`requirements.txt`)

```txt
# ════════════════════════════════════════════════════
# HAKAWA BACKEND - DEPENDENCIES (MySQL Version)
# ════════════════════════════════════════════════════

# Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-dotenv==1.0.0

# Database - MySQL
sqlalchemy==2.0.23
pymysql==1.1.0
cryptography>=41.0.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
bcrypt==4.1.1

# Payments
stripe==11.2.0

# Validation
pydantic==2.5.2
pydantic-settings==2.1.0
email-validator==2.1.0

# AI Services
anthropic==0.7.7
replicate==0.22.0
httpx==0.24.1

# PDF & EPUB Generation
reportlab==4.0.7
weasyprint==60.1
ebooklib==0.18
Pillow==10.1.0

# Utilities
aiofiles==23.2.1
bleach>=6.1.0
```

#### 4.2 Configuration Database (`app/database.py`)

```python
"""
Database configuration - MySQL with SQLAlchemy
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# MySQL connection string
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.app_debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency pour obtenir une session DB"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

#### 4.3 Modèles ORM (`app/models/database.py`)

```python
"""
SQLAlchemy ORM Models
"""
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(Text)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime)
    
    # Relations
    profile = relationship("Profile", back_populates="user", uselist=False)
    projects = relationship("Project", back_populates="user")
    refresh_tokens = relationship("RefreshToken", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    subscription_tier = Column(Enum('free', 'conteur', 'pro', 'studio'), default='free')
    subscription_expires_at = Column(DateTime)
    credits_illustrations = Column(Integer, default=0)
    is_child_mode = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    stripe_customer_id = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="profile")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    pitch = Column(Text)
    genre = Column(String(100))
    style = Column(Enum('roman', 'manga', 'bd', 'comic', 'enfants', 'fantasy'))
    target_audience = Column(Enum('children', 'young_adult', 'adult'))
    characters = Column(JSON, default=[])
    universe = Column(Text)
    themes = Column(JSON, default=[])
    status = Column(Enum('draft', 'exploring', 'planning', 'writing', 'illustrating', 'exporting', 'published'), default='draft')
    progress = Column(Integer, default=0)
    kdp_config = Column(JSON, default={})
    cover_front_url = Column(Text)
    cover_back_url = Column(Text)
    cover_spine_text = Column(String(255))
    word_count = Column(Integer, default=0)
    chapter_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime)
    
    user = relationship("User", back_populates="projects")
    chapters = relationship("Chapter", back_populates="project", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="project", cascade="all, delete-orphan")

class Chapter(Base):
    __tablename__ = "chapters"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    summary = Column(Text)
    word_count = Column(Integer, default=0)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    project = relationship("Project", back_populates="chapters")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    messages = Column(JSON, default=[])
    phase = Column(Enum('exploration', 'planning', 'writing'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    project = relationship("Project", back_populates="conversations")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    revoked = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="refresh_tokens")
```

#### 4.4 Service d'authentification JWT (`app/services/auth_service.py`)

```python
"""
JWT Authentication Service - Remplace Supabase Auth
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database import User, Profile, RefreshToken
import uuid
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.secret_key = settings.jwt_secret_key
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 30
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def create_access_token(self, user_id: str, email: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "sub": user_id,
            "email": email,
            "exp": expire,
            "type": "access"
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(self, db: Session, user_id: str) -> str:
        token = str(uuid.uuid4())
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        expires_at = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        
        refresh_token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at
        )
        db.add(refresh_token)
        db.commit()
        
        return token
    
    def verify_token(self, token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None
    
    def register_user(self, db: Session, email: str, password: str, full_name: str = None) -> User:
        # Vérifier si l'email existe
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise ValueError("Email already registered")
        
        # Créer l'utilisateur
        user = User(
            email=email,
            password_hash=self.get_password_hash(password),
            full_name=full_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Créer le profil
        profile = Profile(user_id=user.id)
        db.add(profile)
        db.commit()
        
        return user
    
    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not self.verify_password(password, user.password_hash):
            return None
        
        # Mettre à jour last_login
        user.last_login = datetime.utcnow()
        db.commit()
        
        return user
    
    def get_user_by_id(self, db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

auth_service = AuthService()
```

#### 4.5 Exemple de refactoring API (`app/api/projects.py`)

```python
"""
Projects routes - MySQL/SQLAlchemy version
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.database import Project, Profile
from app.models.schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from app.utils.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all projects for current user"""
    projects = db.query(Project).filter(Project.user_id == current_user["id"]).all()
    return projects

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new project"""
    # Vérifier les limites selon l'abonnement
    profile = db.query(Profile).filter(Profile.user_id == current_user["id"]).first()
    project_count = db.query(Project).filter(Project.user_id == current_user["id"]).count()
    
    limits = {"free": 1, "conteur": 5, "pro": 50, "studio": 999}
    if project_count >= limits.get(profile.subscription_tier, 1):
        raise HTTPException(status_code=403, detail="Project limit reached")
    
    db_project = Project(
        user_id=current_user["id"],
        **project.model_dump()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get a specific project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user["id"]
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user["id"]
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project_update.model_dump(exclude_unset=True).items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    
    return project

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a project"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user["id"]
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    
    return {"message": "Project deleted successfully"}
```

---

### Phase 5 : Refactoring Frontend (Jour 5-6)

#### 5.1 Nouveau service API (`src/services/api.js`)

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.hakawa.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem('access_token', data.access_token);
          error.config.headers.Authorization = `Bearer ${data.access_token}`;
          return api.request(error.config);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### 5.2 Nouveau AuthContext (`src/contexts/AuthContext.jsx`)

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data.user);
        setProfile(data.profile);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  const signUp = async (email, password, fullName) => {
    try {
      const { data } = await api.post('/api/auth/register', {
        email,
        password,
        full_name: fullName,
      });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      setProfile(data.profile);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      setProfile(data.profile);
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setProfile(null);
  };

  const isAdmin = () => {
    return profile?.is_admin === true;
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### Phase 6 : Déploiement sur IONOS (Jour 6-7)

#### 6.1 Structure des fichiers sur le serveur

```
/home/hakawa/
├── backend/
│   ├── app/
│   ├── venv/
│   ├── .env
│   └── requirements.txt
├── frontend/
│   └── dist/
└── exports/
```

#### 6.2 Configuration Nginx (`/etc/nginx/sites-available/hakawa`)

```nginx
# Frontend
server {
    listen 80;
    server_name hakawa.app www.hakawa.app;
    
    root /home/hakawa/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6.3 Configuration Supervisor (`/etc/supervisor/conf.d/hakawa.conf`)

```ini
[program:hakawa-api]
command=/home/hakawa/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
directory=/home/hakawa/backend
user=hakawa
autostart=true
autorestart=true
stderr_logfile=/var/log/hakawa/api.err.log
stdout_logfile=/var/log/hakawa/api.out.log
environment=
    PYTHONPATH="/home/hakawa/backend",
    DB_HOST="localhost",
    DB_PORT="3306",
    DB_NAME="hakawa_db",
    DB_USER="hakawa_user",
    DB_PASSWORD="MOT_DE_PASSE",
    JWT_SECRET_KEY="VOTRE_SECRET_JWT"
```

#### 6.4 Script de déploiement (`deploy.sh`)

```bash
#!/bin/bash
set -e

echo "🚀 Déploiement Hakawa..."

# Backend
cd /home/hakawa/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
supervisorctl restart hakawa-api

# Frontend
cd /home/hakawa/frontend
git pull origin main
npm install
npm run build

# Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Déploiement terminé!"
```

#### 6.5 SSL avec Let's Encrypt

```bash
# Installer le certificat SSL
sudo certbot --nginx -d hakawa.app -d www.hakawa.app -d api.hakawa.app

# Renouvellement automatique (déjà configuré par certbot)
sudo certbot renew --dry-run
```

---

### Phase 7 : Tests et Go-Live (Jour 7-8)

#### Checklist de déploiement

- [ ] Base MySQL créée et migrée
- [ ] Backend déployé et accessible via API
- [ ] Frontend buildé et servi par Nginx
- [ ] SSL configuré (HTTPS)
- [ ] Variables d'environnement configurées
- [ ] Stripe webhooks configurés avec nouvelle URL
- [ ] Tests inscription/connexion
- [ ] Tests création projet/chapitres
- [ ] Tests génération IA
- [ ] Tests export PDF/EPUB
- [ ] Tests paiement Stripe
- [ ] Monitoring configuré (optionnel)
- [ ] Backups MySQL automatisés

---

## 📁 Fichier .env Backend

```env
# App
APP_NAME=Hakawa
APP_VERSION=1.0.0
APP_DEBUG=false

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hakawa_db
DB_USER=hakawa_user
DB_PASSWORD=MOT_DE_PASSE_FORT

# JWT
JWT_SECRET_KEY=GENERER_UNE_CLE_SECRETE_DE_64_CARACTERES

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
REPLICATE_API_TOKEN=r8_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Frontend URL
FRONTEND_URL=https://hakawa.app

# Exports
EXPORTS_LOCAL_DIR=/home/hakawa/exports
```

---

## ⏱️ Estimation du temps

| Phase | Durée | Effort |
|-------|-------|--------|
| Phase 1 : Choix IONOS | 1 jour | Faible |
| Phase 2 : Config serveur | 1-2 jours | Moyen |
| Phase 3 : Schéma MySQL | 1 jour | Moyen |
| Phase 4 : Refactoring Backend | 2-3 jours | **Élevé** |
| Phase 5 : Refactoring Frontend | 1-2 jours | Moyen |
| Phase 6 : Déploiement | 1 jour | Moyen |
| Phase 7 : Tests | 1 jour | Moyen |

**Total estimé : 8-12 jours de travail**

---

## ⚠️ Points d'attention

1. **OAuth Google** : Tu devras configurer les credentials Google OAuth séparément (sans Supabase)
2. **RLS** : La sécurité Row-Level est maintenant dans le code, pas dans la DB
3. **Backups** : Configure des backups MySQL automatiques (mysqldump + cron)
4. **Monitoring** : Considère ajouter un outil comme Sentry pour les erreurs

---

## 🔗 Ressources utiles

- [IONOS VPS Documentation](https://www.ionos.fr/assistance/serveur-cloud/)
- [FastAPI + SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [Let's Encrypt + Nginx](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)
