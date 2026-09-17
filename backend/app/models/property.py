"""
property.py

SQLAlchemy / Pydantic data models for property. Defines Property.
"""
import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    brand: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str | None] = mapped_column(String, nullable=True, default="")
    timezone: Mapped[str] = mapped_column(String, nullable=False, default="UTC")
