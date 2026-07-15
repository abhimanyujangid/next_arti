"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { formatINR } from "@/lib/format";
import { ProductFormSheet } from "@/feature/admin/components/product-form-sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

type ProductListRow = {
  id: string;
  slug: string;
  title: string;
  stock: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  category: { id: string; name: string; slug: string } | null;
  images: { url: string }[];
  _count: { reviews: number };
};

type ProductDetailRow = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string | null;
  longDesc: string | null;
  story: string | null;
  categoryId: string | null;
  region: string | null;
  material: string | null;
  dimensions: string | null;
  weightGrams: number | null;
  sku: string | null;
  stock: number;
  priceOriginal: number;
  priceDiscounted: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  images: { url: string; alt: string | null; sortOrder: number }[];
};

export function ProductsView() {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(1);
  const { data, isLoading } = trpc.admin.products.list.useQuery({
    page,
    pageSize: PAGE_SIZE,
  });
  const { data: categories = [] } = trpc.admin.categories.list.useQuery();

  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDetailRow | null>(null);
  const [deleting, setDeleting] = useState<ProductListRow | null>(null);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted");
      setDeleting(null);
      const remaining = total - 1;
      const nextTotalPages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
      if (page > nextTotalPages) {
        setPage(nextTotalPages);
      }
      await utils.admin.products.list.invalidate();
      await utils.catalog.listProducts.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = async (row: ProductListRow) => {
    try {
      const detail = await utils.admin.products.getById.fetch({ id: row.id });
      const { reviews: _reviews, reviewStats: _stats, ...formProduct } = detail;
      setEditing({
        id: formProduct.id,
        slug: formProduct.slug,
        title: formProduct.title,
        shortDesc: formProduct.shortDesc,
        longDesc: formProduct.longDesc,
        story: formProduct.story,
        categoryId: formProduct.categoryId,
        region: formProduct.region,
        material: formProduct.material,
        dimensions: formProduct.dimensions,
        weightGrams: formProduct.weightGrams,
        sku: formProduct.sku,
        stock: formProduct.stock,
        priceOriginal: formProduct.priceOriginal,
        priceDiscounted: formProduct.priceDiscounted,
        isAvailable: formProduct.isAvailable,
        isFeatured: formProduct.isFeatured,
        isBestSeller: formProduct.isBestSeller,
        images: formProduct.images,
      });
      setSheetOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load product",
      );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#1a1a1a]">Products</h2>
          <p className="mt-2 text-sm tracking-wide text-[#707065]">
            Manage catalog pieces, multi-image galleries, and home flags.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          <Plus className="size-4" />
          New product
        </Button>
      </div>

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[72px_1fr_120px_80px_80px_120px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Reviews</span>
            <span>Price</span>
            <span className="text-right">Actions</span>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[72px_1fr_120px_80px_80px_120px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-[56px] rounded-none" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/2 rounded-none" />
              </div>
              <Skeleton className="h-4 w-16 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-16 rounded-none" />
              <div className="flex justify-end gap-1">
                <Skeleton className="size-8 rounded-none" />
                <Skeleton className="size-8 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>No products yet</EmptyTitle>
            <EmptyDescription>
              Create the first product to populate shop, homepage, and detail pages.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={openCreate} className="rounded-none">
              <Plus className="size-4" />
              New product
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div>
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
              <div
                key={product.id}
                className="grid min-w-[800px] grid-cols-[72px_1fr_120px_80px_80px_120px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
              >
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
                <div className="text-sm text-[#4a4a40]">
                  {product._count.reviews}
                </div>
                <div className="text-sm text-[#4a4a40]">
                  {formatINR(product.priceDiscounted ?? product.priceOriginal)}
                </div>

                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={() => void openEdit(product)}
                    aria-label={`Edit ${product.title}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-none text-destructive hover:text-destructive"
                    onClick={() => setDeleting(product)}
                    aria-label={`Delete ${product.title}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.22em] text-[#707065]">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          ) : null}
        </div>
      )}

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editing}
        categoryOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `This will permanently delete “${deleting.title}” and its gallery images.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!deleting) return;
                deleteMutation.mutate({ id: deleting.id });
              }}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
