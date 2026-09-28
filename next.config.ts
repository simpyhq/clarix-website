import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  // No static export — deploying to Vercel for server-side API routes
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    const headers = securityHeaders();
    return [
      { source: "/", headers },
      { source: "/:path*", headers },
    ];
  },
};

export default nextConfig;
