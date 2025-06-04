"""Avatar Engine Configuration."""

import os
from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class AvatarConfig(BaseSettings):
    """Avatar Engine configuration with environment variable support."""
    
    # Server configuration
    host: str = Field(default="0.0.0.0", description="Host to bind to")
    port: int = Field(default=8080, description="Port to bind to")
    debug: bool = Field(default=False, description="Enable debug mode")
    
    # LiveKit configuration
    livekit_url: str = Field(..., description="LiveKit server URL")
    livekit_api_key: str = Field(..., description="LiveKit API key")
    livekit_api_secret: str = Field(..., description="LiveKit API secret")
    
    # MuseTalk configuration
    musetalk_model_path: Path = Field(
        default=Path("/app/models/musetalk"),
        description="Path to MuseTalk model files"
    )
    device: str = Field(default="cuda", description="Device for inference (cuda/cpu)")
    
    # Avatar configuration
    default_avatar_image: Path = Field(
        default=Path("/app/assets/avatars/default.png"),
        description="Default avatar image path"
    )
    avatar_image_size: tuple[int, int] = Field(
        default=(512, 512),
        description="Avatar image resolution (width, height)"
    )
    
    # Performance configuration
    max_concurrent_sessions: int = Field(
        default=10,
        description="Maximum concurrent avatar sessions"
    )
    enable_gpu_acceleration: bool = Field(
        default=True,
        description="Enable GPU acceleration"
    )
    video_fps: int = Field(default=30, description="Video frame rate")
    audio_sample_rate: int = Field(default=16000, description="Audio sample rate")
    
    # Paths
    models_path: Path = Field(
        default=Path("/app/models"),
        description="Base path for model files"
    )
    assets_path: Path = Field(
        default=Path("/app/assets"),
        description="Base path for asset files"
    )
    temp_path: Path = Field(
        default=Path("/tmp/avatar_engine"),
        description="Temporary files path"
    )
    
    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    log_file: Optional[Path] = Field(default=None, description="Log file path")
    
    class Config:
        env_prefix = "AVATAR_"
        case_sensitive = False
        
    def __post_init__(self) -> None:
        """Create necessary directories."""
        for path in [self.models_path, self.assets_path, self.temp_path]:
            path.mkdir(parents=True, exist_ok=True)
    
    @property
    def musetalk_config_path(self) -> Path:
        """Get MuseTalk configuration file path."""
        return self.musetalk_model_path / "config.json"
    
    @property
    def musetalk_weights_path(self) -> Path:
        """Get MuseTalk model weights path.""" 
        return self.musetalk_model_path / "pytorch_model.bin"
    
    @property
    def whisper_model_path(self) -> Path:
        """Get Whisper model path for audio encoding."""
        return self.models_path / "whisper"


def load_config() -> AvatarConfig:
    """Load configuration from environment variables."""
    return AvatarConfig()