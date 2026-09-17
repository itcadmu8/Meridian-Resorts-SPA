from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SpaAppointmentStatus(str, Enum):
	confirmed = "confirmed"
	completed = "completed"
	cancelled = "cancelled"


class SpaAppointment(Base):
	__tablename__ = "spa_appointments"

	id: Mapped[str] = mapped_column(String, primary_key=True)
	property_id: Mapped[str] = mapped_column(ForeignKey("properties.id"), nullable=False)
	service: Mapped[str] = mapped_column(String, nullable=False)
	starts_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
	therapist: Mapped[str] = mapped_column(String, nullable=False)
	status: Mapped[SpaAppointmentStatus] = mapped_column(
		SqlEnum(SpaAppointmentStatus), default=SpaAppointmentStatus.confirmed, nullable=False
	)
	guest_id: Mapped[str | None] = mapped_column(String, nullable=True)
	guest_email: Mapped[str | None] = mapped_column(String, nullable=True)
	guest_name: Mapped[str | None] = mapped_column(String, nullable=True)
	property = relationship("Property")
