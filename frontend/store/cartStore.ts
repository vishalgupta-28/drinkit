import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
  pointsPreview: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...s.items, { product, qty: 1 }] };
        }),
      decrement: (productId) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.product.id === productId ? { ...i, qty: i.qty - 1 } : i,
            )
            .filter((i) => i.qty > 0),
        })),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      pointsPreview: () =>
        get().items.reduce((sum, i) => sum + i.product.points_earned * i.qty, 0),
    }),
    { name: "drinkit-cart", skipHydration: true },
  ),
);
