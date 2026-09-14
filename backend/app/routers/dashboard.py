"""Cross-property operations dashboard API, owned by Member 4 (Section 8.2)."""

from datetime import date as Date
from uuid import uuid4

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import require_staff
from app.services.dashboard_service import build_operations_dashboard

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/operations", dependencies=[Depends(require_staff)])
def get_operations_dashboard(
    target_date: Date = Query(default_factory=Date.today, alias="date"),
    db: Session = Depends(get_db),
):
    dashboard = build_operations_dashboard(db, target_date)
    return {
        "success": True,
        "data": dashboard,
        "message": None,
        "meta": {"request_id": str(uuid4())},
    }
