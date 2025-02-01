import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts'
      }
    }
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
