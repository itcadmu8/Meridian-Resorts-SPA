"""Multi-property inventory ORM model for resort resources and amenities."""

from datetime import UTC, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.property import Property


class MultiPropertyInventory(Base):
    """Database entity representing inventory stock and room availability across properties."""

    __tablename__ = "multi_property_inventory"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    property_id: Mapped[str] = mapped_column(
        String, ForeignKey("properties.id"), index=True, nullable=False
    )
    inventory_type: Mapped[str] = mapped_column(String, nullable=False, default="room")
    item: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    available_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    property: Mapped[Optional["Property"]] = relationship("Property", backref="inventories")
