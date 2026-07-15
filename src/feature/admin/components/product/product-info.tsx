import { formatINR } from "@/lib/format";

import type { ProductDetailInfo } from "@/feature/admin/components/product/types";

export function ProductInfo({ product }: { product: ProductDetailInfo }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
        {product.category?.name ?? "Uncategorized"}
      </div>
      <h1 className="mt-2 font-serif text-3xl text-[#1a1a1a] md:text-4xl">
        {product.title}
      </h1>
      <div className="mt-2 text-sm text-[#707065]">/{product.slug}</div>

      <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em]">
        <span
          className={
            product.isAvailable
              ? "border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800"
              : "border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#707065]"
          }
        >
          {product.isAvailable ? "Available" : "Unavailable"}
        </span>
        {product.isFeatured && (
          <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#4a4a40]">
            Featured
          </span>
        )}
        {product.isBestSeller && (
          <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#4a4a40]">
            Best seller
          </span>
        )}
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-serif text-2xl text-[#1a1a1a]">
          {formatINR(product.priceDiscounted ?? product.priceOriginal)}
        </span>
        {product.priceDiscounted != null && (
          <span className="text-sm text-[#a3a39a] line-through">
            {formatINR(product.priceOriginal)}
          </span>
        )}
      </div>
      <div className="mt-2 text-sm text-[#707065]">
        Stock: {product.stock}
        {product.sku ? ` · SKU ${product.sku}` : ""}
      </div>

      {product.shortDesc && (
        <p className="mt-6 text-sm leading-relaxed text-[#4a4a40]">
          {product.shortDesc}
        </p>
      )}

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {product.region && (
          <>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Region
            </dt>
            <dd>{product.region}</dd>
          </>
        )}
        {product.material && (
          <>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Material
            </dt>
            <dd>{product.material}</dd>
          </>
        )}
        {product.dimensions && (
          <>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Dimensions
            </dt>
            <dd>{product.dimensions}</dd>
          </>
        )}
        {product.weightGrams != null && (
          <>
            <dt className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
              Weight
            </dt>
            <dd>{product.weightGrams} g</dd>
          </>
        )}
      </dl>

      {product.story && (
        <div className="mt-8 border-t border-[#e5e5e0] pt-6">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
            Story
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#4a4a40]">
            {product.story}
          </p>
        </div>
      )}

      {product.longDesc && (
        <div className="mt-6 border-t border-[#e5e5e0] pt-6">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
            Description
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#4a4a40]">
            {product.longDesc}
          </p>
        </div>
      )}
    </div>
  );
}
