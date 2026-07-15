import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductsPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Products</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Manage catalog pieces, multi-image galleries, and home flags.
        </p>
      </div>
      <Button onClick={onCreate} className="rounded-none">
        <Plus className="size-4" />
        New product
      </Button>
    </div>
  );
}
