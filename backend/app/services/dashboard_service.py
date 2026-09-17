from datetime import date, datetime, time, UTC
from typing import Any, Dict, List, Optional
from sqlalchemy import func, select, and_
from sqlalchemy.orm import Session

from app.models.order import Order
from app.models.property import Property
from app.models.reservation import Reservation
from app.models.spa_appointment import SpaAppointment

PROPERTY_META = {
    "P-001": {
        "code": "MBR",
        "shortName": "Azure Cove",
        "location": "Costa Smeralda, Sardinia",
        "manager": "Elena Rostova",
        "capacity": 120,
        "color": "#176B63",
        "signatureVenues": ["Azure Beachfront Grill", "Pelican Club Terrace", "Saltwater Bar"],
    },
    "P-002": {
        "code": "MDR",
        "shortName": "Palm Bay",
        "location": "Scottsdale Canyon, Arizona",
        "manager": "Marcus Vance",
        "capacity": 100,
        "color": "#228A80",
        "signatureVenues": ["Dune Fire Hearth", "Oasis Palm Lounge", "Cactus Bloom Patio"],
    },
    "P-003": {
        "code": "MLR",
        "shortName": "Coral Sands",
        "location": "Lake Como, Northern Italy",
        "manager": "Chiara Bellini",
        "capacity": 95,
        "color": "#3FB8B0",
        "signatureVenues": ["Villa Bellissima Ristorante", "The Marina Veranda", "Lakeside Bistro"],
    },
    "P-004": {
        "code": "MFR",
        "shortName": "Ocean Pearl",
        "location": "Black Forest, Germany",
        "manager": "Julian Bauer",
        "capacity": 90,
        "color": "#5AC3BC",
        "signatureVenues": ["Pinecrest Dining Room", "Timber & Ember Cellar", "Alpine Hearth"],
    },
    "P-005": {
        "code": "MMR",
        "shortName": "Rainforest Sanctuary",
        "location": "Aspen Highlands, Colorado",
        "manager": "Sarah Jenkins",
        "capacity": 90,
        "color": "#84D5D0",
        "signatureVenues": ["Summit Lodge & Grill", "Avalanche Fondue House", "Fireside Peak Bar"],
    },
    "P-006": {
        "code": "MCR",
        "shortName": "Sunset Cliffs",
        "location": "Marina Bay, Singapore",
        "manager": "David Chen",
        "capacity": 85,
        "color": "#B1E6E3",
        "signatureVenues": ["Skyline Atrium Lounge", "The Conservatory Brasserie", "Equator Cocktail Bar"],
    },
}


