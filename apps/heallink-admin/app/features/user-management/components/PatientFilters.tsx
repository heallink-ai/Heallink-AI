"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  Shield, 
  CreditCard,
  Clock,
  Filter,
  RefreshCw
} from "lucide-react";
import { AccountStatus, InsuranceStatus, SubscriptionPlan } from "../types/user.types";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  color?: string;
}

interface PatientFiltersProps {
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

export default function PatientFilters({ filters, onChange }: PatientFiltersProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const statusOptions: FilterOption[] = [
    { label: "Active", value: "active", count: 156, color: "green" },
    { label: "Pending Verification", value: "pending_verification", count: 23, color: "orange" },
    { label: "Suspended", value: "suspended", count: 8, color: "red" },
    { label: "Deactivated", value: "deactivated", count: 12, color: "gray" }
  ];

  const insuranceOptions: FilterOption[] = [
    { label: "Verified", value: "verified", count: 142, color: "green" },
    { label: "Pending", value: "pending", count: 31, color: "orange" },
    { label: "Expired", value: "expired", count: 18, color: "red" },
    { label: "Unverified", value: "unverified", count: 24, color: "gray" }
  ];

  const subscriptionOptions: FilterOption[] = [
    { label: "Free", value: "free", count: 89, color: "blue" },
    { label: "Basic", value: "basic", count: 67, color: "purple" },
    { label: "Premium", value: "premium", count: 43, color: "gold" },
    { label: "Family", value: "family", count: 21, color: "green" }
  ];

  const locationOptions: FilterOption[] = [
    { label: "United States", value: "US", count: 156 },
    { label: "Canada", value: "CA", count: 34 },
    { label: "United Kingdom", value: "UK", count: 28 },
    { label: "Australia", value: "AU", count: 15 }
  ];

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    orange: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    gray: "bg-[color:var(--muted)]/10 text-[color:var(--muted-foreground)]",
    blue: "bg-[color:var(--primary)]/10 text-[color:var(--primary)]",
    purple: "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]",
    gold: "bg-[color:var(--warning)]/10 text-[color:var(--warning)]"
  };

  const handleFilterChange = (key: string, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onChange({});
  };

  const FilterSection = ({ 
    title, 
    options, 
    filterKey, 
    icon: Icon, 
    allowMultiple = false 
  }: {
    title: string;
    options: FilterOption[];
    filterKey: string;
    icon: any;
    allowMultiple?: boolean;
  }) => {
    const isActive = activeSection === filterKey;
    const selectedValues = filters[filterKey] || (allowMultiple ? [] : null);
    const hasSelection = allowMultiple ? selectedValues.length > 0 : selectedValues !== null;
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (buttonRef && !buttonRef.contains(event.target as Node)) {
          const dropdown = document.querySelector(`[data-filter-dropdown="${filterKey}"]`);
          if (dropdown && !dropdown.contains(event.target as Node)) {
            setActiveSection(null);
          }
        }
      };

      if (isActive) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isActive, buttonRef, filterKey]);

    const calculateDropdownPosition = () => {
      if (!buttonRef) return { top: 0, left: 0, width: 0 };
      
      const rect = buttonRef.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(options.length * 56 + 32, 300); // Estimated height
      
      // Check if dropdown should open upward
      const openUpward = rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight;
      
      return {
        top: openUpward ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        openUpward,
      };
    };

    const position = isActive ? calculateDropdownPosition() : null;

    return (
      <div className="relative">
        <button
          ref={setButtonRef}
          onClick={() => setActiveSection(isActive ? null : filterKey)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border border-[color:var(--border)] transition-colors ${
            hasSelection
              ? 'bg-[color:var(--primary)]/10 text-[color:var(--primary)]'
              : 'bg-[color:var(--card)] hover:bg-[color:var(--navbar-item-hover)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${hasSelection ? 'text-[color:var(--primary)]' : 'text-[color:var(--muted-foreground)]'}`} />
            <span className="font-medium text-[color:var(--foreground)]">{title}</span>
            {hasSelection && (
              <span className="px-2 py-1 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-xs rounded-full">
                {allowMultiple ? selectedValues.length : '1'}
              </span>
            )}
          </div>
          <div className={`transform transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Dropdown Portal */}
        {isActive && position && typeof document !== 'undefined' && 
          createPortal(
            <div
              data-filter-dropdown={filterKey}
              className="fixed z-50000 bg-[color:var(--card)] rounded-lg border border-[color:var(--border)] shadow-xl"
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${position.width}px`,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              <div className="p-4 space-y-2">
                {options.map((option) => {
                  const isSelected = allowMultiple 
                    ? selectedValues.includes(option.value)
                    : selectedValues === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (allowMultiple) {
                          const newValues = isSelected
                            ? selectedValues.filter((v: string) => v !== option.value)
                            : [...selectedValues, option.value];
                          handleFilterChange(filterKey, newValues);
                        } else {
                          handleFilterChange(filterKey, isSelected ? null : option.value);
                          setActiveSection(null); // Close dropdown for single select
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-md border border-[color:var(--border)] transition-colors ${
                        isSelected
                          ? 'bg-[color:var(--primary)]/10 text-[color:var(--primary)]'
                          : 'hover:bg-[color:var(--navbar-item-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[color:var(--primary)] border-[color:var(--primary)]'
                            : 'border-[color:var(--border)]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-[color:var(--primary-foreground)]" />}
                        </div>
                        <span className="font-medium text-[color:var(--foreground)]">{option.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {option.count && (
                          <span className="text-sm text-[color:var(--muted-foreground)]">{option.count}</span>
                        )}
                        {option.color && (
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            colorClasses[option.color as keyof typeof colorClasses] || colorClasses.gray
                          }`}>
                            {option.label}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body
          )}
      </div>
    );
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[color:var(--muted-foreground)]" />
          <h3 className="font-semibold text-[color:var(--foreground)]">Advanced Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)] rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSection
          title="Account Status"
          options={statusOptions}
          filterKey="accountStatus"
          icon={Shield}
          allowMultiple
        />
        
        <FilterSection
          title="Insurance Status"
          options={insuranceOptions}
          filterKey="insuranceStatus"
          icon={CreditCard}
          allowMultiple
        />
        
        <FilterSection
          title="Subscription"
          options={subscriptionOptions}
          filterKey="subscriptionPlan"
          icon={Clock}
          allowMultiple
        />
        
        <FilterSection
          title="Location"
          options={locationOptions}
          filterKey="country"
          icon={MapPin}
          allowMultiple
        />
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[color:var(--border)]">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)]">
            <Calendar className="w-4 h-4" />
            Created After
          </label>
          <input
            type="date"
            value={filters.createdAfter || ''}
            onChange={(e) => handleFilterChange('createdAfter', e.target.value)}
            className="w-full px-3 py-2 border border-[color:var(--border)] bg-[color:var(--input)] rounded-lg focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--primary)] transition-colors text-[color:var(--foreground)]"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-[color:var(--foreground)]">
            <Calendar className="w-4 h-4" />
            Created Before
          </label>
          <input
            type="date"
            value={filters.createdBefore || ''}
            onChange={(e) => handleFilterChange('createdBefore', e.target.value)}
            className="w-full px-3 py-2 border border-[color:var(--border)] bg-[color:var(--input)] rounded-lg focus:ring-2 focus:ring-[color:var(--ring)] focus:border-[color:var(--primary)] transition-colors text-[color:var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
}