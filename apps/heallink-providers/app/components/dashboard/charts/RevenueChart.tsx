"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12400, appointments: 45, growth: 8.2 },
  { month: "Feb", revenue: 13200, appointments: 52, growth: 6.4 },
  { month: "Mar", revenue: 14800, appointments: 48, growth: 12.1 },
  { month: "Apr", revenue: 16200, appointments: 61, growth: 9.5 },
  { month: "May", revenue: 15800, appointments: 55, growth: -2.5 },
  { month: "Jun", revenue: 17400, appointments: 68, growth: 10.1 },
];

export default function RevenueChart() {
  return (
    <div className="neumorph-flat bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">Revenue Analytics</h3>
        <p className="text-sm text-muted-foreground">Monthly revenue and appointment trends</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <YAxis 
            yAxisId="left" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))"
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="revenue" 
            fill="url(#revenueGradient)" 
            radius={[4, 4, 0, 0]}
            name="Revenue ($)"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="appointments" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            name="Appointments"
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}