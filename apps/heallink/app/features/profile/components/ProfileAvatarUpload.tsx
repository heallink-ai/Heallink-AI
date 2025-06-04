"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { Check, X, Camera, Upload } from "lucide-react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      setSelectedFile(file);
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
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (selectedFile) {
      await onAvatarChange(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
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
      <div className="relative">
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
            <Camera className="h-6 w-6 text-white" />
          </div>
        </motion.div>

        {/* Actions overlay for save/cancel after selecting an image */}
        {selectedFile && !isUploading && (
          <div className="absolute right-0 top-0 flex">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Check size={16} />
            </motion.button>
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {selectedFile ? (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          onClick={handleSave}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <Upload size={14} />
          )}
          {isUploading ? "Uploading..." : "Save Changes"}
        </motion.button>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Click or drag to upload
        </p>
      )}
    </div>
  );
};
