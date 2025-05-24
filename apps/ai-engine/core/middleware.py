"""Middleware components for the Heallink AI Engine."""
import time
from typing import Callable, Dict, Any

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from prometheus_client import Counter, Histogram

from core.config import settings
from core.logging import logger, get_request_id


# Define Prometheus metrics
HTTP_REQUESTS_TOTAL = Counter(
    "http_requests_total", 
    "Total count of HTTP requests", 
    ["method", "endpoint", "status_code"]
)

HTTP_REQUEST_DURATION = Histogram(
    "http_request_duration_seconds", 
    "HTTP request duration in seconds",
    ["method", "endpoint"]
)

LIVEKIT_AGENTS_TOTAL = Counter(
    "livekit_agents_total",
    "Total number of LiveKit agents created",
    ["status"]
)


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging request details."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process the request, log details, and return the response."""
        # Generate request ID
        request_id = get_request_id()
        
        # Store request ID in state
        request.state.request_id = request_id
        
        # Get client IP
        client_host = request.client.host if request.client else "unknown"
        
        # Log request start
        logger.info(
            "Request started",
            request_id=request_id,
            method=request.method,
            url=str(request.url),
            client=client_host,
        )
        
        # Time the request
        start_time = time.time()
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Update Prometheus metrics
            HTTP_REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=request.url.path,
                status_code=response.status_code
            ).inc()
            
            HTTP_REQUEST_DURATION.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(process_time)
            
            # Log request completion
            logger.info(
                "Request completed",
                request_id=request_id,
                method=request.method,
                url=str(request.url),
                status_code=response.status_code,
                duration=f"{process_time:.4f}s",
            )
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as e:
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log exception
            logger.error(
                "Request failed",
                request_id=request_id,
                method=request.method,
                url=str(request.url),
                error=str(e),
                duration=f"{process_time:.4f}s",
                exc_info=True,
            )
            
            # Update error metrics
            HTTP_REQUESTS_TOTAL.labels(
                method=request.method,
                endpoint=request.url.path,
                status_code=500
            ).inc()
            
            # Re-raise the exception
            raise


def setup_middleware(app: FastAPI) -> None:
    """Configure middleware for the FastAPI application."""
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )
    
    # Add logging middleware
    app.add_middleware(LoggingMiddleware)