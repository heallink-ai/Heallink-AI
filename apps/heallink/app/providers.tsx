"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/app/theme/ThemeProvider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}