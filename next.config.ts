import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel auto-detects Next.js and handles output itself.
  // `output: "standalone"` is for Docker/self-hosted — leave it off for Vercel.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
