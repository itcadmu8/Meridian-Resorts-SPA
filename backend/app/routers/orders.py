"""F&B orders router."""

from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order import FnbOrdersResponse
from app.services.order_service import list_fnb_orders

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.get("", response_model=FnbOrdersResponse)
def get_orders(
	target_date: date | None = Query(default=None, alias="date"),
	property_id: str | None = None,
	db: Session = Depends(get_db),
) -> FnbOrdersResponse:
	"""List F&B orders by optional property and UTC calendar date."""
	orders = list_fnb_orders(db, target_date=target_date, property_id=property_id)
	return FnbOrdersResponse(
		data=orders,
		total_orders=len(orders),
		total_covers=sum(order["covers"] for order in orders),
	)