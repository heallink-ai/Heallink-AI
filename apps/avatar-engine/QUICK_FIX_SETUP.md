# Quick Fix Setup Guide

The issue you encountered is due to an invalid classifier in the `pyproject.toml`. Here's the **simplified setup** that works immediately:

## ✅ Fixed Setup (Use This)

```bash
# 1. Navigate to avatar-engine directory
cd apps/avatar-engine

# 2. Create virtual environment with UV
uv venv
source .venv/bin/activate  # macOS/Linux

# 3. Install dependencies with specific LiveKit versions
uv pip install -r requirements.txt

# 4. Test installation
python -c "
import sys
sys.path.insert(0, 'src')
from config.settings import AvatarConfig
print('✅ Installation successful!')
"

# 5. Create configuration
cp .env.example .env

# 6. Start the service
python src/main.py --dev --port 8080
```

## 🔧 What Was Fixed

The error was caused by an invalid PyPI classifier:
```toml
# ❌ Invalid classifier
"Topic :: Communications :: Video Conferencing"

# ✅ Fixed to valid classifier  
"Topic :: Communications"
```

## 🚀 Simplified Installation Process

**Skip the editable install** and use the direct method:

```bash
# ❌ Don't use this (causes classifier error):
# uv pip install -e ".[dev]"

# ✅ Use this instead:
uv pip install -r requirements.txt

# ✅ For development tools (optional):
uv pip install pytest black isort flake8 mypy
```

## 📦 What Gets Installed

**Core Dependencies (from requirements.txt):**
- ✅ livekit==1.0.8
- ✅ livekit-agents==1.0.22
- ✅ livekit-api==1.0.2
- ✅ livekit-plugins-bey==1.0.22 (BeyondPresence avatar integration)
- ✅ livekit-plugins-cartesia==1.0.22 (TTS)
- ✅ livekit-plugins-deepgram==1.0.22 (STT)
- ✅ librosa>=0.10.0 (audio processing)
- ✅ opencv-python>=4.8.0 (computer vision)
- ✅ torch>=2.0.0 (machine learning)
- ✅ aiortc>=1.6.0 (WebRTC)
- ✅ aiohttp>=3.8.0 (web server)
- ✅ pydantic>=2.0.0 (configuration)
- ✅ loguru>=0.7.0 (logging)

## 🧪 Quick Test

```bash
# Test core functionality
python tools/test_avatar.py --avatar-id doctor_avatar_1

# Test service API
curl http://localhost:8080/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-01T00:00:00",
#   "uptime_seconds": 5.2,
#   "active_sessions": 0
# }
```

## 📁 Minimal Asset Setup

For immediate testing, create these placeholder files:

```bash
# Create asset directories
mkdir -p assets/{models,textures,backgrounds,sounds}

# Create placeholder files (will work with fallback rendering)
touch assets/models/doctor_avatar_1.glb
touch assets/backgrounds/medical_office.jpg
touch assets/sounds/test_speech.wav

# Service will run with placeholder mode
```

## 🎯 Next Steps After Setup

1. **Verify Service**: `curl http://localhost:8080/health`
2. **Create Session**: `curl -X POST http://localhost:8080/avatars -H "Content-Type: application/json" -d '{"avatar_id": "doctor_avatar_1"}'`
3. **Test Emotions**: `curl -X POST http://localhost:8080/avatars/SESSION_ID/emotion -H "Content-Type: application/json" -d '{"emotion": "happy", "intensity": 0.8}'`
4. **Add Real Assets**: Download ReadyPlayer.me avatars when ready

The Avatar Engine will now start successfully! 🚀