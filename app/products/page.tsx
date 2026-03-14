import { ProductsClient } from "./ProductsClient";
import { catalogProducts } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <h1 className="text-luxury-heading text-4xl">Products</h1>
      <p className="mt-3 text-white/70">
        Browse curated products with smooth filtering and price sorting.
      </p>

      <div className="mt-8">
        <ProductsClient products={catalogProducts} />
      </div>
    </section>
  );
}
