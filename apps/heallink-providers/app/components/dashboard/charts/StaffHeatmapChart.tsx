"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const heatmapData = [
  { name: "Dr. Smith", mon: 95, tue: 88, wed: 92, thu: 85, fri: 90, sat: 78, avg: 88 },
  { name: "Dr. Johnson", mon: 82, tue: 95, wed: 88, thu: 92, fri: 85, sat: 90, avg: 89 },
  { name: "Dr. Williams", mon: 90, tue: 85, wed: 95, thu: 88, fri: 92, sat: 85, avg: 89 },
  { name: "Dr. Brown", mon: 88, tue: 92, wed: 85, thu: 95, fri: 88, sat: 92, avg: 90 },
  { name: "Dr. Davis", mon: 92, tue: 88, wed: 90, thu: 85, fri: 95, sat: 88, avg: 90 },
];

const getPerformanceColor = (value: number): string => {
  if (value >= 90) return "bg-green-500";
  if (value >= 80) return "bg-yellow-500";
  if (value >= 70) return "bg-orange-500";
  return "bg-red-500";
};

const getPerformanceOpacity = (value: number): number => {
  return Math.max(0.3, value / 100);
};

const getTrendIcon = (current: number, previous: number = 85): React.ReactElement => {
  if (current > previous) return React.createElement(TrendingUp, { className: "h-4 w-4 text-green-500" });
  if (current < previous) return React.createElement(TrendingDown, { className: "h-4 w-4 text-red-500" });
  return React.createElement(Minus, { className: "h-4 w-4 text-gray-500" });
};

const StaffHeatmapChart: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return React.createElement('div', {
    className: "neumorph-flat bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6"
  }, [
    React.createElement('div', { key: 'header', className: "mb-6" }, [
      React.createElement('h3', {
        key: 'title',
        className: "text-xl font-semibold text-foreground mb-2"
      }, "Staff Performance Heatmap"),
      React.createElement('p', {
        key: 'subtitle',
        className: "text-sm text-muted-foreground"
      }, "Daily performance scores across the week")
    ]),
    React.createElement('div', { key: 'content', className: "overflow-x-auto" }, [
      React.createElement('div', { key: 'grid', className: "min-w-[600px]" }, [
        // Header row
        React.createElement('div', {
          key: 'header-row',
          className: "grid grid-cols-9 gap-2 mb-4"
        }, [
          React.createElement('div', {
            key: 'staff-header',
            className: "text-sm font-medium text-muted-foreground"
          }, "Staff"),
          ...days.map(day => React.createElement('div', {
            key: day,
            className: "text-sm font-medium text-muted-foreground text-center"
          }, day)),
          React.createElement('div', {
            key: 'avg-header',
            className: "text-sm font-medium text-muted-foreground text-center"
          }, "Avg"),
          React.createElement('div', {
            key: 'trend-header',
            className: "text-sm font-medium text-muted-foreground text-center"
          }, "Trend")
        ]),
        // Data rows
        ...heatmapData.map((staff, index) => 
          React.createElement('div', {
            key: index,
            className: "grid grid-cols-9 gap-2 mb-3"
          }, [
            React.createElement('div', {
              key: 'name',
              className: "text-sm font-medium text-foreground py-2"
            }, staff.name),
            ...days.map(day => {
              const value = staff[day.toLowerCase() as keyof typeof staff] as number;
              return React.createElement('div', {
                key: day,
                className: `h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium ${getPerformanceColor(value)} transition-all duration-200 hover:scale-105`,
                style: { opacity: getPerformanceOpacity(value) },
                title: `${staff.name} - ${day}: ${value}%`
              }, `${value}%`);
            }),
            React.createElement('div', {
              key: 'avg',
              className: "flex items-center justify-center"
            }, React.createElement('span', {
              className: "text-sm font-semibold text-foreground"
            }, `${staff.avg}%`)),
            React.createElement('div', {
              key: 'trend',
              className: "flex items-center justify-center"
            }, getTrendIcon(staff.avg))
          ])
        )
      ])
    ]),
    // Legend
    React.createElement('div', {
      key: 'legend',
      className: "mt-6 flex items-center justify-center space-x-6 text-xs"
    }, [
      React.createElement('div', {
        key: 'excellent',
        className: "flex items-center space-x-2"
      }, [
        React.createElement('div', {
          key: 'dot',
          className: "w-3 h-3 bg-green-500 rounded"
        }),
        React.createElement('span', {
          key: 'label',
          className: "text-muted-foreground"
        }, "Excellent (90%+)")
      ]),
      React.createElement('div', {
        key: 'good',
        className: "flex items-center space-x-2"
      }, [
        React.createElement('div', {
          key: 'dot',
          className: "w-3 h-3 bg-yellow-500 rounded"
        }),
        React.createElement('span', {
          key: 'label',
          className: "text-muted-foreground"
        }, "Good (80-89%)")
      ]),
      React.createElement('div', {
        key: 'fair',
        className: "flex items-center space-x-2"
      }, [
        React.createElement('div', {
          key: 'dot',
          className: "w-3 h-3 bg-orange-500 rounded"
        }),
        React.createElement('span', {
          key: 'label',
          className: "text-muted-foreground"
        }, "Fair (70-79%)")
      ]),
      React.createElement('div', {
        key: 'needs-improvement',
        className: "flex items-center space-x-2"
      }, [
        React.createElement('div', {
          key: 'dot',
          className: "w-3 h-3 bg-red-500 rounded"
        }),
        React.createElement('span', {
          key: 'label',
          className: "text-muted-foreground"
        }, "Needs Improvement (<70%)")
      ])
    ])
  ]);
};

export default StaffHeatmapChart;