"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ProfileContainer } from '@/app/features/profile/containers/ProfileContainer';

export default function ProfilePage() {
  return (
    <div className="container pb-12 pt-8">
      <div className="mb-8">
        <h1 className="gradient-text text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal information, contact details, and preferences
        </p>
      </div>
      
      <ProfileContainer />
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}