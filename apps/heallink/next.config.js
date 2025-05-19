/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  reactStrictMode: true, // Enable React strict mode for React 19
  images: {
    domains: [
      "images.unsplash.com",
      "lh3.googleusercontent.com",
      "plus.unsplash.com",
      "platform-lookaside.fbsbx.com",
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
};

module.exports = nextConfig;
