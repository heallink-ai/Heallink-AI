"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  isLoading?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  isLoading = false,
}: StatsCardProps) {
  const changeColor = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  }[changeType];

  if (isLoading) {
    return (
      <div className="neumorph-flat p-6 bg-card/50 backdrop-blur-sm border border-border/50 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-8 bg-muted rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-muted rounded-xl"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="neumorph-flat p-6 bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="h-12 w-12 bg-gradient-to-br from-purple-heart/20 to-royal-blue/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
        <span className="text-sm text-muted-foreground">from last month</span>
      </div>
    </div>
  );
}