import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-luxury-amber">404</p>
      <h1 className="mt-3 text-luxury-heading text-5xl">Product Not Found</h1>
      <p className="mt-3 text-white/70">The item you are looking for is unavailable or moved.</p>
      <Link
        href="/products"
        className="mt-8 rounded-xl border border-luxury-amber px-6 py-3 text-sm font-semibold text-luxury-amber transition hover:bg-luxury-amber hover:text-black"
      >
        Back To Products
      </Link>
    </section>
  );
}
