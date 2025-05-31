"""
FacialAnimationEngine - FACS-based Facial Expression System

This module provides real-time facial animation using the Facial Action Coding
System (FACS) for natural and expressive avatar animations.
"""

import asyncio
import time
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from enum import Enum

import numpy as np
from loguru import logger

from config.settings import AvatarConfig


class EmotionType(Enum):
    """Standard emotion types."""
    NEUTRAL = "neutral"
    HAPPY = "happy"
    SAD = "sad"
    ANGRY = "angry"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    CONTEMPT = "contempt"


@dataclass
class ActionUnit:
    """FACS Action Unit definition."""
    au_id: int
    name: str
    description: str
    muscle_group: str
    intensity_range: Tuple[float, float] = (0.0, 5.0)
    
    def __post_init__(self):
        """Validate action unit parameters."""
        if self.intensity_range[0] >= self.intensity_range[1]:
            raise ValueError("Invalid intensity range")


@dataclass
class ExpressionBlend:
    """Expression blend shape data."""
    name: str
    weight: float
    duration: float = 0.5
    easing: str = "ease_in_out"
    
    def __post_init__(self):
        """Validate expression parameters."""
        self.weight = max(0.0, min(1.0, self.weight))


class FACSDatabase:
    """Database of FACS Action Units and their blend shape mappings."""
    
    def __init__(self):
        self.action_units: Dict[int, ActionUnit] = {}
        self.emotion_mappings: Dict[EmotionType, Dict[int, float]] = {}
        self._initialize_action_units()
        self._initialize_emotion_mappings()
    
    def _initialize_action_units(self) -> None:
        """Initialize standard FACS Action Units."""
        # Upper face action units
        self.action_units[1] = ActionUnit(1, "Inner Brow Raiser", "Frontalis, medial", "eyebrow")
        self.action_units[2] = ActionUnit(2, "Outer Brow Raiser", "Frontalis, lateral", "eyebrow")
        self.action_units[4] = ActionUnit(4, "Brow Lowerer", "Depressor glabellae", "eyebrow")
        self.action_units[5] = ActionUnit(5, "Upper Lid Raiser", "Levator palpebrae", "eyelid")
        self.action_units[6] = ActionUnit(6, "Cheek Raiser", "Orbicularis oculi", "cheek")
        self.action_units[7] = ActionUnit(7, "Lid Tightener", "Orbicularis oculi", "eyelid")
        
        # Lower face action units
        self.action_units[9] = ActionUnit(9, "Nose Wrinkler", "Levator labii superioris", "nose")
        self.action_units[10] = ActionUnit(10, "Upper Lip Raiser", "Levator labii superioris", "lips")
        self.action_units[11] = ActionUnit(11, "Nasolabial Deepener", "Zygomaticus minor", "nasolabial")
        self.action_units[12] = ActionUnit(12, "Lip Corner Puller", "Zygomaticus major", "lips")
        self.action_units[13] = ActionUnit(13, "Sharp Lip Puller", "Levator anguli oris", "lips")
        self.action_units[14] = ActionUnit(14, "Dimpler", "Buccinator", "cheek")
        self.action_units[15] = ActionUnit(15, "Lip Corner Depressor", "Depressor anguli oris", "lips")
        self.action_units[16] = ActionUnit(16, "Lower Lip Depressor", "Depressor labii inferioris", "lips")
        self.action_units[17] = ActionUnit(17, "Chin Raiser", "Mentalis", "chin")
        self.action_units[18] = ActionUnit(18, "Lip Puckerer", "Incisivii labii", "lips")
        self.action_units[20] = ActionUnit(20, "Lip Stretcher", "Risorius", "lips")
        self.action_units[22] = ActionUnit(22, "Lip Funneler", "Orbicularis oris", "lips")
        self.action_units[23] = ActionUnit(23, "Lip Tightener", "Orbicularis oris", "lips")
        self.action_units[24] = ActionUnit(24, "Lip Pressor", "Orbicularis oris", "lips")
        self.action_units[25] = ActionUnit(25, "Lips Part", "Depressor labii", "lips")
        self.action_units[26] = ActionUnit(26, "Jaw Drop", "Masseter", "jaw")
        self.action_units[27] = ActionUnit(27, "Mouth Stretch", "Pterygoids", "mouth")
    
    def _initialize_emotion_mappings(self) -> None:
        """Initialize emotion to FACS AU mappings."""
        # Happy expression
        self.emotion_mappings[EmotionType.HAPPY] = {
            6: 3.0,   # Cheek Raiser
            12: 4.0,  # Lip Corner Puller
            25: 1.0   # Lips Part
        }
        
        # Sad expression
        self.emotion_mappings[EmotionType.SAD] = {
            1: 2.0,   # Inner Brow Raiser
            4: 1.5,   # Brow Lowerer
            15: 3.0,  # Lip Corner Depressor
            17: 2.0   # Chin Raiser
        }
        
        # Angry expression
        self.emotion_mappings[EmotionType.ANGRY] = {
            4: 4.0,   # Brow Lowerer
            5: 2.0,   # Upper Lid Raiser
            7: 3.0,   # Lid Tightener
            23: 2.0,  # Lip Tightener
            24: 2.0   # Lip Pressor
        }
        
        # Fear expression
        self.emotion_mappings[EmotionType.FEAR] = {
            1: 3.0,   # Inner Brow Raiser
            2: 2.0,   # Outer Brow Raiser
            4: 1.0,   # Brow Lowerer
            5: 4.0,   # Upper Lid Raiser
            20: 2.0,  # Lip Stretcher
            25: 2.0,  # Lips Part
            26: 1.0   # Jaw Drop
        }
        
        # Surprise expression
        self.emotion_mappings[EmotionType.SURPRISE] = {
            1: 4.0,   # Inner Brow Raiser
            2: 4.0,   # Outer Brow Raiser
            5: 4.0,   # Upper Lid Raiser
            26: 2.0   # Jaw Drop
        }
        
        # Disgust expression
        self.emotion_mappings[EmotionType.DISGUST] = {
            9: 3.0,   # Nose Wrinkler
            10: 2.0,  # Upper Lip Raiser
            16: 2.0,  # Lower Lip Depressor
            17: 1.0   # Chin Raiser
        }
        
        # Contempt expression (unilateral)
        self.emotion_mappings[EmotionType.CONTEMPT] = {
            12: 2.0,  # Lip Corner Puller (unilateral)
            14: 1.0   # Dimpler
        }
    
    def get_emotion_aus(self, emotion: EmotionType) -> Dict[int, float]:
        """Get Action Units for a given emotion."""
        return self.emotion_mappings.get(emotion, {})
    
    def blend_emotions(
        self,
        emotions: Dict[EmotionType, float]
    ) -> Dict[int, float]:
        """Blend multiple emotions with weights."""
        blended_aus: Dict[int, float] = {}
        
        for emotion, emotion_weight in emotions.items():
            if emotion in self.emotion_mappings:
                for au_id, au_intensity in self.emotion_mappings[emotion].items():
                    if au_id not in blended_aus:
                        blended_aus[au_id] = 0.0
                    blended_aus[au_id] += au_intensity * emotion_weight
        
        # Normalize intensities
        for au_id in blended_aus:
            blended_aus[au_id] = min(5.0, blended_aus[au_id])
        
        return blended_aus


