# HealLink 3D Avatar + LiveKit + Lip Sync Technical Pipeline

## 🎯 **Complete Technical Flow - Low Level Implementation**

This document provides a comprehensive, step-by-step technical breakdown of how the HealLink 3D avatar system works from GLB loading to real-time video streaming with lip sync.

---

## **📋 Table of Contents**
1. [System Architecture Overview](#system-architecture-overview)
2. [3D Avatar Rendering Pipeline](#3d-avatar-rendering-pipeline)
3. [Audio Processing & Lip Sync Pipeline](#audio-processing--lip-sync-pipeline)
4. [LiveKit WebRTC Streaming Pipeline](#livekit-webrtc-streaming-pipeline)
5. [Frontend Video Display Pipeline](#frontend-video-display-pipeline)
6. [Performance & Optimization](#performance--optimization)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)

---

## **🏗️ System Architecture Overview**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Agent     │    │  Avatar Engine   │    │   LiveKit      │
│   (FastAPI)    │───▶│   (FastAPI)     │───▶│    Server      │
│                 │    │                  │    │                 │
│ • TTS Audio     │    │ • GLB Loading    │    │ • WebRTC       │
│ • Emotion Data  │    │ • 3D Rendering   │    │ • Video Tracks │
│ • Voice Sync    │    │ • Lip Sync       │    │ • Room Mgmt    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                  │                       │
                                  ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   GLB Models     │    │  React Client   │
                       │                  │    │                 │
                       │ • doctor_avatar  │    │ • Video Display │
                       │ • Facial Shapes  │    │ • UI Controls   │
                       │ • Textures       │    │ • User Interact │
                       └──────────────────┘    └─────────────────┘
```

---

## **🎨 3D Avatar Rendering Pipeline**

### **Step 1: GLB Model Loading**
```python
# File: src/renderer/avatar_renderer.py:_load_glb_model()

1. Load GLB file using trimesh library
   └── `trimesh.load("/app/assets/models/doctor_avatar_1.glb")`
   
2. Extract mesh data:
   ├── vertices: np.ndarray(120, 3) → [[x,y,z], [x,y,z], ...]
   ├── faces: np.ndarray(206, 3) → [[v1,v2,v3], [v1,v2,v3], ...]
   └── materials: texture/color information
   
3. Normalize vertices to [-1, 1] coordinate space:
   ├── center = np.mean(vertices, axis=0)
   ├── vertices -= center  # Center at origin
   ├── max_extent = np.max(np.abs(vertices))
   └── vertices /= max_extent  # Normalize to unit sphere
```

### **Step 2: Facial Blend Shapes Creation**
```python
# File: src/renderer/avatar_renderer.py:_create_facial_blend_shapes()

1. Create base expressions from vertex positions:
   ├── mouth_open: Lower face vertices moved down
   ├── smile: Mouth area vertices widened horizontally  
   ├── brow_up: Eyebrow area vertices moved up
   └── eye_blink: Eye area vertices closed

2. Store as vertex offset arrays:
   └── blend_shapes["mouth_open"] = deformed_vertices - base_vertices
```

### **Step 3: Real-time Frame Rendering**
```python
# File: src/renderer/avatar_renderer.py:_render_3d_mesh()

FRAME RENDERING (30 FPS):

1. Apply Blend Shapes:
   ├── Get current emotion/lip sync weights: {"mouth_open": 0.7, "smile": 0.3}
   ├── deformed_vertices = base_vertices.copy()
   └── For each blend_shape: deformed_vertices += blend_shapes[shape] * weight

2. 3D to 2D Projection (Orthographic):
   ├── scale = min(width, height) * 0.6  # Dynamic scaling
   ├── center_x, center_y = width//2, height//2
   └── For each vertex:
       ├── x = center_x + vertex[0] * scale
       ├── y = center_y - vertex[1] * scale  # Flip Y (screen coords)
       └── projected_vertices[i] = [x, y]

3. Triangle Rasterization:
   └── For each face [v1, v2, v3]:
       ├── Get 2D triangle points: pts = [projected_vertices[v1], ...]
       ├── Calculate face normal: normal = cross(edge1, edge2)
       ├── Apply lighting: intensity = max(0.4, dot(normal, light_dir))
       ├── Calculate color: face_color = base_color * intensity
       └── Draw triangle: cv2.fillPoly(frame, [pts], face_color)

4. Output Frame:
   └── frame: np.ndarray(1080, 1920, 3) in BGR format
```

---

## **🎤 Audio Processing & Lip Sync Pipeline**

### **Step 1: Audio Source (AI Agent)**
```python
# File: apps/ai-engine/agent.py

AI AGENT AUDIO OUTPUT:
1. Text-to-Speech generates audio stream
2. Audio format: 16kHz, 16-bit, mono WAV
3. Audio chunks sent to Avatar Engine via HTTP/WebSocket
4. Real-time streaming for low-latency lip sync
```

### **Step 2: Lip Sync Processing**
```python
# File: src/lipsync/lip_sync_engine.py

AUDIO → VISEMES CONVERSION:

1. Audio Analysis:
   ├── librosa.load(audio_data, sr=16000)
   ├── Extract MFCC features for phoneme detection
   └── Analyze amplitude for mouth opening intensity

2. Viseme Mapping:
   ├── Phoneme → Viseme conversion
   ├── /p/, /b/, /m/ → mouth_closed
   ├── /a/, /e/, /i/ → mouth_open (various levels)
   ├── /o/, /u/ → mouth_rounded
   └── /s/, /z/ → mouth_narrow

3. Temporal Smoothing:
   ├── Apply low-pass filter to prevent jittery animation
   ├── Interpolate between viseme states
   └── Generate smooth weight transitions

4. Output Blend Shape Weights:
   └── {"mouth_open": 0.7, "mouth_rounded": 0.3, "mouth_smile": 0.0}
```

### **Step 3: Real-time Sync**
```python
# File: src/plugin/avatar_session.py:_process_audio_loop()

AUDIO-VISUAL SYNCHRONIZATION:

1. Audio Buffer Management:
   ├── Incoming audio → asyncio.Queue(maxsize=1000)
   ├── Process chunks in 10ms intervals
   └── Maintain 50-100ms buffer for smooth playback

2. Lip Sync Application:
   ├── Process audio chunk → lip_sync_data
   ├── Update renderer: await renderer.update_mouth_animation(lip_sync_data)
   ├── Apply blend shapes in next frame render
   └── Synchronize with 30fps video output (33.3ms intervals)
```

---

## **📡 LiveKit WebRTC Streaming Pipeline**

### **Step 1: Avatar Engine → LiveKit Connection**
```python
# File: src/plugin/avatar_session.py:start_livekit_streaming()

LIVEKIT CONNECTION SETUP:

1. Room Connection:
   ├── room = rtc.Room()
   ├── await room.connect(livekit_url, livekit_token)
   └── participant_identity = "Heallink Health Assistant"

2. Video Track Creation:
   ├── video_source = rtc.VideoSource(1920, 1080)
   ├── video_track = rtc.LocalVideoTrack.create_video_track("avatar-video", video_source)
   └── publish_options = rtc.TrackPublishOptions(source=SOURCE_CAMERA)

3. Track Publishing:
   └── await room.local_participant.publish_track(video_track, publish_options)
```

### **Step 2: Real-time Frame Streaming**
```python
# File: src/plugin/avatar_session.py:_render_loop()

VIDEO FRAME PIPELINE (30 FPS):

1. Frame Generation:
   ├── frame = await renderer.render_frame()  # (1080, 1920, 3) BGR
   ├── Validates frame is not None
   └── Frame contains 3D avatar + background

2. Color Space Conversion:
   ├── frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
   └── Required: LiveKit expects RGB, OpenCV generates BGR

3. LiveKit VideoFrame Creation:
   ├── video_frame = rtc.VideoFrame(
   │     width=frame_rgb.shape[1],      # 1920
   │     height=frame_rgb.shape[0],     # 1080  
   │     type=rtc.VideoBufferType.RGB24,
   │     data=frame_rgb.tobytes()
   │   )
   └── Raw pixel data as contiguous byte array

4. Frame Publishing:
   ├── video_source.capture_frame(video_frame)
   ├── LiveKit encodes frame (VP8/H.264)
   ├── Sends via WebRTC to connected clients
   └── Maintains 30fps target (33.3ms intervals)
```

### **Step 3: WebRTC Transport**
```
LIVEKIT WEBRTC FLOW:

Avatar Engine → LiveKit Server → React Client

1. Avatar Engine:
   ├── Generates RGB frames at 30fps
   ├── Publishes to video_source.capture_frame()
   └── LocalVideoTrack streams to LiveKit

2. LiveKit Server:
   ├── Receives raw frames from Avatar Engine
   ├── Encodes with VP8/H.264 codec
   ├── Manages WebRTC peer connections
   ├── Handles network adaptation/quality
   └── Routes video to subscribed participants

3. Network Transport:
   ├── UDP/SRTP for low latency
   ├── ICE for NAT traversal
   ├── DTLS for encryption
   └── Adaptive bitrate based on network conditions
```

---

## **🖥️ Frontend Video Display Pipeline**

### **Step 1: LiveKit Client Connection**
```typescript
// File: app/providers/LiveKitProvider.tsx

REACT LIVEKIT INTEGRATION:

1. Room Connection:
   ├── room = new Room()
   ├── await room.connect(wsUrl, token)
   └── Auto-reconnection and error handling

2. Participant Discovery:
   ├── Listen for "participant_connected" events
   ├── Filter by participant.identity === "Heallink Health Assistant"
   └── Track avatar participant separately from user participants
```

### **Step 2: Video Track Subscription**
```typescript
// File: app/features/dashboard/components/VoiceAgentAvatar.tsx

VIDEO TRACK ATTACHMENT:

1. Track Discovery:
   ├── participant.trackPublications.values()
   ├── Filter: publication.kind === Track.Kind.Video
   ├── Check: publication.isSubscribed && publication.track
   └── Handle async track subscription

2. Video Element Attachment:
   ├── track.attach(videoElement)  # LiveKit handles MediaStream creation
   ├── videoElement.autoPlay = true
   ├── videoElement.playsInline = true
   └── CSS styling for proper display

3. Error Handling:
   ├── Retry mechanism for failed attachments
   ├── Fallback to placeholder on track errors
   ├── Debug logging for troubleshooting
   └── Graceful degradation
```

### **Step 3: Frontend Rendering**
```css
/* File: app/styles/components/voice-agent-avatar.css */

VIDEO DISPLAY STYLING:

.avatar-video-container {
  width: 240px;
  height: 240px;
  border-radius: 16px;    /* Rounded rectangle (not circle) */
  overflow: hidden;       /* Clip content to container */
}

.avatar-video {
  width: 100%;
  height: 100%;
  object-fit: contain;    /* Show full avatar (not cropped) */
  background: transparent;
  border-radius: 16px;
}
```

---

## **⚡ Performance & Optimization**

### **Frame Rate Optimization**
```python
# Target: 30 FPS (33.3ms per frame)

RENDERING PERFORMANCE:
├── 3D Mesh: ~5-10ms (120 vertices, 206 faces)
├── Lighting: ~2-3ms (simple directional lighting)
├── Blend Shapes: ~1-2ms (4 active shapes)
├── Background: ~1ms (solid color fill)
├── Color Conversion: ~1ms (BGR→RGB)
└── LiveKit Publish: ~2-5ms
   
Total: ~12-22ms per frame (well under 33.3ms budget)
```

### **Memory Management**
```python
MEMORY EFFICIENCY:
├── Vertex arrays: 120 × 3 × 4 bytes = 1.4KB
├── Face arrays: 206 × 3 × 4 bytes = 2.4KB  
├── Frame buffer: 1920 × 1080 × 3 = 6.2MB
├── Blend shapes: 4 × 1.4KB = 5.6KB
└── Total per avatar: ~6.5MB (very efficient)
```

---

## **🐛 Debugging & Troubleshooting**

### **Common Issues & Solutions**

#### **1. Avatar Not Visible (Brown Background)**
```bash
# Enable debug mode
export DEBUG=true
export DEBUG_WIREFRAME=true
export DEBUG_VERTICES=true

# Run debug test
docker exec avatar-engine python test_avatar_debug.py

# Check debug files:
# - debug_avatar_frame.png (full rendering)
# - debug_faces.png (individual triangles) 
# - debug_vertices.png (vertex positions)
```

#### **2. LiveKit Connection Issues**
```bash
# Check LiveKit logs
docker logs heallink-avatar-engine | grep -i livekit

# Verify room connection
curl -X GET "http://localhost:7880/rooms"

# Check video track publishing
# Should see: "Published avatar video track: avatar_doctor_avatar_1"
```

#### **3. Lip Sync Delay**
```python
# Reduce audio buffer size
self.audio_buffer = asyncio.Queue(maxsize=100)  # Smaller buffer

# Increase processing frequency  
await asyncio.sleep(0.005)  # 5ms instead of 10ms

# Check audio latency in logs
logger.info(f"Audio processing delay: {current_time - audio_timestamp}ms")
```

#### **4. Frontend Video Issues**
```typescript
// Check video track status
console.log("Video tracks:", participant.videoTrackPublications);
console.log("Has video:", hasVideoTrack);
console.log("Video element:", videoRef.current);

// Verify track attachment
videoElement.onloadeddata = () => console.log("Video loaded");
videoElement.onplay = () => console.log("Video playing");
```

---

## **🎯 Summary: End-to-End Data Flow**

```
1. AI Agent generates TTS audio
2. Audio → Avatar Engine via HTTP/WebSocket  
3. Lip Sync Engine: Audio → Viseme weights
4. 3D Renderer: GLB + Blend Shapes → Video frame
5. LiveKit: RGB frame → WebRTC encoding
6. Network: VP8/H.264 stream → React client
7. Frontend: Video track → HTML video element
8. User sees: Real-time 3D avatar with lip sync
```

**Total Latency: ~50-100ms** (Speech → Visible lip movement)

---

## **🚀 Next Steps for Optimization**

1. **GPU Acceleration**: Use OpenGL/WebGL for 3D rendering
2. **Advanced Lip Sync**: Train custom phoneme-to-viseme models
3. **Eye Tracking**: Add eye movement and blinking
4. **Texture Mapping**: Apply realistic skin textures
5. **Performance**: SIMD optimizations for vertex processing
6. **Quality**: Anti-aliasing and better lighting models

---

*This documentation covers the complete technical pipeline from GLB loading to real-time video streaming. Each component is optimized for low latency and high performance in healthcare applications.*