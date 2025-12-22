#!/bin/bash

cat << "EOF"

╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║              🎉 STRIPE CONFIGURÉ AVEC SUCCÈS ! 🎉                         ║
║                                                                           ║
║              ✅ Tous les produits et prix sont créés                      ║
║              ✅ Variables d'environnement configurées                     ║
║              ✅ Prêt pour les tests de paiement                           ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

📦 PRODUITS CRÉÉS DANS STRIPE
═════════════════════════════════════════════════════════════════════════════

✨ Hakawa Conteur
   Mensuel: 19€/mois    (ID: price_1Sh6vm4pTWzSOcLdmydWyzNX)
   Annuel:  149€/an     (ID: price_1Sh6vm4pTWzSOcLdpo8exyJY)
   💰 Économie: 79€/an

📚 Hakawa Auteur
   Mensuel: 39€/mois    (ID: price_1Sh6vn4pTWzSOcLd1Q0IWsqi)
   Annuel:  319€/an     (ID: price_1Sh6vn4pTWzSOcLdqDnyP2Zr)
   💰 Économie: 149€/an

🏢 Hakawa Studio
   Mensuel: 99€/mois    (ID: price_1Sh6vo4pTWzSOcLdltIGQBJw)
   Annuel:  799€/an     (ID: price_1Sh6vp4pTWzSOcLdnOPyzyyZ)
   💰 Économie: 389€/an

🚀 COMMENT TESTER LES PAIEMENTS
═════════════════════════════════════════════════════════════════════════════

Étape 1: Démarrer le backend
─────────────────────────────────────────────────────────────────────────────
Terminal 1:
   cd backend
   uvicorn app.main:app --reload --port 8000

Étape 2: Démarrer le frontend
─────────────────────────────────────────────────────────────────────────────
Terminal 2:
   cd frontend
   npm run dev

Étape 3: Tester un paiement
─────────────────────────────────────────────────────────────────────────────
1. Ouvrir: http://localhost:5173/pricing

2. Cliquer sur "Essayer 7 jours" pour un plan

3. Remplir le formulaire Stripe avec:
   
   💳 CARTES DE TEST STRIPE
   ┌──────────────────────────────────────────────────────────────┐
   │ Succès:      4242 4242 4242 4242                             │
   │ Déclinée:    4000 0000 0000 0002                             │
   │ 3D Secure:   4000 0027 6000 3184                             │
   │                                                              │
   │ Date:        N'importe quelle date future (ex: 12/25)       │
   │ CVC:         N'importe quel 3 chiffres (ex: 123)            │
   │ Code postal: N'importe quel code (ex: 75001)                │
   └──────────────────────────────────────────────────────────────┘

4. Valider le paiement

5. Vérifier la redirection vers le dashboard

📊 VÉRIFIER LES PAIEMENTS
═════════════════════════════════════════════════════════════════════════════

Dashboard Stripe:
   https://dashboard.stripe.com/test/payments

Onglets à vérifier:
   • Paiements      → Voir les transactions
   • Clients        → Voir les abonnements créés
   • Abonnements    → Gérer les souscriptions
   • Événements     → Logs des webhooks

🎯 ENDPOINTS API DISPONIBLES
═════════════════════════════════════════════════════════════════════════════

Public:
   GET  http://localhost:8000/api/stripe/pricing
   → Récupère la liste des plans

Authentifié:
   POST http://localhost:8000/api/stripe/create-checkout-session
   → Crée une session de paiement

   POST http://localhost:8000/api/stripe/create-portal-session
   → Ouvre le portail client

   GET  http://localhost:8000/api/stripe/subscription/status
   → Statut de l'abonnement

🧪 TEST RAPIDE AVEC CURL
═════════════════════════════════════════════════════════════════════════════

# Récupérer les plans
curl http://localhost:8000/api/stripe/pricing | jq

# Devrait retourner:
{
  "plans": [
    {
      "id": "free",
      "name": "🌙 Gratuit",
      "price_monthly": 0,
      ...
    },
    {
      "id": "conteur",
      "name": "✨ Conteur",
      "price_monthly": 19,
      ...
    },
    ...
  ]
}

