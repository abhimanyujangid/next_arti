"use client";

import { useForm } from "react-hook-form";
import { AccountNav } from "@/feature/account/components/account-layout";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  pincode: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const [adding, setAdding] = useState(false);
  
  // In-memory mock addresses list
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      full_name: "Karan Malhotra",
      phone: "+91 98765 43210",
      pincode: "110001",
      line1: "Flat 402, Block C, Gulmohar Apartments",
      line2: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      is_default: true,
    },
  ]);

  const handleAdd = (newAddr: Omit<Address, "id">) => {
    const finalAddr: Address = {
      ...newAddr,
      id: `mock-addr-${Date.now()}`,
    };

    if (finalAddr.is_default) {
      setAddresses(addresses.map((a) => ({ ...a, is_default: false })).concat(finalAddr));
    } else {
      setAddresses([...addresses, finalAddr]);
    }
    setAdding(false);
    toast.success("Address saved");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this address?")) return;
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section className="text-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Addresses</div>
              <h1 className="mt-2 font-display text-4xl">Where should we ship?</h1>
            </div>
            <button
              onClick={() => setAdding(true)}
              className="text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 flex items-center gap-2 cursor-pointer hover:text-accent"
            >
              <Plus className="h-3 w-3" /> Add address
            </button>
          </div>

          {adding && (
            <div className="mt-8">
              <AddressForm onSave={handleAdd} onCancel={() => setAdding(false)} />
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {addresses.length === 0 && !adding && (
              <div className="col-span-full border border-border/60 p-10 text-center text-muted-foreground">
                No addresses yet.
              </div>
            )}
            {addresses.map((a) => (
              <div key={a.id} className="border border-border/60 p-6 text-sm">
                <div className="flex justify-between">
                  <div className="font-display text-lg">{a.full_name}</div>
                  {a.is_default && <span className="eyebrow text-accent">Default</span>}
                </div>
                <div className="mt-3 text-muted-foreground space-y-0.5">
                  <div>{a.line1}{a.line2 ? `, ${a.line2}` : ""}</div>
                  <div>{a.city}, {a.state} {a.pincode}</div>
                  <div>{a.country}</div>
                  <div>{a.phone}</div>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AddressForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<Address, "id">) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit } = useForm<Omit<Address, "id">>({
    defaultValues: { country: "India", is_default: false },
  });

  return (
    <form
      onSubmit={handleSubmit((v) => onSave(v))}
      className="border border-border/60 p-6 grid gap-4 md:grid-cols-2 text-sm bg-secondary/10"
    >
      <label className="md:col-span-2">
        <span className="eyebrow">Full name</span>
        <input
          required
          {...register("full_name")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label>
        <span className="eyebrow">Phone</span>
        <input
          required
          {...register("phone")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label>
        <span className="eyebrow">Pincode</span>
        <input
          required
          {...register("pincode")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label className="md:col-span-2">
        <span className="eyebrow">Address line 1</span>
        <input
          required
          {...register("line1")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label className="md:col-span-2">
        <span className="eyebrow">Address line 2 (optional)</span>
        <input
          {...register("line2")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label>
        <span className="eyebrow">City</span>
        <input
          required
          {...register("city")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label>
        <span className="eyebrow">State</span>
        <input
          required
          {...register("state")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label>
        <span className="eyebrow">Country</span>
        <input
          required
          {...register("country")}
          className="mt-1 w-full bg-transparent border-b border-foreground/30 py-2 focus:outline-none focus:border-accent"
        />
      </label>
      <label className="flex items-center gap-2 mt-4 cursor-pointer">
        <input type="checkbox" {...register("is_default")} />
        <span>Make default</span>
      </label>
      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-accent cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-accent cursor-pointer"
        >
          Save address
        </button>
      </div>
    </form>
  );
}
