'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useUpdateProfile } from '../hooks/useProfile';
import { ProfileData, ProfileUpdateData } from '../types/profile.types';

interface ProfileFormProps {
  profileData: ProfileData;
}

interface FormData {
  name: string;
  phone: string;
  department: string;
  bio: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  department?: string;
  bio?: string;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ profileData }) => {
  const [formData, setFormData] = useState<FormData>({
    name: profileData.name || '',
    phone: profileData.phone || '',
    department: profileData.department || '',
    bio: profileData.bio || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  const updateProfileMutation = useUpdateProfile();

  // Update form data when profile data changes
  useEffect(() => {
    setFormData({
      name: profileData.name || '',
      phone: profileData.phone || '',
      department: profileData.department || '',
      bio: profileData.bio || '',
    });
  }, [profileData]);

  // Check for changes
  useEffect(() => {
    const hasChanges = 
      formData.name !== (profileData.name || '') ||
      formData.phone !== (profileData.phone || '') ||
      formData.department !== (profileData.department || '') ||
      formData.bio !== (profileData.bio || '');
    
    setHasChanges(hasChanges);
  }, [formData, profileData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.phone && !formData.phone.match(/^[+]?[\d\s\-\(\)]+$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updateData: ProfileUpdateData = {
      name: formData.name,
      phone: formData.phone || undefined,
      department: formData.department || undefined,
      bio: formData.bio || undefined,
    };

    updateProfileMutation.mutate(updateData);
  };

  return (
    <div className="bg-[color:var(--card)] rounded-2xl p-8 border border-[color:var(--border)] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--foreground)] mb-1">
            Profile Information
          </h2>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Update your personal details and contact information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[color:var(--foreground)]"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[color:var(--border)] hover:border-[color:var(--border)]/80'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[color:var(--foreground)]"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              className="w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-[color:var(--muted-foreground)]">
              Email cannot be changed. Contact system administrator if needed.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[color:var(--foreground)]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-[color:var(--border)] hover:border-[color:var(--border)]/80'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-[color:var(--foreground)]"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-[color:var(--border)] hover:border-[color:var(--border)]/80 transition-all duration-200 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)]"
              placeholder="e.g., IT Operations, Healthcare Administration"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[color:var(--foreground)]"
            >
              Role & Permissions
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="role"
                value={profileData.adminRole?.replace('_', ' ') || profileData.role}
                className="flex-1 px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] cursor-not-allowed"
                disabled
              />
              <div className="px-3 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/30 text-[color:var(--muted-foreground)] text-sm flex items-center">
                {profileData.permissions.length} permissions
              </div>
            </div>
            <p className="text-xs text-[color:var(--muted-foreground)]">
              Role and permissions are managed by system administrators.
            </p>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[color:var(--foreground)]">
              Account Status
            </label>
            <div className="flex gap-3">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                profileData.isActive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  profileData.isActive ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                {profileData.isActive ? 'Active' : 'Suspended'}
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                profileData.emailVerified
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  profileData.emailVerified ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
                {profileData.emailVerified ? 'Verified' : 'Unverified'}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-[color:var(--foreground)]"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] resize-none ${
              errors.bio
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-[color:var(--border)] hover:border-[color:var(--border)]/80'
            }`}
            placeholder="Tell us about yourself, your role, and your experience..."
          />
          <div className="flex justify-between items-center">
            {errors.bio ? (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.bio}</span>
              </div>
            ) : (
              <div />
            )}
            <span className="text-xs text-[color:var(--muted-foreground)]">
              {formData.bio.length}/500 characters
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!hasChanges || updateProfileMutation.isPending}
            className="px-6 py-3 rounded-xl bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {updateProfileMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;