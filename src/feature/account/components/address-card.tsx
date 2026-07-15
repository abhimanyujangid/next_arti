"use client";

import { Trash2 } from "lucide-react";

import type { AddressRow } from "@/feature/account/utils/address-schemas";

export function AddressCard({
  address,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: {
  address: AddressRow;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}) {
  return (
    <div className="border border-border/60 p-6 text-sm">
      <div className="flex justify-between gap-3">
        <div className="font-display text-lg">{address.fullName}</div>
        {address.isDefault && (
          <span className="eyebrow text-accent">Default</span>
        )}
      </div>
      <div className="mt-3 space-y-0.5 text-muted-foreground">
        <div>
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}
        </div>
        <div>
          {address.city}, {address.state} {address.pincode}
        </div>
        <div>{address.country}</div>
        <div>{address.phone}</div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {!address.isDefault && (
          <button
            type="button"
            disabled={isSettingDefault}
            onClick={() => onSetDefault(address.id)}
            className="cursor-pointer text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent disabled:opacity-50"
          >
            Make default
          </button>
        )}
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(address.id)}
          className="flex cursor-pointer items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" /> Delete
        </button>
      </div>
    </div>
  );
}
