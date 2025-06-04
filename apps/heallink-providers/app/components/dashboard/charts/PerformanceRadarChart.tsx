"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { subject: "Patient Satisfaction", current: 92, target: 95, fullMark: 100 },
  { subject: "Treatment Efficiency", current: 88, target: 90, fullMark: 100 },
  { subject: "Response Time", current: 85, target: 88, fullMark: 100 },
  { subject: "Staff Performance", current: 90, target: 92, fullMark: 100 },
  { subject: "Revenue Growth", current: 78, target: 85, fullMark: 100 },
  { subject: "Technology Usage", current: 82, target: 88, fullMark: 100 },
];

export default function PerformanceRadarChart() {
  return (
    <div className="neumorph-flat bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Performance Metrics</h3>
        <p className="text-sm text-muted-foreground">Current vs target performance across key areas</p>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="hsl(var(--secondary))"
            fill="hsl(var(--secondary))"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}