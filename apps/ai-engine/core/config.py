"""Configuration settings for the Heallink AI Engine."""
import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings model."""
    
    # Base API settings
    API_TITLE: str = "Heallink AI Engine"
    API_DESCRIPTION: str = "AI Engine for Heallink Healthcare Platform"
    API_VERSION: str = "0.1.0"
    API_PREFIX: str = "/api/v1"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    ENV: str = os.getenv("ENVIRONMENT", "development")
    
    # LiveKit settings
    LIVEKIT_URL: str = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY: str = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET: str = os.getenv("LIVEKIT_API_SECRET", "")
    
    # AI Service API keys
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", "")
    DEEPGRAM_API_KEY: Optional[str] = os.getenv("DEEPGRAM_API_KEY", "")
    CARTESIA_API_KEY: Optional[str] = os.getenv("CARTESIA_API_KEY", "")
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_TIMEFRAME_SECONDS: int = 60
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()