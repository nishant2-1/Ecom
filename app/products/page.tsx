import { ProductsClient } from "./ProductsClient";
import { catalogProducts } from "@/lib/mock-data";

export default function ProductsPage() {
  const prices = catalogProducts.map((product) => product.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const categoryCount = new Set(catalogProducts.map((product) => product.category)).size;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <h1 className="text-luxury-heading text-4xl">Products</h1>
      <p className="mt-3 text-white/70">
        Browse curated products with smooth filtering and price sorting.
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em]">
        <span className="rounded-full border border-white/20 px-3 py-1 text-white/70">
          {catalogProducts.length} products
        </span>
        <span className="rounded-full border border-white/20 px-3 py-1 text-white/70">
          {categoryCount} categories
        </span>
        <span className="rounded-full border border-luxury-amber/40 px-3 py-1 text-luxury-amber">
          INR {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
        </span>
      </div>

      <div className="mt-8">
        <ProductsClient products={catalogProducts} />
      </div>
    </section>
  );
}
