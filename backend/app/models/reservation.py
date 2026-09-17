"""Reservation ORM model for resort guest stay bookings and room assignments."""

import uuid
from datetime import date, timedelta
from enum import StrEnum

from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ReservationStatus(StrEnum):
    """Enumeration of reservation lifecycle states."""

    confirmed = "Confirmed"
    checked_in = "Checked-In"
    checked_out = "Checked-Out"
    cancelled = "Cancelled"
    pending = "Pending"


class Reservation(Base):
    """Database entity representing a guest stay reservation."""

    __tablename__ = "reservations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    guest_id: Mapped[str] = mapped_column(String, nullable=False)
    property_id: Mapped[str] = mapped_column(String, nullable=False)
    rate_plan_id: Mapped[str] = mapped_column(String, nullable=False, default="RP-001")
    check_in: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    check_out: Mapped[date] = mapped_column(
        Date, nullable=False, default=lambda: date.today() + timedelta(days=2)
    )
    status: Mapped[str] = mapped_column(String, nullable=False, default=ReservationStatus.confirmed)
    room_number: Mapped[str | None] = mapped_column(String, nullable=True)
    room_type: Mapped[str | None] = mapped_column(String, nullable=True)
    special_preference: Mapped[str | None] = mapped_column(String, nullable=True)
    adults: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    children: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
