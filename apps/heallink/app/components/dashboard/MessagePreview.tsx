"use client";

import Image from "next/image";
import Link from "next/link";

interface MessageProps {
  message: {
    id: number;
    sender: string;
    message: string;
    time: string;
    unread: boolean;
    avatar: string;
  };
}

export default function MessagePreview({ message }: MessageProps) {
  return (
    <Link
      href={`/messages/${message.id}`}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors relative"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/10">
          <Image
            src={message.avatar}
            alt={message.sender}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        {message.unread && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-purple-heart rounded-full border border-card"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium truncate pr-2">{message.sender}</h3>
          <span className="text-xs text-foreground/60 whitespace-nowrap">
            {message.time}
          </span>
        </div>
        <p
          className={`text-sm truncate ${message.unread ? "text-foreground font-medium" : "text-foreground/70"}`}
        >
          {message.message}
        </p>
      </div>
    </Link>
  );
}
