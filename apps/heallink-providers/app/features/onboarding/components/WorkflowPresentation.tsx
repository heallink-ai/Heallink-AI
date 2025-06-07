"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Calendar,
  Clock,
  Users,
  Settings,
  Video,
  MapPin,
  Phone,
  MessageSquare,
  Bell,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Sparkles,
  Shield,
  Zap,
  AlertCircle,
  X,
  Edit3,
  Save
} from "lucide-react";
import { InputField, SelectField, ToggleField } from "./FormComponents";

export interface TimeSlot {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  isVirtual: boolean;
  isInPerson: boolean;
  color: string;
}

export interface WorkflowSettings {
  availability: TimeSlot[];
  appointmentTypes: AppointmentType[];
  bufferTime: number;
  maxAdvanceBooking: number;
  cancellationPolicy: number;
  autoConfirmation: boolean;
  reminderSettings: {
    email24h: boolean;
    sms2h: boolean;
    email1h: boolean;
  };
  paymentSettings: {
    requireUpfront: boolean;
    acceptInsurance: boolean;
    acceptCash: boolean;
    acceptCard: boolean;
  };
}

interface WorkflowPresentationProps {
  settings: WorkflowSettings;
  onSettingsChange: (settings: Partial<WorkflowSettings>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function WorkflowPresentation({
  settings,
  onSettingsChange,
  onContinue,
  onBack,
  isLoading,
  errors,
}: WorkflowPresentationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState<'availability' | 'appointments' | 'preferences'>('availability');
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const sections = [
    { 
      id: 'availability', 
      name: 'Availability', 
      icon: Calendar, 
      description: 'Set your weekly schedule and availability',
      color: '#10b981'
    },
    { 
      id: 'appointments', 
      name: 'Appointment Types', 
      icon: Users, 
      description: 'Configure your service offerings and pricing',
      color: '#3b82f6'
    },
    { 
      id: 'preferences', 
      name: 'Preferences', 
      icon: Settings, 
      description: 'Customize booking rules and notifications',
      color: '#8b5cf6'
    },
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const appointmentColors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  const handleAvailabilityChange = (dayIndex: number, updates: Partial<TimeSlot>) => {
    const newAvailability = [...settings.availability];
    newAvailability[dayIndex] = { ...newAvailability[dayIndex], ...updates };
    onSettingsChange({ availability: newAvailability });
  };

  const handleAppointmentTypeChange = (id: string, updates: Partial<AppointmentType>) => {
    const newTypes = settings.appointmentTypes.map(type =>
      type.id === id ? { ...type, ...updates } : type
    );
    onSettingsChange({ appointmentTypes: newTypes });
  };

  const handleAddAppointmentType = () => {
    const newType: AppointmentType = {
      id: `apt_${Date.now()}`,
      name: 'New Appointment Type',
      duration: 30,
      price: 100,
      description: 'Description of the appointment type',
      isVirtual: true,
      isInPerson: false,
      color: appointmentColors[settings.appointmentTypes.length % appointmentColors.length],
    };
    onSettingsChange({ 
      appointmentTypes: [...settings.appointmentTypes, newType] 
    });
    setEditingAppointment(newType.id);
  };

  const handleRemoveAppointmentType = (id: string) => {
    onSettingsChange({ 
      appointmentTypes: settings.appointmentTypes.filter(type => type.id !== id) 
    });
  };

  const isFormValid = () => {
    const hasAvailability = settings.availability.some(slot => slot.enabled);
    const hasAppointmentTypes = settings.appointmentTypes.length > 0;
    return hasAvailability && hasAppointmentTypes;
  };

  return (
    <div className="space-y-10">
      {/* Enhanced Header Section */}
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="relative inline-flex"
          animate={{
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            }}
          >
            {/* Animated shimmer */}
            <motion.div
              className="absolute inset-0 -skew-x-12"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
            <Settings className="w-10 h-10 text-white relative z-10" />
          </div>
          
          {/* Floating sparkles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 12}%`,
                right: `${5 + i * 8}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
            </motion.div>
          ))}
        </motion.div>

        <div>
          <motion.h1 
            className="text-4xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #10b981 30%, #3b82f6 70%, #8b5cf6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Workflow Setup
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            style={{ 
              color: isDarkMode ? '#a1a1aa' : '#64748b',
              fontWeight: '400',
              lineHeight: '1.6',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Configure your availability, appointment types, and booking preferences to optimize your practice workflow
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Section Navigation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-wrap gap-6 justify-center">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className="relative group overflow-hidden"
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)`
                    : (isDarkMode ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'),
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive 
                    ? 'transparent'
                    : (isDarkMode ? '#4b5563' : '#e2e8f0'),
                  borderRadius: '20px',
                  padding: '20px 24px',
                  boxShadow: isActive
                    ? `0 10px 25px ${section.color}30, 0 4px 6px ${section.color}20`
                    : (isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'),
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: isActive
                    ? `0 15px 30px ${section.color}40, 0 8px 12px ${section.color}30`
                    : '0 12px 20px rgba(0, 0, 0, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                {/* Shimmer effect for active state */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 -skew-x-12"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      }}
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: isActive 
                        ? 'rgba(255, 255, 255, 0.2)'
                        : `${section.color}15`,
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                    }}
                    animate={{
                      rotate: isActive ? [0, 5, -5, 0] : 0,
                      scale: isActive ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 3,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ 
                        color: isActive ? '#ffffff' : section.color
                      }}
                    />
                  </motion.div>

                  <div className="text-left min-w-0">
                    <h3 
                      className="font-bold text-lg leading-tight"
                      style={{ 
                        color: isActive ? '#ffffff' : (isDarkMode ? '#f9fafb' : '#1f2937')
                      }}
                    >
                      {section.name}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed mt-1"
                      style={{ 
                        color: isActive ? 'rgba(255, 255, 255, 0.8)' : (isDarkMode ? '#d1d5db' : '#64748b')
                      }}
                    >
                      {section.description}
                    </p>
                  </div>

                  {/* Arrow indicator for active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Enhanced Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Availability Section */}
          {activeSection === 'availability' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Section Header */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                  }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                  >
                    Set Your Weekly Availability
                  </h2>
                  <p 
                    className="text-lg"
                    style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                  >
                    Configure when you're available for appointments
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Weekly Schedule */}
              <motion.div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                  boxShadow: isDarkMode 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-8">
                  <div className="space-y-6">
                    {daysOfWeek.map((day, index) => {
                      const daySlot = settings.availability[index] || {
                        day,
                        enabled: false,
                        startTime: '09:00',
                        endTime: '17:00'
                      };
                      
                      return (
                        <motion.div
                          key={day}
                          className="relative overflow-hidden rounded-2xl"
                          style={{
                            background: daySlot.enabled
                              ? (isDarkMode ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)')
                              : (isDarkMode ? '#374151' : '#f9fafb'),
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: daySlot.enabled ? '#10b981' : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                            padding: '20px',
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <ToggleField
                                label=""
                                name={`${day}-enabled`}
                                value={daySlot.enabled}
                                onChange={(enabled) => handleAvailabilityChange(index, { enabled })}
                              />
                              
                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5" style={{ color: '#10b981' }} />
                                <h3 
                                  className="text-lg font-semibold min-w-[100px]"
                                  style={{ 
                                    color: daySlot.enabled 
                                      ? '#10b981' 
                                      : (isDarkMode ? '#9ca3af' : '#6b7280')
                                  }}
                                >
                                  {day}
                                </h3>
                              </div>
                            </div>

                            <AnimatePresence>
                              {daySlot.enabled && (
                                <motion.div
                                  className="flex items-center gap-4"
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: 'auto' }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" style={{ color: '#10b981' }} />
                                    <select
                                      value={daySlot.startTime}
                                      onChange={(e) => handleAvailabilityChange(index, { startTime: e.target.value })}
                                      className="px-3 py-2 rounded-lg border"
                                      style={{
                                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                        color: isDarkMode ? '#f9fafb' : '#111827',
                                      }}
                                    >
                                      {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <span style={{ color: isDarkMode ? '#d1d5db' : '#6b7280' }}>to</span>

                                  <div className="flex items-center gap-2">
                                    <select
                                      value={daySlot.endTime}
                                      onChange={(e) => handleAvailabilityChange(index, { endTime: e.target.value })}
                                      className="px-3 py-2 rounded-lg border"
                                      style={{
                                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                        color: isDarkMode ? '#f9fafb' : '#111827',
                                      }}
                                    >
                                      {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Appointment Types Section */}
          {activeSection === 'appointments' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Section Header */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                  >
                    Configure Appointment Types
                  </h2>
                  <p 
                    className="text-lg"
                    style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                  >
                    Define your services, pricing, and appointment options
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Appointment Types */}
              <div className="space-y-6">
                {settings.appointmentTypes.map((appointment, index) => {
                  const isEditing = editingAppointment === appointment.id;
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      className="relative overflow-hidden rounded-3xl"
                      style={{
                        background: isDarkMode 
                          ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: appointment.color,
                        boxShadow: `0 20px 25px -5px ${appointment.color}15`,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center"
                              style={{
                                backgroundColor: appointment.color,
                                boxShadow: `0 4px 12px ${appointment.color}30`,
                              }}
                            >
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            
                            {isEditing ? (
                              <InputField
                                label=""
                                name="appointmentName"
                                value={appointment.name}
                                onChange={(value) => handleAppointmentTypeChange(appointment.id, { name: value })}
                                className="flex-1"
                              />
                            ) : (
                              <div>
                                <h3 
                                  className="text-xl font-bold"
                                  style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                                >
                                  {appointment.name}
                                </h3>
                                <div className="flex items-center gap-4 mt-1">
                                  <span 
                                    className="text-sm font-medium"
                                    style={{ color: appointment.color }}
                                  >
                                    {appointment.duration} minutes
                                  </span>
                                  <span 
                                    className="text-lg font-bold"
                                    style={{ color: appointment.color }}
                                  >
                                    ${appointment.price}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => setEditingAppointment(isEditing ? null : appointment.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'transparent',
                                border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isEditing ? (
                                <Save className="w-4 h-4" style={{ color: '#10b981' }} />
                              ) : (
                                <Edit3 className="w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                              )}
                            </motion.button>

                            <motion.button
                              onClick={() => handleRemoveAppointmentType(appointment.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #ef4444',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </motion.button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isEditing && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="space-y-6"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                  label="Duration (minutes)"
                                  name="duration"
                                  type="number"
                                  value={appointment.duration.toString()}
                                  onChange={(value) => handleAppointmentTypeChange(appointment.id, { duration: parseInt(value) || 30 })}
                                  icon={<Clock className="w-4 h-4" />}
                                />

                                <InputField
                                  label="Price ($)"
                                  name="price"
                                  type="number"
                                  value={appointment.price.toString()}
                                  onChange={(value) => handleAppointmentTypeChange(appointment.id, { price: parseFloat(value) || 0 })}
                                  icon={<DollarSign className="w-4 h-4" />}
                                />
                              </div>

                              <InputField
                                label="Description"
                                name="description"
                                value={appointment.description}
                                onChange={(value) => handleAppointmentTypeChange(appointment.id, { description: value })}
                                placeholder="Describe this appointment type..."
                              />

                              <div className="flex gap-6">
                                <ToggleField
                                  label="Virtual Appointments"
                                  name="isVirtual"
                                  value={appointment.isVirtual}
                                  onChange={(value) => handleAppointmentTypeChange(appointment.id, { isVirtual: value })}
                                  description="Allow video/phone consultations"
                                />

                                <ToggleField
                                  label="In-Person Appointments"
                                  name="isInPerson"
                                  value={appointment.isInPerson}
                                  onChange={(value) => handleAppointmentTypeChange(appointment.id, { isInPerson: value })}
                                  description="Allow office visits"
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {!isEditing && (
                          <div className="space-y-4">
                            <p 
                              className="text-lg"
                              style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                            >
                              {appointment.description}
                            </p>
                            
                            <div className="flex items-center gap-4">
                              {appointment.isVirtual && (
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" style={{ color: appointment.color }} />
                                  <span 
                                    className="text-sm font-medium"
                                    style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                                  >
                                    Virtual
                                  </span>
                                </div>
                              )}
                              
                              {appointment.isInPerson && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" style={{ color: appointment.color }} />
                                  <span 
                                    className="text-sm font-medium"
                                    style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                                  >
                                    In-Person
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add New Appointment Type Button */}
                <motion.button
                  onClick={handleAddAppointmentType}
                  className="w-full relative overflow-hidden rounded-3xl"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
                      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    borderColor: '#3b82f6',
                    padding: '32px',
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Plus className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    <span className="text-xl font-semibold text-blue-500">
                      Add New Appointment Type
                    </span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Section Header */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
                  }}
                  animate={{
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Settings className="w-8 h-8 text-white" />
                </motion.div>
                
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                  >
                    Booking Preferences
                  </h2>
                  <p 
                    className="text-lg"
                    style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                  >
                    Customize your booking rules and notification settings
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Preferences Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Rules */}
                <motion.div
                  className="relative overflow-hidden rounded-3xl"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                    boxShadow: isDarkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
                      : '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                      >
                        Booking Rules
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <InputField
                        label="Buffer Time Between Appointments"
                        name="bufferTime"
                        type="number"
                        value={settings.bufferTime?.toString() || '15'}
                        onChange={(value) => onSettingsChange({ bufferTime: parseInt(value) || 15 })}
                        placeholder="15"
                        icon={<Clock className="w-4 h-4" />}
                      />

                      <InputField
                        label="Maximum Advance Booking (days)"
                        name="maxAdvanceBooking"
                        type="number"
                        value={settings.maxAdvanceBooking?.toString() || '30'}
                        onChange={(value) => onSettingsChange({ maxAdvanceBooking: parseInt(value) || 30 })}
                        placeholder="30"
                        icon={<Calendar className="w-4 h-4" />}
                      />

                      <InputField
                        label="Cancellation Policy (hours)"
                        name="cancellationPolicy"
                        type="number"
                        value={settings.cancellationPolicy?.toString() || '24'}
                        onChange={(value) => onSettingsChange({ cancellationPolicy: parseInt(value) || 24 })}
                        placeholder="24"
                        icon={<AlertCircle className="w-4 h-4" />}
                      />

                      <ToggleField
                        label="Auto-confirm Appointments"
                        name="autoConfirmation"
                        value={settings.autoConfirmation || false}
                        onChange={(value) => onSettingsChange({ autoConfirmation: value })}
                        description="Automatically confirm appointments without manual review"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Notifications & Payments */}
                <div className="space-y-8">
                  {/* Notification Settings */}
                  <motion.div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' 
                        : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: isDarkMode ? '#059669' : '#a7f3d0',
                      boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ color: isDarkMode ? '#10b981' : '#065f46' }}
                        >
                          Reminders
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <ToggleField
                          label="Email 24h before"
                          name="email24h"
                          value={settings.reminderSettings?.email24h || false}
                          onChange={(value) => onSettingsChange({ 
                            reminderSettings: { ...settings.reminderSettings, email24h: value }
                          })}
                        />

                        <ToggleField
                          label="SMS 2h before"
                          name="sms2h"
                          value={settings.reminderSettings?.sms2h || false}
                          onChange={(value) => onSettingsChange({ 
                            reminderSettings: { ...settings.reminderSettings, sms2h: value }
                          })}
                        />

                        <ToggleField
                          label="Email 1h before"
                          name="email1h"
                          value={settings.reminderSettings?.email1h || false}
                          onChange={(value) => onSettingsChange({ 
                            reminderSettings: { ...settings.reminderSettings, email1h: value }
                          })}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment Settings */}
                  <motion.div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%)' 
                        : 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: isDarkMode ? '#1e40af' : '#93c5fd',
                      boxShadow: '0 20px 25px -5px rgba(30, 64, 175, 0.15)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                          }}
                        >
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h3 
                          className="text-lg font-bold"
                          style={{ color: isDarkMode ? '#3b82f6' : '#1e40af' }}
                        >
                          Payments
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <ToggleField
                          label="Require upfront payment"
                          name="requireUpfront"
                          value={settings.paymentSettings?.requireUpfront || false}
                          onChange={(value) => onSettingsChange({ 
                            paymentSettings: { ...settings.paymentSettings, requireUpfront: value }
                          })}
                        />

                        <ToggleField
                          label="Accept insurance"
                          name="acceptInsurance"
                          value={settings.paymentSettings?.acceptInsurance || false}
                          onChange={(value) => onSettingsChange({ 
                            paymentSettings: { ...settings.paymentSettings, acceptInsurance: value }
                          })}
                        />

                        <ToggleField
                          label="Accept credit cards"
                          name="acceptCard"
                          value={settings.paymentSettings?.acceptCard || true}
                          onChange={(value) => onSettingsChange({ 
                            paymentSettings: { ...settings.paymentSettings, acceptCard: value }
                          })}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-between pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Enhanced Back Button */}
        <motion.button
          onClick={onBack}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
              : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isDarkMode ? '#6b7280' : '#e2e8f0',
            padding: '16px 32px',
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: isDarkMode 
              ? '0 8px 12px -2px rgba(0, 0, 0, 0.4)' 
              : '0 8px 12px -2px rgba(0, 0, 0, 0.15)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span 
            className="font-semibold text-lg"
            style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
          >
            Back to Compliance
          </span>
        </motion.button>

        {/* Enhanced Continue Button */}
        <motion.button
          onClick={onContinue}
          disabled={isLoading || !isFormValid()}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: (isLoading || !isFormValid())
              ? (isDarkMode ? '#4b5563' : '#e5e7eb')
              : 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
            borderWidth: '0px',
            padding: '16px 32px',
            boxShadow: (isLoading || !isFormValid())
              ? 'none' 
              : '0 10px 25px rgba(16, 185, 129, 0.3), 0 4px 6px rgba(59, 130, 246, 0.2)',
            cursor: (isLoading || !isFormValid()) ? 'not-allowed' : 'pointer',
          }}
          whileHover={!(isLoading || !isFormValid()) ? { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4), 0 8px 12px rgba(59, 130, 246, 0.3)'
          } : {}}
          whileTap={!(isLoading || !isFormValid()) ? { scale: 0.98 } : {}}
        >
          {/* Shimmer effect */}
          <AnimatePresence>
            {!(isLoading || !isFormValid()) && (
              <motion.div
                className="absolute inset-0 -skew-x-12"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative flex items-center gap-3">
            {isLoading ? (
              <>
                <motion.div
                  className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-bold text-lg text-white">
                  Saving Workflow...
                </span>
              </>
            ) : !isFormValid() ? (
              <>
                <AlertCircle className="w-6 h-6" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                <span 
                  className="font-bold text-lg"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Complete setup to continue
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">
                  Continue to Review
                </span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </motion.div>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}