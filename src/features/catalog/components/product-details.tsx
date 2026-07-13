"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Heart, Truck, ShieldCheck, RotateCcw, ZoomIn } from "lucide-react";
import { toast } from "sonner";
import { formatINR, discountPct } from "@/lib/format";
import { ProductCard } from "./product-card";
import { ProductReviews, ReviewStars } from "./product-reviews";
import { useCart } from "@/features/cart/hooks/use-cart-store";
import { useWishlist } from "@/features/account/hooks/use-wishlist-store";
import type { CatalogProductCard } from "@/features/catalog/api/utils";

// Mock products database for dynamic frontend product details
const mockProductsDetailed = [
  {
    id: "prod-1",
    slug: "tanjore-saraswati",
    title: "Goddess Saraswati Tanjore Masterpiece",
    short_desc: "22k Gold leaf with semi-precious stones on teak wood.",
    long_desc: "A classical Tanjore painting depicting Saraswati, the Hindu goddess of music, art, wisdom, and nature. Adorned with authentic 22k gold leaf, the painting features relief work (gesso) that gives a three-dimensional depth. Intricate details are accentuated with traditional Jaipur semi-precious stones.",
    story: "Hand-painted by master artist Ramanujam in his workshop in Tanjore. It took over six weeks to complete the gesso work, apply the gold foil, and finish the detailed facial features using natural mineral pigments.",
    price_original: 68000,
    price_discounted: null,
    region: "Tanjore, Tamil Nadu",
    material: "24k Gold Leaf & Teakwood",
    dimensions: "24 x 18 inches",
    weightGrams: 4200,
    sku: "ART-TJ-042",
    stock: 1,
    is_available: true,
    category_slug: "paintings",
    category_name: "Paintings",
    product_images: [
      { url: "/images/product-tanjore.jpg", alt: "Saraswati Tanjore Painting Main View" },
      { url: "/images/product-silk-painting.jpg", alt: "Detail view of gold leaf relief" }
    ],
  },
  {
    id: "prod-2",
    slug: "chola-bronze-nataraja",
    title: "Lost-Wax Bronze Nataraja",
    short_desc: "Hand-cast traditional Chola style bronze sculpture.",
    long_desc: "Cast using the ancient 'lost-wax' method (Cire Perdue) dating back to the Chola dynasty. This statue depicts Lord Shiva as the cosmic dancer Nataraja, performing the Ananda Tandava (dance of bliss). It shows Shiva surrounded by a flaming aureole, stamping out ignorance.",
    story: "Handcrafted by Rajan, a fifth-generation bronze sthapathi (sculptor) from Swamimalai. The mould is broken after a single casting, rendering this piece an irreplaceable one-of-one.",
    price_original: 120000,
    price_discounted: 110000,
    region: "Swamimalai, Tamil Nadu",
    material: "Panchaloha Bronze (Five-Metal Alloy)",
    dimensions: "18 x 14 x 5 inches",
    weightGrams: 8500,
    sku: "ART-CB-109",
    stock: 1,
    is_available: true,
    category_slug: "metal-art",
    category_name: "Brass & Bronze",
    product_images: [
      { url: "/images/product-brass-diya.jpg", alt: "Bronze Nataraja Front view" },
      { url: "/images/product-dhokra.jpg", alt: "Bronze Nataraja side details" }
    ],
  },
  {
    id: "prod-3",
    slug: "blue-pottery-vase",
    title: "Jaipur Blue Pottery Floral Vase",
    short_desc: "Hand-glazed traditional blue pottery quartz vase.",
    long_desc: "This exquisite vase is crafted using Jaipur's famous blue pottery technique. Unlike traditional clay pottery, it is made using a paste of ground quartz, glass, multani mitti (Fuller's earth), and gum. Hand-painted with rich cobalt blue and turquoise floral motifs before glazing.",
    story: "Hand-painted by female artisans at the Kopal cooperative in Jaipur, providing sustainable livelihood opportunities while preserving this unique GI-tagged craft form.",
    price_original: 4500,
    price_discounted: null,
    region: "Jaipur, Rajasthan",
    material: "Quartz & Glazed Paste",
    dimensions: "12 x 6 inches",
    weightGrams: 1500,
    sku: "ART-BP-005",
    stock: 10,
    is_available: true,
    category_slug: "ceramics",
    category_name: "Ceramics",
    product_images: [
      { url: "/images/product-blue-pottery.jpg", alt: "Jaipur Blue Pottery Floral Vase" }
    ],
  },
  {
    id: "prod-4",
    slug: "dhokra-tribal-musicians",
    title: "Dhokra Brass Musicians (Set of 3)",
    short_desc: "Lost-wax cast brass tribal figures.",
    long_desc: "A set of three traditional tribal musicians handcrafted using the ancient Dhokra metal casting technique. Using non-ferrous metal casting, this craft has been practiced in India for over 4,000 years, tracing back to the Dancing Girl of Mohenjo-daro.",
    story: "Handmade by the Ghadwa tribal artisans in Bastar. Each figure is built around a clay core, wrapped in wax threads, covered in clay, and then fired, replacing the melted wax with molten brass.",
    price_original: 8500,
    price_discounted: null,
    region: "Bastar, Chhattisgarh",
    material: "Brass / Bell Metal",
    dimensions: "8 x 3 x 3 inches each",
    weightGrams: 2200,
    sku: "ART-DK-091",
    stock: 5,
    is_available: true,
    category_slug: "metal-art",
    category_name: "Brass & Bronze",
    product_images: [
      { url: "/images/product-dhokra.jpg", alt: "Dhokra Brass Musicians Set of 3" }
    ],
  },
];

