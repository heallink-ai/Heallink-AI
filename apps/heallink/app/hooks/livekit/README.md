# LiveKit API Hooks

This directory contains React Query hooks for communicating with the LiveKit voice assistant API endpoints in the NestJS backend.

## Available Hooks

- `useGenerateLiveKitToken`: Generates LiveKit access tokens for room connections
- `useInitializeVoiceAssistant`: Initializes the voice assistant for a room
- `useVoiceAssistantState`: Fetches and polls the current state of the voice assistant
- `useEndVoiceAssistant`: Ends a voice assistant session and cleans up resources

## Usage Example

```tsx
import {
  useGenerateLiveKitToken,
  useInitializeVoiceAssistant,
  useVoiceAssistantState,
  useEndVoiceAssistant,
} from "@/app/hooks/livekit/useLiveKitApi";

const MyComponent = () => {
  const [roomName, setRoomName] = useState("");
  const tokenMutation = useGenerateLiveKitToken();
  const initializeMutation = useInitializeVoiceAssistant();
  const endMutation = useEndVoiceAssistant();
  const { data: assistantState } = useVoiceAssistantState(roomName, true);

  const startVoiceAssistant = async () => {
    // Generate token
    const tokenResponse = await tokenMutation.mutateAsync({
      identity: "user-123",
      roomName: "my-room",
    });

    // Initialize voice assistant
    await initializeMutation.mutateAsync({
      identity: "user-123",
      roomName: "my-room",
    });

    setRoomName("my-room");
  };

  const endVoiceAssistant = async () => {
    await endMutation.mutateAsync(roomName);
    setRoomName("");
  };

  return (
    <div>
      {!roomName ? (
        <button onClick={startVoiceAssistant}>Start Voice Assistant</button>
      ) : (
        <button onClick={endVoiceAssistant}>End Voice Assistant</button>
      )}

      {assistantState && (
        <div>
          <p>Listening: {assistantState.isListening ? "Yes" : "No"}</p>
          <p>Speaking: {assistantState.isSpeaking ? "Yes" : "No"}</p>
          <p>Transcript: {assistantState.transcript}</p>
        </div>
      )}
    </div>
  );
};
```

## Environment Configuration

Make sure to set the following environment variable in your `.env` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3003
```

This will point to your NestJS API server.
