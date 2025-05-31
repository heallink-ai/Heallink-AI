"""
3D Avatar Rendering Module.

This module provides 3D avatar rendering capabilities with real-time animation
support for lip syncing and facial expressions.
"""

from .avatar_renderer import AvatarRenderer
from .scene_manager import SceneManager
from .material_manager import MaterialManager

__all__ = ["AvatarRenderer", "SceneManager", "MaterialManager"]