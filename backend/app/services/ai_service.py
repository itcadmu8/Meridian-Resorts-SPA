"""Guest AI service with a Gemini fallback and a local concierge backup."""

from __future__ import annotations

from datetime import date

from app.config import settings
from app.services.reservation_service import create_reservation, get_guest_preferences, get_reservation_status, list_properties

try:
    from google import genai
    from google.genai import types
except Exception:  # pragma: no cover - optional dependency
    genai = None
    types = None


def _local_reply(message: str) -> str:
    lower = message.lower()
    if "spa" in lower or "massage" in lower:
        return "I can help you book a spa treatment. Tell me which service you want and the date you prefer, and I’ll check availability for your stay."
    if "reservation" in lower or "stay" in lower:
        return "I can look up your current reservation or help plan a new one at one of the Meridian properties."
    if "dining" in lower or "restaurant" in lower:
        return "Our guests enjoy beachfront dining, wellness menus, and in-room dining at every Meridian property."
    return "I can help with Meridian resort information, dining, spa services, and guest reservations."


def chat(message: str, history: list[dict] | None = None) -> dict:
    """Return a natural-language response and optional booking payload."""
    if not settings.gemini_api_key or genai is None:
        return {"reply": _local_reply(message), "reservation": None}

    system_instruction = (
        "You are Nova, the Meridian guest concierge. Help with property information, dining, spa treatments, "
        "and reservations. Be warm and concise. Use real property names and ask for missing booking details before any reservation is created."
    )

    try:
        client = genai.Client(api_key=settings.gemini_api_key)
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=[
                {"role": "user", "parts": [{"text": message}]},
            ],
            config={"system_instruction": system_instruction, "temperature": 0.3},
        )
        reply = getattr(response, "text", None) or _local_reply(message)
        return {"reply": reply, "reservation": None}
    except Exception:
        return {"reply": _local_reply(message), "reservation": None}


def list_properties_for_chat():
    return list_properties()


def check_reservation_status_for_chat(reservation_id=None, guest_name=None):
    return get_reservation_status(reservation_id=reservation_id, guest_name=guest_name)


def get_guest_preferences_for_chat(guest_name=None, guest_id=None):
    return get_guest_preferences(guest_name=guest_name, guest_id=guest_id)


def create_reservation_for_chat(**kwargs):
    if kwargs.get("check_in") and kwargs.get("check_out"):
        kwargs["check_in"] = date.fromisoformat(kwargs["check_in"])
        kwargs["check_out"] = date.fromisoformat(kwargs["check_out"])
    return create_reservation(**kwargs)
