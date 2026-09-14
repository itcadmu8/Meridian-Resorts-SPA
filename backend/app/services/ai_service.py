"""AI concierge chat orchestration backed by Google Gemini.

Implements a small manual function-calling loop: the model is given a set of
tool declarations backed by ``reservation_service``. When Gemini requests a
tool call we execute it against the local database and feed the result back
until the model produces a final natural-language reply.
"""

from datetime import date

from google import genai
from google.genai import types

from app.config import settings
from app.services import reservation_service

SYSTEM_INSTRUCTION = """You are "Nova", the friendly AI concierge for Meridian Resorts & Spa, \
a group of six luxury properties: Meridian Grand Resort, Meridian Seabreeze, Meridian Hillside, \
Meridian City Suites, Meridian Garden Spa, and Meridian Coastal Retreat.

Your job is to help guests:
- Learn about the resorts and the services available during their stay.
- Make a new room reservation/booking.
- Check the status of an existing reservation.
- Retrieve a guest's recorded preferences or special requests.

Amenities and services available at every Meridian property, which you can describe to guests:
- Spa & Wellness: full-service spa with massages, facials, sauna, and a fitness center. \
  Signature treatments include the Meridian Hot Stone Massage and Coastal Glow Facial.
- Dining (F&B): an all-day restaurant, a rooftop/beachfront bar, and 24-hour in-room dining.
- Recreation: outdoor pool, water sports (at coastal properties), guided nature/city tours, \
  and a kids' club.
- Rooms: Standard, Deluxe, and Suite room types are available at every property.
- Check-in is at 3:00 PM and check-out is at 11:00 AM. Wi-Fi is complimentary throughout.
- Loyalty tiers (Silver, Gold, Platinum) unlock perks such as late check-out and room upgrades.

Guidelines:
- Use the provided tools to look up real properties, reservations, and guest preferences instead \
  of guessing. Never invent a reservation ID, property name, or guest record.
- To create a reservation you need: guest full name, email, the property name, and check-in/check-out \
  dates (YYYY-MM-DD). Politely ask for anything missing before calling create_reservation.
- After a successful booking, clearly confirm the reservation ID, property, and dates back to the guest.
- If a tool returns an error, explain the problem plainly and suggest a fix (e.g. picking a valid \
  property name or a later check-out date).
- Keep replies concise, warm, and professional, like a five-star hotel concierge.
"""

_FUNCTION_DECLARATIONS = [
    types.FunctionDeclaration(
        name="list_properties",
        description="List all Meridian resort properties with their id, name, brand, and address.",
        parameters_json_schema={"type": "object", "properties": {}},
    ),
    types.FunctionDeclaration(
        name="check_reservation_status",
        description="Look up an existing reservation's status by reservation ID or guest name.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "reservation_id": {"type": "string", "description": "Reservation ID, e.g. R-2001"},
                "guest_name": {"type": "string", "description": "Guest full name"},
            },
        },
    ),
    types.FunctionDeclaration(
        name="get_guest_preferences",
        description="Get a guest's recorded preferences/special requests by name or guest ID.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "guest_name": {"type": "string"},
                "guest_id": {"type": "string"},
            },
        },
    ),
    types.FunctionDeclaration(
        name="create_reservation",
        description="Create a new hotel reservation/booking for a guest at a Meridian property.",
        parameters_json_schema={
            "type": "object",
            "properties": {
                "guest_name": {"type": "string"},
                "guest_email": {"type": "string"},
                "guest_phone": {"type": "string"},
                "property_name": {
                    "type": "string",
                    "description": "One of the Meridian property names",
                },
                "check_in": {"type": "string", "description": "YYYY-MM-DD"},
                "check_out": {"type": "string", "description": "YYYY-MM-DD"},
                "room_type": {
                    "type": "string",
                    "description": "Standard, Deluxe, or Suite",
                },
                "special_preference": {"type": "string"},
            },
            "required": ["guest_name", "guest_email", "property_name", "check_in", "check_out"],
        },
    ),
]

