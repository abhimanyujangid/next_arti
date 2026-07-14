"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";

import { trpc } from "@/lib/trpc/client";
import { useAppForm } from "@/hooks/use-app-form";
import {
  categoryFormOptions,
  categoryFormSchema,
  slugifyCategoryName,
} from "@/feature/admin/utils/category-schemas";
import { CategoryCoverField } from "@/feature/admin/components/category-cover-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  coverUrl: string | null;
};

export function CategoryFormSheet({
  open,
  onOpenChange,
  category,
  parentOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryRow | null;
  parentOptions: { id: string; name: string }[];
}) {
  const utils = trpc.useUtils();
  const slugManualRef = useRef(false);
  const isEdit = Boolean(category);

  const createMutation = trpc.admin.categories.create.useMutation({
    onSuccess: async () => {
      toast.success("Category created");
      await utils.admin.categories.list.invalidate();
      await utils.catalog.listCategories.invalidate();
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.admin.categories.update.useMutation({
    onSuccess: async () => {
      toast.success("Category updated");
      await utils.admin.categories.list.invalidate();
      await utils.catalog.listCategories.invalidate();
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useAppForm({
    ...categoryFormOptions,
    validators: {
      onSubmit: categoryFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        name: value.name,
        slug: value.slug,
        description: value.description || null,
        parentId: value.parentId || null,
        sortOrder: Number(value.sortOrder) || 0,
        coverUrl: value.coverUrl || null,
      };

      if (category) {
        await updateMutation.mutateAsync({ id: category.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  useEffect(() => {
    if (!open) return;
    slugManualRef.current = Boolean(category);
    form.reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      parentId: category?.parentId ?? "",
      sortOrder: String(category?.sortOrder ?? 0),
      coverUrl: category?.coverUrl ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when sheet opens / category changes
  }, [open, category]);

  const parents = parentOptions.filter((p) => p.id !== category?.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md"
      >
        <SheetHeader className="border-b border-[#e5e5e0] pb-4">
          <SheetTitle className="font-serif text-2xl">
            {isEdit ? "Edit category" : "New category"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update category details and cover image."
              : "Create a category used on the shop and homepage."}
          </SheetDescription>
        </SheetHeader>

        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className="flex flex-1 flex-col gap-6 py-6"
          >
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label="Name"
                    placeholder="Paintings"
                    onChange={(e) => {
                      if (!slugManualRef.current) {
                        form.setFieldValue(
                          "slug",
                          slugifyCategoryName(e.target.value),
                        );
                      }
                    }}
                  />
                )}
              </form.AppField>

              <form.AppField name="slug">
                {(field) => (
                  <field.TextField
                    label="Slug"
                    placeholder="paintings"
                    onChange={() => {
                      slugManualRef.current = true;
                    }}
                  />
                )}
              </form.AppField>


              <form.AppField name="description">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="min-h-20 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                      placeholder="Optional short description"
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="parentId">
                {(field) => (
                  <Field>
                    <FieldLabel className="eyebrow text-xs font-normal">
                      Parent category
                    </FieldLabel>
                    <Select
                      value={field.state.value || "none"}
                      onValueChange={(value) =>
                        field.handleChange(value === "none" ? "" : value)
                      }
                    >
                      <SelectTrigger className="rounded-none shadow-none">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {parents.map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="sortOrder">
                {(field) => (
                  <field.TextField label="Sort order" type="number" min={0} />
                )}
              </form.AppField>


              <form.AppField name="coverUrl">
                {(field) => (
                  <CategoryCoverField
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.AppField>
            </FieldGroup>

            <SheetFooter className="mt-auto flex-row gap-3 border-t border-[#e5e5e0] pt-4 sm:justify-stretch">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-none"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-none"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Create category"}
              </Button>
            </SheetFooter>
          </form>
        </form.AppForm>
      </SheetContent>
    </Sheet>
  );
}
