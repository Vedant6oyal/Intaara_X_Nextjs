"use client";

import { Gift, Plus, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";

const MAX_SLOTS = 5;

export default function GiftProgressBar() {
  const { gifts, giftTotal, toggleGift } = useAppStore();
  const filledCount = gifts.length;
  const emptySlots = Math.max(0, MAX_SLOTS - filledCount);

  return (
    <div className="sticky top-0 z-20 border-b border-black/5 bg-cream/95 px-4 py-3 backdrop-blur-md">
      {/* Slot row — evenly spaced */}
      <div className="flex items-center justify-evenly gap-4">
        {gifts.map((g) => (
          <div
            key={g.id}
            className="relative h-16 w-16 shrink-0 animate-pop rounded-xl ring-2 ring-sage-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.image}
              alt={g.name}
              className="h-full w-full rounded-xl object-cover"
            />
            <button
              aria-label="Remove"
              onClick={() => toggleGift(g)}
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-gray-500 shadow ring-1 ring-black/10"
            >
              <X size={11} strokeWidth={3} />
            </button>
          </div>
        ))}

        {/* Empty placeholder slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border-2 border-dashed border-sage-300 bg-sage-50"
          >
            <Plus size={16} className="text-sage-400" />
          </div>
        ))}
      </div>

      {/* Summary label */}
      <div className="mt-2 flex items-center justify-center text-xs">
        <span className="flex items-center gap-1 text-sage-700">
          <Gift size={13} />
          {filledCount === 0 ? (
            <span className="text-gray-400">Pick gifts to fill your box</span>
          ) : (
            <span>
              <span className="font-semibold">{filledCount} gift{filledCount > 1 ? "s" : ""}</span>
              <span className="text-gray-400"> selected · ₹{giftTotal} value</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
