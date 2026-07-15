import { formOptions } from "@tanstack/react-form";
import { z } from "zod";

export const journalFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens.",
    ),
  excerpt: z.string(),
  body: z.string(),
  coverUrl: z.string(),
  authorName: z.string(),
  tags: z.string(),
  isPublished: z.boolean(),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export type JournalFormValues = z.infer<typeof journalFormSchema>;

const journalFormDefaultValues: JournalFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverUrl: "",
  authorName: "",
  tags: "",
  isPublished: false,
  seoTitle: "",
  seoDescription: "",
};

export const journalFormOptions = formOptions({
  defaultValues: journalFormDefaultValues,
});

export function slugifyJournalTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTagsInput(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
