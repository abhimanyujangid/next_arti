import Link from "next/link";

import { userInitials } from "@/feature/admin/components/user/utils";
import type { UserListRow } from "@/feature/admin/components/user/types";

const ROW_GRID =
  "grid min-w-[720px] grid-cols-[48px_1fr_80px_80px_80px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0";

export function UsersTable({ users }: { users: UserListRow[] }) {
  return (
    <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
      <div className="grid min-w-[720px] grid-cols-[48px_1fr_80px_80px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
        <span />
        <span>User</span>
        <span>Role</span>
        <span>Orders</span>
        <span>Reviews</span>
        <span>Joined</span>
      </div>

      {users.map((user) => (
        <Link
          key={user.id}
          href={`/admin/users/${user.id}`}
          className={`${ROW_GRID} transition-colors hover:bg-[#fafaf8]`}
        >
          <div className="flex size-10 items-center justify-center overflow-hidden border border-[#e5e5e0] bg-[#fafaf8] text-xs font-medium text-[#4a4a40]">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              userInitials(user.name)
            )}
          </div>

          <div className="min-w-0">
            <div className="truncate font-medium text-[#1a1a1a]">{user.name}</div>
            <div className="truncate text-xs text-[#707065]">
              {user.email}
              {!user.emailVerified ? " · Unverified" : ""}
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.14em] text-[#4a4a40]">
            {user.role}
          </div>
          <div className="text-sm text-[#4a4a40]">{user._count.orders}</div>
          <div className="text-sm text-[#4a4a40]">
            {user._count.productReviews}
          </div>
          <div className="text-sm text-[#707065]">
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </Link>
      ))}
    </div>
  );
}
