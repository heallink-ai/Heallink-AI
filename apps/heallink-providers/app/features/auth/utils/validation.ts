import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  password: z.string().optional(),
  remember: z.boolean().default(false),
}).refine((data) => data.email || data.phone, {
  message: "Please provide either email or phone number",
}).refine((data) => {
  // Password is required only for email authentication
  if (data.email && !data.phone) {
    return data.password && data.password.length >= 8;
  }
  return true;
}, {
  message: "Password must be at least 8 characters long",
  path: ["password"],
});

const signupStepOneBase = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
});

const signupStepTwoBase = z.object({
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  specialty: z.string().min(2, 'Please specify your medical specialty'),
  licenseNumber: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
});

export const signupStepOneSchema = signupStepOneBase.refine((data) => data.email || data.phone, {
  message: "Please provide either email or phone number",
});

export const signupStepTwoSchema = signupStepTwoBase.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signupSchema = signupStepOneBase.merge(signupStepTwoBase).refine((data) => data.email || data.phone, {
  message: "Please provide either email or phone number",
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the complete 6-digit code'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupStepOneData = z.infer<typeof signupStepOneSchema>;
export type SignupStepTwoData = z.infer<typeof signupStepTwoSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;