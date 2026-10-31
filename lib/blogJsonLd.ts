const SITE_URL = "https://www.careerzeta.com";

type JsonLdPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  author: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

/** Builds a schema.org/BlogPosting entry so a published post is eligible for Google's article rich result. */
export function buildBlogPostingJsonLd(post: JsonLdPost, seriesName?: string | null) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const publishedAt = (post.publishedAt ?? post.createdAt).toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImageUrl ?? undefined,
    url,
    mainEntityOfPage: url,
    datePublished: publishedAt,
    dateModified: post.updatedAt.toISOString(),
    isPartOf: seriesName ? { "@type": "CreativeWorkSeries", name: seriesName } : undefined,
    author: {
      "@type": "Person",
      name: post.author ?? "CareerZeta",
    },
    publisher: {
      "@type": "Organization",
      name: "CareerZeta",
      sameAs: SITE_URL,
    },
  };
}
