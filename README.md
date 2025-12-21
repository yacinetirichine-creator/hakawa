# 🌙 HAKAWA

> **L'art de raconter, réinventé**

Hakawa est une plateforme de création de livres assistée par IA. De l'idée brute au livre publié sur Amazon KDP, Hakawa accompagne auteurs, parents et créateurs dans leur voyage créatif.

---

## ✨ Fonctionnalités

- **💬 Atelier Créatif** : Chat conversationnel pour développer tes idées
- **📐 Modélisation** : Structure ton récit avec personnages et chapitres
- **✍️ Écriture Assistée** : L'IA t'aide à écrire, tu restes aux commandes
- **🎨 Illustrations IA** : Génère des images manga, BD, réalistes...
- **📚 Export KDP** : PDF prêts pour Amazon, EPUB pour Kindle
- **👶 Mode Enfant** : Interface simplifiée pour les plus jeunes

---

## 🎭 L'Histoire de Hakawa

**Hakawa** vient de l'arabe **الحكواتي** (Al-Hakawati), le Conteur traditionnel du monde arabe.

Dans les cafés de Bagdad, Damas et Le Caire, les Hakawatis captivaient les foules avec les récits des **Mille et Une Nuits**. Comme **Shéhérazade** qui sauva sa vie en racontant des histoires, Hakawa t'aide à donner vie aux tiennes.

---

## 📁 Structure du Projet

```
hakawa/
├── docs/           # Documentation complète
│   ├── BRAND_BOOK.md       # Identité de marque
│   ├── UI_UX_GUIDE.md      # Guide design
│   ├── BUSINESS_PLAN.md    # Stratégie commerciale
│   └── TECH_SPECS.md       # Spécifications techniques
├── frontend/       # Application React
├── backend/        # API FastAPI
└── supabase/       # Configuration base de données
```

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Python 3.11+
- Compte Supabase
- Clés API : Anthropic, Replicate

### Installation

```bash
# 1. Cloner
git clone https://github.com/yourusername/hakawa.git
cd hakawa

# 2. Backend
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
cp .env.example .env  # Éditer avec vos clés

# 3. Frontend
cd ../frontend
npm install
cp .env.example .env

# 4. Lancer
# Terminal 1:
cd backend && uvicorn app.main:app --reload

# Terminal 2:
cd frontend && npm run dev
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Brand Book](docs/BRAND_BOOK.md) | Identité visuelle, couleurs, typographie |
| [UI/UX Guide](docs/UI_UX_GUIDE.md) | Composants, wireframes, design system |
| [Business Plan](docs/BUSINESS_PLAN.md) | Stratégie, pricing, roadmap |
| [Tech Specs](docs/TECH_SPECS.md) | Architecture, API, base de données |

---

## 🎨 Palette de Couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| 🌙 Bleu Nuit | `#0F1B2E` | Fond principal |
| ✨ Or | `#D4A853` | Accents, boutons |
| 🏜️ Sable | `#E8DCC4` | Fonds clairs |
| 📜 Parchemin | `#F5F0E6` | Cartes, texte |

---

## 🛠️ Stack Technique

- **Frontend** : React 18, Vite, Tailwind CSS
- **Backend** : FastAPI, Python 3.11
- **Database** : Supabase (PostgreSQL)
- **IA Texte** : Anthropic Claude
- **IA Images** : Replicate (Flux, SDXL, Anything v4)
- **Exports** : ReportLab, WeasyPrint, ebooklib

---

## 📝 Licence

Projet privé - Tous droits réservés © 2025

---

## 🙏 Crédits

- Inspiré par la tradition des Hakawatis arabes
- Anthropic Claude pour la génération de texte
- Replicate pour la génération d'images

---

*Hakawa - L'art de raconter, réinventé 🌙*
