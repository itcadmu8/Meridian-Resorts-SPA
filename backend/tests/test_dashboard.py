"""Operations dashboard tests (Section 12), owned by Member 4."""

from datetime import date, datetime, time, timedelta

from app import models
from tests.factories import (
    make_guest,
    make_property,
    make_rate_plan,
    make_reservation,
    make_spa_appointment,
    make_user,
)


def _login_staff(client, db_session):
    make_user(db_session, username="staff01", role=models.UserRole.staff)
    db_session.commit()
    response = client.post(
        "/api/v1/auth/login", json={"username": "staff01", "password": "Test-Password!23"}
    )
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_dashboard_requires_authentication(client):
    response = client.get("/api/v1/dashboard/operations")

    assert response.status_code == 401


def test_dashboard_aggregates_all_six_properties(client, db_session):
    headers = _login_staff(client, db_session)
    for _ in range(6):
        make_property(db_session)
    db_session.commit()

    response = client.get("/api/v1/dashboard/operations", headers=headers)

    assert response.status_code == 200
    body = response.json()["data"]
    assert len(body["properties"]) == 6
    assert all(row["arrivals"] == 0 for row in body["properties"])


def test_dashboard_counts_arrivals_spa_bookings_and_fnb_covers_for_date(client, db_session):
    headers = _login_staff(client, db_session)
    property_ = make_property(db_session)
    rate_plan = make_rate_plan(db_session, property_)
    guest = make_guest(db_session)
    today = date.today()
    make_reservation(
        db_session,
        guest,
        property_,
        rate_plan,
        check_in=today,
        check_out=today + timedelta(days=2),
        status=models.ReservationStatus.confirmed,
    )
    make_spa_appointment(
        db_session, property_, guest, start_time=datetime.combine(today, time(10, 0))
    )
    db_session.add(
        models.Order(
            property_id=property_.id,
            guest_id=guest.id,
            items=[{"name": "Breakfast cover", "qty": 3, "price": 20.0}],
            total=60.0,
            placed_at=datetime.combine(today, time(9, 0)),
        )
    )
    db_session.commit()

    response = client.get(
        "/api/v1/dashboard/operations", params={"date": today.isoformat()}, headers=headers
    )

    assert response.status_code == 200
    property_row = response.json()["data"]["properties"][0]
    assert property_row["arrivals"] == 1
    assert property_row["spa_bookings"] == 1
    assert property_row["fnb_covers"] == 3


def test_dashboard_ignores_activity_outside_requested_date(client, db_session):
    headers = _login_staff(client, db_session)
    property_ = make_property(db_session)
    rate_plan = make_rate_plan(db_session, property_)
    guest = make_guest(db_session)
    other_day = date.today() + timedelta(days=5)
    make_reservation(
        db_session,
        guest,
        property_,
        rate_plan,
        check_in=other_day,
        check_out=other_day + timedelta(days=1),
    )
    db_session.commit()

    response = client.get(
        "/api/v1/dashboard/operations",
        params={"date": date.today().isoformat()},
        headers=headers,
    )

    property_row = response.json()["data"]["properties"][0]
    assert property_row["arrivals"] == 0