class AnimationController:
    """Controls animation transitions and timing."""
    
    def __init__(self):
        self.active_animations: Dict[str, Dict[str, Any]] = {}
        self.current_weights: Dict[str, float] = {}
    
    def start_animation(
        self,
        animation_id: str,
        target_weights: Dict[str, float],
        duration: float = 0.5,
        easing: str = "ease_in_out"
    ) -> None:
        """Start a new animation."""
        self.active_animations[animation_id] = {
            "start_time": time.time(),
            "duration": duration,
            "start_weights": self.current_weights.copy(),
            "target_weights": target_weights,
            "easing": easing
        }
    
    def update_animations(self) -> Dict[str, float]:
        """Update all active animations and return current weights."""
        current_time = time.time()
        completed_animations = []
        
        for animation_id, animation in self.active_animations.items():
            start_time = animation["start_time"]
            duration = animation["duration"]
            elapsed = current_time - start_time
            
            if elapsed >= duration:
                # Animation completed
                self.current_weights.update(animation["target_weights"])
                completed_animations.append(animation_id)
            else:
                # Interpolate weights
                progress = elapsed / duration
                eased_progress = self._apply_easing(progress, animation["easing"])
                
                for blend_shape, target_weight in animation["target_weights"].items():
                    start_weight = animation["start_weights"].get(blend_shape, 0.0)
                    current_weight = start_weight + (target_weight - start_weight) * eased_progress
                    self.current_weights[blend_shape] = current_weight
        
        # Remove completed animations
        for animation_id in completed_animations:
            del self.active_animations[animation_id]
        
        return self.current_weights.copy()
    
    def _apply_easing(self, t: float, easing: str) -> float:
        """Apply easing function to animation progress."""
        if easing == "linear":
            return t
        elif easing == "ease_in":
            return t * t
        elif easing == "ease_out":
            return 1 - (1 - t) * (1 - t)
        elif easing == "ease_in_out":
            return 3 * t * t - 2 * t * t * t
        else:
            return t  # Default to linear


