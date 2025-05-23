from fastapi import APIRouter
from app.api.routes import livekit, voice_assistant

router = APIRouter()

router.include_router(livekit.router, prefix="/livekit", tags=["livekit"])
router.include_router(voice_assistant.router, prefix="/voice-assistant", tags=["voice-assistant"])
