# Avatar Engine - Detailed Setup Guide

This guide provides step-by-step instructions to get the Avatar Engine running and tested.

## Prerequisites

### System Requirements
- **Python 3.11+** (check with `python --version`)
- **Node.js 18+** (check with `node --version`)
- **UV package manager** (install: `pip install uv`)
- **Docker & Docker Compose** (optional, for containerized setup)
- **Git** (for cloning dependencies)

### Hardware Requirements
- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores, GPU (optional)
- **Storage**: 2GB free space for models and assets

## Step 1: Environment Setup

### Install UV Package Manager
```bash
# Install UV if not already installed
pip install uv

# Verify installation
uv --version
```

### Setup Python Environment
```bash
# Navigate to avatar-engine directory
cd apps/avatar-engine

# Create virtual environment with UV
uv venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Verify Python version
python --version  # Should show 3.11+
```

### Install Python Dependencies
```bash
# Install core dependencies
uv pip install -r requirements.txt

# For development tools (optional)
uv pip install pytest pytest-asyncio pytest-cov black isort flake8 mypy

# For GPU support (optional - NVIDIA CUDA)
uv pip install cupy-cuda12x onnxruntime-gpu
```

## Step 2: Install System Dependencies

### Audio Processing (Required for Lip Sync)
```bash
# macOS
brew install ffmpeg portaudio

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ffmpeg libportaudio2 libsndfile1-dev

# Fedora/RHEL
sudo dnf install ffmpeg portaudio-devel libsndfile-devel
```

### Rhubarb Lip Sync (Recommended)
```bash
# Download Rhubarb Lip Sync
# macOS
wget https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/rhubarb-lip-sync-1.13.0-osx.zip
unzip rhubarb-lip-sync-1.13.0-osx.zip
sudo cp rhubarb-lip-sync-1.13.0-osx/rhubarb /usr/local/bin/

# Linux
wget https://github.com/DanielSWolf/rhubarb-lip-sync/releases/download/v1.13.0/rhubarb-lip-sync-1.13.0-linux.zip
unzip rhubarb-lip-sync-1.13.0-linux.zip
sudo cp rhubarb-lip-sync-1.13.0-linux/rhubarb /usr/local/bin/

# Verify installation
rhubarb --version
```

## Step 3: Asset Preparation

### Directory Structure Setup
```bash
# Create asset directories
mkdir -p assets/{models,textures,backgrounds,sounds,config}

# Set proper permissions
chmod -R 755 assets/
```

### Required Assets

#### 1. 3D Avatar Models

**ReadyPlayer.me Integration (Recommended)**

ReadyPlayer.me avatars come with built-in blend shapes! Here's how to get them:

```bash
# Create ReadyPlayer.me avatar
# 1. Go to https://readyplayer.me/
# 2. Create your avatar
# 3. Get the .glb file URL

# Download avatar (replace with your avatar URL)
curl -o assets/models/doctor_avatar_1.glb "https://models.readyplayer.me/YOUR_AVATAR_ID.glb"

# Or use wget
wget -O assets/models/doctor_avatar_1.glb "https://models.readyplayer.me/YOUR_AVATAR_ID.glb"
```

**ReadyPlayer.me Blend Shapes (Built-in)**
ReadyPlayer.me avatars include these standard blend shapes:
- `mouthOpen`
- `mouthSmile` 
- `mouthFrown`
- `eyeBlinkLeft`
- `eyeBlinkRight`
- `eyebrowDownLeft`
- `eyebrowDownRight`
- `eyebrowUpLeft`
- `eyebrowUpRight`
- `jawOpen`
- `mouthPucker`
- `mouthStretch`
- And 40+ more expressions

#### 2. Alternative: Sample Assets
If you don't have ReadyPlayer.me avatars, create placeholders:

```bash
# Create placeholder model files
touch assets/models/doctor_avatar_1.glb
touch assets/models/doctor_avatar_2.glb
touch assets/models/nurse_avatar_1.glb

# Create placeholder textures
mkdir -p assets/textures
touch assets/textures/doctor_female_01_diffuse.jpg
touch assets/textures/doctor_male_01_diffuse.jpg
```

#### 3. Background Images
```bash
# Download free medical backgrounds or create solid colors
# Medical office background (example)
curl -o assets/backgrounds/medical_office.jpg "https://example.com/medical-office.jpg"

# Or create solid color backgrounds
convert -size 1920x1080 xc:'#f0f8ff' assets/backgrounds/medical_office.jpg
convert -size 1920x1080 xc:'#f5f5dc' assets/backgrounds/clinic_room.jpg
```