export function ProductDetails({ slug }: { slug: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const cart = useCart();
  const wish = useWishlist();

  // Find the product by slug
  const p = useMemo(() => {
    return mockProductsDetailed.find((item) => item.slug === slug) || mockProductsDetailed[0];
  }, [slug]);

  // Fallback for related products
  const related: CatalogProductCard[] = useMemo(() => {
    return mockProductsDetailed
      .filter((item) => item.slug !== p.slug && item.category_slug === p.category_slug)
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        short_desc: item.short_desc,
        price_original: item.price_original,
        price_discounted: item.price_discounted,
        region: item.region,
        material: item.material,
        is_available: item.is_available,
        stock: item.stock,
        category_slug: item.category_slug,
        category_name: item.category_name,
        image_url: item.product_images[0]?.url ?? null,
      }));
  }, [p]);

  const disc = discountPct(p.price_original, p.price_discounted);
  const images = p.product_images.length > 0 ? p.product_images : [{ url: "/images/product-tanjore.jpg", alt: p.title }];
  const active = images[activeIdx] || images[0];

  const addToCart = () => {
    cart.add({
      product_id: p.id,
      slug: p.slug,
      title: p.title,
      price: Number(p.price_discounted ?? p.price_original),
      image: active.url,
      qty: 1,
    });
    toast.success(`${p.title} added to cart`);
  };

  const isWished = wish.has(p.id);

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-8 md:pt-12 pb-24">
      <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-accent">Shop</Link>
        {p.category_name && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${p.category_slug}`} className="hover:text-accent">{p.category_name}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.25fr_1fr]">
        {/* GALLERY */}
        <section>
          <div
            className="relative aspect-[4/5] overflow-hidden bg-secondary/60 cursor-zoom-in"
            onClick={() => setZoom((z) => !z)}
          >
            <img
              src={active.url}
              alt={active.alt ?? p.title}
              className={"h-full w-full object-cover transition-transform duration-500 " + (zoom ? "scale-[1.6]" : "scale-100")}
            />
            <button className="absolute right-4 top-4 bg-background/80 p-2" aria-label="Zoom">
              <ZoomIn className="h-4 w-4" />
            </button>
            {disc && (
              <span className="absolute left-4 top-4 bg-background/90 text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 text-accent">
                {disc}% off
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((im, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={"aspect-square overflow-hidden bg-secondary/60 border " + (i === activeIdx ? "border-accent" : "border-transparent")}
                >
                  <img src={im.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* DETAILS */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          {p.region && <div className="eyebrow">{p.region}</div>}
          <h1 className="mt-2 font-display text-4xl md:text-5xl leading-[1.05]">{p.title}</h1>
          <div className="mt-3 text-sm text-muted-foreground">
            By <span className="text-foreground">Master Artisan</span> · {p.region}
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-3xl">{formatINR(p.price_discounted ?? p.price_original)}</span>
            {p.price_discounted && (
              <span className="text-muted-foreground line-through text-lg">{formatINR(p.price_original)}</span>
            )}
          </div>

          {p.short_desc && <p className="mt-6 text-base leading-relaxed text-foreground/85">{p.short_desc}</p>}

          <hr className="gold-rule my-8" />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={addToCart}
              disabled={p.stock === 0}
              className="flex-1 min-w-[200px] bg-foreground text-background px-6 py-4 text-xs uppercase tracking-[0.24em] hover:bg-accent hover:text-primary-foreground transition-colors disabled:opacity-40"
            >
              {p.stock === 0 ? "Sold out" : "Add to cart"}
            </button>
            <button
              onClick={() => wish.toggle(p.id, {
                product_id: p.id, slug: p.slug, title: p.title, image: active.url,
                price: Number(p.price_discounted ?? p.price_original),
              })}
              aria-label="Wishlist"
              className="border border-foreground/40 px-4 py-4 hover:border-accent hover:text-accent transition-colors"
            >
              <Heart className={"h-4 w-4 " + (isWished ? "fill-accent text-accent" : "")} />
            </button>
          </div>

          {p.stock > 0 && p.stock <= 3 && (
             <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">Only {p.stock} left</p>
          )}

          {p.story && (
            <div className="mt-10">
              <div className="eyebrow">Story of the piece</div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{p.story}</p>
            </div>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            {p.material && (<><dt className="eyebrow">Material</dt><dd>{p.material}</dd></>)}
            {p.dimensions && (<><dt className="eyebrow">Dimensions</dt><dd>{p.dimensions}</dd></>)}
            {p.weightGrams && (<><dt className="eyebrow">Weight</dt><dd>{p.weightGrams} g</dd></>)}
            {p.sku && (<><dt className="eyebrow">SKU</dt><dd>{p.sku}</dd></>)}
          </dl>

          <div className="mt-10 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-accent" /> Complimentary insured shipping across India</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-accent" /> Provenance card &amp; artisan signature included</div>
            <div className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-accent" /> Seven-day inspection window on delivery</div>
          </div>
        </section>
      </div>

      {p.long_desc && (
        <section className="mt-24 max-w-3xl">
          <div className="eyebrow">About the work</div>
          <p className="mt-4 text-lg leading-relaxed text-foreground/85">{p.long_desc}</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <div className="eyebrow">You may also love</div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl mb-10">From the same discipline</h2>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}

      <div id="reviews">
        <ProductReviews productId={p.id} />
      </div>
    </div>
  );
}
