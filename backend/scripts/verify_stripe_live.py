#!/usr/bin/env python3
"""
Script de diagnostic Stripe Live pour Hakawa
Vérifie que tout est correctement configuré en production
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
import stripe

# Charger les variables d'environnement
load_dotenv()

# Configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def print_header(title):
    """Affiche un titre formaté"""
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}\n")


def print_success(msg):
    """Affiche un message de succès"""
    print(f"✅ {msg}")


def print_error(msg):
    """Affiche un message d'erreur"""
    print(f"❌ {msg}")


def print_warning(msg):
    """Affiche un avertissement"""
    print(f"⚠️  {msg}")


def print_info(msg):
    """Affiche une info"""
    print(f"ℹ️  {msg}")


def verify_api_key():
    """Vérifie la clé API Stripe"""
    print_header("1. Vérification Clé API")

    api_key = os.getenv("STRIPE_SECRET_KEY")

    if not api_key:
        print_error("STRIPE_SECRET_KEY non définie dans .env")
        return False

    if api_key.startswith("sk_live_"):
        print_success("Mode LIVE détecté")
    elif api_key.startswith("sk_test_"):
        print_warning("Mode TEST détecté - passez en LIVE pour production")
    else:
        print_error("Clé API invalide")
        return False

    # Tester la connexion
    try:
        account = stripe.Account.retrieve()
        print_success(f"Connecté au compte: {account.id}")
        print_info(f"   Email: {account.email}")
        print_info(f"   Pays: {account.country}")
        print_info(f"   Devise: {account.default_currency.upper()}")
        return True
    except stripe.error.AuthenticationError:
        print_error("Clé API invalide ou expirée")
        return False
    except Exception as e:
        print_error(f"Erreur connexion: {str(e)}")
        return False


def verify_products():
    """Vérifie les produits Stripe"""
    print_header("2. Vérification Produits")

    try:
        products = stripe.Product.list(limit=10, active=True)

        if not products.data:
            print_warning("Aucun produit trouvé - exécutez setup_stripe.py")
            return False

        print_success(f"{len(products.data)} produit(s) actif(s) trouvé(s):")

        hakawa_products = {}
        for product in products.data:
            print(f"\n   📦 {product.name}")
            print(f"      ID: {product.id}")
            print(f"      Description: {product.description or 'N/A'}")

            # Identifier les produits Hakawa
            if "hakawa" in product.name.lower():
                tier = None
                if "conteur" in product.name.lower():
                    tier = "conteur"
                elif "auteur" in product.name.lower():
                    tier = "auteur"
                elif "studio" in product.name.lower():
                    tier = "studio"

                if tier:
                    hakawa_products[tier] = product.id

        return hakawa_products

    except Exception as e:
        print_error(f"Erreur récupération produits: {str(e)}")
        return False


def verify_prices(hakawa_products):
    """Vérifie les prix configurés"""
    print_header("3. Vérification Prix")

    required_prices = {
        "STRIPE_PRICE_CONTEUR_MONTHLY": "Conteur Mensuel",
        "STRIPE_PRICE_CONTEUR_ANNUAL": "Conteur Annuel",
        "STRIPE_PRICE_AUTEUR_MONTHLY": "Auteur Mensuel",
        "STRIPE_PRICE_AUTEUR_ANNUAL": "Auteur Annuel",
        "STRIPE_PRICE_STUDIO_MONTHLY": "Studio Mensuel",
        "STRIPE_PRICE_STUDIO_ANNUAL": "Studio Annuel",
    }

    all_valid = True
    price_ids = {}

    for env_var, name in required_prices.items():
        price_id = os.getenv(env_var)

        if not price_id or price_id == "price_xxxxx":
            print_error(f"{name}: Non configuré ({env_var})")
            all_valid = False
            continue

        try:
            price = stripe.Price.retrieve(price_id)
            amount = price.unit_amount / 100
            currency = price.currency.upper()
            interval = price.recurring.interval if price.recurring else "one-time"

            print_success(f"{name}: {amount} {currency}/{interval}")
            print_info(f"   ID: {price_id}")
            price_ids[env_var] = price_id

        except stripe.error.InvalidRequestError:
            print_error(f"{name}: ID invalide ({price_id})")
            all_valid = False
        except Exception as e:
            print_error(f"{name}: Erreur - {str(e)}")
            all_valid = False

    return all_valid, price_ids


def verify_webhooks():
    """Vérifie les webhooks configurés"""
    print_header("4. Vérification Webhooks")

    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    if not webhook_secret or webhook_secret == "whsec_xxxxx":
        print_error("STRIPE_WEBHOOK_SECRET non configuré")
        return False

    print_success(f"Webhook secret configuré: {webhook_secret[:15]}...")

    try:
        webhooks = stripe.WebhookEndpoint.list(limit=10)

        if not webhooks.data:
            print_warning("Aucun webhook configuré sur Stripe Dashboard")
            print_info("   → Allez sur https://dashboard.stripe.com/webhooks")
            print_info(
                "   → Créez un endpoint vers: https://VOTRE_BACKEND/api/stripe/webhook"
            )
            return False

        print_success(f"{len(webhooks.data)} webhook(s) configuré(s):")

        required_events = {
            "checkout.session.completed",
            "customer.subscription.updated",
            "customer.subscription.deleted",
            "invoice.payment_failed",
        }

        for webhook in webhooks.data:
            print(f"\n   🔗 {webhook.url}")
            print(
                f"      Status: {'✅ Activé' if webhook.status == 'enabled' else '❌ Désactivé'}"
            )
            print(f"      Événements: {len(webhook.enabled_events)}")

            missing = required_events - set(webhook.enabled_events)
            if missing:
                print_warning(f"      Événements manquants: {', '.join(missing)}")
            else:
                print_success(f"      Tous les événements requis sont configurés")

        return True

    except stripe.error.PermissionError:
        print_warning("Permissions insuffisantes pour lister les webhooks")
        print_info("Vérifiez manuellement sur le dashboard Stripe")
        return True
    except Exception as e:
        print_error(f"Erreur webhooks: {str(e)}")
        return False


