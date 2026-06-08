"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { type Product } from "@/data/products";

const MAX_GIFTS = 5;

type CartLine = { product: Product; qty: number };

type AppState = {
  // Free gifts (max 5)
  gifts: Product[];
  giftTotal: number;
  giftsFull: boolean;
  isGiftSelected: (id: string) => boolean;
  toggleGift: (p: Product) => void;

  // Cart (redeem / purchase)
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  inCart: (id: string) => number;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [gifts, setGifts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);

  const giftTotal = useMemo(
    () => gifts.reduce((sum, g) => sum + g.price, 0),
    [gifts]
  );

  const isGiftSelected = useCallback(
    (id: string) => gifts.some((g) => g.id === id),
    [gifts]
  );

  const giftsFull = gifts.length >= MAX_GIFTS;

  const toggleGift = useCallback(
    (p: Product) => {
      setGifts((prev) => {
        const exists = prev.some((g) => g.id === p.id);
        if (exists) return prev.filter((g) => g.id !== p.id);
        if (prev.length >= MAX_GIFTS) return prev;
        return [...prev, p];
      });
    },
    []
  );

  const inCart = useCallback(
    (id: string) => cart.find((l) => l.product.id === id)?.qty ?? 0,
    [cart]
  );

  const addToCart = useCallback((p: Product) => {
    setCart((prev) => {
      const found = prev.find((l) => l.product.id === p.id);
      if (found)
        return prev.map((l) =>
          l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l
        );
      return [...prev, { product: p, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.product.id === id ? { ...l, qty: l.qty - 1 } : l
        )
        .filter((l) => l.qty > 0)
    );
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((s, l) => s + l.qty, 0),
    [cart]
  );
  const cartTotal = useMemo(
    () => cart.reduce((s, l) => s + l.qty * l.product.price, 0),
    [cart]
  );

  const value: AppState = {
    gifts,
    giftTotal,
    giftsFull,
    isGiftSelected,
    toggleGift,
    cart,
    cartCount,
    cartTotal,
    inCart,
    addToCart,
    removeFromCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useAppStore must be used within an AppStoreProvider");
  return ctx;
}
