import React from 'react';
import { AlertCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorDisplayProps {
  message: string;
  details?: string;
  severity?: ErrorSeverity;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorDisplay({
  message,
  details,
  severity = 'error',
  onDismiss,
  className = '',
}: ErrorDisplayProps) {
  // Set color and icon based on severity
  const getStylesForSeverity = () => {
    switch (severity) {
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-300 dark:border-red-800',
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-50 dark:bg-amber-950/30',
          textColor: 'text-amber-800 dark:text-amber-300',
          borderColor: 'border-amber-300 dark:border-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-300 dark:border-blue-800',
          icon: <Info className="h-5 w-5 text-blue-500" />,
        };
      default:
        return {
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-300 dark:border-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        };
    }
  };

  const { bgColor, textColor, borderColor, icon } = getStylesForSeverity();

  return (
    <div className={`rounded-md border p-4 ${bgColor} ${borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>{message}</h3>
          {details && (
            <div className={`mt-2 text-sm ${textColor}`}>
              <p>{details}</p>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-[color:var(--accent)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2`}
              >
                <span className="sr-only">Dismiss</span>
                <XCircle className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
