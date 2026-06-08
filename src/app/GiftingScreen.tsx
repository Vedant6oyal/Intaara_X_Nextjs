"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Gift, PartyPopper, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import GiftCard from "@/components/GiftCard";
import GiftProgressBar from "@/components/GiftProgressBar";

export default function GiftingScreen({ products }: { products: Product[] }) {
  const { gifts, giftsFull } = useAppStore();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (giftsFull) setShowPopup(true);
  }, [giftsFull]);

  return (
    <div className="pb-8">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-sm animate-pop rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-100">
              <PartyPopper size={28} className="text-sage-700" />
            </span>
            <h3 className="text-lg font-bold text-gray-800">
              Your gift box is ready!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You&apos;ve picked 5 free gifts. Redeem them on your first
              purchase!
            </p>

            <Link
              href="/redeem"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white shadow transition hover:bg-terracotta-600"
            >
              Redeem My Gifts <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-100 py-3 text-sm font-semibold text-sage-700 transition hover:bg-sage-200"
            >
              <RefreshCw size={15} /> Change Selection
            </button>
          </div>
        </div>
      )}

      <GiftProgressBar />

      <section className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage-700 via-sage-600 to-sage-800 px-5 py-8 text-center text-white">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_60%,white,transparent_35%)]" />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <Gift size={13} /> Gifting Studio
          </span>
          <h2 className="relative mt-3 font-serif text-3xl font-bold leading-tight text-terracotta-400 drop-shadow">
            Build your
            <br /> jewellery box
          </h2>
          <p className="relative mx-auto mt-2 max-w-[16rem] text-xs text-white/80">
            Hand-pick anti-tarnish jewellery as free gifts — absolutely free
            with your purchase.
          </p>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="-mt-7 mx-2 flex items-center justify-center gap-2 rounded-xl bg-sage-600 py-2.5 text-sm font-bold text-white shadow-lg">
          <Sparkles size={16} className="text-amber-300" />
          Free Gifts with every purchase
          <Sparkles size={16} className="text-amber-300" />
        </div>

        <div className="mt-4 rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-gray-700 ring-1 ring-black/5">
          <Step n={1} text="Pick the free gifts you love 💝" />
          <Step n={2} text="Add them to your gift box 🎁" />
          <Step n={3} text="Head to Redeem & choose a product 🛍️" />
          <Step n={4} text="Checkout — gifts unlock for free ✅" />
        </div>
      </section>

      {gifts.length > 0 && (
        <section className="px-4 pt-4">
          <Link
            href="/redeem"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white shadow transition hover:bg-terracotta-600"
          >
            Continue to Redeem <ArrowRight size={16} />
          </Link>
        </section>
      )}

      <section className="px-4 pt-5">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-800">Pick your free gifts</h2>
          <span className="text-xs text-gray-400">All free with purchase</span>
        </div>
        {products.length === 0 ? (
          <EmptyState message="No free gifts available right now. Tag some Shopify products with `gift` to populate this screen." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <GiftCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage-600 text-[11px] font-bold text-white">
        {n}
      </span>
      <span>{text}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-6 text-center text-sm text-sage-700">
      {message}
    </div>
  );
}
