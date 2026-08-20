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
import { trackEvent } from "@/lib/analytics";

const MAX_GIFTS = 2;
const STORAGE_KEY = "giftbox-app:v1";

type CartLine = { product: Product; qty: number };

type AppState = {
  gifts: Product[];
  giftTotal: number;
  giftsFull: boolean;
  gift2Unlocked: boolean;
  gift2Locked: boolean;
  mysteryGiftId: string | null;
  unlockGift2: (mysteryProduct?: Product) => void;
  isGiftSelected: (id: string) => boolean;
  toggleGift: (p: Product) => void;

  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  inCart: (id: string) => number;
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;

  wishlist: Product[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (p: Product) => void;
  wishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  setWishlistOpen: (open: boolean) => void;

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
  gift2Unlocked?: boolean;
  mysteryGiftId?: string | null;
  wishlist?: Product[];
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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [gift2Unlocked, setGift2Unlocked] = useState(false);
  const [mysteryGiftId, setMysteryGiftId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);

  // Load from localStorage on mount.
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      // Trim any stale state saved when the gift limit was higher.
      setGifts(persisted.gifts.slice(0, MAX_GIFTS));
      setCart(persisted.cart);
      if (persisted.gift2Unlocked) setGift2Unlocked(true);
      if (persisted.mysteryGiftId) setMysteryGiftId(persisted.mysteryGiftId);
      if (persisted.wishlist) setWishlist(persisted.wishlist);
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
        JSON.stringify({ gifts, cart, gift2Unlocked, mysteryGiftId, wishlist } satisfies Persisted)
      );
    } catch {
      // ignore quota / private-mode errors
    }
  }, [gifts, cart, hydrated, wishlist, mysteryGiftId]);

  const giftTotal = useMemo(
    () => gifts.reduce((sum, g) => sum + g.price, 0),
    [gifts]
  );

  const isGiftSelected = useCallback(
    (id: string) => gifts.some((g) => g.id === id),
    [gifts]
  );

  const giftsFull = gifts.length >= MAX_GIFTS;
  const gift2Locked = gifts.length === 1 && !gift2Unlocked;

  const unlockGift2 = useCallback((mysteryProduct?: Product) => {
    if (!gift2Unlocked) trackEvent("second_gift_unlocked");
    setGift2Unlocked(true);
    if (mysteryProduct && gifts.length === 1) {
      setMysteryGiftId(mysteryProduct.id);
      trackEvent("gift_selected", {
        gift_id: mysteryProduct.id,
        gift_name: mysteryProduct.name,
        gift_number: 2,
        gift_price: mysteryProduct.price,
        mystery_gift: true,
      });
      setGifts((prev) => [...prev, mysteryProduct]);
    }
  }, [gift2Unlocked, gifts]);

  const toggleGift = useCallback((p: Product) => {
    const exists = gifts.some((g) => g.id === p.id);
    if (exists) {
      // Mystery gift cannot be removed once unlocked.
      if (p.id === mysteryGiftId) return;
      trackEvent("gift_removed", { gift_id: p.id, gift_name: p.name });
      setGifts((prev) => prev.filter((g) => g.id !== p.id));
      return;
    }
    if (gifts.length >= MAX_GIFTS || (gifts.length === 1 && !gift2Unlocked)) return;
    trackEvent("gift_selected", {
      gift_id: p.id,
      gift_name: p.name,
      gift_number: gifts.length + 1,
      gift_price: p.price,
    });
    setGifts((prev) => [...prev, p]);
  }, [gift2Unlocked, gifts, mysteryGiftId]);

  const inCart = useCallback(
    (id: string) => cart.find((l) => l.product.id === id)?.qty ?? 0,
    [cart]
  );

  const addToCart = useCallback((p: Product) => {
    const currentQuantity = cart.find((line) => line.product.id === p.id)?.qty ?? 0;
    const cartCountAfter = cart.reduce((s, l) => s + l.qty, 0) + 1;
    trackEvent("redeem_product_added", {
      product_id: p.id,
      product_name: p.name,
      product_price: p.price,
      quantity_after: currentQuantity + 1,
      cart_count_after: cartCountAfter,
    });
    setCart((prev) => {
      const found = prev.find((line) => line.product.id === p.id);
      if (found)
        return prev.map((line) =>
          line.product.id === p.id ? { ...line, qty: line.qty + 1 } : line
        );
      return [...prev, { product: p, qty: 1 }];
    });
  }, [cart]);

  const removeFromCart = useCallback((id: string) => {
    const line = cart.find((item) => item.product.id === id);
    if (line) {
      const cartCountAfter = cart.reduce((s, l) => s + l.qty, 0) - 1;
      trackEvent("redeem_product_removed", {
        product_id: line.product.id,
        product_name: line.product.name,
        quantity_after: line.qty - 1,
        cart_count_after: Math.max(cartCountAfter, 0),
      });
    }
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  }, [cart]);

  const isWishlisted = useCallback(
    (id: string) => wishlist.some((w) => w.id === id),
    [wishlist]
  );

  const toggleWishlist = useCallback((p: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === p.id);
      if (exists) return prev.filter((w) => w.id !== p.id);
      return [...prev, p];
    });
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
    gift2Unlocked,
    gift2Locked,
    mysteryGiftId,
    unlockGift2,
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
    wishlist,
    isWishlisted,
    toggleWishlist,
    wishlistOpen,
    openWishlist,
    closeWishlist,
    setWishlistOpen,
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
