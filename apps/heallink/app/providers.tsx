"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/app/theme/ThemeProvider";
import ReactQueryProvider from "@/app/lib/react-query/provider";
import AuthProvider from "@/app/components/auth/AuthProvider";
import { LiveKitProvider } from "@/app/providers/LiveKitProvider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <LiveKitProvider>{children}</LiveKitProvider>
          </AuthProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
