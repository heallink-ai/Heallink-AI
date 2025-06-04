"""
Heallink Voice Agent with Custom Avatar Engine Integration
=========================================================
Modified version of agent.py to test the custom Avatar Engine plugin.

This script shows how to integrate the Avatar Engine with your existing LiveKit setup.
"""

import asyncio
import json
import logging
import sys
import os
import aiohttp
from datetime import datetime
from pathlib import Path

# Add the current directory to path to make imports work
current_dir = Path(__file__).parent.absolute()
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import (
    AgentSession,
    JobContext,
    RoomInputOptions,
    WorkerOptions,
    BackgroundAudioPlayer,
    AudioConfig,
    BuiltinAudioClip,
)
from livekit.plugins import (
    openai,
    cartesia,
    deepgram,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

# Import your existing modules
from models.data_models import PatientData, CallContext
from agents.specialized_agents import GreetingAgent
from utils.monitoring import monitor_edge_cases

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Avatar Engine Configuration
AVATAR_ENGINE_URL = os.getenv("AVATAR_ENGINE_URL", "http://avatar-engine:8080")
USE_CUSTOM_AVATAR = os.getenv("USE_CUSTOM_AVATAR", "true").lower() == "true"

class CustomAvatarSession:
    """
    Custom Avatar Session that interfaces with our Avatar Engine.
    
    This class provides a LiveKit-compatible interface for our Avatar Engine.
    """
    
    def __init__(self, avatar_id: str = "doctor_avatar_1", avatar_name: str = "Heallink Assistant"):
        self.avatar_id = avatar_id
        self.avatar_name = avatar_name
        self.session_id = None
        self.room = None
        self.agent_session = None
        self.is_active = False
        
    async def start(self, agent_session: AgentSession, room: rtc.Room) -> None:
        """Start the custom avatar session and publish video track."""
        try:
            self.agent_session = agent_session
            self.room = room
            
            # Create avatar session in Avatar Engine
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{AVATAR_ENGINE_URL}/avatars",
                    json={
                        "avatar_id": self.avatar_id,
                        "session_id": f"livekit_{room.name}_{datetime.now().timestamp()}"
                    }
                ) as response:
                    if response.status == 201:
                        data = await response.json()
                        self.session_id = data["session_id"]
                        logger.info(f"Custom avatar session created: {self.session_id}")
                        self.is_active = True
                        
                        # Set initial emotion to welcoming
                        await self._set_emotion("happy", 0.6)
                        
                        # Create and publish avatar video track
                        await self._create_avatar_video_track()
                        
                    else:
                        error_text = await response.text()
                        logger.error(f"Failed to create avatar session: {error_text}")
                        raise Exception(f"Avatar Engine connection failed: {response.status}")
            
            # Listen for agent events to control avatar
            self._setup_event_listeners()
            
        except Exception as e:
            logger.error(f"Failed to start custom avatar: {e}")
            raise
    
    async def _create_avatar_video_track(self):
        """Create and publish avatar video track to LiveKit room."""
        try:
            # Tell Avatar Engine to start LiveKit video streaming
            await self._start_avatar_video_streaming()
            
            # Set up audio output to stream to avatar (for lip sync)
            from livekit.agents.voice.avatar import DataStreamAudioOutput
            self.agent_session.output.audio = DataStreamAudioOutput(
                room=self.room,
                destination_identity=self.avatar_name,
            )
            
            logger.info("Avatar video streaming started successfully")
            
        except Exception as e:
            logger.error(f"Failed to create avatar video track: {e}")
            
    async def _start_avatar_video_streaming(self):
        """Tell Avatar Engine to start streaming to LiveKit room."""
        if not self.session_id:
            raise Exception("No avatar session ID available")
            
        # Get LiveKit credentials from environment
        livekit_url = os.getenv("LIVEKIT_URL")
        livekit_api_key = os.getenv("LIVEKIT_API_KEY")
        livekit_api_secret = os.getenv("LIVEKIT_API_SECRET")
        
        if not all([livekit_url, livekit_api_key, livekit_api_secret]):
            raise Exception("LiveKit credentials not configured")
        
        # Create a token for the avatar to join the room
        from livekit import api
        token = (
            api.AccessToken(api_key=livekit_api_key, api_secret=livekit_api_secret)
            .with_kind("agent")
            .with_identity(self.avatar_name)
            .with_name(self.avatar_name)
            .with_grants(api.VideoGrants(room_join=True, room=self.room.name))
            .to_jwt()
        )
        
        # Tell Avatar Engine to connect to LiveKit room and start streaming
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/start_livekit_stream",
                json={
                    "livekit_url": livekit_url,
                    "livekit_token": token,
                    "room_name": self.room.name
                }
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Failed to start avatar video streaming: {error_text}")
                    
                logger.info(f"Avatar {self.avatar_name} will join LiveKit room and start streaming")
    
    def _setup_event_listeners(self):
        """Setup event listeners to control avatar based on agent state."""
        if not self.agent_session:
            return
            
        # Listen for speech events to update avatar emotions
        async def on_agent_speech_started():
            if self.is_active:
                await self._set_emotion("talking", 0.8)
                logger.debug("Avatar set to talking emotion")
        
        async def on_agent_speech_ended():
            if self.is_active:
                await self._set_emotion("listening", 0.6)
                logger.debug("Avatar set to listening emotion")
        
        # Note: You'll need to hook these into your agent's speech events
        # This is a simplified example
    
    async def _set_emotion(self, emotion: str, intensity: float = 0.5):
        """Set avatar emotion via Avatar Engine API."""
        if not self.session_id:
            return
            
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/emotion",
                    json={"emotion": emotion, "intensity": intensity}
                ) as response:
                    if response.status == 200:
                        logger.debug(f"Avatar emotion updated: {emotion} ({intensity})")
                    else:
                        logger.warning(f"Failed to update avatar emotion: {response.status}")
        except Exception as e:
            logger.error(f"Error setting avatar emotion: {e}")
    
    async def set_background(self, background_id: str):
        """Change avatar background."""
        if not self.session_id:
            return
            
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/background",
                    json={"background_id": background_id}
                ) as response:
                    if response.status == 200:
                        logger.info(f"Avatar background changed to: {background_id}")
                    else:
                        logger.warning(f"Failed to change avatar background: {response.status}")
        except Exception as e:
            logger.error(f"Error changing avatar background: {e}")
    
    async def stop(self):
        """Stop the avatar session."""
        if self.session_id:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.delete(
                        f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}"
                    ) as response:
                        if response.status == 200:
                            logger.info(f"Avatar session stopped: {self.session_id}")
                        else:
                            logger.warning(f"Failed to stop avatar session: {response.status}")
            except Exception as e:
                logger.error(f"Error stopping avatar session: {e}")
            finally:
                self.is_active = False
                self.session_id = None

