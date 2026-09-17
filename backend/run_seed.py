"""
Standalone seed runner for Sept-Nov 2026 operational data.
Run with: uv run python run_seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import UTC, date, datetime, time, timedelta
from app.database import Base, SessionLocal, engine
from app import models

def run_seed():
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        target_start = date(2026, 9, 1)
        target_end = date(2026, 11, 30)

        existing = session.query(models.Reservation).filter(
            models.Reservation.check_in >= target_start,
            models.Reservation.check_in <= target_end,
        ).count()
        print(f"Existing Sept-Nov 2026 reservations: {existing}")

        if existing >= 5000:
            print("Database already fully seeded. Skipping.")
            return

        guests = session.query(models.Guest).filter(models.Guest.id.like("G-9%")).all()
        if not guests:
            print("ERROR: No telemetry guests found. Run seed_if_empty() first.")
            return

        print(f"Found {len(guests)} telemetry guests. Starting seed for {(target_end - target_start).days + 1} days x 6 resorts...")

        prop_targets = {
            "P-001": {"arrivals": 28, "spa": 18, "covers": 105, "stay_duration": 4, "pax_per_res": 3},
            "P-002": {"arrivals": 24, "spa": 16, "covers": 95,  "stay_duration": 3, "pax_per_res": 3},
            "P-003": {"arrivals": 22, "spa": 14, "covers": 88,  "stay_duration": 3, "pax_per_res": 3},
            "P-004": {"arrivals": 20, "spa": 13, "covers": 82,  "stay_duration": 3, "pax_per_res": 3},
            "P-005": {"arrivals": 20, "spa": 12, "covers": 78,  "stay_duration": 3, "pax_per_res": 3},
            "P-006": {"arrivals": 18, "spa": 11, "covers": 72,  "stay_duration": 3, "pax_per_res": 3},
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

        # Delete old incomplete Sept-Nov data before re-seeding
        if existing > 0 and existing < 5000:
            print(f"Cleaning {existing} partial Sept-Nov reservations...")
            session.query(models.Reservation).filter(
                models.Reservation.check_in >= target_start,
                models.Reservation.check_in <= target_end,
                models.Reservation.id.like("R-5%"),
            ).delete(synchronize_session=False)
            session.query(models.SpaAppointment).filter(
                models.SpaAppointment.id.like("SPA-8%"),
            ).delete(synchronize_session=False)
            session.query(models.Order).filter(
                models.Order.id.like("O-9%"),
            ).delete(synchronize_session=False)
            session.commit()
            print("Cleanup done.")

        current_dt = target_start
        res_counter = 50000
        spa_counter = 80000
        ord_counter = 90000
        batch_size = 500

        new_reservations = []
        new_folios = []
        new_spa_appts = []
        new_orders = []

        days_processed = 0
        total_days = (target_end - target_start).days + 1

        while current_dt <= target_end:
            day_offset = (current_dt - target_start).days

            for pid, targets in prop_targets.items():
                num_arrivals = targets["arrivals"]
                for a_idx in range(num_arrivals):
                    res_counter += 1
                    res_id = f"R-{res_counter}"
                    guest = guests[(day_offset * 13 + a_idx * 3) % len(guests)]
                    stay_days = targets["stay_duration"]

                    new_reservations.append(models.Reservation(
                        id=res_id,
                        guest_id=guest.id,
                        property_id=pid,
                        check_in=current_dt,
                        check_out=current_dt + timedelta(days=stay_days),
                        status="Checked-In" if current_dt <= date.today() else "Confirmed",
                        room_number=f"{100 + (a_idx % 40)}",
                        room_type="Deluxe Ocean Suite" if a_idx % 2 == 0 else "Executive Villa",
                        adults=targets["pax_per_res"],
                        children=1 if a_idx % 3 == 0 else 0,
                    ))
                    new_folios.append(models.Folio(
                        id=f"F-{res_counter}",
                        reservation_id=res_id,
                        balance=350.0 + (a_idx * 45.0),
                        status="Open",
                    ))

                # Spa appointments
                for s_idx in range(targets["spa"]):
                    spa_counter += 1
                    guest = guests[(day_offset * 7 + s_idx * 5) % len(guests)]
                    service_name, therapist_name = spa_services[s_idx % len(spa_services)]
                    appt_hour = 9 + (s_idx % 10)
                    appt_time = datetime.combine(current_dt, time(appt_hour, 0))

                    new_spa_appts.append(models.SpaAppointment(
                        id=f"SPA-{spa_counter}",
                        property_id=pid,
                        service=service_name,
                        starts_at=appt_time,
                        therapist=therapist_name,
                        status="completed" if current_dt < date.today() else "confirmed",
                        guest_id=guest.id,
                        guest_email=guest.email,
                        guest_name=guest.name,
                    ))

                # F&B Orders (covers spread across meals)
                num_covers = targets["covers"]
                meal_slots = [
                    (7,  int(num_covers * 0.30)),  # Breakfast  30%
                    (12, int(num_covers * 0.25)),  # Lunch      25%
                    (14, int(num_covers * 0.05)),  # Afternoon  5%
                    (19, int(num_covers * 0.30)),  # Dinner     30%
                    (22, int(num_covers * 0.10)),  # Room svc   10%
                ]
                for meal_hour, covers in meal_slots:
                    if covers < 1:
                        continue
                    ord_counter += 1
                    placed_dt = datetime.combine(current_dt, time(meal_hour, (day_offset * 7) % 59))
                    new_orders.append(models.Order(
                        id=f"O-{ord_counter}",
                        property_id=pid,
                        room_number=f"{100 + (ord_counter % 40)}",
                        total_amount=25.0 * covers,
                        status="Completed",
                        placed_at=placed_dt,
                        items=[{"name": "Resort Dining Cover", "qty": covers, "price": 25.0}],
                    ))

            days_processed += 1
            current_dt += timedelta(days=1)

            # Commit in batches
            if len(new_reservations) >= batch_size:
                session.bulk_save_objects(new_reservations)
                session.bulk_save_objects(new_folios)
                session.bulk_save_objects(new_spa_appts)
                session.bulk_save_objects(new_orders)
                session.commit()
                print(f"  Committed batch — day {days_processed}/{total_days}, "
                      f"res: {res_counter-50000}, spa: {spa_counter-80000}, orders: {ord_counter-90000}")
                new_reservations = []
                new_folios = []
                new_spa_appts = []
                new_orders = []

        # Final batch
        if new_reservations:
            session.bulk_save_objects(new_reservations)
            session.bulk_save_objects(new_folios)
            session.bulk_save_objects(new_spa_appts)
            session.bulk_save_objects(new_orders)
            session.commit()

        total_res = res_counter - 50000
        total_spa = spa_counter - 80000
        total_ord = ord_counter - 90000
        print(f"\n[OK] Seeding complete!")
        print(f"   Reservations:    {total_res:,}")
        print(f"   Spa appointments: {total_spa:,}")
        print(f"   F&B orders:       {total_ord:,}")
        print(f"   Date range:       {target_start} → {target_end} ({total_days} days)")


if __name__ == "__main__":
    run_seed()