class FacialAnimationEngine:
    """
    Main facial animation engine using FACS and emotion mapping.
    """
    
    def __init__(self, avatar_id: str, config: AvatarConfig):
        """
        Initialize the facial animation engine.
        
        Args:
            avatar_id: Unique identifier for the avatar
            config: Avatar engine configuration
        """
        self.avatar_id = avatar_id
        self.config = config
        self.is_initialized = False
        
        # FACS database
        self.facs_db = FACSDatabase()
        
        # Animation controller
        self.animation_controller = AnimationController()
        
        # Current state
        self.current_emotion = EmotionType.NEUTRAL
        self.emotion_intensity = 0.5
        self.current_blend_shapes: Dict[str, float] = {}
        
        # Performance metrics
        self.frame_count = 0
        self.animation_updates = 0
        
        logger.info(f"FacialAnimationEngine initialized for avatar: {avatar_id}")
    
    async def initialize(self) -> None:
        """Initialize the facial animation engine."""
        try:
            logger.info("Initializing facial animation engine")
            
            # Load avatar-specific blend shape mappings
            await self._load_blend_shape_mappings()
            
            # Start animation update loop
            asyncio.create_task(self._animation_loop())
            
            self.is_initialized = True
            logger.info("Facial animation engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize facial animation engine: {e}")
            raise
    
    async def set_emotion(
        self,
        emotion: str,
        intensity: float,
        duration: float = 0.5
    ) -> None:
        """
        Set avatar facial expression to specified emotion.
        
        Args:
            emotion: Emotion name
            intensity: Emotion intensity (0.0 to 1.0)
            duration: Animation duration in seconds
        """
        if not self.is_initialized:
            return
        
        try:
            # Parse emotion type
            emotion_type = EmotionType(emotion.lower())
            
            # Clamp intensity
            intensity = max(0.0, min(1.0, intensity))
            
            # Get FACS Action Units for emotion
            emotion_aus = self.facs_db.get_emotion_aus(emotion_type)
            
            # Convert AUs to blend shapes
            target_blend_shapes = await self._aus_to_blend_shapes(emotion_aus, intensity)
            
            # Start animation
            animation_id = f"emotion_{emotion}_{time.time()}"
            self.animation_controller.start_animation(
                animation_id,
                target_blend_shapes,
                duration
            )
            
            # Update state
            self.current_emotion = emotion_type
            self.emotion_intensity = intensity
            
            logger.debug(f"Set emotion: {emotion} (intensity: {intensity})")
            
        except ValueError:
            logger.warning(f"Unknown emotion: {emotion}")
        except Exception as e:
            logger.error(f"Error setting emotion: {e}")
    
    async def blend_emotions(
        self,
        emotions: Dict[str, float],
        duration: float = 0.5
    ) -> None:
        """
        Blend multiple emotions with specified weights.
        
        Args:
            emotions: Dictionary mapping emotion names to weights
            duration: Animation duration in seconds
        """
        if not self.is_initialized:
            return
        
        try:
            # Parse emotion types
            emotion_weights = {}
            for emotion_name, weight in emotions.items():
                try:
                    emotion_type = EmotionType(emotion_name.lower())
                    emotion_weights[emotion_type] = max(0.0, min(1.0, weight))
                except ValueError:
                    logger.warning(f"Unknown emotion: {emotion_name}")
            
            # Blend emotions using FACS
            blended_aus = self.facs_db.blend_emotions(emotion_weights)
            
            # Convert to blend shapes
            target_blend_shapes = await self._aus_to_blend_shapes(blended_aus, 1.0)
            
            # Start animation
            animation_id = f"blend_{time.time()}"
            self.animation_controller.start_animation(
                animation_id,
                target_blend_shapes,
                duration
            )
            
            logger.debug(f"Blended emotions: {emotions}")
            
        except Exception as e:
            logger.error(f"Error blending emotions: {e}")
    
    async def set_custom_expression(
        self,
        blend_shapes: Dict[str, float],
        duration: float = 0.5
    ) -> None:
        """
        Set custom facial expression using direct blend shape weights.
        
        Args:
            blend_shapes: Dictionary of blend shape names to weights
            duration: Animation duration in seconds
        """
        if not self.is_initialized:
            return
        
        try:
            # Clamp weights
            clamped_shapes = {
                name: max(0.0, min(1.0, weight))
                for name, weight in blend_shapes.items()
            }
            
            # Start animation
            animation_id = f"custom_{time.time()}"
            self.animation_controller.start_animation(
                animation_id,
                clamped_shapes,
                duration
            )
            
            logger.debug(f"Set custom expression: {len(blend_shapes)} shapes")
            
        except Exception as e:
            logger.error(f"Error setting custom expression: {e}")
    
    def get_current_blend_shapes(self) -> Dict[str, float]:
        """Get current blend shape weights."""
        return self.current_blend_shapes.copy()
    
    async def cleanup(self) -> None:
        """Cleanup facial animation engine resources."""
        logger.info("Cleaning up facial animation engine")
        
        self.is_initialized = False
        self.animation_controller.active_animations.clear()
        self.current_blend_shapes.clear()
        
        logger.info("Facial animation engine cleanup complete")
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get animation performance metrics."""
        return {
            "frame_count": self.frame_count,
            "animation_updates": self.animation_updates,
            "active_animations": len(self.animation_controller.active_animations),
            "current_emotion": self.current_emotion.value,
            "emotion_intensity": self.emotion_intensity,
            "blend_shapes_count": len(self.current_blend_shapes),
            "is_initialized": self.is_initialized
        }
    
    async def _load_blend_shape_mappings(self) -> None:
        """Load avatar-specific blend shape mappings."""
        # TODO: Load from configuration file
        # For now, create default mappings
        logger.debug("Loading blend shape mappings")
    
    async def _aus_to_blend_shapes(
        self,
        action_units: Dict[int, float],
        intensity_scale: float = 1.0
    ) -> Dict[str, float]:
        """Convert FACS Action Units to blend shape weights."""
        blend_shapes = {}
        
        # Map common AUs to blend shapes
        au_to_blend_map = {
            1: "eyebrow_inner_up",
            2: "eyebrow_outer_up", 
            4: "eyebrow_down",
            5: "eye_wide",
            6: "cheek_raise",
            7: "eye_squint",
            9: "nose_wrinkle",
            10: "mouth_upper_up",
            12: "mouth_smile",
            15: "mouth_frown",
            16: "mouth_lower_down",
            17: "chin_up",
            18: "mouth_pucker",
            20: "mouth_stretch",
            22: "mouth_funnel",
            23: "mouth_tighten",
            25: "mouth_open",
            26: "jaw_open"
        }
        
        for au_id, au_intensity in action_units.items():
            if au_id in au_to_blend_map:
                blend_shape_name = au_to_blend_map[au_id]
                # Normalize AU intensity (0-5) to blend shape weight (0-1)
                weight = (au_intensity / 5.0) * intensity_scale
                blend_shapes[blend_shape_name] = max(0.0, min(1.0, weight))
        
        return blend_shapes
    
    async def _animation_loop(self) -> None:
        """Main animation update loop."""
        logger.debug("Starting facial animation loop")
        
        frame_interval = 1.0 / 60.0  # 60 FPS animation updates
        
        while self.is_initialized:
            try:
                # Update animations
                self.current_blend_shapes = self.animation_controller.update_animations()
                
                self.frame_count += 1
                self.animation_updates += 1
                
                await asyncio.sleep(frame_interval)
                
            except Exception as e:
                logger.error(f"Error in animation loop: {e}")
                await asyncio.sleep(frame_interval)