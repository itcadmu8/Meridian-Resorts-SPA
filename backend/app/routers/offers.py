"""
offers.py

FastAPI router module for offers management.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.offer import OfferRead
from app.services import offer_service

router = APIRouter(prefix="/api/v1/offers", tags=["offers"])


@router.get("", response_model=list[OfferRead])
def get_offers(
    property_id: str | None = None,
    offer_type: str | None = None,
    db: Session = Depends(get_db),
):
    return offer_service.list_offers(db, property_id=property_id, offer_type=offer_type)
