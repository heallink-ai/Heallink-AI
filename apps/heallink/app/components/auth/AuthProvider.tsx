"use client";

import { useAutoRefreshToken } from "@/app/lib/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Component that handles token refresh in the background
 * Include this at a high level in the app to ensure tokens stay valid
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const { isRefreshing } = useAutoRefreshToken();

  // Log auth status changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Auth status:",
        status,
        isRefreshing ? "(refreshing token)" : ""
      );
    }
  }, [status, isRefreshing]);

  return <>{children}</>;
}