def verify_recent_activity():
    """Vérifie l'activité récente"""
    print_header("5. Activité Récente (7 derniers jours)")

    try:
        # Date de début (7 jours avant)
        week_ago = int((datetime.now() - timedelta(days=7)).timestamp())

        # Récupérer les sessions checkout
        sessions = stripe.checkout.Session.list(created={"gte": week_ago}, limit=10)

        print_info(f"Sessions checkout: {len(sessions.data)}")
        for session in sessions.data[:3]:
            status_icon = "✅" if session.payment_status == "paid" else "⏳"
            print(f"   {status_icon} {session.id}: {session.payment_status}")

        # Récupérer les abonnements
        subscriptions = stripe.Subscription.list(created={"gte": week_ago}, limit=10)

        print_info(f"Nouveaux abonnements: {len(subscriptions.data)}")
        for sub in subscriptions.data[:3]:
            status_icon = "✅" if sub.status == "active" else "⚠️"
            print(f"   {status_icon} {sub.id}: {sub.status}")

        # Récupérer les paiements
        charges = stripe.Charge.list(created={"gte": week_ago}, limit=10)

        total_amount = sum(c.amount for c in charges.data if c.paid) / 100
        currency = charges.data[0].currency.upper() if charges.data else "EUR"

        print_info(f"Paiements réussis: {len([c for c in charges.data if c.paid])}")
        print_success(f"Revenu 7 jours: {total_amount:.2f} {currency}")

        return True

    except Exception as e:
        print_error(f"Erreur activité: {str(e)}")
        return False


def verify_security():
    """Vérifie la configuration de sécurité"""
    print_header("6. Vérification Sécurité")

    checks = {
        "STRIPE_WEBHOOK_SECRET": "Webhook Secret",
        "APP_SECRET_KEY": "Application Secret",
        "ENCRYPTION_KEY": "Clé de Chiffrement",
    }

    all_valid = True
    for env_var, name in checks.items():
        value = os.getenv(env_var)
        if not value or value in [
            "",
            "xxxxx",
            "your-secret-key-change-this-in-production",
        ]:
            print_error(f"{name} non configuré ou par défaut")
            all_valid = False
        else:
            print_success(f"{name} configuré")

    return all_valid


def main():
    """Fonction principale"""
    print("\n" + "=" * 60)
    print("  🔍 DIAGNOSTIC STRIPE LIVE - HAKAWA")
    print("=" * 60)
    print(f"  Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    results = {
        "api_key": False,
        "products": False,
        "prices": False,
        "webhooks": False,
        "activity": False,
        "security": False,
    }

    # 1. Vérifier la clé API
    results["api_key"] = verify_api_key()
    if not results["api_key"]:
        print("\n❌ Impossible de continuer sans clé API valide")
        sys.exit(1)

    # 2. Vérifier les produits
    hakawa_products = verify_products()
    results["products"] = bool(hakawa_products)

    # 3. Vérifier les prix
    prices_valid, price_ids = verify_prices(hakawa_products if hakawa_products else {})
    results["prices"] = prices_valid

    # 4. Vérifier les webhooks
    results["webhooks"] = verify_webhooks()

    # 5. Vérifier l'activité
    results["activity"] = verify_recent_activity()

    # 6. Vérifier la sécurité
    results["security"] = verify_security()

    # Résumé final
    print_header("📊 RÉSUMÉ")

    total = len(results)
    passed = sum(1 for v in results.values() if v)

    for check, status in results.items():
        icon = "✅" if status else "❌"
        print(f"{icon} {check.replace('_', ' ').title()}")

    print(f"\n{'=' * 60}")
    if passed == total:
        print("  ✅ CONFIGURATION PARFAITE - PRÊT POUR PRODUCTION")
    elif passed >= total - 1:
        print("  ⚠️  CONFIGURATION QUASI COMPLÈTE - Vérifiez les warnings")
    else:
        print("  ❌ CONFIGURATION INCOMPLÈTE - Actions requises")
    print(f"  Score: {passed}/{total}")
    print("=" * 60)

    print("\n💡 Prochaines étapes:")
    if not results["products"]:
        print("  → Exécutez: python scripts/setup_stripe.py")
    if not results["webhooks"]:
        print("  → Configurez webhook sur: https://dashboard.stripe.com/webhooks")
    if not results["security"]:
        print(
            "  → Générez clés sécurité: python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'"
        )

    print()


if __name__ == "__main__":
    main()
