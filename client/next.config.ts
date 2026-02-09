import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // turbopack: {
  //   root: path.resolve(__dirname),
  // } as any,
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
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;
