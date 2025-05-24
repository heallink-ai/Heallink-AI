# Heallink Voice Assistant Integration

This folder contains the implementation of the voice assistant feature for the Heallink platform using LiveKit.

## Overview

The voice assistant provides a natural language interface for users to interact with the Heallink platform. Users can ask questions about their health data, navigate the platform, and get assistance with common tasks.

## Components

### Backend (NestJS API)

The backend integration is implemented in the NestJS API using LiveKit's Voice Pipeline Agent. The implementation includes:

- Token generation for secure LiveKit connections
- Voice assistant initialization and state management
- Integration with Deepgram for speech-to-text
- Integration with OpenAI for language model processing and text-to-speech

### Frontend (Next.js)

The frontend components include:

- `FloatingMicButton`: A draggable microphone button that appears on all dashboard pages
- `VoiceAssistantProvider`: A context provider that manages the voice assistant state
- API routes that proxy requests to the backend

## Setting Up

### Environment Variables

#### Backend (.env in apps/api)

```
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_SERVER_URL=wss://your-livekit-server-url
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

#### Frontend (.env in apps/heallink)

```
API_URL=http://localhost:3003
```

### Required External Services

1. [LiveKit Cloud Account](https://livekit.io/) - For real-time audio streaming
2. [OpenAI API Keys](https://platform.openai.com/) - For LLM and TTS services
3. [Deepgram API Keys](https://deepgram.com/) - For speech-to-text services

## Usage

The voice assistant is automatically available on all dashboard pages. Users can:

1. Click the microphone button in the bottom right corner
2. Speak their query
3. Receive an audio response
4. See a transcript of the conversation

## Architecture

The voice assistant uses a pipeline architecture:

1. **Voice Activity Detection (VAD)**: Detects when the user is speaking
2. **Speech-to-Text (STT)**: Transcribes user speech
3. **Language Model Processing (LLM)**: Generates appropriate responses
4. **Text-to-Speech (TTS)**: Converts text responses to audio

## Troubleshooting

If you encounter issues with the voice assistant:

1. Check that all environment variables are properly set
2. Ensure LiveKit, OpenAI, and Deepgram accounts are active
3. Check browser console for any connection errors
4. Verify that the microphone permissions are granted in the browser

## Future Improvements

- Add voice activity visualization
- Implement speech recognition confidence scores
- Add support for multiple languages
- Integrate with Heallink's notification system
