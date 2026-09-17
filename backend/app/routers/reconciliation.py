"""F&B Nightly Reconciliation endpoint for UiPath automation & Staff Dashboard."""

from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.property import Property
from app.models.reservation import Reservation
from app.services.order_service import list_fnb_orders

router = APIRouter(prefix="/api/v1/orders", tags=["reconciliation"])


@router.get("/reconciliation")
def get_fnb_reconciliation(
    target_date: date = Query(default_factory=date.today, alias="date"),
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """
    Run or fetch F&B covers vs expected occupancy reconciliation across all properties.
    Fulfills Member 3 & UiPath automation output contract.
    """
    properties = db.execute(select(Property)).scalars().all()
    orders = list_fnb_orders(db, target_date=target_date)

    # Group covers by property
    covers_by_property: dict[str, int] = {p.id: 0 for p in properties}
    for order in orders:
        pid = order["property_id"]
        covers_by_property[pid] = covers_by_property.get(pid, 0) + order.get("covers", 0)

    # Calculate expected occupancy (confirmed / checked-in reservations on target_date)
    res_stmt = select(Reservation).where(
        Reservation.check_in <= target_date,
        Reservation.check_out >= target_date,
        Reservation.status.in_(["confirmed", "checked_in", "checked-in"]),
    )
    reservations = db.execute(res_stmt).scalars().all()

    occupancy_by_property: dict[str, int] = {p.id: 0 for p in properties}
    for res in reservations:
        pid = res.property_id
        occupancy_by_property[pid] = occupancy_by_property.get(pid, 0) + 1

    results = []
    total_flagged = 0

    for prop in properties:
        actual_covers = covers_by_property.get(prop.id, 0)
        expected_occupancy = occupancy_by_property.get(prop.id, 0)
        variance = actual_covers - expected_occupancy

        if expected_occupancy > 0:
            variance_pct = round((variance / expected_occupancy) * 100, 2)
            flagged = abs(variance_pct) > 20.0
        else:
            variance_pct = None
            flagged = actual_covers > 0

        if flagged:
            total_flagged += 1

        results.append(
            {
                "operating_date": target_date.isoformat(),
                "property_id": prop.id,
                "property_name": prop.name,
                "actual_covers": actual_covers,
                "expected_occupancy": expected_occupancy,
                "variance": variance,
                "variance_percent": variance_pct,
                "flagged": flagged,
            }
        )

    return {
        "operating_date": target_date.isoformat(),
        "total_properties": len(properties),
        "total_flagged": total_flagged,
        "items": results,
    }
