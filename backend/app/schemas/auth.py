"""
auth.py

Module responsible for auth.
"""
from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    role: str
    guest_id: str | None = None
    is_active: bool


class LoginResponse(BaseModel):
    access_token: str
    user: UserOut
