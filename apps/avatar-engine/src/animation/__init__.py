"""
Facial Animation Module.

This module provides facial expression and animation capabilities for 3D avatars
using FACS (Facial Action Coding System) and emotion mapping.
"""

from .facial_animation import FacialAnimationEngine
from .emotion_mapper import EmotionMapper
from .facs_controller import FACSController

__all__ = ["FacialAnimationEngine", "EmotionMapper", "FACSController"]