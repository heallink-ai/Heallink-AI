"use client";

import Link from "next/link";

interface NotificationProps {
  notification: {
    id: number;
    type: "appointment" | "message" | "payment";
    message: string;
    time: string;
  };
}

export default function NotificationItem({ notification }: NotificationProps) {
  // Configure icon based on notification type
  const iconMap = {
    appointment: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
    message: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
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
    ),
    payment: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
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
    ),
  };

  // Configure color based on notification type
  const colorMap = {
    appointment: "bg-purple-heart/10 text-purple-heart",
    message: "bg-royal-blue/10 text-royal-blue",
    payment: "bg-purple-heart-600/10 text-purple-heart-600",
  };

  return (
    <Link
      href={`/notifications/${notification.id}`}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-background/70 transition-colors"
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          colorMap[notification.type]
        }`}
      >
        {iconMap[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-foreground/60 mt-1 block">
          {notification.time}
        </span>
      </div>
    </Link>
  );
}
