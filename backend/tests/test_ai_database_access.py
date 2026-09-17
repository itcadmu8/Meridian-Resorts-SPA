"""
test_ai_database_access.py

Unit/Integration test suite for ai database access.
"""
from datetime import date

from app.services import reservation_service, spa_service


def test_ai_reservation_and_preference_access():
    """Verify that get_reservation_status and get_guest_preferences work with
    guest_email / guest_name / demo account.
    """
    res = reservation_service.get_reservation_status(
        guest_email="guest@meridian.com", guest_name="Guest User"
    )
    assert len(res) > 0
    assert res[0]["guest_name"] is not None

    prefs = reservation_service.get_guest_preferences(guest_email="guest@meridian.com")
    assert len(prefs) > 0


def test_ai_spa_booking_database_tool():
    """Verify that spa booking tool creates a confirmed spa appointment in database."""
    booking = spa_service.book_guest_spa_appointment(
        property_name="Meridian Grand Resort",
        service="Signature Meridian Massage",
        appointment_date=date.today().isoformat(),
        appointment_time="15:30",
        therapist="Test Specialist",
        guest_email="test@example.com",
    )
    assert booking["status"] == "Confirmed"
    assert booking["service"] == "Signature Meridian Massage"

    all_spa = spa_service.list_guest_spa_appointments(guest_email="test@example.com")
    assert any(b["service"] == "Signature Meridian Massage" for b in all_spa)
