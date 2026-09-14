from datetime import UTC, date, datetime, time, timedelta

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app import models
from app.database import get_db
from app.routers import orders
from app.services import order_service
from tests.factories import make_property, make_property_guest_plan, make_reservation


def make_order(db_session, property_, guest, placed_at, items, total=72):
	order = models.Order(
		property_id=property_.id,
		guest_id=guest.id,
		items=items,
		total=total,
		placed_at=placed_at,
	)
	db_session.add(order)
	db_session.flush()
	return order


def test_get_orders_filters_by_property_and_date(db_session):
	property_, guest, _rate_plan = make_property_guest_plan(db_session)
	other_property = make_property(db_session, name="Other Hotel")
	service_date = date(2026, 9, 11)
	matching_order = make_order(
		db_session,
		property_,
		guest,
		datetime.combine(service_date, time(12), tzinfo=UTC),
		[{"name": "Breakfast cover", "qty": 2, "price": 28}],
	)
	make_order(
		db_session,
		other_property,
		guest,
		datetime.combine(service_date, time(12), tzinfo=UTC),
		[{"name": "Breakfast cover", "qty": 4, "price": 28}],
	)
	make_order(
		db_session,
		property_,
		guest,
		datetime.combine(service_date + timedelta(days=1), time(12), tzinfo=UTC),
		[{"name": "Breakfast cover", "qty": 3, "price": 28}],
	)
	db_session.commit()

	app = FastAPI()
	app.include_router(orders.router)

	def override_get_db():
		yield db_session

	app.dependency_overrides[get_db] = override_get_db
	with TestClient(app) as order_client:
		response = order_client.get(
			"/api/v1/orders",
			params={"property_id": property_.id, "date": service_date.isoformat()},
		)
	app.dependency_overrides.clear()

	assert response.status_code == 200
	body = response.json()
	assert body["success"] is True
	assert body["meta"]["total"] == 1
	assert body["data"] == [
		{
			"id": matching_order.id,
			"property_id": property_.id,
			"property_name": property_.name,
			"guest_id": guest.id,
			"items": [{"name": "Breakfast cover", "qty": 2, "price": 28}],
			"total": 72.0,
			"placed_at": datetime.combine(service_date, time(12), tzinfo=UTC).isoformat(),
			"covers": 2,
		}
	]


def test_get_orders_returns_an_empty_list_when_no_orders_match(db_session):
	property_, _guest, _rate_plan = make_property_guest_plan(db_session)

	rows, total = order_service.list_orders(
		db_session,
		property_id=property_.id,
		order_date=date(2026, 9, 11),
	)

	assert rows == []
	assert total == 0


def test_fnb_variance_flags_an_unusual_property(db_session):
	property_, guest, rate_plan = make_property_guest_plan(db_session)
	reconciliation_date = date(2026, 9, 11)
	make_reservation(
		db_session,
		guest,
		property_,
		rate_plan,
		check_in=reconciliation_date - timedelta(days=1),
		check_out=reconciliation_date + timedelta(days=1),
		status=models.ReservationStatus.checked_in,
	)
	make_order(
		db_session,
		property_,
		guest,
		datetime.combine(reconciliation_date, time(19), tzinfo=UTC),
		[{"name": "Dinner cover", "qty": 3, "price": 40}],
		total=120,
	)
	db_session.commit()

	report = order_service.build_nightly_reconciliation(db_session, reconciliation_date)

	assert report == [
		{
			"property_id": property_.id,
			"property_name": property_.name,
			"reconciliation_date": reconciliation_date.isoformat(),
			"expected_occupancy": 1,
			"fnb_covers": 3,
			"variance": 2,
			"variance_percentage": 200.0,
			"is_unusual": True,
		}
	]