"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  slug: string;
  name: string;
  image: string;
  price: number;
};

export function ProductCard({ slug, name, image, price }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <motion.article whileHover={{ y: -6 }} className="glass-card rounded-2xl p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <h3 className="mt-4 text-lg text-white">{name}</h3>
        <p className="mt-2 text-sm text-luxury-amber">{formatCurrency(price)}</p>
      </motion.article>
    </Link>
  );
}
