import os
import uuid
import json
import logging
import asyncio
import time
from typing import Dict, Optional, List, Any

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from livekit import agents
from livekit.agents import AgentSession, RoomInputOptions
from livekit.plugins import (
    openai,
    cartesia, 
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

# Import LiveKit token generation

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure logging with more details
logging.basicConfig(
    level=logging.getLevelName(os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(process)d - %(thread)d - %(message)s",
)
logger = logging.getLogger("heallink-ai")

# Store active agents
active_agents: Dict[str, Dict[str, Any]] = {}

# Store rate limiting data
rate_limits: Dict[str, Dict[str, Any]] = {}

# Configuration settings
API_TITLE = "Heallink AI Engine"
API_DESCRIPTION = "AI Engine for Heallink Healthcare Platform"
API_VERSION = "0.1.0"
API_PREFIX = "/api/v1"
RATE_LIMIT_ENABLED = True
RATE_LIMIT_MAX_REQUESTS = 100
RATE_LIMIT_TIMEFRAME_SECONDS = 60

# LiveKit configuration
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "devkey")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "devsecret")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://your-livekit-instance.livekit.cloud")

# Define request/response models
class CreateAgentRequest(BaseModel):
    room_name: str = Field(..., description="LiveKit room name")
    identity: str = Field(..., description="Identity of the agent in the room")
    display_name: str = Field("AI Assistant", description="Display name of the agent")

class AgentResponse(BaseModel):
    agent_id: str = Field(..., description="ID of the agent")
    room_name: str = Field(..., description="LiveKit room name")
    identity: str = Field(..., description="Identity of the agent in the room")
    status: str = Field(..., description="Status of the agent (active, disconnected)")
    connected_at: Optional[str] = Field(None, description="Timestamp when agent connected")
    disconnected_at: Optional[str] = Field(None, description="Timestamp when agent disconnected")

class DisconnectAgentRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent to disconnect")

class TokenRequest(BaseModel):
    identity: str = Field(..., description="Identity of the participant")
    room_name: str = Field(..., description="LiveKit room name")

class TokenResponse(BaseModel):
    token: str = Field(..., description="LiveKit token")
    serverUrl: str = Field(..., description="LiveKit server URL")

# Add webhook models
class WebhookEvent(BaseModel):
    id: str = Field(..., description="UUID identifying the event")
    createdAt: int = Field(..., description="UNIX timestamp in seconds")
    event: str = Field(..., description="Type of event")
    room: Optional[Dict[str, Any]] = Field(None, description="Room information")
    participant: Optional[Dict[str, Any]] = Field(None, description="Participant information")
    track: Optional[Dict[str, Any]] = Field(None, description="Track information")
    egressInfo: Optional[Dict[str, Any]] = Field(None, description="Egress information")
    ingressInfo: Optional[Dict[str, Any]] = Field(None, description="Ingress information")

# Simple rate limiter
def is_rate_limited(client_ip: str) -> bool:
    """Check if a client is currently rate limited."""
    if not RATE_LIMIT_ENABLED:
        return False
        
    current_time = time.time()
    
    if client_ip in rate_limits:
        count, start_time = rate_limits[client_ip]
        
        # Reset if the timeframe has passed
        if current_time - start_time > RATE_LIMIT_TIMEFRAME_SECONDS:
            rate_limits[client_ip] = (1, current_time)
            return False
            
        # Increment and check
        count += 1
        rate_limits[client_ip] = (count, start_time)
        
        if count > RATE_LIMIT_MAX_REQUESTS:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return True
    else:
        # First request from this IP
        rate_limits[client_ip] = (1, current_time)
        
    return False


