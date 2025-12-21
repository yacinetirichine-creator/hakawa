# 🛠️ HAKAWA - Spécifications Techniques

## Guide de Développement VS Code

---

## 📋 Vue d'Ensemble du Projet

### Stack Technique

```
FRONTEND
════════════════════════════════════════════════════
Framework:      React 18 + Vite
Styling:        Tailwind CSS 3.4
Routing:        React Router 6
State:          Zustand (léger) ou React Query
Animations:     Framer Motion
Icons:          Lucide React
Forms:          React Hook Form + Zod
HTTP:           Axios

BACKEND
════════════════════════════════════════════════════
Framework:      FastAPI (Python 3.11+)
Database:       Supabase (PostgreSQL)
Auth:           Supabase Auth
Storage:        Supabase Storage
ORM:            SQLAlchemy + Supabase Client
Validation:     Pydantic v2

SERVICES IA
════════════════════════════════════════════════════
Texte:          Anthropic Claude (claude-sonnet-4-20250514)
Images:         Replicate (multi-modèles)
  - Manga:      anything-v4
  - Réaliste:   flux-1.1-pro
  - BD:         sdxl

EXPORTS
════════════════════════════════════════════════════
PDF:            ReportLab + WeasyPrint
EPUB:           ebooklib
Couverture:     Pillow + ReportLab

INFRASTRUCTURE
════════════════════════════════════════════════════
Hosting:        Vercel (Frontend) + Railway/Render (Backend)
CDN:            Cloudflare
Monitoring:     Sentry
Analytics:      Plausible (privacy-friendly)
```

---

## 📁 Structure du Projet

```
hakawa/
├── 📁 docs/                          # Documentation
│   ├── BRAND_BOOK.md
│   ├── UI_UX_GUIDE.md
│   ├── BUSINESS_PLAN.md
│   └── TECH_SPECS.md
│
├── 📁 frontend/                      # Application React
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── 📁 images/
│   │       ├── hero-stars.svg
│   │       ├── dunes.svg
│   │       └── patterns/
│   │
│   ├── 📁 src/
│   │   ├── 📁 assets/               # Images, fonts, etc.
│   │   │   ├── 📁 icons/
│   │   │   └── 📁 illustrations/
│   │   │
│   │   ├── 📁 components/           # Composants réutilisables
│   │   │   ├── 📁 ui/               # Composants de base
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── 📁 layout/           # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   │
│   │   │   ├── 📁 chat/             # Chat créatif
│   │   │   │   ├── ChatContainer.jsx
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   └── Suggestions.jsx
│   │   │   │
│   │   │   ├── 📁 editor/           # Éditeur de texte
│   │   │   │   ├── ChapterEditor.jsx
│   │   │   │   ├── Toolbar.jsx
│   │   │   │   └── AssistantPanel.jsx
│   │   │   │
│   │   │   ├── 📁 project/          # Gestion projets
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   └── ProjectSettings.jsx
│   │   │   │
│   │   │   └── 📁 decorative/       # Éléments décoratifs
│   │   │       ├── Stars.jsx
│   │   │       ├── Lantern.jsx
│   │   │       └── Arabesque.jsx
│   │   │
│   │   ├── 📁 pages/                # Pages de l'app
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── 📁 create/
│   │   │   │   ├── NewProject.jsx
│   │   │   │   ├── Explore.jsx
│   │   │   │   ├── Plan.jsx
│   │   │   │   ├── Write.jsx
│   │   │   │   └── Export.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Pricing.jsx
│   │   │
│   │   ├── 📁 hooks/                # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProject.js
│   │   │   ├── useChat.js
│   │   │   └── useGeneration.js
│   │   │
│   │   ├── 📁 services/             # API calls
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   ├── generation.js
│   │   │   └── exports.js
│   │   │
│   │   ├── 📁 stores/               # State management
│   │   │   ├── authStore.js
│   │   │   ├── projectStore.js
│   │   │   └── uiStore.js
│   │   │
│   │   ├── 📁 styles/               # CSS global
│   │   │   ├── index.css
│   │   │   ├── fonts.css
│   │   │   └── animations.css
│   │   │
│   │   ├── 📁 utils/                # Helpers
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── 📁 backend/                       # API FastAPI
│   ├── 📁 app/
│   │   ├── __init__.py
│   │   ├── main.py                  # Point d'entrée
│   │   ├── config.py                # Configuration
│   │   │
│   │   ├── 📁 api/                  # Routes API
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── chapters.py
│   │   │   ├── generation.py
│   │   │   ├── images.py
│   │   │   └── exports.py
│   │   │
│   │   ├── 📁 models/               # Modèles de données
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── chapter.py
│   │   │   ├── illustration.py
│   │   │   └── schemas.py           # Pydantic schemas
│   │   │
│   │   ├── 📁 services/             # Logique métier
│   │   │   ├── __init__.py
│   │   │   ├── ai_service.py        # Claude API
│   │   │   ├── image_service.py     # Replicate API
│   │   │   ├── export_service.py    # PDF/EPUB
│   │   │   └── project_service.py
│   │   │
│   │   ├── 📁 prompts/              # Prompts IA
│   │   │   ├── exploration.py
│   │   │   ├── planning.py
│   │   │   ├── writing.py
│   │   │   └── illustration.py
│   │   │
│   │   └── 📁 utils/                # Helpers
│   │       ├── __init__.py
│   │       ├── supabase.py
│   │       └── kdp.py               # Specs KDP
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── 📁 supabase/                      # Configuration Supabase
│   ├── 📁 migrations/
│   └── config.toml
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

## 🗄️ Schéma Base de Données (Supabase)

```sql
-- ════════════════════════════════════════════════════
-- HAKAWA DATABASE SCHEMA
-- ════════════════════════════════════════════════════

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────
-- USERS (géré par Supabase Auth, extension)
-- ────────────────────────────────────────────────────
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'conteur', 'pro', 'studio')),
    subscription_expires_at TIMESTAMPTZ,
    credits_illustrations INTEGER DEFAULT 0,
    is_child_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- PROJECTS (Livres)
