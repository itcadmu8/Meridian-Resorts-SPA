from fastapi import FastAPI
from sqlalchemy import select
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.dependencies.auth import hash_password
from app.models import User, UserRole
from app.routers import auth
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
        session.commit()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
