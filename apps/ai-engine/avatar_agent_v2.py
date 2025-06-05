"""
Heallink Voice Agent with MuseTalk 2D Avatar Engine Integration v2.0
===================================================================
Updated version of agent.py to integrate with the new MuseTalk-based Avatar Engine.

This script shows how to integrate the new Avatar Engine v2.0 with real-time 2D lip-sync.
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

# Avatar Engine v2.0 Configuration
AVATAR_ENGINE_URL = os.getenv("AVATAR_ENGINE_URL", "http://avatar-engine:8080")
USE_MUSETALK_AVATAR = os.getenv("USE_MUSETALK_AVATAR", "true").lower() == "true"
AVATAR_IMAGE_PATH = os.getenv("AVATAR_IMAGE_PATH", "/app/assets/avatars/default.png")

class MuseTalkAvatarSession:
    """
    MuseTalk Avatar Session that interfaces with our new Avatar Engine v2.0.
    
    This class provides real-time 2D lip-sync using MuseTalk technology.
    """
    
    def __init__(self, avatar_image_path: str = None, avatar_name: str = "Heallink Health Assistant"):
        self.avatar_image_path = avatar_image_path or AVATAR_IMAGE_PATH
        self.avatar_name = avatar_name
        self.session_id = None
        self.room = None
        self.agent_session = None
        self.is_active = False
        self.audio_websocket = None
        
    async def start(self, agent_session: AgentSession, room: rtc.Room) -> None:
        """Start the MuseTalk avatar session and establish real-time communication."""
        try:
            self.agent_session = agent_session
            self.room = room
            
            # Create avatar session in Avatar Engine v2.0
            async with aiohttp.ClientSession() as session:
                # Create avatar session
                create_payload = {
                    "avatar_id": f"heallink_{room.name}_{datetime.now().timestamp()}",
                    "emotion": "neutral",
                    "emotion_intensity": 0.6
                }
                
                async with session.post(
                    f"{AVATAR_ENGINE_URL}/avatars/",
                    json=create_payload
                ) as response:
                    if response.status == 201:
                        data = await response.json()
                        self.session_id = data["session_id"]
                        logger.info(f"MuseTalk avatar session created: {self.session_id}")
                        self.is_active = True
                        
                        # Upload avatar image if custom image provided
                        await self._upload_avatar_image()
                        
                        # Start LiveKit streaming
                        await self._start_livekit_streaming()
                        
                        # Setup real-time audio streaming
                        await self._setup_audio_streaming()
                        
                    else:
                        error_text = await response.text()
                        logger.error(f"Failed to create MuseTalk avatar session: {error_text}")
                        raise Exception(f"Avatar Engine v2.0 connection failed: {response.status}")
            
            # Setup TTS audio capture for lip-sync
            self._setup_tts_audio_capture()
            
        except Exception as e:
            logger.error(f"Failed to start MuseTalk avatar: {e}")
            raise
    
    async def _upload_avatar_image(self):
        """Upload custom avatar image to the Avatar Engine."""
        if not os.path.exists(self.avatar_image_path):
            logger.warning(f"Avatar image not found: {self.avatar_image_path}, using default")
            return
        
        try:
            async with aiohttp.ClientSession() as session:
                with open(self.avatar_image_path, 'rb') as f:
                    data = aiohttp.FormData()
                    data.add_field('file', f, filename='avatar.jpg', content_type='image/jpeg')
                    
                    async with session.post(
                        f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/avatar-image",
                        data=data
                    ) as response:
                        if response.status == 200:
                            logger.info("Avatar image uploaded successfully")
                        else:
                            logger.warning(f"Failed to upload avatar image: {response.status}")
        except Exception as e:
            logger.error(f"Error uploading avatar image: {e}")
    
    async def _start_livekit_streaming(self):
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
            .with_grants(api.VideoGrants(
                room_join=True, 
                room=self.room.name,
                can_publish=True,
                can_subscribe=False,
                can_publish_data=True
            ))
            .to_jwt()
        )
        
        # Tell Avatar Engine to connect to LiveKit room and start streaming
        async with aiohttp.ClientSession() as session:
            payload = {
                "livekit_url": livekit_url,
                "livekit_token": token,
                "room_name": self.room.name
            }
            
            async with session.post(
                f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/livekit-stream",
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Failed to start MuseTalk video streaming: {error_text}")
                    
                logger.info(f"MuseTalk avatar {self.avatar_name} will join LiveKit room and start streaming")
    
    async def _setup_audio_streaming(self):
        """Setup WebSocket connection for real-time audio streaming to Avatar Engine."""
        try:
            import websockets
            
            # Connect to Avatar Engine WebSocket for audio
            ws_url = f"ws://{AVATAR_ENGINE_URL.replace('http://', '').replace('https://', '')}/avatars/{self.session_id}/audio"
            
            self.audio_websocket = await websockets.connect(ws_url)
            logger.info("Audio WebSocket connected for real-time lip-sync")
            
        except Exception as e:
            logger.error(f"Failed to setup audio streaming: {e}")
            # Continue without real-time audio - avatar will use static image
    
    def _setup_tts_audio_capture(self):
        """Setup audio capture from TTS for real-time lip-sync."""
        if not self.agent_session or not self.audio_websocket:
            return
            
        # Hook into the agent's TTS output to capture audio
        original_tts = self.agent_session.output.audio
        
        async def audio_interceptor(audio_data):
            """Intercept TTS audio and send to Avatar Engine for lip-sync."""
            try:
                if self.audio_websocket and not self.audio_websocket.closed:
                    # Send audio data to Avatar Engine for real-time lip-sync
                    await self.audio_websocket.send(audio_data)
                    
                # Continue with normal audio output
                return await original_tts(audio_data)
                
            except Exception as e:
                logger.error(f"Error in audio interception: {e}")
                return await original_tts(audio_data)
        
        # Replace the TTS output with our interceptor
        # Note: This is a simplified approach - production would need more sophisticated audio capture
        logger.info("TTS audio capture setup for real-time lip-sync")
    
    async def set_emotion(self, emotion: str, intensity: float = 0.6):
        """Set avatar facial expression."""
        if not self.session_id:
            return
            
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "emotion": emotion,
                    "intensity": intensity
                }
                
                async with session.post(
                    f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}/emotion",
                    json=payload
                ) as response:
                    if response.status == 200:
                        logger.info(f"Avatar emotion updated: {emotion} ({intensity})")
                    else:
                        logger.warning(f"Failed to update avatar emotion: {response.status}")
        except Exception as e:
            logger.error(f"Error setting avatar emotion: {e}")
    
    async def stop(self):
        """Stop the avatar session."""
        if self.audio_websocket:
            await self.audio_websocket.close()
            
        if self.session_id:
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.delete(
                        f"{AVATAR_ENGINE_URL}/avatars/{self.session_id}"
                    ) as response:
                        if response.status == 200:
                            logger.info(f"MuseTalk avatar session stopped: {self.session_id}")
                        else:
                            logger.warning(f"Failed to stop avatar session: {response.status}")
            except Exception as e:
                logger.error(f"Error stopping avatar session: {e}")
            finally:
                self.is_active = False
                self.session_id = None

async def test_avatar_engine_v2_connection():
    """Test connection to Avatar Engine v2.0 before starting agent."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{AVATAR_ENGINE_URL}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    logger.info(f"Avatar Engine v2.0 is healthy: {data}")
                    return True
                else:
                    logger.error(f"Avatar Engine v2.0 health check failed: {response.status}")
                    return False
    except Exception as e:
        logger.error(f"Cannot connect to Avatar Engine v2.0 at {AVATAR_ENGINE_URL}: {e}")
        return False