#### 4. Test Audio Files
```bash
# Create test audio for lip sync testing
mkdir -p assets/sounds

# Generate test audio with speech
# Option 1: Record yourself saying "Hello, how are you today?"
# Option 2: Use text-to-speech
say "Hello, how are you today? I am your AI assistant." -o assets/sounds/test_speech.wav

# Option 3: Download sample speech
curl -o assets/sounds/test_speech.wav "https://www.soundjay.com/misc/sounds/test.wav"
```

## Step 4: Configuration

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # or use your preferred editor
```

### Essential Environment Variables
```bash
# .env file content
AVATAR_ENGINE_HOST=0.0.0.0
AVATAR_ENGINE_PORT=8080
DEBUG=true
LOG_LEVEL=DEBUG

# LiveKit (optional for standalone testing)
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_secret

# Performance
GPU_ENABLED=false
MAX_CONCURRENT_AVATARS=3
AVATAR_QUALITY=medium

# Video settings
VIDEO_RESOLUTION=1080p
VIDEO_FPS=30

# Lip sync
LIP_SYNC_MODEL=rhubarb
```

### Avatar Configuration
```bash
# Update avatar configuration to match your assets
nano config/avatars.yaml
```

Update the avatar IDs and file paths to match your downloaded models:
```yaml
avatars:
  doctor_avatar_1:
    name: "Dr. Sarah Chen"
    model_file: "doctor_avatar_1.glb"  # Your ReadyPlayer.me file
    blend_shapes:
      - "mouthOpen"      # ReadyPlayer.me standard
      - "mouthSmile"     # ReadyPlayer.me standard
      - "mouthFrown"     # ReadyPlayer.me standard
      - "eyeBlinkLeft"   # ReadyPlayer.me standard
      - "eyeBlinkRight"  # ReadyPlayer.me standard
      - "jawOpen"        # ReadyPlayer.me standard
```

## Step 5: Running the Avatar Engine

### Option A: Standalone Development Mode
```bash
# Start in development mode
python src/main.py --dev --host 0.0.0.0 --port 8080 --log-level DEBUG

# You should see:
# ✅ Avatar Engine v0.1.0 started successfully
# 🌐 Listening on http://0.0.0.0:8080
# 📊 Health check: http://localhost:8080/health
```

### Option B: Docker Mode
```bash
# Build and run with Docker
docker-compose up avatar-engine

# Or run in detached mode
docker-compose up -d avatar-engine

# View logs
docker-compose logs -f avatar-engine
```

### Option C: Production Mode
```bash
# Install production dependencies
uv pip install -e ".[production]"

# Run with gunicorn
python src/main.py --mode standalone --host 0.0.0.0 --port 8080
```

## Step 6: Testing the Installation

### Basic Health Check
```bash
# Test if service is running
curl http://localhost:8080/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00",
  "uptime_seconds": 10.5,
  "active_sessions": 0
}
```

### Service Information
```bash
# Get service information
curl http://localhost:8080/info

# Expected response:
{
  "name": "HealLink Avatar Engine",
  "version": "0.1.0",
  "gpu_enabled": false,
  "video_config": {
    "resolution": "1080p",
    "fps": 30
  }
}
```

### Create Test Avatar Session
```bash
# Create avatar session
curl -X POST http://localhost:8080/avatars \
  -H "Content-Type: application/json" \
  -d '{
    "avatar_id": "doctor_avatar_1",
    "session_id": "test_session_1"
  }'

# Expected response:
{
  "session_id": "test_session_1",
  "avatar_id": "doctor_avatar_1",
  "status": "created",
  "websocket_url": "/ws/test_session_1"
}
```

### Test Facial Expressions
```bash
# Set avatar emotion
curl -X POST http://localhost:8080/avatars/test_session_1/emotion \
  -H "Content-Type: application/json" \
  -d '{
    "emotion": "happy",
    "intensity": 0.8
  }'

# Test different emotions
for emotion in happy sad angry surprised; do
  curl -X POST http://localhost:8080/avatars/test_session_1/emotion \
    -H "Content-Type: application/json" \
    -d "{\"emotion\": \"$emotion\", \"intensity\": 0.7}"
  sleep 2
done
```

### Test Audio Processing (Lip Sync)
```bash
# Send audio file for lip sync processing
curl -X POST http://localhost:8080/avatars/test_session_1/audio \
  -H "Content-Type: audio/wav" \
  --data-binary @assets/sounds/test_speech.wav

# Expected response:
{
  "session_id": "test_session_1",
  "audio_size": 48000,
  "status": "processed"
}
```

## Step 7: Automated Testing

### Run Test Suite
```bash
# Run avatar functionality tests
python tools/test_avatar.py --avatar-id doctor_avatar_1 --verbose

# Expected output:
# Testing avatar: doctor_avatar_1
# ✅ Avatar components initialized
# ✅ Testing emotion: happy
# ✅ Testing emotion: sad
# ✅ Testing lip sync
# ✅ Testing background change
# ✅ Test completed successfully!
```

### Run Service API Tests
```bash
# Test service API
python tools/test_avatar.py --test-service

