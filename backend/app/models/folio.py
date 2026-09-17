"""Folio ORM model for guest reservation billing and balance tracking."""

import uuid
from enum import StrEnum

from sqlalchemy import JSON, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FolioStatus(StrEnum):
    """Enumeration of possible billing folio statuses."""

    open = "Open"
    closed = "Closed"


class Folio(Base):
    """Database entity representing a billing folio attached to a reservation."""

    __tablename__ = "folios"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reservation_id: Mapped[str] = mapped_column(String, nullable=False)
    line_items: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    balance: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    status: Mapped[str] = mapped_column(String, nullable=False, default=FolioStatus.open)
