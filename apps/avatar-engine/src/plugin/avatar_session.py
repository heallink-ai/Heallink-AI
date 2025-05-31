"""
AvatarSession - Core LiveKit Avatar Integration

This module provides the main AvatarSession class that integrates with LiveKit
agents to provide real-time 3D avatar rendering with lip syncing and facial expressions.
"""

import asyncio
from typing import Dict, Optional, Any, Callable
from dataclasses import dataclass
from pathlib import Path

from loguru import logger

# Optional LiveKit imports for when LiveKit is available
try:
    from livekit import Room, RemoteAudioTrack, LocalVideoTrack, LocalAudioTrack
    from livekit.agents import AgentSession
    from livekit.agents.job import JobContext
    LIVEKIT_AVAILABLE = True
except ImportError:
    # Create mock classes for standalone mode
    Room = None
    RemoteAudioTrack = None
    LocalVideoTrack = None
    LocalAudioTrack = None
    AgentSession = None
    JobContext = None
    LIVEKIT_AVAILABLE = False
    logger.warning("LiveKit not available - running in standalone mode")

from ..config.settings import AvatarConfig
from ..renderer.avatar_renderer import AvatarRenderer
from ..lipsync.lip_sync_engine import LipSyncEngine
from ..animation.facial_animation import FacialAnimationEngine
from ..streaming.webrtc_streamer import WebRTCStreamer


@dataclass
class AvatarState:
    """Current state of the avatar."""
    is_speaking: bool = False
    current_emotion: str = "neutral"
    emotion_intensity: float = 0.5
    head_position: tuple = (0.0, 0.0, 0.0)
    eye_direction: tuple = (0.0, 0.0)
    mouth_openness: float = 0.0


