"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, Star } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import type { Product } from "@/data/products";

export default function GiftCard({ product }: { product: Product }) {
  const { isGiftSelected, toggleGift, giftsFull } = useAppStore();
  const selected = isGiftSelected(product.id);
  const disabled = !selected && giftsFull;
  const saved = product.mrp ? product.mrp - product.price : 0;
  const href = product.handle ? `/product/${product.handle}` : "#";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition ${
        selected ? "ring-2 ring-sage-500" : "ring-black/5"
      }`}
    >
      {saved > 0 && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-sage-100 px-2 py-0.5 text-[11px] font-semibold text-sage-700">
          Save ₹{saved}
        </span>
      )}

      <Link href={href} className="relative block aspect-square w-full bg-sage-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 50vw, 200px"
          className="object-cover"
        />
        {selected && (
          <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-sage-600 text-white shadow animate-pop">
            <Check size={16} />
          </span>
        )}
        <span className="absolute bottom-2 left-2 rounded-md bg-terracotta-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Free Gift
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={href}
          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-sage-700"
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

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className=" text-base font-bold tracking-wide text-sage-700">
            FREE
          </span>
          <span className="text-lg font-semibold text-gray-800 line-through decoration-[1.5px]">
            ₹{product.mrp ?? product.price}
          </span>
        </div>

        <button
          onClick={() => !disabled && toggleGift(product)}
          disabled={disabled}
          className={`mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
            selected
              ? "bg-sage-600 text-white"
              : disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-sage-100 text-sage-700 hover:bg-sage-200"
          }`}
        >
          {selected ? (
            <>
              <Check size={16} /> Added
            </>
          ) : disabled ? (
            "Box is full"
          ) : (
            <>
              <Plus size={16} /> Add Gift
            </>
          )}
        </button>
      </div>
    </div>
  );
}
