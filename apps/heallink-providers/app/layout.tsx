import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./components/dashboard/neumorphic-effects.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "HealLink Providers | Healthcare Provider Dashboard",
  description:
    "Comprehensive dashboard for healthcare providers to manage doctors, knowledge bases, specializations, and staff members.",
  keywords:
    "healthcare providers, medical dashboard, doctor management, knowledge base, medical specializations, staff management",
  authors: [{ name: "HealLink", url: "https://heallink.com" }],
  creator: "HealLink",
  publisher: "HealLink",
  openGraph: {
    title: "HealLink Providers | Healthcare Provider Dashboard",
    description:
      "Comprehensive dashboard for healthcare providers to manage their practice efficiently.",
    url: "https://providers.heallink.com",
    siteName: "HealLink Providers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealLink Providers - Healthcare Management Dashboard",
      },
    ],
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealLink Providers | Healthcare Dashboard",
    description:
      "Comprehensive dashboard for healthcare providers to manage their practice efficiently.",
    creator: "@heallinkapp",
    images: ["/twitter-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
