import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const productImageFormSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sortOrder: z.number().int().min(0),
});

export const productFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens.",
    ),
  shortDesc: z.string(),
  longDesc: z.string(),
  story: z.string(),
  categoryId: z.string(),
  region: z.string(),
  material: z.string(),
  dimensions: z.string(),
  weightGrams: z.string(),
  sku: z.string(),
  stock: z.string().regex(/^\d+$/, "Stock must be a number."),
  priceOriginal: z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?$/, "Enter a valid price."),
  priceDiscounted: z.string(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  images: z
    .array(productImageFormSchema)
    .min(1, "Add at least one image."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

const productFormDefaultValues: ProductFormValues = {
  title: "",
  slug: "",
  shortDesc: "",
  longDesc: "",
  story: "",
  categoryId: "",
  region: "",
  material: "",
  dimensions: "",
  weightGrams: "",
  sku: "",
  stock: "0",
  priceOriginal: "",
  priceDiscounted: "",
  isAvailable: true,
  isFeatured: false,
  isBestSeller: false,
  images: [],
};

export const productFormOptions = formOptions({
  defaultValues: productFormDefaultValues,
});

export function slugifyProductTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
