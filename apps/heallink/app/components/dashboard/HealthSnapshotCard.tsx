"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HealthTrends {
  bloodPressure: number[];
  glucose: number[];
  weight: number[];
}

interface HealthSnapshotProps {
  data: {
    bloodPressure: string;
    glucose: string;
    weight: string;
    lastUpdated: string;
    trends: HealthTrends;
  };
}

export default function HealthSnapshotCard({ data }: HealthSnapshotProps) {
  const [activeTab, setActiveTab] = useState<
    "bloodPressure" | "glucose" | "weight"
  >("bloodPressure");

  // Map tabs to display data
  const tabsData = {
    bloodPressure: {
      label: "Blood Pressure",
      value: data.bloodPressure,
      trend: data.trends.bloodPressure,
      color: "from-purple-heart to-royal-blue",
    },
    glucose: {
      label: "Glucose",
      value: data.glucose,
      trend: data.trends.glucose,
      color: "from-purple-heart to-royal-blue-600",
    },
    weight: {
      label: "Weight",
      value: data.weight,
      trend: data.trends.weight,
      color: "from-purple-heart to-royal-blue-700",
    },
  };

  const activeData = tabsData[activeTab];

  // Calculate trend visualization
  const trendMax = Math.max(...activeData.trend);
  const trendMin = Math.min(...activeData.trend);
  const range = trendMax - trendMin;

  return (
    <div className="p-4 bg-card rounded-xl neumorph-flat">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Health Snapshot</h2>
        <span className="text-xs text-foreground/60">{data.lastUpdated}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-background/50 p-1 rounded-lg">
        {Object.entries(tabsData).map(([key, tab]) => (
          <button
            key={key}
            onClick={() =>
              setActiveTab(key as "bloodPressure" | "glucose" | "weight")
            }
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === key
                ? "bg-primary text-white"
                : "text-foreground/70 hover:bg-background/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current Value */}
      <div className="text-center mb-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold gradient-text"
        >
          {activeData.value}
        </motion.div>
      </div>

      {/* Trend Sparkline */}
      <div className="h-14 w-full relative">
        <div className="absolute inset-0 flex items-end justify-between">
          {activeData.trend.map((point, index) => {
            const height =
              range === 0 ? 50 : ((point - trendMin) / range) * 80 + 20;
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-1 rounded-t-full bg-gradient-to-t ${activeData.color}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
