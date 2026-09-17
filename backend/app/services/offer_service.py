"""
offer_service.py

Business logic service module handling offer service.
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.upsell_offer import UpsellOffer


def list_offers(
    db: Session, property_id: str | None = None, offer_type: str | None = None
) -> list[UpsellOffer]:
    stmt = select(UpsellOffer)
    if property_id:
        stmt = stmt.where(UpsellOffer.property_id == property_id)
    if offer_type:
        stmt = stmt.where(UpsellOffer.offer_type == offer_type)
    return list(db.scalars(stmt).all())
