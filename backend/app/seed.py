"""Seed representative Meridian Resorts & Spa data for local development.

Safe to re-run: the seed is applied only when the guests table is empty.
Run standalone with: ``docker compose exec backend python -m app.seed``.
"""

from datetime import date, timedelta

from app import models
from app.database import SessionLocal
from app.models import utcnow
from app.dependencies.auth import hash_password
from app.mongo import get_preferences_collection

PROPERTIES = [
    ("Meridian Azure Coast", "Mombasa", "Africa/Nairobi"),
    ("Meridian Highland Retreat", "Nanyuki", "Africa/Nairobi"),
    ("Meridian City Gardens", "Nairobi", "Africa/Nairobi"),
    ("Meridian Lakeview Lodge", "Naivasha", "Africa/Nairobi"),
    ("Meridian Savannah Reserve", "Maasai Mara", "Africa/Nairobi"),
    ("Meridian Coral Bay", "Diani", "Africa/Nairobi"),
]

GUESTS = [
    ("Jamie Rivera", "jamie.rivera@example.com", "+1-555-0100", "gold"),
    ("Amina Hassan", "amina.hassan@example.com", "+254-700-000-101", "platinum"),
    ("Daniel Kimani", "daniel.kimani@example.com", "+254-700-000-102", "gold"),
    ("Leah Mwangi", "leah.mwangi@example.com", "+254-700-000-103", "standard"),
    ("Noah Otieno", "noah.otieno@example.com", "+254-700-000-104", "silver"),
    ("Grace Wanjiku", "grace.wanjiku@example.com", "+254-700-000-105", "gold"),
    ("Ethan Njoroge", "ethan.njoroge@example.com", "+254-700-000-106", "standard"),
    ("Zuri Kamau", "zuri.kamau@example.com", "+254-700-000-107", "platinum"),
    ("Marcus Ochieng", "marcus.ochieng@example.com", "+254-700-000-108", "silver"),
    ("Priya Patel", "priya.patel@example.com", "+254-700-000-109", "gold"),
    ("Samuel Kiptoo", "samuel.kiptoo@example.com", "+254-700-000-110", "standard"),
    ("Fatima Ali", "fatima.ali@example.com", "+254-700-000-111", "gold"),
]

PREFERENCES = [
    (["vegetarian"], ["high floor", "away from elevator"], ["Anniversary stay"]),
    (["halal"], ["ocean view"], ["Prefers an early spa appointment"]),
    (["gluten-free"], ["king bed"], []),
    (["vegan"], ["quiet floor"], ["Late checkout requested"]),
    ([], ["near pool"], []),
    (["pescatarian"], ["balcony"], ["Celebrating a birthday"]),
    ([], ["connecting rooms"], ["Travelling with family"]),
    (["vegetarian"], ["suite"], ["Airport transfer requested"]),
    (["halal"], ["ground floor"], []),
    (["dairy-free"], ["city view"], []),
    ([], ["near restaurant"], []),
    (["vegan"], ["sea view"], ["Prefers fragrance-free amenities"]),
]


def seed_if_empty() -> None:
    db = SessionLocal()
    try:
        existing_guests = db.query(models.Guest).all()
        if existing_guests:
            if not db.query(models.User).filter_by(username="operations").first():
                db.add(
                    models.User(
                        username="operations",
                        password_hash=hash_password("meridian2026"),
                        role=models.UserRole.staff,
                        is_active=True,
                    )
                )
            for guest in existing_guests:
                if not db.query(models.User).filter_by(guest_id=guest.id).first():
                    db.add(
                        models.User(
                            username=guest.email,
                            password_hash=hash_password("guest123"),
                            role=models.UserRole.guest,
                            guest_id=guest.id,
                            is_active=True,
                        )
                    )
            db.commit()
            return

        properties = []
        for name, location, timezone in PROPERTIES:
            property_ = models.Property(
                name=name,
                brand="Meridian Resorts & Spa",
                address=f"{location}, Kenya",
                timezone=timezone,
            )
            db.add(property_)
            properties.append(property_)
        db.flush()

        rate_plans = []
        for index, property_ in enumerate(properties):
            rate_plan = models.RatePlan(
                property_id=property_.id,
                name="Resort Flexible Rate",
                nightly_rate=220 + (index * 25),
                cancellation_policy="Free cancellation up to 48 hours before check-in",
            )
            db.add(rate_plan)
            rate_plans.append(rate_plan)
        db.flush()

        today = date.today()
        statuses = [
            models.ReservationStatus.checked_in,
            models.ReservationStatus.confirmed,
            models.ReservationStatus.confirmed,
            models.ReservationStatus.checked_out,
            models.ReservationStatus.cancelled,
            models.ReservationStatus.confirmed,
        ]
        guests = []
        for index, (name, email, phone, loyalty_tier) in enumerate(GUESTS):
            property_index = index % len(properties)
            guest = models.Guest(
                name=name,
                email=email,
                phone=phone,
                loyalty_tier=loyalty_tier,
            )
            db.add(guest)
            db.flush()
            guests.append(guest)

            check_in = today + timedelta(days=(index % 6) - 2)
            reservation = models.Reservation(
                guest_id=guest.id,
                property_id=properties[property_index].id,
                rate_plan_id=rate_plans[property_index].id,
                check_in=check_in,
                check_out=check_in + timedelta(days=3),
                status=statuses[index % len(statuses)],
            )
            db.add(reservation)
            db.flush()

            room_charge = float(rate_plans[property_index].nightly_rate) * 3
            db.add(
                models.Folio(
                    reservation_id=reservation.id,
                    line_items=[
                        {"description": "3 nights - Resort Flexible Rate", "amount": room_charge},
                        {"description": "Resort fee", "amount": 45.00},
                    ],
                    balance=room_charge + 45.00,
                    status=(
                        models.FolioStatus.settled
                        if reservation.status == models.ReservationStatus.checked_out
                        else models.FolioStatus.open
                    ),
                )
            )
            db.add(
                models.Order(
                    property_id=properties[property_index].id,
                    guest_id=guest.id,
                    items=[
                        {"name": "Breakfast cover", "qty": 2, "price": 28.00},
                        {"name": "Fresh juice", "qty": 2, "price": 7.50},
                    ],
                    total=71.00,
                    placed_at=utcnow(),
                )
            )


        db.add(
            models.User(
                username="operations",
                password_hash=hash_password("meridian2026"),
                role=models.UserRole.staff,
                is_active=True,
            )
        )
        for guest in guests:
            db.add(
                models.User(
                    username=guest.email,
                    password_hash=hash_password("guest123"),
                    role=models.UserRole.guest,
                    guest_id=guest.id,
                    is_active=True,
                )
            )
        db.commit()

        preferences_collection = get_preferences_collection()
        for guest, (dietary, room_preferences, notes) in zip(guests, PREFERENCES, strict=True):
            preferences_collection.update_one(
                {"guest_id": guest.id},
                {
                    "$set": {
                        "guest_id": guest.id,
                        "dietary": dietary,
                        "room_preferences": room_preferences,
                        "notes": notes,
                        "updated_at": utcnow().isoformat(),
                    }
                },
                upsert=True,
            )
    finally:
        db.close()


if __name__ == "__main__":
    seed_if_empty()
    print("Seed complete (or already seeded).")
