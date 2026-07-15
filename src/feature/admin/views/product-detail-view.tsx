"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { formatINR } from "@/lib/format";
import { ProductFormSheet } from "@/feature/admin/components/product-form-sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
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

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isApproved: boolean;
  createdAt: Date | string;
  user: { id: string; name: string; email: string };
};

export function ProductDetailView({ productId }: { productId: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.admin.products.getById.useQuery({
    id: productId,
  });
  const { data: categories = [] } = trpc.admin.categories.list.useQuery();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState<ReviewRow | null>(null);

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

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <Skeleton className="h-4 w-32 rounded-none" />
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-none" />
            <Skeleton className="h-6 w-1/2 rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyTitle>Product not found</EmptyTitle>
            <EmptyDescription>
              This product may have been deleted.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            className="mt-4 rounded-none"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Back to products
          </Button>
        </Empty>
      </div>
    );
  }

  const {
    reviews,
    reviewStats,
    ...product
  } = data;
  const images = product.images;
  const cover = images[activeImage] ?? images[0];

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
            onClick={() => setSheetOpen(true)}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <a href={`/product/${product.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              View storefront
            </a>
          </Button>
        </div>
      </div>

      <section className="grid gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <div className="aspect-[4/5] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover.url}
                alt={cover.alt || product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#a3a39a]">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={
                    "aspect-square overflow-hidden border bg-[#fafaf8] " +
                    (i === activeImage
                      ? "border-[#1a1a1a]"
                      : "border-[#e5e5e0]")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

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
      </section>

      <section id="reviews" className="scroll-mt-8 border-t border-[#e5e5e0] pt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
              Collector reviews
            </div>
            <h2 className="mt-2 font-serif text-2xl text-[#1a1a1a]">
              {reviewStats.count === 0
                ? "No reviews yet"
                : `${reviewStats.average.toFixed(1)} · ${reviewStats.count} review${reviewStats.count === 1 ? "" : "s"}`}
            </h2>
            {reviewStats.pendingCount > 0 && (
              <p className="mt-1 text-xs text-amber-700">
                {reviewStats.pendingCount} awaiting approval
              </p>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="border border-dashed border-[#e5e5e0] bg-white px-6 py-10 text-center text-sm text-[#707065]">
            Reviews for this piece will appear here when collectors submit them.
          </p>
        ) : (
          <div className="border border-[#e5e5e0] bg-white">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-[#e5e5e0] px-4 py-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#707065]">
                      <span>{review.rating}/5</span>
                      <span>·</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={
                          review.isApproved
                            ? "text-emerald-700"
                            : "text-amber-700"
                        }
                      >
                        {review.isApproved ? "Approved" : "Hidden"}
                      </span>
                    </div>
                    <div className="mt-2 font-medium text-[#1a1a1a]">
                      {review.title || "Untitled review"}
                    </div>
                    {review.body && (
                      <p className="mt-1 whitespace-pre-line text-sm text-[#4a4a40]">
                        {review.body}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-[#707065]">
                      {review.user.name} ({review.user.email})
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    {review.isApproved ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-none"
                        disabled={setApproved.isPending}
                        onClick={() =>
                          setApproved.mutate({
                            id: review.id,
                            isApproved: false,
                          })
                        }
                      >
                        <X className="size-3.5" />
                        Hide
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-none"
                        disabled={setApproved.isPending}
                        onClick={() =>
                          setApproved.mutate({
                            id: review.id,
                            isApproved: true,
                          })
                        }
                      >
                        <Check className="size-3.5" />
                        Approve
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-none text-destructive hover:text-destructive"
                      onClick={() => setDeleting(review)}
                      aria-label="Delete review"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `This permanently deletes the review by ${deleting.user.name}.`
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