# Expected output:
# Testing Avatar Service API
# ✅ Service started successfully
# ✅ Service test completed
```

### WebSocket Testing
```bash
# Install wscat for WebSocket testing
npm install -g wscat

# Connect to avatar WebSocket
wscat -c ws://localhost:8080/ws/test_session_1

# Send commands:
# {"type": "set_emotion", "emotion": "happy", "intensity": 0.8}
# {"type": "set_background", "background_id": "clinic_room"}
# {"type": "get_metrics"}
```

## Step 8: ReadyPlayer.me Integration

### Getting ReadyPlayer.me Avatars

1. **Create Avatar**
   ```bash
   # Go to ReadyPlayer.me
   open https://readyplayer.me/
   
   # Create your avatar following the website instructions
   # Choose professional medical appearance
   # Download the .glb file
   ```

2. **Update Configuration**
   ```bash
   # Move downloaded avatar to assets
   mv ~/Downloads/avatar.glb assets/models/doctor_avatar_1.glb
   
   # Update blend shape mapping for ReadyPlayer.me
   nano src/animation/facial_animation.py
   ```

3. **ReadyPlayer.me Blend Shape Mapping**
   ```python
   # Add to facial_animation.py
   READYPLAYERME_BLEND_SHAPES = {
       # Mouth movements
       "mouth_open": "mouthOpen",
       "mouth_smile": "mouthSmile", 
       "mouth_frown": "mouthFrown",
       "mouth_pucker": "mouthPucker",
       
       # Eye movements
       "eye_blink_left": "eyeBlinkLeft",
       "eye_blink_right": "eyeBlinkRight",
       
       # Eyebrow movements  
       "eyebrow_up_left": "eyebrowUpLeft",
       "eyebrow_up_right": "eyebrowUpRight",
       "eyebrow_down_left": "eyebrowDownLeft",
       "eyebrow_down_right": "eyebrowDownRight",
       
       # Jaw movement
       "jaw_open": "jawOpen"
   }
   ```

## Step 9: Performance Optimization

### GPU Acceleration (Optional)
```bash
# Install CUDA support (NVIDIA GPUs)
uv pip install -e ".[gpu]"

# Enable GPU in configuration
echo "GPU_ENABLED=true" >> .env

# Restart service
python src/main.py --dev --gpu
```

### Memory Optimization
```bash
# Monitor memory usage
python -c "
import psutil
process = psutil.Process()
print(f'Memory usage: {process.memory_info().rss / 1024 / 1024:.1f} MB')
"

# Adjust concurrent avatars if needed
echo "MAX_CONCURRENT_AVATARS=2" >> .env
```

## Step 10: Integration with LiveKit

### LiveKit Agent Integration
```python
# Example integration in your LiveKit agent
from avatar_engine import AvatarSession

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()
    
    # Create agent session
    session = AgentSession(
        stt=deepgram.STT(),
        llm=openai.LLM(),  
        tts=cartesia.TTS()
    )
    
    # Create avatar session
    avatar = AvatarSession(
        avatar_id="doctor_avatar_1",
        emotion_enabled=True
    )
    
    # Start avatar
    await avatar.start(session, room=ctx.room)
    
    # Start agent with audio disabled (avatar handles output)
    await session.start(
        room=ctx.room,
        room_output_options=RoomOutputOptions(audio_enabled=False)
    )
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 8080
   lsof -i :8080
   
   # Kill process or use different port
   python src/main.py --port 8081
   ```

2. **Missing Dependencies**
   ```bash
   # Reinstall dependencies
   uv pip install --force-reinstall -r requirements.txt
   ```

3. **Rhubarb Not Found**
   ```bash
   # Check Rhubarb installation
   which rhubarb
   
   # If not found, reinstall following Step 2
   ```

4. **Avatar Model Not Loading**
   ```bash
   # Check file exists and permissions
   ls -la assets/models/
   
   # Verify model format
   file assets/models/doctor_avatar_1.glb
   ```

5. **Memory Issues**
   ```bash
   # Reduce quality settings
   echo "AVATAR_QUALITY=low" >> .env
   echo "VIDEO_RESOLUTION=720p" >> .env
   ```

### Debug Mode
```bash
# Run with maximum debugging
python src/main.py --dev --log-level DEBUG --verbose

# Check logs
tail -f logs/avatar_engine.log
```

## Next Steps

1. **Customize Avatars**: Add your own 3D models and textures
2. **Integrate with LiveKit**: Connect to your voice agent pipeline  
3. **Scale Deployment**: Use Docker Compose for production
4. **Monitor Performance**: Set up Grafana dashboards
5. **Add Features**: Implement custom expressions and animations

The Avatar Engine is now ready for development and testing! 🚀