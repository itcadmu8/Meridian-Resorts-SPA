"""
inventory_service.py

Business logic service module handling inventory service.
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.inventory import MultiPropertyInventory


def list_inventory(
    db: Session, property_id: str | None = None, inventory_type: str | None = None
) -> list[MultiPropertyInventory]:
    stmt = select(MultiPropertyInventory)
    if property_id:
        stmt = stmt.where(MultiPropertyInventory.property_id == property_id)
    if inventory_type:
        stmt = stmt.where(MultiPropertyInventory.inventory_type == inventory_type)
    return list(db.scalars(stmt).all())
