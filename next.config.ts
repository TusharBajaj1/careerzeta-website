import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Resources v3's report-cover and story SVG assets need this.
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
