import type { Metadata } from "next";

/** Shared OG/Twitter image — see public/og-image.png. */
const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "CareerZeta — Mentor-led courses in data and AI",
};

/**
 * Builds a page's full `title`/`description`/`openGraph`/`twitter`/canonical
 * metadata in one call. Next.js shallow-merges metadata across segments, so
 * a page that sets its own `openGraph` loses the root layout's `openGraph`
 * entirely (siteName, images, etc.) unless it's repeated here.
 */
export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "CareerZeta",
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
