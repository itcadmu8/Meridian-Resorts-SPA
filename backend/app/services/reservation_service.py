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
    reservation_id: str | None = None,
    guest_name: str | None = None,
    guest_email: str | None = None,
    guest_id: str | None = None,
) -> list[dict]:
    """Look up reservation(s) by reservation id, guest name, email, or guest id."""
    if not reservation_id and not guest_name and not guest_email and not guest_id:
        return []

    from sqlalchemy import or_

    stmt = (
        select(Reservation, Guest, Property)
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
    )
    if reservation_id:
        stmt = stmt.where(Reservation.id == reservation_id)
    else:
        conditions = []
        if guest_id:
            conditions.append(Guest.id == guest_id)
        if guest_email:
            conditions.append(Guest.email.ilike(guest_email))
            conditions.append(Guest.email.ilike(f"%{guest_email}%"))
            if guest_email.lower() in ("guest", "guest@meridian.com", "guest@meridianresorts.com"):
                conditions.append(Guest.id == "G-1001")
        if guest_name:
            conditions.append(Guest.name.ilike(f"%{guest_name}%"))
            if guest_name.lower() in ("guest", "guest user"):
                conditions.append(Guest.id == "G-1001")
        if conditions:
            stmt = stmt.where(or_(*conditions))
        else:
            return []

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
            "adults": getattr(reservation, "adults", 1),
            "children": getattr(reservation, "children", 0),
            "total_members": getattr(reservation, "adults", 1) + getattr(reservation, "children", 0),
        }
        for reservation, guest, prop in rows
    ]


def get_guest_preferences(
    guest_name: str | None = None,
    guest_id: str | None = None,
    guest_email: str | None = None,
) -> list[dict]:
    """Look up a guest's recorded special preferences/requests."""
    if not guest_name and not guest_id and not guest_email:
        return []

    from sqlalchemy import or_

    stmt = select(Reservation, Guest).join(Guest, Guest.id == Reservation.guest_id)
    conditions = []
    if guest_id:
        conditions.append(Guest.id == guest_id)
    if guest_email:
        conditions.append(Guest.email.ilike(guest_email))
        conditions.append(Guest.email.ilike(f"%{guest_email}%"))
        if guest_email.lower() in ("guest", "guest@meridian.com", "guest@meridianresorts.com"):
            conditions.append(Guest.id == "G-1001")
    if guest_name:
        conditions.append(Guest.name.ilike(f"%{guest_name}%"))
        if guest_name.lower() in ("guest", "guest user"):
            conditions.append(Guest.id == "G-1001")
    if conditions:
        stmt = stmt.where(or_(*conditions))
    else:
        return []

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
    adults: int = 1,
    children: int = 0,
) -> dict:
    """Create (or reuse) a guest and book a new reservation for them."""
    if check_out <= check_in:
        raise ValueError("Check-out date must be after the check-in date.")

    total_members = (adults or 0) + (children or 0)
    if total_members < 1:
        raise ValueError("At least 1 member must be included in the reservation.")
    if total_members > 80:
        raise ValueError("Maximum 80 members (adults + children) allowed per resort stay.")

    with SessionLocal() as session:
        # Try direct match
        property_row = session.execute(
            select(Property).where(Property.name.ilike(f"%{property_name}%"))
        ).scalars().first()

        # If not found, strip location info like "(Sri Lanka)" or ", Maldives"
        if property_row is None:
            clean_name = property_name.split("(")[0].split(",")[0].strip()
            property_row = session.execute(
                select(Property).where(Property.name.ilike(f"%{clean_name}%"))
            ).scalars().first()

        # If still not found, search key tokens
        if property_row is None:
            tokens = [t for t in property_name.replace("(", " ").replace(")", " ").replace(",", " ").split() if len(t) > 3 and t.lower() not in ("meridian", "resort", "hotel", "spa")]
            for token in tokens:
                property_row = session.execute(
                    select(Property).where(Property.name.ilike(f"%{token}%"))
                ).scalars().first()
                if property_row:
                    break

        if property_row is None:
            available = ", ".join(p.name for p in session.execute(select(Property)).scalars().all())
            raise ValueError(
                f"Unknown property '{property_name}'. Available properties: {available}"
            )

        # Enforce resort total active capacity limit of 80 members for overlapping dates (excluding background synthetic telemetry data R-5xxx / R-6xxx)
        overlapping_res = session.execute(
            select(Reservation).where(
                Reservation.property_id == property_row.id,
                Reservation.status != "Cancelled",
                ~Reservation.id.like("R-5%"),
                ~Reservation.id.like("R-6%"),
                Reservation.check_in < check_out,
                Reservation.check_out > check_in,
            )
        ).scalars().all()
        existing_members = sum((r.adults or 1) + (r.children or 0) for r in overlapping_res)
        if existing_members + total_members > 80:
            raise ValueError(
                f"Resort capacity exceeded: Maximum 80 total members allowed to stay at {property_row.name} for these dates (currently {existing_members} booked)."
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

        effective_room_type = room_type or "Standard"
        reservation = Reservation(
            id=_next_id(session, Reservation, "R", 4),
            guest_id=guest.id,
            property_id=property_row.id,
            rate_plan_id=DEFAULT_RATE_PLAN_ID,
            check_in=check_in,
            check_out=check_out,
            status="Confirmed",
            room_type=effective_room_type,
            special_preference=special_preference,
            adults=adults,
            children=children,
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
            "adults": reservation.adults,
            "children": reservation.children,
            "total_members": reservation.adults + reservation.children,
        }
