"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

type AlertType = "error" | "warning" | "info" | "success";

type Alert = {
  id: number;
  type: AlertType;
  message: string;
  source: string;
  timestamp: string;
};

// Sample data - in a real app, this would come from an API
const sampleAlerts: Alert[] = [
  {
    id: 1,
    type: "error",
    message: "Pharmacy API connection failed",
    source: "Integration/SureScripts",
    timestamp: "2025-05-15T09:23:15",
  },
  {
    id: 2,
    type: "warning",
    message: "High API latency detected",
    source: "Monitoring/API Gateway",
    timestamp: "2025-05-15T09:15:03",
  },
  {
    id: 3,
    type: "info",
    message: "Background jobs completed",
    source: "System/Jobs",
    timestamp: "2025-05-15T09:12:48",
  },
  {
    id: 4,
    type: "success",
    message: "Database backup successful",
    source: "System/Backup",
    timestamp: "2025-05-15T09:00:00",
  },
  {
    id: 5,
    type: "warning",
    message: "90% of storage quota reached",
    source: "System/Storage",
    timestamp: "2025-05-15T08:45:22",
  },
  {
    id: 6,
    type: "info",
    message: "New provider onboarding started",
    source: "Providers/Onboarding",
    timestamp: "2025-05-15T08:30:10",
  },
  {
    id: 7,
    type: "error",
    message: "Failed authentication attempts",
    source: "Security/Auth",
    timestamp: "2025-05-15T08:25:44",
  },
];

export default function AlertsFeed() {
  const [alerts] = useState<Alert[]>(sampleAlerts);
  const [filter, setFilter] = useState<AlertType | "all">("all");

  const filteredAlerts =
    filter === "all" ? alerts : alerts.filter((alert) => alert.type === filter);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-[color:var(--error)]" />;
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-[color:var(--warning)]" />
        );
      case "success":
        return <CheckCircle className="w-4 h-4 text-[color:var(--success)]" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-[color:var(--primary)]" />;
    }
  };

  const getAlertClass = (type: AlertType) => {
    switch (type) {
      case "error":
        return "border-l-[color:var(--error)] bg-[color:var(--error)]/5";
      case "warning":
        return "border-l-[color:var(--warning)] bg-[color:var(--warning)]/5";
      case "success":
        return "border-l-[color:var(--success)] bg-[color:var(--success)]/5";
      case "info":
      default:
        return "border-l-[color:var(--primary)] bg-[color:var(--primary)]/5";
    }
  };

  return (
    <div className="bg-[color:var(--card)] rounded-xl p-5 neumorph-flat">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">System Alerts</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AlertType | "all")}
            className="text-xs rounded-md px-2 py-1 bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
          >
            <option value="all">All Alerts</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      <div className="h-80 overflow-y-auto pr-1.5">
        {filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-[color:var(--muted-foreground)]">
            No alerts to display
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border-l-4 rounded-r-md ${getAlertClass(
                  alert.type
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-[color:var(--muted-foreground)]">
                        {alert.source}
                      </span>
                      <span className="text-xs text-[color:var(--muted-foreground)]">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="border-t border-[color:var(--border)] mt-4 pt-3 flex justify-between items-center text-xs text-[color:var(--muted-foreground)]">
        <div className="flex gap-3">
          <span>Errors: {alerts.filter((a) => a.type === "error").length}</span>
          <span>
            Warnings: {alerts.filter((a) => a.type === "warning").length}
          </span>
        </div>
        <button className="text-[color:var(--primary)]">View all logs</button>
      </div>
    </div>
  );
}
