"""
guests.py

FastAPI router module for guests management. Provides endpoints for GET /guests/{guest_id}.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.guest import Guest
from app.mongo import get_preferences_collection

router = APIRouter(prefix="/api/v1", tags=["guests"])


@router.get("/guests/{guest_id}")
def get_guest(
    guest_id: str,
    db: Session = Depends(get_db),
    pref_coll=Depends(get_preferences_collection),
):
    guest = db.get(Guest, guest_id)
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    pref_doc = pref_coll.find_one({"guest_id": guest_id}) or {}
    pref_doc = dict(pref_doc)
    pref_doc.pop("_id", None)
    pref_doc.pop("guest_id", None)
    pref_doc.setdefault("dietary", [])
    pref_doc.setdefault("room_preferences", [])
    pref_doc.setdefault("notes", [])

    return {
        "id": guest.id,
        "name": guest.name,
        "email": guest.email,
        "phone": guest.phone,
        "loyalty_tier": guest.loyalty_tier,
        "preferences": pref_doc,
    }
