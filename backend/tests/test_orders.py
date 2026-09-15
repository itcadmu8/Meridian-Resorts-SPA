"""F&B order filtering and response contract tests."""

from datetime import datetime, timedelta

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app import models
from app.database import get_db
from app.routers.orders import router


def order_client(db_session):
	app = FastAPI()
	app.include_router(router)

	def override_get_db():
		yield db_session

	app.dependency_overrides[get_db] = override_get_db
	return TestClient(app)


def add_order(db_session, property_, placed_at, items):
	order = models.Order(
		property_id=property_.id,
		items=items,
		total=75,
		placed_at=placed_at,
	)
	db_session.add(order)
	db_session.flush()
	return order


def test_orders_filter_by_property_and_date(db_session):
	first_property = models.Property(name="Meridian Coast", brand="Meridian", timezone="UTC")
	second_property = models.Property(name="Meridian Ridge", brand="Meridian", timezone="UTC")
	db_session.add_all([first_property, second_property])
	db_session.flush()

	today = datetime(2026, 9, 14, 12, 0)
	matching_order = add_order(db_session, first_property, today, [{"name": "Lunch", "qty": 2}])
	add_order(db_session, second_property, today, [{"name": "Dinner", "qty": 4}])
	add_order(db_session, first_property, today - timedelta(days=1), [{"name": "Breakfast", "qty": 1}])
	db_session.commit()

	response = order_client(db_session).get(
		f"/api/v1/orders?date=2026-09-14&property_id={first_property.id}"
	)

	assert response.status_code == 200
	payload = response.json()
	assert payload["total_orders"] == 1
	assert payload["total_covers"] == 2
	assert payload["data"][0]["id"] == matching_order.id
	assert payload["data"][0]["property_name"] == "Meridian Coast"


def test_orders_returns_empty_result_when_no_records_match(db_session):
	response = order_client(db_session).get("/api/v1/orders?date=2026-09-14")

	assert response.status_code == 200
	assert response.json() == {"data": [], "total_orders": 0, "total_covers": 0}