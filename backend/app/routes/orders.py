from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.property import Property

router = APIRouter(prefix="/api/v1", tags=["orders"])


def _order_covers(items) -> int:
    if not isinstance(items, list):
        return 0
    return sum(int(item.get("qty") or 0) for item in items if isinstance(item, dict))


@router.get("/orders")
def list_orders(
    property_id: str | None = Query(default=None),
    date: date | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    stmt = select(Order, Property.name.label("property_name")).join(
        Property, Property.id == Order.property_id
    )

    if property_id:
        stmt = stmt.where(Order.property_id == property_id)
    if date is not None:
        stmt = stmt.where(Order.placed_at >= date)
        stmt = stmt.where(Order.placed_at < date.fromordinal(date.toordinal() + 1))

    rows = db.execute(stmt).all()
    total = len(rows)
    start = (page - 1) * page_size
    page_rows = rows[start : start + page_size]

    data = [
        {
            "id": order.id,
            "property_id": order.property_id,
            "property_name": property_name,
            "guest_id": order.guest_id,
            "items": order.items,
            "covers": _order_covers(order.items),
            "total": order.total,
            "placed_at": order.placed_at.isoformat(),
        }
        for order, property_name in page_rows
    ]

    return {
        "success": True,
        "data": data,
        "meta": {"total": total, "page": page, "page_size": page_size},
    }
