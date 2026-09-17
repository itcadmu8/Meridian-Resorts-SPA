"""Pydantic schemas for Spa Appointments (US-02-T01 to US-02-T08)."""

import datetime as _dt
import enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class SpaAppointmentStatus(enum.StrEnum):
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


class SpaAppointmentBase(BaseModel):
    therapist: str = Field(..., min_length=1, description="Therapist name")
    service: str = Field(..., min_length=1, description="Spa service / treatment name")
    time_slot: _dt.datetime = Field(..., description="UTC start datetime for the appointment")
    status: SpaAppointmentStatus = Field(
        default=SpaAppointmentStatus.confirmed, description="Appointment status"
    )


class SpaAppointmentCreate(SpaAppointmentBase):
    property_id: str = Field(..., description="Property UUID")


class SpaAppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="UUID identifier for the appointment")
    property: str = Field(..., description="Property name joined from the property relationship")
    therapist: str = Field(..., description="Therapist name")
    service: str = Field(..., description="Spa service / treatment name")
    time_slot: _dt.datetime = Field(..., description="UTC start time of the appointment")
    status: SpaAppointmentStatus = Field(
        default=SpaAppointmentStatus.confirmed, description="Appointment status"
    )


class TodaySpaBookings(BaseModel):
    date: _dt.date = Field(..., description="Current query date (UTC)")
    total_spa_bookings: int = Field(..., description="Total active spa appointments for today")
    bookings: list[SpaAppointmentOut] = Field(
        default_factory=list, description="List of today's spa appointments"
    )


class TodaySpaBookingsResponse(TodaySpaBookings):
    """Alias for TodaySpaBookings to support clear API documentation."""
    pass


class SpaErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class SpaErrorResponse(BaseModel):
    success: bool = False
    error: SpaErrorDetail
