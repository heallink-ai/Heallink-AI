"""Enhanced logging configuration."""
import os
import sys
import logging
from logging.handlers import RotatingFileHandler

# Configure the logger
def setup_logging():
    """Configure enhanced logging."""
    # Get log level from environment
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    
    # Create logger
    logger = logging.getLogger("heallink-ai")
    logger.setLevel(logging.getLevelName(log_level))
    
    # Create formatters
    verbose_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - PID:%(process)d - TID:%(thread)d - %(message)s"
    )
    simple_formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(simple_formatter)
    logger.addHandler(console_handler)
    
    # Create file handler for error logs
    log_dir = os.path.join(os.getcwd(), "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, "heallink-ai.log"),
        maxBytes=10485760,  # 10MB
        backupCount=5,
    )
    file_handler.setFormatter(verbose_formatter)
    file_handler.setLevel(logging.INFO)
    logger.addHandler(file_handler)
    
    # Create error file handler
    error_handler = RotatingFileHandler(
        os.path.join(log_dir, "heallink-ai-error.log"),
        maxBytes=10485760,  # 10MB
        backupCount=5,
    )
    error_handler.setFormatter(verbose_formatter)
    error_handler.setLevel(logging.ERROR)
    logger.addHandler(error_handler)
    
    return logger

# Create logger instance
logger = setup_logging()