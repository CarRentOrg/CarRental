import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "toyota.dreamhosters.com",
      },
      {
        protocol: "https",
        hostname: "lexusenthusiast.com",
      },
      {
        protocol: "https",
        hostname: "www.topgear.com",
      },
      {
        protocol: "https",
        hostname: "www.luxurylifestylemag.co.uk",
      },
      {
        protocol: "https",
        hostname: "hips.hearstapps.com",
      },
    ],
  },
};

export default nextConfig;
