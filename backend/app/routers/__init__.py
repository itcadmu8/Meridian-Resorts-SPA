"""
__init__.py

FastAPI router module for __init__ management.
"""
from app.routers import (
    ai,
    arrivals,
    auth,
    availability,
    dashboard,
    folios,
    guests,
    inventory,
    offers,
    orders,
    properties,
    reservations,
    spa,
)

__all__ = [
    "ai",
    "arrivals",
    "auth",
    "availability",
    "dashboard",
    "folios",
    "guests",
    "inventory",
    "offers",
    "orders",
    "properties",
    "reservations",
    "spa",
]
