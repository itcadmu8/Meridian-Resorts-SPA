from datetime import date
from uuid import uuid4

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ReservationStatus:
    checked_in = "checked_in"
    confirmed = "confirmed"
    checked_out = "checked_out"
    cancelled = "cancelled"


class Reservation(Base):
    __tablename__ = 'reservations'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    guest_id: Mapped[str] = mapped_column(String, nullable=False)
    property_id: Mapped[str] = mapped_column(String, nullable=False)
    rate_plan_id: Mapped[str] = mapped_column(String, nullable=False)
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default=ReservationStatus.confirmed)
    room_number: Mapped[str | None] = mapped_column(String, nullable=True)
    room_type: Mapped[str | None] = mapped_column(String, nullable=True)
    special_preference: Mapped[str | None] = mapped_column(String, nullable=True)
