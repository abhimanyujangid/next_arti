"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function ProductDetailNotFound() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl">
      <Empty className="border border-dashed border-[#e5e5e0] bg-white">
        <EmptyHeader>
          <EmptyTitle>Product not found</EmptyTitle>
          <EmptyDescription>
            This product may have been deleted.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          className="mt-4 rounded-none"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Back to products
        </Button>
      </Empty>
    </div>
  );
}
