"use client";

import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import { ProductFormSheet } from "@/feature/admin/components/product-form-sheet";
import { ProductDetailNotFound } from "@/feature/admin/components/product/product-detail-not-found";
import { ProductDetailSkeleton } from "@/feature/admin/components/product/product-detail-skeleton";
import { ProductDetailToolbar } from "@/feature/admin/components/product/product-detail-toolbar";
import { ProductGallery } from "@/feature/admin/components/product/product-gallery";
import { ProductInfo } from "@/feature/admin/components/product/product-info";
import { ProductReviewDeleteDialog } from "@/feature/admin/components/product/product-review-delete-dialog";
import { ProductReviewsSection } from "@/feature/admin/components/product/product-reviews-section";
import type { ProductReviewRow } from "@/feature/admin/components/product/types";

export function ProductDetailView({ productId }: { productId: string }) {
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.admin.products.getById.useQuery({
    id: productId,
  });
  const { data: categories = [] } = trpc.admin.categories.list.useQuery();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState<ProductReviewRow | null>(null);

  const setApproved = trpc.admin.reviews.setApproved.useMutation({
    onSuccess: async (_data, vars) => {
      toast.success(vars.isApproved ? "Review approved" : "Review hidden");
      await utils.admin.products.getById.invalidate({ id: productId });
      await utils.admin.reviews.listProductsWithReviews.invalidate();
      await utils.catalog.listReviews.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.admin.reviews.delete.useMutation({
    onSuccess: async () => {
      toast.success("Review deleted");
      setDeleting(null);
      await utils.admin.products.getById.invalidate({ id: productId });
      await utils.admin.reviews.listProductsWithReviews.invalidate();
      await utils.catalog.listReviews.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !data) return <ProductDetailNotFound />;

  const { reviews, reviewStats, ...product } = data;

  const formProduct = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    shortDesc: product.shortDesc,
    longDesc: product.longDesc,
    story: product.story,
    categoryId: product.categoryId,
    region: product.region,
    material: product.material,
    dimensions: product.dimensions,
    weightGrams: product.weightGrams,
    sku: product.sku,
    stock: product.stock,
    priceOriginal: product.priceOriginal,
    priceDiscounted: product.priceDiscounted,
    isAvailable: product.isAvailable,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    images: product.images,
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <ProductDetailToolbar
        slug={product.slug}
        onEdit={() => setSheetOpen(true)}
      />

      <section className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ProductGallery
          title={product.title}
          images={product.images}
          activeIndex={activeImage}
          onSelect={setActiveImage}
        />
        <ProductInfo product={product} />
      </section>

      <ProductReviewsSection
        reviews={reviews}
        reviewStats={reviewStats}
        isUpdating={setApproved.isPending}
        onSetApproved={(id, isApproved) =>
          setApproved.mutate({ id, isApproved })
        }
        onDelete={setDeleting}
      />

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            void utils.admin.products.getById.invalidate({ id: productId });
            void utils.admin.products.list.invalidate();
          }
        }}
        product={formProduct}
        categoryOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <ProductReviewDeleteDialog
        open={Boolean(deleting)}
        authorName={deleting?.user.name ?? null}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={() => {
          if (!deleting) return;
          deleteMutation.mutate({ id: deleting.id });
        }}
      />
    </div>
  );
}
