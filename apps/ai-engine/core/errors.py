"""Error handling utilities for the Heallink AI Engine."""
from typing import Any, Dict, Optional, List

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from core.logging import logger


class ErrorResponse:
    """Standard error response format."""
    
    @staticmethod
    def create(
        status_code: int,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        error_code: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Create a standardized error response.
        
        Args:
            status_code: HTTP status code.
            message: Error message.
            details: Additional error details.
            error_code: Application-specific error code.
            
        Returns:
            A dictionary with the error response.
        """
        response = {
            "status": "error",
            "code": status_code,
            "message": message,
        }
        
        if error_code:
            response["error_code"] = error_code
            
        if details:
            response["details"] = details
            
        return response


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handle request validation errors.
    
    Args:
        request: The request that caused the exception.
        exc: The validation exception.
        
    Returns:
        A JSON response with validation error details.
    """
    errors = []
    
    for error in exc.errors():
        errors.append({
            "loc": error["loc"],
            "msg": error["msg"],
            "type": error["type"],
        })
    
    logger.warning(
        "Validation error",
        request_id=getattr(request.state, "request_id", None),
        url=str(request.url),
        errors=errors,
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse.create(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message="Validation error",
            details={"errors": errors},
            error_code="VALIDATION_ERROR",
        ),
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """
    Handle HTTP exceptions.
    
    Args:
        request: The request that caused the exception.
        exc: The HTTP exception.
        
    Returns:
        A JSON response with error details.
    """
    logger.warning(
        f"HTTP error: {exc.detail}",
        request_id=getattr(request.state, "request_id", None),
        url=str(request.url),
        status_code=exc.status_code,
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse.create(
            status_code=exc.status_code,
            message=str(exc.detail),
        ),
    )


async def general_exception_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    """
    Handle general exceptions.
    
    Args:
        request: The request that caused the exception.
        exc: The exception.
        
    Returns:
        A JSON response with error details.
    """
    logger.error(
        f"Unhandled exception: {str(exc)}",
        request_id=getattr(request.state, "request_id", None),
        url=str(request.url),
        exc_info=True,
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse.create(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            error_code="INTERNAL_ERROR",
        ),
    )


def setup_exception_handlers(app: FastAPI) -> None:
    """
    Configure global exception handlers for the application.
    
    Args:
        app: The FastAPI application instance.
    """
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(ValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)