"""F&B Orders API owned by Member 3."""

from datetime import date as Date
from uuid import uuid4

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import order_service

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.get("")
def list_orders(
	property_id: str | None = None,
	order_date: Date | None = Query(None, alias="date"),
	page: int = Query(1, ge=1),
	page_size: int = Query(50, ge=1, le=100),
	db: Session = Depends(get_db),
):
	"""List F&B orders by property and service date using the shared envelope."""
	order_rows, total = order_service.list_orders(
		db,
		property_id=property_id,
		order_date=order_date,
		page=page,
		page_size=page_size,
	)
	return {
		"success": True,
		"data": [
			order_service.serialize_order(order, property_name)
			for order, property_name in order_rows
		],
		"message": None,
		"meta": {
			"page": page,
			"page_size": page_size,
			"total": total,
			"request_id": str(uuid4()),
		},
	}