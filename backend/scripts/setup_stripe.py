#!/usr/bin/env python3
"""
Script de configuration des produits et prix Stripe pour Hakawa
Crée automatiquement tous les plans tarifaires dans Stripe
"""

import os
import sys
from dotenv import load_dotenv
import stripe

# Charger les variables d'environnement
load_dotenv()

# Configuration Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Définition des plans Hakawa
PLANS = {
    "conteur": {
        "name": "✨ Hakawa Conteur",
        "description": "Parfait pour commencer à créer des histoires avec l'IA",
        "monthly_price": 1900,  # 19€ en centimes
        "annual_price": 14900,  # 149€ en centimes (économie de 2 mois)
        "features": [
            "5 projets simultanés",
            "Chapitres illimités",
            "50 générations IA/jour",
            "20 illustrations/mois",
            "3 styles d'illustration",
            "Export PDF + EPUB",
            "Export KDP basique",
            "Mode enfant",
            "Support email",
        ],
        "metadata": {
            "tier": "conteur",
            "projects_limit": "5",
            "ai_generations_daily": "50",
            "illustrations_monthly": "20",
            "illustration_styles": "3",
            "exports": "pdf,epub,kdp_basic",
        },
    },
    "auteur": {
        "name": "📚 Hakawa Auteur",
        "description": "Pour les auteurs sérieux qui veulent publier professionnellement",
        "monthly_price": 3900,  # 39€
        "annual_price": 31900,  # 319€
        "features": [
            "Projets illimités",
            "Chapitres illimités",
            "Générations IA illimitées",
            "80 illustrations/mois",
            "Tous les styles d'illustration",
            "Export PDF + EPUB",
            "Export KDP complet",
            "Couverture IA",
            "Mode enfant",
            "Priorité de génération",
            "Support email prioritaire",
        ],
        "metadata": {
            "tier": "auteur",
            "projects_limit": "unlimited",
            "ai_generations_daily": "unlimited",
            "illustrations_monthly": "80",
            "illustration_styles": "all",
            "exports": "pdf,epub,kdp_complete",
            "cover_ai": "true",
            "priority": "true",
        },
    },
    "studio": {
        "name": "🏢 Hakawa Studio",
        "description": "Solution complète pour professionnels et studios de création",
        "monthly_price": 9900,  # 99€
        "annual_price": 79900,  # 799€
        "features": [
            "Tout du plan Auteur",
            "200 illustrations/mois",
            "Accès API",
            "White-label",
            "Support dédié",
            "Formation 1-to-1",
            "Priorité maximale",
        ],
        "metadata": {
            "tier": "studio",
            "projects_limit": "unlimited",
            "ai_generations_daily": "unlimited",
            "illustrations_monthly": "200",
            "illustration_styles": "all",
            "exports": "pdf,epub,kdp_complete",
            "cover_ai": "true",
            "api_access": "true",
            "white_label": "true",
            "priority": "max",
            "support": "dedicated",
        },
    },
}


