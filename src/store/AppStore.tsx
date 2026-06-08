"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { type Product } from "@/data/products";

const MAX_GIFTS = 5;
const STORAGE_KEY = "giftbox-app:v1";

type CartLine = { product: Product; qty: number };

type AppState = {
  gifts: Product[];
  giftTotal: number;
  giftsFull: boolean;
  isGiftSelected: (id: string) => boolean;
  toggleGift: (p: Product) => void;

  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  inCart: (id: string) => number;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;

  /** True once we've finished reading from localStorage on the client. */
  hydrated: boolean;

  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
};

type Persisted = {
  gifts: Product[];
  cart: CartLine[];
};

const AppContext = createContext<AppState | null>(null);

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted;
    if (!parsed || !Array.isArray(parsed.gifts) || !Array.isArray(parsed.cart)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [gifts, setGifts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  // Load from localStorage on mount.
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      setGifts(persisted.gifts);
      setCart(persisted.cart);
    }
    setHydrated(true);
  }, []);

  // Persist whenever state changes (only after hydration so we don't overwrite
  // stored state with the initial empty arrays during SSR mismatch).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ gifts, cart } satisfies Persisted)
      );
    } catch {
      // ignore quota / private-mode errors
    }
  }, [gifts, cart, hydrated]);

  const giftTotal = useMemo(
    () => gifts.reduce((sum, g) => sum + g.price, 0),
    [gifts]
  );

  const isGiftSelected = useCallback(
    (id: string) => gifts.some((g) => g.id === id),
    [gifts]
  );

  const giftsFull = gifts.length >= MAX_GIFTS;

  const toggleGift = useCallback((p: Product) => {
    setGifts((prev) => {
      const exists = prev.some((g) => g.id === p.id);
      if (exists) return prev.filter((g) => g.id !== p.id);
      if (prev.length >= MAX_GIFTS) return prev;
      return [...prev, p];
    });
  }, []);

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
        .map((l) => (l.product.id === id ? { ...l, qty: l.qty - 1 } : l))
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
    cartOpen,
    openCart,
    closeCart,
    setCartOpen,
    isGiftSelected,
    toggleGift,
    cart,
    cartCount,
    cartTotal,
    inCart,
    addToCart,
    removeFromCart,
    hydrated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useAppStore must be used within an AppStoreProvider");
  return ctx;
}
