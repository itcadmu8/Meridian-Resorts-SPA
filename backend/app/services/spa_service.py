import logging
from collections.abc import Sequence
from datetime import UTC, date, datetime, time, timedelta

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, joinedload

from app import models
from app.schemas.spa import (
    SpaAppointmentOut,
    SpaAppointmentStatus,
    TodaySpaBookings,
)

logger = logging.getLogger(__name__)


class SpaServiceError(Exception):
    """Base exception for spa service errors."""

    def __init__(self, message: str, code: str = "SPA_SERVICE_ERROR"):
        super().__init__(message)
        self.message = message
        self.code = code


class SpaDatabaseError(SpaServiceError):
    """Exception raised when a database query fails in the spa service."""

    def __init__(self, message: str = "Failed to retrieve spa appointments"):
        super().__init__(message=message, code="DATABASE_ERROR")


def get_utc_day_bounds(target_date: date) -> tuple[datetime, datetime]:
    """Calculate the UTC start and end bounds for a given date."""
    start_utc = datetime.combine(target_date, time.min)
    end_utc = start_utc + timedelta(days=1)
    return start_utc, end_utc


def get_todays_spa_bookings(
    db: Session,
    today: date | None = None,
    property_id: str | None = None,
) -> TodaySpaBookings:
    """Retrieve all active (non-cancelled) spa appointments for the given current day (UTC).

    Includes property details via relationship join.
    Excludes past, future, and cancelled appointments.
    Supports empty results cleanly.
    """
    booking_date = today or datetime.now(UTC).date()
    start_time, end_time = get_utc_day_bounds(booking_date)

    try:
        # Construct query with relationship join to Property
        # Using joinedload and explicit join to ensure eager loading of property name
        query = (
            db.query(models.SpaAppointment)
            .join(models.Property, models.SpaAppointment.property_id == models.Property.id)
            .options(joinedload(models.SpaAppointment.property))
            .filter(
                models.SpaAppointment.starts_at >= start_time,
                models.SpaAppointment.starts_at < end_time,
            )
        )

        # Exclude cancelled appointments if status column is present
        if hasattr(models.SpaAppointment, "status"):
            query = query.filter(
                models.SpaAppointment.status != models.SpaAppointmentStatus.cancelled
            )

        # Optional property filter
        if property_id:
            query = query.filter(models.SpaAppointment.property_id == property_id)

        # Order chronologically by time_slot and then property name
        appointments: Sequence[models.SpaAppointment] = (
            query.order_by(models.SpaAppointment.starts_at.asc(), models.Property.name.asc()).all()
        )

        bookings: list[SpaAppointmentOut] = []
        for apt in appointments:
            property_name = apt.property.name if apt.property else "Unknown Property"
            status_val = (
                apt.status
                if hasattr(apt, "status") and apt.status
                else SpaAppointmentStatus.confirmed
            )

            bookings.append(
                SpaAppointmentOut(
                    id=apt.id,
                    property=property_name,
                    therapist=apt.therapist,
                    service=apt.service,
                    time_slot=apt.starts_at,
                    status=status_val,
                )
            )

        return TodaySpaBookings(
            date=booking_date,
            total_spa_bookings=len(bookings),
            bookings=bookings,
        )

    except SQLAlchemyError as exc:
        logger.error("Database error while querying today's spa appointments: %s", exc)
        raise SpaDatabaseError(f"Database error while querying spa appointments: {exc!s}") from exc
    except Exception as exc:
        logger.error("Unexpected error in spa service: %s", exc)
        raise SpaServiceError(f"Failed to process spa appointments: {exc!s}") from exc


