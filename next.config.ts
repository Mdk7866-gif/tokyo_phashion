import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve WebP/AVIF automatically — much smaller than JPEG/PNG
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 30 days (default is 60 seconds)
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Useful Cloudinary widths for responsive srcsets
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384, 512],
  },
};

export default nextConfig;
