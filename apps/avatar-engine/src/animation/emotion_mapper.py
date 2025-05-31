"""
Emotion Mapper - Emotion to Animation Mapping

This module provides mapping between high-level emotions and
specific facial animation parameters.
"""

from typing import Dict, List, Optional, Any
from enum import Enum
from loguru import logger


class EmotionIntensity(Enum):
    """Emotion intensity levels."""
    SUBTLE = 0.3
    MODERATE = 0.6
    STRONG = 0.9
    EXTREME = 1.0


class EmotionMapper:
    """Maps emotions to facial animation parameters."""
    
    def __init__(self):
        self.emotion_mappings = self._initialize_mappings()
        logger.debug("EmotionMapper initialized")
    
    def _initialize_mappings(self) -> Dict[str, Dict[str, float]]:
        """Initialize emotion to blend shape mappings."""
        return {
            "happy": {
                "mouth_smile": 0.8,
                "cheek_raise": 0.6,
                "eye_squint": 0.3
            },
            "sad": {
                "mouth_frown": 0.7,
                "eyebrow_down": 0.5,
                "eye_droop": 0.4
            },
            "angry": {
                "eyebrow_down": 0.8,
                "mouth_tighten": 0.6,
                "eye_narrow": 0.7
            },
            "surprised": {
                "eyebrow_up": 0.9,
                "eye_wide": 0.8,
                "mouth_open": 0.6
            },
            "fear": {
                "eyebrow_up": 0.7,
                "eye_wide": 0.9,
                "mouth_open": 0.4
            }
        }
    
    def map_emotion(self, emotion: str, intensity: float = 0.5) -> Dict[str, float]:
        """Map emotion to blend shape weights."""
        base_mapping = self.emotion_mappings.get(emotion.lower(), {})
        
        # Scale by intensity
        return {
            shape: weight * intensity
            for shape, weight in base_mapping.items()
        }
    
    def blend_emotions(self, emotions: Dict[str, float]) -> Dict[str, float]:
        """Blend multiple emotions with weights."""
        result = {}
        
        for emotion, emotion_weight in emotions.items():
            emotion_mapping = self.map_emotion(emotion, emotion_weight)
            
            for shape, weight in emotion_mapping.items():
                if shape not in result:
                    result[shape] = 0.0
                result[shape] += weight
        
        # Clamp values to valid range
        return {shape: min(1.0, weight) for shape, weight in result.items()}