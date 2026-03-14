"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export function CartSyncBridge() {
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);

  const hydrated = useRef(false);
  const syncing = useRef(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok) {
          hydrated.current = true;
          return;
        }

        const data = (await response.json()) as { items?: typeof items };
        if (mounted && data.items) {
          syncing.current = true;
          setItems(data.items);
          window.setTimeout(() => {
            syncing.current = false;
          }, 10);
        }
      } finally {
        hydrated.current = true;
      }
    };

    void hydrate();

    return () => {
      mounted = false;
    };
  }, [setItems]);

  useEffect(() => {
    if (!hydrated.current || syncing.current) {
      return;
    }

    const controller = new AbortController();

    const sync = async () => {
      await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items }),
        signal: controller.signal
      });
    };

    void sync();

    return () => {
      controller.abort();
    };
  }, [items]);

  return null;
}
