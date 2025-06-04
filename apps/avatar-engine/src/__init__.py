"""
HealLink Avatar Engine v2.0
Real-time 2D Avatar Lip-sync Engine powered by MuseTalk
"""

__version__ = "2.0.0"
__author__ = "HealLink Team"
__email__ = "dev@heallink.com"

from .core.avatar_session import AvatarSession
from .core.config import AvatarConfig
from .musetalk.lip_sync_engine import MuseTalkLipSyncEngine
from .streaming.livekit_streamer import LiveKitStreamer

__all__ = [
    "AvatarSession",
    "AvatarConfig", 
    "MuseTalkLipSyncEngine",
    "LiveKitStreamer",
]