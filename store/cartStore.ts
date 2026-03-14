"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items: CartItem[]) => set({ items }),
      addItem: (item: CartItem) =>
        set((state: CartState) => {
          const existing = state.items.find((cartItem) => cartItem.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.productId === item.productId
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              )
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item) => item.productId !== productId)
        })),
      setQuantity: (productId: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }),
    {
      name: "shopnova-cart"
    }
  )
);
