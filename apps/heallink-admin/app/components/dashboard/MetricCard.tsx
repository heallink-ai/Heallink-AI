"use client";

import React from "react";
import { ArrowDown, ArrowUp, Icon, LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number; // percentage change
    timeframe: string; // e.g., "vs last week"
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "default";
};

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  color = "default",
}: MetricCardProps) {
  // Color classes based on the theme
  const colorClasses = {
    primary: "from-purple-heart to-royal-blue text-white",
    secondary: "from-havelock-blue to-muted-indigo text-white",
    success: "from-green-500 to-green-600 text-white",
    warning: "from-amber-500 to-amber-600 text-white",
    error: "from-red-500 to-red-600 text-white",
    default: "bg-[color:var(--card)] text-[color:var(--card-foreground)]",
  };

  const isGradient = color !== "default";
  const cardClass = isGradient
    ? `bg-gradient-to-r ${colorClasses[color]}`
    : colorClasses.default;

  const textColorClass = isGradient
    ? "text-white"
    : "text-[color:var(--card-foreground)]";

  const trendColorClass = trend?.isPositive
    ? isGradient
      ? "text-green-100"
      : "text-green-500 dark:text-green-400"
    : isGradient
      ? "text-red-100"
      : "text-red-500 dark:text-red-400";

  return (
    <div className={`rounded-xl p-5 neumorph-flat ${cardClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`text-sm font-medium ${isGradient ? "text-white/80" : "text-[color:var(--muted-foreground)]"}`}
          >
            {title}
          </h3>
          <div className={`text-2xl font-bold mt-2 ${textColorClass}`}>
            {value}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs mt-2 ${trendColorClass}`}
            >
              {trend.isPositive ? (
                <ArrowUp size={12} className="inline" />
              ) : (
                <ArrowDown size={12} className="inline" />
              )}
              <span>
                {trend.value}% {trend.timeframe}
              </span>
            </div>
          )}
        </div>
        <div
          className={`${isGradient ? "text-white/90" : "text-[color:var(--primary)]"}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
