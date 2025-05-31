'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useProfile } from '../hooks/useProfile';
import ProfilePresentation from '../components/ProfilePresentation';
import ProfileSkeleton from '../components/ProfileSkeleton';

export const ProfileContainer: React.FC = () => {
  const { data: profileData, isLoading, isError, error } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            {error instanceof Error ? error.message : 'Unable to load your profile information. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[color:var(--muted)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[color:var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">
            No Profile Data
          </h3>
          <p className="text-[color:var(--muted-foreground)]">
            Your profile information is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfilePresentation profileData={profileData} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--primary)',
              secondary: 'var(--primary-foreground)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
};

export default ProfileContainer;