def get_operations_dashboard(db: Session, target_date: Optional[date] = None) -> Dict[str, Any]:
    if not target_date:
        target_date = date.today()

    properties = db.scalars(select(Property)).all()

    prop_stats: List[Dict[str, Any]] = []
    total_arrivals = 0
    total_arriving_guests = 0
    total_active_stay_guests = 0
    total_capacity = 0
    total_spa = 0
    total_fb_covers = 0

    start_of_day = datetime.combine(target_date, time.min)
    end_of_day = datetime.combine(target_date, time.max)

    for prop in properties:
        meta = PROPERTY_META.get(prop.id, {
            "code": prop.id,
            "shortName": prop.name.replace("Meridian ", ""),
            "location": getattr(prop, "brand", "") or "Resort Location",
            "manager": "Resort Manager",
            "capacity": 100,
            "color": "#0d9488",
            "signatureVenues": ["Resort Restaurant", "Lounge", "Bar"],
        })
        capacity = meta["capacity"]
        total_capacity += capacity

        # 1. Arrivals today
        arr_stmt = select(
            func.count(Reservation.id),
            func.coalesce(func.sum(func.coalesce(Reservation.adults, 1) + func.coalesce(Reservation.children, 0)), 0),
        ).where(
            and_(
                Reservation.property_id == prop.id,
                Reservation.check_in == target_date,
                Reservation.status != "Cancelled"
            )
        )
        arr_row = db.execute(arr_stmt).first()
        arr_count = (arr_row[0] if arr_row else 0) or 0
        arr_guests_count = (arr_row[1] if arr_row else 0) or 0

        # 2. Total staying guests today (Occupancy count)
        occ_stmt = select(
            func.coalesce(func.sum(func.coalesce(Reservation.adults, 1) + func.coalesce(Reservation.children, 0)), 0)
        ).where(
            and_(
                Reservation.property_id == prop.id,
                Reservation.check_in <= target_date,
                Reservation.check_out > target_date,
                Reservation.status != "Cancelled"
            )
        )
        occ_guests_count = db.scalar(occ_stmt) or 0

        # 3. Spa Appointments today
        spa_stmt = select(func.count(SpaAppointment.id)).where(
            and_(
                SpaAppointment.property_id == prop.id,
                SpaAppointment.starts_at >= start_of_day,
                SpaAppointment.starts_at <= end_of_day,
                SpaAppointment.status != "cancelled"
            )
        )
        spa_count = db.scalar(spa_stmt) or 0

        # 4. F&B Orders & Covers today
        orders_stmt = select(Order).where(
            and_(
                Order.property_id == prop.id,
                Order.placed_at >= start_of_day,
                Order.placed_at <= end_of_day
            )
        )
        orders = db.scalars(orders_stmt).all()

        breakfast = 0
        lunch = 0
        dinner = 0
        room_service = 0
        fb_covers = 0

        for order in orders:
            # Estimate covers from order items or total amount
            qty = 0
            if order.items:
                for item in order.items:
                    qty += item.get("qty", 1)
            if qty == 0:
                qty = max(1, int(round(order.total_amount / 20.0))) if order.total_amount else 1

            fb_covers += qty
            placed_hour = order.placed_at.hour if order.placed_at else 12
            if 6 <= placed_hour < 11:
                breakfast += qty
            elif 11 <= placed_hour < 16:
                lunch += qty
            elif 16 <= placed_hour < 22:
                dinner += qty
            else:
                room_service += qty

        # Calculate property occupancy percentage
        occ_percent = min(100, int(round((occ_guests_count / capacity) * 100))) if capacity > 0 else 0

        total_arrivals += arr_count
        total_arriving_guests += arr_guests_count
        total_active_stay_guests += occ_guests_count
        total_spa += spa_count
        total_fb_covers += fb_covers

        target_covers = 70
        variance = fb_covers - target_covers

        prop_stats.append({
            "id": prop.id,
            "property_id": prop.id,
            "code": meta["code"],
            "name": prop.name,
            "shortName": meta["shortName"],
            "property_name": prop.name,
            "location": meta["location"],
            "manager": meta["manager"],
            "capacity": capacity,
            "occupancyPercent": occ_percent,
            "covers": fb_covers,
            "percentage": 0, # Will be computed across portfolio
            "target": target_covers,
            "variance": variance,
            "color": meta["color"],
            "signatureVenues": meta["signatureVenues"],
            "breakdown": {
                "breakfast": breakfast,
                "lunch": lunch,
                "dinner": dinner,
                "roomService": room_service,
            },
            "arrivals_count": arr_guests_count if arr_guests_count > 0 else arr_count,
            "reservation_count": arr_count,
            "arriving_guests_count": arr_guests_count,
            "staying_guests_count": occ_guests_count,
            "spa_bookings_count": spa_count,
            "fb_covers_count": fb_covers,
        })

    # Compute percentage share for covers
    for p in prop_stats:
        if total_fb_covers > 0:
            p["percentage"] = int(round((p["covers"] / total_fb_covers) * 100))
        else:
            p["percentage"] = 0

    portfolio_occ_percent = min(100, int(round((total_active_stay_guests / total_capacity) * 100))) if total_capacity > 0 else 0

    return {
        "date": target_date.isoformat(),
        "summary": {
            "total_properties": len(properties),
            "total_arrivals": total_arriving_guests if total_arriving_guests > 0 else total_arrivals,
            "total_reservations": total_arrivals,
            "total_arriving_guests": total_arriving_guests,
            "total_active_stay_guests": total_active_stay_guests,
            "portfolio_occupancy": portfolio_occ_percent,
            "total_spa_bookings": total_spa,
            "total_fb_covers": total_fb_covers,
        },
        "properties": prop_stats,
    }