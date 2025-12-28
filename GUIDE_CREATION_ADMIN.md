# 🚀 Guide Rapide - Création Compte Admin

## Méthode 1: Via Supabase Dashboard (RECOMMANDÉ)

### Étape 1: Créer l'utilisateur

1. Allez sur https://supabase.com → Votre projet
2. Cliquez sur **Authentication** dans le menu gauche
3. Cliquez sur **Users**
4. Cliquez sur **Add user** (bouton vert)
5. Remplissez:
   - **Email**: `contact@hakawa.app`
   - **Password**: `Milhanou141511`
   - ✅ Cochez **Auto Confirm User**
6. Cliquez sur **Create user**

### Étape 2: Activer les droits admin

1. Allez dans **SQL Editor** (menu gauche)
2. Cliquez sur **New query**
3. Copiez-collez UNIQUEMENT cette ligne:

```sql
SELECT setup_admin_account();
```

4. Cliquez sur **RUN** (ou F5)
5. Vous devriez voir: `setup_admin_account() → void`

### Étape 3: Vérifier

Exécutez cette requête pour vérifier:

```sql
SELECT email, is_admin, subscription_tier, credits_illustrations
FROM public.profiles
WHERE email = 'contact@hakawa.app';
```

Vous devriez voir:

- `is_admin`: `true`
- `subscription_tier`: `studio`
- `credits_illustrations`: `999999`

---

## Méthode 2: Via Script Python (Alternative)

```bash
cd /workspaces/hakawa/backend
source venv/bin/activate

# Lancer le script (il demandera le mot de passe)
python scripts/init_admin.py

# Entrer quand demandé: Milhanou141511
```

---

## ✅ Se Connecter

1. Ouvrez votre application: http://localhost:5173 (ou votre URL)
2. Cliquez sur **Connexion**
3. Entrez:
   - **Email**: `contact@hakawa.app`
   - **Mot de passe**: `Milhanou141511`
4. Accédez au dashboard admin: `/admin`

---

## ⚠️ Fichiers SQL à NE PAS Exécuter Entièrement

Ces fichiers contiennent des commentaires et du code bash:

- ❌ `INTEGRATION_COMPLETE.md`
- ❌ `create_admin.sh`

## ✅ Fichier SQL à Exécuter

- ✅ `supabase/setup_admin_contact.sql` (contient uniquement la commande SQL)

Ou simplement cette ligne dans SQL Editor:

```sql
SELECT setup_admin_account();
```

---

## 🔍 Dépannage

### Problème: "User not found"

→ L'utilisateur n'existe pas encore dans Authentication > Users
→ Solution: Créez-le d'abord (Étape 1 ci-dessus)

### Problème: "Function setup_admin_account() does not exist"

→ La migration SQL n'a pas été appliquée
→ Solution: Exécutez `supabase/migrations/20231223_admin_setup.sql` dans SQL Editor

### Problème: "Invalid credentials" lors de la connexion

→ Vérifiez que le compte est bien créé et confirmé
→ Mot de passe: `Milhanou141511` (respecter la casse)

---

**Contact admin créé avec succès? Vous pouvez accéder à `/admin` ! 🎉**
