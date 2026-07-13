import Link from "next/link";
import { ProductCard } from "@/features/catalog/components/product-card";
import heroImage from "@/assets/hero-pattachitra.jpg";
import artisanImage from "@/assets/artisan-story.jpg";

// Mock homepage data matching the expected shapes
const mockCategories = [
  {
    id: "cat-1",
    slug: "paintings",
    name: "Paintings",
    coverUrl: "/images/product-madhubani.jpg",
  },
  {
    id: "cat-2",
    slug: "wood-art",
    name: "Wood Art",
    coverUrl: "/images/product-wood-panel.jpg",
  },
  {
    id: "cat-3",
    slug: "metal-art",
    name: "Brass & Bronze",
    coverUrl: "/images/product-brass-diya.jpg",
  },
  {
    id: "cat-4",
    slug: "textiles",
    name: "Heirloom Textiles",
    coverUrl: "/images/product-kashmiri-cushion.jpg",
  },
];

const mockFeatured = [
  {
    id: "prod-1",
    slug: "tanjore-saraswati",
    title: "Goddess Saraswati Tanjore Masterpiece",
    short_desc: "22k Gold leaf with semi-precious stones on teak wood.",
    price_original: 68000,
    price_discounted: null,
    region: "Tanjore, Tamil Nadu",
    material: "Gold Leaf on Teak",
    is_available: true,
    stock: 1,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-tanjore.jpg",
  },
  {
    id: "prod-2",
    slug: "chola-bronze-nataraja",
    title: "Lost-Wax Bronze Nataraja",
    short_desc: "Hand-cast traditional Chola style bronze sculpture.",
    price_original: 120000,
    price_discounted: 110000,
    region: "Swamimalai, Tamil Nadu",
    material: "Bronze",
    is_available: true,
    stock: 1,
    category_slug: "metal-art",
    category_name: "Brass & Bronze",
    image_url: "/images/product-brass-diya.jpg",
  },
  {
    id: "prod-3",
    slug: "kashmiri-papier-mache-box",
    title: "Hand-painted Mughal Miniature Box",
    short_desc: "Fine papier-mâché box with detailed bird and flower details.",
    price_original: 12500,
    price_discounted: null,
    region: "Srinagar, Kashmir",
    material: "Papier-mâché",
    is_available: false,
    stock: 0,
    category_slug: "wood-art",
    category_name: "Wood Art",
    image_url: "/images/product-blue-pottery.jpg",
  },
];

const mockBestSellers = [
  {
    id: "prod-4",
    slug: "dhokra-tribal-musicians",
    title: "Dhokra Brass Musicians (Set of 3)",
    short_desc: "Lost-wax cast brass tribal figures.",
    price_original: 8500,
    price_discounted: null,
    region: "Bastar, Chhattisgarh",
    material: "Brass",
    is_available: true,
    stock: 5,
    category_slug: "metal-art",
    category_name: "Brass & Bronze",
    image_url: "/images/product-dhokra.jpg",
  },
  {
    id: "prod-5",
    slug: "madhubani-tree-of-life",
    title: "Tree of Life Madhubani Painting",
    short_desc: "Natural pigment painting on handmade paper.",
    price_original: 18000,
    price_discounted: 16500,
    region: "Mithila, Bihar",
    material: "Handmade Paper & Ink",
    is_available: true,
    stock: 2,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-madhubani.jpg",
  },
  {
    id: "prod-6",
    slug: "kashmiri-sozni-cushion",
    title: "Sozni Hand-embroidered Cushion Cover",
    short_desc: "Pure wool cushion cover with fine sozni needlework.",
    price_original: 4500,
    price_discounted: null,
    region: "Srinagar, Kashmir",
    material: "Wool & Cotton",
    is_available: true,
    stock: 12,
    category_slug: "textiles",
    category_name: "Heirloom Textiles",
    image_url: "/images/product-kashmiri-cushion.jpg",
  },
  {
    id: "prod-7",
    slug: "teak-jali-wall-panel",
    title: "Hand-carved Teak Jali Panel",
    short_desc: "Intricately carved floral geometric teak panel.",
    price_original: 32000,
    price_discounted: null,
    region: "Saharanpur, Uttar Pradesh",
    material: "Teak Wood",
    is_available: true,
    stock: 1,
    category_slug: "wood-art",
    category_name: "Wood Art",
    image_url: "/images/product-wood-panel.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
        <img
          src={heroImage.src}
          alt="Handcrafted Pattachitra painting on silk"
          width={1920}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] md:object-center ken-burns"
          // @ts-ignore
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-background/10 md:bg-gradient-to-b md:from-background/40 md:via-background/10 md:to-background/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
          <div className="max-w-xl fade-in">
            <div className="eyebrow text-foreground">A living museum · Est. India</div>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-foreground">
              The quiet art of a maker's hand.
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

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="text-center mb-14">
          <div className="eyebrow">Shop by discipline</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Four disciplines. One devotion.</h2>
        </div>
        <div className="grid gap-6 md:gap-8 md:grid-cols-4">
          {mockCategories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group text-center"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary/60">
                <img
                  src={c.coverUrl}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-5 font-display text-xl group-hover:text-accent transition-colors">{c.name}</h3>
              <div className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED MASTERPIECES */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <div className="eyebrow">Featured masterpieces</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Signed by their makers</h2>
            </div>
            <Link href="/collections/featured-masterpieces" className="text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent">
              View all →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
            {mockFeatured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

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

      {/* BEST SELLERS */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <div className="eyebrow">Most collected</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Pieces that find homes quickly</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent">
            Browse all →
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-4">
          {mockBestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FAQ / PROMISE STRIP */}
      <section className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-3 text-center">
          <div>
            <div className="eyebrow">Authenticated</div>
            <div className="mt-3 font-display text-xl">Signed &amp; certified</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">Every piece ships with a provenance card and the artisan's signature.</p>
          </div>
          <div>
            <div className="eyebrow">Museum packaging</div>
            <div className="mt-3 font-display text-xl">Insured worldwide shipping</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">Custom crating for fragile works. Free across India. Insured to your door abroad.</p>
          </div>
          <div>
            <div className="eyebrow">Concierge</div>
            <div className="mt-3 font-display text-xl">Direct from the atelier</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">A curator on hand for provenance questions, custom commissions and gifting.</p>
          </div>
        </div>
      </section>
    </>
  );
}
