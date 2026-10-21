import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Images are pre-sized into responsive webp sets by scripts/images.mjs
    unoptimized: true,
  },
};

export default nextConfig;
