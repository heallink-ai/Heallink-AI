"""
Logging configuration for Avatar Engine
Provides structured logging with performance metrics.
"""

import sys
from pathlib import Path
from typing import Optional

from loguru import logger

from ..core.config import AvatarConfig


def setup_logging(config: AvatarConfig) -> None:
    """
    Setup logging configuration for the avatar engine.
    
    Args:
        config: Avatar engine configuration
    """
    # Remove default handler
    logger.remove()
    
    # Console logging format
    console_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )
    
    # File logging format (more detailed)
    file_format = (
        "{time:YYYY-MM-DD HH:mm:ss.SSS} | "
        "{level: <8} | "
        "{name}:{function}:{line} | "
        "{message} | "
        "{extra}"
    )
    
    # Add console handler
    logger.add(
        sys.stderr,
        format=console_format,
        level=config.log_level,
        colorize=True,
        backtrace=config.debug,
        diagnose=config.debug,
    )
    
    # Add file handler if specified
    if config.log_file:
        log_file = Path(config.log_file)
        log_file.parent.mkdir(parents=True, exist_ok=True)
        
        logger.add(
            log_file,
            format=file_format,
            level=config.log_level,
            rotation="100 MB",
            retention="30 days",
            compression="gz",
            backtrace=True,
            diagnose=True,
        )
    
    # Configure specific loggers
    if not config.debug:
        # Reduce noise from external libraries in production
        logger.disable("PIL")
        logger.disable("urllib3")
        logger.disable("httpx")
    
    logger.info("Logging configured successfully")


class PerformanceLogger:
    """Context manager for performance logging."""
    
    def __init__(self, operation: str, threshold_ms: float = 100.0):
        """
        Initialize performance logger.
        
        Args:
            operation: Name of the operation being timed
            threshold_ms: Log warning if operation exceeds this threshold
        """
        self.operation = operation
        self.threshold_ms = threshold_ms
        self.start_time = None
    
    def __enter__(self):
        """Start timing."""
        import time
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """End timing and log results."""
        if self.start_time is None:
            return
        
        import time
        duration_ms = (time.time() - self.start_time) * 1000
        
        if exc_type is not None:
            logger.error(f"{self.operation} failed after {duration_ms:.2f}ms: {exc_val}")
        elif duration_ms > self.threshold_ms:
            logger.warning(f"{self.operation} took {duration_ms:.2f}ms (threshold: {self.threshold_ms}ms)")
        else:
            logger.debug(f"{self.operation} completed in {duration_ms:.2f}ms")


def log_avatar_metrics(session_id: str, metrics: dict) -> None:
    """Log avatar session metrics in structured format."""
    logger.info(
        "Avatar session metrics",
        extra={
            "session_id": session_id,
            "metrics": metrics,
        }
    )