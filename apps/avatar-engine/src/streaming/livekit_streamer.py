"""
LiveKit Video Streaming Component
Handles real-time video streaming of lip-synced avatar frames to LiveKit rooms.
"""

import asyncio
import time
from typing import Optional, Dict, Any

import cv2
import numpy as np
from loguru import logger
from livekit import rtc

from ..core.config import AvatarConfig


class LiveKitStreamer:
    """
    Streams avatar video frames to LiveKit rooms in real-time.
    
    Features:
    - Real-time video frame streaming
    - Automatic frame rate control
    - Quality optimization
    - Connection management
    """
    
    def __init__(self, config: AvatarConfig):
        """Initialize the LiveKit streamer."""
        self.config = config
        self.is_streaming = False
        self.is_connected = False
        
        # LiveKit components
        self.room: Optional[rtc.Room] = None
        self.video_source: Optional[rtc.VideoSource] = None
        self.video_track: Optional[rtc.LocalVideoTrack] = None
        
        # Streaming state
        self.target_fps = config.video_fps
        self.frame_interval = 1.0 / self.target_fps
        self.last_frame_time = 0.0
        
        # Performance tracking
        self.frames_streamed = 0
        self.stream_start_time = 0.0
        self.frame_times = []
        
        logger.info(f"LiveKitStreamer initialized for {self.target_fps}fps streaming")
    
    async def connect_to_room(
        self, 
        livekit_url: str, 
        livekit_token: str,
        participant_identity: str = "heallink-avatar"
    ) -> None:
        """Connect to a LiveKit room and setup video publishing."""
        try:
            logger.info(f"Connecting to LiveKit room: {livekit_url}")
            
            # Add a small delay to allow the room to be established
            await asyncio.sleep(2)
            
            # Create room instance
            self.room = rtc.Room()
            
            # Setup room event handlers
            self._setup_room_events()
            
            # Connect to the room with retries
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    logger.info(f"Connection attempt {attempt + 1}/{max_retries}")
                    await self.room.connect(livekit_url, livekit_token)
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise e
                    logger.warning(f"Connection attempt {attempt + 1} failed: {e}, retrying in 3 seconds...")
                    await asyncio.sleep(3)
            
            # Create video source and track
            await self._setup_video_publishing()
            
            self.is_connected = True
            logger.info(f"Connected to LiveKit room as {participant_identity}")
            
        except Exception as e:
            logger.error(f"Failed to connect to LiveKit room: {e}")
            await self.disconnect()
            raise
    
    async def _setup_video_publishing(self) -> None:
        """Setup video source and track for publishing."""
        try:
            # Create video source with avatar dimensions
            width, height = getattr(self.config, 'avatar_image_size', (512, 512))
            self.video_source = rtc.VideoSource(width, height)
            
            # Create local video track
            self.video_track = rtc.LocalVideoTrack.create_video_track(
                "heallink-avatar-video",
                self.video_source
            )
            
            # Publish the video track
            options = rtc.TrackPublishOptions()
            options.source = rtc.TrackSource.SOURCE_CAMERA
            options.video_codec = rtc.VideoCodec.H264
            
            await self.room.local_participant.publish_track(
                self.video_track,
                options
            )
            
            logger.info("Video track published successfully")
            
        except Exception as e:
            logger.error(f"Failed to setup video publishing: {e}")
            raise
    
    def _setup_room_events(self) -> None:
        """Setup LiveKit room event handlers."""
        
        @self.room.on("connected")
        def on_connected():
            logger.info("LiveKit room connected")
        
        @self.room.on("disconnected") 
        def on_disconnected():
            logger.info("LiveKit room disconnected")
            self.is_connected = False
            self.is_streaming = False
        
        @self.room.on("connection_state_changed")
        def on_connection_state_changed(state: rtc.ConnectionState):
            logger.info(f"LiveKit connection state: {state}")
            
            if state == rtc.ConnectionState.FAILED:
                self.is_connected = False
                self.is_streaming = False
                logger.error("LiveKit connection failed")
    
    async def start_streaming(self) -> None:
        """Start streaming avatar frames."""
        if not self.is_connected:
            raise RuntimeError("Not connected to LiveKit room")
        
        if self.is_streaming:
            logger.warning("Already streaming")
            return
        
        self.is_streaming = True
        self.stream_start_time = time.time()
        self.frames_streamed = 0
        
        logger.info("Started avatar video streaming")
    
    async def stream_frame(self, frame: np.ndarray) -> bool:
        """
        Stream a single video frame.
        
        Args:
            frame: Video frame as numpy array (BGR format)
            
        Returns:
            True if frame was streamed successfully, False otherwise
        """
        if not self.is_streaming or not self.video_source:
            return False
        
        try:
            current_time = time.time()
            
            # Frame rate control
            if current_time - self.last_frame_time < self.frame_interval:
                return True  # Skip frame to maintain target FPS
            
            # Convert BGR to RGB for LiveKit
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Ensure frame is the correct size
            height, width = frame_rgb.shape[:2]
            target_width, target_height = getattr(self.config, 'avatar_image_size', (512, 512))
            
            if width != target_width or height != target_height:
                frame_rgb = cv2.resize(frame_rgb, (target_width, target_height))
            
            # Create VideoFrame
            video_frame = rtc.VideoFrame(
                width=target_width,
                height=target_height,
                type=rtc.VideoBufferType.RGB24,
                data=frame_rgb.tobytes()
            )
            
            # Capture frame to video source
            self.video_source.capture_frame(video_frame)
            
            # Update metrics
            self.frames_streamed += 1
            self.last_frame_time = current_time
            
            # Track frame timing
            frame_time = current_time - self.last_frame_time if self.last_frame_time > 0 else 0
            self.frame_times.append(frame_time)
            
            # Keep only last 100 frame times
            if len(self.frame_times) > 100:
                self.frame_times.pop(0)
            
            logger.debug(f"Streamed frame {self.frames_streamed}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to stream frame: {e}")
            return False
    
    async def stop_streaming(self) -> None:
        """Stop streaming avatar frames."""
        if not self.is_streaming:
            return
        
        self.is_streaming = False
        
        # Calculate streaming stats
        total_time = time.time() - self.stream_start_time
        avg_fps = self.frames_streamed / total_time if total_time > 0 else 0
        
        logger.info(
            f"Stopped streaming. "
            f"Frames: {self.frames_streamed}, "
            f"Duration: {total_time:.2f}s, "
            f"Avg FPS: {avg_fps:.2f}"
        )
    
    async def disconnect(self) -> None:
        """Disconnect from LiveKit room and cleanup resources."""
        logger.info("Disconnecting from LiveKit room...")
        
        # Stop streaming
        await self.stop_streaming()
        
        # Cleanup tracks
        if self.video_track:
            await self.video_track.stop()
            self.video_track = None
        
        self.video_source = None
        
        # Disconnect room
        if self.room:
            await self.room.disconnect()
            self.room = None
        
        self.is_connected = False
        logger.info("Disconnected from LiveKit room")
    
    def get_streaming_metrics(self) -> Dict[str, Any]:
        """Get streaming performance metrics."""
        current_time = time.time()
        total_time = current_time - self.stream_start_time if self.stream_start_time > 0 else 0
        
        metrics = {
            "is_streaming": self.is_streaming,
            "is_connected": self.is_connected,
            "frames_streamed": self.frames_streamed,
            "target_fps": self.target_fps,
            "streaming_duration_s": total_time,
        }
        
        if total_time > 0:
            metrics["actual_fps"] = self.frames_streamed / total_time
        
        if self.frame_times:
            avg_frame_time = np.mean(self.frame_times)
            metrics.update({
                "avg_frame_time_ms": avg_frame_time * 1000,
                "avg_frame_rate": 1.0 / avg_frame_time if avg_frame_time > 0 else 0,
            })
        
        return metrics
    
    def is_ready_for_frame(self) -> bool:
        """Check if streamer is ready to accept a new frame."""
        if not self.is_streaming:
            return False
        
        current_time = time.time()
        return current_time - self.last_frame_time >= self.frame_interval