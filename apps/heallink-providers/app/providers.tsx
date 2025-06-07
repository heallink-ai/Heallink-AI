"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./providers/QueryProvider";
import ThemeProvider from "./theme/ThemeProvider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}