_TOOLS = [types.Tool(function_declarations=_FUNCTION_DECLARATIONS)]

_MAX_TOOL_HOPS = 5


def _handle_list_properties(_args: dict) -> dict:
    return {"properties": reservation_service.list_properties()}


def _handle_check_reservation_status(args: dict) -> dict:
    reservations = reservation_service.get_reservation_status(
        reservation_id=args.get("reservation_id") or None,
        guest_name=args.get("guest_name") or None,
    )
    if not reservations:
        return {"reservations": [], "message": "No matching reservation was found."}
    return {"reservations": reservations}


def _handle_get_guest_preferences(args: dict) -> dict:
    preferences = reservation_service.get_guest_preferences(
        guest_name=args.get("guest_name") or None,
        guest_id=args.get("guest_id") or None,
    )
    if not preferences:
        return {"preferences": [], "message": "No preferences on file for that guest."}
    return {"preferences": preferences}


def _handle_create_reservation(args: dict) -> dict:
    try:
        check_in = date.fromisoformat(args["check_in"])
        check_out = date.fromisoformat(args["check_out"])
    except (KeyError, ValueError):
        return {"error": "Dates must be provided in YYYY-MM-DD format."}

    try:
        reservation = reservation_service.create_reservation(
            guest_name=args["guest_name"],
            guest_email=args["guest_email"],
            property_name=args["property_name"],
            check_in=check_in,
            check_out=check_out,
            guest_phone=args.get("guest_phone") or None,
            room_type=args.get("room_type") or None,
            special_preference=args.get("special_preference") or None,
        )
    except (ValueError, KeyError) as exc:
        return {"error": str(exc)}

    return {"reservation": reservation}


_DISPATCH = {
    "list_properties": _handle_list_properties,
    "check_reservation_status": _handle_check_reservation_status,
    "get_guest_preferences": _handle_get_guest_preferences,
    "create_reservation": _handle_create_reservation,
}

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not configured on the server. Set it in the backend .env file."
            )
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def _build_history_contents(history: list[dict]) -> list[types.Content]:
    contents: list[types.Content] = []
    for turn in history:
        role = turn.get("role")
        text = turn.get("text", "")
        if role not in ("user", "model") or not text:
            continue
        contents.append(types.Content(role=role, parts=[types.Part(text=text)]))
    return contents


def chat(message: str, history: list[dict] | None = None) -> dict:
    """Send a guest message to Gemini, executing any tool calls it requests.

    Returns a dict with the model's final ``reply`` text and, if a reservation
    was created during this turn, the created ``reservation`` record.
    """
    client = _get_client()

    contents = _build_history_contents(history or [])
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_INSTRUCTION,
        tools=_TOOLS,
        temperature=0.4,
    )

    reservation_result: dict | None = None

    for _ in range(_MAX_TOOL_HOPS):
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=contents,
            config=config,
        )

        candidate = response.candidates[0] if response.candidates else None
        parts = candidate.content.parts if candidate and candidate.content else []
        function_calls = [part.function_call for part in parts if part.function_call]

        if not function_calls:
            reply_text = response.text or "I'm sorry, I couldn't generate a response. Please try again."
            return {"reply": reply_text, "reservation": reservation_result}

        contents.append(candidate.content)

        function_response_parts = []
        for call in function_calls:
            handler = _DISPATCH.get(call.name)
            args = dict(call.args) if call.args else {}

            if handler is None:
                result = {"error": f"Unknown tool '{call.name}'."}
            else:
                try:
                    result = handler(args)
                except Exception as exc:  # defensive: never let a tool crash the chat
                    result = {"error": str(exc)}

            if call.name == "create_reservation" and isinstance(result, dict) and "reservation" in result:
                reservation_result = result["reservation"]

            function_response_parts.append(
                types.Part(function_response=types.FunctionResponse(name=call.name, response=result))
            )

        contents.append(types.Content(role="user", parts=function_response_parts))

    return {
        "reply": "I ran into trouble completing that request. Please try again or contact the front desk.",
        "reservation": reservation_result,
    }
