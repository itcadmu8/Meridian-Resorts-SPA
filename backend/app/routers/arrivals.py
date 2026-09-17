from datetime import date
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import arrival_service

router = APIRouter(prefix="/api/v1/arrivals", tags=["arrivals"])


@router.get("", response_model=List[Dict[str, Any]])
def get_arrivals(
    date: Optional[date] = Query(None),
    property_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return arrival_service.list_arrivals(db, target_date=date, property_id=property_id, status=status)