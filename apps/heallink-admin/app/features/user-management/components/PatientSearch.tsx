"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Clock, Star } from "lucide-react";

interface PatientSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PatientSearch({ value, onChange, placeholder = "Search patients..." }: PatientSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState([
    "John Doe",
    "Active patients", 
    "Pending verification",
    "Recent appointments"
  ]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1 max-w-md" onClick={(e) => e.stopPropagation()}>
      <div className={`relative bg-[color:var(--input)] rounded-lg border border-[color:var(--border)] transition-colors ${
        isFocused 
          ? 'ring-2 ring-[color:var(--ring)] border-[color:var(--primary)]' 
          : 'hover:border-[color:var(--primary)]/50'
      }`}>
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className={`w-5 h-5 transition-colors ${
            isFocused ? 'text-[color:var(--primary)]' : 'text-[color:var(--muted-foreground)]'
          }`} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-transparent border-none outline-none text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] font-medium"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[color:var(--navbar-item-hover)] transition-colors"
          >
            <X className="w-4 h-4 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (isFocused || value) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[color:var(--card)] rounded-lg border border-[color:var(--border)] shadow-lg z-50 overflow-hidden">
          {/* Quick Filters */}
          <div className="p-3 border-b border-[color:var(--border)]">
            <p className="text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wide mb-2">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              {['Active', 'Pending', 'Suspended', 'Recent'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleSuggestionClick(filter.toLowerCase())}
                  className="px-3 py-1.5 text-xs font-medium bg-[color:var(--muted)] hover:bg-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] text-[color:var(--foreground)] rounded-md transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3">
              <p className="text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wide mb-2">Recent Searches</p>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)] rounded-md transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-3 border-t border-[color:var(--border)]">
            <p className="text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wide mb-2">Popular</p>
            <div className="space-y-1">
              {['High-risk patients', 'Medication reviews', 'Overdue checkups'].map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)] rounded-md transition-colors text-left"
                >
                  <Star className="w-4 h-4 text-[color:var(--warning)]" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}