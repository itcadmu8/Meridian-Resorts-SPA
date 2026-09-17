from uuid import uuid4

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UpsellOffer(Base):
    __tablename__ = 'upsell_offers'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    property_id: Mapped[str] = mapped_column(String, ForeignKey('properties.id'), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    active: Mapped[bool] = mapped_column(default=True)
