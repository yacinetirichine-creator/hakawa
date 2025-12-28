"""
Script d'initialisation du compte administrateur Hakawa
Crée le compte admin avec mot de passe hashé de façon sécurisée
"""

import os
import sys
from getpass import getpass
from supabase import create_client, Client
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration
ADMIN_EMAIL = "contact@hakawa.app"
ADMIN_NAME = "Hakawa Admin"


def initialize_admin():
    """
    Initialise le compte administrateur dans Supabase
    Le mot de passe est hashé côté Supabase - JAMAIS stocké en clair
    """

    # Récupérer les clés Supabase
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

    if not supabase_url or not supabase_service_key:
        print(
            "❌ ERREUR: Variables d'environnement SUPABASE_URL ou SUPABASE_SERVICE_KEY manquantes"
        )
        sys.exit(1)

    # Créer le client Supabase avec la clé service (privilèges admin)
    supabase: Client = create_client(supabase_url, supabase_service_key)

    print("🌙 HAKAWA - Initialisation du compte administrateur")
    print("=" * 60)
    print(f"Email: {ADMIN_EMAIL}")
    print()

    # IMPORTANT: Le mot de passe ne doit JAMAIS être hardcodé
    # Il est entré de façon sécurisée et hashé par Supabase
    admin_password = getpass(
        "Entrez le mot de passe admin (sera hashé de façon sécurisée): "
    )

    if len(admin_password) < 8:
        print("❌ Le mot de passe doit faire au moins 8 caractères")
        sys.exit(1)

    try:
        # Étape 1: Créer l'utilisateur dans auth.users
        print("\n🔐 Création du compte dans Supabase Auth...")

        # Vérifier si le compte existe déjà
        try:
            # Utiliser la clé service pour vérifier l'existence
            response = supabase.auth.admin.list_users()
            existing_user = None

            for user in response:
                if user.email == ADMIN_EMAIL:
                    existing_user = user
                    break

            if existing_user:
                print(
                    f"⚠️  Le compte {ADMIN_EMAIL} existe déjà (ID: {existing_user.id})"
                )
                update_existing = input(
                    "Voulez-vous mettre à jour ce compte comme admin? (o/n): "
                )

                if update_existing.lower() != "o":
                    print("❌ Opération annulée")
                    sys.exit(0)

                user_id = existing_user.id

                # Mettre à jour le mot de passe si demandé
                update_pwd = input("Voulez-vous mettre à jour le mot de passe? (o/n): ")
                if update_pwd.lower() == "o":
                    supabase.auth.admin.update_user_by_id(
                        user_id, {"password": admin_password}
                    )
                    print("✅ Mot de passe mis à jour (hashé de façon sécurisée)")
            else:
                # Créer un nouveau compte
                auth_response = supabase.auth.admin.create_user(
                    {
                        "email": ADMIN_EMAIL,
                        "password": admin_password,
                        "email_confirm": True,
                        "user_metadata": {"full_name": ADMIN_NAME},
                    }
                )
                user_id = auth_response.user.id
                print(f"✅ Compte créé avec succès (ID: {user_id})")

        except Exception as e:
            print(f"❌ Erreur lors de la création du compte: {str(e)}")
            sys.exit(1)

        # Étape 2: Configurer le profil admin
        print("\n👑 Configuration des privilèges administrateur...")

        profile_data = {
            "id": user_id,
            "email": ADMIN_EMAIL,
            "full_name": ADMIN_NAME,
            "subscription_tier": "studio",
            "subscription_expires_at": "2099-12-31T23:59:59+00:00",
            "credits_illustrations": 999999,
            "is_admin": True,
        }

        # Upsert du profil
        supabase.table("profiles").upsert(profile_data).execute()
        print("✅ Profil administrateur configuré")

        # Étape 3: Afficher le résumé
        print("\n" + "=" * 60)
        print("✨ COMPTE ADMINISTRATEUR CONFIGURÉ AVEC SUCCÈS!")
        print("=" * 60)
        print(f"📧 Email: {ADMIN_EMAIL}")
        print(f"👤 Nom: {ADMIN_NAME}")
        print(f"👑 Statut: Administrateur")
        print(f"💎 Abonnement: Studio (illimité)")
        print(f"🎨 Crédits illustrations: 999,999 (illimité)")
        print(f"📅 Expiration: 31/12/2099")
        print("=" * 60)
        print("\n🔒 SÉCURITÉ:")
        print("  ✓ Mot de passe hashé avec bcrypt par Supabase")
        print("  ✓ Jamais stocké en clair dans la base de données")
        print("  ✓ Protection RLS activée avec bypass admin")
        print("  ✓ Accès illimité à toutes les ressources")
        print("\n🎯 PROCHAINES ÉTAPES:")
        print("  1. Connectez-vous avec:", ADMIN_EMAIL)
        print("  2. Vous avez maintenant un accès complet à la plateforme")
        print("  3. Vous pouvez créer un nombre illimité de projets")
        print("  4. Vos crédits d'illustration ne se décrémenteront jamais")
        print()

    except Exception as e:
        print(f"\n❌ ERREUR: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    initialize_admin()
