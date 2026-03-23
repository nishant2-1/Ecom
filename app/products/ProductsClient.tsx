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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const byCategory =
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    const byQuery =
      normalizedQuery.length === 0
        ? byCategory
        : byCategory.filter((product) => {
            const searchable =
              `${product.name} ${product.description} ${product.category}`.toLowerCase();
            return searchable.includes(normalizedQuery);
          });

    if (sortBy === "price-low-high") {
      return [...byQuery].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high-low") {
      return [...byQuery].sort((a, b) => b.price - a.price);
    }

    return byQuery;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "all" || sortBy !== "featured" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("featured");
    setSearchQuery("");
  };

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

      <div className="glass-card flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full max-w-xl items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white/80">
          <span className="text-xs uppercase tracking-[0.15em] text-luxury-amber">Search</span>
          <input
            value={searchQuery}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
            placeholder="Name, description, category..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            type="search"
          />
        </label>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em]">
          <span className="rounded-full border border-luxury-amber/40 px-3 py-1 text-luxury-amber">
            {filteredProducts.length} results
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/25 px-3 py-1 text-white/80 transition hover:border-luxury-amber hover:text-luxury-amber"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-luxury-amber">
            No matching products
          </p>
          <p className="mt-2 text-sm text-white/70">
            Try a different keyword, category, or reset filters to view the full collection.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-sm text-white/85 transition hover:border-luxury-amber hover:text-luxury-amber"
          >
            Show all products
          </button>
        </div>
      ) : null}

      {filteredProducts.length > 0 ? <ProductGrid products={filteredProducts} /> : null}
    </div>
  );
}
