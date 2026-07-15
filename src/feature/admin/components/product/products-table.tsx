import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { ProductListRow } from "@/feature/admin/components/product/types";

const ROW_GRID =
  "grid min-w-[800px] grid-cols-[72px_1fr_120px_80px_80px_120px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0";

export function ProductsTable({
  products,
  onEdit,
  onDelete,
}: {
  products: ProductListRow[];
  onEdit: (product: ProductListRow) => void;
  onDelete: (product: ProductListRow) => void;
}) {
  return (
    <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
      <div className="grid min-w-[800px] grid-cols-[72px_1fr_120px_80px_80px_120px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
        <span>Image</span>
        <span>Title</span>
        <span>Category</span>
        <span>Stock</span>
        <span>Reviews</span>
        <span>Price</span>
        <span className="text-right">Actions</span>
      </div>

      {products.map((product) => (
        <div key={product.id} className={ROW_GRID}>
          <Link
            href={`/admin/products/${product.id}`}
            className="size-[56px] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]"
          >
            {product.images[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[10px] text-[#a3a39a]">
                None
              </div>
            )}
          </Link>

          <div className="min-w-0">
            <Link
              href={`/admin/products/${product.id}`}
              className="truncate font-medium text-[#1a1a1a] hover:text-accent"
            >
              {product.title}
            </Link>
            <div className="truncate text-xs text-[#707065]">
              /{product.slug}
              {product.isFeatured ? " · Featured" : ""}
              {product.isBestSeller ? " · Best seller" : ""}
              {!product.isAvailable ? " · Unavailable" : ""}
            </div>
          </div>

          <div className="truncate text-sm text-[#4a4a40]">
            {product.category?.name ?? "—"}
          </div>
          <div className="text-sm text-[#4a4a40]">{product.stock}</div>
          <div className="text-sm text-[#4a4a40]">{product._count.reviews}</div>
          <div className="text-sm text-[#4a4a40]">
            {formatINR(product.priceDiscounted ?? product.priceOriginal)}
          </div>

          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => onEdit(product)}
              aria-label={`Edit ${product.title}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none text-destructive hover:text-destructive"
              onClick={() => onDelete(product)}
              aria-label={`Delete ${product.title}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
