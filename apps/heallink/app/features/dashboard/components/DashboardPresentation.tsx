"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

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
import Toast from "./Toast";
import VoiceAssistantButton from "./VoiceAssistantButton";
import VoiceTranscript from "./VoiceTranscript";
import Skeleton from "./Skeleton";

// Types
import { UserData, ToastProps, FloatingButtonPosition } from "../types";

interface DashboardPresentationProps {
  userData: UserData;
  loading: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMicActive: boolean;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  showTranscript: boolean;
  toast: ToastProps;
  floatingBtnPosition: FloatingButtonPosition;
  setFloatingBtnPosition: (position: FloatingButtonPosition) => void;
  handleMicrophoneToggle: (isDragging: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const DashboardPresentation = ({
  userData,
  loading,
  sidebarOpen,
  setSidebarOpen,
  isMicActive,
  isConnected,
  isListening,
  isSpeaking,
  transcript,
  showTranscript,
  toast,
  floatingBtnPosition,
  setFloatingBtnPosition,
  handleMicrophoneToggle,
  setIsDragging,
}: DashboardPresentationProps) => {
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
        <VoiceTranscript 
          showTranscript={showTranscript} 
          transcript={transcript} 
        />

        {/* AI Assistant Floating Button */}
        <VoiceAssistantButton
          isMicActive={isMicActive}
          isSpeaking={isSpeaking}
          floatingBtnPosition={floatingBtnPosition}
          setFloatingBtnPosition={setFloatingBtnPosition}
          handleMicrophoneToggle={handleMicrophoneToggle}
          setIsDragging={setIsDragging}
        />
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        unreadMessages={userData.messages.filter((msg) => msg.unread).length}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default DashboardPresentation;