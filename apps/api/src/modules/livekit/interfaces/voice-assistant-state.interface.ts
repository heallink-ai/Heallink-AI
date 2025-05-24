export interface VoiceAssistantState {
  roomName: string;
  participants: {
    id: string;
    identity: string;
    isAgent: boolean;
  }[];
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
}
