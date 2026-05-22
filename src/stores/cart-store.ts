import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MaterialType, FinishOption, PrintType } from '@/types/database';

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  designId?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  dimensions: { length: number; width: number; depth: number };
  material: MaterialType;
  finish: FinishOption;
  printType: PrintType;
  isSample: boolean;
  thumbnailUrl?: string;
}

export interface CartState {
  items: CartItem[];
  walletCreditsToApply: number;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setWalletCredits: (amount: number) => void;

  getSubtotal: () => number;
  getTotalItems: () => number;
  getCarbonOffset: () => number;
  getTreesPlanted: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      walletCreditsToApply: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              i.designId === item.designId &&
              !i.isSample
          );
          if (existing && !item.isSample) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      subtotal: (i.quantity + item.quantity) * i.unitPrice,
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity, subtotal: quantity * i.unitPrice }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], walletCreditsToApply: 0 }),

      setWalletCredits: (amount) => set({ walletCreditsToApply: amount }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.subtotal, 0),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getCarbonOffset: () => get().getTotalItems() * 0.02,

      getTreesPlanted: () => Math.floor(get().getTotalItems() / 100),
    }),
    {
      name: 'packcraft-cart',
    }
  )
);
