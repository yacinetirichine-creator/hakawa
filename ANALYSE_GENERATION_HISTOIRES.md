# 🔴 Analyse : Génération d'histoires non fonctionnelle

## 📋 Résumé des problèmes

| Problème | Gravité | Localisation |
|----------|---------|--------------|
| `generationService.writeChapter()` n'existe pas | 🔴 Critique | Frontend |
| `generationService.generatePlan()` n'existe pas | 🔴 Critique | Frontend |
| Pas d'endpoint API pour générer un plan | 🔴 Critique | Backend |
| Pas d'endpoint API pour écrire un chapitre | 🔴 Critique | Backend |
| Incohérence paramètres chaptersService | 🟡 Moyen | Frontend |

---

## 🔍 Détail des problèmes

### Problème 1 : `generationService.writeChapter()` manquant

**Fichier** : `frontend/src/pages/create/Write.jsx` (ligne 97)

```javascript
// APPELÉ MAIS N'EXISTE PAS !
const generatedContent = await generationService.writeChapter(
  currentChapter.id,
  user.id
);
```

**Service actuel** (`frontend/src/services/generation.js`) :
```javascript
export const generationService = {
  generateText: async (prompt, context, maxTokens = 2000) => { ... },
  continueText: async (text, maxTokens = 500) => { ... },  // Mal configuré
  improveText: async (text, instruction) => { ... },       // Mal configuré
  // ❌ writeChapter() MANQUANT
  // ❌ generatePlan() MANQUANT
};
```

---

### Problème 2 : `generationService.generatePlan()` manquant

**Fichier** : `frontend/src/pages/create/Plan.jsx` (ligne 65)

```javascript
// APPELÉ MAIS N'EXISTE PAS !
const newChapters = await generationService.generatePlan(
  projectId,
  user.id
);
```

---

### Problème 3 : Endpoints Backend manquants

L'API backend (`backend/app/api/generation.py`) n'a que :
- `POST /generation/text` - Génération générique
- `POST /generation/continue` - Continuer un texte
- `POST /generation/improve` - Améliorer un texte

**Manquants** :
- ❌ `POST /generation/plan` - Générer un plan de chapitres
- ❌ `POST /generation/chapter` - Écrire/générer un chapitre

---

### Problème 4 : Mauvais paramètres dans continueText/improveText

```javascript
// FRONTEND - Envoie en query params
continueText: async (text, maxTokens = 500) => {
  const response = await api.post("/generation/continue", null, {
    params: { text, max_tokens: maxTokens },  // ❌ Query params
  });
  ...
}
```

```python
# BACKEND - Attend en query params MAIS mal typé
@router.post("/continue")
async def continue_writing(
    text: str,  # ❌ FastAPI attend ça en query param, OK
    max_tokens: int = 500,
    ...
):
```

Le problème : FastAPI attend ces paramètres comme query string mais le corps est vide (`null`), ce qui peut causer des problèmes.

---

## ✅ Corrections à apporter

### 1. Backend : Ajouter les endpoints manquants

**Fichier** : `backend/app/api/generation.py`

