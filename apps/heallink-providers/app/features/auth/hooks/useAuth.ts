"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { LoginFormData, SignupFormData, OTPVerificationData } from '../types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: currentProvider, isLoading } = useQuery({
    queryKey: ['auth', 'currentProvider'],
    queryFn: () => authService.getCurrentProvider(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.redirectUrl) {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        router.push(response.redirectUrl);
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormData) => authService.signup(data),
    onSuccess: (response) => {
      if (response.success && response.redirectUrl) {
        router.push(response.redirectUrl);
      }
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: (data: OTPVerificationData) => authService.verifyOTP(data),
    onSuccess: (response) => {
      if (response.success && response.redirectUrl) {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        router.push(response.redirectUrl);
      }
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: (provider: string) => authService.socialLogin(provider),
    onSuccess: (response) => {
      if (response.success && response.redirectUrl) {
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        router.push(response.redirectUrl);
      }
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: (credential: string) => authService.resendOTP(credential),
  });

  const logout = () => {
    authService.logout();
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    router.push('/');
  };

  return {
    // State
    currentProvider,
    isAuthenticated: !!currentProvider,
    isLoading,
    
    // Mutations
    login: loginMutation,
    signup: signupMutation,
    verifyOTP: verifyOTPMutation,
    socialLogin: socialLoginMutation,
    resendOTP: resendOTPMutation,
    logout,
  };
};