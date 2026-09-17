from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class InventoryBase(BaseModel):
    property_id: str
    inventory_type: str = "room"
    item: str
    quantity: int = 0
    available_quantity: int = 0


class InventoryCreate(InventoryBase):
    pass


class InventoryRead(InventoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    updated_at: Optional[datetime] = None
