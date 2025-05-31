'use client';

import React, { useState } from 'react';
import { User, Key, Shield, Clock, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { ProfileData } from '../types/profile.types';
import AvatarUpload from './AvatarUpload';
import ProfileForm from './ProfileForm';
import PasswordChangeForm from './PasswordChangeForm';

interface ProfilePresentationProps {
  profileData: ProfileData;
}

type TabType = 'profile' | 'security';

export const ProfilePresentation: React.FC<ProfilePresentationProps> = ({ profileData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeStyle = (role: string, adminRole?: string) => {
    if (adminRole === 'super_admin') return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400';
    if (adminRole === 'system_admin') return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
    if (role === 'admin') return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400';
  };

  const getRoleIcon = (role: string, adminRole?: string) => {
    if (adminRole === 'super_admin') return <Shield className="w-4 h-4" />;
    if (adminRole === 'system_admin') return <Shield className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5">
            <User className="w-8 h-8 text-[color:var(--primary)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--foreground)]">
              My Profile
            </h1>
            <p className="text-[color:var(--muted-foreground)] mt-1">
              Manage your personal information, security settings, and account preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[color:var(--card)] rounded-2xl p-6 border border-[color:var(--border)] shadow-sm">
            {/* Profile Summary */}
            <div className="text-center mb-8">
              <AvatarUpload
                currentAvatarUrl={profileData.avatarUrl}
                userName={profileData.name}
              />
              
              <div className="mt-4 space-y-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(profileData.role, profileData.adminRole)}`}>
                  {getRoleIcon(profileData.role, profileData.adminRole)}
                  {profileData.adminRole?.replace('_', ' ') || profileData.role}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-3 mb-8 p-4 bg-[color:var(--muted)]/20 rounded-xl border border-[color:var(--border)]">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                <span className="text-[color:var(--muted-foreground)] truncate">{profileData.email}</span>
              </div>
              
              {profileData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                  <span className="text-[color:var(--muted-foreground)]">{profileData.phone}</span>
                </div>
              )}
              
              {profileData.department && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                  <span className="text-[color:var(--muted-foreground)]">{profileData.department}</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                <span className="text-[color:var(--muted-foreground)]">
                  Joined {formatDate(profileData.createdAt).split(',')[0]}
                </span>
              </div>

              {profileData.lastLogin && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                  <span className="text-[color:var(--muted-foreground)]">
                    Last seen {formatDate(profileData.lastLogin)}
                  </span>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="space-y-3 mb-8">
              <h3 className="text-sm font-medium text-[color:var(--foreground)] mb-3">Account Status</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted-foreground)]">Account Active</span>
                {profileData.isActive ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted-foreground)]">Email Verified</span>
                {profileData.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--muted-foreground)]">Permissions</span>
                <span className="text-sm font-medium text-[color:var(--foreground)]">
                  {profileData.permissions.length}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'profile'
                    ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-lg'
                    : 'hover:bg-[color:var(--accent)] text-[color:var(--foreground)]'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={16} />
                <span>Profile Information</span>
              </button>
              
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'security'
                    ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-lg'
                    : 'hover:bg-[color:var(--accent)] text-[color:var(--foreground)]'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Key size={16} />
                <span>Password & Security</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' ? (
            <ProfileForm profileData={profileData} />
          ) : (
            <PasswordChangeForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePresentation;