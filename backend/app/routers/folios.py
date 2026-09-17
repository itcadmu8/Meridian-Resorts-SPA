from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.folio import Folio

router = APIRouter(prefix="/api/v1", tags=["folios"])


@router.get("/folios/{folio_id}")
def get_folio(folio_id: str, db: Session = Depends(get_db)):
    folio = db.get(Folio, folio_id)
    if not folio:
        raise HTTPException(status_code=404, detail="Folio not found")
    return {
        "id": folio.id,
        "reservation_id": folio.reservation_id,
        "line_items": folio.line_items or [],
        "balance": f"{folio.balance:.2f}",
        "status": folio.status,
    }
