"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { date: "Mon", scheduled: 24, completed: 22, cancelled: 2 },
  { date: "Tue", scheduled: 28, completed: 26, cancelled: 2 },
  { date: "Wed", scheduled: 32, completed: 30, cancelled: 2 },
  { date: "Thu", scheduled: 26, completed: 24, cancelled: 2 },
  { date: "Fri", scheduled: 30, completed: 28, cancelled: 2 },
  { date: "Sat", scheduled: 18, completed: 16, cancelled: 2 },
  { date: "Sun", scheduled: 12, completed: 11, cancelled: 1 },
];

export default function AppointmentTrendsChart() {
  return (
    <div className="neumorph-flat bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Weekly Appointment Trends</h3>
        <p className="text-sm text-muted-foreground">Scheduled vs completed appointments</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="scheduled"
            stackId="1"
            stroke="hsl(var(--primary))"
            fill="url(#scheduledGradient)"
            name="Scheduled"
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="2"
            stroke="hsl(var(--secondary))"
            fill="url(#completedGradient)"
            name="Completed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}