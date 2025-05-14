// src/app/layout.tsx
import "./globals.css";
import "./components/dashboard/neumorphic-effects.css";
import Providers from "./providers";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "HealLink | AI-Driven Healthcare Routing and Assistance",
  description:
    "Connect with the right healthcare provider instantly through our AI-driven health routing platform. No more waiting, no more confusion — just immediate, intelligent care.",
  keywords:
    "healthcare, AI, telemedicine, doctor appointments, medical assistant, health tech, medical routing",
  authors: [{ name: "HealLink", url: "https://heallink.com" }],
  creator: "HealLink",
  publisher: "HealLink",
  openGraph: {
    title: "HealLink | AI-Driven Healthcare Routing and Assistance",
    description:
      "Connect with the right healthcare provider instantly through our AI-driven health routing platform.",
    url: "https://heallink.com",
    siteName: "HealLink",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HealLink - Intelligent Healthcare Routing",
      },
    ],
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealLink | AI-Driven Healthcare Routing",
    description:
      "Connect with the right healthcare provider instantly through our AI-driven health routing platform.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5a2dcf" />
        <meta name="msapplication-TileColor" content="#5a2dcf" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Immediately set dark theme to avoid flash of light theme
            (function() {
              document.documentElement.classList.add('dark');
              document.documentElement.classList.remove('light');
              document.documentElement.style.colorScheme = 'dark';
            })();
          `,
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
