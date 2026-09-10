from datetime import date

from pydantic import BaseModel, ConfigDict


class ReservationItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    guest_id: str
    property_id: int
    guest_name: str | None = None
    property_name: str | None = None
    loyalty_tier: str | None = None
    check_in: date
    check_out: date
    status: str
