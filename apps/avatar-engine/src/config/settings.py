"""
Configuration settings for Avatar Engine.

This module provides configuration management using Pydantic for type safety
and environment variable support.
"""

import os
from pathlib import Path
from typing import Dict, List, Optional, Union

import yaml
from pydantic import BaseModel, Field, validator


class LiveKitConfig(BaseModel):
    """LiveKit connection configuration."""
    
    url: str = Field(default="ws://localhost:7880", description="LiveKit server URL")
    api_key: str = Field(default="", description="LiveKit API key")
    api_secret: str = Field(default="", description="LiveKit API secret")
    
    @classmethod
    def from_env(cls) -> "LiveKitConfig":
        """Load configuration from environment variables."""
        return cls(
            url=os.getenv("LIVEKIT_URL", "ws://localhost:7880"),
            api_key=os.getenv("LIVEKIT_API_KEY", ""),
            api_secret=os.getenv("LIVEKIT_API_SECRET", "")
        )


class VideoConfig(BaseModel):
    """Video rendering configuration."""
    
    resolution: str = Field(default="1080p", description="Video resolution")
    fps: int = Field(default=30, description="Frames per second")
    bitrate: int = Field(default=2000000, description="Video bitrate in bps")
    codec: str = Field(default="VP8", description="Video codec")
    quality: str = Field(default="medium", description="Rendering quality")
    
    @validator("resolution")
    def validate_resolution(cls, v):
        valid_resolutions = ["720p", "1080p", "1440p", "4K"]
        if v not in valid_resolutions:
            raise ValueError(f"Resolution must be one of {valid_resolutions}")
        return v
    
    @validator("fps")
    def validate_fps(cls, v):
        if v not in [24, 30, 60]:
            raise ValueError("FPS must be 24, 30, or 60")
        return v
    
    @validator("quality")
    def validate_quality(cls, v):
        valid_qualities = ["low", "medium", "high", "ultra"]
        if v not in valid_qualities:
            raise ValueError(f"Quality must be one of {valid_qualities}")
        return v


class AudioConfig(BaseModel):
    """Audio processing configuration."""
    
    sample_rate: int = Field(default=48000, description="Audio sample rate")
    channels: int = Field(default=1, description="Audio channels")
    bitrate: int = Field(default=128000, description="Audio bitrate in bps")
    codec: str = Field(default="OPUS", description="Audio codec")
    
    @validator("sample_rate")
    def validate_sample_rate(cls, v):
        valid_rates = [16000, 22050, 44100, 48000]
        if v not in valid_rates:
            raise ValueError(f"Sample rate must be one of {valid_rates}")
        return v


class LipSyncConfig(BaseModel):
    """Lip sync configuration."""
    
    model: str = Field(default="rhubarb", description="Lip sync model")
    quality: str = Field(default="medium", description="Lip sync quality")
    latency_ms: int = Field(default=100, description="Target latency in milliseconds")
    
    @validator("model")
    def validate_model(cls, v):
        valid_models = ["rhubarb", "wav2lip"]
        if v not in valid_models:
            raise ValueError(f"Model must be one of {valid_models}")
        return v


class AnimationConfig(BaseModel):
    """Facial animation configuration."""
    
    facs_enabled: bool = Field(default=True, description="Enable FACS animation")
    emotion_mapping: bool = Field(default=True, description="Enable emotion mapping")
    head_movements: bool = Field(default=True, description="Enable head movements")
    eye_tracking: bool = Field(default=False, description="Enable eye tracking")
    blend_shapes: int = Field(default=52, description="Number of blend shapes")


class PerformanceConfig(BaseModel):
    """Performance and resource configuration."""
    
    gpu_enabled: bool = Field(default=False, description="Enable GPU acceleration")
    max_concurrent_avatars: int = Field(default=10, description="Max concurrent avatars")
    memory_limit_mb: int = Field(default=2048, description="Memory limit in MB")
    cpu_cores: Optional[int] = Field(default=None, description="CPU cores to use")
    
    @validator("max_concurrent_avatars")
    def validate_max_avatars(cls, v):
        if v < 1 or v > 100:
            raise ValueError("Max concurrent avatars must be between 1 and 100")
        return v