```python
"""
Text generation routes - VERSION CORRIGÉE
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.models.schemas import GenerationRequest, GenerationResponse
from app.services.ai_service import AIService
from app.utils.admin import get_user_profile, assert_project_access
from app.utils.supabase import supabase

router = APIRouter()
ai_service = AIService()


# ═══════════════════════════════════════════════════════════════
# SCHEMAS ADDITIONNELS
# ═══════════════════════════════════════════════════════════════

class PlanGenerationRequest(BaseModel):
    project_id: str
    num_chapters: int = 10
    
class ChapterGenerationRequest(BaseModel):
    chapter_id: str
    instruction: Optional[str] = None
    
class ContinueRequest(BaseModel):
    text: str
    max_tokens: int = 500

class ImproveRequest(BaseModel):
    text: str
    instruction: str = "Améliore ce texte"


# ═══════════════════════════════════════════════════════════════
# ENDPOINTS EXISTANTS (CORRIGÉS)
# ═══════════════════════════════════════════════════════════════

@router.post("/text", response_model=GenerationResponse)
async def generate_text(
    request: GenerationRequest, 
    profile: dict = Depends(get_user_profile)
):
    """Generate text using Claude AI"""
    try:
        result = await ai_service.generate_text(
            prompt=request.prompt,
            context=request.context,
            max_tokens=request.max_tokens,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/continue", response_model=GenerationResponse)
async def continue_writing(
    request: ContinueRequest,
    profile: dict = Depends(get_user_profile)
):
    """Continue writing from existing text"""
    try:
        result = await ai_service.continue_text(request.text, request.max_tokens)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/improve", response_model=GenerationResponse)
async def improve_text(
    request: ImproveRequest,
    profile: dict = Depends(get_user_profile),
):
    """Improve existing text"""
    try:
        result = await ai_service.improve_text(request.text, request.instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════
# NOUVEAUX ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@router.post("/plan")
async def generate_plan(
    request: PlanGenerationRequest,
    profile: dict = Depends(get_user_profile)
):
    """
    Génère un plan de chapitres pour un projet
    Retourne une liste de chapitres créés
    """
    try:
        # Vérifier l'accès au projet
        assert_project_access(profile, request.project_id)
        
        # Récupérer le projet pour le contexte
        project_result = supabase.table("projects").select("*").eq("id", request.project_id).execute()
        if not project_result.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = project_result.data[0]
        
        # Construire le prompt pour générer le plan
        prompt = f"""Tu es un expert en structure narrative. Génère un plan détaillé pour ce livre :

Titre : {project.get('title', 'Sans titre')}
Pitch : {project.get('pitch', 'Non défini')}
Genre : {project.get('genre', 'Non défini')}
Style : {project.get('style', 'roman')}
Public cible : {project.get('target_audience', 'adult')}

Génère exactement {request.num_chapters} chapitres.

Pour chaque chapitre, donne :
1. Un titre accrocheur
2. Un résumé de 2-3 phrases

Format ta réponse EXACTEMENT comme ceci (JSON) :
[
  {{"title": "Titre du chapitre 1", "summary": "Résumé du chapitre 1..."}},
  {{"title": "Titre du chapitre 2", "summary": "Résumé du chapitre 2..."}},
  ...
]

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans texte avant ou après."""

        # Générer le plan avec l'IA
        result = await ai_service.generate_text(prompt=prompt, max_tokens=2000)
        
        # Parser la réponse JSON
        import json
        try:
            # Nettoyer la réponse (enlever les backticks markdown si présents)
            text = result.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            chapters_data = json.loads(text.strip())
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500, 
                detail="Erreur de parsing du plan généré. Veuillez réessayer."
            )
        
        # Supprimer les anciens chapitres
        supabase.table("chapters").delete().eq("project_id", request.project_id).execute()
        
        # Créer les nouveaux chapitres
        created_chapters = []
        for i, ch in enumerate(chapters_data, 1):
            chapter_data = {
                "project_id": request.project_id,
                "number": i,
                "title": ch.get("title", f"Chapitre {i}"),
                "summary": ch.get("summary", ""),
                "content": "",
                "word_count": 0
            }
            result = supabase.table("chapters").insert(chapter_data).execute()
            if result.data:
                created_chapters.append(result.data[0])
        
        # Mettre à jour le nombre de chapitres dans le projet
        supabase.table("projects").update({
            "chapter_count": len(created_chapters),
            "status": "planning"
        }).eq("id", request.project_id).execute()
        
        return created_chapters
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chapter")
async def generate_chapter_content(
    request: ChapterGenerationRequest,
    profile: dict = Depends(get_user_profile)
):
    """
    Génère ou continue le contenu d'un chapitre
    """
    try:
        # Récupérer le chapitre
        chapter_result = supabase.table("chapters").select("*, projects(*)").eq("id", request.chapter_id).execute()
        if not chapter_result.data:
            raise HTTPException(status_code=404, detail="Chapter not found")
        
        chapter = chapter_result.data[0]
        project = chapter.get("projects", {})
        
        # Vérifier l'accès
        assert_project_access(profile, project.get("id"))
        
        # Récupérer les autres chapitres pour le contexte
        all_chapters = supabase.table("chapters").select("number, title, summary, content").eq("project_id", project.get("id")).order("number").execute()
        
        # Construire le contexte des chapitres précédents
        chapters_context = ""
        for ch in all_chapters.data or []:
            if ch["number"] < chapter["number"]:
                chapters_context += f"\n\nChapitre {ch['number']} - {ch['title']}:\n"
                if ch.get("content"):
                    # Résumé du contenu précédent (premiers 500 caractères)
                    chapters_context += ch["content"][:500] + "..."
                elif ch.get("summary"):
                    chapters_context += f"Résumé: {ch['summary']}"
        
        # Construire le prompt
        existing_content = chapter.get("content", "").strip()
        
        if existing_content:
            # Continuer le chapitre existant
            prompt = f"""Continue l'écriture de ce chapitre de manière cohérente et engageante.

Livre : {project.get('title', 'Sans titre')}
Genre : {project.get('genre', 'Non défini')}
Style : {project.get('style', 'roman')}
Public : {project.get('target_audience', 'adult')}

Chapitre actuel : {chapter.get('title')}
Résumé prévu : {chapter.get('summary', 'Non défini')}

Contenu existant :
{existing_content}

Continue l'histoire (ne répète pas le texte existant, continue directement là où ça s'arrête) :"""
        else:
            # Écrire un nouveau chapitre
            prompt = f"""Écris le contenu de ce chapitre de manière engageante et immersive.

Livre : {project.get('title', 'Sans titre')}
Pitch : {project.get('pitch', 'Non défini')}
Genre : {project.get('genre', 'Non défini')}
Style : {project.get('style', 'roman')}
Public : {project.get('target_audience', 'adult')}

{f"Contexte des chapitres précédents:{chapters_context}" if chapters_context else "C'est le premier chapitre."}

Chapitre à écrire : {chapter.get('title')}
Résumé prévu : {chapter.get('summary', 'Développe librement ce chapitre')}

{f"Instructions supplémentaires : {request.instruction}" if request.instruction else ""}

Écris le chapitre (environ 800-1500 mots) :"""

        # Générer le contenu
        result = await ai_service.generate_text(prompt=prompt, max_tokens=3000)
        
        return {
            "generated_text": result.text,
            "tokens_used": result.tokens_used,
            "chapter_id": request.chapter_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### 2. Frontend : Corriger le service generation.js

**Fichier** : `frontend/src/services/generation.js`

```javascript
import api from "./api";

