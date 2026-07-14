"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { ProfileForm } from "../components/profile-form";
import { useAuth } from "@/hooks/use-auth";

import type { AppRouter } from "@/lib/trpc/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProfileData = RouterOutputs["user"]["getProfile"];

export function UserAccountView({ initialData }: { initialData?: ProfileData }) {
  const { user, signOut } = useAuth();

  // Hydrated from server
  const { data: profile } = trpc.user.getProfile.useQuery(undefined, {
    initialData,
  });

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-display text-4xl">My Account</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and preferences.</p>
        </div>
        <button
          onClick={() => signOut()}
          className="text-xs uppercase tracking-[0.24em] underline decoration-accent underline-offset-4 cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-8">
          <ProfileForm />
        </div>

        <aside className="space-y-6">
          <div className="border border-border p-6 bg-accent/5">
            <h3 className="eyebrow mb-4">Account Overview</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Orders</span>
                <span>{profile?._count?.orders || 0}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Wishlist</span>
                <span>{profile?._count?.wishlists || 0}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
