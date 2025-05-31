"""
WebRTC Streaming Module.

This module provides real-time video and audio streaming capabilities
for the avatar engine using WebRTC protocols.
"""

from .webrtc_streamer import WebRTCStreamer
from .video_encoder import VideoEncoder
from .audio_encoder import AudioEncoder

__all__ = ["WebRTCStreamer", "VideoEncoder", "AudioEncoder"]