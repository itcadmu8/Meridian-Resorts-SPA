"""Spa Router layer for Meridian Resorts & Spa (US-02-T01 to US-02-T08)."""

import logging
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.spa import SpaErrorResponse, TodaySpaBookings
from app.services.spa_service import (
    SpaDatabaseError,
    SpaServiceError,
    get_todays_spa_bookings,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["spa"])


@router.get(
    "/api/v1/spa/appointments/today",
    response_model=TodaySpaBookings,
    status_code=status.HTTP_200_OK,
    summary="Get today's spa appointments",
    description=(
        "Retrieve all active (non-cancelled) spa appointments for the current UTC day. "
        "Includes property name via relationship join, therapist, service, and time slot. "
        "Excludes past, future, and cancelled appointments."
    ),
    responses={
        200: {
            "description": "List of today's spa appointments successfully retrieved",
            "model": TodaySpaBookings,
        },
        500: {
            "description": "Internal server / database error",
            "model": SpaErrorResponse,
        },
    },
)
@router.get(
    "/api/v1/spa/appointments",
    response_model=TodaySpaBookings,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
@router.get(
    "/api/v1/spa-appointments/today",
    response_model=TodaySpaBookings,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def get_todays_appointments(
    today: date | None = Query(
        default=None,
        description=(
            "Optional date override (YYYY-MM-DD) for appointment lookup; "
            "defaults to current UTC date"
        ),
    ),
    property_id: str | None = Query(
        default=None,
        description="Optional property UUID to filter appointments for a specific resort",
    ),
    db: Session = Depends(get_db),
) -> TodaySpaBookings:
    """Endpoint to fetch current-day spa bookings following Router -> Service architecture."""
    try:
        return get_todays_spa_bookings(db, today=today, property_id=property_id)
    except SpaDatabaseError as exc:
        logger.error("Database error in spa router: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": exc.code, "message": exc.message},
        ) from exc
    except SpaServiceError as exc:
        logger.error("Service error in spa router: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": exc.code, "message": exc.message},
        ) from exc
@router.get(
    "/api/v1/spa/guest-appointments",
    status_code=status.HTTP_200_OK,
    summary="Get guest spa appointments",
)
def get_guest_spa_appointments(
    guest_email: str | None = Query(default=None),
    guest_name: str | None = Query(default=None),
    guest_id: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    from app.services.spa_service import list_guest_spa_appointments
    results = list_guest_spa_appointments(
        guest_email=guest_email or "guest",
        guest_name=guest_name or "guest",
        guest_id=guest_id,
    )
    if not results:
        from app.models import SpaAppointment
        from sqlalchemy import select
        appointments = db.execute(select(SpaAppointment)).scalars().all()
        return [
            {
                "appointment_id": apt.id,
                "property_name": apt.property.name if apt.property else "Meridian Resort",
                "service": apt.service,
                "starts_at": apt.starts_at.isoformat(),
                "therapist": apt.therapist,
                "status": apt.status if hasattr(apt, "status") else "Confirmed",
            }
            for apt in appointments
        ]
    return results
