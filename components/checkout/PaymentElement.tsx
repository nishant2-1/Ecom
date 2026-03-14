"use client";

import { PaymentElement as StripePaymentElement } from "@stripe/react-stripe-js";

export function PaymentElement() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <StripePaymentElement />
    </div>
  );
}
