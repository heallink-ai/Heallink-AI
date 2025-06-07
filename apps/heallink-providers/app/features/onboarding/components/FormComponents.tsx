"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Upload, X, Check, AlertCircle } from "lucide-react";
import { useState, forwardRef } from "react";

// Input Field Component
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  showPassword?: boolean;
  mask?: string; // For formatting inputs like SSN, phone etc
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = "",
    icon,
    showPassword = false,
    mask,
  }, ref) => {
    const [showPasswordValue, setShowPasswordValue] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      if (mask) {
        newValue = applyMask(newValue, mask);
      }
      
      onChange(newValue);
    };

    const inputType = type === "password" && showPassword 
      ? (showPasswordValue ? "text" : "password")
      : type;

    return (
      <motion.div
        className={`space-y-2 ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="relative">
          <input
            ref={ref}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`
              w-full px-4 py-3 rounded-xl border transition-all duration-200
              ${error 
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                : "border-gray-200 dark:border-gray-700 focus:border-purple-heart focus:ring-purple-heart/20"
              }
              ${disabled 
                ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50" 
                : "bg-white dark:bg-gray-800"
              }
              focus:ring-2 focus:outline-none
              placeholder:text-gray-400 dark:placeholder:text-gray-500
            `}
          />
          
          {type === "password" && showPassword && (
            <button
              type="button"
              onClick={() => setShowPasswordValue(!showPasswordValue)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {showPasswordValue ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <motion.div
            className="flex items-center gap-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </motion.div>
    );
  }
);

InputField.displayName = "InputField";

// Select Field Component
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
  className = "",
  icon,
}) => {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200
          ${error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
            : "border-gray-200 dark:border-gray-700 focus:border-purple-heart focus:ring-purple-heart/20"
          }
          ${disabled 
            ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50" 
            : "bg-white dark:bg-gray-800"
          }
          focus:ring-2 focus:outline-none
          appearance-none bg-no-repeat bg-right bg-[length:20px]
          bg-[url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /%3E%3C/svg%3E')]
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <motion.div
          className="flex items-center gap-2 text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

// File Upload Component
interface FileUploadProps {
  label: string;
  name: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  accept?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  maxSizeMB?: number;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  error,
  required = false,
  disabled = false,
  className = "",
  icon,
  maxSizeMB = 10,
  description,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        // Handle size error
        return;
      }
      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${isDragOver 
            ? "border-purple-heart bg-purple-heart/5" 
            : error 
              ? "border-red-300" 
              : "border-gray-300 dark:border-gray-600"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-purple-heart/50"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {value ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">{value.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Drop your file here, or <span className="text-purple-heart">browse</span>
            </p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Max size: {maxSizeMB}MB • {accept}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <motion.div
          className="flex items-center gap-2 text-sm text-red-500"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

// Toggle Field Component
interface ToggleFieldProps {
  label: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  name,
  value,
  onChange,
  description,
  disabled = false,
  className = "",
}) => {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => !disabled && onChange(!value)}
          disabled={disabled}
          className={`
            relative w-12 h-6 rounded-full transition-all duration-200
            ${value 
              ? "bg-gradient-to-r from-purple-heart to-royal-blue" 
              : "bg-gray-200 dark:bg-gray-700"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <motion.div
            className={`
              absolute top-1 w-4 h-4 rounded-full bg-white shadow-md
              ${value ? "right-1" : "left-1"}
            `}
            initial={false}
            animate={{ x: value ? 0 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
        
        <div className="flex-1">
          <label className="font-medium text-foreground cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to apply masks
function applyMask(value: string, mask: string): string {
  if (mask === "ssn") {
    return value
      .replace(/\D/g, "")
      .slice(0, 9)
      .replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
  }
  
  if (mask === "phone") {
    return value
      .replace(/\D/g, "")
      .slice(0, 10)
      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
  
  if (mask === "ein") {
    return value
      .replace(/\D/g, "")
      .slice(0, 9)
      .replace(/(\d{2})(\d{7})/, "$1-$2");
  }
  
  return value;
}