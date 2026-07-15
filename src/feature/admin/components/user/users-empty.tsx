import { Users } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function UsersEmpty() {
  return (
    <Empty className="border border-dashed border-[#e5e5e0] bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users />
        </EmptyMedia>
        <EmptyTitle>No users yet</EmptyTitle>
        <EmptyDescription>
          Accounts will appear here after customers sign up.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
