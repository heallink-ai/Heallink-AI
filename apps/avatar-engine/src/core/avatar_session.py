"""
Avatar Session Management
Orchestrates the complete avatar pipeline: lip-sync, emotion control, and streaming.
"""

import asyncio
import time
from pathlib import Path
from typing import Dict, Any, Optional, Callable
from dataclasses import dataclass, field

from loguru import logger

from .config import AvatarConfig
from ..musetalk.lip_sync_engine import MuseTalkLipSyncEngine
from ..streaming.livekit_streamer import LiveKitStreamer


@dataclass
class AvatarState:
    """Current state of the avatar."""
    is_active: bool = False
    is_streaming: bool = False
    current_emotion: str = "neutral"
    emotion_intensity: float = 0.5
    avatar_image_path: Optional[Path] = None
    session_start_time: float = field(default_factory=time.time)


class AvatarSession:
    """
    Complete avatar session managing lip-sync, emotions, and streaming.
    
    This is the main orchestrator that coordinates all avatar components:
    - MuseTalk lip-sync engine
    - LiveKit video streaming
    - Emotion and expression control
    - Performance monitoring
    """
    
    def __init__(
        self,
        session_id: str,
        avatar_image_path: Path,
        config: Optional[AvatarConfig] = None
    ):
        """Initialize avatar session."""
        self.session_id = session_id
        self.config = config or AvatarConfig()
        
        # Session state
        self.state = AvatarState(avatar_image_path=avatar_image_path)
        
        # Core components
        self.lip_sync_engine = MuseTalkLipSyncEngine(self.config)
        self.streamer = LiveKitStreamer(self.config)
        
        # Audio processing
        self.audio_queue = asyncio.Queue(maxsize=100)
        self.processing_task: Optional[asyncio.Task] = None
        
        # Performance tracking
        self.metrics = {
            "session_start_time": time.time(),
            "frames_generated": 0,
            "audio_chunks_processed": 0,
            "errors_count": 0,
        }
        
        # Event callbacks
        self.on_frame_generated: Optional[Callable] = None
        self.on_error: Optional[Callable] = None
        
        logger.info(f"AvatarSession created: {session_id}")
    
    async def initialize(self) -> None:
        """Initialize all session components."""
        try:
            logger.info(f"Initializing avatar session: {self.session_id}")
            
            # Initialize lip-sync engine
            await self.lip_sync_engine.initialize()
            
            # Set avatar image
            if self.state.avatar_image_path:
                await self.lip_sync_engine.set_avatar_image(self.state.avatar_image_path)
            
            self.state.is_active = True
            logger.info(f"Avatar session initialized: {self.session_id}")
            
        except Exception as e:
            logger.error(f"Failed to initialize avatar session: {e}")
            raise
    
    async def start_livekit_streaming(
        self,
        livekit_url: str,
        livekit_token: str,
        participant_identity: str = "heallink-avatar"
    ) -> None:
        """Start LiveKit streaming and audio processing."""
        try:
            logger.info(f"Starting LiveKit streaming for session: {self.session_id}")
            
            # Connect to LiveKit room
            await self.streamer.connect_to_room(
                livekit_url, 
                livekit_token,
                participant_identity
            )
            
            # Start streaming
            await self.streamer.start_streaming()
            
            # Start audio processing loop
            self.processing_task = asyncio.create_task(self._audio_processing_loop())
            
            self.state.is_streaming = True
            logger.info(f"LiveKit streaming started for session: {self.session_id}")
            
        except Exception as e:
            logger.error(f"Failed to start LiveKit streaming: {e}")
            raise
    
    async def _audio_processing_loop(self) -> None:
        """Main audio processing loop for real-time lip-sync."""
        logger.info("Starting audio processing loop")
        
        while self.state.is_active and self.state.is_streaming:
            try:
                # Get audio chunk from queue (with timeout)
                try:
                    audio_data = await asyncio.wait_for(
                        self.audio_queue.get(), 
                        timeout=0.1
                    )
                except asyncio.TimeoutError:
                    continue
                
                # Process audio and generate lip-synced frame
                frame = await self.lip_sync_engine.process_audio_chunk(audio_data)
                
                if frame is not None:
                    # Stream frame to LiveKit
                    success = await self.streamer.stream_frame(frame)
                    
                    if success:
                        self.metrics["frames_generated"] += 1
                        
                        # Call frame callback if provided
                        if self.on_frame_generated:
                            await self.on_frame_generated(frame)
                    
                    logger.debug(f"Processed audio chunk, frame streamed: {success}")
                
                self.metrics["audio_chunks_processed"] += 1
                
            except Exception as e:
                logger.error(f"Error in audio processing loop: {e}")
                self.metrics["errors_count"] += 1
                
                # Call error callback if provided
                if self.on_error:
                    await self.on_error(e)
                
                # Small delay before continuing
                await asyncio.sleep(0.01)
        
        logger.info("Audio processing loop stopped")
    
    async def process_audio(self, audio_data: bytes) -> None:
        """
        Add audio data to processing queue.
        
        Args:
            audio_data: Raw audio bytes (16kHz, 16-bit)
        """
        if not self.state.is_active:
            return
        
        try:
            # Add to queue (non-blocking)
            if not self.audio_queue.full():
                await self.audio_queue.put(audio_data)
            else:
                logger.warning("Audio queue full, dropping audio chunk")
        
        except Exception as e:
            logger.error(f"Failed to queue audio data: {e}")
    
    async def set_emotion(self, emotion: str, intensity: float = 0.5) -> None:
        """
        Set avatar facial expression/emotion.
        
        Args:
            emotion: Emotion name (happy, sad, surprised, etc.)
            intensity: Emotion intensity (0.0 to 1.0)
        """
        try:
            # Validate emotion intensity
            intensity = max(0.0, min(1.0, intensity))
            
            # Update state
            self.state.current_emotion = emotion
            self.state.emotion_intensity = intensity
            
            # TODO: Implement emotion blending in MuseTalk engine
            # For now, this is stored in state and could affect future processing
            
            logger.info(f"Avatar emotion set: {emotion} ({intensity})")
            
        except Exception as e:
            logger.error(f"Failed to set emotion: {e}")
    
    async def update_avatar_image(self, image_path: Path) -> None:
        """
        Update the avatar image.
        
        Args:
            image_path: Path to new avatar image
        """
        try:
            logger.info(f"Updating avatar image: {image_path}")
            
            # Update lip-sync engine
            await self.lip_sync_engine.set_avatar_image(image_path)
            
            # Update state
            self.state.avatar_image_path = image_path
            
            logger.info("Avatar image updated successfully")
            
        except Exception as e:
            logger.error(f"Failed to update avatar image: {e}")
            raise
    
    async def stop_streaming(self) -> None:
        """Stop LiveKit streaming but keep session active."""
        if not self.state.is_streaming:
            return
        
        logger.info(f"Stopping streaming for session: {self.session_id}")
        
        # Stop processing task
        if self.processing_task:
            self.processing_task.cancel()
            try:
                await self.processing_task
            except asyncio.CancelledError:
                pass
            self.processing_task = None
        
        # Stop streamer
        await self.streamer.stop_streaming()
        await self.streamer.disconnect()
        
        self.state.is_streaming = False
        logger.info(f"Streaming stopped for session: {self.session_id}")
    
    async def stop(self) -> None:
        """Stop the complete avatar session."""
        logger.info(f"Stopping avatar session: {self.session_id}")
        
        # Stop streaming first
        await self.stop_streaming()
        
        # Cleanup components
        await self.lip_sync_engine.cleanup()
        
        # Update state
        self.state.is_active = False
        
        # Calculate session stats
        session_duration = time.time() - self.state.session_start_time
        
        logger.info(
            f"Avatar session stopped: {self.session_id}. "
            f"Duration: {session_duration:.2f}s, "
            f"Frames: {self.metrics['frames_generated']}, "
            f"Audio chunks: {self.metrics['audio_chunks_processed']}"
        )
    
    def get_session_metrics(self) -> Dict[str, Any]:
        """Get comprehensive session metrics."""
        current_time = time.time()
        session_duration = current_time - self.metrics["session_start_time"]
        
        # Base metrics
        metrics = {
            "session_id": self.session_id,
            "is_active": self.state.is_active,
            "is_streaming": self.state.is_streaming,
            "current_emotion": self.state.current_emotion,
            "emotion_intensity": self.state.emotion_intensity,
            "session_duration_s": session_duration,
            "frames_generated": self.metrics["frames_generated"],
            "audio_chunks_processed": self.metrics["audio_chunks_processed"],
            "errors_count": self.metrics["errors_count"],
        }
        
        # Calculate rates
        if session_duration > 0:
            metrics.update({
                "avg_fps": self.metrics["frames_generated"] / session_duration,
                "audio_processing_rate": self.metrics["audio_chunks_processed"] / session_duration,
            })
        
        # Add component metrics
        if self.lip_sync_engine.is_initialized:
            metrics["lip_sync"] = self.lip_sync_engine.get_performance_metrics()
        
        if self.streamer.is_connected:
            metrics["streaming"] = self.streamer.get_streaming_metrics()
        
        return metrics
    
    def get_session_info(self) -> Dict[str, Any]:
        """Get basic session information."""
        return {
            "session_id": self.session_id,
            "is_active": self.state.is_active,
            "is_streaming": self.state.is_streaming,
            "current_emotion": self.state.current_emotion,
            "avatar_image": str(self.state.avatar_image_path) if self.state.avatar_image_path else None,
            "session_start_time": self.state.session_start_time,
        }