"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { useAppForm } from "@/hooks/use-app-form";
import {
  journalFormOptions,
  journalFormSchema,
  parseTagsInput,
  slugifyJournalTitle,
} from "@/feature/admin/utils/journal-schemas";
import { JournalCoverField } from "@/feature/admin/components/journal-cover-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export type JournalFormPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  coverUrl: string | null;
  authorName: string | null;
  tags: string[];
  isPublished: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function JournalForm({ post }: { post: JournalFormPost | null }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const slugManualRef = useRef(Boolean(post));
  const isEdit = Boolean(post);

  const createMutation = trpc.admin.journal.create.useMutation({
    onSuccess: async () => {
      toast.success("Journal post created");
      await utils.admin.journal.list.invalidate();
      await utils.journal.list.invalidate();
      router.push("/admin/journal");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = trpc.admin.journal.update.useMutation({
    onSuccess: async () => {
      toast.success("Journal post updated");
      await utils.admin.journal.list.invalidate();
      if (post) {
        await utils.admin.journal.getById.invalidate({ id: post.id });
      }
      await utils.journal.list.invalidate();
      router.push("/admin/journal");
    },
    onError: (error) => toast.error(error.message),
  });

  const form = useAppForm({
    ...journalFormOptions,
    validators: {
      onSubmit: journalFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        title: value.title,
        slug: value.slug,
        excerpt: value.excerpt || null,
        body: value.body,
        coverUrl: value.coverUrl || null,
        authorName: value.authorName || null,
        tags: parseTagsInput(value.tags),
        isPublished: value.isPublished,
        seoTitle: value.seoTitle || null,
        seoDescription: value.seoDescription || null,
      };

      if (post) {
        await updateMutation.mutateAsync({ id: post.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  useEffect(() => {
    slugManualRef.current = Boolean(post);
    form.reset({
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      coverUrl: post?.coverUrl ?? "",
      authorName: post?.authorName ?? "",
      tags: post?.tags?.join(", ") ?? "",
      isPublished: post?.isPublished ?? false,
      seoTitle: post?.seoTitle ?? "",
      seoDescription: post?.seoDescription ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when post identity changes
  }, [post?.id]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <Link
        href="/admin/journal"
        className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#707065] hover:text-[#1a1a1a]"
      >
        <ArrowLeft className="size-3.5" />
        Journal
      </Link>

      <div>
        <h1 className="font-serif text-3xl text-[#1a1a1a] md:text-4xl">
          {isEdit ? "Edit journal post" : "New journal post"}
        </h1>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          {isEdit
            ? "Update essay content, cover, and SEO fields."
            : "Write a new essay for The Journal. Drafts stay hidden until published."}
        </p>
      </div>

      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="flex flex-col gap-10"
        >
          <section className="space-y-6 border border-[#e5e5e0] bg-white p-6 md:p-8">
            <h2 className="font-serif text-xl text-[#1a1a1a]">Content</h2>
            <FieldGroup>
              <form.AppField name="title">
                {(field) => (
                  <field.TextField
                    label="Title"
                    placeholder="Chola Bronzes: The Poetry of Lost Wax"
                    onChange={(e) => {
                      if (!slugManualRef.current) {
                        form.setFieldValue(
                          "slug",
                          slugifyJournalTitle(e.target.value),
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
                    placeholder="chola-bronze-casting"
                    onChange={() => {
                      slugManualRef.current = true;
                    }}
                  />
                )}
              </form.AppField>

              <div className="grid gap-6 sm:grid-cols-2">
                <form.AppField name="authorName">
                  {(field) => (
                    <field.TextField label="Author" placeholder="Surya" />
                  )}
                </form.AppField>

                <form.AppField name="tags">
                  {(field) => (
                    <field.TextField
                      label="Tags (comma-separated)"
                      placeholder="Metalcraft, Heritage"
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="excerpt">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Excerpt
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="min-h-20 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                      placeholder="Short teaser shown on the journal list"
                    />
                  </Field>
                )}
              </form.AppField>

              <form.AppField name="body">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      Body
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={18}
                      className="min-h-72 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                      placeholder="Separate paragraphs with a blank line"
                    />
                  </Field>
                )}
              </form.AppField>
            </FieldGroup>
          </section>

          <section className="space-y-6 border border-[#e5e5e0] bg-white p-6 md:p-8">
            <h2 className="font-serif text-xl text-[#1a1a1a]">Cover &amp; publish</h2>
            <FieldGroup>
              <form.AppField name="coverUrl">
                {(field) => (
                  <JournalCoverField
                    value={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.AppField>

              <form.AppField name="isPublished">
                {(field) => (
                  <Field className="gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <FieldLabel className="eyebrow text-xs font-normal">
                        Published
                      </FieldLabel>
                      <Switch
                        className="shrink-0"
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                    </div>
                    <p className="text-xs text-[#707065]">
                      Turn this on for the post to appear on{" "}
                      <span className="text-[#1a1a1a]">/journal</span>. Drafts
                      stay admin-only.
                    </p>
                  </Field>
                )}
              </form.AppField>
            </FieldGroup>
          </section>

          <section className="space-y-6 border border-[#e5e5e0] bg-white p-6 md:p-8">
            <h2 className="font-serif text-xl text-[#1a1a1a]">SEO</h2>
            <FieldGroup>
              <form.AppField name="seoTitle">
                {(field) => (
                  <field.TextField
                    label="SEO title"
                    placeholder="Optional — defaults to post title"
                  />
                )}
              </form.AppField>

              <form.AppField name="seoDescription">
                {(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className="eyebrow text-xs font-normal"
                    >
                      SEO description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={3}
                      className="min-h-20 rounded-none border-[#e5e5e0] shadow-none focus-visible:ring-0"
                      placeholder="Optional — defaults to excerpt"
                    />
                  </Field>
                )}
              </form.AppField>
            </FieldGroup>
          </section>

          <div className="sticky bottom-0 z-10 -mx-1 flex flex-row gap-3 border-t border-[#e5e5e0] bg-[#fdfdfc]/95 px-1 py-4 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-none sm:flex-none sm:min-w-32"
              onClick={() => router.push("/admin/journal")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-none sm:flex-none sm:min-w-40"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create post"}
            </Button>
          </div>
        </form>
      </form.AppForm>
    </div>
  );
}
