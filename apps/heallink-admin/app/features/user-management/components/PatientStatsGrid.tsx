"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  description: string;
}

interface PatientStatsGridProps {
  stats: StatCard[];
}

const colorClasses = {
  blue: {
    bg: "bg-[color:var(--primary)]/10",
    text: "text-[color:var(--primary)]",
    icon: "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
  },
  green: {
    bg: "bg-[color:var(--success)]/10",
    text: "text-[color:var(--success)]",
    icon: "bg-[color:var(--success)] text-[color:var(--primary-foreground)]"
  },
  purple: {
    bg: "bg-[color:var(--secondary)]/10",
    text: "text-[color:var(--secondary)]",
    icon: "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]"
  },
  orange: {
    bg: "bg-[color:var(--warning)]/10",
    text: "text-[color:var(--warning)]",
    icon: "bg-[color:var(--warning)] text-[color:var(--primary-foreground)]"
  },
  red: {
    bg: "bg-[color:var(--error)]/10",
    text: "text-[color:var(--error)]",
    icon: "bg-[color:var(--error)] text-[color:var(--primary-foreground)]"
  }
};

export default function PatientStatsGrid({ stats }: PatientStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const colors = colorClasses[stat.color];
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <div
            key={index}
            className="card-admin group hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.icon}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-medium`}>
                <TrendIcon className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-[color:var(--muted-foreground)]">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-[color:var(--foreground)]">
                {stat.value}
              </p>
              <p className="text-xs text-[color:var(--muted-foreground)]">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}