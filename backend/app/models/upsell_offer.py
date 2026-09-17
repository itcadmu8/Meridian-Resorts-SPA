from datetime import UTC, datetime
from typing import Optional
from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UpsellOffer(Base):
    __tablename__ = "upsell_offers"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    property_id: Mapped[str] = mapped_column(String, ForeignKey("properties.id"), index=True, nullable=False)
    offer_type: Mapped[str] = mapped_column(String, nullable=False, default="spa")
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    active_from: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    active_to: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="active")

    property: Mapped[Optional["Property"]] = relationship("Property", backref="upsell_offers")
