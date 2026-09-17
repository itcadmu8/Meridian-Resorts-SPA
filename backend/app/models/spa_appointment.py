from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SpaAppointment(Base):
    __tablename__ = 'spa_appointments'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    guest_id: Mapped[str] = mapped_column(String, ForeignKey('guests.id'), nullable=False)
    property_id: Mapped[str] = mapped_column(String, ForeignKey('properties.id'), nullable=False)
    service_name: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(default=60)
    status: Mapped[str] = mapped_column(String, nullable=False, default='confirmed')
