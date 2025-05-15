"use client";

import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-8">
      {/* Header with avatar section */}
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        <div className="h-24 w-24 rounded-full bg-primary/10"></div>
        <div className="space-y-2 text-center md:text-left">
          <div className="h-8 w-48 rounded-md bg-primary/10"></div>
          <div className="h-4 w-32 rounded-md bg-primary/10"></div>
        </div>
      </div>

      {/* Form sections */}
      <div className="grid gap-8">
        {/* Personal Information */}
        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <div className="h-6 w-48 rounded-md bg-primary/10"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <div className="h-6 w-32 rounded-md bg-primary/10"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <div className="h-6 w-48 rounded-md bg-primary/10"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
          </div>
        </div>

        {/* Insurance Information */}
        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <div className="h-6 w-44 rounded-md bg-primary/10"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
            <div className="h-12 rounded-lg bg-primary/10"></div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4 rounded-xl bg-primary/5 p-6">
          <div className="h-6 w-56 rounded-md bg-primary/10"></div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded bg-primary/10"></div>
              <div className="h-4 w-36 rounded-md bg-primary/10"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded bg-primary/10"></div>
              <div className="h-4 w-40 rounded-md bg-primary/10"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded bg-primary/10"></div>
              <div className="h-4 w-32 rounded-md bg-primary/10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <div className="h-12 w-32 rounded-lg bg-primary/10"></div>
      </div>
    </div>
  );
};
