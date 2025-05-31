#!/usr/bin/env python3
"""
Test installation script to verify all dependencies are correctly installed.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def test_livekit_imports():
    """Test LiveKit imports."""
    print("Testing LiveKit imports...")
    try:
        import livekit
        print(f"✅ livekit version: {livekit.__version__}")
    except ImportError as e:
        print(f"❌ livekit import failed: {e}")
        return False
    
    try:
        from livekit import agents
        print("✅ livekit.agents imported successfully")
    except ImportError as e:
        print(f"❌ livekit.agents import failed: {e}")
        return False
    
    try:
        from livekit.agents import AgentSession
        print("✅ AgentSession imported successfully")
    except ImportError as e:
        print(f"❌ AgentSession import failed: {e}")
        return False
    
    return True

def test_avatar_engine_imports():
    """Test Avatar Engine imports."""
    print("\nTesting Avatar Engine imports...")
    try:
        sys.path.insert(0, 'src')
        from config.settings import AvatarConfig
        print("✅ AvatarConfig imported successfully")
    except ImportError as e:
        print(f"❌ AvatarConfig import failed: {e}")
        return False
    
    try:
        from plugin.avatar_session import AvatarSession
        print("✅ AvatarSession imported successfully")
    except ImportError as e:
        print(f"❌ AvatarSession import failed: {e}")
        return False
    
    try:
        from plugin.avatar_service import AvatarService
        print("✅ AvatarService imported successfully")
    except ImportError as e:
        print(f"❌ AvatarService import failed: {e}")
        return False
    
    return True

def test_dependencies():
    """Test core dependencies."""
    print("\nTesting core dependencies...")
    
    dependencies = [
        ("librosa", "Audio processing"),
        ("cv2", "Computer vision"),
        ("numpy", "Numerical computing"),
        ("aiohttp", "Async HTTP"),
        ("loguru", "Logging"),
        ("pydantic", "Data validation")
    ]
    
    failed = []
    for dep_name, description in dependencies:
        try:
            __import__(dep_name)
            print(f"✅ {dep_name} - {description}")
        except ImportError:
            print(f"❌ {dep_name} - {description} (FAILED)")
            failed.append(dep_name)
    
    return len(failed) == 0

def test_configuration():
    """Test configuration loading."""
    print("\nTesting configuration...")
    try:
        from config.settings import AvatarConfig, load_config
        
        # Test default configuration
        config = AvatarConfig()
        print(f"✅ Default config loaded - port: {config.port}")
        
        # Test environment-based config
        env_config = AvatarConfig.from_env()
        print(f"✅ Environment config loaded - host: {env_config.host}")
        
        return True
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🔍 Avatar Engine Installation Test")
    print("=" * 40)
    
    tests = [
        ("LiveKit Imports", test_livekit_imports),
        ("Avatar Engine Imports", test_avatar_engine_imports),
        ("Core Dependencies", test_dependencies),
        ("Configuration", test_configuration)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} FAILED with exception: {e}")
    
    print("\n" + "=" * 40)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Avatar Engine is ready to run.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the installation.")
        return 1

if __name__ == "__main__":
    sys.exit(main())