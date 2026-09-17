from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["auth"])


@router.get("/auth/health")
def auth_health():
    return {"status": "ok"}