def create_products_and_prices():
    """
    Crée tous les produits et prix dans Stripe
    """
    print("🌙 HAKAWA - Configuration Stripe")
    print("=" * 80)
    print()

    if not stripe.api_key:
        print("❌ ERREUR: STRIPE_SECRET_KEY non trouvée dans .env")
        sys.exit(1)

    print(f"🔑 Clé Stripe: {stripe.api_key[:12]}...")
    print()

    results = {"products": {}, "prices": {}}

    for plan_id, plan_data in PLANS.items():
        print(f"📦 Création du produit: {plan_data['name']}")
        print("-" * 80)

        try:
            # Vérifier si le produit existe déjà
            existing_products = stripe.Product.list(limit=100)
            existing_product = None

            for product in existing_products.data:
                if product.metadata.get("plan_id") == plan_id:
                    existing_product = product
                    print(f"   ℹ️  Produit existant trouvé: {product.id}")
                    break

            # Créer ou mettre à jour le produit
            if existing_product:
                product = stripe.Product.modify(
                    existing_product.id,
                    name=plan_data["name"],
                    description=plan_data["description"],
                    metadata={"plan_id": plan_id, **plan_data["metadata"]},
                )
                print(f"   ✅ Produit mis à jour: {product.id}")
            else:
                product = stripe.Product.create(
                    name=plan_data["name"],
                    description=plan_data["description"],
                    metadata={"plan_id": plan_id, **plan_data["metadata"]},
                )
                print(f"   ✅ Produit créé: {product.id}")

            results["products"][plan_id] = product.id

            # Créer les prix (mensuel et annuel)
            print(f"\n   💰 Création des prix...")

            # Prix mensuel
            monthly_price = stripe.Price.create(
                product=product.id,
                unit_amount=plan_data["monthly_price"],
                currency="eur",
                recurring={"interval": "month", "interval_count": 1},
                metadata={"plan_id": plan_id, "billing_period": "monthly"},
            )
            print(
                f"   ✅ Prix mensuel: {monthly_price.id} ({plan_data['monthly_price']/100}€/mois)"
            )
            results["prices"][f"{plan_id}_monthly"] = monthly_price.id

            # Prix annuel
            annual_price = stripe.Price.create(
                product=product.id,
                unit_amount=plan_data["annual_price"],
                currency="eur",
                recurring={"interval": "year", "interval_count": 1},
                metadata={"plan_id": plan_id, "billing_period": "annual"},
            )
            monthly_equiv = plan_data["annual_price"] / 12 / 100
            savings = (
                plan_data["monthly_price"] * 12 - plan_data["annual_price"]
            ) / 100
            print(
                f"   ✅ Prix annuel: {annual_price.id} ({plan_data['annual_price']/100}€/an = {monthly_equiv:.2f}€/mois)"
            )
            print(f"   💎 Économie annuelle: {savings:.2f}€")
            results["prices"][f"{plan_id}_annual"] = annual_price.id

            print()

        except stripe.error.StripeError as e:
            print(f"   ❌ Erreur Stripe: {str(e)}")
            continue
        except Exception as e:
            print(f"   ❌ Erreur: {str(e)}")
            continue

    # Afficher le récapitulatif
    print("=" * 80)
    print("✨ CONFIGURATION TERMINÉE")
    print("=" * 80)
    print()
    print("📋 Variables d'environnement à ajouter dans .env:")
    print()
    print("# Stripe Price IDs - MENSUEL")
    for plan_id in ["conteur", "auteur", "studio"]:
        price_id = results["prices"].get(f"{plan_id}_monthly", "N/A")
        var_name = f"STRIPE_PRICE_{plan_id.upper()}_MONTHLY"
        print(f"{var_name}={price_id}")

    print()
    print("# Stripe Price IDs - ANNUEL")
    for plan_id in ["conteur", "auteur", "studio"]:
        price_id = results["prices"].get(f"{plan_id}_annual", "N/A")
        var_name = f"STRIPE_PRICE_{plan_id.upper()}_ANNUAL"
        print(f"{var_name}={price_id}")

    print()
    print("=" * 80)
    print("🎯 PROCHAINES ÉTAPES:")
    print("1. Copiez les variables ci-dessus dans backend/.env")
    print("2. Testez les paiements avec les cartes de test Stripe")
    print("3. Configurez le webhook Stripe pour les événements de paiement")
    print()
    print("🧪 CARTES DE TEST STRIPE:")
    print("  - Succès: 4242 4242 4242 4242")
    print("  - Déclinée: 4000 0000 0000 0002")
    print("  - 3D Secure: 4000 0027 6000 3184")
    print("  - Date: N'importe quelle date future")
    print("  - CVC: N'importe quel 3 chiffres")
    print()

    return results


def test_stripe_connection():
    """
    Teste la connexion à Stripe
    """
    try:
        account = stripe.Account.retrieve()
        print(f"✅ Connexion Stripe OK")
        print(f"   Compte: {account.id}")
        print(f"   Email: {account.email}")
        print(f"   Pays: {account.country}")
        print(f"   Devise: {account.default_currency}")
        print()
        return True
    except stripe.error.AuthenticationError:
        print("❌ Clé API Stripe invalide")
        return False
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


if __name__ == "__main__":
    print()
    print("🔍 Test de connexion Stripe...")
    print()

    if not test_stripe_connection():
        sys.exit(1)

    confirm = input("Voulez-vous créer/mettre à jour les produits Stripe? (o/n): ")

    if confirm.lower() != "o":
        print("❌ Opération annulée")
        sys.exit(0)

    print()
    results = create_products_and_prices()
    print()
    print("🌙 Configuration Stripe terminée!")
    print()
