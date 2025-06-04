# HealLink Avatar Engine v2.0 - Setup Guide

## 🚀 Quick Start

### Prerequisites

1. **Python 3.10+** with uv package manager
2. **Docker & Docker Compose**
3. **LiveKit Server** (credentials required)
4. **GPU** (optional, recommended for production)

### Installation

1. **Install uv** (if not already installed):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. **Setup the avatar engine**:
```bash
cd apps/avatar-engine

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Copy environment file and configure
cp .env.example .env
# Edit .env with your LiveKit credentials
```

3. **Run with Docker** (recommended):
```bash
# From the root directory
docker-compose up avatar-engine
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# LiveKit Configuration (Required)
AVATAR_LIVEKIT_URL=wss://your-livekit-server.com
AVATAR_LIVEKIT_API_KEY=your-livekit-api-key
AVATAR_LIVEKIT_API_SECRET=your-livekit-api-secret

# Avatar Configuration
AVATAR_DEVICE=cuda  # or cpu
AVATAR_MAX_CONCURRENT_SESSIONS=10
AVATAR_VIDEO_FPS=30
```

### Avatar Image

1. Place your avatar image in `assets/avatars/default.png`
2. Requirements:
   - **Format**: PNG or JPG
   - **Size**: 512x512 pixels (recommended)
   - **Content**: Clear frontal face view
   - **Quality**: High resolution for better lip-sync

## 🧪 Testing

### 1. Health Check

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "heallink-avatar-engine",
  "version": "2.0.0"
}
```

### 2. Create Avatar Session

```bash
curl -X POST http://localhost:8080/avatars/ \
  -H "Content-Type: application/json" \
  -d '{
    "emotion": "happy",
    "emotion_intensity": 0.7
  }'
```

### 3. Start LiveKit Streaming

```bash
curl -X POST http://localhost:8080/avatars/{session_id}/livekit-stream \
  -H "Content-Type: application/json" \
  -d '{
    "livekit_url": "wss://your-livekit-server.com",
    "livekit_token": "your-jwt-token",
    "room_name": "test-room"
  }'
```

### 4. Test Audio WebSocket

```javascript
// Connect to audio WebSocket for real-time lip-sync
const ws = new WebSocket('ws://localhost:8080/avatars/{session_id}/audio');

// Send audio data (16kHz, 16-bit PCM)
ws.send(audioBuffer);
```

## 🔧 Integration with AI Agent

### Using the Updated Agent

Use `avatar_agent_v2.py` instead of the original `agent.py`:

```bash
cd apps/ai-engine
python avatar_agent_v2.py
```

### Environment Variables for AI Agent

```bash
# Enable MuseTalk Avatar
USE_MUSETALK_AVATAR=true
AVATAR_ENGINE_URL=http://avatar-engine:8080
AVATAR_IMAGE_PATH=/app/assets/avatars/default.png
```

### Integration Flow

1. **AI Agent starts** → Creates avatar session
2. **Avatar Engine** → Loads image, initializes MuseTalk
3. **LiveKit streaming** → Avatar joins room as participant
4. **Real-time lip-sync** → TTS audio → MuseTalk → Video stream

## 📊 Monitoring

### Performance Metrics

```bash
curl http://localhost:8080/avatars/{session_id}/metrics
```

### System Metrics

```bash
curl http://localhost:8080/metrics
```

### Key Metrics to Monitor

- **Processing Time**: < 33ms for 30fps
- **Memory Usage**: < 4GB per session
- **GPU Utilization**: 60-80% (if using GPU)
- **Audio Latency**: < 100ms end-to-end

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to Avatar Engine"**
   - Check if avatar-engine container is running
   - Verify port 8080 is accessible
   - Check Docker network connectivity

2. **"LiveKit streaming failed"**
   - Verify LiveKit credentials in environment
   - Check LiveKit server connectivity
   - Ensure room permissions are correct

3. **"MuseTalk initialization failed"**
   - Check GPU/CUDA availability (if using GPU)
   - Verify model downloads completed
   - Check memory availability (8GB+ recommended)

4. **"Avatar image not found"**
   - Ensure `default.png` exists in `assets/avatars/`
   - Check file permissions
   - Verify image format is supported

### Debug Mode

Enable debug logging:

```bash
AVATAR_DEBUG=true
AVATAR_LOG_LEVEL=DEBUG
```

### Health Checks

```bash
# Container health
docker-compose ps avatar-engine

# Application health
curl http://localhost:8080/health

# LiveKit connectivity
curl http://localhost:8080/avatars -X POST -d '{"emotion":"neutral"}'
```

## 🚀 Production Deployment

### Docker Production Build

```bash
# Build production image
docker build --target production -t heallink-avatar-engine:latest .

# Run with production settings
docker run -p 8080:8080 \
  -e AVATAR_DEBUG=false \
  -e AVATAR_DEVICE=cuda \
  -e AVATAR_MAX_CONCURRENT_SESSIONS=50 \
  heallink-avatar-engine:latest
```

### Scaling Considerations

- **GPU Memory**: 1-2 sessions per GB GPU memory
- **CPU**: 4-8 cores per 10 concurrent sessions
- **Network**: 1-5 Mbps per active video stream
- **Storage**: 500MB-2GB for models

### Performance Optimization

1. **GPU Acceleration**: Use CUDA for production
2. **Model Caching**: Pre-load models on startup
3. **Connection Pooling**: Reuse LiveKit connections
4. **Memory Management**: Monitor and cleanup sessions

## 📋 API Reference

### Endpoints

- `POST /avatars/` - Create avatar session
- `GET /avatars/{id}` - Get session info
- `DELETE /avatars/{id}` - Stop session
- `POST /avatars/{id}/livekit-stream` - Start streaming
- `POST /avatars/{id}/emotion` - Set emotion
- `WS /avatars/{id}/audio` - Real-time audio input

### Integration Examples

See `avatar_agent_v2.py` for complete integration example with LiveKit agents.

## 🎯 Next Steps

1. **Test with your avatar image** in `assets/avatars/default.png`
2. **Configure LiveKit credentials** in `.env`
3. **Run the complete stack** with `docker-compose up`
4. **Test real-time lip-sync** using the AI agent
5. **Monitor performance** and optimize settings

---

**Note**: This is a complete rewrite using MuseTalk for real-time 2D lip-sync, replacing the previous 3D rendering approach for better performance and quality.