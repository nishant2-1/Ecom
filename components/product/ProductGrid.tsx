"use client";

import { useLayoutEffect, useRef } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

type ProductGridProps = {
  products: Product[];
};

gsap.registerPlugin(ScrollTrigger);

export function ProductGrid({ products }: ProductGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".reveal-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%"
          }
        }
      );
    }, element);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="reveal-item">
          <ProductCard
            slug={product.slug}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        </div>
      ))}
    </div>
  );
}
