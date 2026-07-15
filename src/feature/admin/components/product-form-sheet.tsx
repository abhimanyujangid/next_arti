"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";

import { trpc } from "@/lib/trpc/client";
import { useAppForm } from "@/hooks/use-app-form";
import {
  productFormOptions,
  productFormSchema,
  slugifyProductTitle,
} from "@/feature/admin/utils/product-schemas";
import { ProductImagesField } from "@/feature/admin/components/product-images-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

type ProductRow = {
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

export function ProductFormSheet({
  open,
  onOpenChange,
  product,
  categoryOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductRow | null;
  categoryOptions: { id: string; name: string }[];
}) {
  const utils = trpc.useUtils();
  const slugManualRef = useRef(false);
  const isEdit = Boolean(product);

  const createMutation = trpc.admin.products.create.useMutation({
    onSuccess: async () => {
      toast.success("Product created");
      await utils.admin.products.list.invalidate();
      await utils.catalog.listProducts.invalidate();
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.admin.products.update.useMutation({
    onSuccess: async () => {
      toast.success("Product updated");
      await utils.admin.products.list.invalidate();
      await utils.catalog.listProducts.invalidate();
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useAppForm({
    ...productFormOptions,
    validators: {
      onSubmit: productFormSchema,
    },
    onSubmit: async ({ value }) => {
      const weight =
        value.weightGrams.trim() === ""
          ? null
          : Number.parseInt(value.weightGrams, 10);
      const discounted =
        value.priceDiscounted.trim() === ""
          ? null
          : Number(value.priceDiscounted);

      const payload = {
        title: value.title,
        slug: value.slug,
        shortDesc: value.shortDesc || null,
        longDesc: value.longDesc || null,
        story: value.story || null,
        categoryId: value.categoryId || null,
        region: value.region || null,
        material: value.material || null,
        dimensions: value.dimensions || null,
        weightGrams: Number.isFinite(weight) ? weight : null,
        sku: value.sku || null,
        stock: Number(value.stock) || 0,
        priceOriginal: Number(value.priceOriginal),
        priceDiscounted: discounted,
        isAvailable: value.isAvailable,
        isFeatured: value.isFeatured,
        isBestSeller: value.isBestSeller,
        images: value.images.map((img, index) => ({
          url: img.url,
          alt: img.alt || null,
          sortOrder: img.sortOrder ?? index,
        })),
      };

      if (product) {
        await updateMutation.mutateAsync({ id: product.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  useEffect(() => {
    if (!open) return;
    slugManualRef.current = Boolean(product);
    form.reset({
      title: product?.title ?? "",
      slug: product?.slug ?? "",
      shortDesc: product?.shortDesc ?? "",
      longDesc: product?.longDesc ?? "",
      story: product?.story ?? "",
      categoryId: product?.categoryId ?? "",
      region: product?.region ?? "",
      material: product?.material ?? "",
      dimensions: product?.dimensions ?? "",
      weightGrams:
        product?.weightGrams != null ? String(product.weightGrams) : "",
      sku: product?.sku ?? "",
      stock: String(product?.stock ?? 0),
      priceOriginal:
        product?.priceOriginal != null ? String(product.priceOriginal) : "",
      priceDiscounted:
        product?.priceDiscounted != null
          ? String(product.priceDiscounted)
          : "",
      isAvailable: product?.isAvailable ?? true,
      isFeatured: product?.isFeatured ?? false,
      isBestSeller: product?.isBestSeller ?? false,
      images:
        product?.images.map((img, index) => ({
          url: img.url,
          alt: img.alt ?? "",
          sortOrder: img.sortOrder ?? index,
        })) ?? [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when sheet opens / product changes
  }, [open, product]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-xl"
      >
        <SheetHeader className="border-b border-[#e5e5e0] pb-4">
          <SheetTitle className="font-serif text-2xl">
            {isEdit ? "Edit product" : "New product"}
          </SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update product details, pricing, and gallery images."
              : "Create a product for the shop, homepage, and detail pages."}
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
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="Title"
                    placeholder="Goddess Saraswati Tanjore"
                    onChange={(e) => {
                      if (!slugManualRef.current) {
                        form.setFieldValue(
                          "slug",
                          slugifyProductTitle(e.target.value),
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
                    placeholder="goddess-saraswati-tanjore"
                    onChange={() => {
                      slugManualRef.current = true;
                    }}
                  />
                )}
              </form.AppField>

              <form.AppField name="categoryId">
                {(field) => (
                  <Field>
                    <FieldLabel className="eyebrow text-xs font-normal">
                      Category
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
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="shortDesc">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Short description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={2}
                      className="min-h-16 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="longDesc">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Long description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      className="min-h-24 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="story">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Story
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="min-h-20 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                    />
                  </Field>
                )}
              </form.AppField>

              <div className="grid grid-cols-2 gap-4">
                <form.AppField name="priceOriginal">
                  {(field) => (
                    <field.TextField label="Price (INR)" type="number" min={0} />
                  )}
                </form.AppField>
                <form.AppField name="priceDiscounted">
                  {(field) => (
                    <field.TextField
                      label="Discounted (optional)"
                      type="number"
                      min={0}
                    />
                  )}
                </form.AppField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.AppField name="stock">
                  {(field) => (
                    <field.TextField label="Stock" type="number" min={0} />
                  )}
                </form.AppField>
                <form.AppField name="sku">
                  {(field) => <field.TextField label="SKU" />}
                </form.AppField>
              </div>

              <form.AppField name="region">
                {(field) => <field.TextField label="Region" />}
              </form.AppField>

              <form.AppField name="material">
                {(field) => <field.TextField label="Material" />}
              </form.AppField>

              <div className="grid grid-cols-2 gap-4">
                <form.AppField name="dimensions">
                  {(field) => <field.TextField label="Dimensions" />}
                </form.AppField>
                <form.AppField name="weightGrams">
                  {(field) => (
                    <field.TextField label="Weight (g)" type="number" min={0} />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="isAvailable">
                {(field) => (
                  <Field
                    orientation="horizontal"
                    className="justify-between gap-4"
                  >
                    <FieldLabel className="eyebrow text-xs font-normal">
                      Available
                    </FieldLabel>
                    <Switch
                      className="shrink-0"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked)
                      }
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="isFeatured">
                {(field) => (
                  <Field
                    orientation="horizontal"
                    className="justify-between gap-4"
                  >
                    <FieldLabel className="eyebrow text-xs font-normal">
                      Featured on home
                    </FieldLabel>
                    <Switch
                      className="shrink-0"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked)
                      }
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="isBestSeller">
                {(field) => (
                  <Field
                    orientation="horizontal"
                    className="justify-between gap-4"
                  >
                    <FieldLabel className="eyebrow text-xs font-normal">
                      Best seller
                    </FieldLabel>
                    <Switch
                      className="shrink-0"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked)
                      }
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="images">
                {(field) => (
                  <ProductImagesField
                    value={field.state.value}
                    onChange={(images) => field.handleChange(images)}
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
                    : "Create product"}
              </Button>
            </SheetFooter>
          </form>
        </form.AppForm>
      </SheetContent>
    </Sheet>
  );
}
