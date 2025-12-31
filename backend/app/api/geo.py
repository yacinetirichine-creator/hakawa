from fastapi import APIRouter, Request
import httpx

router = APIRouter()


def _get_client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        # First public IP in the list (best-effort)
        return xff.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


@router.get("/detect")
async def detect_region(request: Request):
    """Detect user region from IP (best-effort).

    Returns ISO-3166-1 alpha-2 country code in `region`.
    """

    client_ip = _get_client_ip(request)

    # Local development / internal
    if client_ip in {"127.0.0.1", "localhost", "::1"}:
        return {"region": "FR", "currency": "EUR", "detected": False}

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(f"http://ip-api.com/json/{client_ip}")
            data = response.json()
            country_code = data.get("countryCode") or "FR"
            return {"region": country_code, "detected": True}
    except Exception:
        return {"region": "FR", "detected": False}


@router.get("/pricing/{region}")
async def get_pricing(region: str):
    """Placeholder for server-side regional pricing.

    Note: Billing must match Stripe Price IDs per currency/region.
    """

    return {
        "region": region.upper(),
        "implemented": False,
        "message": "Server-side regional pricing not implemented yet.",
    }
