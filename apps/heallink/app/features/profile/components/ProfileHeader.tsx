"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { UserProfileData } from "../types";

interface ProfileHeaderProps {
  profile: UserProfileData | null;
  uploadAvatar: (file: File) => Promise<string | null | undefined>;
  isUploading: boolean;
}

export function ProfileHeader({ 
  profile, 
  uploadAvatar, 
  isUploading 
}: ProfileHeaderProps) {
  const { theme } = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const shadowColor = theme === "dark" 
    ? "rgba(0, 0, 0, 0.4)" 
    : "rgba(0, 0, 0, 0.1)";

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      await uploadAvatar(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!profile) return null;

  // Determine which image to show
  const displayImage = previewUrl || profile.avatarUrl;
  
  // Define gradient background colors based on theme
  const gradientStart = theme === "dark" ? "#341e77" : "#8a63ff";
  const gradientEnd = theme === "dark" ? "#1e3a77" : "#5e8aff";

  return (
    <div className="relative">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
        }}
      />

      {/* Decorative shape */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-0">
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full"
          style={{ height: '120px' }}
        >
          <path
            d="M0 64L48 80C96 96 192 128 288 138.7C384 149 480 139 576 144C672 149 768 171 864 176C960 181 1056 171 1152 149.3C1248 128 1344 96 1392 80L1440 64V320H1392C1344 320 1248 320 1152 320C1056 320 960 320 864 320C768 320 672 320 576 320C480 320 384 320 288 320C192 320 96 320 48 320H0V64Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8 md:py-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            onClick={triggerFileInput}
          >
            <div 
              className="relative h-32 w-32 rounded-full overflow-hidden cursor-pointer border-4 border-background"
              style={{
                boxShadow: `0 8px 16px ${shadowColor}`
              }}
            >
              {isUploading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
              
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={profile.name || "Profile"}
                  fill
                  sizes="(max-width: 768px) 128px, 128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/20 text-3xl font-bold text-primary">
                  {getInitials(profile.name)}
                </div>
              )}
              
              {/* Camera icon overlay */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
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
              </motion.div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
          
          {/* User Info */}
          <div className="text-center sm:text-left text-white">
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {profile.name}
            </motion.h1>
            
            <motion.div 
              className="mt-2 text-white/80 space-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profile.email && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
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
                    <path d="M21.5 18.5h-19a2.5 2.5 0 1 1 0-5h19a2.5 2.5 0 1 1 0 5Z" />
                    <path d="M9.5 18.5V13" />
                    <path d="M5.5 13V7.5a3 3 0 0 1 5.94-.6" />
                    <path d="M17 13a2 2 0 1 0 0-4" />
                    <path d="M18.5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  </svg>
                  <span>{profile.email}</span>
                  {profile.emailVerified && (
                    <span className="bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{profile.phone}</span>
                  {profile.phoneVerified && (
                    <span className="bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded-full">Verified</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-center sm:justify-start gap-2">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                <span className="capitalize">{profile.role}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}