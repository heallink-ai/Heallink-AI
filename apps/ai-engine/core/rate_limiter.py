"""Rate limiting functionality for the Heallink AI Engine."""
import time
from typing import Dict, Tuple, Optional, Callable, Any

from fastapi import FastAPI, Request, Response, Depends, HTTPException
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

from core.config import settings
from core.logging import logger


class MemoryRateLimiter:
    """Simple in-memory rate limiter implementation."""
    
    def __init__(self, max_requests: int = 100, timeframe: int = 60):
        """
        Initialize the rate limiter.
        
        Args:
            max_requests: Maximum number of requests allowed within the timeframe.
            timeframe: Time window in seconds.
        """
        self.max_requests = max_requests
        self.timeframe = timeframe
        self.request_records: Dict[str, Tuple[int, float]] = {}  # {ip: (count, start_time)}
    
    def is_rate_limited(self, ip: str) -> bool:
        """
        Check if a request from the given IP should be rate limited.
        
        Args:
            ip: Client IP address.
            
        Returns:
            True if the request should be rate limited, False otherwise.
        """
        current_time = time.time()
        
        if ip in self.request_records:
            count, start_time = self.request_records[ip]
            
            # Reset if the timeframe has passed
            if current_time - start_time > self.timeframe:
                self.request_records[ip] = (1, current_time)
                return False
            
            # Increment and check
            count += 1
            self.request_records[ip] = (count, start_time)
            
            if count > self.max_requests:
                logger.warning(f"Rate limit exceeded for IP: {ip}")
                return True
        else:
            # First request from this IP
            self.request_records[ip] = (1, current_time)
        
        return False


# Create global rate limiter instance
rate_limiter = MemoryRateLimiter(
    max_requests=settings.RATE_LIMIT_REQUESTS,
    timeframe=settings.RATE_LIMIT_TIMEFRAME_SECONDS,
)


async def rate_limit(request: Request) -> None:
    """
    FastAPI dependency for rate limiting.
    
    Args:
        request: The incoming request.
        
    Raises:
        HTTPException: If the rate limit is exceeded.
    """
    if not settings.RATE_LIMIT_ENABLED:
        return
    
    client_ip = request.client.host if request.client else "unknown"
    
    if rate_limiter.is_rate_limited(client_ip):
        raise HTTPException(
            status_code=HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(settings.RATE_LIMIT_TIMEFRAME_SECONDS)},
        )


def setup_rate_limiter(app: FastAPI) -> None:
    """
    Configure global rate limiting for specific endpoints.
    
    Args:
        app: The FastAPI application instance.
    """
    # This function could be used to attach rate limiters to specific endpoints
    # or to set up Redis-based distributed rate limiting in the future
    pass