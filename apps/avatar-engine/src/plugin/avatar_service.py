"""
AvatarService - Standalone Avatar Engine Service

This module provides the standalone service that can run the avatar engine
independently of LiveKit for testing and development.
"""

import asyncio
from typing import Dict, List, Optional, Any
from pathlib import Path
import json
import uuid
from datetime import datetime

from aiohttp import web
from aiohttp.web_request import Request
from aiohttp.web_ws import WebSocketResponse
from loguru import logger
import aiofiles

from config.settings import AvatarConfig
from renderer.avatar_renderer import AvatarRenderer
from .avatar_session import AvatarSession


class AvatarService:
    """
    Standalone avatar service for development and testing.
    
    Provides REST API and WebSocket interface for avatar management.
    """
    
    def __init__(self, config: AvatarConfig):
        """
        Initialize the avatar service.
        
        Args:
            config: Avatar engine configuration
        """
        self.config = config
        self.app = web.Application()
        self.runner: Optional[web.AppRunner] = None
        self.site: Optional[web.TCPSite] = None
        
        # Active avatar sessions
        self.sessions: Dict[str, AvatarSession] = {}
        
        # Service state
        self.is_running = False
        self.start_time = datetime.now()
        
        # Setup routes
        self._setup_routes()
        
        logger.info("AvatarService initialized")
    
    async def start(self) -> None:
        """Start the avatar service."""
        try:
            logger.info(f"Starting Avatar Service on {self.config.host}:{self.config.port}")
            
            self.runner = web.AppRunner(self.app)
            await self.runner.setup()
            
            self.site = web.TCPSite(
                self.runner,
                self.config.host,
                self.config.port
            )
            await self.site.start()
            
            self.is_running = True
            logger.info(f"Avatar Service started successfully")
            
        except Exception as e:
            logger.error(f"Failed to start Avatar Service: {e}")
            raise
    
    async def stop(self) -> None:
        """Stop the avatar service."""
        logger.info("Stopping Avatar Service")
        
        self.is_running = False
        
        # Stop all active sessions
        for session_id, session in list(self.sessions.items()):
            await self._stop_session(session_id)
        
        # Stop web server
        if self.site:
            await self.site.stop()
        if self.runner:
            await self.runner.cleanup()
        
        logger.info("Avatar Service stopped")
    
    def _setup_routes(self) -> None:
        """Setup HTTP routes."""
        # Health check
        self.app.router.add_get("/health", self.health_check)
        
        # Service info
        self.app.router.add_get("/info", self.service_info)
        self.app.router.add_get("/metrics", self.get_metrics)
        
        # Avatar management
        self.app.router.add_post("/avatars", self.create_avatar_session)
        self.app.router.add_get("/avatars", self.list_avatar_sessions)
        self.app.router.add_get("/avatars/{session_id}", self.get_avatar_session)
        self.app.router.add_delete("/avatars/{session_id}", self.delete_avatar_session)
        
        # Avatar control
        self.app.router.add_post("/avatars/{session_id}/emotion", self.set_avatar_emotion)
        self.app.router.add_post("/avatars/{session_id}/background", self.set_avatar_background)
        self.app.router.add_post("/avatars/{session_id}/audio", self.process_avatar_audio)
        
        # WebSocket for real-time communication
        self.app.router.add_get("/ws/{session_id}", self.websocket_handler)
        
        # Static file serving for avatar assets
        self.app.router.add_static(
            "/assets/",
            path=self.config.assets_path,
            name="assets"
        )
    
    async def health_check(self, request: Request) -> web.Response:
        """Health check endpoint."""
        return web.json_response({
            "status": "healthy" if self.is_running else "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": (datetime.now() - self.start_time).total_seconds(),
            "active_sessions": len(self.sessions)
        })
    
    async def service_info(self, request: Request) -> web.Response:
        """Service information endpoint."""
        return web.json_response({
            "name": "HealLink Avatar Engine",
            "version": self.config.version,
            "host": self.config.host,
            "port": self.config.port,
            "gpu_enabled": self.config.performance.gpu_enabled,
            "max_concurrent_avatars": self.config.performance.max_concurrent_avatars,
            "video_config": {
                "resolution": self.config.video.resolution,
                "fps": self.config.video.fps,
                "quality": self.config.video.quality
            },
            "lip_sync_model": self.config.lipsync.model
        })
    
    async def get_metrics(self, request: Request) -> web.Response:
        """Get service metrics."""
        total_metrics = {
            "service": {
                "uptime_seconds": (datetime.now() - self.start_time).total_seconds(),
                "active_sessions": len(self.sessions),
                "total_sessions_created": getattr(self, "_total_sessions", 0)
            },
            "sessions": {}
        }
        
        # Aggregate session metrics
        for session_id, session in self.sessions.items():
            total_metrics["sessions"][session_id] = session.get_metrics()
        
        return web.json_response(total_metrics)
    
    async def create_avatar_session(self, request: Request) -> web.Response:
        """Create a new avatar session."""
        try:
            data = await request.json()
            
            avatar_id = data.get("avatar_id", self.config.default_avatar_id)
            session_id = data.get("session_id", str(uuid.uuid4()))
            
            # Check if session already exists
            if session_id in self.sessions:
                return web.json_response(
                    {"error": f"Session {session_id} already exists"},
                    status=400
                )
            
            # Check max concurrent sessions
            if len(self.sessions) >= self.config.performance.max_concurrent_avatars:
                return web.json_response(
                    {"error": "Maximum concurrent avatars reached"},
                    status=429
                )
            
            # Create avatar session
            session = AvatarSession(
                avatar_id=avatar_id,
                config=self.config
            )
            
            # Start session in standalone mode (no LiveKit)
            await session._initialize_components()
            session.is_active = True
            session.session_id = session_id
            
            self.sessions[session_id] = session
            
            # Update metrics
            if not hasattr(self, "_total_sessions"):
                self._total_sessions = 0
            self._total_sessions += 1
            
            logger.info(f"Created avatar session: {session_id} (avatar: {avatar_id})")
            
            return web.json_response({
                "session_id": session_id,
                "avatar_id": avatar_id,
                "status": "created",
                "websocket_url": f"/ws/{session_id}"
            }, status=201)
            
        except Exception as e:
            logger.error(f"Failed to create avatar session: {e}")
            return web.json_response(
                {"error": f"Failed to create session: {str(e)}"},
                status=500
            )
    
    async def list_avatar_sessions(self, request: Request) -> web.Response:
        """List all active avatar sessions."""
        sessions_info = []
        
        for session_id, session in self.sessions.items():
            sessions_info.append({
                "session_id": session_id,
                "avatar_id": session.avatar_id,
                "is_active": session.is_active,
                "current_emotion": session.state.current_emotion,
                "is_speaking": session.state.is_speaking
            })
        
        return web.json_response({
            "sessions": sessions_info,
            "total": len(sessions_info)
        })
    
    async def get_avatar_session(self, request: Request) -> web.Response:
        """Get information about a specific avatar session."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        session = self.sessions[session_id]
        
        return web.json_response({
            "session_id": session_id,
            "avatar_id": session.avatar_id,
            "is_active": session.is_active,
            "state": {
                "current_emotion": session.state.current_emotion,
                "emotion_intensity": session.state.emotion_intensity,
                "is_speaking": session.state.is_speaking
            },
            "metrics": session.get_metrics()
        })
    
    async def delete_avatar_session(self, request: Request) -> web.Response:
        """Delete an avatar session."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        await self._stop_session(session_id)
        
        return web.json_response({
            "session_id": session_id,
            "status": "deleted"
        })
    
    async def set_avatar_emotion(self, request: Request) -> web.Response:
        """Set avatar emotion."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        try:
            data = await request.json()
            emotion = data.get("emotion", "neutral")
            intensity = data.get("intensity", 0.5)
            
            session = self.sessions[session_id]
            await session.update_emotion(emotion, intensity)
            
            return web.json_response({
                "session_id": session_id,
                "emotion": emotion,
                "intensity": intensity,
                "status": "updated"
            })
            
        except Exception as e:
            logger.error(f"Failed to set avatar emotion: {e}")
            return web.json_response(
                {"error": f"Failed to set emotion: {str(e)}"},
                status=500
            )
    
    async def set_avatar_background(self, request: Request) -> web.Response:
        """Set avatar background."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        try:
            data = await request.json()
            background_id = data.get("background_id", self.config.default_background)
            
            session = self.sessions[session_id]
            await session.set_background(background_id)
            
            return web.json_response({
                "session_id": session_id,
                "background_id": background_id,
                "status": "updated"
            })
            
        except Exception as e:
            logger.error(f"Failed to set avatar background: {e}")
            return web.json_response(
                {"error": f"Failed to set background: {str(e)}"},
                status=500
            )
    
    async def process_avatar_audio(self, request: Request) -> web.Response:
        """Process audio data for avatar."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        try:
            # Get audio data from request body
            audio_data = await request.read()
            
            session = self.sessions[session_id]
            await session.process_audio(audio_data)
            
            return web.json_response({
                "session_id": session_id,
                "audio_size": len(audio_data),
                "status": "processed"
            })
            
        except Exception as e:
            logger.error(f"Failed to process audio: {e}")
            return web.json_response(
                {"error": f"Failed to process audio: {str(e)}"},
                status=500
            )
    
    async def websocket_handler(self, request: Request) -> WebSocketResponse:
        """WebSocket handler for real-time communication."""
        session_id = request.match_info["session_id"]
        
        if session_id not in self.sessions:
            return web.json_response(
                {"error": f"Session {session_id} not found"},
                status=404
            )
        
        ws = web.WebSocketResponse()
        await ws.prepare(request)
        
        logger.info(f"WebSocket connected for session: {session_id}")
        
        try:
            session = self.sessions[session_id]
            
            # Send initial state
            await ws.send_str(json.dumps({
                "type": "state",
                "data": {
                    "session_id": session_id,
                    "avatar_id": session.avatar_id,
                    "state": {
                        "current_emotion": session.state.current_emotion,
                        "is_speaking": session.state.is_speaking
                    }
                }
            }))
            
            # Handle WebSocket messages
            async for msg in ws:
                if msg.type == web.MsgType.TEXT:
                    try:
                        data = json.loads(msg.data)
                        await self._handle_websocket_message(session_id, data, ws)
                    except json.JSONDecodeError:
                        await ws.send_str(json.dumps({
                            "type": "error",
                            "message": "Invalid JSON"
                        }))
                elif msg.type == web.MsgType.ERROR:
                    logger.error(f"WebSocket error: {ws.exception()}")
                    break
        
        except Exception as e:
            logger.error(f"WebSocket error for session {session_id}: {e}")
        finally:
            logger.info(f"WebSocket disconnected for session: {session_id}")
        
        return ws
    
    async def _handle_websocket_message(
        self,
        session_id: str,
        data: Dict[str, Any],
        ws: WebSocketResponse
    ) -> None:
        """Handle WebSocket message."""
        try:
            message_type = data.get("type")
            session = self.sessions[session_id]
            
            if message_type == "set_emotion":
                emotion = data.get("emotion", "neutral")
                intensity = data.get("intensity", 0.5)
                await session.update_emotion(emotion, intensity)
                
                await ws.send_str(json.dumps({
                    "type": "emotion_updated",
                    "data": {"emotion": emotion, "intensity": intensity}
                }))
            
            elif message_type == "set_background":
                background_id = data.get("background_id")
                await session.set_background(background_id)
                
                await ws.send_str(json.dumps({
                    "type": "background_updated",
                    "data": {"background_id": background_id}
                }))
            
            elif message_type == "get_metrics":
                metrics = session.get_metrics()
                await ws.send_str(json.dumps({
                    "type": "metrics",
                    "data": metrics
                }))
            
            else:
                await ws.send_str(json.dumps({
                    "type": "error",
                    "message": f"Unknown message type: {message_type}"
                }))
        
        except Exception as e:
            logger.error(f"Error handling WebSocket message: {e}")
            await ws.send_str(json.dumps({
                "type": "error",
                "message": str(e)
            }))
    
    async def _stop_session(self, session_id: str) -> None:
        """Stop and cleanup a session."""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            await session.stop()
            del self.sessions[session_id]
            logger.info(f"Stopped avatar session: {session_id}")