"""
app/seed.py opens its own SessionLocal/Mongo collection rather than taking them via
FastAPI's Depends() (it runs at startup, outside a request), so — unlike the router
tests — we point its module-level references at the test doubles with monkeypatch
instead of using dependency_overrides.
"""

from app import models
from app.seed import seed_if_empty
from app.tests.conftest import FakePreferencesCollection, TestingSessionLocal


def _patch_seed_targets(monkeypatch, preferences_store):
    import app.seed as seed_module

    monkeypatch.setattr(seed_module, "SessionLocal", TestingSessionLocal)
    monkeypatch.setattr(
        seed_module,
        "get_preferences_collection",
        lambda: FakePreferencesCollection(preferences_store),
    )


def test_seed_if_empty_populates_demo_data(db_session, preferences_store, monkeypatch):
    _patch_seed_targets(monkeypatch, preferences_store)

    seed_if_empty()

    guests = db_session.query(models.Guest).all()
    assert len(guests) == 12
    assert guests[0].email == "jamie.rivera@example.com"

    properties = db_session.query(models.Property).all()
    assert len(properties) == 6

    reservations = db_session.query(models.Reservation).all()
    assert len(reservations) == 12
    assert {reservation.property_id for reservation in reservations} == {
        property_.id for property_ in properties
    }

    folios = db_session.query(models.Folio).all()
    assert len(folios) == 12
    assert {folio.reservation_id for folio in folios} == {
        reservation.id for reservation in reservations
    }

    orders = db_session.query(models.Order).all()
    assert len(orders) == 12
    assert {order.property_id for order in orders} == {property_.id for property_ in properties}

    assert preferences_store[guests[0].id]["dietary"] == ["vegetarian"]
    assert preferences_store[guests[1].id]["dietary"] == ["halal"]


def test_seed_if_empty_is_idempotent(db_session, preferences_store, monkeypatch):
    _patch_seed_targets(monkeypatch, preferences_store)

    seed_if_empty()
    seed_if_empty()  # a second call (e.g. container restart) must not duplicate data

    assert db_session.query(models.Guest).count() == 12
    assert db_session.query(models.Reservation).count() == 12
    assert db_session.query(models.Order).count() == 12
