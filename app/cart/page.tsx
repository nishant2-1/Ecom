import { CartClient } from "./CartClient";

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <h1 className="text-luxury-heading text-4xl">Cart</h1>
      <p className="mt-3 text-white/70">Review your products before secure checkout.</p>

      <div className="mt-8">
        <CartClient />
      </div>
    </section>
  );
}
