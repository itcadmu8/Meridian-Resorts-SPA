from datetime import date
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.guest import Guest
from app.models.property import Property
from app.models.reservation import Reservation


def list_arrivals(
    db: Session,
    target_date: Optional[date] = None,
    property_id: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Dict[str, Any]]:
    stmt = (
        select(Reservation, Guest, Property)
        .join(Guest, Reservation.guest_id == Guest.id)
        .join(Property, Reservation.property_id == Property.id)
    )

    if target_date:
        stmt = stmt.where(Reservation.check_in == target_date)
    if property_id:
        stmt = stmt.where(Reservation.property_id == property_id)
    if status:
        stmt = stmt.where(Reservation.status == status)

    results = db.execute(stmt).all()
    arrivals = []
    for res, guest, prop in results:
        adults_cnt = getattr(res, "adults", None)
        if adults_cnt is None:
            adults_cnt = 1
        children_cnt = getattr(res, "children", None)
        if children_cnt is None:
            children_cnt = 0
        arrivals.append({
            "id": res.id,
            "reservation_id": res.id,
            "guest_id": guest.id,
            "guest_name": guest.name,
            "property_id": prop.id,
            "property_name": prop.name,
            "check_in": res.check_in.isoformat() if res.check_in else "",
            "check_out": res.check_out.isoformat() if res.check_out else "",
            "status": res.status.value if hasattr(res.status, "value") else str(res.status),
            "loyalty_tier": guest.loyalty_tier,
            "room_number": getattr(res, "room_number", "Not assigned"),
            "special_preference": getattr(guest, "special_preference", None) or "No preference recorded",
            "adults": adults_cnt,
            "children": children_cnt,
            "total_guests": adults_cnt + children_cnt,
        })
    return arrivals