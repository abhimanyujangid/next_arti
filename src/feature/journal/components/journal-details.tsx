"use client";

import Link from "next/link";
import { useMemo } from "react";

const mockPosts = [
  {
    id: "post-1",
    slug: "chola-bronze-casting",
    title: "Chola Bronzes: The Poetry of Lost Wax",
    excerpt: "Exploring the 1000-year-old traditional metalsmithing technique of Swamimalai, where statues are born from fire and wax.",
    cover_url: "/images/product-brass-diya.jpg",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["Metalcraft"],
    author_name: "Surya",
    body: `Deep in the delta of the Kaveri river, in the town of Swamimalai, the air is thick with the smell of river clay and burning cow dung. This is where the last-wax bronze sthapathis (sculptors) practice an art that has remained virtually unchanged since the 10th century Chola empire.

The process, known as Cire Perdue, is a poetry of destruction and rebirth. First, the artisan chisels a model out of pure beeswax. Every ringlet of Shiva's hair, every curve of Nataraja's limb must be carved perfectly. One mistake, and the weeks of carving are lost.

Once the wax is complete, it is coated in layers of specialized alluvial clay gathered from the Kaveri river bed. When dry, this clay shell is fired, melting away the wax inside to leave a hollow negative cavity. Molten bronze—a panchaloha alloy of copper, brass, lead, tin, and gold—is then poured in. When the metal cools, the clay mould is shattered. The sculpture is born, but the mould is lost forever. Every Chola bronze is a one-of-one masterpiece.`,
  },
  {
    id: "post-2",
    slug: "tanjore-painting-heritage",
    title: "Gold and Glass: The Brilliance of Tanjore Painting",
    excerpt: "An essay on the unique relief painting style of Tamil Nadu, mapping its development through Maratha patronage and religious devotion.",
    cover_url: "/images/product-tanjore.jpg",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["Paintings"],
    author_name: "Prashanth Bose",
    body: `Originating in the town of Thanjavur (Tanjore) during the late 16th century, Tanjore paintings are distinguished by their rich, vivid colors, iconic composition, and most importantly, their shimmering gold foil relief work.

The surface of a Tanjore painting is literally three-dimensional. The artist begins by stretching unbleached cloth over a teakwood base. A paste of chalk and gum arabic (called gesso) is then layered onto the board to build relief structures for the crowns, ornaments, and pillars.

Once the relief is set, authentic 22-karat gold leaf is burnished onto the gesso details. Traditional artists used to embed uncut rubies, sapphires, and emeralds into the relief, though modern masters use high-quality Jaipur stones and glass beads. The rest of the painting is filled with organic mineral colors, creating an artwork designed to glow in the dim light of prayer rooms.`,
  },
];

export function JournalPost({ slug }: { slug: string }) {
  const p = useMemo(() => {
    return mockPosts.find((post) => post.slug === slug) || mockPosts[0];
  }, [slug]);

  return (
    <article className="mx-auto max-w-[900px] px-6 md:px-10 pt-16 pb-24">
      <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/journal" className="hover:text-accent">Journal</Link>
      </nav>

      {p.tags?.[0] && <div className="eyebrow">{p.tags.join(" · ")}</div>}
      <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05]">{p.title}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {p.author_name && <span>By {p.author_name}</span>}
        {p.published_at && (
          <span className="eyebrow">
            {new Date(p.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        )}
      </div>

      {p.cover_url && (
        <div className="mt-12 aspect-[16/10] overflow-hidden bg-secondary/60">
          <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-12 max-w-[68ch] font-serif-body text-lg leading-[1.85] text-foreground/90 space-y-6">
        {p.body.split(/\n\n+/).map((para, i) => (
          <p key={i} className="whitespace-pre-line">{para}</p>
        ))}
      </div>

      <hr className="gold-rule my-16" />
      <Link href="/journal" className="eyebrow text-accent">← More from the Journal</Link>
    </article>
  );
}
