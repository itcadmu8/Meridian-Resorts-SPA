from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    property_id: Mapped[str] = mapped_column(String, ForeignKey('properties.id'), nullable=False)
    guest_id: Mapped[str] = mapped_column(String, ForeignKey('guests.id'), nullable=False)
    items: Mapped[list[dict]] = mapped_column(JSON, default=list)
    total: Mapped[float] = mapped_column(Float, nullable=False)
    placed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
