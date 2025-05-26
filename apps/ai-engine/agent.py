"""
Heallink Voice Agent - Main Entry Point
======================================
The main entry point for the Heallink voice agent system.
"""

import asyncio
import json
import logging
import sys
import os
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
    bey,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

from models.data_models import PatientData, CallContext
from agents.specialized_agents import GreetingAgent
from utils.monitoring import monitor_edge_cases

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def entrypoint(ctx: JobContext):
    """
    Main entry point for the Heallink agent
    
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
                # Pre-populate known data
                if "user_id" in metadata:
                    # In production, fetch user profile from database
                    pass
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
                language="multi",  # Multilingual support
                punctuate=True,
                filler_words=False,
                endpointing_ms=300,  # ms of silence
            ),
            llm=openai.LLM(
                model="gpt-4o",  # Use best model for healthcare
                temperature=0.3,  # Lower temperature for consistency
                max_completion_tokens=150,  # Keep responses concise
            ),
            tts=cartesia.TTS(
                voice="95856005-0332-41b0-935f-352e296aa0df",  # Irish accent
                speed=0.9,  # Slightly slower for clarity
            ),
            vad=silero.VAD.load(
                min_speech_duration=0.2,  # More responsive
                max_buffered_speech=60.0,  # Maximum amount of speech to buffer in seconds
                min_silence_duration=0.3,  # Short silence threshold
            ),
            turn_detection=MultilingualModel(
                # Using default values for turn detection
                unlikely_threshold=0.6,  # Lower threshold = more sensitive to end of turn
            ),
            userdata=call_context,
        )
        
        # Initialize Beyond Presence avatar
        avatar = bey.AvatarSession(
            avatar_id="8c37d173-929f-4a71-9a5f-45840bb2422b",  # Default avatar ID
            avatar_participant_identity="heallink-avatar",  # Custom identity
            avatar_participant_name="Heallink Health Assistant",  # Friendly display name
        )
        
        # Start the avatar and wait for it to join
        await avatar.start(session, room=ctx.room)
        logger.info("Beyond Presence avatar started and joined the room")
        
        # Start the session with the greeting agent
        await session.start(
            room=ctx.room,
            agent=GreetingAgent(),
            room_input_options=RoomInputOptions(
                noise_cancellation=noise_cancellation.BVC(),  # Best voice clarity
            ),
        )
        
        # Start background audio for thinking states
        background_audio = BackgroundAudioPlayer(
            thinking_sound=[
                AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING, volume=0.3),
            ],
        )
        # Make sure TTS is properly set up before starting background audio
        await background_audio.start(room=ctx.room, agent_session=session)
        
        # Monitor for edge cases
        asyncio.create_task(monitor_edge_cases(ctx, session, call_context))
        
        # Log session start
        logger.info(f"Heallink session started at {datetime.now()}")
        
    except Exception as e:
        logger.error(f"Error in entrypoint: {e}", exc_info=True)
        # Attempt graceful error handling
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

if __name__ == "__main__":
    # Configure worker options
    worker_options = WorkerOptions(
        entrypoint_fnc=entrypoint,
        drain_timeout=30,  # Wait up to 30 seconds for jobs to finish during shutdown
        shutdown_process_timeout=5.0,  # Wait up to 5 seconds for a process to shut down gracefully
        host="0.0.0.0",
        port=0,  # Use port 0 to let the OS assign an available port
    )
    
    # Start the worker
    agents.cli.run_app(worker_options)