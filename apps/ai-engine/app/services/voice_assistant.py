import asyncio
import logging
from typing import Optional
from livekit import rtc, agents
from app.core.config import settings
from functools import lru_cache

logger = logging.getLogger(__name__)

class VoiceAssistantService:
    """Service for managing LiveKit voice assistant agents"""
    
    def __init__(self):
        self.agent_sessions = {}
        
    async def connect_to_room(self, room_name: str, agent_identity: str):
        """Connect a voice assistant agent to a LiveKit room"""
        try:
            logger.info(f"Connecting agent {agent_identity} to room {room_name}")
            
            # Define the agent with instructions
            class Assistant(agents.Agent):
                def __init__(self):
                    super().__init__(instructions="You are a helpful healthcare assistant for the Heallink platform. Help the user with their healthcare needs, answer questions, and provide guidance.")
            
            # Setup the agent session
            async def entrypoint(ctx: agents.JobContext):
                session = agents.AgentSession(
                    # Configure STT (Speech-to-Text)
                    stt=agents.plugins.deepgram.STT(model="nova-3", language="en"),
                    
                    # Configure LLM (Language Model)
                    llm=agents.plugins.openai.LLM(model="gpt-4o-mini"),
                    
                    # Configure TTS (Text-to-Speech)
                    tts=agents.plugins.openai.TTS(voice="alloy"),
                )
                
                # Start the session with the agent
                await session.start(
                    room=ctx.room,
                    agent=Assistant(),
                )
                
                # Connect to the room
                await ctx.connect()
                
                # Generate initial greeting
                await session.generate_reply(
                    instructions="Greet the user and introduce yourself as Heallink's AI assistant. Offer to help them with their healthcare needs."
                )
            
            # Create worker options
            worker_options = agents.WorkerOptions(
                entrypoint_fnc=entrypoint,
                api_key=settings.LIVEKIT_API_KEY,
                api_secret=settings.LIVEKIT_API_SECRET,
                ws_url=settings.LIVEKIT_URL
            )
            
            # Run the agent application in a separate task
            loop = asyncio.get_event_loop()
            agent_task = loop.create_task(agents.run_app(worker_options))
            
            # Store the agent session for future reference
            self.agent_sessions[room_name] = {
                "identity": agent_identity,
                "task": agent_task
            }
            
            logger.info(f"Agent {agent_identity} connected to room {room_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error connecting agent to room: {str(e)}")
            raise

@lru_cache()
def get_voice_assistant_service() -> VoiceAssistantService:
    """Get or create a voice assistant service singleton"""
    return VoiceAssistantService()
