"""
HealLink Avatar Engine v2.0 - Main Application
Real-time 2D Avatar Lip-sync Engine powered by MuseTalk
"""

import asyncio
import uvicorn
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from .core.config import AvatarConfig, load_config
from .api.routes import create_avatar_router, create_system_router
from .utils.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("🚀 HealLink Avatar Engine v2.0 starting up...")
    yield
    # Shutdown
    logger.info("⚡ HealLink Avatar Engine shutting down...")


def create_app(config: AvatarConfig) -> FastAPI:
    """Create FastAPI application with all routes and middleware."""
    
    app = FastAPI(
        title="HealLink Avatar Engine",
        description="Real-time 2D Avatar Lip-sync Engine powered by MuseTalk",
        version="2.0.0",
        docs_url="/docs" if config.debug else None,
        redoc_url="/redoc" if config.debug else None,
        lifespan=lifespan
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure appropriately for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(create_avatar_router(config))
    app.include_router(create_system_router())
    
    @app.get("/")
    async def root():
        """Root endpoint with service information."""
        return {
            "service": "HealLink Avatar Engine",
            "version": "2.0.0",
            "description": "Real-time 2D Avatar Lip-sync Engine powered by MuseTalk",
            "docs": "/docs" if config.debug else "Documentation disabled in production",
            "health": "/health",
            "endpoints": {
                "avatars": "/avatars",
                "health": "/health",
                "metrics": "/metrics"
            }
        }
    
    return app


def main():
    """Main entry point for the avatar engine."""
    import typer
    
    def run(
        host: str = typer.Option("0.0.0.0", help="Host to bind to"),
        port: int = typer.Option(8080, help="Port to bind to"),
        dev: bool = typer.Option(False, help="Enable development mode"),
        reload: bool = typer.Option(False, help="Enable auto-reload"),
        log_level: str = typer.Option("INFO", help="Logging level"),
    ):
        """Run the Avatar Engine server."""
        
        # Load configuration
        config = load_config()
        
        # Override config with CLI arguments
        config.host = host
        config.port = port
        config.debug = dev
        config.log_level = log_level
        
        # Setup logging
        setup_logging(config)
        
        # Create FastAPI app
        app = create_app(config)
        
        # Configure uvicorn
        uvicorn_config = {
            "app": app,
            "host": config.host,
            "port": config.port,
            "log_level": config.log_level.lower(),
        }
        
        # Only enable reload if explicitly requested and using import string
        if reload:
            uvicorn_config["reload"] = True
        
        logger.info(f"🎭 Starting HealLink Avatar Engine v2.0")
        logger.info(f"🌐 Server: http://{config.host}:{config.port}")
        logger.info(f"📊 Docs: http://{config.host}:{config.port}/docs" if config.debug else "📊 Docs: Disabled in production")
        logger.info(f"🎯 Device: {config.device}")
        logger.info(f"🎬 Video FPS: {config.video_fps}")
        logger.info(f"👥 Max sessions: {config.max_concurrent_sessions}")
        
        # Run server
        uvicorn.run(**uvicorn_config)
    
    # Create typer app and run
    typer_app = typer.Typer(help="HealLink Avatar Engine v2.0")
    typer_app.command()(run)
    typer_app()


if __name__ == "__main__":
    main()