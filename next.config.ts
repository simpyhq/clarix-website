import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/clarix-website",
  assetPrefix: "/clarix-website",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
