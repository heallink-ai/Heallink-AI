from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
import logging
from app.services.voice_assistant import VoiceAssistantService, get_voice_assistant_service

router = APIRouter()
logger = logging.getLogger(__name__)

class VoiceAssistantRequest(BaseModel):
    """Request model for voice assistant initialization"""
    room_name: str
    identity: str

class VoiceAssistantResponse(BaseModel):
    """Response model for voice assistant initialization"""
    status: str
    message: str
    room_name: str

@router.post("/initialize", response_model=VoiceAssistantResponse)
async def initialize_voice_assistant(
    request: VoiceAssistantRequest,
    background_tasks: BackgroundTasks,
    voice_assistant_service: VoiceAssistantService = Depends(get_voice_assistant_service)
):
    """Initialize a voice assistant and connect it to the specified room"""
    try:
        # Start the voice assistant connection in the background
        # (This prevents blocking the HTTP response)
        background_tasks.add_task(
            voice_assistant_service.connect_to_room,
            room_name=request.room_name,
            agent_identity=f"assistant-{request.identity}"
        )
        
        return VoiceAssistantResponse(
            status="initializing",
            message="Voice assistant is being initialized and will connect to the room shortly",
            room_name=request.room_name
        )
    except Exception as e:
        logger.error(f"Error initializing voice assistant: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize voice assistant: {str(e)}"
        )