export const generationService = {
  /**
   * Génération de texte générique
   */
  generateText: async (prompt, context = null, maxTokens = 2000) => {
    const response = await api.post("/generation/text", {
      prompt,
      context,
      max_tokens: maxTokens,
    });
    return response.data;
  },

  /**
   * Continuer un texte existant
   */
  continueText: async (text, maxTokens = 500) => {
    const response = await api.post("/generation/continue", {
      text,
      max_tokens: maxTokens,
    });
    return response.data;
  },

  /**
   * Améliorer un texte
   */
  improveText: async (text, instruction = "Améliore ce texte") => {
    const response = await api.post("/generation/improve", {
      text,
      instruction,
    });
    return response.data;
  },

  /**
   * Générer un plan de chapitres pour un projet
   */
  generatePlan: async (projectId, userId, numChapters = 10) => {
    const response = await api.post(`/generation/plan?user_id=${userId}`, {
      project_id: projectId,
      num_chapters: numChapters,
    });
    return response.data;
  },

  /**
   * Générer/continuer le contenu d'un chapitre
   */
  writeChapter: async (chapterId, userId, instruction = null) => {
    const response = await api.post(`/generation/chapter?user_id=${userId}`, {
      chapter_id: chapterId,
      instruction,
    });
    return response.data.generated_text;
  },
};
```

---

### 3. Frontend : Corriger les appels dans Plan.jsx

Le code actuel est OK, mais vérifions que les chapitres sont bien créés :

```javascript
// Plan.jsx - ligne 62-77 (déjà correct mais ajoutons la gestion d'erreur)
const handleGeneratePlan = async () => {
  setGenerating(true);
  try {
    const newChapters = await generationService.generatePlan(
      projectId,
      user.id,
      10  // Nombre de chapitres par défaut
    );
    
    if (Array.isArray(newChapters)) {
      setChapters(newChapters.sort((a, b) => a.number - b.number));
      toast.success(t("project.plan_success"));
    } else {
      throw new Error("Format de réponse invalide");
    }
  } catch (error) {
    console.error("Erreur génération plan:", error);
    toast.error(error.response?.data?.detail || t("project.plan_error"));
  } finally {
    setGenerating(false);
  }
};
```

---

### 4. Frontend : Corriger les appels dans Write.jsx

```javascript
// Write.jsx - ligne 93-109
const handleGenerate = async () => {
  if (!currentChapter) return;
  setGenerating(true);
  try {
    const generatedContent = await generationService.writeChapter(
      currentChapter.id,
      user.id
    );
    
    if (generatedContent) {
      // Ajouter le contenu généré au contenu existant
      setContent((prev) => {
        if (prev.trim()) {
          return prev + "\n\n" + generatedContent;
        }
        return generatedContent;
      });
      toast.success(t("project.write_generated"));
    }
  } catch (error) {
    console.error("Erreur génération chapitre:", error);
    toast.error(error.response?.data?.detail || t("project.write_generate_error"));
  } finally {
    setGenerating(false);
  }
};
```

---

### 5. Corriger chaptersService (incohérences de paramètres)

Le service utilise `chapterNumber` mais certains appels passent `chapter.id`. Voici la version corrigée :

**Fichier** : `frontend/src/services/chapters.js`

```javascript
import api from "./api";

