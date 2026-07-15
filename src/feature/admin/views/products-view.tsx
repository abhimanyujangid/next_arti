"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import { ProductFormSheet } from "@/feature/admin/components/product-form-sheet";
import { ProductDeleteDialog } from "@/feature/admin/components/product/product-delete-dialog";
import { ProductsEmpty } from "@/feature/admin/components/product/products-empty";
import { ProductsPageHeader } from "@/feature/admin/components/product/products-page-header";
import { ProductsPagination } from "@/feature/admin/components/product/products-pagination";
import { ProductsTable } from "@/feature/admin/components/product/products-table";
import { ProductsTableSkeleton } from "@/feature/admin/components/product/products-table-skeleton";
import type {
  ProductFormRow,
  ProductListRow,
} from "@/feature/admin/components/product/types";

const PAGE_SIZE = 20;

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
  const [editing, setEditing] = useState<ProductFormRow | null>(null);
  const [deleting, setDeleting] = useState<ProductListRow | null>(null);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const deleteMutation = trpc.admin.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted");
      setDeleting(null);
      const remaining = total - 1;
      const nextTotalPages = Math.max(1, Math.ceil(remaining / PAGE_SIZE));
      if (page > nextTotalPages) setPage(nextTotalPages);
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
      <ProductsPageHeader onCreate={openCreate} />

      {isLoading ? (
        <ProductsTableSkeleton />
      ) : total === 0 ? (
        <ProductsEmpty onCreate={openCreate} />
      ) : (
        <div>
          <ProductsTable
            products={products}
            onEdit={(product) => void openEdit(product)}
            onDelete={setDeleting}
          />
          <ProductsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ProductFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={editing}
        categoryOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <ProductDeleteDialog
        open={Boolean(deleting)}
        title={deleting?.title ?? null}
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