# Helper function to create and start a LiveKit agent
async def create_and_start_agent(
    room_name: str,
    identity: str,
    display_name: str,
    agent_id: str,
):
    try:
        # Create HealLink Assistant agent
        class HealLinkAssistant(agents.Agent):
            def __init__(self) -> None:
                super().__init__(instructions="""
                You are a helpful AI healthcare assistant for the Heallink platform. 
                Your goal is to assist patients with their healthcare needs and questions. 
                Keep responses professional, accurate, and empathetic. 
                Do not provide specific medical advice or diagnoses, but help users 
                understand general health information and guide them to appropriate care. 
                If asked about an emergency, always suggest contacting emergency services. 
                Be concise in your responses.
                """)

        # Create agent session with specified components
        session = AgentSession(
            stt=deepgram.STT(model="nova-3", language="multi"),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(),
            vad=silero.VAD.load(),
            turn_detection=MultilingualModel(),
        )

        # Create a custom job context
        class CustomJobContext(agents.JobContext):
            def __init__(self, room: str):
                self.room = room
                self._connected = asyncio.Event()

            async def connect(self):
                self._connected.set()

            async def wait_connected(self):
                await self._connected.wait()

        # Create context
        ctx = CustomJobContext(room=room_name)

        # Start agent session
        await session.start(
            room=ctx.room,
            agent=HealLinkAssistant(),
            room_input_options=RoomInputOptions(
                # LiveKit Cloud enhanced noise cancellation
                # - If self-hosting, omit this parameter
                # - For telephony applications, use `BVCTelephony` for best results
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )

        # Connect to room
        await ctx.connect()

        # Greet the user
        await session.generate_reply(
            instructions="Greet the user, introduce yourself as Heallink's AI healthcare assistant, and offer your assistance."
        )

        # Store agent info
        active_agents[agent_id] = {
            "agent_id": agent_id,
            "room_name": room_name,
            "identity": identity,
            "display_name": display_name,
            "status": "active",
            "connected_at": agents.utils.get_iso_timestamp(),
            "disconnected_at": None,
            "session": session,
            "context": ctx,
        }

        logger.info(f"Agent {agent_id} successfully connected to room {room_name}")
        return active_agents[agent_id]

    except Exception as e:
        logger.error(f"Error creating agent: {str(e)}", exc_info=True)
        raise


# Create FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
    docs_url=f"{API_PREFIX}/docs",
    redoc_url=f"{API_PREFIX}/redoc",
    openapi_url=f"{API_PREFIX}/openapi.json",
)

# Print all registered routes for debugging - IMMEDIATELY after app creation
@app.on_event("startup")
async def print_routes():
    """Print all registered routes on startup for debugging."""
    print("\n\n============= REGISTERED ROUTES =============")
    print(f"API_PREFIX: {API_PREFIX}")
    
    # Extract all routes
    routes = []
    for route in app.routes:
        path = getattr(route, "path", "Unknown")
        methods = getattr(route, "methods", {"GET"})
        endpoint = getattr(route, "endpoint", None)
        endpoint_name = getattr(endpoint, "__name__", "unknown") if endpoint else "unknown"
        routes.append((path, methods, endpoint_name))
    
    # Sort by path for easier reading
    routes.sort(key=lambda x: x[0])
    
    # Print with endpoint name
    for path, methods, endpoint_name in routes:
        print(f"Route: {path}, Methods: {methods}, Handler: {endpoint_name}")
        # Check if this route is in the API_PREFIX path
        if path.startswith(API_PREFIX):
            print(f"  --> API ROUTE: {path[len(API_PREFIX):] if len(API_PREFIX) > 0 else path}")
    
    print("============================================\n\n")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request ID middleware
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add a unique request ID to each request."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"
    request.state.client_ip = client_ip
    
    # Debug log the request path and method
    print(f"REQUEST: {request.method} {request.url.path}")
    
    # We can't read the body here as it will consume the stream
    # and the route handler won't be able to read it
    
    # Check rate limit for API endpoints
    if request.url.path.startswith(API_PREFIX) and is_rate_limited(client_ip):
        return JSONResponse(
            status_code=429,
            content={
                "status": "error",
                "code": 429,
                "message": "Too many requests. Please try again later.",
            },
            headers={"Retry-After": str(RATE_LIMIT_TIMEFRAME_SECONDS)},
        )
    
    # Process request and track timing
    start_time = time.time()
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Add timing and request ID headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
    except Exception as e:
        # Log any unhandled exceptions
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        raise


# API Routes
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy", 
        "version": API_VERSION,
        "timestamp": time.time(),
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": API_TITLE,
        "version": API_VERSION,
        "docs": f"{API_PREFIX}/docs",
    }


@app.post(f"{API_PREFIX}/livekit/agents", response_model=AgentResponse)
async def create_agent(
    request: CreateAgentRequest,
    background_tasks: BackgroundTasks,
):
    """
    Create a new LiveKit AI agent and connect it to a room.
    """
    try:
        # Generate a unique agent ID
        agent_id = f"agent-{uuid.uuid4().hex[:8]}"
        
        logger.info(f"Creating agent {agent_id} for room {request.room_name} with identity {request.identity}")
        
        # Initialize agent info
        agent_info = {
            "agent_id": agent_id,
            "room_name": request.room_name,
            "identity": request.identity,
            "display_name": request.display_name,
            "status": "initializing",
            "connected_at": agents.utils.get_iso_timestamp(),
            "disconnected_at": None,
        }
        
        # Store initial agent info
        active_agents[agent_id] = agent_info
        
        # Start agent in background
        background_tasks.add_task(
            create_and_start_agent,
            request.room_name,
            request.identity,
            request.display_name,
            agent_id,
        )
        
        return AgentResponse(
            agent_id=agent_id,
            room_name=request.room_name,
            identity=request.identity,
            status="initializing",
            connected_at=agent_info["connected_at"],
            disconnected_at=None,
        )
    
    except Exception as e:
        logger.error(f"Failed to create agent: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")


