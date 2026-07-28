"use client";

import { Check, Clock, MessageCircle, X } from "lucide-react";

const TOTAL_SHARES = 3;
const CONFIRMED_SHARES = 1;

export default function WaitingScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6 animate-fade-in">
      <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sage-500 via-terracotta-400 to-sage-500" />

        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center justify-center">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-terracotta-50 text-terracotta-500">
            <Clock size={28} />
          </span>
        </div>

        <h3 className="text-lg font-bold tracking-wide text-sage-800">
          Waiting for your friends
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          We're waiting for at least{" "}
          <span className="font-semibold text-terracotta-500">3 of your friends</span>{" "}
          to select their first gift using your share link.
        </p>

        {/* Progress circles */}
        <div className="my-6 flex items-center justify-center gap-4">
          {Array.from({ length: TOTAL_SHARES }).map((_, i) => {
            const confirmed = i < CONFIRMED_SHARES;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-full border-2 transition ${
                    confirmed
                      ? "border-sage-600 bg-sage-600 text-white"
                      : "border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {confirmed ? (
                    <Check size={22} strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${
                    confirmed ? "text-sage-700" : "text-gray-400"
                  }`}
                >
                  {confirmed ? "Done" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-500 to-terracotta-400 transition-all duration-700"
            style={{ width: `${(CONFIRMED_SHARES / TOTAL_SHARES) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 px-4 py-3 text-left">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
            <MessageCircle size={18} />
          </span>
          <p className="text-xs leading-relaxed text-gray-700">
            We'll notify you on{" "}
            <span className="font-semibold text-[#1da851]">WhatsApp</span> once
            your friends have selected, so you can complete your checkout.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-700 py-3 text-sm font-bold text-white transition hover:bg-sage-800"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
