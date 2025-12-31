"""Service Stripe pour gérer les paiements et abonnements Hakawa."""

import os
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
    def resolve_price_id(
        plan_id: str, billing_period: str, currency: str
    ) -> Optional[str]:
        """Resolve a Stripe Price ID from plan/period/currency.

        Priority:
        1) Explicit multi-currency env vars (recommended)
           - STRIPE_PRICE_ID_<PLAN>_<CURRENCY>_<PERIOD>
             ex: STRIPE_PRICE_ID_CONTEUR_USD_MONTHLY
        2) Legacy Hakawa settings (EUR only)
           - settings.stripe_price_<plan>_<period>
        3) Looser env vars without period (legacy / custom)
           - STRIPE_PRICE_ID_<PLAN>_<CURRENCY>
        """

        plan = (plan_id or "").strip().lower()
        period = (billing_period or "monthly").strip().lower()
        curr = (currency or "EUR").strip().upper()

        if plan not in {"conteur", "auteur", "studio"}:
            return None
        if period not in {"monthly", "annual"}:
            return None

        period_key = "MONTHLY" if period == "monthly" else "ANNUAL"
        env_key = f"STRIPE_PRICE_ID_{plan.upper()}_{curr}_{period_key}"
        if os.getenv(env_key):
            return os.getenv(env_key)

        # Legacy EUR-only settings
        if curr == "EUR":
            legacy_attr = f"stripe_price_{plan}_{period}"
            legacy_value = getattr(settings, legacy_attr, None)
            if legacy_value:
                return legacy_value

        # Legacy / custom: no period in key
        env_key_no_period = f"STRIPE_PRICE_ID_{plan.upper()}_{curr}"
        if os.getenv(env_key_no_period):
            return os.getenv(env_key_no_period)

        return None

    @staticmethod
    def _all_configured_price_ids() -> Dict[str, str]:
        """Return mapping price_id -> plan (best-effort)."""

        mapping: Dict[str, str] = {}

        # Legacy settings
        legacy = {
            "conteur": [
                settings.stripe_price_conteur_monthly,
                settings.stripe_price_conteur_annual,
            ],
            "auteur": [
                settings.stripe_price_auteur_monthly,
                settings.stripe_price_auteur_annual,
            ],
            "studio": [
                settings.stripe_price_studio_monthly,
                settings.stripe_price_studio_annual,
            ],
        }
        for plan, values in legacy.items():
            for value in values:
                if value:
                    mapping[str(value)] = plan

        # Multi-currency env vars
        for key, value in os.environ.items():
            if not key.startswith("STRIPE_PRICE_ID_"):
                continue
            if not value:
                continue

            # Expected formats:
            # - STRIPE_PRICE_ID_<PLAN>_<CURRENCY>_<PERIOD>
            # - STRIPE_PRICE_ID_<PLAN>_<CURRENCY>
            parts = key.split("_")
            # ['STRIPE','PRICE','ID',PLAN,...]
            if len(parts) < 4:
                continue
            plan_part = parts[3].lower()
            if plan_part in {"conteur", "auteur", "studio"}:
                mapping[str(value)] = plan_part

        return mapping

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
        import logging

        logger = logging.getLogger(__name__)

        try:
            user_id = session["metadata"]["user_id"]
            subscription_id = session["subscription"]
            customer_id = session["customer"]

            # IDEMPOTENCE: Vérifier si déjà traité
            existing = (
                supabase.table("profiles")
                .select("stripe_subscription_id")
                .eq("id", user_id)
                .execute()
            )

            if (
                existing.data
                and existing.data[0].get("stripe_subscription_id") == subscription_id
            ):
                logger.info(f"Checkout déjà traité pour {user_id}")
                return

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
    def handle_payment_failed(invoice: Dict[str, Any]) -> None:
        """
        Gère un échec de paiement

        Args:
            invoice: Objet invoice Stripe
        """
        import logging

        logger = logging.getLogger(__name__)

        try:
            customer_id = invoice["customer"]
            attempt_count = invoice.get("attempt_count", 1)

            # Trouver l'utilisateur
            profile = (
                supabase.table("profiles")
                .select("id, email, full_name")
                .eq("stripe_customer_id", customer_id)
                .execute()
            )

            if not profile.data:
                logger.warning(
                    f"⚠️  Utilisateur introuvable pour customer {customer_id}"
                )
                return

            user = profile.data[0]

            # Enregistrer l'échec dans payment_history
            supabase.table("payment_history").insert(
                {
                    "user_id": user["id"],
                    "stripe_invoice_id": invoice["id"],
                    "amount": invoice["amount_due"],
                    "currency": invoice["currency"],
                    "status": "failed",
                    "payment_type": "subscription",
                    "metadata": {
                        "attempt_count": attempt_count,
                        "failure_reason": invoice.get(
                            "last_finalization_error", {}
                        ).get("message"),
                    },
                }
            ).execute()

            logger.warning(
                f"❌ Paiement échoué pour {user['email']} (tentative {attempt_count})"
            )

            # TODO: Envoyer email à l'utilisateur
            # TODO: Si attempt_count >= 3, suspendre le compte

        except Exception as e:
            logger.error(f"❌ Erreur handle_payment_failed: {str(e)}")
            raise

    @staticmethod
    def _get_tier_from_price_id(price_id: str) -> str:
        """
        Détermine le tier à partir du price_id

        Args:
            price_id: ID du prix Stripe

        Returns:
            Nom du tier (conteur, auteur, studio)

        Raises:
            ValueError: Si price_id inconnu
        """
        price_mapping = StripeService._all_configured_price_ids()

        tier = price_mapping.get(price_id)
        if not tier:
            raise ValueError(f"Price ID inconnu: {price_id}")
        return tier

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
                        "3 chapitres par projet",
                        "5 générations IA/jour",
                        "2 illustrations/mois",
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
