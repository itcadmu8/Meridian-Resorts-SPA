"""Spa booking agent orchestration with a mandatory confirmation stop."""

from datetime import date
from typing import Any

from sqlalchemy.orm import Session

from app import models
from app.ai.agent.confirmation import (
    BookingConfirmation,
    create_confirmation,
    is_explicit_confirmation,
)
from app.ai.agent.tools import (
    create_confirmed_spa_appointment,
    get_available_spa_slots,
    get_guest_reservation_context,
)


def recommend_spa_slot(
    db: Session,
    *,
    guest_id: str,
    service: str,
    target_date: date,
) -> dict[str, Any]:
    """Recommend a live slot from one of the guest's active reservations."""
    reservations = get_guest_reservation_context(db, guest_id)
    reservation = next(
        (item for item in reservations if item["check_in"] <= target_date < item["check_out"]),
        None,
    )
    if reservation is None:
        return {"status": "needs_reservation", "message": "No active reservation covers that date."}

    slots = get_available_spa_slots(
        db,
        property_id=reservation["property_id"],
        target_date=target_date,
        service=service,
    )
    if not slots:
        return {"status": "unavailable", "message": "No spa slots are available on that date."}

    slot = slots[0]
    confirmation = create_confirmation(
        guest_id=guest_id,
        property_id=reservation["property_id"],
        service=service,
        starts_at=slot.isoformat(),
    )
    return {
        "status": "awaiting_confirmation",
        "reservation_id": reservation["reservation_id"],
        "property_id": reservation["property_id"],
        "service": service,
        "starts_at": slot,
        "confirmation": confirmation,
    }


def confirm_spa_booking(
    db: Session,
    *,
    confirmation: BookingConfirmation,
    guest_id: str,
    message: str,
) -> models.SpaAppointment:
    """Finalize a recommendation only when the authenticated guest confirms."""
    if confirmation.guest_id != guest_id or not is_explicit_confirmation(message):
        raise ValueError("Explicit confirmation from the authenticated guest is required")
    return create_confirmed_spa_appointment(db, confirmation)