@app.post(f"{API_PREFIX}/livekit/agents/disconnect", response_model=AgentResponse)
async def disconnect_agent(request: DisconnectAgentRequest):
    """
    Disconnect an AI agent from a LiveKit room.
    """
    if request.agent_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Agent with ID {request.agent_id} not found")
    
    try:
        agent_info = active_agents[request.agent_id]
        
        if "session" in agent_info:
            session = agent_info["session"]
            await session.stop()
        
        # Update agent info
        agent_info["status"] = "disconnected"
        agent_info["disconnected_at"] = agents.utils.get_iso_timestamp()
        
        logger.info(f"Agent {request.agent_id} disconnected from room {agent_info['room_name']}")
        
        return AgentResponse(
            agent_id=agent_info["agent_id"],
            room_name=agent_info["room_name"],
            identity=agent_info["identity"],
            status=agent_info["status"],
            connected_at=agent_info["connected_at"],
            disconnected_at=agent_info["disconnected_at"],
        )
    
    except Exception as e:
        logger.error(f"Failed to disconnect agent: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to disconnect agent: {str(e)}")


@app.get(f"{API_PREFIX}/livekit/agents/{{agent_id}}", response_model=AgentResponse)
async def get_agent_status(agent_id: str):
    """
    Get the status of an AI agent.
    """
    if agent_id not in active_agents:
        raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
    
    agent_info = active_agents[agent_id]
    
    return AgentResponse(
        agent_id=agent_info["agent_id"],
        room_name=agent_info["room_name"],
        identity=agent_info["identity"],
        status=agent_info["status"],
        connected_at=agent_info["connected_at"],
        disconnected_at=agent_info["disconnected_at"],
    )


@app.get(f"{API_PREFIX}/livekit/agents", response_model=List[AgentResponse])
async def list_agents():
    """
    List all active AI agents.
    """
    try:
        agents_list = []
        
        for agent_id, agent_info in active_agents.items():
            agents_list.append(AgentResponse(
                agent_id=agent_info["agent_id"],
                room_name=agent_info["room_name"],
                identity=agent_info["identity"],
                status=agent_info["status"],
                connected_at=agent_info["connected_at"],
                disconnected_at=agent_info["disconnected_at"],
            ))
            
        return agents_list
        
    except Exception as e:
        logger.error(f"Failed to list agents: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to list agents: {str(e)}")




@app.get(f"{API_PREFIX}/test")
async def test_endpoint():
    """
    Simple test endpoint to check if API routes are working.
    """
    return {"status": "ok", "message": "Test endpoint is working"}


# Add webhook endpoint
@app.post(f"{API_PREFIX}/webhooks/livekit")
async def livekit_webhook(request: Request, authorization: Optional[str] = Header(None)):
    """
    Receive and log LiveKit webhook events.
    
    Currently focused on participant_joined events.
    
    Note: In a production environment, you should validate that the webhook
    is coming from LiveKit by verifying the JWT signature in the Authorization header.
    """
    try:
        # Get the raw request body
        body = await request.body()
        
        # Parse as JSON
        try:
            event_data = json.loads(body)
            logger.info(f"Received LiveKit webhook event: {event_data.get('event', 'unknown')}")
            
            # Log the full payload
            logger.debug(f"Webhook payload: {json.dumps(event_data, indent=2)}")
            
            # Handle specific events
            event_type = event_data.get('event')
            
            if event_type == 'participant_joined':
                room_info = event_data.get('room', {})
                participant_info = event_data.get('participant', {})
                
                logger.info(
                    f"Participant joined: {participant_info.get('identity', 'unknown')} "
                    f"joined room {room_info.get('name', 'unknown')}"
                )
                
                # Here you could trigger additional actions when a participant joins
                # For example, updating analytics, sending notifications, etc.
            
        except json.JSONDecodeError:
            logger.error(f"Failed to parse webhook payload as JSON: {body.decode('utf-8', errors='replace')}")
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid JSON payload"}
            )
            
        # Log Authorization header for debugging (but don't expose in production)
        if authorization:
            logger.debug(f"Received Authorization header: {authorization[:20]}...")
            
        return JSONResponse(
            status_code=200,
            content={"status": "success", "message": "Webhook received"}
        )
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )


# Exception handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom handler for HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": str(exc.detail),
        },
    )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Custom handler for unexpected exceptions."""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": 500,
            "message": "Internal server error",
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app", 
        host=os.getenv("HOST", "0.0.0.0"), 
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT", "development") == "development"
    )