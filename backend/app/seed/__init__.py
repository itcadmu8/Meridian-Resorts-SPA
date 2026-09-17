"""
__init__.py

Package initialization for seed.
"""
from datetime import UTC, date, datetime, time, timedelta

from app import models
from app.database import Base, SessionLocal, engine
from app.dependencies.auth import hash_password
from app.mongo import get_preferences_collection


def seed_if_empty():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        # 1. Properties & Rate Plans
        if session.query(models.Property).count() == 0:
            property_names = [
                ("P-001", "Meridian Azure Cove"),
                ("P-002", "Meridian Palm Bay"),
                ("P-003", "Meridian Coral Sands"),
                ("P-004", "Meridian Ocean Pearl"),
                ("P-005", "Meridian Rainforest Sanctuary"),
                ("P-006", "Meridian Sunset Cliffs"),
            ]
            for p_id, p_name in property_names:
                session.add(
                    models.Property(
                        id=p_id,
                        name=p_name,
                        brand="Meridian Resorts & Spa",
                        timezone="UTC",
                    )
                )
            for i in range(1, 7):
                p_id = f"P-00{i}"
                session.add(
                    models.RatePlan(
                        id=f"RP-00{i}",
                        property_id=p_id,
                        name="Standard Resort Package",
                        nightly_rate=250.0,
                    )
                )
            session.commit()

        # 2. Guests & Mongo Preferences
        guest_names = [
            ("G-1001", "Jamie Rivera", "jamie.rivera@example.com", "gold"),
            ("G-1002", "Alex Mercer", "alex.mercer@example.com", "platinum"),
            ("G-1003", "Morgan Vance", "morgan.vance@example.com", "silver"),
            ("G-1004", "Taylor Smith", "taylor@example.com", "silver"),
            ("G-1005", "Jordan Lee", "jordan@example.com", "gold"),
            ("G-1006", "Casey Martin", "casey@example.com", "standard"),
            ("G-1007", "Riley Davis", "riley@example.com", "gold"),
            ("G-1008", "Avery Wilson", "avery@example.com", "silver"),
            ("G-1009", "Quinn Taylor", "quinn@example.com", "platinum"),
            ("G-1010", "Dakota Evans", "dakota@example.com", "standard"),
            ("G-1011", "Skyler Thomas", "skyler@example.com", "gold"),
            ("G-1012", "Jesse White", "jesse@example.com", "standard"),
            ("G-1013", "Elena Rostova", "elena@example.com", "gold"),
            ("G-1014", "Marcus Vance", "marcus@example.com", "platinum"),
            ("G-1015", "Chiara Bellini", "chiara@example.com", "silver"),
            ("G-1016", "Julian Bauer", "julian@example.com", "gold"),
            ("G-1017", "Sarah Jenkins", "sarah@example.com", "platinum"),
            ("G-1018", "David Chen", "david@example.com", "standard"),
            ("G-1019", "Amara Okafor", "amara@example.com", "gold"),
            ("G-1020", "Lina Moretti", "lina@example.com", "silver"),
        ]
        for g_id, name, email, tier in guest_names:
            if not session.query(models.Guest).filter_by(id=g_id).first():
                session.add(models.Guest(id=g_id, name=name, email=email, loyalty_tier=tier))
        session.commit()

        try:
            mongo_coll = get_preferences_collection()
            if mongo_coll is not None:
                prefs_data = [
                    (
                        "G-1001",
                        ["vegetarian"],
                        "Ocean view high floor",
                        "Deep Tissue",
                        "Late checkout requested",
                    ),
                    (
                        "G-1002",
                        ["halal"],
                        "Quiet room away from elevator",
                        "Aromatherapy",
                        "Extra feather pillows",
                    ),
                    (
                        "G-1003",
                        ["gluten-free"],
                        "Near spa facility",
                        "Swedish Massage",
                        "Morning room service",
                    ),
                    (
                        "G-1004",
                        ["vegan"],
                        "Ground floor with patio",
                        "Facial Treatment",
                        "Non-feather pillows",
                    ),
                    (
                        "G-1005",
                        ["nut-allergy"],
                        "High floor corner room",
                        "Hot Stone",
                        "Sparkling water welcome",
                    ),
                    ("G-1006", ["none"], "Standard quiet room", "Deep Tissue", "Extra towels"),
                    (
                        "G-1007",
                        ["dairy-free"],
                        "Pool view suite",
                        "Reflexology",
                        "Evening turndown service",
                    ),
                    ("G-1008", ["none"], "High floor", "Hydrating Facial", "Soft pillows"),
                    (
                        "G-1009",
                        ["pescatarian"],
                        "Oceanfront balcony",
                        "Couples Massage",
                        "Champagne on arrival",
                    ),
                    (
                        "G-1010",
                        ["none"],
                        "Garden view room",
                        "Swedish Massage",
                        "Quiet zone preferred",
                    ),
                ]
                for g_id, dietary, room_pref, spa_pref, notes in prefs_data:
                    mongo_coll.update_one(
                        {"guest_id": g_id},
                        {
                            "$set": {
                                "guest_id": g_id,
                                "dietary": dietary,
                                "room_preference": room_pref,
                                "spa_preference": spa_pref,
                                "special_notes": notes,
                            }
                        },
                        upsert=True,
                    )
        except Exception as e:
            print(f"Warning: Mongo preferences seed skipped or failed: {e}")

        # 3. Clean Reservations, Folios, Orders for 20 Demo Guests
        if (
            session.query(models.Reservation).filter(models.Reservation.id.like("R-20%")).count()
            == 0
        ):
            props = session.query(models.Property).all()
            guests = session.query(models.Guest).filter(models.Guest.id.like("G-10%")).all()
            for i, guest in enumerate(guests):
                res_id = f"R-20{i + 1:02d}"
                prop = props[i % len(props)]

                res = models.Reservation(
                    id=res_id,
                    guest_id=guest.id,
                    property_id=prop.id,
                    status="Confirmed" if i % 2 == 0 else "Checked-In",
                    check_in=date.today() - timedelta(days=(i % 3)),
                    check_out=date.today() + timedelta(days=3 - (i % 3)),
                    room_number=f"10{i + 1}",
                    room_type="Deluxe Ocean Suite" if i % 2 == 0 else "Executive Villa",
                    adults=2,
                    children=0,
                )
                session.add(res)
                session.flush()

                folio = models.Folio(
                    id=f"F-30{i + 1:02d}",
                    reservation_id=res.id,
                    balance=150.0 + i * 25.0,
                    status="Open",
                )
                session.add(folio)

                order = models.Order(
                    id=f"O-40{i + 1:02d}",
                    property_id=prop.id,
                    room_number=f"10{i + 1}",
                    total_amount=45.0 + i * 10.0,
                    status="Completed",
                    placed_at=datetime.now(UTC) - timedelta(hours=i * 2),
                    items=[{"name": "Resort Breakfast", "qty": 2, "price": 22.5}],
                )
                session.add(order)

            session.commit()

        # 4. Users (Predefined Staff & 20 Guest demo accounts with password guest123)
        default_staff_pw = hash_password("staff123")
        for staff_name in ["staff", "manager", "admin"]:
            if not session.query(models.User).filter_by(username=staff_name).first():
                session.add(
                    models.User(
                        username=staff_name,
                        password_hash=default_staff_pw,
                        role=models.UserRole.staff,
                    )
                )

        demo_guests = session.query(models.Guest).filter(models.Guest.id.like("G-10%")).all()
        default_guest_pw = hash_password("guest123")
        for idx, guest in enumerate(demo_guests, start=1):
            if not session.query(models.User).filter_by(username=guest.email).first():
                session.add(
                    models.User(
                        username=guest.email,
                        password_hash=default_guest_pw,
                        role=models.UserRole.guest,
                        guest_id=guest.id,
                    )
                )
            shorthand = f"guest{idx}"
            if not session.query(models.User).filter_by(username=shorthand).first():
                session.add(
                    models.User(
                        username=shorthand,
                        password_hash=default_guest_pw,
                        role=models.UserRole.guest,
                        guest_id=guest.id,
                    )
                )
        if not session.query(models.User).filter_by(username="guest").first():
            session.add(
                models.User(
                    username="guest",
                    password_hash=default_guest_pw,
                    role=models.UserRole.guest,
                    guest_id="G-1001",
                )
            )
        session.commit()

        # 5. Spa Appointments (Team 2 Spa Entity)
        if session.query(models.SpaAppointment).count() == 0:
            now = datetime.now(UTC)
            spa_seeds = [
                (
                    "SPA-5001",
                    "P-001",
                    "Deep Tissue Massage",
                    now + timedelta(hours=2),
                    "Elena Rostova",
                    "confirmed",
                    "G-1001",
                    "jamie.rivera@example.com",
                    "Jamie Rivera",
                ),
                (
                    "SPA-5002",
                    "P-001",
                    "Hydrating Facial",
                    now + timedelta(hours=4),
                    "David Chen",
                    "confirmed",
                    "G-1002",
                    "alex.mercer@example.com",
                    "Alex Mercer",
                ),
                (
                    "SPA-5003",
                    "P-002",
                    "Aromatherapy Massage",
                    now + timedelta(days=1, hours=2),
                    "Maya Lin",
                    "confirmed",
                    "G-1003",
                    "morgan.vance@example.com",
                    "Morgan Vance",
                ),
                (
                    "SPA-5004",
                    "P-002",
                    "Hot Stone Therapy",
                    now - timedelta(hours=3),
                    "Sarah Jenkins",
                    "completed",
                    "G-1004",
                    "taylor@example.com",
                    "Taylor Smith",
                ),
                (
                    "SPA-5005",
                    "P-003",
                    "Swedish Body Massage",
                    now + timedelta(hours=5),
                    "Elena Rostova",
                    "confirmed",
                    "G-1005",
                    "jordan@example.com",
                    "Jordan Lee",
                ),
                (
                    "SPA-5006",
                    "P-003",
                    "Reflexology Treatment",
                    now + timedelta(days=1),
                    "David Chen",
                    "confirmed",
                    "G-1006",
                    "casey@example.com",
                    "Casey Martin",
                ),
                (
                    "SPA-5007",
                    "P-004",
                    "Deep Tissue Massage",
                    now + timedelta(hours=1),
                    "Maya Lin",
                    "confirmed",
                    "G-1007",
                    "riley@example.com",
                    "Riley Davis",
                ),
                (
                    "SPA-5008",
                    "P-004",
                    "Couples Wellness Ritual",
                    now + timedelta(days=2),
                    "Sarah Jenkins",
                    "confirmed",
                    "G-1008",
                    "avery@example.com",
                    "Avery Wilson",
                ),
                (
                    "SPA-5009",
                    "P-005",
                    "Radiance Facial & Scrub",
                    now + timedelta(hours=3),
                    "Elena Rostova",
                    "confirmed",
                    "G-1009",
                    "quinn@example.com",
                    "Quinn Taylor",
                ),
                (
                    "SPA-5010",
                    "P-005",
                    "Detox Hydrotherapy",
                    now - timedelta(days=1),
                    "David Chen",
                    "completed",
                    "G-1010",
                    "dakota@example.com",
                    "Dakota Evans",
                ),
                (
                    "SPA-5011",
                    "P-006",
                    "Thai Herbal Compress",
                    now + timedelta(hours=6),
                    "Maya Lin",
                    "confirmed",
                    "G-1011",
                    "skyler@example.com",
                    "Skyler Thomas",
                ),
                (
                    "SPA-5012",
                    "P-006",
                    "Deep Tissue Massage",
                    now - timedelta(hours=6),
                    "Sarah Jenkins",
                    "cancelled",
                    "G-1012",
                    "jesse@example.com",
                    "Jesse White",
                ),
            ]
            for (
                appt_id,
                p_id,
                service,
                starts,
                therapist,
                status,
                g_id,
                g_email,
                g_name,
            ) in spa_seeds:
                session.add(
                    models.SpaAppointment(
                        id=appt_id,
                        property_id=p_id,
                        service=service,
                        starts_at=starts,
                        therapist=therapist,
                        status=status,
                        guest_id=g_id,
                        guest_email=g_email,
                        guest_name=g_name,
                    )
                )
            session.commit()

        # 6. Background Telemetry Guests for Operational Telemetry
        telemetry_guests = session.query(models.Guest).filter(models.Guest.id.like("G-9%")).all()
        if len(telemetry_guests) < 200:
            for i in range(1, 201):
                g_id = f"G-9{i:04d}"
                if not session.query(models.Guest).filter_by(id=g_id).first():
                    session.add(
                        models.Guest(
                            id=g_id,
                            name=f"Telemetry Guest {i}",
                            email=f"telemetry.{i}@internal.local",
                            loyalty_tier="standard",
                        )
                    )
            session.commit()
            telemetry_guests = (
                session.query(models.Guest).filter(models.Guest.id.like("G-9%")).all()
            )

        # Migration cleanup: Reassign any operational telemetry reservations (R-5xxxx / R-6xxxx)
        # from G-10xx to background G-9xxx guests
        bg_guest_ids = [g.id for g in telemetry_guests]
        dirty_telemetry_res = (
            session.query(models.Reservation)
            .filter(
                (models.Reservation.id.like("R-5%") | models.Reservation.id.like("R-6%")),
                models.Reservation.guest_id.like("G-10%"),
            )
            .all()
        )
        if dirty_telemetry_res:
            for idx, r in enumerate(dirty_telemetry_res):
                r.guest_id = bg_guest_ids[idx % len(bg_guest_ids)]
            session.commit()

        # 8. Date-by-Date Operational Seeding for August 1, 2026 - Nov 30, 2026
        target_start = date(2026, 8, 1)
        target_end = date(2026, 11, 30)

        existing_telemetry_res = (
            session.query(models.Reservation)
            .filter(
                models.Reservation.check_in >= target_start,
                models.Reservation.check_in <= target_end,
                (models.Reservation.id.like("R-5%") | models.Reservation.id.like("R-6%")),
            )
            .count()
        )

        if existing_telemetry_res < 5000:
            print("Seeding August - November 2026 operational telemetry across all 6 resorts...")

            prop_targets = {
                "P-001": {
                    "arrivals": 11,
                    "spa": 16,
                    "covers": 105,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
                "P-002": {
                    "arrivals": 10,
                    "spa": 14,
                    "covers": 95,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
                "P-003": {
                    "arrivals": 9,
                    "spa": 13,
                    "covers": 88,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
                "P-004": {
                    "arrivals": 9,
                    "spa": 12,
                    "covers": 82,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
                "P-005": {
                    "arrivals": 9,
                    "spa": 12,
                    "covers": 78,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
                "P-006": {
                    "arrivals": 9,
                    "spa": 11,
                    "covers": 72,
                    "stay_duration": 3,
                    "pax_per_res": 3,
                },
            }

            spa_services = [
                ("Deep Tissue Massage", "Amara Okafor"),
                ("Hydrating Facial", "Lina Moretti"),
                ("Hot Stone Therapy", "Noah Williams"),
                ("Aromatherapy Reset", "Priya Shah"),
                ("Couples Ocean Ritual", "Sofia Laurent"),
                ("Swedish Massage", "Daniel Kim"),
                ("Reflexology Treatment", "Elena Rostova"),
                ("Thai Herbal Compress", "Marcus Vance"),
            ]

            import math

            current_dt = target_start
            res_counter = 50000
            spa_counter = 80000
            ord_counter = 90000

            new_reservations = []
            new_folios = []
            new_spa_appts = []
            new_orders = []

            while current_dt <= target_end:
                day_offset = (current_dt - target_start).days
                weekday = current_dt.weekday()
                # Dynamic daily variation factor (0.72 to 1.35)
                variation = (
                    1.0
                    + (0.22 * math.sin(day_offset * 0.45))
                    + (0.12 if weekday in (4, 5, 6) else -0.06)
                )

                for pid, targets in prop_targets.items():
                    # Generate Reservations checking in today with dynamic count
                    num_arrivals = max(4, int(round(targets["arrivals"] * variation)))
                    for a_idx in range(num_arrivals):
                        res_counter += 1
                        res_id = f"R-{res_counter}"
                        guest = telemetry_guests[(day_offset * 11 + a_idx) % len(telemetry_guests)]
                        adults = 2 + ((a_idx + day_offset) % 3)
                        children = 1 if (a_idx + day_offset) % 3 == 0 else 0
                        stay_days = 2 + ((day_offset + a_idx) % 3)

                        new_reservations.append(
                            models.Reservation(
                                id=res_id,
                                guest_id=guest.id,
                                property_id=pid,
                                check_in=current_dt,
                                check_out=current_dt + timedelta(days=stay_days),
                                status="Checked-In" if current_dt <= date.today() else "Confirmed",
                                room_number=f"{100 + (a_idx % 40)}",
                                room_type="Deluxe Ocean Suite"
                                if a_idx % 2 == 0
                                else "Executive Villa",
                                adults=adults,
                                children=children,
                            )
                        )

                        new_folios.append(
                            models.Folio(
                                id=f"F-{res_counter}",
                                reservation_id=res_id,
                                balance=350.0 + (a_idx * 50.0),
                                status="Open",
                            )
                        )

                    # Generate Spa Appointments today with dynamic count
                    num_spa = max(4, int(round(targets["spa"] * variation)))
                    for s_idx in range(num_spa):
                        spa_counter += 1
                        guest = telemetry_guests[(day_offset * 7 + s_idx) % len(telemetry_guests)]
                        service_name, therapist_name = spa_services[s_idx % len(spa_services)]
                        appt_hour = 9 + (s_idx % 9)
                        appt_time = datetime.combine(
                            current_dt, time(appt_hour, 0), tzinfo=UTC
                        ).replace(tzinfo=None)

                        new_spa_appts.append(
                            models.SpaAppointment(
                                id=f"SPA-{spa_counter}",
                                property_id=pid,
                                service=service_name,
                                starts_at=appt_time,
                                therapist=therapist_name,
                                status="completed" if current_dt < date.today() else "confirmed",
                                guest_id=guest.id,
                                guest_email=guest.email,
                                guest_name=guest.name,
                            )
                        )

                    # Generate F&B Orders across meal periods with dynamic count
                    num_covers = max(30, int(round(targets["covers"] * variation)))
                    meal_slots = [
                        (7, int(num_covers * 0.30)),  # Breakfast  30%
                        (12, int(num_covers * 0.25)),  # Lunch      25%
                        (14, int(num_covers * 0.05)),  # Afternoon   5%
                        (19, int(num_covers * 0.30)),  # Dinner     30%
                        (22, int(num_covers * 0.10)),  # Room svc   10%
                    ]
                    for meal_hour, covers in meal_slots:
                        if covers < 1:
                            continue
                        ord_counter += 1
                        placed_dt = datetime.combine(
                            current_dt, time(meal_hour, (day_offset * 7) % 59), tzinfo=UTC
                        ).replace(tzinfo=None)
                        new_orders.append(
                            models.Order(
                                id=f"O-{ord_counter}",
                                property_id=pid,
                                room_number=f"{100 + (ord_counter % 40)}",
                                total_amount=25.0 * covers,
                                status="Completed",
                                placed_at=placed_dt,
                                items=[
                                    {"name": "Resort Dining Cover", "qty": covers, "price": 25.0}
                                ],
                            )
                        )

                current_dt += timedelta(days=1)

                # Commit in batches of 500 reservations to avoid memory issues
                if len(new_reservations) >= 500:
                    session.bulk_save_objects(new_reservations)
                    session.bulk_save_objects(new_folios)
                    session.bulk_save_objects(new_spa_appts)
                    session.bulk_save_objects(new_orders)
                    session.commit()
                    new_reservations = []
                    new_folios = []
                    new_spa_appts = []
                    new_orders = []

            # Commit any remaining records
            if new_reservations:
                session.bulk_save_objects(new_reservations)
                session.bulk_save_objects(new_folios)
                session.bulk_save_objects(new_spa_appts)
                session.bulk_save_objects(new_orders)
                session.commit()
            print(
                f"[OK] Successfully seeded Sept-Nov 2026 daily operational records! "
                f"({res_counter - 50000} reservations, {spa_counter - 80000} spa appts, "
                f"{ord_counter - 90000} orders)"
            )
