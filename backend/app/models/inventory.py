from uuid import uuid4

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Inventory(Base):
    __tablename__ = 'inventory'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    property_id: Mapped[str] = mapped_column(String, ForeignKey('properties.id'), nullable=False)
    sku: Mapped[str] = mapped_column(String, nullable=False)
    item_name: Mapped[str] = mapped_column(String, nullable=False)
    available_qty: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
