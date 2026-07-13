"use client";

import Link from "next/link";
import { format } from "date-fns";

const mockPosts = [
  {
    id: "post-1",
    slug: "chola-bronze-casting",
    title: "Chola Bronzes: The Poetry of Lost Wax",
    excerpt: "Exploring the 1000-year-old traditional metalsmithing technique of Swamimalai, where statues are born from fire and wax.",
    cover_url: "/images/product-brass-diya.jpg",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["Metalcraft"],
  },
  {
    id: "post-2",
    slug: "tanjore-painting-heritage",
    title: "Gold and Glass: The Brilliance of Tanjore Painting",
    excerpt: "An essay on the unique relief painting style of Tamil Nadu, mapping its development through Maratha patronage and religious devotion.",
    cover_url: "/images/product-tanjore.jpg",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["Paintings"],
  },
];

export function JournalList() {
  return (
    <div>
      <section className="bg-secondary/40 py-24 px-6 md:px-10 text-center">
        <div className="eyebrow">The Journal</div>
        <h1 className="mt-4 font-display text-4xl md:text-6xl max-w-2xl mx-auto">
          Notes on Indian craft &amp; heritage
        </h1>
      </section>

      <div className="mx-auto max-w-[1000px] px-6 md:px-10 py-20">
        {mockPosts.length === 0 ? (
          <div className="text-center text-muted-foreground">No entries yet.</div>
        ) : (
          <div className="space-y-24">
            {mockPosts.map((p) => (
              <article key={p.id} className="grid md:grid-cols-2 gap-10 items-center" style={{ contentVisibility: "auto" }}>
                <Link href={`/journal/${p.slug}`} className="block aspect-[4/3] overflow-hidden bg-secondary">
                  {p.cover_url && (
                    <img src={p.cover_url} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  )}
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    <span>{format(new Date(p.created_at), "MMMM d, yyyy")}</span>
                    {p.tags && p.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{p.tags[0]}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display text-3xl hover:text-accent">
                    <Link href={`/journal/${p.slug}`}>{p.title}</Link>
                  </h2>
                  {p.excerpt && (
                    <p className="mt-4 text-foreground/80 leading-relaxed">
                      {p.excerpt}
                    </p>
                  )}
                  <Link href={`/journal/${p.slug}`} className="mt-6 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent">
                    Read essay
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
