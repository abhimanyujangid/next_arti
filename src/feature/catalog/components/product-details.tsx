"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ZoomIn,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { formatINR, discountPct } from "@/lib/format";
import { ProductCard } from "./product-card";
import { ProductReviews } from "./product-reviews";
import { useSyncedCart } from "@/feature/cart/hooks/use-synced-cart";
import { useSyncedWishlist } from "@/feature/account/hooks/use-synced-wishlist";
import type {
  CatalogProductCard,
  CatalogProductDetail,
} from "@/feature/catalog/api/utils";

export function ProductDetails({
  product,
  related,
}: {
  product: CatalogProductDetail;
  related: CatalogProductCard[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const cart = useSyncedCart();
  const wish = useSyncedWishlist();

  const disc = discountPct(product.price_original, product.price_discounted);
  const images =
    product.images.length > 0
      ? product.images
      : product.image_url
        ? [{ url: product.image_url, alt: product.title, sortOrder: 0 }]
        : [];
  const active = images[activeIdx] ?? images[0];

  const addToCart = () => {
    if (!active) return;
    cart.add({
      product_id: product.id,
      slug: product.slug,
      title: product.title,
      price: Number(product.price_discounted ?? product.price_original),
      image: active.url,
      qty: 1,
    });
    toast.success(`${product.title} added to cart`);
  };

  const cartLine = cart.items.find((i) => i.product_id === product.id);
  const soldOut = product.stock === 0 || !product.is_available;

  const decrementQty = () => {
    if (!cartLine) return;
    if (cartLine.qty <= 1) {
      cart.remove(product.id);
      toast.success("Removed from cart");
      return;
    }
    cart.setQty(product.id, cartLine.qty - 1);
  };

  const incrementQty = () => {
    if (!cartLine) return;
    if (product.stock > 0 && cartLine.qty >= product.stock) {
      toast.error("No more stock available");
      return;
    }
    cart.setQty(product.id, cartLine.qty + 1);
  };

  const isWished = wish.has(product.id);

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-8 md:pt-12 pb-24">
      <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-accent">
          Shop
        </Link>
        {product.category_name && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/shop?category=${product.category_slug}`}
              className="hover:text-accent"
            >
              {product.category_name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.25fr_1fr]">
        <section>
          {active ? (
            <div
              className="relative aspect-[4/5] overflow-hidden bg-secondary/60 cursor-zoom-in"
              onClick={() => setZoom((z) => !z)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.url}
                alt={active.alt ?? product.title}
                className={
                  "h-full w-full object-cover transition-transform duration-500 " +
                  (zoom ? "scale-[1.6]" : "scale-100")
                }
              />
              <button
                type="button"
                className="absolute right-4 top-4 bg-background/80 p-2"
                aria-label="Zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {disc && (
                <span className="absolute left-4 top-4 bg-background/90 px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                  {disc}% off
                </span>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center bg-secondary/60 text-muted-foreground">
              No image
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((im, i) => (
                <button
                  key={`${im.url}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={
                    "aspect-square overflow-hidden border bg-secondary/60 " +
                    (i === activeIdx ? "border-accent" : "border-transparent")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={im.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="lg:sticky lg:top-24 lg:self-start">
          {product.region && (
            <div className="eyebrow">{product.region}</div>
          )}
          <h1 className="mt-2 font-display text-4xl md:text-5xl leading-[1.05]">
            {product.title}
          </h1>
          {product.region && (
            <div className="mt-3 text-sm text-muted-foreground">
              {product.region}
            </div>
          )}

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-3xl">
              {formatINR(product.price_discounted ?? product.price_original)}
            </span>
            {product.price_discounted && (
              <span className="text-lg text-muted-foreground line-through">
                {formatINR(product.price_original)}
              </span>
            )}
          </div>

          {product.short_desc && (
            <p className="mt-6 text-base leading-relaxed text-foreground/85">
              {product.short_desc}
            </p>
          )}

          <hr className="gold-rule my-8" />

          <div className="flex flex-wrap gap-3">
            {soldOut ? (
              <button
                type="button"
                disabled
                className="min-w-[200px] flex-1 bg-foreground px-6 py-4 text-xs uppercase tracking-[0.24em] text-background opacity-40"
              >
                Sold out
              </button>
            ) : cartLine ? (
              <div className="flex min-w-[200px] flex-1 items-stretch border border-foreground">
                <button
                  type="button"
                  onClick={decrementQty}
                  aria-label="Decrease quantity"
                  className="px-5 py-4 transition-colors hover:bg-secondary/60"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex flex-1 items-center justify-center text-sm tabular-nums tracking-[0.12em]">
                  {cartLine.qty}
                </span>
                <button
                  type="button"
                  onClick={incrementQty}
                  aria-label="Increase quantity"
                  className="px-5 py-4 transition-colors hover:bg-secondary/60"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={addToCart}
                className="min-w-[200px] flex-1 bg-foreground px-6 py-4 text-xs uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent hover:text-primary-foreground"
              >
                Add to cart
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                wish.toggle(product.id, {
                  product_id: product.id,
                  slug: product.slug,
                  title: product.title,
                  image: active?.url ?? "",
                  price: Number(
                    product.price_discounted ?? product.price_original,
                  ),
                })
              }
              aria-label="Wishlist"
              className="border border-foreground/40 px-4 py-4 transition-colors hover:border-accent hover:text-accent"
            >
              <Heart
                className={
                  "h-4 w-4 " + (isWished ? "fill-accent text-accent" : "")
                }
              />
            </button>
          </div>

          {product.stock > 0 && product.stock <= 3 && (
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-accent">
              Only {product.stock} left
            </p>
          )}

          {product.story && (
            <div className="mt-10">
              <div className="eyebrow">Story of the piece</div>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {product.story}
              </p>
            </div>
          )}

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {product.material && (
              <>
                <dt className="eyebrow">Material</dt>
                <dd>{product.material}</dd>
              </>
            )}
            {product.dimensions && (
              <>
                <dt className="eyebrow">Dimensions</dt>
                <dd>{product.dimensions}</dd>
              </>
            )}
            {product.weight_grams != null && (
              <>
                <dt className="eyebrow">Weight</dt>
                <dd>{product.weight_grams} g</dd>
              </>
            )}
            {product.sku && (
              <>
                <dt className="eyebrow">SKU</dt>
                <dd>{product.sku}</dd>
              </>
            )}
          </dl>

          <div className="mt-10 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-accent" /> Complimentary insured
              shipping across India
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-accent" /> Provenance card
              &amp; artisan signature included
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-accent" /> Seven-day inspection
              window on delivery
            </div>
          </div>
        </section>
      </div>

      {product.long_desc && (
        <section className="mt-24 max-w-3xl">
          <div className="eyebrow">About the work</div>
          <p className="mt-4 text-lg leading-relaxed text-foreground/85">
            {product.long_desc}
          </p>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <div className="eyebrow">You may also love</div>
          <h2 className="mt-3 mb-10 font-display text-3xl md:text-4xl">
            From the same discipline
          </h2>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}

      <div id="reviews">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
