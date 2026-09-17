import uuid
from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class RatePlan(Base):
    __tablename__ = 'rate_plans'

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    nightly_rate: Mapped[float] = mapped_column(Float, nullable=False, default=100.0)
    cancellation_policy: Mapped[str | None] = mapped_column(String, nullable=True, default="Flexible")
