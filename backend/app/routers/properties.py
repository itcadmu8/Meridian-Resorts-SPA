"""
properties.py

FastAPI router module for properties management. Provides endpoints for GET /properties, GET /properties/{property_id}.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.property import Property

router = APIRouter(prefix="/api/v1", tags=["properties"])


@router.get("/properties")
def list_properties(db: Session = Depends(get_db)):
    props = db.execute(select(Property)).scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "address": p.address,
            "timezone": p.timezone,
        }
        for p in props
    ]


@router.get("/properties/{property_id}")
def get_property(property_id: str, db: Session = Depends(get_db)):
    prop = db.get(Property, property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return {
        "id": prop.id,
        "name": prop.name,
        "brand": prop.brand,
        "address": prop.address,
        "timezone": prop.timezone,
    }
