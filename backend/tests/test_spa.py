"""
test_spa.py

Unit/Integration test suite for spa.
"""
import uuid
from datetime import UTC, date, datetime, time, timedelta
from unittest.mock import patch

import pytest
from sqlalchemy.exc import SQLAlchemyError

from app import models
from app.models import SpaAppointmentStatus
from app.services.spa_service import (
    SpaDatabaseError,
    get_todays_spa_bookings,
)


def add_property(db_session, name: str, brand: str = "Meridian Resorts & Spa") -> models.Property:
    """Helper fixture to create a property with a unique UUID."""
    property_ = models.Property(
        id=str(uuid.uuid4()),
        name=name,
        brand=brand,
        timezone="UTC",
    )
    db_session.add(property_)
    db_session.flush()
    return property_


def test_today_spa_bookings_success(client, db_session):
    """Test retrieving today's active spa appointments with joined property names."""
    property_ = add_property(db_session, "Meridian Grand Azure")
    today = datetime.now(UTC).date()

    appointment = models.SpaAppointment(
        id=str(uuid.uuid4()),
        property_id=property_.id,
        therapist="Anjali Sharma",
        service="Aromatherapy Massage",
        starts_at=datetime.combine(today, time(hour=14, minute=30)),
        status=SpaAppointmentStatus.confirmed,
    )
    db_session.add(appointment)
    db_session.commit()

    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    data = response.json()
    assert data["date"] == today.isoformat()
    assert data["total_spa_bookings"] == 1
    assert len(data["bookings"]) == 1

    booking = data["bookings"][0]
    assert booking["id"] == appointment.id
    assert booking["property"] == "Meridian Grand Azure"
    assert booking["therapist"] == "Anjali Sharma"
    assert booking["service"] == "Aromatherapy Massage"
    assert booking["status"] == "confirmed"
    assert "T14:30:00" in booking["time_slot"]


def test_today_spa_bookings_excludes_past_and_future(client, db_session):
    """Ensure appointments on previous or future days are excluded."""
    property_ = add_property(db_session, "Meridian Highland Spa")
    today = datetime.now(UTC).date()

    db_session.add_all(
        [
            # Today's valid appointment
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Today Therapist",
                service="Swedish Massage",
                starts_at=datetime.combine(today, time(hour=11, minute=0)),
                status=SpaAppointmentStatus.confirmed,
            ),
            # Yesterday's appointment (past)
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Past Therapist",
                service="Facial Detox",
                starts_at=datetime.combine(today - timedelta(days=1), time(hour=11, minute=0)),
                status=SpaAppointmentStatus.confirmed,
            ),
            # Tomorrow's appointment (future)
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Future Therapist",
                service="Hot Stone Ritual",
                starts_at=datetime.combine(today + timedelta(days=1), time(hour=11, minute=0)),
                status=SpaAppointmentStatus.confirmed,
            ),
        ]
    )
    db_session.commit()

    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    data = response.json()
    assert data["total_spa_bookings"] == 1
    assert data["bookings"][0]["therapist"] == "Today Therapist"
    assert data["bookings"][0]["service"] == "Swedish Massage"


def test_today_spa_bookings_excludes_cancelled_appointments(client, db_session):
    """Ensure cancelled appointments for today are excluded from the output."""
    property_ = add_property(db_session, "Meridian Coastal Escape")
    today = datetime.now(UTC).date()

    db_session.add_all(
        [
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Active Therapist",
                service="Deep Tissue Massage",
                starts_at=datetime.combine(today, time(hour=10, minute=0)),
                status=SpaAppointmentStatus.confirmed,
            ),
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Cancelled Therapist",
                service="Body Polish",
                starts_at=datetime.combine(today, time(hour=13, minute=0)),
                status=SpaAppointmentStatus.cancelled,
            ),
        ]
    )
    db_session.commit()

    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    data = response.json()
    assert data["total_spa_bookings"] == 1
    assert data["bookings"][0]["therapist"] == "Active Therapist"
    assert data["bookings"][0]["service"] == "Deep Tissue Massage"


def test_today_spa_bookings_empty_results(client):
    """Verify that when no appointments exist for today, empty list and 0 count are returned."""
    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    payload = response.json()
    assert payload["total_spa_bookings"] == 0
    assert payload["bookings"] == []


