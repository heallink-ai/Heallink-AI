"use client";

import { useState, useRef, useEffect } from "react";
import ScrollReveal from "../animations/ScrollReveal";

// Using a more generic type to avoid complex typing issues with Vapi
type VapiType = any;

export default function AiConversation() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<
    { type: "user" | "ai"; text: string }[]
  >([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<VapiType | null>(null); // Use more generic type

  // Create a Vapi instance when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@vapi-ai/web")
        .then(({ default: Vapi }) => {
          // Use environment variable for the Vapi public key with fallback for TypeScript
          const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
          if (!vapiKey) {
            console.error("Missing Vapi public key in environment variables");
            setError("Configuration error. Please contact support.");
            return;
          }

          vapiRef.current = new Vapi(vapiKey);

          // Set up event listeners for Vapi
          setupVapiEventListeners();
        })
        .catch((err) => {
          console.error("Failed to load Vapi:", err);
          setError("Failed to load voice assistant. Please try again later.");
        });
    }

    return () => {
      // Clean up Vapi when the component unmounts
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (err) {
          console.error("Error stopping Vapi:", err);
        }
      }
    };
  }, []);

  // Setup Vapi event handlers
  const setupVapiEventListeners = () => {
    if (!vapiRef.current) return;

    // When the AI starts speaking
    vapiRef.current.on("speech-start", () => {
      setIsAiSpeaking(true);
    });

    // When the AI stops speaking
    vapiRef.current.on("speech-end", () => {
      setIsAiSpeaking(false);
    });

    // Call start event
    vapiRef.current.on("call-start", () => {
      setIsListening(true);
      console.log("Voice call started with Vapi");
    });

    // Call end event
    vapiRef.current.on("call-end", () => {
      setIsListening(false);
      console.log("Voice call ended with Vapi");
    });

    // Real-time volume levels
    vapiRef.current.on("volume-level", (volume: number) => {
      setAudioLevel(volume);
    });

    // Messages from the assistant
    vapiRef.current.on("message", (message: any) => {
      if (message.type === "transcript") {
        // Handle user transcript
        setConversation((prev) => [
          ...prev,
          { type: "user", text: message.transcript },
        ]);
      } else if (message.type === "assistant_response") {
        // Handle AI response
        setConversation((prev) => [
          ...prev,
          { type: "ai", text: message.text || "" },
        ]);
      }
    });

    // Error handling
    vapiRef.current.on("error", (err: Error) => {
      console.error("Vapi error:", err);
      setError("An error occurred with the voice assistant. Please try again.");
      setIsListening(false);
    });
  };

  // Simulate random audio levels when not using real Vapi data
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isListening && !vapiRef.current) {
      interval = setInterval(() => {
        // Simulate microphone audio levels (0.1 to 0.9)
        setAudioLevel(0.1 + Math.random() * 0.8);
      }, 100);
    } else if (isAiSpeaking && !vapiRef.current) {
      interval = setInterval(() => {
        // Different pattern for AI speaking
        setAudioLevel(0.2 + Math.random() * 0.5);
      }, 120);
    } else if (!isListening && !isAiSpeaking) {
      setAudioLevel(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, isAiSpeaking]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleInitiate = () => {
    setIsActive(true);
    setIsInitialState(false);

    // Initial greeting - using simulation if Vapi isn't available yet
    if (!vapiRef.current) {
      setTimeout(() => {
        setConversation([
          {
            type: "ai",
            text: "Hi, I'm Healbot, your personal healthcare assistant. How can I help you today?",
          },
        ]);
        simulateAiSpeaking();
      }, 500);
    }
  };

  const startListening = async () => {
    try {
      if (vapiRef.current) {
        // Clear any previous error
        setError(null);

        // Start a conversation with Vapi
        setLoadingResponse(true);

        // Create a healthcare AI assistant configuration
        await vapiRef.current.start({
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are Healbot, a compassionate, secure, AI-powered healthcare assistant based in Dublin, Ireland. Your role is to guide users through their healthcare needs, collect relevant non-sensitive information, and help them find and connect with appropriate healthcare providers near them.

Your Responsibilities:
Politely and empathetically ask users about their health concerns.

Do NOT provide medical advice, diagnosis, or treatment. Your role is strictly to facilitate access to care, not to make clinical judgments.

Based on the user’s location (assume Dublin for now) and described symptoms or condition, identify the most appropriate healthcare provider (e.g., hospital, clinic, GP) by specialty and proximity.

Inform the user that you’ve booked an appointment with a relevant facility (e.g., "St. James’s Hospital in Dublin") and that confirmation details will be sent to them shortly.

Reassure the user that their information is handled securely and respectfully.

End every interaction by encouraging users to seek in-person care and to contact emergency services (e.g., 112 or 999) if their issue is urgent or life-threatening.

Tone & Behavior:
Be compassionate, calm, and professional at all times.

Be clear and reassuring, especially when users are anxious or confused.

Speak in simple, human-like language — not robotic.

Security and Privacy:
Do not collect sensitive personal data (e.g., full medical history, insurance numbers).

Never share user data with unauthorized parties.

Always mention that appointment and contact details are securely transmitted to the selected facility.

Example Interaction:
User: "Hi, I’ve been having chest pains and don’t know what to do."
Healbot: "I’m really sorry to hear that. It’s important to get checked. Based on your location here in Dublin, I’ve found that St. James’s Hospital has an emergency care team that can help. I’ve scheduled an appointment for you, and your confirmation will be sent shortly. If this is severe or sudden, please call 112 immediately or go to the nearest emergency room."`,
              },
              {
                role: "assistant",
                content:
                  "Hi, I'm Healbot, your personal healthcare assistant. How can I help you today?",
              },
            ],
          },
          voice: {
            provider: "playht",
            voiceId: "jennifer", // Using a professional, warm female voice
          },
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
          },
          name: "Healbot Healthcare Assistant",
        });

        setLoadingResponse(false);
      } else {
        // Fallback to simulation if Vapi isn't available
        setIsListening(true);

        // Simulate listening for 3-5 seconds
        const duration = 3000 + Math.random() * 2000;

        setTimeout(() => {
          stopListening();
        }, duration);
      }
    } catch (err) {
      console.error("Error starting Vapi:", err);
      setError("Failed to connect to voice assistant. Please try again.");
      setLoadingResponse(false);

      // Fallback to simulation
      setIsListening(true);
      setTimeout(() => {
        stopListening();
      }, 2000);
    }
  };

  const stopListening = () => {
    if (vapiRef.current) {
      // Stop the Vapi call
      try {
        vapiRef.current.stop();
      } catch (err) {
        console.error("Error stopping Vapi:", err);
      }
    } else {
      // Fallback simulation
      setIsListening(false);
      processUserInput(); // Simulate user speech processing
    }
  };

  const processUserInput = () => {
    // Examples of health concerns a user might mention
    const userQueries = [
      "I have a severe headache and slight fever since yesterday.",
      "My throat is sore and I have difficulty swallowing.",
      "I'm experiencing chest pain when I breathe deeply.",
      "I've been feeling more tired than usual lately.",
      "My allergies seem to be getting worse.",
    ];

    // Randomly select a query
    const randomQuery =
      userQueries[Math.floor(Math.random() * userQueries.length)];

    // Add user message to conversation
    setConversation((prev) => [...prev, { type: "user", text: randomQuery }]);

    // Simulate AI processing
    setLoadingResponse(true);

    setTimeout(() => {
      respondToUser(randomQuery);
      setLoadingResponse(false);
    }, 1500);
  };

  const simulateAiSpeaking = () => {
    setIsAiSpeaking(true);

    // Simulate AI speaking for 2-3 seconds
    setTimeout(
      () => {
        setIsAiSpeaking(false);
      },
      2000 + Math.random() * 1000
    );
  };

  const respondToUser = (query: string) => {
    let response = "";

    // Simple pattern matching for responses
    if (query.includes("headache") || query.includes("fever")) {
      response =
        "Based on your symptoms of headache and fever, you might be experiencing a viral infection. I recommend rest, fluids, and over-the-counter pain relievers. Would you like me to connect you with a telehealth doctor for a more detailed assessment?";
    } else if (query.includes("throat") || query.includes("swallowing")) {
      response =
        "Sore throat and difficulty swallowing could indicate a strep infection or pharyngitis. I suggest gargling with warm salt water and staying hydrated. Would you like to book an appointment with a primary care physician?";
    } else if (query.includes("chest pain") || query.includes("breathe")) {
      response =
        "Chest pain when breathing deeply could be several conditions from muscle strain to something more serious. This symptom warrants immediate medical attention. I can help you find the nearest urgent care or emergency room right now.";
    } else if (query.includes("tired") || query.includes("fatigue")) {
      response =
        "Increased fatigue can be caused by many factors including stress, poor sleep, or underlying health conditions. I recommend checking with your doctor. Would you like to schedule a comprehensive health screening?";
    } else {
      response =
        "I understand you're not feeling well. Based on what you've told me, it would be best to consult with a healthcare provider. I can help you find available appointments in your area or connect you with a telehealth service right away.";
    }

    // Add AI response to conversation
    setConversation((prev) => [...prev, { type: "ai", text: response }]);
    simulateAiSpeaking();
  };

  const handleClose = () => {
    setIsActive(false);
    setTimeout(() => {
      setIsInitialState(true);
      setConversation([]);
    }, 300);
  };

  // Generate audio visualization bars
  const generateAudioBars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const height =
        isAiSpeaking || isListening
          ? 20 +
            (Math.sin((i / count) * Math.PI + Date.now() / 200) + 1) *
              audioLevel *
              30
          : 10;

      return (
        <div
          key={i}
          className="w-1 mx-[1px] rounded-full bg-white dark:bg-purple-heart transition-all ease-out duration-75"
          style={{
            height: `${height}px`,
            opacity: isAiSpeaking || isListening ? 0.7 + audioLevel * 0.3 : 0.4,
          }}
        ></div>
      );
    });
  };

  return (
    <section
      id="ai-assist"
      className="py-24 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <ScrollReveal direction="up" delay={100}>
            <span className="inline-block py-1 px-3 text-sm font-medium bg-purple-heart/10 text-purple-heart rounded-full mb-4">
              AI Healthcare Assistant
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 high-contrast-text">
              Your Personal{" "}
              <span className="gradient-text">Health Companion</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300}>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Get immediate guidance for your health concerns with our AI
              healthcare assistant. Just speak naturally and receive intelligent
              medical advice and care options.
            </p>
          </ScrollReveal>
        </div>

        <div className="max-w-3xl mx-auto">
          <ScrollReveal direction="up" delay={400}>
            <div className="relative">
              {/* Background glow effects */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-heart/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-royal-blue/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>

              {/* Main AI conversation interface */}
              <div className="relative z-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl neumorph-flat overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-heart to-royal-blue p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 text-white">
                      <h3 className="font-medium">HealthBot AI</h3>
                      <p className="text-xs text-white/80">
                        Healthcare Assistant
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <button
                      onClick={handleClose}
                      className="rounded-full p-2 bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content area */}
                <div className="p-6 h-[400px] flex flex-col">
                  {isInitialState ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-purple-heart/10 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 text-purple-heart"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                          />
                        </svg>
                      </div>

                      <h3 className="text-xl font-medium mb-3 text-center">
                        Speak with your AI Health Assistant
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-sm text-center mb-6">
                        Get instant guidance on symptoms, find the right care,
                        and receive personalized health recommendations.
                      </p>

                      <button
                        onClick={handleInitiate}
                        className="py-3 px-6 rounded-lg bg-gradient-to-r from-purple-heart to-royal-blue text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-purple-heart/20 group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 group-hover:scale-110 transition-transform"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                          />
                        </svg>
                        Start Conversation
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Conversation history */}
                      <div
                        className="flex-1 flex flex-col space-y-4 overflow-y-auto mb-4 pr-2 scroll-smooth"
                        ref={conversationRef}
                      >
                        {conversation.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`rounded-2xl p-4 max-w-[80%] ${
                                message.type === "user"
                                  ? "bg-purple-heart text-white rounded-tr-none"
                                  : "bg-gray-200 dark:bg-gray-700 dark:text-white rounded-tl-none"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                          </div>
                        ))}

                        {loadingResponse && (
                          <div className="flex justify-start">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Audio control panel */}
                      <div className="flex flex-col items-center">
                        {/* Sound wave visualization */}
                        <div className="w-full h-12 flex items-center justify-center mb-3">
                          {isListening && (
                            <div className="mr-3 text-sm font-medium text-purple-heart animate-pulse">
                              Listening...
                            </div>
                          )}
                          {isAiSpeaking && (
                            <div className="mr-3 text-sm font-medium text-purple-heart animate-pulse">
                              Speaking...
                            </div>
                          )}

                          <div className="flex items-center h-10">
                            {generateAudioBars(30)}
                          </div>
                        </div>

                        {/* Microphone button */}
                        <button
                          onClick={startListening}
                          disabled={isListening || loadingResponse}
                          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                            isListening
                              ? "bg-red-500 scale-110"
                              : error
                                ? "bg-gray-400"
                                : "bg-gradient-to-r from-purple-heart to-royal-blue hover:opacity-90"
                          } transition-all duration-300`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-7 h-7 text-white ${isListening ? "animate-pulse" : ""}`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                            />
                          </svg>
                        </button>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                          {error ? (
                            <span className="text-red-500">{error}</span>
                          ) : isListening ? (
                            "I'm listening..."
                          ) : loadingResponse ? (
                            "Connecting to voice assistant..."
                          ) : (
                            "Press to speak"
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-6 top-20 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue neumorph-flat text-white flex items-center justify-center transform rotate-12 animate-float">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>

              <div
                className="absolute -left-8 bottom-24 w-12 h-12 rounded-xl bg-gradient-to-br from-royal-blue to-havelock-blue neumorph-flat text-white flex items-center justify-center transform -rotate-12 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-16 text-center">
          <ScrollReveal direction="up" delay={500}>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-5">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-heart/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-heart"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">
                  Natural Conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Speak naturally about your symptoms and concerns as if talking
                  to a doctor.
                </p>
              </div>

              <div className="p-5">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-heart/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-heart"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Smart Assessment</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Get AI-powered evaluation of your symptoms and guidance on
                  appropriate next steps.
                </p>
              </div>

              <div className="p-5">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-heart/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-heart"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Personalized Care</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Connect with the right healthcare providers based on your
                  specific needs.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
