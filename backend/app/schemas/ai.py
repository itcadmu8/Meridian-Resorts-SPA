from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    text: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[ChatMessage] = Field(default_factory=list)
    guest_id: str | None = None
    guest_name: str | None = None
    guest_email: str | None = None


class ChatResponse(BaseModel):
    reply: str
    reservation: dict | None = None
