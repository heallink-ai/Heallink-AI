/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  // Force Node.js runtime for middleware
  experimental: {
    // No need for instrumentationHook anymore
  },
};

module.exports = nextConfig;