export const chaptersService = {
  /**
   * Récupérer tous les chapitres d'un projet
   */
  getAll: async (projectId, userId) => {
    const response = await api.get(
      `/projects/${projectId}/chapters?user_id=${userId}`
    );
    return response.data;
  },

  /**
   * Récupérer un chapitre par son numéro
   */
  getOne: async (projectId, chapterNumber, userId) => {
    const response = await api.get(
      `/projects/${projectId}/chapters/${chapterNumber}?user_id=${userId}`
    );
    return response.data;
  },

  /**
   * Créer un nouveau chapitre
   */
  create: async (chapterData, userId) => {
    const { project_id, ...data } = chapterData;
    const response = await api.post(
      `/projects/${project_id}/chapters?user_id=${userId}`,
      data
    );
    return response.data;
  },

  /**
   * Mettre à jour un chapitre (par ID ou par numéro)
   * @param {string} chapterId - ID du chapitre OU objet {projectId, number}
   * @param {object} chapterData - Données à mettre à jour
   * @param {string} userId - ID de l'utilisateur
   */
  update: async (chapterIdOrRef, chapterData, userId) => {
    // Si on passe un ID direct (UUID), on doit d'abord trouver le project_id et number
    if (typeof chapterIdOrRef === 'string' && chapterIdOrRef.includes('-')) {
      // C'est probablement un UUID, on fait une requête directe par ID
      // Note: L'API actuelle utilise project_id + number, pas l'ID direct
      // On devrait modifier le backend pour supporter les deux
      
      // Workaround: utiliser le chapterData qui devrait contenir project_id
      const response = await api.put(
        `/projects/${chapterData.project_id}/chapters/${chapterData.number}?user_id=${userId}`,
        chapterData
      );
      return response.data;
    }
    
    // Format standard: projectId + chapterNumber
    const { projectId, number } = chapterIdOrRef;
    const response = await api.put(
      `/projects/${projectId}/chapters/${number}?user_id=${userId}`,
      chapterData
    );
    return response.data;
  },

  /**
   * Supprimer un chapitre
   */
  delete: async (chapterId, userId) => {
    // Le backend attend project_id + chapter_number
    // On doit adapter ou le backend doit supporter la suppression par ID
    const response = await api.delete(
      `/chapters/${chapterId}?user_id=${userId}`
    );
    return response.data;
  },
};
```

---

## 📁 Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `backend/app/api/generation.py` | Remplacer entièrement |
| `frontend/src/services/generation.js` | Remplacer entièrement |
| `frontend/src/services/chapters.js` | Mettre à jour |
| `frontend/src/pages/create/Write.jsx` | Vérifier l'appel |
| `frontend/src/pages/create/Plan.jsx` | Vérifier l'appel |

---

## 🧪 Tests à effectuer après correction

1. **Test génération de plan** :
   - Créer un nouveau projet
   - Aller sur `/create/{projectId}/plan`
   - Cliquer sur "Générer le plan"
   - Vérifier que les chapitres sont créés

2. **Test écriture de chapitre** :
   - Aller sur `/create/{projectId}/write`
   - Sélectionner un chapitre
   - Cliquer sur "Continuer avec l'IA"
   - Vérifier que le texte est généré

3. **Test conversation (Explore)** :
   - Aller sur `/create/{projectId}/explore`
   - Envoyer un message
   - Vérifier que l'IA répond

---

## ⏱️ Temps estimé pour les corrections

| Tâche | Durée |
|-------|-------|
| Modifier generation.py | 30 min |
| Modifier generation.js | 15 min |
| Modifier chapters.js | 15 min |
| Tests | 30 min |
| **Total** | **~1h30** |
