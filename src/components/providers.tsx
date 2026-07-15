"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { trpc } from "@/lib/trpc/client";
import { AuthProvider } from "@/hooks/use-auth";
import { CartWishlistSync } from "@/feature/cart/hooks/use-cart-wishlist-sync";

export function Providers({
  children,
  initialUser = null,
  initialSession = null,
}: {
  children: React.ReactNode;
  initialUser?: any;
  initialSession?: any;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <AuthProvider initialUser={initialUser} initialSession={initialSession}>
            <CartWishlistSync />
            {children}
          </AuthProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
