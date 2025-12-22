"""
Service Stripe pour gérer les paiements et abonnements Hakawa
"""

import stripe
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from app.config import settings
from app.utils.supabase import supabase

# Configuration Stripe
stripe.api_key = settings.stripe_secret_key


class StripeService:
    """Service pour gérer les paiements et abonnements Stripe"""

    # Mapping des plans Hakawa vers les tiers
    PLAN_TIERS = {"conteur": "conteur", "auteur": "auteur", "studio": "studio"}

    # Limites par plan
    PLAN_LIMITS = {
        "free": {
            "projects": 1,
            "ai_generations_daily": 5,
            "illustrations_monthly": 2,
            "illustration_styles": 1,
        },
        "conteur": {
            "projects": 5,
            "ai_generations_daily": 50,
            "illustrations_monthly": 20,
            "illustration_styles": 3,
        },
        "auteur": {
            "projects": 999999,  # Illimité
            "ai_generations_daily": 999999,
            "illustrations_monthly": 80,
            "illustration_styles": 999,
        },
        "studio": {
            "projects": 999999,
            "ai_generations_daily": 999999,
            "illustrations_monthly": 200,
            "illustration_styles": 999,
        },
    }

    @staticmethod
    def create_checkout_session(
        user_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Crée une session de paiement Stripe Checkout

        Args:
            user_id: ID de l'utilisateur
            price_id: ID du prix Stripe
            success_url: URL de redirection après succès
            cancel_url: URL de redirection après annulation
            metadata: Métadonnées supplémentaires

        Returns:
            Dict contenant l'URL de la session Checkout
        """
        try:
            # Récupérer le profil utilisateur
            profile = supabase.table("profiles").select("*").eq("id", user_id).execute()

            if not profile.data:
                raise ValueError("Profil utilisateur introuvable")

            user_profile = profile.data[0]

            # Préparer les métadonnées
            session_metadata = {
                "user_id": user_id,
                "email": user_profile["email"],
                **(metadata or {}),
            }

            # Créer la session Checkout
            session = stripe.checkout.Session.create(
                customer_email=user_profile["email"],
                payment_method_types=["card"],
                line_items=[{"price": price_id, "quantity": 1}],
                mode="subscription",
                success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
                cancel_url=cancel_url,
                metadata=session_metadata,
                allow_promotion_codes=True,  # Permet les codes promo
                billing_address_collection="required",
                subscription_data={
                    "metadata": session_metadata,
                    "trial_period_days": 7,  # 7 jours d'essai gratuit
                },
            )

            return {"session_id": session.id, "url": session.url}

        except stripe.error.StripeError as e:
            raise Exception(f"Erreur Stripe: {str(e)}")

    @staticmethod
    def create_customer_portal_session(user_id: str, return_url: str) -> Dict[str, str]:
        """
        Crée une session du portail client Stripe
        Permet à l'utilisateur de gérer son abonnement

        Args:
            user_id: ID de l'utilisateur
            return_url: URL de retour après modification

        Returns:
            Dict contenant l'URL du portail
        """
        try:
            # Récupérer le customer ID Stripe de l'utilisateur
            profile = (
                supabase.table("profiles")
                .select("stripe_customer_id")
                .eq("id", user_id)
                .execute()
            )

            if not profile.data or not profile.data[0].get("stripe_customer_id"):
                raise ValueError("Pas d'abonnement Stripe pour cet utilisateur")

            customer_id = profile.data[0]["stripe_customer_id"]

            # Créer la session du portail
            portal_session = stripe.billing_portal.Session.create(
                customer=customer_id, return_url=return_url
            )

            return {"url": portal_session.url}

        except stripe.error.StripeError as e:
            raise Exception(f"Erreur Stripe: {str(e)}")

    @staticmethod
    def handle_checkout_completed(session: Dict[str, Any]) -> None:
        """
        Gère l'événement de paiement réussi
        Met à jour le profil utilisateur avec l'abonnement

        Args:
            session: Objet session Stripe
        """
        try:
            user_id = session["metadata"]["user_id"]
            subscription_id = session["subscription"]
            customer_id = session["customer"]

            # Récupérer les détails de l'abonnement
            subscription = stripe.Subscription.retrieve(subscription_id)

            # Déterminer le tier en fonction du price_id
            price_id = subscription["items"]["data"][0]["price"]["id"]
            tier = StripeService._get_tier_from_price_id(price_id)

            # Calculer la date d'expiration
            current_period_end = datetime.fromtimestamp(
                subscription["current_period_end"]
            )

            # Mettre à jour le profil
            supabase.table("profiles").update(
                {
                    "subscription_tier": tier,
                    "subscription_expires_at": current_period_end.isoformat(),
                    "stripe_customer_id": customer_id,
                    "stripe_subscription_id": subscription_id,
                    "credits_illustrations": StripeService.PLAN_LIMITS[tier][
                        "illustrations_monthly"
                    ],
                    "updated_at": datetime.now().isoformat(),
                }
            ).eq("id", user_id).execute()

            # Log de l'événement
            print(f"✅ Abonnement activé pour {user_id}: {tier}")

        except Exception as e:
            print(f"❌ Erreur lors de la gestion du checkout: {str(e)}")
            raise

    @staticmethod
    def handle_subscription_updated(subscription: Dict[str, Any]) -> None:
        """
        Gère la mise à jour d'un abonnement

        Args:
            subscription: Objet subscription Stripe
        """
        try:
            customer_id = subscription["customer"]

            # Trouver l'utilisateur par customer_id
            profile = (
                supabase.table("profiles")
                .select("id")
                .eq("stripe_customer_id", customer_id)
                .execute()
            )

            if not profile.data:
                print(f"⚠️  Utilisateur introuvable pour customer {customer_id}")
                return

            user_id = profile.data[0]["id"]

            # Déterminer le nouveau tier
            price_id = subscription["items"]["data"][0]["price"]["id"]
            tier = StripeService._get_tier_from_price_id(price_id)

            # Date d'expiration
            current_period_end = datetime.fromtimestamp(
                subscription["current_period_end"]
            )

            # Mettre à jour le profil
            supabase.table("profiles").update(
                {
                    "subscription_tier": tier,
                    "subscription_expires_at": current_period_end.isoformat(),
                    "updated_at": datetime.now().isoformat(),
                }
            ).eq("id", user_id).execute()

            print(f"✅ Abonnement mis à jour pour {user_id}: {tier}")

        except Exception as e:
            print(f"❌ Erreur lors de la mise à jour: {str(e)}")
            raise

    @staticmethod
    def handle_subscription_deleted(subscription: Dict[str, Any]) -> None:
        """
        Gère l'annulation d'un abonnement
        Repasse l'utilisateur en plan gratuit

        Args:
            subscription: Objet subscription Stripe
        """
        try:
            customer_id = subscription["customer"]

            # Trouver l'utilisateur
            profile = (
                supabase.table("profiles")
                .select("id")
                .eq("stripe_customer_id", customer_id)
                .execute()
            )

            if not profile.data:
                print(f"⚠️  Utilisateur introuvable pour customer {customer_id}")
                return

            user_id = profile.data[0]["id"]

            # Repasser en plan gratuit
            supabase.table("profiles").update(
                {
                    "subscription_tier": "free",
                    "subscription_expires_at": None,
                    "stripe_subscription_id": None,
                    "credits_illustrations": StripeService.PLAN_LIMITS["free"][
                        "illustrations_monthly"
                    ],
                    "updated_at": datetime.now().isoformat(),
                }
            ).eq("id", user_id).execute()

            print(f"✅ Abonnement annulé pour {user_id}, retour au plan gratuit")

        except Exception as e:
            print(f"❌ Erreur lors de l'annulation: {str(e)}")
            raise

    @staticmethod
    def _get_tier_from_price_id(price_id: str) -> str:
        """
        Détermine le tier à partir du price_id

        Args:
            price_id: ID du prix Stripe

        Returns:
            Nom du tier (conteur, auteur, studio)
        """
        price_mapping = {
            settings.stripe_price_conteur_monthly: "conteur",
            settings.stripe_price_conteur_annual: "conteur",
            settings.stripe_price_auteur_monthly: "auteur",
            settings.stripe_price_auteur_annual: "auteur",
            settings.stripe_price_studio_monthly: "studio",
            settings.stripe_price_studio_annual: "studio",
        }

        return price_mapping.get(price_id, "free")

    @staticmethod
    def get_pricing_info() -> Dict[str, Any]:
        """
        Retourne les informations de pricing pour le frontend

        Returns:
            Dict contenant les prix et features de chaque plan
        """
        return {
            "plans": [
                {
                    "id": "free",
                    "name": "🌙 Gratuit",
                    "price_monthly": 0,
                    "price_annual": 0,
                    "stripe_price_id_monthly": None,
                    "stripe_price_id_annual": None,
                    "features": [
                        "1 projet",
                        "3 chapitres",
                        "5 générations IA/jour",
                        "2 illustrations",
                        "1 style d'illustration",
                        "Export PDF avec watermark",
                        "Mode enfant",
                    ],
                    "limits": StripeService.PLAN_LIMITS["free"],
                },
                {
                    "id": "conteur",
                    "name": "✨ Conteur",
                    "price_monthly": 19,
                    "price_annual": 149,
                    "stripe_price_id_monthly": settings.stripe_price_conteur_monthly,
                    "stripe_price_id_annual": settings.stripe_price_conteur_annual,
                    "features": [
                        "5 projets",
                        "Chapitres illimités",
                        "50 générations IA/jour",
                        "20 illustrations/mois",
                        "3 styles d'illustration",
                        "Export PDF + EPUB",
                        "Export KDP basique",
                        "Mode enfant",
                        "Support email",
                    ],
                    "limits": StripeService.PLAN_LIMITS["conteur"],
                    "popular": False,
                },
                {
                    "id": "auteur",
                    "name": "📚 Auteur",
                    "price_monthly": 39,
                    "price_annual": 319,
                    "stripe_price_id_monthly": settings.stripe_price_auteur_monthly,
                    "stripe_price_id_annual": settings.stripe_price_auteur_annual,
                    "features": [
                        "Projets illimités",
                        "Générations IA illimitées",
                        "80 illustrations/mois",
                        "Tous les styles",
                        "Export KDP complet",
                        "Couverture IA",
                        "Priorité de génération",
                        "Support prioritaire",
                    ],
                    "limits": StripeService.PLAN_LIMITS["auteur"],
                    "popular": True,
                },
                {
                    "id": "studio",
                    "name": "🏢 Studio",
                    "price_monthly": 99,
                    "price_annual": 799,
                    "stripe_price_id_monthly": settings.stripe_price_studio_monthly,
                    "stripe_price_id_annual": settings.stripe_price_studio_annual,
                    "features": [
                        "Tout du plan Auteur",
                        "200 illustrations/mois",
                        "Accès API",
                        "White-label",
                        "Support dédié",
                        "Formation 1-to-1",
                    ],
                    "limits": StripeService.PLAN_LIMITS["studio"],
                    "popular": False,
                },
            ]
        }


# Instance singleton
stripe_service = StripeService()
