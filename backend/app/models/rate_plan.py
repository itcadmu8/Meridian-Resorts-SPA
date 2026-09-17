from decimal import Decimal
from uuid import uuid4

from sqlalchemy import DECIMAL, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RatePlan(Base):
    __tablename__ = 'rate_plans'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    property_id: Mapped[str] = mapped_column(String, ForeignKey('properties.id'), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    nightly_rate: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    cancellation_policy: Mapped[str] = mapped_column(String, nullable=False)
