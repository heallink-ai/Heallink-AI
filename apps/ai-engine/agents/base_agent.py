"""
Base Agent
==========
Base agent class with common functionality for all Heallink agents
"""

import re
import logging
from datetime import datetime
from typing import AsyncIterable, Optional

from livekit import rtc
from livekit.agents import (
    Agent,
    ChatContext,
    ChatMessage,
    ModelSettings,
    get_job_context,
    function_tool,
)
from livekit.agents import stt, tts

from models.data_models import CallContext

logger = logging.getLogger(__name__)

class HealLinkAgent(Agent):
    """Base class for all Heallink agents with common functionality"""
    
    def __init__(self, instructions: str, tts_voice: Optional[str] = None, **kwargs):
        # We don't need to set TTS here since the AgentSession has it
        # The TTS is properly defined in the AgentSession initialization
        super().__init__(
            instructions=instructions,
            **kwargs
        )
    
    async def on_user_turn_completed(self, turn_ctx: ChatContext, new_message: ChatMessage) -> None:
        """
        Handle privacy and profanity filtering
        
        Args:
            turn_ctx: Chat context
            new_message: User's message
        """
        # Get call context
        ctx: CallContext = self.session.userdata
        
        # Update interaction tracking
        ctx.interaction_count += 1
        ctx.last_interaction_time = datetime.now()
        
        # Filter profanity
        profanity_list = ["fuck", "shit", "damn"]  # Simplified list
        # Handle both string and ChatMessage objects
        text = new_message if isinstance(new_message, str) else new_message.text_content
        
        for word in profanity_list:
            if word in text.lower():
                # Give warning on first offense
                if ctx.interaction_count == 1:
                    await self.session.say(
                        "I understand you may be frustrated, but please keep our conversation respectful. "
                        "How can I help you today?"
                    )
                    return
                # Terminate on repeated offense
                elif ctx.interaction_count > 1:
                    await self.session.say(
                        "I'm sorry, but I need to end this call due to inappropriate language. "
                        "Please call back when you're ready to have a respectful conversation."
                    )
                    room = get_job_context().room
                    await room.disconnect()
                    return
        
        # Check for emergency keywords
        emergency_keywords = ["chest pain", "can't breathe", "bleeding", "unconscious", "kill myself"]
        if any(keyword in text.lower() for keyword in emergency_keywords):
            ctx.emergency_flagged = True
            ctx.patient_data.is_emergency = True
    
    async def stt_node(
        self, 
        audio: AsyncIterable[rtc.AudioFrame], 
        model_settings: ModelSettings
    ) -> Optional[AsyncIterable[stt.SpeechEvent]]:
        """
        Custom STT processing for accent handling
        
        Args:
            audio: Stream of audio frames
            model_settings: STT model settings
            
        Returns:
            Stream of speech events
        """
        # Pre-process audio for better accent recognition
        async def processed_audio():
            async for frame in audio:
                # In production, apply accent-specific audio preprocessing
                yield frame
        
        # Use default STT with processed audio
        return Agent.default.stt_node(self, processed_audio(), model_settings)
    
    async def tts_node(
        self,
        text: AsyncIterable[str],
        model_settings: ModelSettings
    ) -> AsyncIterable[rtc.AudioFrame]:
        """
        Custom TTS for pronunciation and pacing
        
        Args:
            text: Stream of text chunks
            model_settings: TTS model settings
            
        Returns:
            Stream of audio frames
        """
        async def processed_text():
            async for chunk in text:
                # Fix medical pronunciations
                chunk = chunk.replace("mg", " milligrams")
                chunk = chunk.replace("ECG", "E C G")
                chunk = chunk.replace("A&E", "A and E")
                chunk = chunk.replace("GP", "G P")
                
                # Add pauses for better comprehension
                chunk = re.sub(r'([.!?])', r'\1 <break time="0.5s"/>', chunk)
                
                yield chunk
        
        # Adjust speech rate for clarity
        async for frame in Agent.default.tts_node(self, processed_text(), model_settings):
            yield frame