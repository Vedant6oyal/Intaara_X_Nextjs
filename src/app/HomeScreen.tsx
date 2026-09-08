"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Banknote, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import type { Category, Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";
import { trackEvent } from "@/lib/analytics";
import FeatureMarquee from "@/components/FeatureMarquee";
import QualityShowcaseBlock from "@/components/QualityShowcaseBlock";
import HeroCarousel from "@/components/HeroCarousel";
import ReelsSection from "@/components/ReelsSection";

export default function HomeScreen({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const { cart, cartCount, cartTotal, openCart } = useAppStore();

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
      screen: "home",
      category: cat ?? "all",
    });
    if (cat) window.sessionStorage.setItem("shop:category", cat);
    else window.sessionStorage.removeItem("shop:category");
  };

  // Restore the saved category after mount.
  useEffect(() => {
    const saved = window.sessionStorage.getItem("shop:category");
    if (saved) setActiveCategory(saved);
  }, []);

  // Restore scroll position when returning from a product page.
  const scrollRestored = useRef(false);
  useEffect(() => {
    if (scrollRestored.current) return;
    const saved = window.sessionStorage.getItem("shop:scroll");
    if (saved == null) return;
    scrollRestored.current = true;
    const target = Number(saved);
    const restore = () => window.scrollTo(0, target);
    requestAnimationFrame(() => {
      restore();
      window.setTimeout(restore, 100);
    });
  }, [filtered.length]);

  useEffect(() => {
    const onScroll = () => {
      setHeaderHidden(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pb-28">
      <HeroCarousel />

      <ReelsSection />

      {categories.length > 0 && (
        <section
          className={`sticky z-20 bg-cream/95 px-4 pt-3 backdrop-blur transition-all duration-300 ${
            headerHidden ? "top-0" : "top-14"
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

      <section id="shop" className="px-4 pt-2">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {activeCategoryName}
          </h2>
          <span className="text-xs text-gray-400">{filtered.length} items</span>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-6 text-center text-sm text-sage-700">
            No products to show.
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
            className="flex w-full items-center justify-between rounded-2xl bg-terracotta-500 px-4 py-3 text-white shadow-lg transition hover:bg-terracotta-600"
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
