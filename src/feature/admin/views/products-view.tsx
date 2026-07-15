"use client";

import { useState } from "react";
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
  const { data: products = [], isLoading } = trpc.admin.products.list.useQuery();
  const { data: categories = [] } = trpc.admin.categories.list.useQuery();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDetailRow | null>(null);
  const [deleting, setDeleting] = useState<ProductListRow | null>(null);

  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted");
      setDeleting(null);
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
      setEditing(detail);
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
          <div className="grid grid-cols-[72px_1fr_120px_100px_120px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Price</span>
            <span className="text-right">Actions</span>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[72px_1fr_120px_100px_120px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-[56px] rounded-none" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/2 rounded-none" />
              </div>
              <Skeleton className="h-4 w-16 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-16 rounded-none" />
              <div className="flex justify-end gap-1">
                <Skeleton className="size-8 rounded-none" />
                <Skeleton className="size-8 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
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
        <div className="border border-[#e5e5e0] bg-white overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[72px_1fr_120px_80px_120px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Price</span>
            <span className="text-right">Actions</span>
          </div>

          {products.map((product) => (
            <div
              key={product.id}
              className="grid min-w-[720px] grid-cols-[72px_1fr_120px_80px_120px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <div className="size-[56px] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
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
              </div>

              <div className="min-w-0">
                <div className="truncate font-medium text-[#1a1a1a]">
                  {product.title}
                </div>
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
