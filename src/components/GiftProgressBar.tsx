"use client";

import { Check, Gift, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useCountUp } from "@/hooks/useCountUp";

const MAX_SLOTS = 2;

export default function GiftProgressBar() {
  const { gifts, giftTotal, toggleGift } = useAppStore();
  const filledCount = Math.min(gifts.length, MAX_SLOTS);

  // 0 → 0%, 1 → 50%, 2 → 100% (clamped so stale state can't overflow)
  const progressPct = Math.min((filledCount / MAX_SLOTS) * 100, 100);

  // Animated total — re-counts whenever the total changes.
  const animatedTotal = useCountUp(giftTotal, giftTotal, 600);

  return (
    <div className="sticky top-0 z-20 border-b border-black/5 bg-cream/95 px-5 py-2 backdrop-blur-md">
      {/* Header row: title + total */}
      <div className="mb-3 flex items-end justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-sage-700">
          <Gift size={13} />
          Your free gifts
        </div>
        {filledCount > 0 ? (
          <div className="leading-none text-right">
            <div className="font-cinzel text-lg font-bold tabular-nums text-sage-800">
              ₹{animatedTotal.toLocaleString("en-IN")}
              <span className="font-sans text-[11px] font-semibold text-gray-500">
                {" "}worth
              </span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-terracotta-500">
              
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-medium text-gray-400">
            Pick {MAX_SLOTS} to unlock
          </div>
        )}
      </div>

      {/* Stepper: line + 2 circles. Circles are centered at 25% and 75% via
          justify-around, so the track runs exactly from 25% → 75% and the fill
          covers (50% × progress). Track sits at top-6 = circle center (h-12). */}
      <div className="relative">
        {/* Track (background) */}
        <div className="absolute left-1/4 right-1/4 top-6 h-1 -translate-y-1/2 rounded-full bg-sage-100" />
        {/* Track (filled) */}
        <div
          className="absolute left-1/4 top-6 h-1 -translate-y-1/2 rounded-full bg-sage-600 transition-[width] duration-500 ease-out"
          style={{ width: `${(progressPct / 100) * 50}%` }}
        />

        <div className="relative flex items-start justify-around">
          {Array.from({ length: MAX_SLOTS }).map((_, i) => {
            const reached = filledCount > i;
            const product = gifts[i];
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`relative grid h-12 w-12 place-items-center rounded-full transition ${
                    reached
                      ? "bg-sage-600 text-white shadow-md ring-4 ring-cream animate-pop"
                      : "bg-white text-sage-400 ring-2 ring-dashed ring-sage-300"
                  }`}
                  aria-label={
                    reached ? `Gift ${i + 1}: ${product?.name}` : `Gift ${i + 1} empty`
                  }
                >
                  {reached && product ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-sage-600 text-white ring-2 ring-cream">
                        <Check size={10} strokeWidth={3} />
                      </span>
                      <button
                        aria-label={`Remove ${product.name}`}
                        onClick={() => toggleGift(product)}
                        className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-gray-500 shadow ring-1 ring-black/10"
                      >
                        <X size={11} strokeWidth={3} />
                      </button>
                    </>
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    reached ? "text-sage-700" : "text-gray-400"
                  }`}
                >
                  Gift {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
