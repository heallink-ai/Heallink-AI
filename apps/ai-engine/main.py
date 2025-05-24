"""Main application module for the Heallink AI Engine."""
import uvicorn

from app import create_app
from core.config import settings


if __name__ == "__main__":
    app = create_app()
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )