"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface MessageData {
  id: number;
  sender: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

interface MessagePreviewProps {
  message: MessageData;
}

export default function MessagePreview({ message }: MessagePreviewProps) {
  return (
    <Link href={`/messages/${message.id}`}>
      <motion.div
        className={`p-3 rounded-lg ${
          message.unread
            ? "bg-primary/10"
            : "bg-background hover:bg-background/80"
        } transition-colors flex items-center gap-3`}
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="relative">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={message.avatar}
              alt={message.sender}
              layout="fill"
              objectFit="cover"
            />
          </div>
          {message.unread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary border-2 border-background rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h4
              className={`text-sm ${message.unread ? "font-semibold" : "font-medium"}`}
            >
              {message.sender}
            </h4>
            <span className="text-xs text-foreground/70">{message.time}</span>
          </div>
          <p className="text-sm text-foreground/70 truncate">
            {message.message}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
