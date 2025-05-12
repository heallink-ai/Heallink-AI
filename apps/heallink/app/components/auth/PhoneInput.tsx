"use client";

import { useState, useEffect } from "react";
import countries from "./countries";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Update the combined value whenever country code or phone number changes
  useEffect(() => {
    const combinedValue = countryCode + phoneNumber;
    if (combinedValue !== value) {
      onChange(combinedValue);
    }
  }, [countryCode, phoneNumber]);

  // If value is provided externally, parse it into country code and phone number
  useEffect(() => {
    if (value) {
      // Find the country code from our value (any + followed by numbers)
      const codeMatch = value.match(/^\+\d+/);
      if (codeMatch) {
        const code = codeMatch[0];
        const number = value.slice(code.length);
        
        if (code !== countryCode) {
          setCountryCode(code);
        }
        if (number !== phoneNumber) {
          setPhoneNumber(number);
        }
      } else {
        // If no country code found, assume the whole value is the phone number
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Filter countries based on search
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCountries = searchTerm
    ? countries.filter(
        country =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.includes(searchTerm)
      )
    : countries;
    
  // Handle phone number input, allowing only numbers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only numbers and some special characters
    const cleaned = input.replace(/[^\d\s\-\(\)]/g, "");
    setPhoneNumber(cleaned);
  };

  return (
    <div className="mb-4">
      <label htmlFor="phone" className="block text-sm font-medium light-text-contrast mb-2">
        Phone Number
      </label>
      
      <div 
        className={`relative flex rounded-xl transition-all duration-300 ${
          focused 
            ? "neumorph-pressed" 
            : "neumorph-flat hover:shadow-md"
        }`}
      >
        {/* Country code dropdown */}
        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-between w-28 px-3 py-3.5 rounded-l-xl border-r border-border focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{countryCode}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
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
            <div className="absolute z-10 w-64 mt-1 left-0 bg-background rounded-xl neumorph-flat shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="w-full p-2 rounded-lg bg-input text-sm mb-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-purple-heart/10 rounded-md"
                      onClick={() => {
                        setCountryCode(country.dial_code);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="mr-2">{country.emoji}</span>
                      <span className="mr-auto">{country.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.dial_code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          id="phone"
          type="tel"
          className="flex-grow px-4 py-3.5 bg-transparent rounded-r-xl focus:outline-none"
          placeholder="(555) 123-4567"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setDropdownOpen(false);
          }}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}