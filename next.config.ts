import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads these via fs.readFileSync() with a computed path, not a
  // static import, so Next's file tracer can't discover them on its own —
  // without this, the font/logo files are missing from the deployed
  // serverless function and PDF generation fails in production only.
  outputFileTracingIncludes: {
    "app/api/**/*": ["./lib/pdf-fonts/**", "./public/brand/*.png"],
  },
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
