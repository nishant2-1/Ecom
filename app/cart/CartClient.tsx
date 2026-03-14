"use client";

import Link from "next/link";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cartStore";

export function CartClient() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <h2 className="text-luxury-heading text-3xl">Your cart is empty</h2>
        <p className="mt-3 text-white/70">Start exploring luxury picks and add your first item.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl border border-luxury-amber px-6 py-3 text-sm font-semibold text-luxury-amber transition hover:bg-luxury-amber hover:text-black"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-luxury-heading text-2xl">Items</h2>
          <button type="button" onClick={clear} className="text-xs uppercase tracking-[0.2em] text-red-300">
            Clear cart
          </button>
        </div>

        {items.map((item) => (
          <CartItem
            key={item.productId}
            productId={item.productId}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="space-y-4">
        <CartSummary subtotal={subtotal} />
        <Link
          href="/checkout"
          className="inline-flex w-full justify-center rounded-xl bg-luxury-amber px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
