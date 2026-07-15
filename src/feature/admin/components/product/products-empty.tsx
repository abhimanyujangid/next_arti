import { Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ProductsEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <Empty className="border border-dashed border-[#e5e5e0] bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package />
        </EmptyMedia>
        <EmptyTitle>No products yet</EmptyTitle>
        <EmptyDescription>
          Create the first product to populate shop, homepage, and detail pages.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onCreate} className="rounded-none">
          <Plus className="size-4" />
          New product
        </Button>
      </EmptyContent>
    </Empty>
  );
}
