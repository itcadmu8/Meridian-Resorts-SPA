"""
availability.py

FastAPI router module for availability management. Provides endpoints for GET /availability.
"""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rate_plan import RatePlan
from app.models.reservation import Reservation

router = APIRouter(prefix="/api/v1", tags=["availability"])


@router.get("/availability")
def get_availability(
    property_id: str = Query(...),
    check_in: date = Query(...),
    check_out: date = Query(...),
    db: Session = Depends(get_db),
):
    if check_out <= check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    rate_plans = (
        db.execute(select(RatePlan).where(RatePlan.property_id == property_id)).scalars().all()
    )

    if not rate_plans:
        raise HTTPException(status_code=404, detail="No rate plans found for this property")

    booked_count = (
        db.execute(
            select(Reservation)
            .where(Reservation.property_id == property_id)
            .where(Reservation.check_in < check_out)
            .where(Reservation.check_out > check_in)
        )
        .scalars()
        .all()
    )

    capacity = 80
    available_count = max(0, capacity - len(booked_count))

    return [
        {
            "rate_plan_id": rp.id,
            "name": rp.name,
            "nightly_rate": rp.nightly_rate,
            "capacity": capacity,
            "booked": len(booked_count),
            "available_count": available_count,
            "available": available_count > 0,
        }
        for rp in rate_plans
    ]
