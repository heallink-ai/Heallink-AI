"""Health check API endpoints."""
import time
import os
import platform
import psutil
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": os.getenv("APP_VERSION", "0.1.0"),
    }


@router.get("/health/details")
async def health_details():
    """Detailed health check with system information."""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": os.getenv("APP_VERSION", "0.1.0"),
        "system": {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "cpu_count": os.cpu_count(),
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
        }
    }


@router.get("/readiness")
async def readiness():
    """Readiness probe for container orchestration."""
    return {
        "status": "ready",
        "timestamp": time.time(),
    }