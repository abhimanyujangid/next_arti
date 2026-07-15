"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc/client";
import { useSyncedCart } from "@/feature/cart/hooks/use-synced-cart";
import { CheckoutAddressPanel } from "@/feature/checkout/components/checkout-address-panel";
import { CheckoutSummary } from "@/feature/checkout/components/checkout-summary";
import { openRazorpayCheckout } from "@/feature/checkout/lib/razorpay-client";
import type { AddressFormValues } from "@/feature/account/utils/address-schemas";

export function CheckoutView() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const cart = useSyncedCart();
  const utils = trpc.useUtils();

  const { data: addresses = [], isLoading: addressesLoading } =
    trpc.addresses.list.useQuery(undefined, { enabled: Boolean(user) });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [draftAddress, setDraftAddress] = useState<AddressFormValues | null>(
    null,
  );
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/auth?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user && cart.items.length === 0) {
      router.replace("/cart");
    }
  }, [authLoading, user, cart.items.length, router]);

  useEffect(() => {
    if (addresses.length === 0) {
      setUseNewAddress(true);
      return;
    }
    if (!selectedAddressId && !useNewAddress) {
      const preferred =
        addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null;
      setSelectedAddressId(preferred);
    }
  }, [addresses, selectedAddressId, useNewAddress]);

  const createPayment = trpc.orders.createPaymentOrder.useMutation();
  const verifyPayment = trpc.orders.verifyAndComplete.useMutation();

  const canPay =
    cart.items.length > 0 &&
    (useNewAddress ? Boolean(draftAddress) : Boolean(selectedAddressId));

  const handlePay = async () => {
    if (!user || !canPay) {
      toast.error(
        useNewAddress
          ? "Confirm your delivery address first."
          : "Select a shipping address.",
      );
      return;
    }

    setIsPaying(true);
    try {
      const payment = await createPayment.mutateAsync({
        items: cart.items.map((it) => ({
          productId: it.product_id,
          qty: it.qty,
        })),
        addressId: useNewAddress ? null : selectedAddressId,
      });

      await openRazorpayCheckout({
        key: payment.keyId,
        amount: payment.amountPaise,
        currency: payment.currency,
        name: "ArtiSun",
        description: `Order ${payment.orderNumber}`,
        order_id: payment.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#1a1a1a" },
        handler: async (response) => {
          try {
            const result = await verifyPayment.mutateAsync({
              orderId: payment.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              newAddress: useNewAddress ? draftAddress : null,
              addressId: useNewAddress ? null : selectedAddressId,
            });
            cart.clear();
            await utils.orders.myList.invalidate();
            await utils.addresses.list.invalidate();
            await utils.admin.orders.list.invalidate();
            toast.success(`Order ${result.orderNumber} placed`);
            router.push("/account/orders?placed=1");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Payment verification failed",
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            toast.message("Payment cancelled");
          },
        },
      });
    } catch (error) {
      setIsPaying(false);
      toast.error(
        error instanceof Error ? error.message : "Could not start payment",
      );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-24 text-center text-muted-foreground md:px-10">
        Loading checkout…
      </div>
    );
  }

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-12 md:px-10">
      <header className="mb-10">
        <div className="eyebrow">Checkout</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Complete your order
        </h1>
        <Link
          href="/cart"
          className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
        >
          ← Back to cart
        </Link>
      </header>

      <div className="grid items-start gap-14 lg:grid-cols-[1fr_360px]">
        <CheckoutAddressPanel
          addresses={addresses}
          isLoading={addressesLoading}
          selectedAddressId={selectedAddressId}
          useNewAddress={useNewAddress}
          draftAddress={draftAddress}
          onSelectSaved={(id) => {
            setSelectedAddressId(id);
            setUseNewAddress(false);
            setDraftAddress(null);
          }}
          onUseNew={() => {
            setUseNewAddress(true);
            setSelectedAddressId(null);
          }}
          onDraftReady={(data) => {
            setDraftAddress(data);
            setUseNewAddress(true);
            setSelectedAddressId(null);
            toast.success("Address ready for checkout");
          }}
        />
        <CheckoutSummary
          items={cart.items}
          subtotal={cart.subtotal}
          isPaying={isPaying}
          canPay={canPay}
          onPay={() => void handlePay()}
        />
      </div>
    </div>
  );
}
