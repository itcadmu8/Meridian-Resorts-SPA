from decimal import Decimal
from uuid import uuid4

from sqlalchemy import DECIMAL, JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FolioStatus:
    open = "open"
    settled = "settled"
    overdue = "overdue"


class Folio(Base):
    __tablename__ = 'folios'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    reservation_id: Mapped[str] = mapped_column(String, ForeignKey('reservations.id'), nullable=False)
    line_items: Mapped[list[dict]] = mapped_column(JSON, default=list)
    balance: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default=FolioStatus.open)
