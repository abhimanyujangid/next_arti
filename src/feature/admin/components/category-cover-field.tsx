"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

export function CategoryCoverField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const getPresignedUrl = trpc.upload.getPresignedUrl.useMutation();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Use a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    setUploading(true);
    try {
      const { presignedUrl, publicUrl } = await getPresignedUrl.mutateAsync({
        filename: file.name,
        contentType: file.type as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif",
        folder: "categories",
      });

      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!putRes.ok) {
        throw new Error("Upload to storage failed");
      }

      onChange(publicUrl);
      toast.success("Cover uploaded");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload cover";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field>
      <FieldLabel className="eyebrow text-xs font-normal">Cover image</FieldLabel>
      {value ? (
        <div className="relative mt-2 overflow-hidden border border-[#e5e5e0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Category cover"
            className="aspect-[4/3] w-full object-cover"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-white/90"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            <X className="size-4" />
            Remove
          </Button>
        </div>
      ) : (
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[#e5e5e0] bg-[#fafaf8] px-4 py-10 text-center transition-colors hover:border-[#d4af37]">
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-[#707065]" />
          ) : (
            <ImagePlus className="size-6 text-[#707065]" />
          )}
          <span className="text-xs uppercase tracking-[0.18em] text-[#707065]">
            {uploading ? "Uploading…" : "Upload cover"}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </Field>
  );
}
