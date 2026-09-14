"""F&B order queries and nightly covers-versus-occupancy reconciliation."""

from collections import defaultdict
from datetime import UTC, date, datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models

DEFAULT_VARIANCE_THRESHOLD_PERCENT = 20.0


def _positive_quantity(value: object) -> int:
	if isinstance(value, bool):
		return 0
	try:
		return max(int(value), 0)
	except (TypeError, ValueError):
		return 0


def calculate_order_covers(items: list[dict] | None) -> int:
	"""Return covers explicitly represented by F&B order items.

	The shared Order model has no separate covers column. An item can provide a
	numeric ``covers`` value, or it can be identified as a cover by ``is_cover``
	or by including "cover" in its name.
	"""
	if not items:
		return 0

	explicit_covers = [
		_positive_quantity(item.get("covers"))
		for item in items
		if isinstance(item, dict) and item.get("covers") is not None
	]
	if explicit_covers:
		return sum(explicit_covers)

	return sum(
		_positive_quantity(item.get("qty"))
		for item in items
		if isinstance(item, dict)
		and (item.get("is_cover") is True or "cover" in str(item.get("name", "")).lower())
	)


def list_orders(
	db: Session,
	property_id: str | None = None,
	order_date: date | None = None,
	page: int = 1,
	page_size: int = 50,
) -> tuple[list[tuple[models.Order, str]], int]:
	"""List F&B orders with the property name required by the operations UI."""
	query = db.query(models.Order, models.Property.name).join(
		models.Property, models.Property.id == models.Order.property_id
	)
	if property_id:
		query = query.filter(models.Order.property_id == property_id)
	if order_date:
		query = query.filter(func.date(models.Order.placed_at) == order_date.isoformat())

	total = query.count()
	rows = (
		query.order_by(models.Order.placed_at.desc())
		.offset((page - 1) * page_size)
		.limit(page_size)
		.all()
	)
	return rows, total


def _utc_isoformat(value: datetime) -> str:
	if value.tzinfo is None:
		value = value.replace(tzinfo=UTC)
	return value.astimezone(UTC).isoformat()


def serialize_order(order: models.Order, property_name: str) -> dict:
	"""Create the stable snake_case API shape consumed by F&B Operations."""
	return {
		"id": order.id,
		"property_id": order.property_id,
		"property_name": property_name,
		"guest_id": order.guest_id,
		"items": order.items,
		"total": float(order.total),
		"placed_at": _utc_isoformat(order.placed_at),
		"covers": calculate_order_covers(order.items),
	}


def build_nightly_reconciliation(
	db: Session,
	reconciliation_date: date,
	variance_threshold_percent: float = DEFAULT_VARIANCE_THRESHOLD_PERCENT,
) -> list[dict]:
	"""Compare property F&B covers with active reservation occupancy.

	The baseline reservation model contains no party-size field, so each active
	confirmed or checked-in reservation contributes one expected occupancy unit.
	Properties with covers but no expected occupancy are flagged at 100 percent.
	"""
	if variance_threshold_percent < 0:
		raise ValueError("variance_threshold_percent must be non-negative")

	covers_by_property: defaultdict[str, int] = defaultdict(int)
	for order, _property_name in (
		db.query(models.Order, models.Property.name)
		.join(models.Property, models.Property.id == models.Order.property_id)
		.filter(func.date(models.Order.placed_at) == reconciliation_date.isoformat())
		.all()
	):
		covers_by_property[order.property_id] += calculate_order_covers(order.items)

	active_statuses = [models.ReservationStatus.confirmed, models.ReservationStatus.checked_in]
	occupancy_rows = (
		db.query(models.Reservation.property_id, func.count(models.Reservation.id))
		.filter(
			models.Reservation.check_in <= reconciliation_date,
			models.Reservation.check_out > reconciliation_date,
			models.Reservation.status.in_(active_statuses),
		)
		.group_by(models.Reservation.property_id)
		.all()
	)
	occupancy_by_property = {property_id: occupancy for property_id, occupancy in occupancy_rows}

	report = []
	for property_ in db.query(models.Property).order_by(models.Property.name).all():
		expected_occupancy = occupancy_by_property.get(property_.id, 0)
		fnb_covers = covers_by_property[property_.id]
		variance = fnb_covers - expected_occupancy
		if expected_occupancy:
			variance_percentage = round((variance / expected_occupancy) * 100, 2)
		else:
			variance_percentage = 100.0 if fnb_covers else 0.0

		report.append(
			{
				"property_id": property_.id,
				"property_name": property_.name,
				"reconciliation_date": reconciliation_date.isoformat(),
				"expected_occupancy": expected_occupancy,
				"fnb_covers": fnb_covers,
				"variance": variance,
				"variance_percentage": variance_percentage,
				"is_unusual": abs(variance_percentage) >= variance_threshold_percent,
			}
		)
	return report