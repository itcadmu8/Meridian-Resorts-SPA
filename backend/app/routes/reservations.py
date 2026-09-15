from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.guest import Guest
from app.models.property import Property
from app.models.reservation import Reservation

router = APIRouter(prefix="/api/v1", tags=["reservations"])


@router.post("/reservations", status_code=201)
def create_reservation(payload: dict, db: Session = Depends(get_db)):
    required = {"guest_id", "property_id", "rate_plan_id", "check_in", "check_out"}
    missing = sorted(required - payload.keys())
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    try:
        check_in = date.fromisoformat(payload["check_in"])
        check_out = date.fromisoformat(payload["check_out"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid date format") from exc

    if check_out <= check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    guest = db.get(Guest, payload["guest_id"])
    if guest is None:
        raise HTTPException(status_code=400, detail="Unknown guest")
    property_ = db.get(Property, payload["property_id"])
    if property_ is None:
        raise HTTPException(status_code=400, detail="Unknown property")

    reservation = Reservation(
        guest_id=guest.id,
        property_id=property_.id,
        rate_plan_id=payload["rate_plan_id"],
        check_in=check_in,
        check_out=check_out,
        status="confirmed",
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)

    return {"id": reservation.id, "guest": {"email": guest.email}, "status": reservation.status}


@router.get("/reservations")
def list_reservations(
    property_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = (
        select(
            Reservation.id,
            Reservation.guest_id,
            Reservation.property_id,
            Guest.name.label('guest_name'),
            Property.name.label('property_name'),
            Guest.loyalty_tier,
            Reservation.check_in,
            Reservation.check_out,
            Reservation.status,
            Reservation.room_number,
            Reservation.room_type,
            Reservation.special_preference,
        )
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
    )

    if date_from is not None:
        stmt = stmt.where(Reservation.check_in >= date_from)
    if date_to is not None:
        stmt = stmt.where(Reservation.check_in <= date_to)

    if property_id is not None:
        stmt = stmt.where(Reservation.property_id == property_id)

    if status is not None:
        stmt = stmt.where(Reservation.status.ilike(status))

    rows = db.execute(stmt).mappings().all()

    payload = []
    for row in rows:
        payload.append(
            {
                'id': row['id'],
                'guest_id': row['guest_id'],
                'property_id': row['property_id'],
                'guest_name': row['guest_name'],
                'property_name': row['property_name'],
                'loyalty_tier': row['loyalty_tier'],
                'check_in': row['check_in'].isoformat(),
                'check_out': row['check_out'].isoformat(),
                'status': row['status'],
                'room_number': row['room_number'],
                'room_type': row['room_type'],
                'special_preference': row['special_preference'],
            }
        )

    return payload


@router.get("/reservations/{reservation_id}")
def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    stmt = (
        select(
            Reservation.id,
            Reservation.guest_id,
            Reservation.property_id,
            Guest.name.label('guest_name'),
            Guest.email.label('guest_email'),
            Property.name.label('property_name'),
            Guest.loyalty_tier,
            Reservation.check_in,
            Reservation.check_out,
            Reservation.status,
            Reservation.room_number,
            Reservation.room_type,
            Reservation.special_preference,
        )
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
        .where(Reservation.id == reservation_id)
    )

    row = db.execute(stmt).mappings().first()

    if row is None:
        raise HTTPException(status_code=404, detail='Reservation not found')

    return {
        'id': row['id'],
        'guest_id': row['guest_id'],
        'property_id': row['property_id'],
        'guest': {
            'name': row['guest_name'],
            'email': row['guest_email'],
        },
        'property_name': row['property_name'],
        'loyalty_tier': row['loyalty_tier'],
        'check_in': row['check_in'].isoformat(),
        'check_out': row['check_out'].isoformat(),
        'status': row['status'],
        'room_number': row['room_number'],
        'room_type': row['room_type'],
        'special_preference': row['special_preference'],
    }
