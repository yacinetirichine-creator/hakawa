# 🛠️ Scripts Backend Hakawa

Ce dossier contient les scripts utilitaires pour la gestion du backend Hakawa.

## 📋 Scripts Disponibles

### `init_admin.py` - Initialisation du Compte Administrateur

Crée et configure le compte administrateur avec accès illimité.

**Usage:**

```bash
cd backend
source venv/bin/activate
python scripts/init_admin.py
```

**Ce que fait le script:**

1. ✅ Crée le compte dans Supabase Auth avec mot de passe hashé
2. ✅ Configure le profil admin dans la table `profiles`
3. ✅ Attribue un accès illimité (tier Studio)
4. ✅ Donne 999,999 crédits d'illustration
5. ✅ Active le flag `is_admin`

**Sécurité:**

- Le mot de passe est demandé de façon sécurisée (non visible à l'écran)
- Hashé avec bcrypt par Supabase - jamais stocké en clair
- Utilise la clé service Supabase (privilèges admin)

---

## 🔐 Variables d'Environnement Requises

Assurez-vous d'avoir un fichier `.env` avec:

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=votre_cle_service_key_ici
```

**⚠️ IMPORTANT:** La clé service ne doit JAMAIS être commitée dans Git!

---

## 📝 Ajout de Nouveaux Scripts

Pour ajouter un nouveau script:

1. Créez le fichier dans `backend/scripts/`
2. Ajoutez un shebang Python: `#!/usr/bin/env python3`
3. Importez les dépendances nécessaires
4. Documentez l'usage ici dans ce README

---

**Fait avec 🌙 par l'équipe Hakawa**
