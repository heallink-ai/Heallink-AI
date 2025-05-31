"""
Avatar Worker - LiveKit Worker Implementation

This module provides the LiveKit worker that handles avatar plugin dispatch.
"""

import asyncio
from typing import Optional

from loguru import logger

try:
    from livekit import agents
    from livekit.agents import WorkerOptions, JobContext
    LIVEKIT_AVAILABLE = True
except ImportError:
    LIVEKIT_AVAILABLE = False
    agents = None
    WorkerOptions = None
    JobContext = None

from config.settings import AvatarConfig
from .avatar_session import AvatarSession


class AvatarWorker:
    """LiveKit worker for avatar plugin."""
    
    def __init__(self, config: AvatarConfig):
        self.config = config
        self.worker: Optional[Any] = None
        
        if not LIVEKIT_AVAILABLE:
            logger.error("LiveKit not available - cannot create avatar worker")
    
    async def start(self) -> None:
        """Start the LiveKit worker."""
        if not LIVEKIT_AVAILABLE:
            raise RuntimeError("LiveKit not available")
        
        logger.info("Starting LiveKit avatar worker")
        
        # Create worker
        self.worker = agents.Worker(
            entrypoint=self.entrypoint,
            options=WorkerOptions(
                agent_name="avatar-engine",
                max_retry=3,
                prewarm_connections=2
            )
        )
        
        # Start worker
        await self.worker.start()
    
    async def entrypoint(self, ctx: JobContext) -> None:
        """Main entrypoint for avatar jobs."""
        logger.info(f"Avatar job started: {ctx.job.id}")
        
        try:
            await ctx.connect()
            
            # Create avatar session for this job
            avatar_session = AvatarSession(
                avatar_id=self.config.default_avatar_id,
                config=self.config
            )
            
            # Start avatar session
            await avatar_session.start(
                agent_session=None,  # Will be created by the job
                room=ctx.room,
                session_id=ctx.job.id
            )
            
            # Keep the session running
            while ctx.room.connection_state == "connected":
                await asyncio.sleep(1)
                
        except Exception as e:
            logger.error(f"Avatar job error: {e}")
        finally:
            if 'avatar_session' in locals():
                await avatar_session.stop()
            logger.info(f"Avatar job ended: {ctx.job.id}")
    
    async def stop(self) -> None:
        """Stop the worker."""
        if self.worker:
            await self.worker.aclose()
        logger.info("Avatar worker stopped")