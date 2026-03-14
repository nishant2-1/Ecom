"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  image: string;
  price: number;
};

export function AddToCartButton({ productId, name, image, price }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId,
      name,
      image,
      price,
      quantity: 1
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="rounded-xl bg-luxury-amber px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
    >
      {added ? "Added" : "Add To Cart"}
    </button>
  );
}
