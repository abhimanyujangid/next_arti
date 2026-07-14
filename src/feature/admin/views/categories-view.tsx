"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { CategoryFormSheet } from "@/feature/admin/components/category-form-sheet";
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

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  coverUrl: string | null;
  parent: { id: string; name: string; slug: string } | null;
  _count: { products: number; children: number };
};

export function CategoriesView() {
  const utils = trpc.useUtils();
  const { data: categories = [], isLoading } =
    trpc.admin.categories.list.useQuery();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [deleting, setDeleting] = useState<CategoryRow | null>(null);

  const deleteMutation = trpc.admin.categories.delete.useMutation({
    onSuccess: async () => {
      toast.success("Category deleted");
      setDeleting(null);
      await utils.admin.categories.list.invalidate();
      await utils.catalog.listCategories.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (category: CategoryRow) => {
    setEditing(category);
    setSheetOpen(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#1a1a1a]">Categories</h2>
          <p className="mt-2 text-sm tracking-wide text-[#707065]">
            Manage shop categories and cover images stored on R2.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-none">
          <Plus className="size-4" />
          New category
        </Button>
      </div>

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[72px_1fr_120px_100px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Cover</span>
            <span>Name</span>
            <span>Sort</span>
            <span>Products</span>
            <span className="text-right">Actions</span>
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[72px_1fr_120px_100px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-[56px] rounded-none" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/2 rounded-none" />
              </div>
              <Skeleton className="h-4 w-8 rounded-none" />
              <Skeleton className="h-4 w-8 rounded-none" />
              <div className="flex justify-end gap-1">
                <Skeleton className="size-8 rounded-none" />
                <Skeleton className="size-8 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Tags />
            </EmptyMedia>
            <EmptyTitle>No categories yet</EmptyTitle>
            <EmptyDescription>
              Create the first category to sync the shop and homepage.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={openCreate} className="rounded-none">
              <Plus className="size-4" />
              New category
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[72px_1fr_120px_100px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Cover</span>
            <span>Name</span>
            <span>Sort</span>
            <span>Products</span>
            <span className="text-right">Actions</span>
          </div>

          {categories.map((category) => (
            <div
              key={category.id}
              className="grid grid-cols-[72px_1fr_120px_100px_140px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <div className="size-[56px] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
                {category.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.coverUrl}
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
                  {category.name}
                </div>
                <div className="truncate text-xs text-[#707065]">
                  /{category.slug}
                  {category.parent ? ` · under ${category.parent.name}` : ""}
                </div>
              </div>

              <div className="text-sm text-[#4a4a40]">{category.sortOrder}</div>
              <div className="text-sm text-[#4a4a40]">
                {category._count.products}
              </div>

              <div className="flex justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => openEdit(category)}
                  aria-label={`Edit ${category.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none text-destructive hover:text-destructive"
                  onClick={() => setDeleting(category)}
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        category={editing}
        parentOptions={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `This will permanently delete “${deleting.name}”. Categories with products or children cannot be deleted.`
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
