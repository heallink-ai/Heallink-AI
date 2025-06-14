"use client";

import { useState, useEffect, useRef } from "react";
import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
  CountryCode,
} from "libphonenumber-js";
import countries from "./countries";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export default function PhoneInput({
  value,
  onChange,
  error,
  onValidationChange,
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const internalUpdateRef = useRef(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Get country code to ISO map for validation
  const countryCodeToISO = {} as Record<string, CountryCode>;
  countries.forEach((country) => {
    countryCodeToISO[country.dial_code] = country.code as CountryCode;
  });

  // Get valid country codes for validation
  const validCountryCodes = countries.map((country) => country.dial_code);

  // Validate phone number based on country
  const validatePhoneNumber = (fullNumber: string) => {
    if (!fullNumber || fullNumber.length < 5) {
      setValidationError("Phone number is too short");
      onValidationChange?.(false);
      return false;
    }

    try {
      // Extract country code for validation
      let countryISO: CountryCode | undefined;

      // Find matching country code
      for (const code of Object.keys(countryCodeToISO).sort(
        (a, b) => b.length - a.length
      )) {
        if (fullNumber.startsWith(code)) {
          countryISO = countryCodeToISO[code];
          break;
        }
      }

      if (!countryISO) {
        setValidationError("Invalid country code");
        onValidationChange?.(false);
        return false;
      }

      const isValid = isValidPhoneNumber(fullNumber, countryISO);

      if (!isValid) {
        // Try to provide more specific error
        const parsedNumber = parsePhoneNumberFromString(fullNumber, countryISO);

        if (!parsedNumber) {
          setValidationError("Invalid phone number format");
        } else if (!parsedNumber.isPossible()) {
          setValidationError("Phone number too short or too long");
        } else {
          setValidationError("Invalid phone number for this country");
        }

        onValidationChange?.(false);
        return false;
      }

      // Valid phone number
      setValidationError(null);
      onValidationChange?.(true);
      return true;
    } catch (e) {
      console.error("Phone validation error:", e);
      setValidationError("Could not validate phone number");
      onValidationChange?.(false);
      return false;
    }
  };

  // Handle direct input changes to the phone number field
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and some special characters
    const cleaned = input.replace(/[^\d\s\-\(\)]/g, "");
    setPhoneNumber(cleaned);

    // Immediately update the combined value to ensure the parent component sees the change
    const fullNumber = countryCode + cleaned;
    onChange(fullNumber);

    // Validate after a short delay to avoid validating while typing
    if (focused) {
      setTimeout(() => {
        validatePhoneNumber(fullNumber);
      }, 500);
    }
  };

  // Update parent value when country code changes
  useEffect(() => {
    if (countryCode) {
      const fullNumber = countryCode + phoneNumber;
      onChange(fullNumber);

      if (phoneNumber.length > 0) {
        validatePhoneNumber(fullNumber);
      } else {
        setValidationError(null);
      }
    }
  }, [countryCode]);

  // Handle external value changes
  useEffect(() => {
    // Only process if the value is different from our current state
    if (!value || value === countryCode + phoneNumber) return;

    // Set parsing flag to avoid triggering onChange again
    internalUpdateRef.current = true;

    if (value.startsWith("+")) {
      // Try to find a valid country code
      let foundValidCode = false;

      // Sort country codes by length (longest first) to avoid partial matches
      const sortedCodes = [...validCountryCodes].sort(
        (a, b) => b.length - a.length
      );

      for (const code of sortedCodes) {
        if (value.startsWith(code)) {
          // Found a valid country code
          setCountryCode(code);
          setPhoneNumber(value.substring(code.length));
          foundValidCode = true;
          break;
        }
      }

      // If no valid country code found but starts with +, use + as code
      if (!foundValidCode) {
        setCountryCode("+");
        setPhoneNumber(value.substring(1));
      }
    } else {
      // No + prefix, just set as phone number
      setPhoneNumber(value);
    }

    // Clear the flag
    setTimeout(() => {
      internalUpdateRef.current = false;
    }, 0);

    // Also validate the phone number when set externally and not empty
    if (value.length > 4) {
      validatePhoneNumber(value);
    }
  }, [value, validCountryCodes]);

  // Focus the phone input field when clicked on the container
  const handleContainerClick = (e: React.MouseEvent) => {
    // Don't focus if clicking on the country code dropdown
    if (
      e.target instanceof HTMLElement &&
      !e.target.closest(".country-dropdown")
    ) {
      phoneInputRef.current?.focus();
    }
  };

  // Validate on blur to give immediate feedback
  const handleBlur = () => {
    setFocused(false);
    setDropdownOpen(false);

    // Don't show validation errors for empty input
    if (phoneNumber.length > 0) {
      validatePhoneNumber(countryCode + phoneNumber);
    }
  };

  // Filter countries based on search
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCountries = searchTerm
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.includes(searchTerm)
      )
    : countries;

  // Determine error message to show (prop error takes precedence)
  const displayError = error || validationError;
  const hasError = !!displayError && !focused;

  return (
    <div className="mb-4">
      <label
        htmlFor="phone"
        className="block text-sm font-medium light-text-contrast mb-2"
      >
        Phone Number
      </label>

      <div
        className={`relative flex rounded-xl transition-all duration-300 ${
          focused ? "neumorph-pressed" : "neumorph-flat hover:shadow-md"
        } ${hasError ? "border border-red-500" : ""}`}
        onClick={handleContainerClick}
      >
        {/* Country code dropdown */}
        <div className="country-dropdown relative">
          <button
            type="button"
            className="flex items-center justify-between min-w-[80px] max-w-[100px] px-3 py-3.5 rounded-l-xl border-r border-border focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
          >
            <span className="truncate">{countryCode}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <>
              {/* Backdrop to capture clicks outside the dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />

              <div
                className="absolute z-50 w-64 mt-2 left-0 rounded-xl shadow-lg overflow-hidden animate-fadeIn"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid rgba(107, 70, 193, 0.2)",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-t-xl p-3 bg-gradient-to-r from-purple-heart/5 to-royal-blue/5">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full p-2 rounded-lg border border-border text-sm mb-1 neumorph-pressed"
                    style={{ backgroundColor: "var(--input)" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div
                  className="max-h-60 overflow-y-auto"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  {filteredCountries.length === 0 ? (
                    <div className="text-center py-4 text-sm opacity-70">
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-purple-heart/10 border-t border-border/10"
                        style={{ backgroundColor: "var(--background)" }}
                        onClick={() => {
                          setCountryCode(country.dial_code);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="mr-3 text-base">{country.emoji}</span>
                        <span className="mr-auto font-medium">
                          {country.name}
                        </span>
                        <span className="text-sm font-mono opacity-70">
                          {country.dial_code}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone number input */}
        <input
          ref={phoneInputRef}
          id="phone"
          type="tel"
          className={`flex-grow px-4 py-3.5 bg-transparent rounded-r-xl focus:outline-none ${hasError ? "text-red-500" : ""}`}
          placeholder="(555) 123-4567"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          aria-invalid={hasError}
        />
      </div>

      {displayError && !focused && (
        <p className="text-sm text-red-500 mt-1">{displayError}</p>
      )}
    </div>
  );
}
