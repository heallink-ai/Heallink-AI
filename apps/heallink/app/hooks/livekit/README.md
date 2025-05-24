# LiveKit Voice Assistant Integration

This directory contains React Query hooks for communicating with the LiveKit voice assistant API endpoints in the NestJS backend.

## Available Hooks

- `useGenerateLiveKitToken`: Generates LiveKit access tokens for room connections
- `useInitializeVoiceAssistant`: Initializes the voice assistant for a room
- `useVoiceAssistantState`: Fetches and polls the current state of the voice assistant
- `useEndVoiceAssistant`: Ends a voice assistant session and cleans up resources

## Dashboard Integration

The LiveKit voice assistant is integrated with the floating microphone button on the dashboard page. When the user clicks the button:

1. The application connects to a LiveKit room using the `VoiceAssistantProvider`
2. The AI engine (running in the backend) joins the same room as an agent
3. The user can speak directly to the AI assistant through their microphone
4. The AI assistant responds with voice and the transcripts are shown on screen

The button changes appearance based on the state:

- Default state: Blue gradient background with microphone icon
- Active listening: Red background with stop icon
- Assistant speaking: Blue gradient with sound wave animation

## Components & Files

- `VoiceAssistantProvider.tsx`: Context provider that manages LiveKit room connection
- `useLiveKitApi.ts`: React Query hooks for API communication
- `dashboard/page.tsx`: Contains the floating microphone button implementation

## Usage Example

```tsx
import { useVoiceAssistant } from "@/app/providers/VoiceAssistantProvider";

const MyComponent = () => {
  const {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    connect,
    disconnect,
    toggleMicrophone,
  } = useVoiceAssistant();

  const handleMicrophoneToggle = async () => {
    const newState = !isActive;
    setIsActive(newState);
    await toggleMicrophone(newState);
  };

  return (
    <div>
      <button onClick={handleMicrophoneToggle}>
        {isActive ? "Stop" : "Start"} Voice Assistant
      </button>

      {transcript && (
        <div>
          <p>Transcript: {transcript}</p>
        </div>
      )}
    </div>
  );
};
```

## Environment Configuration

Make sure to set the following environment variables in your `.env` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3003
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8000
```

These will point to your NestJS API server and AI engine.

## Backend Architecture

The LiveKit integration relies on three main components:

1. **Next.js Frontend**: Handles user interface and microphone input
2. **NestJS API**: Manages token generation and voice assistant lifecycle
3. **AI Engine**: Python FastAPI server that runs the LiveKit agent with speech recognition and generation

When a user starts the voice assistant, the system:

1. Generates a unique LiveKit token
2. Creates a room for the session
3. Connects the user to the room
4. Initializes the AI assistant agent in the same room
5. Establishes real-time audio communication
6. Provides transcripts and status updates during the conversation
