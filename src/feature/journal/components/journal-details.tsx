import Link from "next/link";

import type { JournalPostDetail } from "@/feature/journal/data/journal-seo";
import {
  buildJournalBreadcrumbSchema,
  buildJournalPostingSchema,
} from "@/feature/journal/data/journal-seo";

export function JournalPost({ post }: { post: JournalPostDetail }) {
  const postingSchema = buildJournalPostingSchema(post);
  const breadcrumbSchema = buildJournalBreadcrumbSchema(post);
  const paragraphs = post.body
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-[900px] px-6 md:px-10 pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/journal" className="hover:text-accent">
          Journal
        </Link>
      </nav>

      {post.tags.length > 0 && (
        <div className="eyebrow">{post.tags.join(" · ")}</div>
      )}
      <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05]">
        {post.title}
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {post.authorName && <span>By {post.authorName}</span>}
        {post.publishedAt && (
          <span className="eyebrow">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      {post.coverUrl && (
        <div className="mt-12 aspect-[16/10] overflow-hidden bg-secondary/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mt-12 max-w-[68ch] font-serif-body text-lg leading-[1.85] text-foreground/90 space-y-6">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      <hr className="gold-rule my-16" />
      <Link href="/journal" className="eyebrow text-accent">
        ← More from the Journal
      </Link>
    </article>
  );
}
