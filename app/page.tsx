import Link from "next/link";
import Image from "next/image";
import { HeroScene } from "@/components/three/HeroScene";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { featuredProducts, luxuryCategories } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-luxury-amber">Luxury Commerce</p>
            <h1 className="text-luxury-heading text-5xl font-semibold leading-tight md:text-7xl">
              <TextReveal text="Elevated Shopping Experience In Motion" />
            </h1>
            <p className="max-w-xl text-base text-white/75 md:text-lg">
              Immersive 3D storytelling, premium products, and pixel-perfect checkout flow.
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton className="rounded-xl bg-luxury-amber px-6 py-3 text-sm font-semibold text-black shadow-amber">
                <Link href="/products" className="block">
                  Explore Collection
                </Link>
              </MagneticButton>
              <Link
                href="/products"
                className="rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-luxury-amber hover:text-luxury-amber"
              >
                View Best Sellers
              </Link>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-4">
            <HeroScene />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Featured</p>
            <h2 className="text-luxury-heading text-3xl">Signature Products</h2>
          </div>
          <Link href="/products" className="text-sm text-white/70 hover:text-luxury-amber">
            View all
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-16 md:px-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Curated Categories</p>
          <h2 className="text-luxury-heading text-3xl">Crafted For Modern Taste</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {luxuryCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="glass-card group overflow-hidden rounded-2xl transition hover:border-luxury-amber/50"
            >
              <div className="relative h-44">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-luxury-heading text-2xl">{category.name}</h3>
                <p className="mt-2 text-sm text-white/70">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
