'use client';

import React, { useState } from 'react';
import { Key, Eye, EyeOff, AlertCircle, Check, Shield } from 'lucide-react';
import { useChangePassword } from '../hooks/useProfile';
import { PasswordChangeData } from '../types/profile.types';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const PasswordChangeForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const changePasswordMutation = useChangePassword();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength = Object.values(requirements).filter(Boolean).length;
    
    return {
      score: strength,
      requirements,
      level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong',
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const passwordData: PasswordChangeData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    changePasswordMutation.mutate(passwordData, {
      onSuccess: () => {
        // Reset form on success
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setErrors({});
      },
    });
  };

  const PasswordField: React.FC<{
    label: string;
    name: keyof FormData;
    placeholder: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
    error?: string;
    showStrength?: boolean;
  }> = ({ label, name, placeholder, showPassword, onToggleVisibility, error, showStrength }) => (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[color:var(--foreground)]"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-[color:var(--border)] hover:border-[color:var(--border)]/80'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrength && formData.newPassword && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[color:var(--muted)] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength.level === 'weak'
                    ? 'bg-red-500 w-1/3'
                    : passwordStrength.level === 'medium'
                    ? 'bg-amber-500 w-2/3'
                    : 'bg-emerald-500 w-full'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${
              passwordStrength.level === 'weak'
                ? 'text-red-500'
                : passwordStrength.level === 'medium'
                ? 'text-amber-500'
                : 'text-emerald-500'
            }`}>
              {passwordStrength.level === 'weak' ? 'Weak' : passwordStrength.level === 'medium' ? 'Medium' : 'Strong'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(passwordStrength.requirements).map(([key, met]) => (
              <div key={key} className={`flex items-center gap-1 ${met ? 'text-emerald-600' : 'text-[color:var(--muted-foreground)]'}`}>
                {met ? <Check size={12} /> : <div className="w-3 h-3 border border-current rounded-full" />}
                <span>
                  {key === 'length' ? '8+ characters' :
                   key === 'lowercase' ? 'Lowercase' :
                   key === 'uppercase' ? 'Uppercase' :
                   key === 'number' ? 'Number' :
                   'Special char'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[color:var(--card)] rounded-2xl p-8 border border-[color:var(--border)] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-[color:var(--primary)]/10">
          <Shield className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[color:var(--foreground)] mb-1">
            Password & Security
          </h2>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <PasswordField
          label="Current Password"
          name="currentPassword"
          placeholder="Enter your current password"
          showPassword={showPasswords.current}
          onToggleVisibility={() => togglePasswordVisibility('current')}
          error={errors.currentPassword}
        />

        {/* New Password */}
        <PasswordField
          label="New Password"
          name="newPassword"
          placeholder="Enter your new password"
          showPassword={showPasswords.new}
          onToggleVisibility={() => togglePasswordVisibility('new')}
          error={errors.newPassword}
          showStrength={true}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          placeholder="Confirm your new password"
          showPassword={showPasswords.confirm}
          onToggleVisibility={() => togglePasswordVisibility('confirm')}
          error={errors.confirmPassword}
        />

        {/* Security Tips */}
        <div className="bg-[color:var(--muted)]/20 rounded-xl p-4 border border-[color:var(--border)]">
          <h4 className="text-sm font-medium text-[color:var(--foreground)] mb-2">
            Password Security Tips
          </h4>
          <ul className="text-xs text-[color:var(--muted-foreground)] space-y-1">
            <li>• Use a unique password for your admin account</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid using personal information or common words</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="px-6 py-3 rounded-xl bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-[color:var(--primary-foreground)] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {changePasswordMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Key size={16} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;