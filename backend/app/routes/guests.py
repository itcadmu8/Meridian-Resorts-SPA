from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Guest
from app.mongo import get_preferences_collection

router = APIRouter(prefix="/api/v1", tags=["guests"])


@router.get("/guests/{guest_id}")
def get_guest(
    guest_id: str,
    db: Session = Depends(get_db),
    preferences_collection=Depends(get_preferences_collection),
):
    guest = db.get(Guest, guest_id)
    if guest is None:
        raise HTTPException(status_code=404, detail="Guest not found")

    preferences = preferences_collection.find_one({"guest_id": guest_id}) or {}
    return {
        "id": guest.id,
        "name": guest.name,
        "email": guest.email,
        "phone": guest.phone,
        "loyalty_tier": guest.loyalty_tier,
        "preferences": {
            "dietary": preferences.get("dietary", []),
            "room_preferences": preferences.get("room_preferences", []),
            "notes": preferences.get("notes", []),
        },
    }
