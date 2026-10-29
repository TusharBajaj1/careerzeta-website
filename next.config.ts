import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Resources v3's report-cover and story SVG assets need this.
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // Admin-uploaded blog images (cover + in-body) live in Vercel Blob storage.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
