"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { HomeProduct } from "@/lib/mock-data";

type ProductsClientProps = {
  products: HomeProduct[];
};

type SortKey = "featured" | "price-low-high" | "price-high-low";

export function ProductsClient({ products }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const byCategory =
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    if (sortBy === "price-low-high") {
      return [...byCategory].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high-low") {
      return [...byCategory].sort((a, b) => b.price - a.price);
    }

    return byCategory;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      <div className="glass-card flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category: string) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition ${
                selectedCategory === category
                  ? "bg-luxury-amber text-black"
                  : "border border-white/20 text-white/80 hover:border-luxury-amber hover:text-luxury-amber"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <select
          className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          value={sortBy}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setSortBy(event.target.value as SortKey)
          }
        >
          <option value="featured">Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
