from datetime import UTC, datetime, time

from fastapi import FastAPI
from sqlalchemy import select
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.dependencies.auth import hash_password
from app.models import SpaAppointment, SpaAppointmentStatus, User, UserRole
from app.routers import auth, spa
from app.routes import ai, reservations

app = FastAPI(
    title="Meridian Resorts & Spa API",
    description="Operations dashboard backend for Meridian Resorts & Spa.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reservations.router)
app.include_router(ai.router)
app.include_router(auth.router)
app.include_router(spa.router)


@app.on_event("startup")
def initialize_auth():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        if session.scalar(select(User).where(User.username == "staff")) is None:
            session.add(User(
                id="U-STAFF-001",
                username="staff",
                password_hash=hash_password("staff123"),
                role=UserRole.staff,
            ))
        if session.scalar(select(User).where(User.username == "guest")) is None:
            session.add(User(
                id="U-GUEST-001",
                username="guest",
                password_hash=hash_password("guest123"),
                role=UserRole.guest,
            ))
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
            session.add_all([
                SpaAppointment(
                    id=appointment_id,
                    property_id=property_id,
                    service=service,
                    starts_at=datetime.combine(today, starts_at, tzinfo=UTC).replace(tzinfo=None),
                    therapist=therapist,
                    status=SpaAppointmentStatus.confirmed,
                )
                for appointment_id, property_id, service, therapist, starts_at in appointments
            ])
        session.commit()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
