"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Upload, X, Check, AlertCircle } from "lucide-react";
import { useState, forwardRef, useEffect } from "react";

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
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    // Enhanced input styling with explicit light/dark mode support
    const getInputStyles = () => {
      const baseStyles = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        borderWidth: '1px',
        borderStyle: 'solid',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '1.5',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
      };

      if (disabled) {
        return {
          ...baseStyles,
          backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          cursor: 'not-allowed',
          opacity: 0.6,
        };
      }

      if (error) {
        return {
          ...baseStyles,
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          borderColor: '#ef4444',
          color: isDarkMode ? '#f9fafb' : '#111827',
          boxShadow: isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none',
        };
      }

      return {
        ...baseStyles,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderColor: isFocused ? '#5a2dcf' : (isDarkMode ? '#4b5563' : '#d1d5db'),
        color: isDarkMode ? '#f9fafb' : '#111827',
        boxShadow: isFocused ? '0 0 0 3px rgba(90, 45, 207, 0.1)' : 'none',
      };
    };

    const getLabelStyles = () => ({
      color: isDarkMode ? '#f3f4f6' : '#374151',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    });

    const getIconStyles = () => ({
      color: isDarkMode ? '#9ca3af' : '#6b7280',
    });

    return (
      <motion.div
        className={`space-y-3 ${className}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <label style={getLabelStyles()}>
          {icon && <span style={getIconStyles()}>{icon}</span>}
          {label}
          {required && (
            <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
          )}
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
            style={{
              ...getInputStyles(),
              '::placeholder': {
                color: isDarkMode ? '#6b7280' : '#9ca3af',
                opacity: 1,
              }
            }}
          />
          
          {type === "password" && showPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPasswordValue(!showPasswordValue)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-lg transition-colors"
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
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
              {showPasswordValue ? (
                <EyeOff 
                  className="w-5 h-5" 
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
              ) : (
                <Eye 
                  className="w-5 h-5" 
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
              )}
            </motion.button>
          )}
        </div>
        
        {error && (
          <motion.div
            className="flex items-center gap-2"
            style={{
              color: '#ef4444',
              fontSize: '14px',
              fontWeight: '500',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Enhanced select styling with explicit light/dark mode support
  const getSelectStyles = () => {
    const baseStyles = {
      width: '100%',
      padding: '14px 16px',
      paddingRight: '48px', // Space for dropdown arrow
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      appearance: 'none',
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDarkMode ? '%23a1a1aa' : '%236b7280'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E") no-repeat right 12px center`,
      backgroundSize: '20px',
    };

    if (disabled) {
      return {
        ...baseStyles,
        backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        cursor: 'not-allowed',
        opacity: 0.6,
      };
    }

    if (error) {
      return {
        ...baseStyles,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderColor: '#ef4444',
        color: isDarkMode ? '#f9fafb' : '#111827',
        boxShadow: isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : 'none',
      };
    }

    return {
      ...baseStyles,
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      borderColor: isFocused ? '#5a2dcf' : (isDarkMode ? '#4b5563' : '#d1d5db'),
      color: isDarkMode ? '#f9fafb' : '#111827',
      boxShadow: isFocused ? '0 0 0 3px rgba(90, 45, 207, 0.1)' : 'none',
    };
  };

  const getLabelStyles = () => ({
    color: isDarkMode ? '#f3f4f6' : '#374151',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const getIconStyles = () => ({
    color: isDarkMode ? '#9ca3af' : '#6b7280',
  });

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <label style={getLabelStyles()}>
        {icon && <span style={getIconStyles()}>{icon}</span>}
        {label}
        {required && (
          <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
        )}
      </label>
      
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          style={getSelectStyles()}
        >
          <option 
            value="" 
            style={{ 
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
            }}
          >
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              style={{ 
                color: isDarkMode ? '#f9fafb' : '#111827',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {error && (
        <motion.div
          className="flex items-center gap-2"
          style={{
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '500',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const getLabelStyles = () => ({
    color: isDarkMode ? '#f3f4f6' : '#374151',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  const getIconStyles = () => ({
    color: isDarkMode ? '#9ca3af' : '#6b7280',
  });

  const getDropzoneStyles = () => ({
    position: 'relative' as const,
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: isDragOver 
      ? (isDarkMode ? 'rgba(90, 45, 207, 0.1)' : 'rgba(90, 45, 207, 0.05)')
      : (isDarkMode ? '#1f2937' : '#ffffff'),
    borderColor: isDragOver 
      ? '#5a2dcf'
      : error 
        ? '#ef4444'
        : (isDarkMode ? '#4b5563' : '#d1d5db'),
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <label style={getLabelStyles()}>
        {icon && <span style={getIconStyles()}>{icon}</span>}
        {label}
        {required && (
          <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
        )}
      </label>
      
      <div
        style={getDropzoneStyles()}
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
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p 
                  className="font-semibold text-lg"
                  style={{ color: isDarkMode ? '#f9fafb' : '#111827' }}
                >
                  {value.name}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}
                >
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="rounded-lg transition-colors"
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
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
              <X className="w-5 h-5 text-red-500" />
            </motion.button>
          </div>
        ) : (
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
                  : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                boxShadow: isDarkMode 
                  ? '0 4px 8px rgba(0, 0, 0, 0.2)' 
                  : '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
              animate={{
                scale: isDragOver ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Upload 
                className="w-8 h-8" 
                style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
              />
            </motion.div>
            <p 
              className="font-semibold text-lg mb-2"
              style={{ color: isDarkMode ? '#f9fafb' : '#111827' }}
            >
              Drop your file here, or{' '}
              <span style={{ color: '#5a2dcf' }}>browse</span>
            </p>
            {description && (
              <p 
                className="text-sm mb-3"
                style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}
              >
                {description}
              </p>
            )}
            <p 
              className="text-xs"
              style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}
            >
              Max size: {maxSizeMB}MB • {accept}
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <motion.div
          className="flex items-center gap-2"
          style={{
            color: '#ef4444',
            fontSize: '14px',
            fontWeight: '500',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const getToggleStyles = () => ({
    position: 'relative' as const,
    width: '52px',
    height: '28px',
    borderRadius: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: value 
      ? 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)'
      : (isDarkMode ? '#4b5563' : '#d1d5db'),
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    outline: 'none',
    boxShadow: value 
      ? '0 4px 12px rgba(90, 45, 207, 0.3)'
      : (isDarkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'),
  });

  const getToggleKnobStyles = () => ({
    position: 'absolute' as const,
    top: '2px',
    left: value ? '26px' : '2px',
    width: '24px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  });

  const getLabelStyles = () => ({
    color: isDarkMode ? '#f3f4f6' : '#374151',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    lineHeight: '1.5',
  });

  const getDescriptionStyles = () => ({
    color: isDarkMode ? '#a1a1aa' : '#6b7280',
    fontSize: '14px',
    fontWeight: '400',
    marginTop: '4px',
    lineHeight: '1.4',
  });

  return (
    <motion.div
      className={`space-y-3 ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-start gap-6">
        <motion.button
          type="button"
          onClick={() => !disabled && onChange(!value)}
          disabled={disabled}
          style={getToggleStyles()}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            style={getToggleKnobStyles()}
            animate={{ 
              left: value ? '26px' : '2px',
              scale: value ? 1.1 : 1,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
          />
        </motion.button>
        
        <div className="flex-1">
          <motion.label 
            style={getLabelStyles()}
            onClick={() => !disabled && onChange(!value)}
            whileHover={!disabled ? { x: 2 } : {}}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
          {description && (
            <motion.p 
              style={getDescriptionStyles()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.p>
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