"use client";

import type { ProductImage } from "@/feature/admin/components/product/types";

export function ProductGallery({
  title,
  images,
  activeIndex,
  onSelect,
}: {
  title: string;
  images: ProductImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const cover = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-[4/5] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.url}
            alt={cover.alt || title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#a3a39a]">
            No image
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onSelect(i)}
              className={
                "aspect-square overflow-hidden border bg-[#fafaf8] " +
                (i === activeIndex ? "border-[#1a1a1a]" : "border-[#e5e5e0]")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
