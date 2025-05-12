"use client";

import { motion } from "framer-motion";

interface HealthSnapshotData {
  bloodPressure: string;
  glucose: string;
  weight: string;
  lastUpdated: string;
  trends: {
    bloodPressure: number[];
    glucose: number[];
    weight: number[];
  };
}

interface HealthSnapshotCardProps {
  data: HealthSnapshotData;
}

export default function HealthSnapshotCard({ data }: HealthSnapshotCardProps) {
  // Mini sparkline component
  const Sparkline = ({
    data,
    color,
    height = 30,
  }: {
    data: number[];
    color: string;
    height?: number;
  }) => {
    // Get min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    // Create points
    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg
        height={height}
        width="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Latest value dot */}
        <circle
          cx="100"
          cy={100 - ((data[data.length - 1] - min) / range) * 100}
          r="3"
          fill={color}
        />
      </svg>
    );
  };

  return (
    <motion.div
      className="p-4 rounded-xl bg-card neumorph-flat h-full"
      whileHover={{ translateY: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Health Snapshot</h3>
        <span className="text-xs text-foreground/70">{data.lastUpdated}</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-foreground/70">Blood Pressure</span>
            <span className="font-semibold">{data.bloodPressure}</span>
          </div>
          <Sparkline
            data={data.trends.bloodPressure}
            color="rgba(220, 38, 38, 0.7)"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-foreground/70">Glucose</span>
            <span className="font-semibold">{data.glucose}</span>
          </div>
          <Sparkline
            data={data.trends.glucose}
            color="rgba(79, 70, 229, 0.7)"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-foreground/70">Weight</span>
            <span className="font-semibold">{data.weight}</span>
          </div>
          <Sparkline
            data={data.trends.weight}
            color="rgba(16, 185, 129, 0.7)"
          />
        </div>
      </div>

      <button className="w-full mt-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">
        Log New Vitals
      </button>
    </motion.div>
  );
}
