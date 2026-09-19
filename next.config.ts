import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/property/:slug*",
        destination: "/properties/:slug*",
      },
    ];
  },
};

export default nextConfig;
