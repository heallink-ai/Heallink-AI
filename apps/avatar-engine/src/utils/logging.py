"""
Logging configuration for Avatar Engine.

Uses loguru for structured logging with optional file output.
"""

import sys
from pathlib import Path
from typing import Optional

from loguru import logger


def setup_logging(
    level: str = "INFO",
    debug: bool = False,
    log_file: Optional[str] = None,
    rotation: str = "100 MB",
    retention: str = "10 days"
) -> None:
    """
    Setup logging configuration.
    
    Args:
        level: Log level (DEBUG, INFO, WARNING, ERROR)
        debug: Enable debug mode with verbose output
        log_file: Optional log file path
        rotation: Log file rotation size
        retention: Log file retention period
    """
    # Remove default handler
    logger.remove()
    
    # Console handler with color coding
    console_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )
    
    if debug:
        console_format = (
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
            "<magenta>{extra}</magenta> | "
            "<level>{message}</level>"
        )
    
    logger.add(
        sys.stderr,
        format=console_format,
        level=level,
        colorize=True,
        backtrace=debug,
        diagnose=debug
    )
    
    # File handler if specified
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_format = (
            "{time:YYYY-MM-DD HH:mm:ss.SSS} | "
            "{level: <8} | "
            "{name}:{function}:{line} | "
            "{extra} | "
            "{message}"
        )
        
        logger.add(
            log_file,
            format=file_format,
            level="DEBUG" if debug else level,
            rotation=rotation,
            retention=retention,
            compression="gz",
            backtrace=True,
            diagnose=True
        )
    
    # Set third-party library log levels
    import logging
    
    # Reduce noise from third-party libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("aiohttp").setLevel(logging.WARNING)
    logging.getLogger("websockets").setLevel(logging.WARNING)
    
    if not debug:
        logging.getLogger("asyncio").setLevel(logging.WARNING)
        logging.getLogger("concurrent").setLevel(logging.WARNING)


def get_logger(name: str) -> logger:
    """
    Get a logger instance with the given name.
    
    Args:
        name: Logger name (typically __name__)
        
    Returns:
        logger: Configured logger instance
    """
    return logger.bind(name=name)