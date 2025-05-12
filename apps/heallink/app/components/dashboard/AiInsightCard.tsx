"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function AiInsightCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Randomized AI insights
  const insights = [
    {
      id: 1,
      title: "Blood Pressure Trend",
      short: "Your blood pressure is trending higher than usual.",
      full: "Your blood pressure readings over the past week show an upward trend. The average reading has increased from 120/80 to 128/85. Consider reducing sodium intake and increasing physical activity. If this trend continues, please consult with your healthcare provider.",
    },
    {
      id: 2,
      title: "Medication Adherence",
      short: "You've been consistent with your medication schedule.",
      full: "Great job maintaining your medication schedule this month. Your adherence rate is 98%, which is excellent. Consistent medication usage is key to managing your condition effectively. Keep up the good work!",
    },
    {
      id: 3,
      title: "Activity Analysis",
      short: "Your daily step count is below your weekly average.",
      full: "Your average daily step count this week is 4,500, which is 20% lower than your usual weekly average of 5,600 steps. Consider incorporating short walks during your day to reach your target of 7,000 steps daily for optimal heart health.",
    },
  ];

  // Choose a random insight for demonstration
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];

  return (
    <motion.div
      className="p-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 neumorph-flat relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute top-0 left-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold">AI Health Insight</h3>
            <motion.span
              className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              New
            </motion.span>
          </div>
          <p className="text-sm text-foreground/80 mb-2">
            {isExpanded ? randomInsight.full : randomInsight.short}
          </p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  Read More
                </>
              )}
            </button>
            <span className="text-xs text-foreground/60">
              Generated just now
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
