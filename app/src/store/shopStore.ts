import { create } from 'zustand';
import { CartItem, Product, Order } from '../services/types';

interface ShopState {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
  checkout: (address: any) => Promise<Order>;
}

export const useShopStore = create<ShopState>((set, get) => ({
  cart: [],
  orders: [],

  addToCart: (product) => {
    set((s) => {
      const existing = s.cart.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          cart: s.cart.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...s.cart, { product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) =>
    set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) })),

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((s) => ({
      cart: s.cart.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  cartTotal: () => {
    const { cart } = get();
    return cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },

  cartCount: () => {
    const { cart } = get();
    return cart.reduce((sum, i) => sum + i.quantity, 0);
  },

  checkout: async (address) => {
    await new Promise((r) => setTimeout(r, 1500));
    const { cart, cartTotal, clearCart } = get();
    const order: Order = {
      id: 'ord' + Date.now(),
      clientId: 'u1',
      items: [...cart],
      totalAmount: cartTotal(),
      status: 'processing',
      shippingAddress: address,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ orders: [order, ...s.orders] }));
    clearCart();
    return order;
  },
}));
