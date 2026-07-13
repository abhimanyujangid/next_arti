import type { Metadata } from "next";
import Link from "next/link";
import artisanImage from "@/assets/artisan-story.jpg";
import preservingImage from "@/assets/product-madhubani.jpg";
import visionImage from "@/assets/product-tanjore.jpg";

const SITE_URL = "https://arti-sun-gallery.lovable.app";
const ABOUT_URL = `${SITE_URL}/about`;
const ABOUT_TITLE = "About ArtiSun — Authentic Indian Art & Handcrafted Creations";
const ABOUT_DESCRIPTION =
  "Meet ArtiSun: a curated gallery preserving traditional Indian art — canvas paintings, palm leaf art, silk paintings, and handcrafted decor — connecting master artisans with collectors worldwide.";
const ABOUT_OG_IMAGE = `${SITE_URL}/images/artisan-story.jpg`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: ["ArtiSun", "Indian art", "traditional Indian paintings", "Madhubani", "Tanjore", "Pattachitra", "palm leaf art", "handcrafted decor", "artisan gallery"],
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: "website",
    url: ABOUT_URL,
    siteName: "ArtiSun",
    images: [
      {
        url: ABOUT_OG_IMAGE,
        alt: "A master artisan at work in the ArtiSun studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [ABOUT_OG_IMAGE],
  },
  alternates: {
    canonical: ABOUT_URL,
  },
};

export default function AboutPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: ABOUT_URL,
    primaryImageOfPage: ABOUT_OG_IMAGE,
    mainEntity: {
      "@type": "Organization",
      name: "ArtiSun",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      description:
        "ArtiSun is a curated space dedicated to preserving and celebrating traditional Indian art and handcrafted creations.",
      foundingLocation: "Delhi, India",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sector 9, Rohini",
        addressLocality: "Delhi",
        postalCode: "110085",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9565366555",
          contactType: "customer service",
          email: "artisun.in@gmail.com",
          areaServed: "Worldwide",
          availableLanguage: ["English", "Hindi"],
        },
      ],
      employee: [
        { "@type": "Person", name: "Prashanth Bose", jobTitle: "Managing Partner" },
        { "@type": "Person", name: "Surya", jobTitle: "Managing Director" },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: ABOUT_URL },
    ],
  };

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
            <Stat value="100+" label="Artworks" />
            <Stat value="4" label="Art Forms" />
            <Stat value="100%" label="Handcrafted" />
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
              {["Traditional Canvas Paintings", "Palm Leaf Art", "Silk Paintings", "Handcrafted Decorative Artworks"].map((item) => (
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
            <Pillar
              number="01"
              title="Preserving Traditional Art"
              image={preservingImage.src}
              imageAlt="Traditional Madhubani artwork"
              body={
                <>
                  At ArtiSun, we believe traditional art forms deserve to be preserved and appreciated
                  in modern spaces. These artworks are not just decorative items — they represent
                  history, culture, and the creativity of skilled artisans. By showcasing these
                  creations, we aim to support traditional art forms and bring them to art lovers,
                  collectors, and interior spaces around the world.
                </>
              }
            />
            <Pillar
              number="02"
              title="Our Vision"
              image={visionImage.src}
              imageAlt="Tanjore painting reflecting artistic heritage"
              body={
                <>
                  Our vision is to create a platform where authentic handmade artworks can reach
                  people who value cultural heritage and artistic excellence. We want every artwork
                  to find a home where it can inspire, beautify spaces, and keep traditional art
                  alive for generations to come.
                </>
              }
            />
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
          <LeaderCard
            role="Managing Partner"
            name="Prashanth Bose"
            quote="We assure guaranteed quality in every name and creation that comes to you."
            image={artisanImage.src}
          />
          <LeaderCard
            role="Managing Director"
            name="Surya"
            quote="Explore heritage and rare art through our journey and join to make a mark."
          />
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl md:text-4xl text-accent">{value}</dt>
      <dd className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</dd>
    </div>
  );
}

function Pillar({ number, title, body, image, imageAlt }: { number: string; title: string; body: React.ReactNode; image?: string; imageAlt?: string }) {
  return (
    <div className="relative flex h-full flex-col">
      {image && (
        <div className="mb-6 md:mb-8 overflow-hidden border border-border/60 aspect-[4/3] md:aspect-[16/10]">
          <img
            src={image}
            alt={imageAlt ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}
      <div className="font-display text-5xl md:text-6xl text-accent/60">{number}</div>
      <h3 className="mt-3 md:mt-4 font-display text-2xl md:text-3xl">{title}</h3>
      <hr className="gold-rule my-5 md:my-6" />
      <p className="text-base leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}

function LeaderCard({ role, name, quote, image }: { role: string; name: string; quote: string; image?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      <div className="shrink-0">
        {image ? (
          <div className="h-40 w-40 overflow-hidden border border-border/60">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-40 w-40 flex items-center justify-center border border-border/60 bg-secondary/40 font-display text-4xl text-accent">
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{role}</div>
        <h3 className="mt-2 font-display text-2xl md:text-3xl">{name}</h3>
        <hr className="gold-rule my-5" />
        <p className="text-base leading-relaxed italic text-foreground/80">"{quote}"</p>
      </div>
    </div>
  );
}
