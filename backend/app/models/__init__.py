from datetime import datetime, timezone

from .folio import Folio, FolioStatus
from .guest import Guest
from .inventory import Inventory
from .order import Order
from .property import Property
from .rate_plan import RatePlan
from .reservation import Reservation, ReservationStatus
from .spa_appointment import SpaAppointment
from .upsell_offer import UpsellOffer


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


__all__ = [
    "Guest",
    "Property",
    "RatePlan",
    "Reservation",
    "ReservationStatus",
    "Folio",
    "FolioStatus",
    "Order",
    "Inventory",
    "SpaAppointment",
    "UpsellOffer",
    "utcnow",
]
