"use client";

import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: (result) => {
      toast.success(
        result.alreadySubscribed
          ? "You're already on the list."
          : "Welcome. We'll write soon from the workshops.",
      );
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "Please enter a valid email.");
    },
  });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    subscribe.mutate({ email: trimmed });
  };

  return (
    <form onSubmit={handle} className="mt-8 flex max-w-sm gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        disabled={subscribe.isPending}
        className="flex-1 border-b border-foreground/40 bg-transparent px-1 py-2 text-sm focus:border-accent focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={subscribe.isPending || !email.trim()}
        className="text-xs uppercase tracking-[0.22em] text-foreground hover:text-accent disabled:opacity-50"
      >
        {subscribe.isPending ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
