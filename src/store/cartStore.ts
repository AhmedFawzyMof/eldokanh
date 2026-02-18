import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
  quantity: number;
  image: string;
}

type DiscountType = "percentage" | "fixed";

interface PromoCode {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

interface CartState {
  cart: CartItem[];
  promoCode: PromoCode | null;

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;

  applyPromoCode: (promo: PromoCode) => void;
  removePromoCode: () => void;

  getQuantity: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;

  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      promoCode: null,

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);

          const increment = item.type === "unit" ? 1 : 0.25;
          const newQty = (quantity: number) => {
            if (item.type === "unit") {
              return quantity + increment;
            }

            return parseFloat((quantity + increment).toFixed(3));
          };

          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty(i.quantity) } : i,
              ),
            };
          }

          return {
            cart: [...state.cart, { ...item, quantity: newQty(0) }],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      incrementQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) return item;

            const increment = item.type === "unit" ? 1 : 0.25;
            const newQty = () => {
              if (item.type === "unit") {
                return item.quantity + increment;
              }

              return parseFloat((item.quantity + increment).toFixed(3));
            };
            return {
              ...item,
              quantity: newQty(),
            };
          }),
        })),

      decrementQuantity: (id) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id !== id) return item;

            const decrement = item.type === "unit" ? 1 : 0.25;
            const min = item.type === "unit" ? 1 : 0.25;

            const newQty = item.quantity - decrement;

            return {
              ...item,
              quantity: newQty < min ? min : parseFloat(newQty.toFixed(3)),
            };
          }),
        })),

      clearCart: () =>
        set({
          cart: [],
          promoCode: null,
        }),

      applyPromoCode: (promo) =>
        set({
          promoCode: promo,
        }),

      removePromoCode: () =>
        set({
          promoCode: null,
        }),

      getQuantity: () => get().cart.length,

      getSubtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getDiscountAmount: () => {
        const { promoCode } = get();
        const subtotal = get().getSubtotal();

        if (!promoCode) return 0;

        if (promoCode.discountType === "percentage") {
          return (subtotal * promoCode.discountValue) / 100;
        }

        return Math.min(promoCode.discountValue, subtotal);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        return Math.max(subtotal - discount, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
