"""Metrics endpoints for the Heallink AI Engine."""
import time
from typing import Dict, Any, List, Callable

from fastapi import APIRouter
from prometheus_client import (
    Counter, Histogram, Gauge, Summary,
    generate_latest, CONTENT_TYPE_LATEST
)
from starlette.responses import Response

from core.logging import logger


router = APIRouter()


# Additional metrics (beyond those in middleware.py)
AI_PROCESSING_DURATION = Histogram(
    "ai_processing_duration_seconds",
    "Duration of AI processing in seconds",
    ["component", "model"]
)

ACTIVE_AGENTS = Gauge(
    "active_agents",
    "Number of active AI agents"
)

SPEECH_RECOGNITION_ERRORS = Counter(
    "speech_recognition_errors_total",
    "Total count of speech recognition errors",
    ["error_type"]
)

TTS_ERRORS = Counter(
    "tts_errors_total",
    "Total count of text-to-speech errors",
    ["error_type"]
)

LLM_TOKENS = Counter(
    "llm_tokens_total",
    "Total number of tokens processed by the LLM",
    ["model", "type"]  # type can be "prompt" or "completion"
)

AGENT_SESSIONS = Counter(
    "agent_sessions_total",
    "Total number of agent sessions",
    ["status"]  # "created", "connected", "disconnected", "error"
)


@router.get("/metrics", summary="Prometheus Metrics")
async def metrics() -> Response:
    """
    Expose Prometheus metrics.
    
    Returns:
        Raw Prometheus metrics.
    """
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )


def track_ai_processing(component: str, model: str) -> Callable:
    """
    Create a decorator to track AI processing duration.
    
    Args:
        component: The component being timed (e.g., "stt", "llm", "tts").
        model: The model being used.
        
    Returns:
        A decorator function.
    """
    def decorator(func: Callable) -> Callable:
        async def wrapper(*args, **kwargs) -> Any:
            start_time = time.time()
            
            try:
                result = await func(*args, **kwargs)
                
                # Record the processing time
                duration = time.time() - start_time
                AI_PROCESSING_DURATION.labels(
                    component=component,
                    model=model
                ).observe(duration)
                
                return result
                
            except Exception as e:
                # Record error in appropriate counter
                if component == "stt":
                    SPEECH_RECOGNITION_ERRORS.labels(
                        error_type=type(e).__name__
                    ).inc()
                elif component == "tts":
                    TTS_ERRORS.labels(
                        error_type=type(e).__name__
                    ).inc()
                
                # Re-raise the exception
                raise
                
        return wrapper
    
    return decorator