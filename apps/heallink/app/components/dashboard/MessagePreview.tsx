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
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <Image
            src={message.avatar}
            alt={message.sender}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        {message.unread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-heart rounded-full border-2 border-card"></span>
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
