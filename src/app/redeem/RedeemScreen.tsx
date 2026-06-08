"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Gift, ShoppingBag } from "lucide-react";
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
  const { gifts, giftTotal, cartCount, cartTotal } = useAppStore();

  const filtered = useMemo(
    () =>
      activeCategory
        ? products.filter((p) => p.category === activeCategory)
        : products,
    [activeCategory, products]
  );

  return (
    <div className="pb-28">
      <section className="px-4 pt-3">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 p-3 text-white">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
            <Gift size={20} />
          </span>
          <div className="flex-1 text-sm">
            {gifts.length > 0 ? (
              <p className="font-semibold">
                {gifts.length} free gift{gifts.length > 1 ? "s" : ""} (₹{giftTotal})
                ready to redeem!
              </p>
            ) : (
              <p className="font-semibold">No gifts selected yet</p>
            )}
            <p className="text-xs text-white/80">
              {gifts.length > 0
                ? "Buy any product below to unlock them free."
                : "Go to Free Gifts to pick yours first."}
            </p>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="mb-1 text-base font-bold text-gray-800">
            Shop by category
          </h2>
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
            {activeCategory ?? "All products"}
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
          <button className="flex w-full items-center justify-between rounded-2xl bg-terracotta-500 px-4 py-3 text-white shadow-lg transition hover:bg-terracotta-600">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingBag size={18} />
              {cartCount} item{cartCount > 1 ? "s" : ""} · ₹{cartTotal}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold">
              {gifts.length > 0
                ? `Redeem ${gifts.length} gift${gifts.length > 1 ? "s" : ""}`
                : "Checkout"}
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
