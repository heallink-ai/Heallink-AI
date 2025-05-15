"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data - in a real app, this would come from an API
const data7d = [
  { date: "May 09", users: 320, appointments: 240, orders: 180 },
  { date: "May 10", users: 332, appointments: 259, orders: 190 },
  { date: "May 11", users: 341, appointments: 234, orders: 198 },
  { date: "May 12", users: 358, appointments: 275, orders: 210 },
  { date: "May 13", users: 365, appointments: 254, orders: 193 },
  { date: "May 14", users: 388, appointments: 290, orders: 220 },
  { date: "May 15", users: 423, appointments: 306, orders: 235 },
];

const data30d = [
  { date: "Apr 15", users: 290, appointments: 220, orders: 150 },
  { date: "Apr 20", users: 310, appointments: 230, orders: 170 },
  { date: "Apr 25", users: 330, appointments: 235, orders: 175 },
  { date: "Apr 30", users: 340, appointments: 245, orders: 180 },
  { date: "May 05", users: 350, appointments: 250, orders: 185 },
  { date: "May 10", users: 370, appointments: 260, orders: 195 },
  { date: "May 15", users: 423, appointments: 306, orders: 235 },
];

export default function UserStatsChart() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");
  const chartData = timeframe === "7d" ? data7d : data30d;

  return (
    <div className="bg-[color:var(--card)] rounded-xl p-5 neumorph-flat">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Platform Activity</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe("7d")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeframe === "7d"
                ? "bg-[color:var(--navbar-item-selected)] text-[color:var(--foreground)] font-medium"
                : "hover:bg-[color:var(--navbar-item-hover)] text-[color:var(--muted-foreground)]"
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setTimeframe("30d")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeframe === "30d"
                ? "bg-[color:var(--navbar-item-selected)] text-[color:var(--foreground)] font-medium"
                : "hover:bg-[color:var(--navbar-item-hover)] text-[color:var(--muted-foreground)]"
            }`}
          >
            30D
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "var(--foreground)" }}
              labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: "var(--card-foreground)" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="var(--secondary)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#6578e4" // havelock-blue
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
