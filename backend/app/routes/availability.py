from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Property, RatePlan, Reservation

router = APIRouter(prefix="/api/v1", tags=["availability"])


@router.get("/availability")
def check_availability(
    property_id: str = Query(...),
    check_in: date = Query(...),
    check_out: date = Query(...),
    db: Session = Depends(get_db),
):
    if check_out <= check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    property_ = db.get(Property, property_id)
    if property_ is None:
        raise HTTPException(status_code=404, detail="Property not found")

    rate_plans = db.execute(
        select(RatePlan).where(RatePlan.property_id == property_id)
    ).scalars().all()
    if not rate_plans:
        raise HTTPException(status_code=404, detail="No rate plans found for property")

    payload = []
    for rate_plan in rate_plans:
        booked_rows = db.execute(
            select(Reservation.id).where(
                Reservation.property_id == property_id,
                Reservation.rate_plan_id == rate_plan.id,
                Reservation.check_in < check_out,
                Reservation.check_out > check_in,
            )
        ).scalars().all()
        payload.append(
            {
                "rate_plan_id": rate_plan.id,
                "property_id": property_id,
                "name": rate_plan.name,
                "nightly_rate": float(rate_plan.nightly_rate),
                "booked": len(booked_rows),
                "available": True,
            }
        )

    return payload
