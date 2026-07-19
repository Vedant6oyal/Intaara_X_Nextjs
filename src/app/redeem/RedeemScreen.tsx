"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crown, Gift, Pencil, ShoppingBag, Sparkles } from "lucide-react";
import type { Category, Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";
import Celebration from "@/components/Celebration";

export default function RedeemScreen({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem("redeem:category") || null;
  });
  const [headerHidden, setHeaderHidden] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const { gifts, giftTotal, cartCount, cartTotal, openCart } = useAppStore();

  // Detect when the first cart item is added → tease 50% off on their next.
  // When the second item is added → auto-open the cart for checkout.
  const prevCartCount = useRef<number>(0);
  useEffect(() => {
    if (prevCartCount.current === 0 && cartCount === 1) {
      setShowConfetti(true);
      setShowRewardPopup(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      prevCartCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    if (prevCartCount.current < 2 && cartCount >= 2) {
      setShowRewardPopup(false);
      openCart();
    }
    prevCartCount.current = cartCount;
  }, [cartCount, openCart]);

  const discountUnlocked = cartCount === 1;

  // Per-category scroll position preservation.
  const scrollPositions = useRef<Record<string, number>>({});
  const switchCategory = (cat: string | null) => {
    scrollPositions.current[activeCategory ?? "__all"] = window.scrollY;
    setActiveCategory(cat);
  };

  // Persist the active category so it survives navigation to a product page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeCategory) window.sessionStorage.setItem("redeem:category", activeCategory);
    else window.sessionStorage.removeItem("redeem:category");
  }, [activeCategory]);

  useEffect(() => {
    const onScroll = () => {
      setHeaderHidden(window.scrollY > 10);
      // Persist scroll position so back-navigation lands in the same spot.
      window.sessionStorage.setItem("redeem:scroll", String(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On first mount, restore the scroll position saved before navigating away.
  useEffect(() => {
    const saved = window.sessionStorage.getItem("redeem:scroll");
    if (saved != null) {
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll position when switching categories in-session. Skip the
  // very first render so it doesn't clobber the sessionStorage restore above.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const saved = scrollPositions.current[activeCategory ?? "__all"];
    if (saved != null) window.scrollTo(0, saved);
    else window.scrollTo(0, 0);
  }, [activeCategory]);

  const filtered = useMemo(
    () =>
      activeCategory
        ? products.filter((p) => p.collections?.includes(activeCategory))
        : products,
    [activeCategory, products]
  );

  const activeCategoryName = activeCategory
    ? categories.find((c) => c.id === activeCategory)?.name ?? "Products"
    : "All products";

  return (
    <div className="pb-28">
      {/* Cannon-style confetti celebration when second product is added */}
      <Celebration show={showConfetti} />

      {/* 50% OFF unlocked — reward popup */}
      {showRewardPopup && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 px-6 animate-fade-in"
          onClick={() => setShowRewardPopup(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-reward-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold gradient header with shimmer */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#f5d76e] via-[#d4af37] to-[#a8801f] px-6 pb-6 pt-7 text-center">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shine-sweep" />
              </div>

              <div className="relative">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#1A3C2A] text-[#f5d76e] ring-4 ring-white/70 shadow-lg">
                  <Crown size={32} className="drop-shadow" />
                </span>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#1A3C2A]/80">
                  <Sparkles size={12} /> Special Offer <Sparkles size={12} />
                </p>
                <h3 className="mt-1 font-cinzel text-3xl font-bold leading-tight text-[#1A3C2A]">
                  50% OFF
                </h3>
                <p className="mt-0.5 text-lg font-bold text-[#1A3C2A]">
                  on your next item
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-5 text-center">
              <p className="text-sm text-gray-600">
                Add one more item to your cart to get it at{" "}
                <span className="font-semibold text-[#1A3C2A]">
                  half price
                </span>
                .
              </p>

              <button
                onClick={() => setShowRewardPopup(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A3C2A] py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-[#152e20]"
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <section className={`sticky z-20 px-4 pt-3 transition-all duration-300 ${headerHidden ? "top-0" : "top-14"}`}>
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 px-3 py-2.5 text-white shadow-sm">
          {gifts.length > 0 ? (
            <>
              <div className="flex shrink-0 items-center -space-x-2">
                {gifts.slice(0, 4).map((g) => (
                  <div
                    key={g.id}
                    className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-sage-700"
                  >
                    <Image
                      src={g.image}
                      alt={g.name}
                      title={g.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                ))}
                {gifts.length > 4 && (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-[11px] font-bold ring-2 ring-sage-700">
                    +{gifts.length - 4}
                  </span>
                )}
              </div>

              <div className="flex-1 leading-tight">
                <p className="font-serif text-lg font-bold tracking-tight tabular-nums">
                  ₹{giftTotal.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                  free gifts unlocked
                </p>
              </div>

              <Link
                href="/"
                className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white ring-1 ring-white/25 transition hover:bg-white/25"
              >
                <Pencil size={12} />
                Change
              </Link>
            </>
          ) : (
            <>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 ring-2 ring-dashed ring-white/60">
                <Gift size={16} />
              </span>
              <p className="flex-1 text-sm font-semibold">
                Pick free gifts to unlock with this order
              </p>
              <Link
                href="/"
                className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-sage-700 transition hover:bg-white/90"
              >
                Pick
                <ArrowRight size={12} />
              </Link>
            </>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section
          className={`sticky z-20 bg-cream/95 px-4 pt-3 backdrop-blur transition-all duration-300 ${
            headerHidden ? "top-[72px]" : "top-[128px]"
          }`}
        >
          <CategoryStrip
            categories={categories}
            active={activeCategory}
            onSelect={switchCategory}
          />
        </section>
      )}

      <section className="px-4 pt-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {activeCategoryName}
          </h2>
          <span className="text-xs text-gray-400">{filtered.length} items</span>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-6 text-center text-sm text-sage-700">
            No products to show. Make sure your Shopify catalog has products
            without the <code>gift</code> tag.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} discountUnlocked={discountUnlocked} />
            ))}
          </div>
        )}
      </section>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-full max-w-[480px] px-4">
          <button
            onClick={openCart}
            className="flex w-full animate-wiggle items-center justify-between rounded-2xl bg-terracotta-500 px-4 py-3 text-white shadow-lg transition hover:bg-terracotta-600"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag size={18} />
              {cartCount} item{cartCount > 1 ? "s" : ""} · ₹{cartTotal}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold">
              Go to Checkout
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

