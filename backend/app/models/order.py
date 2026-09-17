from datetime import datetime, timezone
import uuid
from typing import Any
from sqlalchemy import DateTime, Float, JSON, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Order(Base):
    __tablename__ = 'orders'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id: Mapped[str] = mapped_column(String, nullable=False)
    room_number: Mapped[str | None] = mapped_column(String, nullable=True)
    placed_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    items: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    status: Mapped[str] = mapped_column(String, nullable=False, default="Completed")

    def __init__(self, **kwargs: Any):
        if "total" in kwargs:
            kwargs["total_amount"] = kwargs.pop("total")
        super().__init__(**kwargs)

    @property
    def total(self) -> float:
        return self.total_amount
