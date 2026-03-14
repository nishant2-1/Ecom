"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="glass-card rounded-3xl p-10"
      >
        <CheckCircle2 className="mx-auto h-16 w-16 text-luxury-amber" />
        <h1 className="mt-4 text-luxury-heading text-4xl">Payment Successful</h1>
        <p className="mt-3 text-white/75">
          Your order is confirmed. We have emailed your receipt and order summary.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/account"
            className="rounded-xl bg-luxury-amber px-6 py-3 text-sm font-semibold text-black"
          >
            View Account
          </Link>
          <Link
            href="/products"
            className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
