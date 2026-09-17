from fastapi import APIRouter, HTTPException

from app.schemas.ai import ChatRequest, ChatResponse
from app.services import ai_service

router = APIRouter(tags=["ai"])


@router.post("/api/v1/ai/chat", response_model=ChatResponse)
@router.post("/api/v1/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    history = [turn.model_dump() for turn in request.history]

    try:
        result = ai_service.chat(
            request.message,
            history,
            guest_context={
                "guest_id": request.guest_id,
                "guest_name": request.guest_name,
                "guest_email": request.guest_email,
            },
        )
    except RuntimeError as exc:
        # Server-side misconfiguration (e.g. missing API key).
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI concierge is unavailable: {exc}") from exc

    return ChatResponse(**result)
