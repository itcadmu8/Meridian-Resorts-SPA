"""F&B order filtering and operations aggregation."""

from datetime import date, datetime, time, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app import models


def list_fnb_orders(
	db: Session,
	target_date: date | None = None,
	property_id: str | None = None,
) -> list[dict]:
	"""Return a property's F&B orders and cover count for the requested UTC day."""
	query = db.query(models.Order, models.Property.name).join(
		models.Property, models.Order.property_id == models.Property.id
	)

	if target_date:
		day_start = datetime.combine(target_date, time.min)
		day_end = day_start + timedelta(days=1)
		query = query.filter(models.Order.placed_at >= day_start, models.Order.placed_at < day_end)

	if property_id:
		query = query.filter(models.Order.property_id == property_id)

	rows = query.order_by(models.Order.placed_at.desc()).all()
	orders = []
	for order, property_name in rows:
		items = order.items or []
		covers = sum(item.get("qty", 0) for item in items if isinstance(item, dict))
		orders.append(
			{
				"id": order.id,
				"property_id": order.property_id,
				"property_name": property_name,
				"items": items,
				"total": Decimal(order.total),
				"covers": covers,
				"placed_at": order.placed_at,
			}
		)
	return orders