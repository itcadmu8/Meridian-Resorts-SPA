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
