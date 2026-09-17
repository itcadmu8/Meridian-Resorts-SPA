from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.guest import Guest
from app.models.property import Property
from app.models.reservation import Reservation

router = APIRouter(prefix="/api/v1", tags=["reservations"])


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
                'status': str(row['status']).lower(),
                'room_number': row['room_number'],
                'room_type': row['room_type'],
                'special_preference': row['special_preference'],
            }
        )

    return payload


@router.post("/reservations", status_code=201)
def create_reservation(payload: dict, db: Session = Depends(get_db)):
    guest_id = payload.get("guest_id")
    property_id = payload.get("property_id")
    rate_plan_id = payload.get("rate_plan_id")
    check_in = date.fromisoformat(payload["check_in"])
    check_out = date.fromisoformat(payload["check_out"])

    guest = db.get(Guest, guest_id)
    if not guest:
        raise HTTPException(status_code=400, detail="Guest not found")

    res = Reservation(
        guest_id=guest_id,
        property_id=property_id,
        rate_plan_id=rate_plan_id,
        check_in=check_in,
        check_out=check_out,
        status="confirmed",
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return {
        "id": res.id,
        "guest_id": res.guest_id,
        "property_id": res.property_id,
        "rate_plan_id": res.rate_plan_id,
        "check_in": res.check_in.isoformat(),
        "check_out": res.check_out.isoformat(),
        "status": res.status,
    }


@router.get("/reservations/{reservation_id}")
def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    stmt = (
        select(
            Reservation.id,
            Reservation.guest_id,
            Reservation.property_id,
            Guest.id.label('g_id'),
            Guest.name.label('guest_name'),
            Guest.email.label('guest_email'),
            Guest.loyalty_tier,
            Property.name.label('property_name'),
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
        'guest_name': row['guest_name'],
        'property_name': row['property_name'],
        'loyalty_tier': row['loyalty_tier'],
        'check_in': row['check_in'].isoformat(),
        'check_out': row['check_out'].isoformat(),
        'status': str(row['status']).lower(),
        'room_number': row['room_number'],
        'room_type': row['room_type'],
        'special_preference': row['special_preference'],
        'guest': {
            'id': row['g_id'],
            'name': row['guest_name'],
            'email': row['guest_email'],
            'loyalty_tier': row['loyalty_tier'],
        },
    }
