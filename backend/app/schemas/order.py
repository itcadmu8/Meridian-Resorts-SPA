"""F&B orders API response models."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class FnbOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    property_id: str
    property_name: str
    items: list[dict]
    total: Decimal
    covers: int
    placed_at: datetime


class FnbOrdersResponse(BaseModel):
    data: list[FnbOrderOut]
    total_orders: int
    total_covers: int
