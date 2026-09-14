"""Cross-property operations dashboard aggregation (Section 8.3), owned by Member 4.

Reads directly from the Reservation, SpaAppointment and Order tables and derives
one response per property/day — no separate dashboard table (Section 6.2/11.2).
"""

from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models
from app.services.order_service import calculate_order_covers


def _count_arrivals(db: Session, property_id: str, target_date: date) -> int:
    return (
        db.query(models.Reservation)
        .filter(
            models.Reservation.property_id == property_id,
            models.Reservation.check_in == target_date,
            models.Reservation.status != models.ReservationStatus.cancelled,
        )
        .count()
    )


def _count_spa_bookings(db: Session, property_id: str, target_date: date) -> int:
    return (
        db.query(models.SpaAppointment)
        .filter(
            models.SpaAppointment.property_id == property_id,
            func.date(models.SpaAppointment.start_time) == target_date.isoformat(),
            models.SpaAppointment.status != models.SpaAppointmentStatus.cancelled,
        )
        .count()
    )


def _sum_fnb_covers(db: Session, property_id: str, target_date: date) -> int:
    orders = (
        db.query(models.Order)
        .filter(
            models.Order.property_id == property_id,
            func.date(models.Order.placed_at) == target_date.isoformat(),
        )
        .all()
    )
    return sum(calculate_order_covers(order.items) for order in orders)


def build_operations_dashboard(db: Session, target_date: date) -> dict:
    """Aggregate today's arrivals, spa bookings and F&B covers for all six
    properties (Section 8.3). Properties with no activity still appear with
    zeroed counts, per the Final Sprint dashboard test contract."""
    properties = db.query(models.Property).order_by(models.Property.name).all()
    property_summaries = [
        {
            "property_id": property_.id,
            "property_name": property_.name,
            "arrivals": _count_arrivals(db, property_.id, target_date),
            "spa_bookings": _count_spa_bookings(db, property_.id, target_date),
            "fnb_covers": _sum_fnb_covers(db, property_.id, target_date),
        }
        for property_ in properties
    ]
    return {"date": target_date.isoformat(), "properties": property_summaries}
