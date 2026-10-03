import type { MetadataRoute } from "next";

const BASE_URL = "https://careerzeta.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/programs",
    "/resources",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
