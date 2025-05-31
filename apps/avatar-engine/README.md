# HealLink Avatar Engine

A custom LiveKit avatar plugin for real-time 3D avatar rendering with lip syncing and facial expressions.

## Architecture Overview

The Avatar Engine consists of several interconnected components:

### Core Components

1. **LiveKit Plugin** (`src/plugin/`) - Python plugin that integrates with LiveKit agents
2. **Avatar Rendering Service** (`src/renderer/`) - Handles 3D avatar rendering and animation
3. **Lip Sync Engine** (`src/lipsync/`) - Processes audio for mouth movements
4. **Facial Animation Engine** (`src/animation/`) - Manages facial expressions and emotions
5. **WebRTC Streaming** (`src/streaming/`) - Handles real-time video streaming
6. **Assets Management** (`assets/`) - 3D models, textures, and animation data

### Technology Stack

- **Python 3.11+** - Core plugin development with `uv` environment management
- **Three.js + WebGL** - Real-time 3D rendering
- **MediaPipe** - Facial tracking and landmark detection
- **Rhubarb Lip Sync** - Audio-to-viseme mapping
- **WebRTC** - Real-time video streaming
- **Docker** - Containerized deployment

### Performance Targets

- **End-to-end latency**: < 200ms
- **Video quality**: 1080p @ 30 FPS
- **Concurrent users**: 100+ per instance
- **Memory usage**: < 500MB per avatar

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- UV package manager

### Installation

```bash
# Clone and navigate to avatar-engine
cd apps/avatar-engine

# Setup Python environment with UV
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uv pip install -r requirements.txt

# Install Node.js dependencies for renderer
cd src/renderer
npm install

# Build Docker containers
docker-compose build
```

### Development

```bash
# Start all services
docker-compose up -d

# Run avatar engine in development mode
python src/main.py --dev

# View logs
docker-compose logs -f avatar-engine
```

## Integration with LiveKit

### Basic Usage

```python
from livekit import agents
from avatar_engine import AvatarSession

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()
    
    # Create agent session
    session = agents.AgentSession(
        stt=your_stt_provider,
        llm=your_llm_provider,
        tts=your_tts_provider
    )
    
    # Create avatar session
    avatar = AvatarSession(
        avatar_id="doctor_avatar_1",
        style="professional",
        emotion_enabled=True
    )
    
    # Start avatar and agent
    await avatar.start(session, room=ctx.room)
    await session.start(
        room=ctx.room,
        room_output_options=agents.RoomOutputOptions(audio_enabled=False)
    )
```

### Configuration

```python
# Avatar configuration
avatar_config = {
    "avatar_id": "doctor_avatar_1",
    "resolution": "1080p",
    "fps": 30,
    "quality": "high",
    "lip_sync_model": "rhubarb",  # or "wav2lip"
    "facial_expressions": True,
    "head_movements": True,
    "background": "medical_office"
}
```

## Development Workflow

### Adding New Avatars

1. Place 3D model files in `assets/models/`
2. Configure blend shapes in `assets/config/blend_shapes.json`
3. Add avatar metadata to `src/config/avatars.yaml`
4. Test with `python tools/test_avatar.py --avatar-id new_avatar`

### Lip Sync Models

- **Rhubarb** - Fast, rule-based (recommended for development)
- **Wav2Lip** - High quality, ML-based (recommended for production)

### Animation System

- **FACS-based** - 157 facial action units
- **Emotion mapping** - Automatic expression generation
- **Real-time** - Sub-200ms response time

## API Reference

### AvatarSession Class

```python
class AvatarSession:
    def __init__(self, avatar_id: str, **config):
        """Initialize avatar session with configuration"""
        
    async def start(self, agent_session: AgentSession, room: Room):
        """Start avatar session with LiveKit room"""
        
    async def stop(self):
        """Stop avatar session and cleanup resources"""
        
    def update_emotion(self, emotion: str, intensity: float):
        """Update avatar facial expression"""
        
    def set_background(self, background_id: str):
        """Change avatar background"""
```

### Configuration Options

- `avatar_id` - Unique identifier for 3D avatar model
- `resolution` - Video resolution (720p, 1080p, 4K)
- `fps` - Target frame rate (24, 30, 60)
- `quality` - Rendering quality (low, medium, high, ultra)
- `lip_sync_model` - Lip sync algorithm (rhubarb, wav2lip)
- `facial_expressions` - Enable/disable facial expressions
- `head_movements` - Enable/disable head movements
- `background` - Background scene identifier

## Deployment

### Docker Compose

```yaml
services:
  avatar-engine:
    build: .
    ports:
      - "8080:8080"
      - "8443:8443"
    environment:
      - LIVEKIT_URL=${LIVEKIT_URL}
      - LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
      - LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
    volumes:
      - ./assets:/app/assets:ro
```

### Environment Variables

- `LIVEKIT_URL` - LiveKit server URL
- `LIVEKIT_API_KEY` - LiveKit API key
- `LIVEKIT_API_SECRET` - LiveKit API secret
- `AVATAR_ENGINE_PORT` - Service port (default: 8080)
- `LOG_LEVEL` - Logging level (DEBUG, INFO, WARN, ERROR)

## Performance Optimization

### GPU Acceleration

- **CUDA** - NVIDIA GPU acceleration for rendering
- **Metal** - Apple Silicon optimization
- **OpenCL** - Cross-platform GPU compute

### Memory Management

- **Model streaming** - Load avatars on-demand
- **Texture compression** - Reduce memory footprint
- **LOD system** - Distance-based quality scaling

### Network Optimization

- **Adaptive bitrate** - Adjust quality based on bandwidth
- **Frame skipping** - Maintain real-time performance
- **Compression** - Efficient video encoding

## Troubleshooting

### Common Issues

1. **High latency** - Check GPU acceleration, reduce quality settings
2. **Audio sync** - Verify audio pipeline configuration
3. **Resource usage** - Monitor memory and CPU usage
4. **WebRTC errors** - Check firewall and network configuration

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python src/main.py --debug

# Render test avatar
python tools/debug_avatar.py --avatar-id test_avatar --duration 30
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- **Python** - Follow PEP 8, use `black` and `isort`
- **JavaScript** - Use Prettier and ESLint
- **Documentation** - Update README and docstrings

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues** - GitHub Issues for bug reports and feature requests
- **Documentation** - See `docs/` folder for detailed guides
- **Community** - Join our Discord for real-time support

---

Built with ❤️ by the HealLink team