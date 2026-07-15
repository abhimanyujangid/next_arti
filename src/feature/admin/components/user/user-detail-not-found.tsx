"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function UserDetailNotFound() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl">
      <Empty className="border border-dashed border-[#e5e5e0] bg-white">
        <EmptyHeader>
          <EmptyTitle>User not found</EmptyTitle>
          <EmptyDescription>
            This account may have been removed.
          </EmptyDescription>
        </EmptyHeader>
        <Button
          className="mt-4 rounded-none"
          variant="outline"
          onClick={() => router.push("/admin/users")}
        >
          Back to users
        </Button>
      </Empty>
    </div>
  );
}