class AvatarConfig(BaseModel):
    """Main avatar engine configuration."""
    
    # Service configuration
    version: str = Field(default="0.1.0", description="Avatar engine version")
    host: str = Field(default="0.0.0.0", description="Host to bind to")
    port: int = Field(default=8080, description="Port to bind to")
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # Paths
    assets_path: Path = Field(default=Path("assets"), description="Assets directory path")
    models_path: Path = Field(default=Path("assets/models"), description="3D models path")
    textures_path: Path = Field(default=Path("assets/textures"), description="Textures path")
    logs_path: Path = Field(default=Path("logs"), description="Logs directory path")
    
    # Logging
    log_level: str = Field(default="INFO", description="Log level")
    log_file: Optional[str] = Field(default=None, description="Log file path")
    
    # Component configurations
    livekit: LiveKitConfig = Field(default_factory=LiveKitConfig)
    video: VideoConfig = Field(default_factory=VideoConfig)
    audio: AudioConfig = Field(default_factory=AudioConfig)
    lipsync: LipSyncConfig = Field(default_factory=LipSyncConfig)
    animation: AnimationConfig = Field(default_factory=AnimationConfig)
    performance: PerformanceConfig = Field(default_factory=PerformanceConfig)
    
    # Avatar defaults
    default_avatar_id: str = Field(default="doctor_avatar_1", description="Default avatar ID")
    default_background: str = Field(default="medical_office", description="Default background")
    
    # Security and CORS
    cors_origins: List[str] = Field(default=["*"], description="CORS origins")
    api_rate_limit: int = Field(default=100, description="API rate limit per minute")
    
    @validator("log_level")
    def validate_log_level(cls, v):
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR"]
        if v not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v
    
    @classmethod
    def from_env(cls) -> "AvatarConfig":
        """Load configuration from environment variables."""
        config = cls()
        
        # Update from environment variables
        config.host = os.getenv("AVATAR_ENGINE_HOST", config.host)
        config.port = int(os.getenv("AVATAR_ENGINE_PORT", str(config.port)))
        config.debug = os.getenv("DEBUG", "false").lower() == "true"
        config.log_level = os.getenv("LOG_LEVEL", config.log_level)
        
        # Load LiveKit config from environment
        config.livekit = LiveKitConfig.from_env()
        
        # Performance settings from environment
        config.performance.gpu_enabled = os.getenv("GPU_ENABLED", "false").lower() == "true"
        if max_avatars := os.getenv("MAX_CONCURRENT_AVATARS"):
            config.performance.max_concurrent_avatars = int(max_avatars)
        
        # Video settings from environment
        if resolution := os.getenv("VIDEO_RESOLUTION"):
            config.video.resolution = resolution
        if fps := os.getenv("VIDEO_FPS"):
            config.video.fps = int(fps)
        if quality := os.getenv("AVATAR_QUALITY"):
            config.video.quality = quality
        
        # Audio settings from environment
        if sample_rate := os.getenv("AUDIO_SAMPLE_RATE"):
            config.audio.sample_rate = int(sample_rate)
        
        # Lip sync settings from environment
        if model := os.getenv("LIP_SYNC_MODEL"):
            config.lipsync.model = model
        if quality := os.getenv("LIP_SYNC_QUALITY"):
            config.lipsync.quality = quality
        
        # CORS settings from environment
        if cors_origins := os.getenv("CORS_ORIGINS"):
            config.cors_origins = cors_origins.split(",")
        
        return config


def load_config(config_path: Optional[Union[str, Path]] = None) -> AvatarConfig:
    """
    Load configuration from file and environment variables.
    
    Args:
        config_path: Path to configuration YAML file
        
    Returns:
        AvatarConfig: Loaded configuration
    """
    # Start with environment-based config
    config = AvatarConfig.from_env()
    
    # Load from file if provided
    if config_path:
        config_file = Path(config_path)
        if config_file.exists():
            try:
                with open(config_file, "r") as f:
                    file_config = yaml.safe_load(f)
                
                # Merge file config with environment config
                # Environment variables take precedence
                for key, value in file_config.items():
                    if hasattr(config, key):
                        # Only use file value if env var wasn't set
                        current_value = getattr(config, key)
                        if isinstance(current_value, BaseModel):
                            # Handle nested configs
                            for nested_key, nested_value in value.items():
                                if not hasattr(current_value, nested_key) or \
                                   getattr(current_value, nested_key) == getattr(current_value.__class__(), nested_key):
                                    setattr(current_value, nested_key, nested_value)
                        else:
                            # Only override if it's still the default value
                            default_config = AvatarConfig()
                            if getattr(config, key) == getattr(default_config, key):
                                setattr(config, key, value)
                                
            except Exception as e:
                raise ValueError(f"Failed to load config file {config_path}: {e}")
    
    # Ensure directories exist
    config.assets_path.mkdir(parents=True, exist_ok=True)
    config.models_path.mkdir(parents=True, exist_ok=True)
    config.textures_path.mkdir(parents=True, exist_ok=True)
    config.logs_path.mkdir(parents=True, exist_ok=True)
    
    return config


def save_config(config: AvatarConfig, config_path: Union[str, Path]) -> None:
    """
    Save configuration to YAML file.
    
    Args:
        config: Configuration to save
        config_path: Path to save configuration file
    """
    config_file = Path(config_path)
    config_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Convert to dict and save as YAML
    config_dict = config.dict()
    
    with open(config_file, "w") as f:
        yaml.dump(config_dict, f, default_flow_style=False, indent=2)