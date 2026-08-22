import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function isSameLine(item: CartItem, productId: string, variantId?: string): boolean {
  return item.productId === productId && item.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => isSameLine(i, item.productId, item.variantId));
          if (existing) {
            return {
              items: state.items.map((i) =>
                isSameLine(i, item.productId, item.variantId)
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({ items: state.items.filter((i) => !isSameLine(i, productId, variantId)) })),
      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            isSameLine(i, productId, variantId)
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'zumbii-cart' }
  )
);
