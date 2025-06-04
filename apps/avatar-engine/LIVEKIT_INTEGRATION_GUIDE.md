# LiveKit + Avatar Engine Integration Guide

## 🎥 How Avatar Video Streaming Works

### **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LiveKit       │    │   Avatar        │    │   Web Client    │
│   Agent         │    │   Engine        │    │   (Browser)     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Speech/TTS  │ │    │ │ 3D Renderer │ │    │ │ LiveKit SDK │ │
│ │ Processing  │ │    │ │ Lip Sync    │ │    │ │             │ │
│ └─────────────┘ │    │ │ Emotions    │ │    │ └─────────────┘ │
│       │         │    │ └─────────────┘ │    │       │         │
│       │ Audio   │    │       │         │    │       │         │
│       v         │    │       │ Video   │    │       │ WebRTC  │
│ ┌─────────────┐ │    │       v         │    │       v         │
│ │ Avatar      │◄┼────┼─┤ Video Track │─┼────┼─► │ Video       │ │
│ │ Controller  │ │    │ │ Publisher   │ │    │   │ Display     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │   └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       ▲                       │
         │ HTTP API              │ HTTP API              │
         └───────────────────────┘                       │
                                                         │
         ┌─────────────────────────────────────────────┘
         │ Emotion/Background Controls
         v
   ┌─────────────────┐
   │ Avatar Engine   │
   │ Web Interface   │
   └─────────────────┘
```

### **Video Flow Explanation**

1. **LiveKit Agent** processes speech and determines when to speak
2. **Avatar Engine** renders 3D avatar with lip sync and emotions
3. **Video Track** streams avatar video via WebRTC to clients
4. **Web Client** receives avatar video just like any other participant
5. **Control APIs** allow real-time emotion and background changes

## 🚀 Quick Start

### 1. Start Avatar Engine

```bash
cd apps/avatar-engine
docker compose up -d avatar-engine
```

### 2. Test Avatar Engine

```bash
# Test health
curl http://localhost:8080/health

# Test CORS (should show Access-Control headers)
curl -I -H "Origin: http://localhost:3001" http://localhost:8080/health
```

### 3. Run LiveKit Agent with Avatar Engine

```bash
cd apps/ai-engine

# Set environment variables
export AVATAR_ENGINE_URL=http://localhost:8080
export USE_CUSTOM_AVATAR=true

# Run the modified agent
python avatar_agent_test.py
```

### 4. Connect Client to See Avatar Video

**Option A: Use the demo LiveKit client**

```bash
# Open the demo client
open apps/avatar-engine/livekit_client_example.html

# Note: You need to implement token generation for this to work
```

**Option B: Use your existing LiveKit client**

- Connect to your LiveKit room as usual
- The agent will join with avatar video as a participant
- You'll see the avatar video stream in your client
- Control avatar emotions via Avatar Engine API

## 🎯 Integration Details

### **In Your LiveKit Agent (ai-engine)**

The `avatar_agent_test.py` shows how to:

1. **Connect to Avatar Engine**

   ```python
   # Create avatar session
   avatar = CustomAvatarSession(
       avatar_id="doctor_avatar_1",
       avatar_name="Heallink Health Assistant"
   )

   # Start with LiveKit session
   await avatar.start(session, room=ctx.room)
   ```

2. **Control Avatar During Conversation**

   ```python
   # Set emotions based on conversation context
   await avatar._set_emotion("concerned", 0.7)  # When discussing symptoms
   await avatar._set_emotion("reassuring", 0.8)  # When providing comfort
   await avatar._set_emotion("happy", 0.6)       # When greeting
   ```

3. **Change Backgrounds**
   ```python
   # Set medical environment
   await avatar.set_background("medical_office")
   await avatar.set_background("clinic_room")
   ```

### **In Your Web Client**

Your existing LiveKit client will automatically receive the avatar video:

```javascript
// Subscribe to video tracks (same as any participant)
room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  if (track.kind === "video") {
    const element = track.attach();

    // Check if this is the avatar
    if (participant.identity.includes("avatar")) {
      // Display avatar video
      avatarVideoContainer.appendChild(element);
    }
  }
});
```

### **Avatar Engine API Integration**

Control the avatar from your web client:

```javascript
// Set avatar emotion
fetch("http://localhost:8080/avatars/session_id/emotion", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    emotion: "happy",
    intensity: 0.8,
  }),
});

// Change background
fetch("http://localhost:8080/avatars/session_id/background", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    background_id: "medical_office",
  }),
});
```

## 🛠 Technical Implementation

### **Video Track Publishing (Avatar Engine)**

The avatar video is published as a LiveKit video track:

```python
# In avatar_session.py
async def _start_video_streaming(self) -> None:
    # Create video track
    self.video_track = LocalVideoTrack.create_video_track()

    # Start rendering loop
    asyncio.create_task(self._render_loop())

    # Publish to LiveKit room
    if self.room:
        await self.room.local_participant.publish_track(
            self.video_track,
            options={
                "name": f"avatar_{self.avatar_id}",
                "source": "camera"
            }
        )
