"use client";

import { AddressForm } from "@/feature/account/components/address-form";
import type { AddressFormValues } from "@/feature/account/utils/address-schemas";
import type { AddressRow } from "@/feature/account/utils/address-schemas";
import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutAddressPanel({
  addresses,
  isLoading,
  selectedAddressId,
  useNewAddress,
  draftAddress,
  onSelectSaved,
  onUseNew,
  onDraftReady,
}: {
  addresses: AddressRow[];
  isLoading: boolean;
  selectedAddressId: string | null;
  useNewAddress: boolean;
  draftAddress: AddressFormValues | null;
  onSelectSaved: (id: string) => void;
  onUseNew: () => void;
  onDraftReady: (data: AddressFormValues) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Shipping</div>
        <h2 className="mt-2 font-display text-3xl">Delivery address</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-none" />
          <Skeleton className="h-24 w-full rounded-none" />
        </div>
      ) : (
        <>
          {addresses.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Saved addresses
              </div>
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelectSaved(addr.id)}
                  className={
                    "w-full border p-4 text-left text-sm transition-colors " +
                    (!useNewAddress && selectedAddressId === addr.id
                      ? "border-foreground bg-secondary/20"
                      : "border-border/60 hover:border-foreground/40")
                  }
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-display text-lg">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="eyebrow text-accent">Default</span>
                    )}
                  </div>
                  <div className="mt-2 text-muted-foreground">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                    <br />
                    {addr.phone}
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={onUseNew}
                className={
                  "w-full border border-dashed px-4 py-3 text-xs uppercase tracking-[0.18em] " +
                  (useNewAddress
                    ? "border-foreground text-foreground"
                    : "border-border/60 text-muted-foreground hover:border-foreground/40")
                }
              >
                Ship to a new address
              </button>
            </div>
          )}

          {(useNewAddress || addresses.length === 0) && (
            <div>
              {addresses.length > 0 && (
                <div className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  New address
                </div>
              )}
              <AddressForm
                submitLabel={
                  draftAddress ? "Address ready · update" : "Use this address"
                }
                hideCancel
                onSave={onDraftReady}
              />
              {draftAddress && (
                <p className="mt-3 text-xs text-accent">
                  New address will be saved after successful payment.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
