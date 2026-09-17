"""
offer.py

Module responsible for offer.
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OfferBase(BaseModel):
    property_id: str
    offer_type: str = "spa"
    title: str
    description: str | None = None
    price: float = 0.0
    active_from: datetime | None = None
    active_to: datetime | None = None
    status: str = "active"


class OfferCreate(OfferBase):
    pass


class OfferRead(OfferBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