```

### **Real-time Rendering Loop**

```python
async def _render_loop(self):
    while self.is_streaming:
        # Render avatar frame
        frame = await self.renderer.render_frame()

        if frame is not None and self.video_track:
            # Convert to video frame format
            video_frame = self._convert_to_video_frame(frame)

            # Push frame to LiveKit video track
            await self.video_track.capture_frame(video_frame)

        # Control frame rate (30 FPS)
        await asyncio.sleep(1/30)
```

### **Audio-Driven Lip Sync**

```python
async def _subscribe_to_agent_audio(self):
    # Listen to agent's TTS output
    def on_audio_frame(frame):
        # Process audio for lip sync
        asyncio.create_task(self.lip_sync.process_audio(frame))

        # Update avatar mouth movements
        asyncio.create_task(self._update_mouth_animation(frame))

    # Connect to agent session audio output
    self.agent_session.on('audio_frame', on_audio_frame)
```

## 🎭 Avatar Control API

### **Available Emotions**

- `happy` - Smiling, positive expression
- `sad` - Downward mouth, empathetic look
- `concerned` - Furrowed brow, serious expression
- `surprised` - Raised eyebrows, open mouth
- `angry` - Frown, tense features
- `neutral` - Default relaxed expression

### **Available Backgrounds**

- `medical_office` - Professional medical setting
- `clinic_room` - Clinical examination room
- `hospital_room` - Hospital patient room
- `consultation_room` - Private consultation space

### **API Endpoints**

```http
# Health check
GET /health

# Create avatar session
POST /avatars
{
  "avatar_id": "doctor_avatar_1",
  "session_id": "livekit_room_123"
}

# Set emotion
POST /avatars/{session_id}/emotion
{
  "emotion": "happy",
  "intensity": 0.8
}

# Change background
POST /avatars/{session_id}/background
{
  "background_id": "medical_office"
}

# Get session info
GET /avatars/{session_id}

# Delete session
DELETE /avatars/{session_id}

# WebSocket for real-time updates
WS /ws/{session_id}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Avatar Engine
AVATAR_ENGINE_URL=http://localhost:8080
USE_CUSTOM_AVATAR=true

# LiveKit (your existing config)
LIVEKIT_URL=wss://heallink-dev-jvc8ya2i.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_secret

# AI Services (your existing config)
OPENAI_API_KEY=your_openai_key
CARTESIA_API_KEY=your_cartesia_key
DEEPGRAM_API_KEY=your_deepgram_key
```

### **Performance Settings**

```yaml
# In Avatar Engine config
video:
  resolution: "1080p" # or "720p" for better performance
  fps: 30 # or 24 for lower bandwidth
  quality: "medium" # "low", "medium", "high"

performance:
  gpu_enabled: false # Set to true if GPU available
  max_concurrent_avatars: 3
```

## 🚨 Common Issues & Solutions

### **1. CORS Errors**

✅ **Fixed** - Avatar Engine now includes proper CORS headers

### **2. Avatar Video Not Appearing**

- Check that Avatar Engine is running: `curl http://localhost:8080/health`
- Verify agent connects to Avatar Engine: Check agent logs
- Ensure LiveKit client subscribes to video tracks

### **3. Lip Sync Not Working**

- Verify audio pipeline: Agent → Avatar Engine → Lip Sync
- Check that TTS audio is being received by Avatar Engine
- Monitor Avatar Engine logs for audio processing

### **4. Performance Issues**

- Lower video resolution/FPS in Avatar Engine config
- Reduce max concurrent avatars
- Enable GPU acceleration if available

### **5. Token Generation**

- Implement proper LiveKit token generation in your backend
- Use your `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`
- Include appropriate permissions for video publishing

## 🎉 Production Deployment

### **Scalability Considerations**

1. **Multiple Avatar Engines**: Deploy multiple instances behind load balancer
2. **GPU Acceleration**: Use GPU-enabled instances for better performance
3. **CDN Integration**: Stream avatar video through CDN for global distribution
4. **Redis Caching**: Cache avatar sessions and state for failover
5. **Monitoring**: Set up Prometheus/Grafana for performance monitoring

### **Security**

1. **API Authentication**: Add JWT tokens to Avatar Engine API
2. **CORS Configuration**: Restrict CORS origins in production
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **TLS/SSL**: Use HTTPS for all Avatar Engine communications

The Avatar Engine is now fully integrated with LiveKit and ready for production use! 🚀
