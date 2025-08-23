import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, User } from '@shared/schema';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Store {
  // User state
  user: User | null;
  isWholesaleUser: boolean;
  setUser: (user: User | null) => void;
  setWholesaleUser: (isWholesale: boolean) => void;

  // Cart state
  cart: CartItem[];
  addToCart: (product: Product, isWholesale?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Payment state
  selectedPayment: string | null;
  setSelectedPayment: (method: string) => void;

  // Points state
  userPoints: number;
  addPoints: (points: number) => void;
  usePoints: (points: number) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isWholesaleUser: false,
      cart: [],
      selectedPayment: null,
      userPoints: 0,

      // User actions
      setUser: (user) => set({ user }),
      setWholesaleUser: (isWholesale) => set({ isWholesaleUser: isWholesale }),

      // Cart actions
      addToCart: (product, isWholesale = false) => {
        const { cart } = get();
        const price = isWholesale 
          ? parseFloat(product.wholesalePrice) 
          : parseFloat(product.retailPrice);
        
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, {
              id: product.id,
              name: product.name,
              price,
              quantity: 1,
              imageUrl: product.imageUrl || undefined,
            }],
          });
        }
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        set({ cart: cart.filter(item => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          set({ cart: cart.filter(item => item.id !== productId) });
        } else {
          set({
            cart: cart.map(item =>
              item.id === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      // Payment actions
      setSelectedPayment: (method) => set({ selectedPayment: method }),

      // Points actions
      addPoints: (points) => {
        const { userPoints } = get();
        set({ userPoints: userPoints + points });
      },

      usePoints: (points) => {
        const { userPoints } = get();
        set({ userPoints: Math.max(0, userPoints - points) });
      },
    }),
    {
      name: 'tienda-store',
      partialize: (state) => ({
        user: state.user,
        isWholesaleUser: state.isWholesaleUser,
        cart: state.cart,
        userPoints: state.userPoints,
      }),
    }
  )
);
