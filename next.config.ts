import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "learn-plus-bucket.s3.amazonaws.com",
      },
      {
        hostname: "www.launchuicomponents.com",
      }
    ],
  },
};

export default nextConfig;
