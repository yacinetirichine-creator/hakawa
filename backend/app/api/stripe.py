"""
Routes API pour les paiements Stripe
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Header, Body
from typing import Optional
from pydantic import BaseModel
import stripe
from app.config import settings
from app.services.stripe_service import stripe_service
from app.utils.admin import get_user_profile

router = APIRouter()

# Configuration Stripe
stripe.api_key = settings.stripe_secret_key


class CheckoutSessionCreateBody(BaseModel):
    price_id: Optional[str] = None
    plan_id: Optional[str] = None
    region_code: Optional[str] = None
    currency: Optional[str] = None
    billing_period: str = "monthly"


@router.get("/pricing")
async def get_pricing():
    """
    Récupère les informations de pricing
    Public - pas d'authentification requise
    """
    try:
        return stripe_service.get_pricing_info()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create-checkout-session")
async def create_checkout_session(
    payload: Optional[CheckoutSessionCreateBody] = Body(default=None),
    price_id: Optional[str] = None,
    plan_id: Optional[str] = None,
    region_code: Optional[str] = None,
    currency: Optional[str] = None,
    billing_period: Optional[str] = None,
    profile: dict = Depends(get_user_profile),
):
    """
    Crée une session Stripe Checkout pour un abonnement

    Args:
        price_id: ID du prix Stripe (legacy / query)
        plan_id: ID du plan Hakawa ("conteur", "auteur", "studio")
        region_code: Pays (ex: "FR") pour déduire la devise si besoin
        currency: Devise (ex: "EUR", "USD")
        billing_period: "monthly" ou "annual"
        profile: Profil utilisateur (injecté)
    """
    try:
        body = payload.model_dump() if payload else {}

        effective_plan_id = plan_id or body.get("plan_id")
        effective_region_code = region_code or body.get("region_code")
        effective_currency = currency or body.get("currency")
        effective_billing_period = (
            billing_period or body.get("billing_period") or "monthly"
        )
        effective_price_id = price_id or body.get("price_id")

        resolved_price_id: Optional[str] = None

        # If the frontend sends a plan, resolve the Stripe Price ID server-side
        if effective_plan_id:
            curr = (
                (effective_currency or "").strip().upper()
                if effective_currency
                else None
            )
            if not curr:
                region = (
                    (effective_region_code or "").strip().upper()
                    if effective_region_code
                    else ""
                )
                region_currency = {
                    # Europe
                    "FR": "EUR",
                    "BE": "EUR",
                    "CH": "EUR",
                    "ES": "EUR",
                    # North America
                    "US": "USD",
                    "CA": "CAD",
                    # LatAm
                    "MX": "MXN",
                    "AR": "ARS",
                    "CO": "COP",
                    # Africa
                    "MA": "MAD",
                    "SN": "XOF",
                    "CI": "XOF",
                }
                curr = region_currency.get(region, "EUR")
                if not effective_currency:
                    effective_currency = curr

            resolved_price_id = stripe_service.resolve_price_id(
                plan_id=effective_plan_id,
                billing_period=effective_billing_period,
                currency=curr,
            )

        # Backward compatibility: allow explicitly provided Stripe price_id
        if not resolved_price_id:
            resolved_price_id = effective_price_id

        if not resolved_price_id:
            raise ValueError(
                "Impossible de déterminer le price_id Stripe (plan_id/currency non configurés)."
            )

        # URLs de redirection
        success_url = f"{settings.frontend_url}/dashboard?payment=success"
        cancel_url = f"{settings.frontend_url}/pricing?payment=cancelled"

        # Créer la session
        session_data = stripe_service.create_checkout_session(
            user_id=profile["id"],
            price_id=resolved_price_id,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "billing_period": effective_billing_period,
                **({"plan_id": effective_plan_id} if effective_plan_id else {}),
                **(
                    {"region_code": effective_region_code}
                    if effective_region_code
                    else {}
                ),
                **({"currency": effective_currency} if effective_currency else {}),
            },
        )

        return session_data

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/create-portal-session")
async def create_portal_session(profile: dict = Depends(get_user_profile)):
    """
    Crée une session du portail client Stripe
    Permet de gérer l'abonnement (changement de plan, annulation, etc.)
    """
    try:
        return_url = f"{settings.frontend_url}/dashboard/subscription"

        portal_data = stripe_service.create_customer_portal_session(
            user_id=profile["id"], return_url=return_url
        )

        return portal_data

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request, stripe_signature: Optional[str] = Header(None)
):
    """
    Webhook Stripe pour gérer les événements de paiement

    Événements gérés:
    - checkout.session.completed: Paiement initial réussi
    - customer.subscription.updated: Abonnement mis à jour
    - customer.subscription.deleted: Abonnement annulé
    - invoice.payment_succeeded: Paiement récurrent réussi
    - invoice.payment_failed: Paiement échoué
    """

    # Récupérer le body de la requête
    payload = await request.body()

    # Vérifier la signature du webhook
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.stripe_webhook_secret
        )
    except ValueError:
        # Payload invalide
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        # Signature invalide
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Gérer l'événement
    event_type = event["type"]
    event_data = event["data"]["object"]

    import logging

    logger = logging.getLogger(__name__)

    try:
        if event_type == "checkout.session.completed":
            # Paiement initial réussi
            stripe_service.handle_checkout_completed(event_data)

        elif event_type == "customer.subscription.updated":
            # Abonnement mis à jour (changement de plan, renouvellement)
            stripe_service.handle_subscription_updated(event_data)

        elif event_type == "customer.subscription.deleted":
            # Abonnement annulé
            stripe_service.handle_subscription_deleted(event_data)

        elif event_type == "invoice.payment_succeeded":
            # Paiement récurrent réussi
            logger.info(f"✅ Paiement réussi: {event_data['id']}")

        elif event_type == "invoice.payment_failed":
            # Paiement échoué
            logger.warning(f"❌ Paiement échoué: {event_data['id']}")
            stripe_service.handle_payment_failed(event_data)

        else:
            logger.info(f"ℹ️  Événement non géré: {event_type}")

        return {"status": "success", "event_type": event_type}

    except Exception as e:
        logger.error(f"❌ Erreur webhook: {str(e)}", exc_info=True)
        # Retourner 200 pour éviter retry Stripe en boucle
        return {"status": "error", "error": str(e), "event_type": event_type}


@router.get("/subscription/status")
async def get_subscription_status(profile: dict = Depends(get_user_profile)):
    """
    Récupère le statut de l'abonnement de l'utilisateur
    """
    try:
        return {
            "tier": profile.get("subscription_tier", "free"),
            "expires_at": profile.get("subscription_expires_at"),
            "stripe_customer_id": profile.get("stripe_customer_id"),
            "stripe_subscription_id": profile.get("stripe_subscription_id"),
            "credits_illustrations": profile.get("credits_illustrations", 0),
            "is_active": profile.get("subscription_tier") != "free",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cancel-subscription")
async def cancel_subscription(profile: dict = Depends(get_user_profile)):
    """
    Annule l'abonnement de l'utilisateur
    L'abonnement reste actif jusqu'à la fin de la période payée
    """
    try:
        subscription_id = profile.get("stripe_subscription_id")

        if not subscription_id:
            raise HTTPException(status_code=400, detail="Aucun abonnement actif")

        # Annuler l'abonnement à la fin de la période
        subscription = stripe.Subscription.modify(
            subscription_id, cancel_at_period_end=True
        )

        return {
            "message": "Abonnement annulé",
            "active_until": subscription.current_period_end,
        }

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reactivate-subscription")
async def reactivate_subscription(profile: dict = Depends(get_user_profile)):
    """
    Réactive un abonnement qui était prévu pour être annulé
    """
    try:
        subscription_id = profile.get("stripe_subscription_id")

        if not subscription_id:
            raise HTTPException(status_code=400, detail="Aucun abonnement actif")

        # Annuler l'annulation programmée
        subscription = stripe.Subscription.modify(
            subscription_id, cancel_at_period_end=False
        )

        return {"message": "Abonnement réactivé", "status": subscription.status}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
