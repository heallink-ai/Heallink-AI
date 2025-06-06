"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "./InputField";
import Button from "./Button";
import SocialButton from "./SocialButton";
import PhoneInput from "./PhoneInput";

type AuthMode = "email" | "phone";

export default function SignupForm() {
  const router = useRouter();
  
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organization: "",
    specialty: "",
    licenseNumber: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone } = formData;
    const credential = authMode === "email" ? email : phone;
    
    if (!firstName.trim() || !lastName.trim() || !credential.trim()) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (authMode === "email" && !email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    const { password, confirmPassword, organization, specialty } = formData;
    
    if (!password || !confirmPassword || !organization.trim() || !specialty.trim()) {
      setError("Please fill in all required fields");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (!acceptTerms) {
      setError("Please accept the Terms of Service to continue");
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    setError("");
    
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual signup logic
      console.log("Signup attempt:", { authMode, formData, acceptTerms, acceptMarketing });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate successful signup
      const credential = authMode === "email" ? formData.email : formData.phone;
      
      // Redirect to OTP verification or success page
      router.push(`/verify-otp?${authMode}=${encodeURIComponent(credential)}&type=signup`);
      
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: string) => {
    try {
      console.log(`Social signup with ${provider}`);
      // TODO: Implement social authentication
      setError("Social signup will be implemented soon.");
    } catch (err) {
      console.error(`${provider} signup error:`, err);
      setError(`Failed to signup with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            currentStep >= 1 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white" : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 transition-all duration-200 ${
            currentStep >= 2 ? "bg-gradient-to-r from-purple-heart to-royal-blue" : "bg-[color:var(--border)]"
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
            currentStep >= 2 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white" : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
          }`}>
            2
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {currentStep === 1 ? (
        <div className="space-y-5">
          {/* Step 1: Basic Information */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Personal Information</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Let's start with your basic details</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              autoComplete="given-name"
            />
            <InputField
              id="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              autoComplete="family-name"
            />
          </div>

          {/* Auth mode toggle */}
          <div className="neumorph-flat rounded-xl p-1 flex">
            <button
              type="button"
              onClick={() => setAuthMode("email")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === "email"
                  ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("phone")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                authMode === "phone"
                  ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Phone
            </button>
          </div>

          {authMode === "email" ? (
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="dr.smith@hospital.com"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              autoComplete="email"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
            />
          ) : (
            <PhoneInput
              id="phone"
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              required
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
            />
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNextStep}
          >
            Continue
          </Button>

          {/* Social signup */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[color:var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <SocialButton
              provider="google"
              onClick={() => handleSocialSignup("google")}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 2: Professional Information */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Professional Details</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Tell us about your practice</p>
          </div>

          <InputField
            id="organization"
            label="Organization/Hospital"
            type="text"
            placeholder="City General Hospital"
            required
            value={formData.organization}
            onChange={(e) => handleInputChange("organization", e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18m2.25-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.75m-.75 3h.75m-.75 3h.75m-.75 3h.75M9 21v-5.25"
                />
              </svg>
            }
          />

          <InputField
            id="specialty"
            label="Medical Specialty"
            type="text"
            placeholder="Internal Medicine, Cardiology, etc."
            required
            value={formData.specialty}
            onChange={(e) => handleInputChange("specialty", e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            }
          />

          <InputField
            id="licenseNumber"
            label="Medical License Number (Optional)"
            type="text"
            placeholder="MD123456"
            value={formData.licenseNumber}
            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            }
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            autoComplete="new-password"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            }
          />

          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            autoComplete="new-password"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          {/* Terms and conditions */}
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-[color:var(--foreground)]">
                I agree to the{" "}
                <Link href="/legal/terms" className="text-purple-heart hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-purple-heart hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-start">
              <input
                id="acceptMarketing"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
                checked={acceptMarketing}
                onChange={(e) => setAcceptMarketing(e.target.checked)}
              />
              <label htmlFor="acceptMarketing" className="ml-2 text-sm text-[color:var(--muted-foreground)]">
                I'd like to receive updates about new features and healthcare insights
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={handlePrevStep}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>
      )}

      {/* Sign in link */}
      <div className="text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}