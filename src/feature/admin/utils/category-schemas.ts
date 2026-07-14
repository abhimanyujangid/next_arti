import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens.",
    ),
  description: z.string(),
  parentId: z.string(),
  sortOrder: z.string().regex(/^\d+$/, "Sort order must be a number."),
  coverUrl: z.string(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormOptions = formOptions({
  defaultValues: {
    name: "",
    slug: "",
    description: "",
    parentId: "",
    sortOrder: "0",
    coverUrl: "",
  } satisfies CategoryFormValues,
});

export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
