import { Suspense } from "react";
import Link from "next/link";

import { HomeCategories } from "@/feature/catalog/components/home-categories";
import { HomeCategoriesSkeleton } from "@/feature/catalog/components/home-categories-skeleton";
import { HomeFeatured } from "@/feature/catalog/components/home-featured";
import { HomeBestsellers } from "@/feature/catalog/components/home-bestsellers";
import {
  HomeBestsellersSkeleton,
  HomeFeaturedSkeleton,
} from "@/feature/catalog/components/home-product-skeletons";
import heroImage from "@/assets/hero-pattachitra.jpg";
import artisanImage from "@/assets/artisan-story.jpg";

export function HomeView() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage.src}
          alt="Handcrafted Pattachitra painting on silk"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] md:object-center ken-burns"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-background/10 md:bg-gradient-to-b md:from-background/40 md:via-background/10 md:to-background/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
          <div className="max-w-xl fade-in">
            <div className="eyebrow text-foreground">A living museum · Est. India</div>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-foreground">
              The quiet art of a maker&apos;s hand.
            </h1>
            <p className="mt-5 text-base md:text-lg text-foreground/85 max-w-lg leading-relaxed">
              Each piece here is one of one — painted, carved or cast by hand in a workshop somewhere between Kutch and Kolkata. We ship museum-packaged, worldwide.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/shop"
                className="text-xs md:text-sm uppercase tracking-[0.24em] border-b border-accent pb-2 text-foreground hover:text-accent transition-colors"
              >
                Browse the collection →
              </Link>
              <Link
                href="/about"
                className="text-xs md:text-sm uppercase tracking-[0.24em] text-foreground/80 hover:text-accent transition-colors"
              >
                Meet our makers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<HomeCategoriesSkeleton />}>
        <HomeCategories />
      </Suspense>

      <Suspense fallback={<HomeFeaturedSkeleton />}>
        <HomeFeatured />
      </Suspense>

      {/* ARTISAN STORY */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32 grid gap-14 md:grid-cols-2 items-center">
        <div className="order-2 md:order-1">
          <div className="eyebrow">The artisan story</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight">
            The chisel remembers what the mind forgets.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Our artisans are custodians of unbroken lineages — third and fourth generation painters, carvers, weavers and casters. The techniques you see on these pages have been passed down without a break for two hundred, sometimes two thousand, years.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every piece is signed. Every commission tells us who cut the wood, who mixed the pigment, who worked the loom. When you take one home, you take a piece of that lineage with you.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent"
          >
            Read our story →
          </Link>
        </div>
        <div className="order-1 md:order-2 aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artisanImage.src}
            alt="A master artisan carving wood by hand"
            width={1600}
            height={1200}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <Suspense fallback={<HomeBestsellersSkeleton />}>
        <HomeBestsellers />
      </Suspense>

      {/* FAQ / PROMISE STRIP */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-3 text-center">
          <div>
            <div className="eyebrow">Authenticated</div>
            <div className="mt-3 font-display text-xl">Signed &amp; certified</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              Every piece ships with a provenance card and the artisan&apos;s signature.
            </p>
          </div>
          <div>
            <div className="eyebrow">Museum packaging</div>
            <div className="mt-3 font-display text-xl">Insured worldwide shipping</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              Custom crating for fragile works. Free across India. Insured to your door abroad.
            </p>
          </div>
          <div>
            <div className="eyebrow">Concierge</div>
            <div className="mt-3 font-display text-xl">Direct from the atelier</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              A curator on hand for provenance questions, custom commissions and gifting.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
