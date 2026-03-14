"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { useUIStore } from "@/store/uiStore";

type CartDrawerProps = {
  children: ReactNode;
};

export function CartDrawer({ children }: CartDrawerProps) {
  const cartOpen = useUIStore((state) => state.cartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            key="overlay"
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            key="drawer"
            className="glass-card fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/20 p-5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {children}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
