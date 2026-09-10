from datetime import date

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import and_, select

from app.database import SessionLocal
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
):
    if date_from is None and date_to is None:
        today = date.today()
        date_from = today
        date_to = today

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
        )
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
        .where(Reservation.check_in >= date_from)
        .where(Reservation.check_in <= date_to)
    )

    if property_id is not None:
        stmt = stmt.where(Reservation.property_id == property_id)

    if status is not None:
        stmt = stmt.where(Reservation.status.ilike(status))

    with SessionLocal() as session:
        rows = session.execute(stmt).mappings().all()

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
                'status': row['status'].title(),
            }
        )

    return payload


@router.get("/reservations/{reservation_id}")
def get_reservation(reservation_id: str):
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
        )
        .join(Guest, Guest.id == Reservation.guest_id)
        .join(Property, Property.id == Reservation.property_id)
        .where(Reservation.id == reservation_id)
    )

    with SessionLocal() as session:
        row = session.execute(stmt).mappings().first()

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
        'status': row['status'].title(),
    }
