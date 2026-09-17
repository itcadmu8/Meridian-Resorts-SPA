from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.inventory import InventoryRead
from app.services import inventory_service

router = APIRouter(prefix="/api/v1/inventory", tags=["inventory"])


@router.get("", response_model=List[InventoryRead])
def get_inventory(
    property_id: Optional[str] = None,
    inventory_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return inventory_service.list_inventory(db, property_id=property_id, inventory_type=inventory_type)