📝 SCÉNARIOS DE TEST COMPLETS
═════════════════════════════════════════════════════════════════════════════

Scénario 1: Paiement réussi
───────────────────────────────────────────────────────────────────────────
1. Choisir plan Conteur (19€/mois)
2. Carte: 4242 4242 4242 4242
3. ✅ Vérifier: Redirection vers dashboard
4. ✅ Vérifier: Plan mis à jour dans le profil
5. ✅ Vérifier: Abonnement actif dans Stripe

Scénario 2: Paiement décliné
───────────────────────────────────────────────────────────────────────────
1. Choisir plan Auteur (39€/mois)
2. Carte: 4000 0000 0000 0002
3. ✅ Vérifier: Message d'erreur
4. ✅ Vérifier: Aucun abonnement créé
5. ✅ Vérifier: Utilisateur reste en plan gratuit

Scénario 3: 3D Secure
───────────────────────────────────────────────────────────────────────────
1. Choisir plan Studio (99€/mois)
2. Carte: 4000 0027 6000 3184
3. ✅ Vérifier: Pop-up 3D Secure
4. Cliquer "Autoriser"
5. ✅ Vérifier: Paiement réussi

Scénario 4: Changement de plan
───────────────────────────────────────────────────────────────────────────
1. S'abonner au plan Conteur
2. Aller sur /dashboard/subscription
3. Cliquer "Gérer mon abonnement"
4. Changer pour plan Auteur
5. ✅ Vérifier: Mise à jour immédiate

Scénario 5: Annulation
───────────────────────────────────────────────────────────────────────────
1. Avoir un abonnement actif
2. Portail client → Annuler
3. ✅ Vérifier: Reste actif jusqu'à fin période
4. ✅ Vérifier: Message "Expire le XX/XX/XXXX"

🔍 DÉBUGGAGE
═════════════════════════════════════════════════════════════════════════════

Si un paiement ne fonctionne pas:

1. Vérifier la console backend
   → Logs des requêtes API

2. Vérifier la console frontend
   → Erreurs JavaScript

3. Vérifier Stripe Dashboard > Événements
   → Voir tous les webhooks reçus

4. Vérifier Stripe Dashboard > Logs
   → Voir toutes les requêtes API

⚠️  RAPPEL IMPORTANT
═════════════════════════════════════════════════════════════════════════════

Vous êtes en MODE TEST:
   ✅ Aucune vraie carte ne sera débitée
   ✅ Les clients créés sont fictifs
   ✅ Tout peut être supprimé sans conséquence

Pour passer en PRODUCTION:
   1. Obtenir les clés LIVE dans Stripe
   2. Remplacer sk_test_ par sk_live_
   3. Remplacer pk_test_ par pk_live_
   4. Configurer le webhook en production
   5. Tester avec une vraie carte (1€)

📞 RESSOURCES UTILES
═════════════════════════════════════════════════════════════════════════════

Documentation:
   • Guide Stripe:  docs/STRIPE_SETUP_GUIDE.md
   • Guide Admin:   docs/ADMIN_GUIDE.md
   • Résumé:        STRIPE_INTEGRATION_COMPLETE.md

Stripe:
   • Dashboard:     https://dashboard.stripe.com
   • Documentation: https://stripe.com/docs
   • Cartes test:   https://stripe.com/docs/testing

Support:
   • Stripe:        support@stripe.com
   • Hakawa:        Consulter les docs/

🎊 FÉLICITATIONS !
═════════════════════════════════════════════════════════════════════════════

Votre système de paiement Hakawa est prêt !

✨ Vous pouvez maintenant:
   • Accepter des paiements en toute sécurité
   • Gérer des abonnements automatiquement
   • Offrir plusieurs plans tarifaires
   • Suivre vos revenus en temps réel

┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│              🌙 HAKAWA - L'art de raconter, réinventé 🌙                  │
│                                                                           │
│                        Bon lancement ! 🚀                                 │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

EOF
