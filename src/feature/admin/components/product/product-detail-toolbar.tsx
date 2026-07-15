import Link from "next/link";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductDetailToolbar({
  slug,
  onEdit,
}: {
  slug: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Products
      </Link>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-none"
          onClick={onEdit}
        >
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button asChild variant="outline" className="rounded-none">
          <a href={`/product/${slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            View storefront
          </a>
        </Button>
      </div>
    </div>
  );
}
