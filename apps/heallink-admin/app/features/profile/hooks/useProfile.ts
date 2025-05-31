import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { ProfileUpdateData, PasswordChangeData } from '../types/profile.types';
import { toast } from 'react-hot-toast';

// Query keys
export const PROFILE_QUERY_KEYS = {
  profile: ['profile'] as const,
  avatar: (key: string) => ['avatar', key] as const,
};

// Get current profile
export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.profile,
    queryFn: profileService.getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdateData) => profileService.updateProfile(data),
    onSuccess: (data) => {
      // Update the cached profile data
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, data);
      toast.success('Profile updated successfully');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: PasswordChangeData) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    },
  });
};

// Upload avatar mutation
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (avatarUrl) => {
      // Update the profile cache with new avatar URL
      queryClient.setQueryData(PROFILE_QUERY_KEYS.profile, (oldData: unknown) => {
        if (oldData) {
          return { ...oldData, avatarUrl };
        }
        return oldData;
      });
      
      toast.success('Profile picture updated successfully');
    },
    onError: (error: unknown) => {
      const message = (error as any)?.response?.data?.message || 'Failed to upload profile picture';
      toast.error(message);
    },
  });
};

// Get avatar URL
export const useAvatarUrl = (avatarKey?: string) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.avatar(avatarKey || ''),
    queryFn: () => avatarKey ? profileService.getAvatarUrl(avatarKey) : Promise.resolve(''),
    enabled: !!avatarKey,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};