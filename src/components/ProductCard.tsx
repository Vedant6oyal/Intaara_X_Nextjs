"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Minus, Plus } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import type { Product } from "@/data/products";

export default function ProductCard({ product, discountUnlocked = false }: { product: Product; discountUnlocked?: boolean }) {
  const { inCart, addToCart, removeFromCart } = useAppStore();
  const qty = inCart(product.id);
  const saved = product.mrp ? product.mrp - product.price : 0;
  const href = product.handle ? `/product/${product.handle}` : "#";

  const displayPrice = discountUnlocked
    ? Math.round(product.price * 0.5)
    : product.price;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <Link href={href} className="relative aspect-square w-full bg-sage-50">
        {saved > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-sage-100 px-2 py-0.5 text-[11px] font-semibold text-sage-700">
            Save ₹{saved}
          </span>
        )}
        <button
          aria-label="Wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-gray-400 shadow"
        >
          <Heart size={15} />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 50vw, 200px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={href}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-800 hover:text-sage-700"
        >
          {product.name}
        </Link>

        {product.rating && (
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-700">{product.rating}</span>
            <span>({product.ratingCount})</span>
          </div>
        )}

        <div className="mt-1 flex items-baseline gap-2">
          {discountUnlocked ? (
            <div className="flex items-baseline gap-1.5 rounded-md bg-gradient-to-r from-[#fff4c9] to-[#ffe58a] px-1.5 py-0.5 ring-1 ring-[#d4af37]/50 animate-price-flash">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#1A3C2A]">
                −50%
              </span>
              <span className="text-sm font-bold text-[#1A3C2A]">
                ₹{displayPrice}
              </span>
              <span className="text-[11px] text-gray-500 line-through decoration-red-500/70">
                ₹{product.price}
              </span>
            </div>
          ) : (
            <>
              <span className="rounded-md border border-sage-300 px-1.5 py-0.5 text-sm font-semibold text-sage-700">
                ₹{product.price}
              </span>
              {product.mrp && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </>
          )}
        </div>

        {qty === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="mt-3 rounded-lg bg-sage-600 py-2 text-sm font-semibold text-white transition hover:bg-sage-700"
          >
            ADD
          </button>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-sage-600 px-2 py-1.5 text-white">
            <button
              aria-label="Decrease"
              onClick={() => removeFromCart(product.id)}
              className="grid h-6 w-6 place-items-center rounded-md bg-white/20"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold">{qty}</span>
            <button
              aria-label="Increase"
              onClick={() => addToCart(product)}
              className="grid h-6 w-6 place-items-center rounded-md bg-white/20"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
