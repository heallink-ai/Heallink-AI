"use client";

import { useSession, signOut } from "next-auth/react";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not authenticated, redirect to auth-required page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth-required?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-heart border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-2xl neumorph-flat p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold high-contrast-text">
                Welcome to your Dashboard
              </h1>
              <p className="light-text-muted mt-1">
                {session?.user?.name
                  ? `Hello, ${session.user.name}`
                  : "Your healthcare journey starts here"}
              </p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
              className="neumorph-flat"
            >
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Card Example 1 */}
            <div className="p-6 rounded-xl neumorph-flat bg-purple-heart/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Appointments</h3>
              <p className="text-sm light-text-muted mb-4">
                View and manage all your upcoming appointments
              </p>
              <Button href="#" variant="ghost" size="sm" className="w-full">
                View Appointments
              </Button>
            </div>

            {/* Dashboard Card Example 2 */}
            <div className="p-6 rounded-xl neumorph-flat bg-royal-blue/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-blue to-havelock-blue flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
              <p className="text-sm light-text-muted mb-4">
                Access your health history and documents
              </p>
              <Button href="#" variant="ghost" size="sm" className="w-full">
                View Records
              </Button>
            </div>

            {/* Dashboard Card Example 3 */}
            <div className="p-6 rounded-xl neumorph-flat bg-havelock-blue/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-havelock-blue to-purple-heart flex items-center justify-center text-white mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-sm light-text-muted mb-4">
                Securely communicate with healthcare providers
              </p>
              <Button href="#" variant="ghost" size="sm" className="w-full">
                Open Messages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
