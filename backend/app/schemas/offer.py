from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class OfferBase(BaseModel):
    property_id: str
    offer_type: str = "spa"
    title: str
    description: Optional[str] = None
    price: float = 0.0
    active_from: Optional[datetime] = None
    active_to: Optional[datetime] = None
    status: str = "active"


class OfferCreate(OfferBase):
    pass


class OfferRead(OfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
