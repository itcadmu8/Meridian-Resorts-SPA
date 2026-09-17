"""User ORM model representing staff and guest authentication identities."""

import uuid
from enum import StrEnum

from sqlalchemy import Boolean, String
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserRole(StrEnum):
    """Supported user authorization roles within the Meridian system."""

    guest = "GUEST"
    staff = "STAFF"


class User(Base):
    """Database entity representing an authorized system user."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[UserRole] = mapped_column(SqlEnum(UserRole), nullable=False)
    guest_id: Mapped[str | None] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
