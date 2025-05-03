import type { NextConfig } from "next";
// import { createTailwindPlugin } from "@tailwindcss/vite";

const nextConfig: NextConfig = {
  /* config options here */
  // plugins: [createTailwindPlugin()],
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
    // If you want more granular control, consider creating an .eslintrc.json file
  },
};

export default nextConfig;
