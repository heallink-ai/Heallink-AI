"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Component imports
import MobileSidebar from "@/app/components/dashboard/MobileSidebar";
import HealthSnapshotCard from "@/app/components/dashboard/HealthSnapshotCard";
import AppointmentCard from "@/app/components/dashboard/AppointmentCard";
import MessagePreview from "@/app/components/dashboard/MessagePreview";
import ActionButton from "@/app/components/dashboard/ActionButton";
import NotificationItem from "@/app/components/dashboard/NotificationItem";
import AiInsightCard from "@/app/components/dashboard/AiInsightCard";
import BackgroundGradient from "@/app/components/dashboard/BackgroundGradient";
import BottomNavigation from "@/app/components/dashboard/BottomNavigation";
import Footer from "@/app/components/layout/Footer";
import NeumorphicHeader from "@/app/components/dashboard/NeumorphicHeader";

// Voice Assistant hooks
import { useVoiceAssistant } from "@/app/providers/VoiceAssistantProvider";

// Type definitions
type NotificationType = "appointment" | "message" | "payment";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
}

// Toast notification component
const Toast = ({
  message,
  isVisible,
  type = "info",
}: {
  message: string;
  isVisible: boolean;
  type?: "info" | "success" | "error";
}) => {
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-primary";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Dashboard() {
  // State for sidebar toggle on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for loading skeleton
  const [loading, setLoading] = useState(true);

  // Add state for the floating button position
  const [floatingBtnPosition, setFloatingBtnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Voice assistant state
  const [isMicActive, setIsMicActive] = useState(false);
  const {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    toggleMicrophone,
    disconnect,
  } = useVoiceAssistant();

  // Toast notification state
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "info" as "info" | "success" | "error",
  });

  // Store the voice transcript in a ref for UI display
  const transcriptRef = useRef("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptTimeout, setTranscriptTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Update transcript and handle visibility
  useEffect(() => {
    if (transcript && transcript !== transcriptRef.current) {
      transcriptRef.current = transcript;
      setShowTranscript(true);

      // Clear any existing timeout
      if (transcriptTimeout) {
        clearTimeout(transcriptTimeout);
      }

      // Hide transcript after 5 seconds of inactivity
      const timeout = setTimeout(() => {
        setShowTranscript(false);
      }, 5000);

      setTranscriptTimeout(timeout);
    }

    // Cleanup on unmount
    return () => {
      if (transcriptTimeout) {
        clearTimeout(transcriptTimeout);
      }
    };
  }, [transcript, transcriptTimeout]);

  // Show toast notification based on connection state
  useEffect(() => {
    if (isConnected && isMicActive) {
      setToast({
        message: "Connected to AI Assistant",
        visible: true,
        type: "success",
      });

      // Hide toast after 3 seconds
      const timeout = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);

      return () => clearTimeout(timeout);
    }

    // Show listening feedback
    if (isListening && isConnected) {
      setToast({
        message: "Listening...",
        visible: true,
        type: "info",
      });

      return () => setToast((prev) => ({ ...prev, visible: false }));
    }
  }, [isConnected, isMicActive, isListening]);

  // Cleanup voice assistant connection on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
        setIsMicActive(false);
      }
    };
  }, [isConnected, disconnect]);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load saved position on component mount
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem("floatingBtnPosition");
      if (savedPosition) {
        setFloatingBtnPosition(JSON.parse(savedPosition));
      }
    } catch (error) {
      console.error("Error loading button position:", error);
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (floatingBtnPosition.x !== 0 || floatingBtnPosition.y !== 0) {
      try {
        localStorage.setItem(
          "floatingBtnPosition",
          JSON.stringify(floatingBtnPosition)
        );
      } catch (error) {
        console.error("Error saving button position:", error);
      }
    }
  }, [floatingBtnPosition]);

  // Add AI Engine URL debugging
  useEffect(() => {
    console.log("AI Engine URL:", process.env.NEXT_PUBLIC_AI_ENGINE_URL);
  }, []);

  // Handle microphone toggle with proper error handling
  const handleMicrophoneToggle = async () => {
    console.log("handleMicrophoneToggle", isDragging);

    if (isDragging) return;

    try {
      const newMicState = !isMicActive;
      console.log("Setting microphone state to:", newMicState);

      // Set state first (UI feedback)
      setIsMicActive(newMicState);

      // Toggle microphone with proper error handling
      console.log("Calling toggleMicrophone with:", newMicState);
      await toggleMicrophone(newMicState);

      console.log("After toggleMicrophone, isConnected:", isConnected);

      if (!newMicState) {
        setToast({
          message: "AI Assistant disconnected",
          visible: true,
          type: "info",
        });

        // Hide toast after 3 seconds
        setTimeout(() => {
          setToast((prev) => ({ ...prev, visible: false }));
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to toggle microphone:", error);

      // Reset mic state on error
      setIsMicActive(false);

      setToast({
        message: "Failed to connect to AI Assistant",
        visible: true,
        type: "error",
      });

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  // Mock data - in production would come from API
  const userData = {
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    nextAppointment: {
      doctor: "Dr. Sarah Williams",
      specialty: "Cardiologist",
      date: "Today",
      time: "3:30 PM",
      isVirtual: true,
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    notifications: [
      {
        id: 1,
        type: "appointment" as NotificationType,
        message:
          "Reminder: Appointment with Dr. Sarah Williams tomorrow at 3:30 PM",
        time: "1 hour ago",
      },
      {
        id: 2,
        type: "message" as NotificationType,
        message: "Dr. Williams sent you lab results",
        time: "Yesterday",
      },
      {
        id: 3,
        type: "payment" as NotificationType,
        message: "Invoice #HEA-1023 payment successful",
        time: "2 days ago",
      },
    ] as Notification[],
    messages: [
      {
        id: 1,
        sender: "Dr. Sarah Williams",
        message:
          "Your latest test results look good. Let's discuss in our appointment.",
        time: "1 hour ago",
        unread: true,
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
      {
        id: 2,
        sender: "Dr. Robert Chen",
        message: "Please remember to take your medication as prescribed.",
        time: "Yesterday",
        unread: false,
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
    ],
    healthSnapshot: {
      bloodPressure: "120/80",
      glucose: "95 mg/dL",
      weight: "170 lbs",
      lastUpdated: "Today, 9:30 AM",
      trends: {
        bloodPressure: [118, 122, 125, 119, 120],
        glucose: [100, 98, 97, 96, 95],
        weight: [172, 171, 170, 170, 170],
      },
    },
    billing: {
      outstanding: "$125.00",
      nextDue: "Oct 15, 2023",
      invoiceId: "HEA-1089",
    },
  };

  // Skeleton loaders for UI elements - Using span instead of div to fix the nesting issues
  const Skeleton = ({ className }: { className?: string }) => (
    <span
      className={`animate-pulse bg-primary/10 rounded-lg inline-block ${className}`}
    ></span>
  );

  return (
    <main className="min-h-screen bg-background text-foreground pb-0 relative">
      <BackgroundGradient />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
      />

      {/* New Neumorphic Header */}
      <NeumorphicHeader
        userData={userData}
        onMenuToggle={() => setSidebarOpen(true)}
        loading={loading}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <MobileSidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="pt-24 pb-24 md:pb-0 px-4 max-w-7xl mx-auto relative z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {loading ? (
            <Skeleton className="h-8 w-3/4 mb-2" />
          ) : (
            <h1 className="text-2xl font-semibold">
              Hello, <span className="gradient-text">{userData.name}</span>
            </h1>
          )}
          <div className="text-foreground/70">
            {loading ? (
              <Skeleton className="h-5 w-1/2" />
            ) : (
              `${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
            )}
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Next Appointment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-2 lg:col-span-2"
          >
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <AppointmentCard appointment={userData.nextAppointment} />
            )}
          </motion.div>

          {/* Health Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <HealthSnapshotCard data={userData.healthSnapshot} />
            )}
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            {loading ? <Skeleton className="h-24 w-full" /> : <AiInsightCard />}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1 md:col-span-2 lg:col-span-3"
          >
            <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : (
                <>
                  <ActionButton
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                      </svg>
                    }
                    label="Book Appointment"
                    href="/appointments/book"
                  />
                  <ActionButton
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                        <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                        <path d="M5 18v2" />
                        <path d="M19 18v2" />
                      </svg>
                    }
                    label="Log Vitals"
                    href="/health/log"
                  />
                  <ActionButton
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    }
                    label="Pay Invoice"
                    href="/billing/pay"
                  />
                  <ActionButton
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                      </svg>
                    }
                    label="Message Doctor"
                    href="/messages/new"
                  />
                </>
              )}
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-1 md:col-span-1 lg:col-span-2"
          >
            <div className="p-4 bg-card rounded-xl neumorph-flat">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Messages</h2>
                <Link
                  href="/messages"
                  className="text-primary text-sm hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <>
                  <Skeleton className="h-16 w-full mb-3" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                <div className="space-y-3">
                  {userData.messages.map((message) => (
                    <MessagePreview key={message.id} message={message} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Notifications & Billing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-1"
          >
            <div className="p-4 bg-card rounded-xl neumorph-flat mb-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <span className="text-xs py-1 px-2 bg-primary/10 text-primary rounded-full">
                  {loading ? "..." : userData.notifications.length}
                </span>
              </div>

              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {userData.notifications.slice(0, 2).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-card rounded-xl neumorph-flat">
              <h2 className="text-lg font-semibold mb-3">Billing Summary</h2>

              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                    <span className="text-foreground/70">Outstanding</span>
                    <span className="font-semibold">
                      {userData.billing.outstanding}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-background/50">
                    <span className="text-foreground/70">Next Due</span>
                    <span className="font-semibold">
                      {userData.billing.nextDue}
                    </span>
                  </div>
                  <Link
                    href={`/billing/invoice/${userData.billing.invoiceId}`}
                    className="block w-full mt-3 text-center py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    View Invoice
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Voice Assistant Transcript Popup */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-28 md:bottom-20 left-4 right-4 md:left-auto md:right-24 md:w-96 z-30 voice-transcript-bubble"
            >
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-lg">
                <div className="bg-gradient-to-tr from-purple-heart to-royal-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2c1.7 0 3 1.3 3 3v9c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1">
                    HealLink AI Assistant
                  </h3>
                  <p className="text-sm text-foreground/80">{transcript}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assistant Floating Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: floatingBtnPosition.x,
            y: floatingBtnPosition.y,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.2,
          }}
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            setFloatingBtnPosition((prev) => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y,
            }));
          }}
          onClick={handleMicrophoneToggle}
          className={`voice-assistant-button ${
            isMicActive
              ? "bg-red-500 gradient-pulse"
              : "bg-gradient-to-tr from-purple-heart to-royal-blue"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpeaking ? (
            // Sound wave animation when assistant is speaking
            <div className="sound-wave-container">
              <span className="sound-wave-bar animate-sound-wave-1"></span>
              <span className="sound-wave-bar animate-sound-wave-2"></span>
              <span className="sound-wave-bar animate-sound-wave-3"></span>
            </div>
          ) : isMicActive ? (
            // Stop icon when microphone is active
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
            </svg>
          ) : (
            // Mic icon when inactive
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2c1.7 0 3 1.3 3 3v9c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          )}
        </motion.button>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        unreadMessages={userData.messages.filter((msg) => msg.unread).length}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