-- ────────────────────────────────────────────────────
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Infos générales
    title TEXT NOT NULL,
    pitch TEXT,
    genre TEXT,
    style TEXT CHECK (style IN ('roman', 'manga', 'bd', 'comic', 'enfants', 'fantasy')),
    target_audience TEXT CHECK (target_audience IN ('children', 'young_adult', 'adult')),
    
    -- Personnages et univers
    characters JSONB DEFAULT '[]',
    universe TEXT,
    themes TEXT[],
    
    -- Progression
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'exploring', 'planning', 'writing', 'illustrating', 'exporting', 'published')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Configuration KDP
    kdp_config JSONB DEFAULT '{
        "binding": "paperback",
        "trim_size": "6x9",
        "ink_type": "premium_color",
        "paper_type": "white"
    }',
    
    -- Couverture
    cover_front_url TEXT,
    cover_back_url TEXT,
    cover_spine_text TEXT,
    
    -- Métadonnées
    word_count INTEGER DEFAULT 0,
    chapter_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────
-- CHAPTERS
-- ────────────────────────────────────────────────────
CREATE TABLE public.chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Contenu
    number INTEGER NOT NULL,
    title TEXT,
    summary TEXT,
    content TEXT,
    
    -- Métadonnées
    word_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'edited', 'final')),
    
    -- Pour la génération IA
    generation_context JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, number)
);

-- ────────────────────────────────────────────────────
-- ILLUSTRATIONS
-- ────────────────────────────────────────────────────
CREATE TABLE public.illustrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    
    -- Image
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    prompt TEXT,
    negative_prompt TEXT,
    
    -- Métadonnées génération
    model TEXT,
    style TEXT,
    width INTEGER,
    height INTEGER,
    
    -- Position dans le livre
    position TEXT CHECK (position IN ('chapter_start', 'inline', 'full_page', 'cover_front', 'cover_back')),
    caption TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- CONVERSATION HISTORY (Chat créatif)
-- ────────────────────────────────────────────────────
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Phase de conversation
    phase TEXT CHECK (phase IN ('exploration', 'planning', 'writing', 'illustration')),
    
    -- Messages
    messages JSONB DEFAULT '[]',
    -- Format: [{ role: 'user'|'assistant', content: string, timestamp: ISO }]
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────
-- EXPORTS
-- ────────────────────────────────────────────────────
CREATE TABLE public.exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    
    -- Type d'export
    format TEXT NOT NULL CHECK (format IN ('pdf_interior', 'pdf_cover', 'epub', 'mobi', 'full_kdp')),
    
    -- Fichier
    file_url TEXT,
    file_size INTEGER,
    
    -- Configuration utilisée
    config JSONB,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ────────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────────
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_chapters_project_id ON public.chapters(project_id);
CREATE INDEX idx_illustrations_project_id ON public.illustrations(project_id);
CREATE INDEX idx_conversations_project_id ON public.conversations(project_id);
CREATE INDEX idx_exports_project_id ON public.exports(project_id);

