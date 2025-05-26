# Heallink Voice & Video Agent Integration

This document explains how the audio and video components of the Heallink voice agent work together.

## Overview

The Heallink voice agent system uses:

1. **LiveKit** for real-time audio/video communication
2. **OpenAI's GPT-4o** for conversational AI
3. **Beyond Presence** avatar for visual representation

## Key Components

### 1. Backend (Python/LiveKit)

- Located in `apps/ai-engine/agent.py`
- Sets up two participants:
  - **Agent**: The AI voice assistant handling conversations
  - **Avatar**: The visual representation with video track

### 2. Frontend (React/Next.js)

- `LiveKitProvider`: Manages room connections and separates audio/video tracks
- `VoiceAgentAvatar`: Displays the avatar video track
- `AudioDebugHelper`: Helps debug audio issues (development only)

## Debugging Audio Issues

If you're experiencing audio issues:

1. Check browser console logs for detailed information
2. Use the AudioDebugHelper (headphone icon in bottom right corner) in development mode
3. Verify that:
   - The avatar participant is connected (`heallink-avatar`)
   - Audio tracks are being received and attached correctly
   - The browser has permission to play audio

## Common Issues & Solutions

### No Audio

- Check if audio tracks are being subscribed to (see console logs)
- Try the "Fix Audio" button in the AudioDebugHelper
- Audio may need user interaction to start playing (browser security policy)

### No Avatar Video

- Check if the avatar participant is connected
- Verify if video tracks are available and attached
- The fallback UI will display if no video is available

## Architecture Notes

1. The backend starts two separate participants:

   - Agent with audio track
   - Avatar with video track

2. Frontend handles them separately:
   - Audio tracks go through an audio queue for proper playback
   - Video track is attached directly to a video element

## Testing

When testing, use the console logs and AudioDebugHelper to verify:

- Connection status
- Track availability
- Audio playback status
