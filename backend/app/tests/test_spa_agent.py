"""Tests for the spa agent's recommendation and confirmation boundary."""

import uuid
from datetime import date, datetime, time

import pytest

from app import models
from app.ai.agent.confirmation import create_confirmation
from app.ai.agent.spa_agent import confirm_spa_booking


def test_confirmation_gate_rejects_non_affirmative_message(db_session):
    confirmation = create_confirmation(
        guest_id="guest-1",
        property_id="property-1",
        service="Aromatherapy Massage",
        starts_at="2026-09-16T10:00:00",
    )

    with pytest.raises(ValueError, match="Explicit confirmation"):
        confirm_spa_booking(
            db_session,
            confirmation=confirmation,
            guest_id="guest-1",
            message="Maybe later",
        )

    assert db_session.query(models.SpaAppointment).count() == 0


def test_confirmation_gate_creates_appointment_after_explicit_confirmation(db_session):
    property_ = models.Property(
        id=str(uuid.uuid4()),
        name="Meridian Grand Azure",
        brand="Meridian Resorts & Spa",
        timezone="UTC",
    )
    db_session.add(property_)
    db_session.commit()

    confirmation = create_confirmation(
        guest_id="guest-1",
        property_id=property_.id,
        service="Aromatherapy Massage",
        starts_at=datetime.combine(date(2026, 9, 16), time(10)).isoformat(),
    )
    appointment = confirm_spa_booking(
        db_session,
        confirmation=confirmation,
        guest_id="guest-1",
        message="Yes, book it",
    )

    assert appointment.property_id == property_.id
    assert appointment.service == "Aromatherapy Massage"
    assert appointment.status == models.SpaAppointmentStatus.confirmed