"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addressFormSchema,
  type AddressFormValues,
} from "@/feature/account/utils/address-schemas";

export function AddressForm({
  onSave,
  onCancel,
  isPending,
}: {
  onSave: (data: AddressFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      country: "India",
      isDefault: false,
      line2: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSave(values))}
      className="grid gap-4 border border-border/60 bg-secondary/10 p-6 text-sm md:grid-cols-2"
    >
      <label className="md:col-span-2">
        <span className="eyebrow">Full name</span>
        <input
          {...register("fullName")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.fullName && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.fullName.message}
          </span>
        )}
      </label>
      <label>
        <span className="eyebrow">Phone</span>
        <input
          {...register("phone")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.phone && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.phone.message}
          </span>
        )}
      </label>
      <label>
        <span className="eyebrow">Pincode</span>
        <input
          {...register("pincode")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.pincode && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.pincode.message}
          </span>
        )}
      </label>
      <label className="md:col-span-2">
        <span className="eyebrow">Address line 1</span>
        <input
          {...register("line1")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.line1 && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.line1.message}
          </span>
        )}
      </label>
      <label className="md:col-span-2">
        <span className="eyebrow">Address line 2 (optional)</span>
        <input
          {...register("line2")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
      </label>
      <label>
        <span className="eyebrow">City</span>
        <input
          {...register("city")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.city && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.city.message}
          </span>
        )}
      </label>
      <label>
        <span className="eyebrow">State</span>
        <input
          {...register("state")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.state && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.state.message}
          </span>
        )}
      </label>
      <label>
        <span className="eyebrow">Country</span>
        <input
          {...register("country")}
          className="mt-1 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none"
        />
        {errors.country && (
          <span className="mt-1 block text-xs text-destructive">
            {errors.country.message}
          </span>
        )}
      </label>
      <label className="mt-4 flex cursor-pointer items-center gap-2">
        <input type="checkbox" {...register("isDefault")} />
        <span>Make default</span>
      </label>
      <div className="mt-4 flex justify-end gap-3 md:col-span-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="cursor-pointer text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-accent disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-accent disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}
