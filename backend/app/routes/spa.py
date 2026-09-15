from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["spa"])


@router.get("/spa")
def list_spa_services():
    return [
        {"id": "massage", "name": "Signature Massage", "duration_minutes": 90},
        {"id": "facial", "name": "Botanical Facial", "duration_minutes": 60},
    ]
