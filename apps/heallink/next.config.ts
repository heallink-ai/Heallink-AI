import type { NextConfig } from "next";
// import { createTailwindPlugin } from "@tailwindcss/vite";

const nextConfig: NextConfig = {
  /* config options here */
  // plugins: [createTailwindPlugin()],
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
    // If you want more granular control, consider creating an .eslintrc.json file
  },
  reactStrictMode: true, // Enable React strict mode for React 19
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "plus.unsplash.com",
      "platform-lookaside.fbsbx.com",
      "localhost",
      "localstack", // Added to fix the image loading error
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localstack", // Added to fix the image loading error
        pathname: "**",
      },
    ],
  },
  typescript: {
    // Completely ignore typescript errors for build
    ignoreBuildErrors: true,
  },
  output: "standalone",
  // Skip static generation and prevent prerendering
  experimental: {
    // Disable tree-shaking to prevent static optimization
    disableOptimizedLoading: true,
  },
  // Skip generation of special pages
  env: {
    // Force dynamic rendering for all pages
    NEXT_SKIP_HYDRATION: "true",
  },
  // experimental: {
  //   // Help with auth.js compatibility
  //   skipMiddlewareUrlNormalize: true,
  //   skipTrailingSlashRedirect: true,
  // },
};

export default nextConfig;
