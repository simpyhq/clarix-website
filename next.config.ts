import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No static export — deploying to Vercel for server-side API routes
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
