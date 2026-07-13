import Link from "next/link";
import { formatINR, discountPct } from "@/lib/format";
import type { CatalogProductCard } from "@/features/catalog/api/utils";

export function ProductCard({ product }: { product: CatalogProductCard }) {
  const disc = discountPct(product.price_original, product.price_discounted);
  const shown = product.price_discounted ?? product.price_original;
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/60">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
        {disc && (
          <span className="absolute left-4 top-4 bg-background/90 text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1 text-accent">
            {disc}% off
          </span>
        )}
        {!product.is_available && (
          <span className="absolute right-4 top-4 bg-background/90 text-[0.65rem] uppercase tracking-[0.2em] px-2 py-1">
            Sold
          </span>
        )}
      </div>
      <div className="pt-4">
        {product.region && (
          <div className="eyebrow">{product.region}</div>
        )}
        <h3 className="mt-1.5 font-display text-lg md:text-xl leading-tight text-foreground group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2 text-sm">
          <span>{formatINR(shown)}</span>
          {product.price_discounted && (
            <span className="text-muted-foreground line-through text-xs">
              {formatINR(product.price_original)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
