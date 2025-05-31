"""
HealLink Avatar Engine - Custom LiveKit Avatar Plugin

A real-time 3D avatar rendering system with lip syncing and facial expressions
for LiveKit voice agents.
"""

__version__ = "0.1.0"
__author__ = "HealLink Team"
__email__ = "dev@heallink.com"

from .plugin.avatar_session import AvatarSession
from .config.settings import AvatarConfig

__all__ = ["AvatarSession", "AvatarConfig"]