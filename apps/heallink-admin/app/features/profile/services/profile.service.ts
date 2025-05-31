import apiClient from '../../../api/apiClient';
import { ProfileData, ProfileUpdateData, PasswordChangeData, ProfileResponse, ProfileUpdateResponse, PasswordChangeResponse, AvatarUploadResponse } from '../types/profile.types';

export const profileService = {
  // Get current admin profile
  async getCurrentProfile(): Promise<ProfileData> {
    try {
      const response = await apiClient.get<ProfileData>('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update admin profile
  async updateProfile(data: ProfileUpdateData): Promise<ProfileData> {
    try {
      const response = await apiClient.patch<ProfileData>('/admin/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(data: PasswordChangeData): Promise<PasswordChangeResponse> {
    try {
      const response = await apiClient.post<PasswordChangeResponse>('/admin/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<AvatarUploadResponse>('/admin/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  // Get avatar URL (signed URL for S3)
  async getAvatarUrl(avatarKey: string): Promise<string> {
    try {
      const response = await apiClient.get<{ url: string }>(`/admin/avatar/${avatarKey}`);
      return response.data.url;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      throw error;
    }
  },
};