import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the FloatingVoiceAssistant component to avoid server-side rendering
const FloatingVoiceAssistant = dynamic(
  () => import("@/app/components/FloatingVoiceAssistant"),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <FloatingVoiceAssistant />
    </div>
  );
}
