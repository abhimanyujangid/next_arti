import React from "react";
import Link from "next/link";
import { Stat } from "../components/stat";
import { Pillar } from "../components/pillar";
import { LeaderCard } from "../components/leader-card";
import {
  pageSchema,
  breadcrumbSchema,
  stats,
  artForms,
  pillars,
  leaders,
} from "../data/about-data";
import artisanImage from "@/assets/artisan-story.jpg";

export function AboutView() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <img
          src={artisanImage.src}
          alt="A master artisan at work"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1400px] flex-col justify-end px-6 md:px-10 pb-20 pt-32">
          <div className="eyebrow">Authentic Indian Art &amp; Handcrafted Creations</div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] max-w-4xl">
            Celebrating <br />
            <span className="text-accent italic">Global</span> <br />
            Artistic Soul
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-foreground/85 leading-relaxed">
            A curated space dedicated to preserving and celebrating traditional Indian art
            and handcrafted creations — connecting master artisans with collectors worldwide.
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-8 max-w-xl border-t border-foreground/20 pt-8">
            {stats.map((item) => (
              <Stat key={item.label} value={item.value} label={item.label} />
            ))}
          </dl>
        </div>
      </section>

      {/* About + Commitment */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32 grid gap-16 md:grid-cols-2">
        <div>
          <div className="eyebrow">About</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">About ArtiSun</h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              ArtiSun is a curated space dedicated to celebrating the beauty of traditional Indian art
              and handcrafted creations. Our platform brings together timeless artworks that reflect the
              rich cultural heritage and artistic traditions of India.
            </p>
            <p>We specialize in unique handmade artworks including:</p>
            <ul className="space-y-2 pl-0">
              {artForms.map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <span className="h-px w-6 bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:pl-12 md:border-l md:border-border/60">
          <div className="eyebrow">Our Commitment</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">Every piece, a story</h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              Each piece in our collection is carefully selected for its artistic detail, cultural
              significance, and craftsmanship.
            </p>
            <p>
              Many artworks depict scenes from Indian mythology such as{" "}
              <span className="text-foreground italic">Krishna Leela</span>,{" "}
              <span className="text-foreground italic">Durga</span>, and{" "}
              <span className="text-foreground italic">Hanuman</span> — capturing stories that have
              been passed down through generations.
            </p>
            <p>
              Every purchase directly supports the skilled artisans who dedicate their lives to
              keeping these ancient traditions alive.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary/30 border-y border-border/60">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
          <div className="eyebrow">Mission &amp; Vision</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl max-w-2xl">
            What drives ArtiSun.
          </h2>

          <div className="mt-12 md:mt-16 grid gap-10 md:gap-12 md:grid-cols-2 items-stretch">
            {pillars.map((pillar) => (
              <Pillar
                key={pillar.number}
                number={pillar.number}
                title={pillar.title}
                image={pillar.image}
                imageAlt={pillar.imageAlt}
                body={pillar.body}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="eyebrow">Leadership</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl max-w-2xl">
          The Vision Behind ArtiSun
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75">
          Guided by passion for heritage, craftsmanship, and timeless artistic expression.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {leaders.map((leader) => (
            <LeaderCard
              key={leader.name}
              role={leader.role}
              name={leader.name}
              quote={leader.quote}
              image={leader.image}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 text-center">
        <div className="eyebrow">The collection</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">Bring a piece of India home.</h2>
        <div className="mt-8">
          <Link href="/shop" className="inline-block text-xs uppercase tracking-[0.24em] border-b border-accent pb-1 hover:text-accent">
            Browse the collection →
          </Link>
        </div>
      </section>
    </>
  );
}