async def test_avatar_engine_connection():
    """Test connection to Avatar Engine before starting agent."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{AVATAR_ENGINE_URL}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"Avatar Engine is healthy: {data}")
                    return True
                else:
                    logger.error(f"Avatar Engine health check failed: {response.status}")
                    return False
    except Exception as e:
        logger.error(f"Cannot connect to Avatar Engine at {AVATAR_ENGINE_URL}: {e}")
        return False

async def entrypoint(ctx: JobContext):
    """
    Main entry point for the Heallink agent with custom avatar support
    
    Args:
        ctx: LiveKit job context
    """
    try:
        # Initialize call context
        call_context = CallContext(
            patient_data=PatientData(),
            start_time=datetime.now(),
        )
        
        # Parse job metadata if available
        if ctx.job.metadata:
            try:
                metadata = json.loads(ctx.job.metadata)
                if "user_id" in metadata:
                    pass  # In production, fetch user profile from database
                if "language" in metadata:
                    call_context.patient_data.conversation_language = metadata["language"]
            except json.JSONDecodeError:
                logger.warning("Failed to parse job metadata")
        
        # Connect to room
        await ctx.connect()
        
        # Determine STT model based on language
        language = call_context.patient_data.conversation_language
        stt_model = "nova-3" if language == "en" else "nova-3-general"
        
        # Create session with advanced configuration
        session = AgentSession[CallContext](
            stt=deepgram.STT(
                model=stt_model,
                language="multi",
                punctuate=True,
                filler_words=False,
                endpointing_ms=300,
            ),
            llm=openai.LLM(
                model="gpt-4o",
                temperature=0.3,
                max_completion_tokens=150,
            ),
            tts=cartesia.TTS(
                voice="95856005-0332-41b0-935f-352e296aa0df",
                speed=0.9,
            ),
            vad=silero.VAD.load(
                min_speech_duration=0.2,
                max_buffered_speech=60.0,
                min_silence_duration=0.3,
            ),
            turn_detection=MultilingualModel(
                unlikely_threshold=0.6,
            ),
            userdata=call_context,
        )
        
        # Choose avatar implementation
        use_custom_avatar = USE_CUSTOM_AVATAR
        if use_custom_avatar:
            # Test Avatar Engine connection first
            if await test_avatar_engine_connection():
                logger.info("Using Custom Avatar Engine")
                avatar = CustomAvatarSession(
                    avatar_id="doctor_avatar_1",
                    avatar_name="Heallink Health Assistant"
                )
                await avatar.start(session, room=ctx.room)
                logger.info("Custom Avatar Engine started and connected")
            else:
                logger.error("Custom Avatar Engine not available, falling back to Beyond Presence")
                use_custom_avatar = False
        
        if not use_custom_avatar:
            # Fallback to Beyond Presence avatar
            logger.info("Using Beyond Presence Avatar")
            from livekit.plugins import bey
            avatar = bey.AvatarSession(
                avatar_id="8c37d173-929f-4a71-9a5f-45840bb2422b",
                avatar_participant_identity="heallink-avatar",
                avatar_participant_name="Heallink Health Assistant",
            )
            await avatar.start(session, room=ctx.room)
            logger.info("Beyond Presence avatar started and joined the room")
        
        # Start the session with the greeting agent
        await session.start(
            room=ctx.room,
            agent=GreetingAgent(),
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),
            ),
        )
        
        # Start background audio for thinking states
        background_audio = BackgroundAudioPlayer(
            thinking_sound=[
                AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING, volume=0.3),
            ],
        )
        await background_audio.start(room=ctx.room, agent_session=session)
        
        # Monitor for edge cases
        asyncio.create_task(monitor_edge_cases(ctx, session, call_context))
        
        # If using custom avatar, demonstrate some features
        if use_custom_avatar and isinstance(avatar, CustomAvatarSession):
            # Change to medical office background after 5 seconds
            asyncio.create_task(demo_avatar_features(avatar))
        
        # Log session start
        logger.info(f"Heallink session started at {datetime.now()}")
        
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}", exc_info=True)
        try:
            await ctx.room.local_participant.publish_data(
                json.dumps({
                    "type": "error",
                    "message": "We're experiencing technical difficulties. Please try again later.",
                }),
                topic="system",
            )
        except:
            pass

async def demo_avatar_features(avatar: CustomAvatarSession):
    """Demonstrate avatar features during the session."""
    try:
        # Wait a bit for session to stabilize
        await asyncio.sleep(5)
        
        # Change to medical office background
        await avatar.set_background("medical_office")
        logger.info("Changed avatar background to medical office")
        
        # Demo different emotions during conversation
        await asyncio.sleep(10)
        await avatar._set_emotion("concerned", 0.7)
        
        await asyncio.sleep(10)
        await avatar._set_emotion("reassuring", 0.8)
        
        await asyncio.sleep(10)
        await avatar._set_emotion("neutral", 0.5)
        
    except Exception as e:
        logger.error(f"Error in avatar demo: {e}")

if __name__ == "__main__":
    # Configure worker options
    worker_options = WorkerOptions(
        entrypoint_fnc=entrypoint,
        drain_timeout=30,
        shutdown_process_timeout=5.0,
        host="0.0.0.0",
        port=0,
    )
    
    # Start the worker
    agents.cli.run_app(worker_options)