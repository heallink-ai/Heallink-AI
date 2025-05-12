"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AiInsightCard() {
  const [expanded, setExpanded] = useState(false);

  // Sample AI insights
  const insights = [
    {
      title: "Medication Adherence",
      content:
        "You've been consistent with your medication schedule for 30 days. Great job maintaining your health routine!",
    },
    {
      title: "Sleep Pattern",
      content:
        "Your sleep data shows you're averaging 6.5 hours per night. Consider aiming for 7-8 hours for optimal health.",
    },
    {
      title: "Physical Activity",
      content:
        "Your activity level has increased by 15% this month. Keep up the good work with regular exercise.",
    },
  ];

  return (
    <div className="p-4 bg-card rounded-xl neumorph-flat relative overflow-hidden">
      {/* Decorative AI pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 rounded-bl-[100px] -z-0" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2V4c0-1.1.9-2 2-2z" />
                <path d="M12 10v12" />
                <path d="M16 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
                <path d="M8 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">AI Health Insights</h2>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary text-sm hover:underline flex items-center"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>

        <AnimatePresence>
          <motion.div
            initial={{ height: "auto" }}
            animate={{ height: expanded ? "auto" : "40px" }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-background/50 rounded-lg"
                >
                  <h3 className="font-medium text-purple-heart mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {insight.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