class AvatarSession:
    """
    Main avatar session class for LiveKit integration.
    
    This class manages the avatar rendering pipeline, integrating lip syncing,
    facial animation, and real-time video streaming.
    """
    
    def __init__(
        self,
        avatar_id: str,
        config: Optional[AvatarConfig] = None,
        **kwargs
    ):
        """
        Initialize the avatar session.
        
        Args:
            avatar_id: Unique identifier for the avatar model
            config: Avatar engine configuration
            **kwargs: Additional configuration options
        """
        self.avatar_id = avatar_id
        self.config = config or AvatarConfig()
        self.session_id: Optional[str] = None
        self.room: Optional[Room] = None
        self.agent_session: Optional[AgentSession] = None
        
        # Avatar state
        self.state = AvatarState()
        self.is_active = False
        self.is_streaming = False
        
        # Component instances
        self.renderer: Optional[AvatarRenderer] = None
        self.lip_sync: Optional[LipSyncEngine] = None
        self.facial_animation: Optional[FacialAnimationEngine] = None
        self.streamer: Optional[WebRTCStreamer] = None
        
        # Audio processing
        self.audio_buffer = asyncio.Queue(maxsize=1000)
        self.video_track: Optional[LocalVideoTrack] = None
        self.audio_track: Optional[LocalAudioTrack] = None
        
        # Event callbacks
        self.on_speaking_started: Optional[Callable] = kwargs.get("on_speaking_started")
        self.on_speaking_stopped: Optional[Callable] = kwargs.get("on_speaking_stopped")
        self.on_emotion_changed: Optional[Callable] = kwargs.get("on_emotion_changed")
        
        # Performance metrics
        self.metrics = {
            "frames_rendered": 0,
            "audio_samples_processed": 0,
            "avg_render_time_ms": 0.0,
            "avg_lip_sync_latency_ms": 0.0
        }
        
        logger.info(f"AvatarSession initialized for avatar: {avatar_id}")
    
    async def start(
        self,
        agent_session: Optional[Any] = None,
        room: Optional[Any] = None,
        session_id: Optional[str] = None
    ) -> None:
        """
        Start the avatar session.
        
        Args:
            agent_session: LiveKit agent session (optional in standalone mode)
            room: LiveKit room instance (optional in standalone mode)
            session_id: Optional session identifier
        """
        try:
            self.agent_session = agent_session
            self.room = room
            self.session_id = session_id or f"avatar_{self.avatar_id}_{id(self)}"
            
            if not LIVEKIT_AVAILABLE:
                logger.info(f"Starting avatar session in standalone mode: {self.session_id}")
            else:
                logger.info(f"Starting avatar session with LiveKit: {self.session_id}")
            
            # Initialize components
            await self._initialize_components()
            
            # Setup audio processing pipeline
            await self._setup_audio_pipeline()
            
            # Start video streaming (standalone mode compatible)
            await self._start_video_streaming()
            
            # Subscribe to agent audio output (only if LiveKit available)
            if LIVEKIT_AVAILABLE and agent_session:
                await self._subscribe_to_agent_audio()
            
            self.is_active = True
            logger.info(f"Avatar session started successfully: {self.session_id}")
            
        except Exception as e:
            logger.error(f"Failed to start avatar session: {e}")
            await self.stop()
            raise
    
    async def stop(self) -> None:
        """Stop the avatar session and cleanup resources."""
        logger.info(f"Stopping avatar session: {self.session_id}")
        
        self.is_active = False
        self.is_streaming = False
        
        # Stop streaming
        if self.streamer:
            await self.streamer.stop()
        
        # Cleanup tracks
        if self.video_track:
            await self.video_track.stop()
        if self.audio_track:
            await self.audio_track.stop()
        
        # Cleanup components
        if self.renderer:
            await self.renderer.cleanup()
        if self.lip_sync:
            await self.lip_sync.cleanup()
        if self.facial_animation:
            await self.facial_animation.cleanup()
        
        logger.info(f"Avatar session stopped: {self.session_id}")
    
    async def update_emotion(self, emotion: str, intensity: float = 0.5) -> None:
        """
        Update avatar facial expression.
        
        Args:
            emotion: Emotion name (happy, sad, angry, surprised, etc.)
            intensity: Emotion intensity (0.0 to 1.0)
        """
        if not self.is_active or not self.facial_animation:
            return
        
        self.state.current_emotion = emotion
        self.state.emotion_intensity = max(0.0, min(1.0, intensity))
        
        await self.facial_animation.set_emotion(emotion, intensity)
        
        if self.on_emotion_changed:
            await self.on_emotion_changed(emotion, intensity)
        
        logger.debug(f"Avatar emotion updated: {emotion} ({intensity})")
    
    async def set_background(self, background_id: str) -> None:
        """
        Change avatar background.
        
        Args:
            background_id: Background scene identifier
        """
        if not self.is_active or not self.renderer:
            return
        
        await self.renderer.set_background(background_id)
        logger.debug(f"Avatar background changed to: {background_id}")
    
    async def _initialize_components(self) -> None:
        """Initialize all avatar components."""
        logger.debug("Initializing avatar components")
        
        # Initialize renderer
        self.renderer = AvatarRenderer(
            avatar_id=self.avatar_id,
            config=self.config
        )
        await self.renderer.initialize()
        
        # Initialize lip sync engine
        self.lip_sync = LipSyncEngine(
            model=self.config.lipsync.model,
            config=self.config
        )
        await self.lip_sync.initialize()
        
        # Initialize facial animation engine
        self.facial_animation = FacialAnimationEngine(
            avatar_id=self.avatar_id,
            config=self.config
        )
        await self.facial_animation.initialize()
        
        # Initialize WebRTC streamer
        self.streamer = WebRTCStreamer(
            config=self.config
        )
        await self.streamer.initialize()
        
        logger.debug("Avatar components initialized successfully")
    
    async def _setup_audio_pipeline(self) -> None:
        """Setup audio processing pipeline."""
        logger.debug("Setting up audio pipeline")
        
        # Start audio processing task
        asyncio.create_task(self._process_audio_loop())
        
        logger.debug("Audio pipeline setup complete")
    
    async def _start_video_streaming(self) -> None:
        """Start video streaming to room."""
        logger.debug("Starting video streaming")
        
        # Create video track
        self.video_track = LocalVideoTrack.create_video_track()
        
        # Start rendering loop
        asyncio.create_task(self._render_loop())
        
        # Publish video track to room
        if self.room:
            await self.room.local_participant.publish_track(
                self.video_track,
                options={
                    "name": f"avatar_{self.avatar_id}",
                    "source": "camera"
                }
            )
        
        self.is_streaming = True
        logger.debug("Video streaming started")
    
    async def _subscribe_to_agent_audio(self) -> None:
        """Subscribe to agent audio output for lip syncing."""
        if not self.agent_session:
            return
        
        logger.debug("Subscribing to agent audio")
        
        # TODO: Implement audio subscription
        # This would typically involve hooking into the agent's TTS output
        # For now, we'll create a placeholder
        
        logger.debug("Agent audio subscription setup complete")
    
    async def _process_audio_loop(self) -> None:
        """Main audio processing loop."""
        logger.debug("Starting audio processing loop")
        
        while self.is_active:
            try:
                # Get audio data from buffer
                if not self.audio_buffer.empty():
                    audio_data = await self.audio_buffer.get()
                    
                    # Process audio for lip syncing
                    if self.lip_sync:
                        lip_sync_data = await self.lip_sync.process_audio(audio_data)
                        
                        # Update mouth animation
                        if self.renderer and lip_sync_data:
                            await self.renderer.update_mouth_animation(lip_sync_data)
                    
                    self.metrics["audio_samples_processed"] += 1
                
                await asyncio.sleep(0.01)  # 10ms processing interval
                
            except Exception as e:
                logger.error(f"Error in audio processing loop: {e}")
                await asyncio.sleep(0.1)
    
    async def _render_loop(self) -> None:
        """Main rendering loop."""
        logger.debug("Starting render loop")
        
        frame_interval = 1.0 / self.config.video.fps
        
        while self.is_streaming:
            try:
                start_time = asyncio.get_event_loop().time()
                
                # Render frame
                if self.renderer:
                    frame = await self.renderer.render_frame()
                    
                    # Send frame to video track
                    if self.video_track and frame is not None:
                        await self.video_track.capture_frame(frame)
                    
                    self.metrics["frames_rendered"] += 1
                
                # Calculate timing
                render_time = asyncio.get_event_loop().time() - start_time
                self.metrics["avg_render_time_ms"] = (
                    self.metrics["avg_render_time_ms"] * 0.9 + render_time * 1000 * 0.1
                )
                
                # Maintain target framerate
                sleep_time = max(0, frame_interval - render_time)
                await asyncio.sleep(sleep_time)
                
            except Exception as e:
                logger.error(f"Error in render loop: {e}")
                await asyncio.sleep(frame_interval)
    
    async def process_audio(self, audio_data: bytes) -> None:
        """
        Process incoming audio data.
        
        Args:
            audio_data: Raw audio bytes
        """
        if not self.is_active:
            return
        
        try:
            # Add to processing queue
            if not self.audio_buffer.full():
                await self.audio_buffer.put(audio_data)
            
            # Update speaking state
            if not self.state.is_speaking:
                self.state.is_speaking = True
                if self.on_speaking_started:
                    await self.on_speaking_started()
        
        except Exception as e:
            logger.error(f"Error processing audio: {e}")
    
    def get_metrics(self) -> Dict[str, Any]:
        """
        Get performance metrics.
        
        Returns:
            Dict containing performance metrics
        """
        return {
            **self.metrics,
            "is_active": self.is_active,
            "is_streaming": self.is_streaming,
            "avatar_id": self.avatar_id,
            "session_id": self.session_id,
            "current_emotion": self.state.current_emotion,
            "is_speaking": self.state.is_speaking
        }
    
    def __repr__(self) -> str:
        """String representation of avatar session."""
        return (
            f"AvatarSession(avatar_id='{self.avatar_id}', "
            f"session_id='{self.session_id}', "
            f"is_active={self.is_active})"
        )