def test_today_spa_bookings_multiple_properties_sorted(client, db_session):
    """Test six properties with chronological ordering and relationship joins."""
    today = datetime.now(UTC).date()
    for index in range(6):
        prop = add_property(db_session, f"Meridian Property {index + 1:02d}")
        db_session.add(
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=prop.id,
                therapist=f"Therapist {index + 1}",
                service="Wellness Ritual",
                starts_at=datetime.combine(today, time(hour=9 + index, minute=0)),
                status=SpaAppointmentStatus.confirmed,
            )
        )
    db_session.commit()

    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    payload = response.json()
    assert payload["total_spa_bookings"] == 6
    assert len(payload["bookings"]) == 6

    # Verify all properties joined correctly
    property_names = [b["property"] for b in payload["bookings"]]
    expected_names = [f"Meridian Property {i + 1:02d}" for i in range(6)]
    assert property_names == expected_names


def test_today_spa_bookings_boundary_times(client, db_session):
    """Verify boundary conditions for 00:00:00 (inclusive start) and 23:59:59 (inclusive end)."""
    property_ = add_property(db_session, "Meridian Mountain Sanctuary")
    today = datetime.now(UTC).date()

    db_session.add_all(
        [
            # Midnight start
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Midnight Therapist",
                service="Late Night Relaxation",
                starts_at=datetime.combine(today, time(hour=0, minute=0, second=0)),
                status=SpaAppointmentStatus.confirmed,
            ),
            # End of day
            models.SpaAppointment(
                id=str(uuid.uuid4()),
                property_id=property_.id,
                therapist="Night Owl Therapist",
                service="Evening Meditation",
                starts_at=datetime.combine(today, time(hour=23, minute=59, second=59)),
                status=SpaAppointmentStatus.confirmed,
            ),
        ]
    )
    db_session.commit()

    response = client.get("/api/v1/spa/appointments/today")

    assert response.status_code == 200
    data = response.json()
    assert data["total_spa_bookings"] == 2
    therapists = {b["therapist"] for b in data["bookings"]}
    assert "Midnight Therapist" in therapists
    assert "Night Owl Therapist" in therapists


def test_today_spa_bookings_custom_date_param(client, db_session):
    """Test passing custom reference date via query parameter."""
    property_ = add_property(db_session, "Meridian Oasis")
    custom_date = date(2026, 10, 15)

    db_session.add(
        models.SpaAppointment(
            id=str(uuid.uuid4()),
            property_id=property_.id,
            therapist="Custom Date Therapist",
            service="Seasonal Treatment",
            starts_at=datetime.combine(custom_date, time(hour=15, minute=0)),
            status=SpaAppointmentStatus.confirmed,
        )
    )
    db_session.commit()

    response = client.get(f"/api/v1/spa/appointments/today?today={custom_date.isoformat()}")

    assert response.status_code == 200
    data = response.json()
    assert data["date"] == "2026-10-15"
    assert data["total_spa_bookings"] == 1
    assert data["bookings"][0]["therapist"] == "Custom Date Therapist"


def test_spa_service_database_error_handling(db_session):
    """Verify that SQLAlchemyError is caught and wrapped in SpaDatabaseError."""
    with patch.object(db_session, "query", side_effect=SQLAlchemyError("Connection timeout")):
        with pytest.raises(SpaDatabaseError) as exc_info:
            get_todays_spa_bookings(db_session)
        assert "Database error" in str(exc_info.value)
        assert exc_info.value.code == "DATABASE_ERROR"


def test_legacy_endpoint_compatibility(client, db_session):
    """Verify legacy endpoint /api/v1/spa-appointments/today route works identically."""
    property_ = add_property(db_session, "Meridian Palm Vista")
    today = datetime.now(UTC).date()

    db_session.add(
        models.SpaAppointment(
            id=str(uuid.uuid4()),
            property_id=property_.id,
            therapist="Legacy Therapist",
            service="Signature Ritual",
            starts_at=datetime.combine(today, time(hour=12, minute=0)),
            status=SpaAppointmentStatus.confirmed,
        )
    )
    db_session.commit()

    response = client.get("/api/v1/spa-appointments/today")

    assert response.status_code == 200
    data = response.json()
    assert data["total_spa_bookings"] == 1
    assert data["bookings"][0]["therapist"] == "Legacy Therapist"
