"""
dashboard.py

FastAPI router module for dashboard management. Provides endpoints for GET /operations.
"""
from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import dashboard_service

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/operations", response_model=dict[str, Any])
def get_operations_dashboard(
    date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    return dashboard_service.get_operations_dashboard(db, target_date=date)
