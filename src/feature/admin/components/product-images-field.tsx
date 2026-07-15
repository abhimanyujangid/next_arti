"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

export type ProductImageValue = {
  url: string;
  alt: string;
  sortOrder: number;
};

export function ProductImagesField({
  value,
  onChange,
}: {
  value: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

  const reorder = (next: ProductImageValue[]) => {
    onChange(next.map((img, index) => ({ ...img, sortOrder: index })));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploaded: ProductImageValue[] = [];

      for (const file of Array.from(files)) {
        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
          toast.error(`${file.name}: use JPEG, PNG, WebP, or GIF.`);
          continue;
        }

        const { presignedUrl, publicUrl } = await getPresignedUrl.mutateAsync({
          filename: file.name,
          contentType: file.type as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/gif",
          folder: "products",
        });

        const putRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!putRes.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        uploaded.push({
          url: publicUrl,
          alt: "",
          sortOrder: value.length + uploaded.length,
        });
      }

      if (uploaded.length) {
        reorder([...value, ...uploaded]);
        toast.success(
          uploaded.length === 1
            ? "Image uploaded"
            : `${uploaded.length} images uploaded`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload images";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    reorder(next);
  };

  const remove = (index: number) => {
    reorder(value.filter((_, i) => i !== index));
  };

  const setAlt = (index: number, alt: string) => {
    onChange(
      value.map((img, i) => (i === index ? { ...img, alt } : img)),
    );
  };

  return (
    <Field>
      <FieldLabel className="eyebrow text-xs font-normal">
        Product images
      </FieldLabel>
      <p className="mt-1 text-xs text-[#707065]">
        First image is the card cover. Upload one or more; reorder as needed.
      </p>

      {value.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {value.map((img, index) => (
            <li
              key={`${img.url}-${index}`}
              className="flex gap-3 border border-[#e5e5e0] bg-[#fafaf8] p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || "Product"}
                className="size-20 shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => setAlt(index, e.target.value)}
                  placeholder="Alt text (optional)"
                  className="w-full border border-[#e5e5e0] bg-white px-2 py-1.5 text-sm shadow-none outline-none focus:border-[#d4af37]"
                />
                <div className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-none"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || uploading}
                    aria-label="Move up"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-none"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1 || uploading}
                    aria-label="Move down"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-none text-destructive"
                    onClick={() => remove(index)}
                    disabled={uploading}
                    aria-label="Remove image"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#e5e5e0] bg-[#fafaf8] px-4 py-8 text-center transition-colors hover:border-[#d4af37]">
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-[#707065]" />
        ) : (
          <ImagePlus className="size-6 text-[#707065]" />
        )}
        <span className="text-xs uppercase tracking-[0.18em] text-[#707065]">
          {uploading ? "Uploading…" : "Add images"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
    </Field>
  );
}