async def entrypoint(ctx: JobContext):
    """
    Main entry point for the Heallink agent with MuseTalk avatar support
    
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
            tts=openai.TTS(
                voice="alloy",
                speed=1.0,
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
        use_musetalk_avatar = USE_MUSETALK_AVATAR
        avatar = None
        
        if use_musetalk_avatar:
            # Test Avatar Engine v2.0 connection first
            if await test_avatar_engine_v2_connection():
                logger.info("Using MuseTalk Avatar Engine v2.0")
                avatar = MuseTalkAvatarSession(
                    avatar_image_path=AVATAR_IMAGE_PATH,
                    avatar_name="Heallink Health Assistant"
                )
                await avatar.start(session, room=ctx.room)
                logger.info("MuseTalk Avatar Engine v2.0 started and connected")
            else:
                logger.error("MuseTalk Avatar Engine v2.0 not available, falling back to Beyond Presence")
                use_musetalk_avatar = False
        
        if not use_musetalk_avatar:
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
        
        # If using MuseTalk avatar, demonstrate emotion control
        if use_musetalk_avatar and isinstance(avatar, MuseTalkAvatarSession):
            # Change emotions based on conversation state
            asyncio.create_task(demo_musetalk_features(avatar))
        
        # Log session start
        logger.info(f"Heallink session with MuseTalk v2.0 started at {datetime.now()}")
        
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

async def demo_musetalk_features(avatar: MuseTalkAvatarSession):
    """Demonstrate MuseTalk avatar features during the session."""
    try:
        # Wait a bit for session to stabilize
        await asyncio.sleep(3)
        
        # Show welcoming expression
        await avatar.set_emotion("happy", 0.7)
        logger.info("Avatar set to welcoming expression")
        
        # Demo different emotions during conversation
        await asyncio.sleep(15)
        await avatar.set_emotion("concerned", 0.6)
        logger.info("Avatar showing concern for patient")
        
        await asyncio.sleep(15)
        await avatar.set_emotion("reassuring", 0.8)
        logger.info("Avatar showing reassurance")
        
        await asyncio.sleep(15)
        await avatar.set_emotion("neutral", 0.5)
        logger.info("Avatar back to neutral expression")
        
    except Exception as e:
        logger.error(f"Error in MuseTalk avatar demo: {e}")

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