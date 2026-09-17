"""Transactional tools used by the spa booking agent."""

import uuid
from datetime import date, datetime, timedelta
from typing import Any

from sqlalchemy.orm import Session

from app import models
from app.ai.agent.confirmation import BookingConfirmation
from app.services.spa_service import create_spa_appointment


def get_guest_reservation_context(db: Session, guest_id: str) -> list[dict[str, Any]]:
    """Return the authenticated guest's active reservation context."""
    reservations = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.guest_id == guest_id,
            models.Reservation.status == models.ReservationStatus.confirmed,
        )
        .order_by(models.Reservation.check_in.asc())
        .all()
    )
    return [
        {
            "reservation_id": reservation.id,
            "property_id": reservation.property_id,
            "check_in": reservation.check_in,
            "check_out": reservation.check_out,
        }
        for reservation in reservations
    ]


def get_available_spa_slots(
    db: Session,
    *,
    property_id: str,
    target_date: date,
    service: str,
    slot_minutes: int = 60,
) -> list[datetime]:
    """Return live, hourly slots not occupied by an active appointment."""
    del service, slot_minutes
    start = datetime.combine(target_date, datetime.min.time())
    end = start + timedelta(days=1)
    booked = {
        appointment.starts_at
        for appointment in db.query(models.SpaAppointment)
        .filter(
            models.SpaAppointment.property_id == property_id,
            models.SpaAppointment.starts_at >= start,
            models.SpaAppointment.starts_at < end,
            models.SpaAppointment.status != models.SpaAppointmentStatus.cancelled,
        )
        .all()
    }
    return [
        candidate
        for hour in range(9, 18)
        if (candidate := datetime.combine(target_date, datetime.min.time()).replace(hour=hour))
        not in booked
    ]


def create_confirmed_spa_appointment(
    db: Session, confirmation: BookingConfirmation, therapist: str = "Meridian Spa Team"
) -> models.SpaAppointment:
    """Create an appointment only after the agent has received confirmation."""
    return create_spa_appointment(
        db,
        appointment_id=str(uuid.uuid4()),
        property_id=confirmation.property_id,
        service=confirmation.service,
        starts_at=datetime.fromisoformat(confirmation.starts_at),
        therapist=therapist,
    )
