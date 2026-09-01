"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Banknote, Gift, Pencil, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import type { Category, Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";
import { trackEvent } from "@/lib/analytics";
import FeatureMarquee from "@/components/FeatureMarquee";
import QualityShowcaseBlock from "@/components/QualityShowcaseBlock";

export default function RedeemScreen({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [showGiftClaimPopup, setShowGiftClaimPopup] = useState(false);
  const { gifts, giftTotal, cart, cartCount, cartTotal, openCart } = useAppStore();

  // Show gift-claim popup once when entering the redeem screen (if gifts are selected
  // and the user hasn't already added a product to their cart).
  const claimPopupShown = useRef(false);
  useEffect(() => {
    if (!claimPopupShown.current && gifts.length > 0 && cartCount === 0) {
      setShowGiftClaimPopup(true);
      claimPopupShown.current = true;
    }
  }, [gifts.length, cartCount]);

  // Auto-open the cart drawer whenever a product is added.
  const prevCartCount = useRef<number>(0);
  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      openCart();
    }
    prevCartCount.current = cartCount;
  }, [cartCount, openCart]);

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

  const switchCategory = (cat: string | null) => {
    setActiveCategory(cat);
    trackEvent("category_selected", {
      screen: "redeem",
      category: cat ?? "all",
    });
    if (cat) window.sessionStorage.setItem("redeem:category", cat);
    else window.sessionStorage.removeItem("redeem:category");
  };

  // Restore the saved category after mount.
  useEffect(() => {
    const saved = window.sessionStorage.getItem("redeem:category");
    if (saved) setActiveCategory(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setHeaderHidden(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pb-28">
      {/* Gift claim popup — shown on entry when gifts are selected */}
      {showGiftClaimPopup && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 px-6 animate-fade-in"
          onClick={() => setShowGiftClaimPopup(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-reward-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sage gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sage-700 to-sage-700 px-6 pb-6 pt-7 text-center">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep" />
              </div>

              <div className="relative">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 text-white ring-4 ring-white/40 shadow-lg">
                  <Gift size={32} className="drop-shadow" />
                </span>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                   Your Giftbox is Ready 
                </p>
                <h3 className="mt-1 font-cinzel text-2xl font-bold leading-tight text-white">
                  ₹{giftTotal.toLocaleString("en-IN")} FREE
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 pt-5 text-center">
              <p className="text-sm text-gray-600">
                Purchase any item from this page and your selected gifts worth{" "}
                <span className="font-semibold text-sage-700">
                  ₹{giftTotal.toLocaleString("en-IN")}
                </span>{" "}
                will be added to your order —{" "}
                <span className="font-bold text-sage-700">absolutely free</span>.
              </p>

              <button
                onClick={() => setShowGiftClaimPopup(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-700 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-sage-800"
              >
                Start Shopping <ArrowRight size={16} />
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
      {/* Slow-moving feature strip */}
      <div className="overflow-hidden bg-sage-700 py-2">
        <div className="flex w-max animate-marquee-fast whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <span
                    key={`${dup}-${i}`}
                    className="flex items-center gap-1.5 px-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    <Icon size={13} />
                    {item.label}
                    <span className="ml-4 text-white/70">·</span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
            {filtered.map((p, i) => (
              <Fragment key={p.id}>
                <ProductCard product={p} />
                {(i + 1) % 4 === 0 && i < filtered.length - 1 && (
                  <div className="col-span-2 -mx-4 my-1">
                    <FeatureMarquee />
                  </div>
                )}
                {i + 1 === 8 && i < filtered.length - 1 && (
                  <div className="col-span-2 my-2">
                    <QualityShowcaseBlock />
                  </div>
                )}
              </Fragment>
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

const MARQUEE_ITEMS = [
  { label: "Free Shipping", icon: Truck },
  { label: "COD available", icon: Banknote },
  { label: "Easy Returns", icon: RotateCcw },
];
