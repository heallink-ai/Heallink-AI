# HealLink Avatar Engine v2.0

Real-time 2D Avatar Lip-sync Engine powered by MuseTalk for healthcare conversations.

## Features

- 🎯 **Real-time Performance**: 30fps+ lip-sync generation
- 🗣️ **MuseTalk Integration**: State-of-the-art 2D face animation
- 🔄 **LiveKit Streaming**: Seamless video streaming to LiveKit rooms
- 🌍 **Multilingual Support**: English, Chinese, Japanese
- ⚡ **Low Latency**: Optimized for real-time healthcare conversations
- 🎨 **Emotion Control**: Dynamic facial expressions
- 🔧 **Production Ready**: Docker support, health checks, metrics

## Quick Start

### Using uv (Recommended)

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Download MuseTalk models
python -m avatar_engine.setup download-models

# Run the avatar engine
avatar-engine --host 0.0.0.0 --port 8080
```

### Using Docker

```bash
# Build and run
docker-compose up avatar-engine

# Or using the development image
docker-compose -f docker-compose.dev.yml up avatar-engine
```

## API Endpoints

### Avatar Management
- `POST /avatars` - Create new avatar session
- `GET /avatars/{session_id}` - Get avatar session info
- `DELETE /avatars/{session_id}` - Stop avatar session

### Real-time Control
- `POST /avatars/{session_id}/livekit-stream` - Start LiveKit streaming
- `POST /avatars/{session_id}/emotion` - Update facial expression
- `POST /avatars/{session_id}/image` - Update avatar image
- `WebSocket /avatars/{session_id}/audio` - Real-time audio input

### System
- `GET /health` - Health check
- `GET /metrics` - Performance metrics

## Configuration

Environment variables:

```bash
# LiveKit
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Avatar Engine
AVATAR_ENGINE_HOST=0.0.0.0
AVATAR_ENGINE_PORT=8080
DEFAULT_AVATAR_IMAGE=/app/assets/avatars/default.jpg

# MuseTalk
MUSETALK_MODEL_PATH=/app/models/musetalk
DEVICE=cuda  # or cpu

# Performance
MAX_CONCURRENT_SESSIONS=10
ENABLE_GPU_ACCELERATION=true
VIDEO_FPS=30
AUDIO_SAMPLE_RATE=16000
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Agent      │───▶│ Avatar Engine   │───▶│  LiveKit Room   │
│  (TTS Audio)    │    │  (MuseTalk)     │    │  (Video Stream) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Real-time 2D    │
                    │ Lip-sync Video  │
                    └─────────────────┘
```

## Development

```bash
# Install development dependencies
uv pip install -e ".[dev]"

# Run tests
pytest

# Format code
black .
isort .

# Type checking
mypy avatar_engine/

# Run in development mode with hot reload
avatar-engine --dev --reload
```

## Requirements

### Hardware
- **GPU**: NVIDIA GPU with 4GB+ VRAM (recommended)
- **CPU**: 8+ cores for CPU-only mode
- **RAM**: 8GB+ system memory
- **Storage**: 5GB+ for models and dependencies

### Software
- Python 3.10+
- CUDA 11.7+ (for GPU acceleration)
- FFmpeg 4.4+

## License

MIT License - see LICENSE file for details.