"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/app/theme/ThemeProvider";
import ReactQueryProvider from "@/app/lib/react-query/provider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
