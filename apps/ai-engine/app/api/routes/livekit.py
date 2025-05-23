from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from livekit import api
from app.core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class TokenRequest(BaseModel):
    """Request model for generating a LiveKit token"""
    room_name: str
    identity: str

class TokenResponse(BaseModel):
    """Response model for LiveKit token"""
    token: str
    room_name: str
    identity: str
    server_url: str

@router.post("/token", response_model=TokenResponse)
async def create_token(request: TokenRequest):
    """Generate a LiveKit token for client authentication"""
    try:
        # Create an AccessToken instance
        token = api.AccessToken(
            api_key=settings.LIVEKIT_API_KEY,
            api_secret=settings.LIVEKIT_API_SECRET
        )
        
        # Add grants to the token
        token.add_grant(
            room_join=True,
            room=request.room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_data=True
        )
        
        # Set the identity (participant name)
        token.identity = request.identity
        
        # Generate the JWT token
        jwt_token = token.to_jwt()
        
        return TokenResponse(
            token=jwt_token,
            room_name=request.room_name,
            identity=request.identity,
            server_url=settings.LIVEKIT_URL
        )
    except Exception as e:
        logger.error(f"Error generating LiveKit token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate token: {str(e)}"
        )
