"""Database helpers shared by REST routes and the AI concierge tool calls."""

from datetime import date

from sqlalchemy import select

from app.database import SessionLocal
from app.models.guest import Guest
from app.models.property import Property
from app.models.reservation import Reservation

DEFAULT_RATE_PLAN_ID = "RP-001"


def list_properties() -> list[dict]:
    """Return every Meridian property with its id, name, brand, and address."""
    with SessionLocal() as session:
        rows = session.execute(select(Property)).scalars().all()
        return [
            {"id": p.id, "name": p.name, "brand": p.brand, "address": p.address}
            for p in rows
        ]


def _next_id(session, model, prefix: str, pad: int = 4) -> str:
    ids = session.execute(select(model.id)).scalars().all()
    numeric_suffixes = []
    for existing_id in ids:
        try:
            numeric_suffixes.append(int(existing_id.split("-")[-1]))
        except (ValueError, IndexError):
            continue
    next_number = (max(numeric_suffixes) + 1) if numeric_suffixes else 1
    return f"{prefix}-{next_number:0{pad}d}"


def get_reservation_status(
    reservation_id: str | None = None, guest_name: str | None = None
) -> list[dict]:
    """Look up reservation(s) by reservation id or guest name."""
    if not reservation_id and not guest_name:
        return []

    stmt = (
        select(Reservation, Guest, Property)
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
    )
    if reservation_id:
        stmt = stmt.where(Reservation.id == reservation_id)
    elif guest_name:
        stmt = stmt.where(Guest.name.ilike(f"%{guest_name}%"))

    with SessionLocal() as session:
        rows = session.execute(stmt).all()

    return [
        {
            "reservation_id": reservation.id,
            "guest_name": guest.name,
            "property_name": prop.name,
            "check_in": reservation.check_in.isoformat(),
            "check_out": reservation.check_out.isoformat(),
            "status": reservation.status,
            "room_number": reservation.room_number,
            "room_type": reservation.room_type,
        }
        for reservation, guest, prop in rows
    ]


def get_guest_preferences(
    guest_name: str | None = None, guest_id: str | None = None
) -> list[dict]:
    """Look up a guest's recorded special preferences/requests."""
    if not guest_name and not guest_id:
        return []

    stmt = select(Reservation, Guest).join(Guest, Guest.id == Reservation.guest_id)
    if guest_id:
        stmt = stmt.where(Guest.id == guest_id)
    elif guest_name:
        stmt = stmt.where(Guest.name.ilike(f"%{guest_name}%"))

    with SessionLocal() as session:
        rows = session.execute(stmt).all()

    return [
        {
            "guest_id": guest.id,
            "guest_name": guest.name,
            "loyalty_tier": guest.loyalty_tier,
            "reservation_id": reservation.id,
            "special_preference": reservation.special_preference,
            "room_type": reservation.room_type,
        }
        for reservation, guest in rows
    ]


def create_reservation(
    guest_name: str,
    guest_email: str,
    property_name: str,
    check_in: date,
    check_out: date,
    guest_phone: str | None = None,
    room_type: str | None = None,
    special_preference: str | None = None,
) -> dict:
    """Create (or reuse) a guest and book a new reservation for them."""
    if check_out <= check_in:
        raise ValueError("Check-out date must be after the check-in date.")

    with SessionLocal() as session:
        property_row = session.execute(
            select(Property).where(Property.name.ilike(f"%{property_name}%"))
        ).scalars().first()
        if property_row is None:
            available = ", ".join(p.name for p in session.execute(select(Property)).scalars().all())
            raise ValueError(
                f"Unknown property '{property_name}'. Available properties: {available}"
            )

        guest = session.execute(
            select(Guest).where(Guest.email.ilike(guest_email))
        ).scalars().first()

        if guest is None:
            guest = Guest(
                id=_next_id(session, Guest, "G", 4),
                name=guest_name,
                email=guest_email,
                phone=guest_phone,
                loyalty_tier="Silver",
            )
            session.add(guest)
            session.flush()

        reservation = Reservation(
            id=_next_id(session, Reservation, "R", 4),
            guest_id=guest.id,
            property_id=property_row.id,
            rate_plan_id=DEFAULT_RATE_PLAN_ID,
            check_in=check_in,
            check_out=check_out,
            status="Confirmed",
            room_type=room_type,
            special_preference=special_preference,
        )
        session.add(reservation)
        session.commit()

        return {
            "reservation_id": reservation.id,
            "guest_id": guest.id,
            "guest_name": guest.name,
            "property_name": property_row.name,
            "check_in": check_in.isoformat(),
            "check_out": check_out.isoformat(),
            "status": reservation.status,
            "room_type": room_type,
            "special_preference": special_preference,
        }
