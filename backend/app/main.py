"""
main.py

FastAPI application entry point configuring middleware, CORS, routers, and lifecycle events.
"""
from datetime import UTC, datetime, time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.dependencies.auth import hash_password
from app.models import SpaAppointment, SpaAppointmentStatus, User, UserRole
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
    reconciliation,
    reservations,
    spa,
)

app = FastAPI(
    title="Meridian Resorts & Spa API",
    description="Operations dashboard backend for Meridian Resorts & Spa.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reservations.router)
app.include_router(guests.router)
app.include_router(folios.router)
app.include_router(availability.router)
app.include_router(properties.router)
app.include_router(ai.router)
app.include_router(auth.router)
app.include_router(spa.router)
app.include_router(arrivals.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)
app.include_router(offers.router)
app.include_router(orders.router)
app.include_router(reconciliation.router)


@app.on_event("startup")
def initialize_auth():
    if settings.testing:
        return
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS guest_id VARCHAR;"))
        conn.execute(
            text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS placed_at TIMESTAMP WITH TIME ZONE;")
        )
        conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSON;"))
        conn.execute(text("ALTER TABLE orders DROP COLUMN IF EXISTS created_at;"))
        conn.execute(
            text("ALTER TABLE spa_appointments ADD COLUMN IF NOT EXISTS guest_id VARCHAR;")
        )
        conn.execute(
            text("ALTER TABLE spa_appointments ADD COLUMN IF NOT EXISTS guest_email VARCHAR;")
        )
        conn.execute(
            text("ALTER TABLE spa_appointments ADD COLUMN IF NOT EXISTS guest_name VARCHAR;")
        )

    from app.seed import seed_if_empty

    seed_if_empty()

    with SessionLocal() as session:
        if session.scalar(select(User).where(User.username == "staff")) is None:
            session.add(
                User(
                    id="U-STAFF-001",
                    username="staff",
                    password_hash=hash_password("staff123"),
                    role=UserRole.staff,
                )
            )
        guest_user = session.scalar(select(User).where(User.username == "guest"))
        if guest_user is None:
            session.add(
                User(
                    id="U-GUEST-001",
                    username="guest",
                    password_hash=hash_password("guest123"),
                    role=UserRole.guest,
                    guest_id="G-1001",
                )
            )
        elif not guest_user.guest_id:
            guest_user.guest_id = "G-1001"
        if session.scalar(select(SpaAppointment).limit(1)) is None:
            today = datetime.now(UTC).date()
            appointments = [
                ("SPA-001", "P-001", "Meridian Hot Stone Massage", "Amara Okafor", time(9, 0)),
                ("SPA-002", "P-002", "Coastal Glow Facial", "Lina Moretti", time(10, 30)),
                ("SPA-003", "P-003", "Deep Tissue Massage", "Noah Williams", time(12, 0)),
                ("SPA-004", "P-004", "Ayurvedic Renewal Ritual", "Priya Shah", time(14, 0)),
                ("SPA-005", "P-005", "Couples Ocean Reset", "Sofia Laurent", time(15, 30)),
                ("SPA-006", "P-006", "Moonlit Recovery Treatment", "Daniel Kim", time(17, 0)),
            ]
            session.add_all(
                [
                    SpaAppointment(
                        id=appointment_id,
                        property_id=property_id,
                        service=service,
                        starts_at=datetime.combine(today, starts_at, tzinfo=UTC).replace(
                            tzinfo=None
                        ),
                        therapist=therapist,
                        status=SpaAppointmentStatus.confirmed,
                    )
                    for appointment_id, property_id, service, therapist, starts_at in appointments
                ]
            )
        prop_names = {
            "P-001": "Meridian Azure Cove",
            "P-002": "Meridian Palm Bay",
            "P-003": "Meridian Coral Sands",
            "P-004": "Meridian Ocean Pearl",
            "P-005": "Meridian Rainforest Sanctuary",
            "P-006": "Meridian Sunset Cliffs",
        }
        from app.models.property import Property

        for pid, pname in prop_names.items():
            p_obj = session.scalar(select(Property).where(Property.id == pid))
            if p_obj:
                p_obj.name = pname

        session.commit()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
