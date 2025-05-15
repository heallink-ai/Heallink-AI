"use client";

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUserProfile } from '../hooks';
import { ProfileForm } from '../components/ProfileForm';
import { ProfileSkeleton } from '../components/ProfileSkeleton';
import { UserProfileFormData } from '../types';

export const ProfileContainer = () => {
  const {
    profile,
    loading,
    error,
    updateStatus,
    uploadStatus,
    updateProfile,
    uploadAvatar,
    resetStatus,
  } = useUserProfile();

  // Handle profile update
  const handleProfileUpdate = async (formData: UserProfileFormData) => {
    try {
      const success = await updateProfile(formData);
      
      if (success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('An unexpected error occurred');
    } finally {
      // Reset status after 3 seconds
      setTimeout(() => resetStatus(), 3000);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar(file);
      
      if (avatarUrl) {
        toast.success('Profile picture uploaded successfully');
      } else {
        toast.error('Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      toast.error('An unexpected error occurred');
    } finally {
      // Reset status after 3 seconds
      setTimeout(() => resetStatus(), 3000);
    }
  };

  // Show error state
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-red-500"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 className="mb-2 text-xl font-semibold text-red-700 dark:text-red-400">
          Failed to load profile
        </h3>
        <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <ProfileForm
          profile={profile}
          isLoading={loading}
          isUpdating={updateStatus === 'loading'}
          isUploading={uploadStatus === 'loading'}
          onSubmit={handleProfileUpdate}
          onAvatarUpload={handleAvatarUpload}
        />
      )}
    </div>
  );
};