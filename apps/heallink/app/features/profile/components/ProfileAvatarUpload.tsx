"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";

interface ProfileAvatarUploadProps {
  avatarUrl?: string;
  name: string;
  onAvatarChange: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export const ProfileAvatarUpload = ({
  avatarUrl,
  name,
  onAvatarChange,
  isUploading = false,
}: ProfileAvatarUploadProps) => {
  const { theme } = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate user initials for fallback avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Determine which image to show: preview, existing avatar, or initials
  const displayImage = previewUrl || avatarUrl;

  // Determine neumorphic style based on theme
  const neumorphicStyle =
    theme === "dark"
      ? "shadow-[6px_6px_12px_#101010,_-6px_-6px_12px_#303030]"
      : "shadow-[6px_6px_12px_#cacaca,_-6px_-6px_12px_#ffffff]";

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`relative h-28 w-28 cursor-pointer rounded-full overflow-hidden 
                   ${neumorphicStyle} ${isDragging ? "ring-2 ring-primary" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {displayImage ? (
          <Image
            src={displayImage}
            alt={name || "Profile picture"}
            fill
            sizes="(max-width: 768px) 100px, 112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary">
            {getInitials(name)}
          </div>
        )}

        {/* Camera icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
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
            className="text-white"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <p className="mt-3 text-sm text-muted-foreground">
        Click or drag to upload
      </p>
    </div>
  );
};
