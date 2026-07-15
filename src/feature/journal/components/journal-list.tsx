"use client";

import Link from "next/link";
import { format } from "date-fns";

import type { JournalListItem } from "@/feature/journal/data/journal-seo";
import heroImage from "@/assets/hero-pattachitra.jpg";

export function JournalList({ posts }: { posts: JournalListItem[] }) {
  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden md:min-h-[60vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage.src}
          alt="Handcrafted Pattachitra painting"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/45 to-background/25" />
        <div className="relative z-10 mx-auto flex min-h-[52vh] max-w-[1400px] flex-col items-center justify-end px-6 pb-16 pt-24 text-center md:min-h-[60vh] md:px-10 md:pb-20">
          <div className="eyebrow text-foreground">The Journal</div>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] md:text-6xl">
            Notes on Indian craft &amp; heritage
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] px-6 md:px-10 py-20">
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No entries yet. Check back soon for essays from the workshop.
          </div>
        ) : (
          <div className="space-y-24">
            {posts.map((p) => (
              <article
                key={p.id}
                className="grid md:grid-cols-2 gap-10 items-center"
                style={{ contentVisibility: "auto" }}
              >
                <Link
                  href={`/journal/${p.slug}`}
                  className="block aspect-[4/3] overflow-hidden bg-secondary"
                >
                  {p.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    {p.publishedAt && (
                      <span>
                        {format(new Date(p.publishedAt), "MMMM d, yyyy")}
                      </span>
                    )}
                    {p.tags.length > 0 && (
                      <>
                        {p.publishedAt && <span>·</span>}
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
                  <Link
                    href={`/journal/${p.slug}`}
                    className="mt-6 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent"
                  >
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
