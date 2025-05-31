import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="pb-10">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-[color:var(--muted)] rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-96 bg-[color:var(--muted)] rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-[color:var(--card)] rounded-2xl p-6 border border-[color:var(--border)] shadow-sm">
            {/* Avatar Skeleton */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-[color:var(--muted)] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[color:var(--muted)] rounded-full animate-pulse" />
              </div>
              <div className="h-6 w-32 bg-[color:var(--muted)] rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-[color:var(--muted)] rounded animate-pulse" />
            </div>

            {/* Navigation Tabs Skeleton */}
            <nav className="space-y-2">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center p-3 rounded-xl">
                  <div className="w-4 h-4 bg-[color:var(--muted)] rounded animate-pulse mr-3" />
                  <div className="h-4 w-32 bg-[color:var(--muted)] rounded animate-pulse" />
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3">
          <div className="bg-[color:var(--card)] rounded-2xl p-8 border border-[color:var(--border)] shadow-sm">
            {/* Form Header Skeleton */}
            <div className="h-6 w-48 bg-[color:var(--muted)] rounded animate-pulse mb-8" />

            {/* Form Fields Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-24 bg-[color:var(--muted)] rounded animate-pulse" />
                  <div className="h-10 w-full bg-[color:var(--muted)] rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {/* Bio Field Skeleton */}
            <div className="mb-8">
              <div className="h-4 w-16 bg-[color:var(--muted)] rounded animate-pulse mb-2" />
              <div className="h-32 w-full bg-[color:var(--muted)] rounded-lg animate-pulse" />
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-end">
              <div className="h-10 w-32 bg-[color:var(--muted)] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;