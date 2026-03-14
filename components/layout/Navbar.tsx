"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useUIStore } from "@/store/uiStore";

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="text-luxury-heading text-2xl text-luxury-amber">
          ShopNova
        </Link>
        <div className="flex items-center gap-6 text-sm text-white/80">
          <Link href="/products">Products</Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-luxury-amber transition hover:border-luxury-amber"
          >
            Cart
          </button>
          <Link href="/account">Account</Link>
        </div>
      </nav>
    </motion.header>
  );
}
