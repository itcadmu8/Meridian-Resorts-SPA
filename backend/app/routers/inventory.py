"""
inventory.py

FastAPI router module for inventory management.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.inventory import InventoryRead
from app.services import inventory_service

router = APIRouter(prefix="/api/v1/inventory", tags=["inventory"])


@router.get("", response_model=list[InventoryRead])
def get_inventory(
    property_id: str | None = None,
    inventory_type: str | None = None,
    db: Session = Depends(get_db),
):
    return inventory_service.list_inventory(
        db, property_id=property_id, inventory_type=inventory_type
    )
