"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserProfileData } from "../types";
import { Camera, Check, Mail, Phone, User } from "lucide-react";
import { ImageUploadModal } from "./ImageUploadModal";

interface NeuProfileHeaderProps {
  profile: UserProfileData | null;
  uploadAvatar: (file: File) => Promise<string | null | undefined>;
  isUploading: boolean;
}

export function NeuProfileHeader({
  profile,
  uploadAvatar,
  isUploading,
}: NeuProfileHeaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAvatar = async (file: File) => {
    await uploadAvatar(file);
  };

  if (!profile) return null;

  return (
    <div className="w-full overflow-hidden">
      {/* Header background with gradient */}
      <div className="relative h-64 bg-gradient-to-r from-purple-heart to-royal-blue">
        {/* Wave overlay at bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 64L60 80C120 96 240 128 360 122.7C480 117.3 600 74.7 720 67.2C840 59.7 960 87.3 1080 99.8C1200 112.3 1320 109.7 1380 108.3L1440 107V173H1380C1320 173 1200 173 1080 173C960 173 840 173 720 173C600 173 480 173 360 173C240 173 120 173 60 173H0V64Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>

        {/* User profile content */}
        <div className="relative z-10 h-full px-6 sm:px-8 container mx-auto flex flex-col sm:flex-row items-center justify-end gap-6 sm:justify-start sm:gap-8">
          {/* Avatar with image upload modal */}
          <div className="absolute left-1/2 sm:left-8 -bottom-16 transform -translate-x-1/2 sm:translate-x-0">
            <motion.div
              className="relative h-32 w-32"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
              onClick={handleOpenModal}
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden cursor-pointer neumorph-flat border-4 border-background">
                {isUploading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                )}

                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
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
                  <Camera size={32} className="text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-right ml-auto mr-8 sm:mr-16 text-white pb-8">
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
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span>{profile.email}</span>
                  <Mail size={14} />
                  {profile.emailVerified && (
                    <span className="bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded-full">
                      <Check size={10} className="inline mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span>{profile.phone}</span>
                  <Phone size={14} />
                  {profile.phoneVerified && (
                    <span className="bg-green-500/20 text-green-200 text-xs px-2 py-0.5 rounded-full">
                      <Check size={10} className="inline mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 text-sm">
                <span className="capitalize">{profile.role}</span>
                <User size={14} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAvatar}
        currentImageUrl={profile.avatarUrl}
        isUploading={isUploading}
      />
    </div>
  );
}
