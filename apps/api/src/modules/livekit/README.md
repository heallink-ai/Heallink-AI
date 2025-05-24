# LiveKit Voice Assistant Integration

This directory contains the integration between the Heallink platform and LiveKit's voice assistant capabilities.

## Architecture

The voice assistant integration is built using:

1. **Frontend Components**:

   - `FloatingMicButton`: A draggable microphone button that users can interact with
   - `VoiceAssistantProvider`: A React context provider that manages the voice assistant state
   - `FloatingVoiceAssistant`: A wrapper component that combines the button with the provider
   - `useLiveKitApi`: React Query hooks for communicating with NestJS API

2. **NestJS API Backend**:
   - `LiveKitModule`: Manages LiveKit integration
   - `LiveKitService`: Handles token generation, voice agent creation, and state management
   - `LiveKitController`: Exposes REST endpoints for the frontend

## Voice Pipeline

The voice assistant uses LiveKit's VoicePipelineAgent with:

1. **VAD (Voice Activity Detection)**: Silero's VAD for detecting when users are speaking
2. **STT (Speech-to-Text)**: Deepgram for transcribing speech
3. **LLM (Large Language Model)**: OpenAI GPT for generating responses
4. **TTS (Text-to-Speech)**: OpenAI's TTS for converting text responses to audio

## Environment Variables

The following environment variables need to be set:

### Frontend (.env in heallink app)

```
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### Backend (.env in api app)

```
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_SERVER_URL=wss://your-livekit-server-url
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

## Setup Instructions

1. Create a LiveKit Cloud account at https://livekit.io/
2. Create a new project and get API keys
3. Set up the environment variables
4. Install dependencies with `npm install`
5. Start the application

## Usage

The voice assistant is available on all dashboard pages. Users can:

1. Click the floating microphone button to activate the assistant
2. Speak their queries
3. Receive audio responses from the assistant
4. See a transcript of the conversation

The assistant is designed to be helpful for healthcare-related questions and navigation within the Heallink platform.