-- ────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.illustrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Policies : Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own chapters" ON public.chapters FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = chapters.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own illustrations" ON public.illustrations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = illustrations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own conversations" ON public.conversations FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = conversations.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "Users can CRUD own exports" ON public.exports FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = exports.project_id AND projects.user_id = auth.uid()));

-- ────────────────────────────────────────────────────
-- FUNCTIONS
-- ────────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🔌 API Endpoints

```yaml
# ════════════════════════════════════════════════════
# HAKAWA API - ENDPOINTS
# ════════════════════════════════════════════════════

# ────────────────────────────────────────────────────
# AUTH (via Supabase, mais wrapper)
# ────────────────────────────────────────────────────
POST   /api/auth/register          # Inscription
POST   /api/auth/login             # Connexion
POST   /api/auth/logout            # Déconnexion
POST   /api/auth/refresh           # Refresh token
GET    /api/auth/me                # User actuel

# ────────────────────────────────────────────────────
# PROJECTS
# ────────────────────────────────────────────────────
GET    /api/projects               # Liste mes projets
POST   /api/projects               # Créer un projet
GET    /api/projects/:id           # Détails d'un projet
PUT    /api/projects/:id           # Modifier un projet
DELETE /api/projects/:id           # Supprimer un projet

# ────────────────────────────────────────────────────
# CHAPTERS
# ────────────────────────────────────────────────────
GET    /api/projects/:id/chapters           # Liste chapitres
POST   /api/projects/:id/chapters           # Créer chapitre
GET    /api/projects/:id/chapters/:num      # Détails chapitre
PUT    /api/projects/:id/chapters/:num      # Modifier chapitre
DELETE /api/projects/:id/chapters/:num      # Supprimer chapitre
POST   /api/projects/:id/chapters/reorder   # Réordonner

# ────────────────────────────────────────────────────
# GENERATION IA
# ────────────────────────────────────────────────────
POST   /api/generate/chat          # Chat créatif (streaming)
  Body: { project_id, phase, message }
  
POST   /api/generate/plan          # Générer plan du livre
  Body: { project_id }
  
POST   /api/generate/chapter       # Générer contenu chapitre
  Body: { project_id, chapter_number, instructions? }
  
POST   /api/generate/improve       # Améliorer texte
  Body: { text, instruction }

# ────────────────────────────────────────────────────
# ILLUSTRATIONS
# ────────────────────────────────────────────────────
GET    /api/projects/:id/illustrations         # Liste illustrations
POST   /api/projects/:id/illustrations         # Générer illustration
  Body: { chapter_id?, prompt?, style?, position }
  
DELETE /api/projects/:id/illustrations/:illus_id  # Supprimer

POST   /api/generate/cover         # Générer couverture
  Body: { project_id, style }

# ────────────────────────────────────────────────────
# EXPORTS
# ────────────────────────────────────────────────────
POST   /api/projects/:id/export/pdf-interior   # Export PDF intérieur
POST   /api/projects/:id/export/pdf-cover      # Export PDF couverture
POST   /api/projects/:id/export/epub           # Export EPUB
POST   /api/projects/:id/export/kdp-full       # Export complet KDP

GET    /api/exports/:export_id     # Status/download export
GET    /api/exports/:export_id/download  # Télécharger fichier

# ────────────────────────────────────────────────────
# USER / SETTINGS
# ────────────────────────────────────────────────────
GET    /api/user/profile           # Mon profil
PUT    /api/user/profile           # Modifier profil
GET    /api/user/usage             # Usage (générations, etc.)
GET    /api/user/subscription      # Infos abonnement
```

---

