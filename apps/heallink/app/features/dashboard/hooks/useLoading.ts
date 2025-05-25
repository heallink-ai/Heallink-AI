"use client";

import { useState, useEffect } from "react";

export const useLoading = (loadingTime: number = 1500) => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, loadingTime);
    return () => clearTimeout(timer);
  }, [loadingTime]);

  return loading;
};