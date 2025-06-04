"""
FastAPI Routes for Avatar Engine
Provides REST API endpoints for avatar session management and real-time control.
"""

import asyncio
import io
from pathlib import Path
from typing import Dict, Optional, List
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from loguru import logger

from ..core.avatar_session import AvatarSession
from ..core.config import AvatarConfig


# Pydantic models for API requests/responses
class CreateAvatarRequest(BaseModel):
    """Request to create a new avatar session."""
    avatar_id: Optional[str] = Field(default=None, description="Optional avatar ID")
    avatar_image_url: Optional[str] = Field(default=None, description="Avatar image URL")
    emotion: str = Field(default="neutral", description="Initial emotion")
    emotion_intensity: float = Field(default=0.5, ge=0.0, le=1.0, description="Emotion intensity")


class AvatarSessionResponse(BaseModel):
    """Response containing avatar session information."""
    session_id: str
    is_active: bool
    is_streaming: bool
    current_emotion: str
    avatar_image: Optional[str]
    session_start_time: float


class StartLiveKitStreamRequest(BaseModel):
    """Request to start LiveKit streaming."""
    livekit_url: str = Field(..., description="LiveKit server URL")
    livekit_token: str = Field(..., description="LiveKit authentication token")
    room_name: str = Field(..., description="Room name to join")


class SetEmotionRequest(BaseModel):
    """Request to set avatar emotion."""
    emotion: str = Field(..., description="Emotion name")
    intensity: float = Field(default=0.5, ge=0.0, le=1.0, description="Emotion intensity")


class AvatarMetricsResponse(BaseModel):
    """Response containing avatar performance metrics."""
    session_metrics: Dict
    lip_sync_metrics: Optional[Dict] = None
    streaming_metrics: Optional[Dict] = None


# Global session manager
class AvatarSessionManager:
    """Manages multiple avatar sessions."""
    
    def __init__(self, config: AvatarConfig):
        self.config = config
        self.sessions: Dict[str, AvatarSession] = {}
        self.max_sessions = config.max_concurrent_sessions
    
    async def create_session(
        self, 
        avatar_image_path: Optional[Path] = None,
        session_id: Optional[str] = None
    ) -> AvatarSession:
        """Create a new avatar session."""
        if len(self.sessions) >= self.max_sessions:
            raise HTTPException(
                status_code=429,
                detail=f"Maximum concurrent sessions ({self.max_sessions}) reached"
            )
        
        # Generate session ID if not provided
        if session_id is None:
            session_id = f"avatar_{uuid.uuid4().hex[:8]}"
        
        # Use default avatar image if none provided
        if avatar_image_path is None:
            avatar_image_path = self.config.default_avatar_image
        
        # Create and initialize session
        session = AvatarSession(session_id, avatar_image_path, self.config)
        await session.initialize()
        
        # Store session
        self.sessions[session_id] = session
        
        logger.info(f"Created avatar session: {session_id}")
        return session
    
    def get_session(self, session_id: str) -> AvatarSession:
        """Get an existing avatar session."""
        if session_id not in self.sessions:
            raise HTTPException(
                status_code=404,
                detail=f"Avatar session not found: {session_id}"
            )
        return self.sessions[session_id]
    
    async def delete_session(self, session_id: str) -> None:
        """Delete an avatar session."""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            await session.stop()
            del self.sessions[session_id]
            logger.info(f"Deleted avatar session: {session_id}")
    
    def list_sessions(self) -> List[Dict]:
        """List all active sessions."""
        return [session.get_session_info() for session in self.sessions.values()]


# Initialize session manager (will be set by main app)
session_manager: Optional[AvatarSessionManager] = None