def create_spa_appointment(
    db: Session,
    *,
    appointment_id: str,
    property_id: str,
    service: str,
    starts_at: datetime,
    therapist: str,
) -> models.SpaAppointment:
    """Create a confirmed appointment after the agent confirmation gate."""
    appointment = models.SpaAppointment(
        id=appointment_id,
        property_id=property_id,
        service=service,
        starts_at=starts_at,
        therapist=therapist,
        status=models.SpaAppointmentStatus.confirmed,
    )
    try:
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        return appointment
    except SQLAlchemyError as exc:
        db.rollback()
        logger.error("Database error while creating spa appointment: %s", exc)
        raise SpaDatabaseError(f"Database error while creating spa appointment: {exc!s}") from exc


def book_guest_spa_appointment(
    property_name: str,
    service: str,
    appointment_date: str,
    appointment_time: str = "14:00",
    therapist: str | None = None,
    guest_email: str | None = None,
    guest_name: str | None = None,
    guest_id: str | None = None,
) -> dict:
    """Book a new spa appointment for a guest."""
    from uuid import uuid4
    from sqlalchemy import select
    from app.database import SessionLocal

    with SessionLocal() as session:
        prop = session.execute(
            select(models.Property).where(models.Property.name.ilike(f"%{property_name}%"))
        ).scalars().first()
        if not prop:
            prop = session.execute(select(models.Property)).scalars().first()

        property_id = prop.id if prop else "P-001"
        prop_name = prop.name if prop else "Meridian Grand Resort"

        try:
            time_parts = appointment_time.replace(" ", "").lower()
            if "pm" in time_parts or "am" in time_parts:
                time_obj = datetime.strptime(appointment_time.strip(), "%I:%M %p").time()
            elif ":" in time_parts:
                time_obj = datetime.strptime(appointment_time.strip(), "%H:%M").time()
            else:
                time_obj = time(14, 0)
            date_obj = date.fromisoformat(appointment_date)
            starts_at = datetime.combine(date_obj, time_obj)
        except Exception:
            starts_at = datetime.now(UTC) + timedelta(days=1)

        apt_id = f"SPA-{uuid4().hex[:6].upper()}"
        therapist_name = therapist or "Meridian Spa Specialist"

        apt = models.SpaAppointment(
            id=apt_id,
            property_id=property_id,
            service=service,
            starts_at=starts_at,
            therapist=therapist_name,
            status=models.SpaAppointmentStatus.confirmed,
            guest_id=guest_id,
            guest_email=guest_email,
            guest_name=guest_name,
        )
        session.add(apt)
        session.commit()

        return {
            "appointment_id": apt_id,
            "property_name": prop_name,
            "service": service,
            "date": starts_at.strftime("%Y-%m-%d"),
            "time": starts_at.strftime("%H:%M"),
            "therapist": therapist_name,
            "status": "Confirmed",
        }


def list_guest_spa_appointments(
    guest_email: str | None = None,
    guest_name: str | None = None,
    guest_id: str | None = None,
) -> list[dict]:
    """Retrieve existing spa appointments for a specific guest."""
    from sqlalchemy import select, or_
    from app.database import SessionLocal

    if not guest_email and not guest_name and not guest_id:
        return []

    conditions = []
    if guest_id:
        conditions.append(models.SpaAppointment.guest_id == guest_id)
    if guest_email:
        conditions.append(models.SpaAppointment.guest_email.ilike(guest_email))
        conditions.append(models.SpaAppointment.guest_email.ilike(f"%{guest_email}%"))
    if guest_name:
        conditions.append(models.SpaAppointment.guest_name.ilike(f"%{guest_name}%"))

    with SessionLocal() as session:
        stmt = (
            select(models.SpaAppointment, models.Property)
            .join(models.Property, models.Property.id == models.SpaAppointment.property_id)
            .where(or_(*conditions))
            .order_by(models.SpaAppointment.starts_at.desc())
        )
        rows = session.execute(stmt).all()

        return [
            {
                "appointment_id": apt.id,
                "property_name": prop.name,
                "service": apt.service,
                "starts_at": apt.starts_at.isoformat(),
                "therapist": apt.therapist,
                "status": apt.status if hasattr(apt, "status") else "Confirmed",
            }
            for apt, prop in rows
        ]

