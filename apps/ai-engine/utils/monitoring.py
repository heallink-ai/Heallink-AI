"""
Monitoring Utilities
===================
Utilities for monitoring call state and handling edge cases
"""

import asyncio
import logging
from datetime import datetime, timedelta

from livekit import rtc
from livekit.agents import AgentSession, JobContext

from models.data_models import CallContext

logger = logging.getLogger(__name__)

async def monitor_edge_cases(ctx: JobContext, session: AgentSession, call_context: CallContext):
    """
    Monitor for edge cases during the call
    
    Args:
        ctx: LiveKit job context
        session: Agent session
        call_context: Call context data
    """
    try:
        while ctx.room.connection_state == rtc.ConnectionState.CONN_CONNECTED:
            # Monitor for battery low
            if not call_context.battery_warning_sent:
                # Check if we've received battery status from frontend
                # This would come via data channel in production
                pass
            
            # Monitor for long silence (possible disconnect)
            if call_context.last_interaction_time:
                silence_duration = datetime.now() - call_context.last_interaction_time
                if silence_duration > timedelta(seconds=30):
                    await session.say("Hello? Are you still there?")
                    call_context.last_interaction_time = datetime.now()
            
            # Monitor for child voice patterns
            # In production, use voice analysis to detect child speakers
            
            await asyncio.sleep(5)  # Check every 5 seconds
            
    except Exception as e:
        logger.error(f"Error in edge case monitoring: {e}", exc_info=True)