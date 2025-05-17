"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  Bell,
  Moon,
  Mail,
  Smartphone,
  Globe,
  CircleSlash,
  Save,
  Check,
  SunMedium,
  DollarSign,
  Monitor,
  Calendar,
  Languages,
  Clock,
  UserCog,
  LanguagesIcon,
} from "lucide-react";
import { UserProfileData, UserProfileFormData } from "../types";

interface ProfileSettingsProps {
  profile: UserProfileData;
  onUpdate: (
    data: Partial<UserProfileFormData>
  ) => Promise<boolean | undefined>;
}

export default function ProfileSettings({
  profile,
  onUpdate,
}: ProfileSettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      appointments: true,
      updates: true,
      marketing: false,
    },
    preferences: {
      language: "en-US",
      timeFormat: "12h",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      theme: theme,
    },
  });

  // Shadow color based on theme
  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.15)";

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Handle toggle change
  const handleToggleChange = (section: string, setting: string) => {
    setSettings((prev) => {
      if (section === "notifications") {
        const notifications = prev.notifications;
        return {
          ...prev,
          notifications: {
            ...notifications,
            [setting]: !notifications[setting as keyof typeof notifications],
          },
        };
      } else if (section === "preferences") {
        const preferences = prev.preferences;
        return {
          ...prev,
          preferences: {
            ...preferences,
            [setting]: !preferences[setting as keyof typeof preferences],
          },
        };
      }
      return prev;
    });
  };

  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, setting] = name.split(".");

    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await onUpdate({
        name: profile.name,
      });
      // We don't change the theme based on settings.preferences.theme
      // because that's handled by the ThemeProvider independently
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle component
  const Toggle = ({
    enabled,
    onChange,
    label,
    description,
  }: {
    enabled: boolean;
    onChange: () => void;
    label: string;
    description?: string;
  }) => {
    return (
      <div className="flex items-start justify-between py-2">
        <div>
          <div className="font-medium">{label}</div>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? "bg-primary" : "bg-muted"
          }`}
          role="switch"
          aria-checked={enabled}
          onClick={onChange}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Preferences Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none h-full">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <Bell className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">
                Notification Preferences
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Channels
                  </h3>
                  <div className="space-y-3">
                    <Toggle
                      enabled={settings.notifications.email}
                      onChange={() =>
                        handleToggleChange("notifications", "email")
                      }
                      label="Email Notifications"
                      description="Receive updates via email"
                    />
                    <Toggle
                      enabled={settings.notifications.sms}
                      onChange={() =>
                        handleToggleChange("notifications", "sms")
                      }
                      label="SMS Notifications"
                      description="Receive updates via text message"
                    />
                    <Toggle
                      enabled={settings.notifications.push}
                      onChange={() =>
                        handleToggleChange("notifications", "push")
                      }
                      label="Push Notifications"
                      description="Receive updates via push notifications"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Notification Types
                  </h3>
                  <div className="space-y-3">
                    <Toggle
                      enabled={settings.notifications.appointments}
                      onChange={() =>
                        handleToggleChange("notifications", "appointments")
                      }
                      label="Appointment Reminders"
                      description="Get reminders about upcoming appointments"
                    />
                    <Toggle
                      enabled={settings.notifications.updates}
                      onChange={() =>
                        handleToggleChange("notifications", "updates")
                      }
                      label="Health Updates"
                      description="Get updates about your health records"
                    />
                    <Toggle
                      enabled={settings.notifications.marketing}
                      onChange={() =>
                        handleToggleChange("notifications", "marketing")
                      }
                      label="Marketing Communications"
                      description="Receive promotional emails and offers"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Display Preferences Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none h-full">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <UserCog className="text-secondary" size={20} />
              <h2 className="text-lg font-semibold">Display Preferences</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Appearance
                  </h3>
                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <label className="block font-medium">Theme</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            if (theme !== "light") toggleTheme();
                            setSettings((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                theme: "light",
                              },
                            }));
                          }}
                          className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 ${
                            theme === "light"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <SunMedium size={24} className="text-yellow-500" />
                          </div>
                          <span className="font-medium">Light</span>
                        </button>

                        <button
                          onClick={() => {
                            if (theme !== "dark") toggleTheme();
                            setSettings((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                theme: "dark",
                              },
                            }));
                          }}
                          className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all border-2 ${
                            theme === "dark"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shadow-lg">
                            <Moon size={24} className="text-purple-400" />
                          </div>
                          <span className="font-medium">Dark</span>
                        </button>
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div className="space-y-3">
                      <label className="block font-medium">Language</label>
                      <div className="relative">
                        <select
                          name="preferences.language"
                          value={settings.preferences.language}
                          onChange={handleSelectChange}
                          className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                          <option value="fr-FR">Français</option>
                          <option value="de-DE">Deutsch</option>
                          <option value="zh-CN">中文 (简体)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <LanguagesIcon
                            size={16}
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Format Preferences
                  </h3>
                  <div className="space-y-3">
                    {/* Date Format */}
                    <div>
                      <label className="block font-medium mb-1">
                        Date Format
                      </label>
                      <div className="relative">
                        <select
                          name="preferences.dateFormat"
                          value={settings.preferences.dateFormat}
                          onChange={handleSelectChange}
                          className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Calendar
                            size={16}
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="block font-medium mb-1">
                        Time Format
                      </label>
                      <div className="relative">
                        <select
                          name="preferences.timeFormat"
                          value={settings.preferences.timeFormat}
                          onChange={handleSelectChange}
                          className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        >
                          <option value="12h">12-hour (AM/PM)</option>
                          <option value="24h">24-hour</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <Clock size={16} className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Currency Format */}
                    <div>
                      <label className="block font-medium mb-1">Currency</label>
                      <div className="relative">
                        <select
                          name="preferences.currency"
                          value={settings.preferences.currency}
                          onChange={handleSelectChange}
                          className="w-full appearance-none px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        >
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                          <option value="JPY">Japanese Yen (¥)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <DollarSign
                            size={16}
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Changes Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-6"
      >
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl neumorph-button neumorph-accent-primary flex items-center gap-2 text-primary font-medium hover:transform hover:-translate-y-1 transition-transform dark:text-white"
          style={{
            boxShadow: `0 10px 25px ${shadowColor}`,
          }}
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
