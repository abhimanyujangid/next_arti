export type JournalListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  authorName: string | null;
  tags: string[];
  publishedAt: Date | string | null;
};

export type JournalPostDetail = JournalListItem & {
  body: string;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const JOURNAL_TITLE = "The Journal";
export const JOURNAL_DESCRIPTION =
  "Essays on Indian craft traditions, artisans, and the making of ArtiSun's collectible works.";
export const JOURNAL_KEYWORDS = [
  "ArtiSun journal",
  "Indian craft",
  "artisan essays",
  "heritage art",
  "Indian art traditions",
];

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function buildJournalPostingSchema(post: JournalPostDetail) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/journal/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: post.authorName
      ? { "@type": "Person", name: post.authorName }
      : { "@type": "Organization", name: "ArtiSun" },
    publisher: {
      "@type": "Organization",
      name: "ArtiSun",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    url,
  };
}

export function buildJournalBreadcrumbSchema(post: JournalPostDetail) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: `${siteUrl}/journal`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/journal/${post.slug}`,
      },
    ],
  };
}
