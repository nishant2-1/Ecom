"use client";

import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export function CartDrawerContent() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-luxury-heading text-2xl">Your Cart</h2>
        <button
          type="button"
          onClick={() => setCartOpen(false)}
          className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70"
        >
          Close
        </button>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-white/60">No items yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="rounded-xl border border-white/10 p-3">
              <p className="text-sm text-white">{item.name}</p>
              <p className="mt-1 text-xs text-white/60">Qty: {item.quantity}</p>
              <p className="mt-1 text-sm text-luxury-amber">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between text-sm text-white/80">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Link
          href="/cart"
          onClick={() => setCartOpen(false)}
          className="inline-flex w-full justify-center rounded-xl bg-luxury-amber px-5 py-3 text-sm font-semibold text-black"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
