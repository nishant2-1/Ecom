"use client";

import { useMemo, useState } from "react";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PaymentElement } from "@/components/checkout/PaymentElement";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

type AddressValues = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY ?? "";

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type EmbeddedPaymentProps = {
  onSuccess: () => void;
};

function EmbeddedPaymentForm({ onSuccess }: EmbeddedPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) {
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      },
      redirect: "if_required"
    });

    setSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Payment failed");
      return;
    }

    onSuccess();
    window.location.href = "/checkout/success";
  };

  return (
    <div className="space-y-3">
      <PaymentElement />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || submitting}
        className="w-full rounded-xl bg-luxury-amber px-6 py-3 text-sm font-semibold text-black"
      >
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export function CheckoutClient() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal());

  const [address, setAddress] = useState<AddressValues | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    const shipping = subtotal > 10000 ? 0 : 199;
    const total = subtotal + shipping;
    return { shipping, total };
  }, [subtotal]);

  const onAddressSubmit = async (values: AddressValues) => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setAddress(values);
    setLoadingIntent(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items, address: values })
      });

      const data = (await response.json()) as { clientSecret?: string; error?: string };

      if (!response.ok || !data.clientSecret) {
        setError(data.error ?? "Could not initialize payment intent");
        return;
      }

      setClientSecret(data.clientSecret);
    } catch {
      setError("Something went wrong while starting payment.");
    } finally {
      setLoadingIntent(false);
    }
  };

  const startHostedCheckout = async () => {
    if (!address) {
      setError("Add shipping address first");
      return;
    }

    const response = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items, address })
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      setError(data.error ?? "Unable to open hosted checkout");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-luxury-heading text-2xl">Shipping Address</h2>
          <p className="mt-1 text-sm text-white/70">Enter delivery details before payment.</p>
          <div className="mt-4">
            <CheckoutForm onSubmit={onAddressSubmit} />
          </div>
        </div>

        {loadingIntent ? <p className="text-sm text-white/70">Preparing secure payment...</p> : null}

        {clientSecret && stripePromise ? (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-luxury-heading text-xl">Embedded Checkout</h3>
            <p className="mt-1 text-sm text-white/70">Pay directly without leaving ShopNova.</p>
            <div className="mt-4">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
                <EmbeddedPaymentForm onSuccess={clear} />
              </Elements>
            </div>
          </div>
        ) : null}

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-luxury-heading text-xl">Stripe Hosted Checkout</h3>
          <p className="mt-1 text-sm text-white/70">Prefer hosted checkout? Use Stripe secure page.</p>
          <button
            type="button"
            onClick={startHostedCheckout}
            className="mt-4 rounded-xl border border-luxury-amber px-6 py-3 text-sm font-semibold text-luxury-amber"
          >
            Open Hosted Checkout
          </button>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </div>

      <aside className="glass-card h-fit rounded-2xl p-5">
        <h3 className="text-luxury-heading text-2xl">Order Summary</h3>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-white/80">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-white/10 pt-4 text-sm text-white/80">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(summary.shipping)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-base text-luxury-amber">
            <span>Total</span>
            <span>{formatCurrency(summary.total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
