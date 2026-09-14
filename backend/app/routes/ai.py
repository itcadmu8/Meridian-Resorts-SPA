from fastapi import APIRouter, HTTPException

from app.schemas.ai import ChatRequest, ChatResponse
from app.services import ai_service

router = APIRouter(prefix="/api/v1", tags=["ai"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    history = [turn.model_dump() for turn in request.history]

    try:
        result = ai_service.chat(request.message, history)
    except RuntimeError as exc:
        # Server-side misconfiguration (e.g. missing API key).
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI concierge is unavailable: {exc}") from exc

    return ChatResponse(**result)
