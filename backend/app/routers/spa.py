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
    except Exception as exc:
        logger.error("Unhandled error in spa router: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred"},
        ) from exc
