"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../providers/OnboardingProvider";
import WorkflowPresentation, { WorkflowSettings, TimeSlot, AppointmentType } from "../components/WorkflowPresentation";

const defaultSettings: WorkflowSettings = {
  availability: [
    { day: 'Monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', enabled: false, startTime: '09:00', endTime: '13:00' },
    { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '13:00' },
  ],
  appointmentTypes: [
    {
      id: 'initial-consultation',
      name: 'Initial Consultation',
      duration: 60,
      price: 200,
      description: 'Comprehensive first-time patient consultation and assessment',
      isVirtual: true,
      isInPerson: true,
      color: '#3b82f6',
    },
    {
      id: 'follow-up',
      name: 'Follow-up Visit',
      duration: 30,
      price: 100,
      description: 'Follow-up appointment for existing patients',
      isVirtual: true,
      isInPerson: true,
      color: '#10b981',
    },
  ],
  bufferTime: 15,
  maxAdvanceBooking: 30,
  cancellationPolicy: 24,
  autoConfirmation: false,
  reminderSettings: {
    email24h: true,
    sms2h: false,
    email1h: true,
  },
  paymentSettings: {
    requireUpfront: false,
    acceptInsurance: true,
    acceptCash: true,
    acceptCard: true,
  },
};

export default function WorkflowContainer() {
  const router = useRouter();
  const { progress, updateProgress, goToNextStep, saveProgress, isLoading } = useOnboarding();
  const [settings, setSettings] = useState<WorkflowSettings>(
    progress.workflowSettings || defaultSettings
  );
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Update onboarding state when settings change
    updateProgress({ workflowSettings: settings });
  }, [settings, updateProgress]);

  const handleSettingsChange = (updates: Partial<WorkflowSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const validateSettings = () => {
    const errors: any = {};
    
    // Check if at least one day is enabled for availability
    const hasAvailability = settings.availability.some(slot => slot.enabled);
    if (!hasAvailability) {
      errors.availability = "Please set availability for at least one day";
    }

    // Check if there's at least one appointment type
    if (settings.appointmentTypes.length === 0) {
      errors.appointmentTypes = "Please add at least one appointment type";
    }

    // Validate appointment types
    const invalidAppointments = settings.appointmentTypes.filter(apt => 
      !apt.name.trim() || 
      apt.duration <= 0 || 
      apt.price < 0 ||
      (!apt.isVirtual && !apt.isInPerson)
    );

    if (invalidAppointments.length > 0) {
      errors.appointmentTypes = "Please complete all appointment type details";
    }

    return errors;
  };

  const handleContinue = async () => {
    // Validate the workflow settings
    const validationErrors = validateSettings();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any errors
    setErrors({});

    // Save progress and continue to next step
    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push("/onboarding/review");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/compliance");
  };

  return (
    <WorkflowPresentation
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onContinue={handleContinue}
      onBack={handleBack}
      isLoading={isLoading}
      errors={errors}
    />
  );
}