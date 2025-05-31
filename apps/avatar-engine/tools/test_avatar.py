#!/usr/bin/env python3
"""
Avatar Test Tool

Simple tool for testing avatar functionality without LiveKit integration.
"""

import asyncio
import argparse
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from config.settings import AvatarConfig
from plugin.avatar_session import AvatarSession
from utils.logging import setup_logging


async def test_avatar_rendering(avatar_id: str, duration: int = 10):
    """Test avatar rendering for specified duration."""
    print(f"Testing avatar: {avatar_id}")
    
    # Create configuration
    config = AvatarConfig()
    config.debug = True
    
    # Create avatar session
    session = AvatarSession(avatar_id, config)
    
    try:
        # Initialize components
        await session._initialize_components()
        session.is_active = True
        
        print("Avatar components initialized")
        
        # Test facial expressions
        emotions = ["happy", "sad", "angry", "surprised"]
        for emotion in emotions:
            print(f"Testing emotion: {emotion}")
            await session.update_emotion(emotion, 0.8)
            await asyncio.sleep(2)
        
        # Test lip sync with dummy audio
        import numpy as np
        dummy_audio = np.random.random(48000).astype(np.float32)  # 1 second of audio
        
        print("Testing lip sync")
        await session.process_audio(dummy_audio.tobytes())
        await asyncio.sleep(2)
        
        # Test background change
        print("Testing background change")
        await session.set_background("clinic_room")
        await asyncio.sleep(2)
        
        # Get metrics
        metrics = session.get_metrics()
        print(f"Session metrics: {metrics}")
        
        print(f"Test completed successfully!")
        
    except Exception as e:
        print(f"Test failed: {e}")
        return False
    finally:
        await session.stop()
    
    return True


async def test_service_api():
    """Test the standalone service API."""
    from plugin.avatar_service import AvatarService
    
    print("Testing Avatar Service API")
    
    config = AvatarConfig()
    config.debug = True
    config.port = 8081  # Use different port for testing
    
    service = AvatarService(config)
    
    try:
        await service.start()
        print("Service started successfully")
        
        # Test basic endpoints would go here
        # For now, just start and stop
        await asyncio.sleep(2)
        
        print("Service test completed")
        
    except Exception as e:
        print(f"Service test failed: {e}")
        return False
    finally:
        await service.stop()
    
    return True


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Avatar Engine Test Tool")
    parser.add_argument(
        "--avatar-id",
        default="doctor_avatar_1",
        help="Avatar ID to test"
    )
    parser.add_argument(
        "--duration",
        type=int,
        default=10,
        help="Test duration in seconds"
    )
    parser.add_argument(
        "--test-service",
        action="store_true",
        help="Test service API instead of avatar rendering"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(
        level="DEBUG" if args.verbose else "INFO",
        debug=args.verbose
    )
    
    try:
        if args.test_service:
            success = asyncio.run(test_service_api())
        else:
            success = asyncio.run(test_avatar_rendering(args.avatar_id, args.duration))
        
        if success:
            print("✅ All tests passed!")
            sys.exit(0)
        else:
            print("❌ Tests failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"❌ Test error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()