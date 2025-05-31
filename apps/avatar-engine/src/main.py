#!/usr/bin/env python3
"""
HealLink Avatar Engine - Main Entry Point

This is the main entry point for the Avatar Engine service.
It can run in different modes:
- Standalone server mode
- LiveKit plugin mode
- Development mode with hot reload
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path
from typing import Optional

from loguru import logger

# Add src to Python path
sys.path.insert(0, str(Path(__file__).parent))

from config.settings import AvatarConfig, load_config
from utils.logging import setup_logging
from plugin.avatar_service import AvatarService


async def run_standalone_server(config: AvatarConfig) -> None:
    """Run the avatar engine as a standalone server."""
    logger.info("Starting Avatar Engine in standalone mode")
    
    service = AvatarService(config)
    
    try:
        await service.start()
        logger.info(f"Avatar Engine listening on {config.host}:{config.port}")
        
        # Keep the service running
        while True:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    except Exception as e:
        logger.error(f"Service error: {e}")
        raise
    finally:
        await service.stop()
        logger.info("Avatar Engine stopped")


async def run_livekit_plugin(config: AvatarConfig) -> None:
    """Run as a LiveKit plugin worker."""
    from livekit import agents
    from plugin.avatar_worker import AvatarWorker
    
    logger.info("Starting Avatar Engine as LiveKit plugin")
    
    # Create and start the agent worker
    worker = AvatarWorker(config)
    await worker.start()


def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="HealLink Avatar Engine - Real-time 3D Avatar Rendering"
    )
    parser.add_argument(
        "--mode",
        choices=["standalone", "livekit", "dev"],
        default="standalone",
        help="Run mode (default: standalone)"
    )
    parser.add_argument(
        "--config",
        type=str,
        help="Configuration file path"
    )
    parser.add_argument(
        "--dev",
        action="store_true",
        help="Enable development mode"
    )
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="Host to bind to (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8080,
        help="Port to bind to (default: 8080)"
    )
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Log level (default: INFO)"
    )
    parser.add_argument(
        "--gpu",
        action="store_true",
        help="Enable GPU acceleration"
    )
    
    args = parser.parse_args()
    
    # Load configuration
    config = load_config(args.config)
    
    # Override config with command line arguments
    if args.host:
        config.host = args.host
    if args.port:
        config.port = args.port
    if args.dev:
        config.debug = True
        args.mode = "dev"
    if args.gpu:
        config.gpu_enabled = True
    
    # Setup logging
    setup_logging(
        level=args.log_level,
        debug=config.debug,
        log_file=config.log_file
    )
    
    logger.info(f"Starting Avatar Engine v{config.version}")
    logger.info(f"Mode: {args.mode}")
    logger.info(f"Host: {config.host}:{config.port}")
    logger.info(f"GPU Enabled: {config.gpu_enabled}")
    logger.info(f"Debug: {config.debug}")
    
    try:
        if args.mode == "livekit":
            asyncio.run(run_livekit_plugin(config))
        else:
            asyncio.run(run_standalone_server(config))
    except KeyboardInterrupt:
        logger.info("Shutdown requested by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()