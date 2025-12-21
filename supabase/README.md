# Hakawa - Instructions de déploiement Supabase

## Créer les tables dans Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet Hakawa
3. Allez dans **SQL Editor**
4. Créez une nouvelle query
5. Copiez-collez le contenu du fichier `migrations/20231221_initial_schema.sql`
6. Cliquez sur **Run**

## Configuration Storage (pour les images et exports)

1. Allez dans **Storage**
2. Créez les buckets suivants :

   - `illustrations` (public)
   - `covers` (public)
   - `exports` (private)

3. Configurez les policies pour `illustrations` et `covers` :
   - Autoriser les uploads pour les utilisateurs authentifiés
   - Autoriser la lecture publique

## Vérification

Après avoir exécuté le script SQL, vérifiez que les tables suivantes existent :

- profiles
- projects
- chapters
- illustrations
- conversations
- exports

Les RLS (Row Level Security) policies doivent être activées sur toutes les tables.
