"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userInitials } from "@/feature/admin/components/user/utils";
import type { UserProfile, UserRole } from "@/feature/admin/components/user/types";

export function UserHeader({
  user,
  isSelf,
  isUpdatingRole,
  onRoleSelect,
}: {
  user: UserProfile;
  isSelf: boolean;
  isUpdatingRole: boolean;
  onRoleSelect: (role: UserRole) => void;
}) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-5">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden border border-[#e5e5e0] bg-[#fafaf8] text-lg font-medium text-[#4a4a40]">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" className="size-full object-cover" />
          ) : (
            userInitials(user.name)
          )}
        </div>
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a] md:text-4xl">
            {user.name}
          </h1>
          <div className="mt-2 text-sm text-[#707065]">{user.email}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em]">
            <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#4a4a40]">
              {user.role}
            </span>
            <span
              className={
                user.emailVerified
                  ? "border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800"
                  : "border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800"
              }
            >
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
            <span className="border border-[#e5e5e0] bg-[#fafaf8] px-2 py-1 text-[#707065]">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-w-[200px] flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#707065]">
          Role
        </div>
        <Select
          value={user.role}
          disabled={isSelf || isUpdatingRole}
          onValueChange={(value) => {
            if (value === user.role) return;
            if (value !== "user" && value !== "admin") return;
            onRoleSelect(value);
          }}
        >
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="user">user</SelectItem>
            <SelectItem value="admin">admin</SelectItem>
          </SelectContent>
        </Select>
        {isSelf && (
          <p className="text-xs text-[#707065]">
            You cannot change your own role.
          </p>
        )}
      </div>
    </section>
  );
}
