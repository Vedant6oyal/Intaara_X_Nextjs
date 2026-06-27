"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Gift, Pencil, ShoppingBag } from "lucide-react";
import type { Category, Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import CategoryStrip from "@/components/CategoryStrip";
import ProductCard from "@/components/ProductCard";

export default function RedeemScreen({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const { gifts, giftTotal, cartCount, cartTotal, openCart } = useAppStore();

  useEffect(() => {
    const onScroll = () => setHeaderHidden(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <section className={`sticky z-20 px-4 pt-3 transition-all duration-300 ${headerHidden ? "top-0" : "top-14"}`}>
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 px-3 py-2.5 text-white shadow-sm">
          {gifts.length > 0 ? (
            <>
              <div className="flex shrink-0 items-center -space-x-2">
                {gifts.slice(0, 4).map((g) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={g.id}
                    src={g.image}
                    alt={g.name}
                    title={g.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-sage-700"
                  />
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
            onSelect={setActiveCategory}
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
              <ProductCard key={p.id} product={p} />
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
              {gifts.length > 0
                ? `Redeem ${gifts.length} gift${gifts.length > 1 ? "s" : ""}`
                : "View Cart"}
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