def create_avatar_router(config: AvatarConfig) -> APIRouter:
    """Create the avatar API router with configuration."""
    global session_manager
    session_manager = AvatarSessionManager(config)
    
    router = APIRouter(prefix="/avatars", tags=["avatars"])
    
    @router.post("/", response_model=AvatarSessionResponse, status_code=201)
    async def create_avatar_session(request: CreateAvatarRequest):
        """Create a new avatar session."""
        try:
            # Handle avatar image
            avatar_image_path = None
            if request.avatar_image_url:
                # TODO: Download and process avatar image from URL
                # For now, use default image
                avatar_image_path = config.default_avatar_image
            
            # Create session
            session = await session_manager.create_session(
                avatar_image_path=avatar_image_path,
                session_id=request.avatar_id
            )
            
            # Set initial emotion
            if request.emotion != "neutral":
                await session.set_emotion(request.emotion, request.emotion_intensity)
            
            return AvatarSessionResponse(**session.get_session_info())
            
        except Exception as e:
            logger.error(f"Failed to create avatar session: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/", response_model=List[AvatarSessionResponse])
    async def list_avatar_sessions():
        """List all active avatar sessions."""
        sessions = session_manager.list_sessions()
        return [AvatarSessionResponse(**session) for session in sessions]
    
    @router.get("/{session_id}", response_model=AvatarSessionResponse)
    async def get_avatar_session(session_id: str):
        """Get information about a specific avatar session."""
        session = session_manager.get_session(session_id)
        return AvatarSessionResponse(**session.get_session_info())
    
    @router.delete("/{session_id}")
    async def delete_avatar_session(session_id: str):
        """Delete an avatar session."""
        await session_manager.delete_session(session_id)
        return {"message": f"Avatar session {session_id} deleted"}
    
    @router.post("/{session_id}/livekit-stream")
    async def start_livekit_stream(session_id: str, request: StartLiveKitStreamRequest):
        """Start LiveKit streaming for an avatar session."""
        try:
            session = session_manager.get_session(session_id)
            
            await session.start_livekit_streaming(
                livekit_url=request.livekit_url,
                livekit_token=request.livekit_token,
                participant_identity="heallink-avatar"
            )
            
            return {"message": f"LiveKit streaming started for session {session_id}"}
            
        except Exception as e:
            logger.error(f"Failed to start LiveKit streaming: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/{session_id}/emotion")
    async def set_avatar_emotion(session_id: str, request: SetEmotionRequest):
        """Set avatar facial expression/emotion."""
        try:
            session = session_manager.get_session(session_id)
            await session.set_emotion(request.emotion, request.intensity)
            
            return {
                "message": f"Emotion set to {request.emotion} ({request.intensity})",
                "emotion": request.emotion,
                "intensity": request.intensity
            }
            
        except Exception as e:
            logger.error(f"Failed to set emotion: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.post("/{session_id}/avatar-image")
    async def update_avatar_image(session_id: str, file: UploadFile = File(...)):
        """Update the avatar image for a session."""
        try:
            session = session_manager.get_session(session_id)
            
            # Save uploaded file
            temp_path = config.temp_path / f"{session_id}_{file.filename}"
            
            with open(temp_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Update session
            await session.update_avatar_image(temp_path)
            
            return {"message": f"Avatar image updated for session {session_id}"}
            
        except Exception as e:
            logger.error(f"Failed to update avatar image: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/{session_id}/metrics", response_model=AvatarMetricsResponse)
    async def get_avatar_metrics(session_id: str):
        """Get performance metrics for an avatar session."""
        session = session_manager.get_session(session_id)
        metrics = session.get_session_metrics()
        
        return AvatarMetricsResponse(
            session_metrics=metrics,
            lip_sync_metrics=metrics.get("lip_sync"),
            streaming_metrics=metrics.get("streaming")
        )
    
    @router.websocket("/{session_id}/audio")
    async def audio_websocket(websocket: WebSocket, session_id: str):
        """WebSocket endpoint for real-time audio input."""
        await websocket.accept()
        
        try:
            session = session_manager.get_session(session_id)
            logger.info(f"Audio WebSocket connected for session: {session_id}")
            
            while True:
                # Receive audio data
                audio_data = await websocket.receive_bytes()
                
                # Process audio
                await session.process_audio(audio_data)
                
        except WebSocketDisconnect:
            logger.info(f"Audio WebSocket disconnected for session: {session_id}")
        except Exception as e:
            logger.error(f"Audio WebSocket error: {e}")
            await websocket.close(code=1011, reason=str(e))
    
    return router


def create_system_router() -> APIRouter:
    """Create system/health check router."""
    router = APIRouter(tags=["system"])
    
    @router.get("/health")
    async def health_check():
        """Health check endpoint."""
        return {
            "status": "healthy",
            "service": "heallink-avatar-engine",
            "version": "2.0.0",
            "active_sessions": len(session_manager.sessions) if session_manager else 0
        }
    
    @router.get("/metrics")
    async def system_metrics():
        """Get system-wide metrics."""
        if not session_manager:
            return {"error": "Session manager not initialized"}
        
        total_sessions = len(session_manager.sessions)
        active_sessions = sum(1 for s in session_manager.sessions.values() if s.state.is_active)
        streaming_sessions = sum(1 for s in session_manager.sessions.values() if s.state.is_streaming)
        
        return {
            "total_sessions": total_sessions,
            "active_sessions": active_sessions,
            "streaming_sessions": streaming_sessions,
            "max_sessions": session_manager.max_sessions,
            "system_load": active_sessions / session_manager.max_sessions if session_manager.max_sessions > 0 else 0
        }
    
    return router