## 🎨 Configuration Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales Hakawa
        night: {
          DEFAULT: '#0F1B2E',
          light: '#1E3A5F',
          dark: '#0A1220',
        },
        gold: {
          DEFAULT: '#D4A853',
          light: '#E8C97D',
          dark: '#B87333',
        },
        sand: {
          DEFAULT: '#E8DCC4',
          light: '#F5F0E6',
          dark: '#D4C4A8',
        },
        parchment: '#FFFEF9',
        mystery: '#4A3B6B',
        oasis: '#2D5A4A',
        ruby: '#9B2335',
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-night': 'linear-gradient(135deg, #0F1B2E 0%, #1E3A5F 50%, #4A3B6B 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A853 0%, #B87333 100%)',
        'gradient-twilight': 'linear-gradient(180deg, #0F1B2E 0%, #1E3A5F 100%)',
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'lantern': 'lantern 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        lantern: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 168, 83, 0.3)',
        'glow-lg': '0 0 40px rgba(212, 168, 83, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

---

## 📦 Package.json (Frontend)

```json
{
  "name": "hakawa-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.8.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.292.0",
    "react-hot-toast": "^2.4.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/forms": "^0.5.7",
    "vite": "^5.0.0"
  }
}
```

---

## 📦 Requirements.txt (Backend)

```
# ════════════════════════════════════════════════════
# HAKAWA BACKEND - DEPENDENCIES
# ════════════════════════════════════════════════════

# Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-dotenv==1.0.0

# Database
supabase==2.0.3
asyncpg==0.29.0

# Validation
pydantic==2.5.2
pydantic-settings==2.1.0
email-validator==2.1.0

# AI Services
anthropic==0.7.7
replicate==0.22.0
httpx==0.25.2

# PDF & EPUB Generation
reportlab==4.0.7
weasyprint==60.1
ebooklib==0.18
Pillow==10.1.0

# Utilities
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
aiofiles==23.2.1

# Dev
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
```

---

## 🔧 Variables d'Environnement

```bash
# ════════════════════════════════════════════════════
# HAKAWA - ENVIRONMENT VARIABLES
# ════════════════════════════════════════════════════

# ────────────────────────────────────────────────────
# SUPABASE
# ────────────────────────────────────────────────────
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_KEY=eyJxxxxx

# ────────────────────────────────────────────────────
# AI SERVICES
# ────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
REPLICATE_API_TOKEN=r8_xxxxx

# ────────────────────────────────────────────────────
# APPLICATION
# ────────────────────────────────────────────────────
APP_ENV=development
APP_DEBUG=true
APP_SECRET_KEY=your-secret-key-here

# Frontend URL (pour CORS)
FRONTEND_URL=http://localhost:5173

# ────────────────────────────────────────────────────
# STRIPE (Paiements)
# ────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_CONTEUR=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_STUDIO=price_xxxxx

# ────────────────────────────────────────────────────
# STORAGE
# ────────────────────────────────────────────────────
# Supabase Storage est utilisé, pas besoin de config supplémentaire

# ────────────────────────────────────────────────────
# MONITORING
# ────────────────────────────────────────────────────
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 🚀 Commands de Démarrage

```bash
# ════════════════════════════════════════════════════
# INSTALLATION & DÉMARRAGE
# ════════════════════════════════════════════════════

# ────────────────────────────────────────────────────
# 1. CLONER LE REPO
# ────────────────────────────────────────────────────
git clone https://github.com/yourusername/hakawa.git
cd hakawa

# ────────────────────────────────────────────────────
# 2. CONFIGURER LES VARIABLES D'ENVIRONNEMENT
# ────────────────────────────────────────────────────
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Éditer les fichiers avec vos clés

# ────────────────────────────────────────────────────
# 3. BACKEND
# ────────────────────────────────────────────────────
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Mac/Linux)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn app.main:app --reload --port 8000

# ────────────────────────────────────────────────────
# 4. FRONTEND (nouveau terminal)
# ────────────────────────────────────────────────────
cd frontend

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# ────────────────────────────────────────────────────
# 5. ACCÉDER À L'APPLICATION
# ────────────────────────────────────────────────────
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 📋 Checklist Développement

### Phase 1 - MVP (2-3 semaines)

- [ ] Setup projet (Vite, Tailwind, FastAPI)
- [ ] Supabase (auth, database)
- [ ] Landing page
- [ ] Auth (login, register)
- [ ] Dashboard projets
- [ ] Création projet basique
- [ ] Chat créatif (exploration)
- [ ] Génération plan
- [ ] Écriture chapitre simple
- [ ] Export PDF basique

### Phase 2 - v1.0 (3-4 semaines)

- [ ] Mode enfant
- [ ] Génération illustrations
- [ ] Éditeur de chapitre complet
- [ ] Export KDP complet
- [ ] Export EPUB
- [ ] Abonnements Stripe
- [ ] Profil utilisateur

### Phase 3 - Growth (ongoing)

- [ ] Multi-langue
- [ ] App mobile PWA
- [ ] Templates
- [ ] API publique
- [ ] Analytics

---

*Document créé pour Hakawa - Version 1.0*
*L'art de raconter, réinventé 🌙*
