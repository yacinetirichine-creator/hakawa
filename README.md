# 🔧 Corrections - Génération d'histoires Hakawa

## 📋 Résumé du problème

La génération d'histoires ne fonctionne pas car **2 méthodes critiques sont appelées mais n'existent pas** :

| Méthode manquante | Appelée depuis | Impact |
|-------------------|----------------|--------|
| `generationService.generatePlan()` | Plan.jsx | ❌ Impossible de générer un plan |
| `generationService.writeChapter()` | Write.jsx | ❌ Impossible d'écrire avec l'IA |

---

## ✅ Fichiers de correction fournis

```
FIXES/
├── backend_generation.py    → Remplace backend/app/api/generation.py
├── frontend_generation.js   → Remplace frontend/src/services/generation.js
└── README.md               → Ce fichier
```

---

## 🚀 Instructions d'application

### Étape 1 : Backend

```bash
# Sauvegarder l'ancien fichier
cp backend/app/api/generation.py backend/app/api/generation.py.backup

# Copier le nouveau fichier
cp FIXES/backend_generation.py backend/app/api/generation.py
```

### Étape 2 : Frontend

```bash
# Sauvegarder l'ancien fichier  
cp frontend/src/services/generation.js frontend/src/services/generation.js.backup

# Copier le nouveau fichier
cp FIXES/frontend_generation.js frontend/src/services/generation.js
```

### Étape 3 : Redémarrer les services

```bash
# Backend (si en local)
cd backend
uvicorn app.main:app --reload

# Frontend (si en local)
cd frontend
npm run dev
```

### Étape 4 : Déployer sur Render

```bash
git add .
git commit -m "fix: Ajout endpoints génération plan et chapitre"
git push origin main
```

Render redéploiera automatiquement.

---

## 🧪 Tests de validation

### Test 1 : Génération de plan

1. Créer un nouveau projet avec titre, pitch, genre
2. Aller sur `/create/{projectId}/plan`
3. Cliquer sur **"Générer le plan"**
4. ✅ Attendu : 10 chapitres avec titres et résumés apparaissent

### Test 2 : Écriture de chapitre

1. Aller sur `/create/{projectId}/write`
2. Sélectionner un chapitre
3. Cliquer sur **"Continuer avec l'IA"** (icône baguette magique)
4. ✅ Attendu : Du texte est généré et ajouté à l'éditeur

### Test 3 : Chat créatif (Explore)

1. Aller sur `/create/{projectId}/explore`
2. Envoyer un message comme "Raconte-moi l'histoire d'un dragon"
3. ✅ Attendu : L'IA répond de manière contextuelle

---

## 📝 Nouvelles routes API ajoutées

| Route | Méthode | Description |
|-------|---------|-------------|
| `/generation/plan` | POST | Génère un plan de X chapitres |
| `/generation/chapter` | POST | Génère/continue un chapitre |

### Exemple d'appel `/generation/plan`

```json
POST /generation/plan?user_id=xxx

{
  "project_id": "uuid-du-projet",
  "num_chapters": 10
}

// Réponse
[
  {"id": "...", "title": "L'éveil", "summary": "...", "number": 1, ...},
  {"id": "...", "title": "La quête", "summary": "...", "number": 2, ...},
  ...
]
```

### Exemple d'appel `/generation/chapter`

```json
POST /generation/chapter?user_id=xxx

{
  "chapter_id": "uuid-du-chapitre",
  "instruction": "Ajoute plus de dialogue"  // optionnel
}

// Réponse
{
  "generated_text": "Le soleil se levait sur la vallée...",
  "tokens_used": 1234,
  "chapter_id": "uuid-du-chapitre"
}
```

---

## ⚠️ Notes importantes

1. **Les anciens chapitres sont supprimés** quand on génère un nouveau plan. C'est voulu pour repartir de zéro.

2. **Le contenu est AJOUTÉ**, pas remplacé, quand on clique sur "Continuer" dans l'éditeur.

3. **L'IA utilise le contexte** des chapitres précédents pour maintenir la cohérence narrative.

4. **En cas d'erreur de parsing JSON**, le backend crée des chapitres génériques (fallback).

---

## 🐛 Dépannage

### "Chapter not found"
→ L'ID du chapitre est invalide. Vérifier que le chapitre existe en base.

### "Project not found"  
→ L'ID du projet est invalide ou l'utilisateur n'y a pas accès.

### La génération est lente
→ Normal, Claude peut prendre 10-30 secondes pour générer 1000+ mots.

### Le JSON est mal formaté
→ L'IA n'a pas respecté le format. Le fallback crée des chapitres vides.
