"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[color:var(--muted)] hover:bg-[color:var(--muted-foreground)]/20 transition-colors"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="card-admin p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome to the Admin Panel
          </h2>
          <p className="text-[color:var(--muted-foreground)] mb-4">
            This is a placeholder dashboard. A complete implementation would
            include:
          </p>
          <ul className="list-disc pl-5 text-[color:var(--muted-foreground)] space-y-2">
            <li>Admin sidebar navigation</li>
            <li>User management features</li>
            <li>Healthcare provider management</li>
            <li>Appointment analytics</li>
            <li>System configuration settings</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-admin p-6">
            <h3 className="text-lg font-medium mb-4">Sample Data</h3>
            <div className="flex items-center justify-between border-b border-[color:var(--border)] py-3">
              <span>Total Users</span>
              <span className="font-bold">1,248</span>
            </div>
            <div className="flex items-center justify-between border-b border-[color:var(--border)] py-3">
              <span>Active Providers</span>
              <span className="font-bold">76</span>
            </div>
            <div className="flex items-center justify-between border-b border-[color:var(--border)] py-3">
              <span>Appointments Today</span>
              <span className="font-bold">42</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span>Revenue This Month</span>
              <span className="font-bold">$28,450</span>
            </div>
          </div>

          <div className="card-admin p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-[color:var(--primary)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm">
                    New user registered:{" "}
                    <span className="font-medium">Sarah Johnson</span>
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    5 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[color:var(--secondary)]/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-[color:var(--secondary)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm">
                    New appointment booked with{" "}
                    <span className="font-medium">Dr. Michael Chen</span>
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    20 minutes ago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-[color:var(--success)]/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 text-[color:var(--success)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm">
                    Payment processed for{" "}
                    <span className="font-medium">Invoice #2845</span>
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
