#!/usr/bin/env python3
"""
Script de test rapide de l'intégration Stripe
Vérifie que tout est bien configuré
"""

import os
import sys
from dotenv import load_dotenv
import stripe

# Charger les variables d'environnement
load_dotenv()


def test_stripe_connection():
    """Test de la connexion Stripe"""
    print("🔍 Test 1: Connexion à Stripe...")
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    try:
        account = stripe.Account.retrieve()
        print(f"✅ Connecté au compte: {account.id}")
        print(f"   Email: {account.email}")
        print(f"   Pays: {account.country}")
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion: {str(e)}")
        return False


def test_products():
    """Vérifie que les produits existent"""
    print("\n🔍 Test 2: Vérification des produits...")

    try:
        products = stripe.Product.list(limit=10)
        hakawa_products = [p for p in products.data if "Hakawa" in p.name]

        print(f"✅ {len(hakawa_products)} produits Hakawa trouvés:")
        for product in hakawa_products:
            print(f"   • {product.name} (ID: {product.id})")

        return len(hakawa_products) >= 3
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def test_prices():
    """Vérifie que les prix existent"""
    print("\n🔍 Test 3: Vérification des prix...")

    price_ids = [
        ("Conteur Mensuel", os.getenv("STRIPE_PRICE_CONTEUR_MONTHLY")),
        ("Conteur Annuel", os.getenv("STRIPE_PRICE_CONTEUR_ANNUAL")),
        ("Auteur Mensuel", os.getenv("STRIPE_PRICE_AUTEUR_MONTHLY")),
        ("Auteur Annuel", os.getenv("STRIPE_PRICE_AUTEUR_ANNUAL")),
        ("Studio Mensuel", os.getenv("STRIPE_PRICE_STUDIO_MONTHLY")),
        ("Studio Annuel", os.getenv("STRIPE_PRICE_STUDIO_ANNUAL")),
    ]

    success_count = 0
    for name, price_id in price_ids:
        if not price_id:
            print(f"⚠️  {name}: Prix non configuré")
            continue

        try:
            price = stripe.Price.retrieve(price_id)
            amount = price.unit_amount / 100
            interval = price.recurring.interval
            print(f"✅ {name}: {amount}€/{interval} (ID: {price_id})")
            success_count += 1
        except Exception as e:
            print(f"❌ {name}: Erreur - {str(e)}")

    return success_count == 6


def test_checkout_session():
    """Teste la création d'une session de checkout"""
    print("\n🔍 Test 4: Test de création de session Checkout...")

    price_id = os.getenv("STRIPE_PRICE_CONTEUR_MONTHLY")
    if not price_id:
        print("❌ Price ID Conteur Mensuel non configuré")
        return False

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel",
        )
        print(f"✅ Session Checkout créée: {session.id}")
        print(f"   URL: {session.url}")
        return True
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def main():
    print("╔═══════════════════════════════════════════════════════════════╗")
    print("║                                                               ║")
    print("║        🌙 HAKAWA - Test d'intégration Stripe 🌙               ║")
    print("║                                                               ║")
    print("╚═══════════════════════════════════════════════════════════════╝")
    print()

    tests = [
        ("Connexion Stripe", test_stripe_connection),
        ("Produits Stripe", test_products),
        ("Prix configurés", test_prices),
        ("Session Checkout", test_checkout_session),
    ]

    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Erreur inattendue: {str(e)}")
            results.append((name, False))

    # Résumé
    print("\n" + "═" * 67)
    print("📊 RÉSUMÉ DES TESTS")
    print("═" * 67)

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")

    print("═" * 67)
    print(f"\nScore: {passed}/{total} tests réussis")

    if passed == total:
        print("\n🎉 FÉLICITATIONS ! Stripe est 100% opérationnel !")
        print("\n🚀 Prochaines étapes:")
        print("1. Démarrez le backend: uvicorn app.main:app --reload --port 8000")
        print("2. Démarrez le frontend: cd ../frontend && npm run dev")
        print("3. Testez un paiement sur: http://localhost:5173/pricing")
        print("4. Carte de test: 4242 4242 4242 4242")
        print("\n📊 Dashboard Stripe: https://dashboard.stripe.com/test/payments")
    else:
        print("\n⚠️  Certains tests ont échoué. Vérifiez la configuration.")

    print()
    return passed == total


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
