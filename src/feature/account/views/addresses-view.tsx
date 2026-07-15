"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { AccountNav } from "@/feature/account/components/account-layout";
import { AddressCard } from "@/feature/account/components/address-card";
import { AddressForm } from "@/feature/account/components/address-form";
import type { AddressFormValues } from "@/feature/account/utils/address-schemas";
import { Skeleton } from "@/components/ui/skeleton";

export function AddressesView() {
  const utils = trpc.useUtils();
  const { data: addresses = [], isLoading } = trpc.addresses.list.useQuery();
  const [adding, setAdding] = useState(false);

  const createMutation = trpc.addresses.create.useMutation({
    onSuccess: async () => {
      toast.success("Address saved");
      setAdding(false);
      await utils.addresses.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const softDeleteMutation = trpc.addresses.softDelete.useMutation({
    onSuccess: async () => {
      toast.success("Address deleted");
      await utils.addresses.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const setDefaultMutation = trpc.addresses.setDefault.useMutation({
    onSuccess: async () => {
      toast.success("Default address updated");
      await utils.addresses.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleAdd = (data: AddressFormValues) => {
    createMutation.mutate({
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country || "India",
      isDefault: data.isDefault,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this address?")) return;
    softDeleteMutation.mutate({ id });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section className="text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Addresses</div>
              <h1 className="mt-2 font-display text-4xl">
                Where should we ship?
              </h1>
            </div>
            {!adding && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex cursor-pointer items-center gap-2 border-b border-accent pb-1 text-xs uppercase tracking-[0.22em] hover:text-accent"
              >
                <Plus className="h-3 w-3" /> Add address
              </button>
            )}
          </div>

          {adding && (
            <div className="mt-8">
              <AddressForm
                onSave={handleAdd}
                onCancel={() => setAdding(false)}
                isPending={createMutation.isPending}
              />
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {isLoading ? (
              <>
                <Skeleton className="h-40 w-full rounded-none" />
                <Skeleton className="h-40 w-full rounded-none" />
              </>
            ) : addresses.length === 0 && !adding ? (
              <div className="col-span-full border border-border/60 p-10 text-center text-muted-foreground">
                No addresses yet.
              </div>
            ) : (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onDelete={handleDelete}
                  onSetDefault={(id) => setDefaultMutation.mutate({ id })}
                  isDeleting={softDeleteMutation.isPending}
                  isSettingDefault={setDefaultMutation.isPending}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
