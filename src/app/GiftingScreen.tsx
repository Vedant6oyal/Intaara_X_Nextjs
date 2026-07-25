"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Gift, Loader2, PartyPopper, RefreshCw, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Category, Product } from "@/data/products";
import { useAppStore } from "@/store/AppStore";
import { useCountUp } from "@/hooks/useCountUp";
import GiftCard from "@/components/GiftCard";
import FeatureMarquee from "@/components/FeatureMarquee";
import GiftProgressBar from "@/components/GiftProgressBar";
import HeroCarousel from "@/components/HeroCarousel";
import Celebration from "@/components/Celebration";

export default function GiftingScreen({
  products: initialProducts,
  hasNextPage: initialHasNextPage,
  endCursor: initialEndCursor,
  categories,
}: {
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
  categories: Category[];
}) {
  const { gifts, giftTotal, giftsFull, hydrated, gift2Unlocked, unlockGift2 } = useAppStore();
  const [showPopup, setShowPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showUnlockedPopup, setShowUnlockedPopup] = useState(false);

  // Infinite scroll state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [cursor, setCursor] = useState<string | null>(initialEndCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Category filter (using Shopify collections)
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categoryRestored, setCategoryRestored] = useState(false);
  const selectCategory = (category: string | null) => {
    setActiveCategory(category);
    if (category) window.sessionStorage.setItem("gifting:category", category);
    else window.sessionStorage.removeItem("gifting:category");
  };
  useEffect(() => {
    const saved = window.sessionStorage.getItem("gifting:category");
    if (saved) setActiveCategory(saved);
    setCategoryRestored(true);
  }, []);
  const filteredProducts = useMemo(
    () =>
      activeCategory
        ? products.filter((p) => p.collections?.includes(activeCategory))
        : products,
    [activeCategory, products]
  );
  const scrollRestored = useRef(false);
  useEffect(() => {
    if (!categoryRestored || scrollRestored.current) return;
    const saved = window.sessionStorage.getItem("gifting:scroll");
    if (saved == null) return;
    scrollRestored.current = true;
    const target = Number(saved);
    const restore = () => window.scrollTo(0, target);
    requestAnimationFrame(() => {
      restore();
      window.setTimeout(restore, 100);
    });
  }, [categoryRestored, filteredProducts.length]);

  // First-visit welcome popup — shows once, then never again.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("giftbox-app:welcomeSeen");
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleWelcomeDismiss() {
    window.localStorage.setItem("giftbox-app:welcomeSeen", "1");
    setShowWelcome(false);
    const el = document.getElementById("pick-gifts");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Only fire when the box *transitions* from not-full → full after hydration.
  // Prevents re-showing on every page load when the user already has 2 gifts.
  const prevFull = useRef<boolean | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (prevFull.current === false && giftsFull) {
      setShowPopup(true);
    }
    prevFull.current = giftsFull;
  }, [giftsFull, hydrated]);

  // Fire share popup when the first gift is added (and 2nd is still locked).
  const prevGiftCount = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    // Check if the share popup was requested from another screen (e.g. ProductDetails).
    if (typeof window !== "undefined") {
      const flag = window.sessionStorage.getItem("gift:showSharePopup");
      if (flag === "1" && gifts.length === 1 && !gift2Unlocked) {
        setShowSharePopup(true);
        window.sessionStorage.removeItem("gift:showSharePopup");
      }
    }
    if (prevGiftCount.current === 0 && gifts.length === 1 && !gift2Unlocked) {
      setShowSharePopup(true);
    }
    prevGiftCount.current = gifts.length;
  }, [gifts.length, hydrated, gift2Unlocked]);

  // Detect when gift2 gets unlocked (e.g. user returns from WhatsApp share).
  // Show a confetti popup celebrating the unlock — delayed 1s so the user
  // has time to settle back into the app before the celebration fires.
  const prevUnlocked = useRef<boolean | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (prevUnlocked.current === false && gift2Unlocked) {
      const timer = setTimeout(() => setShowUnlockedPopup(true), 1000);
      return () => clearTimeout(timer);
    }
    prevUnlocked.current = gift2Unlocked;
  }, [gift2Unlocked, hydrated]);

  // Animated total inside the popup; restarts when popup opens.
  const popupTotal = useCountUp(giftTotal, showPopup, 900);

  function handleWhatsAppShare() {
    unlockGift2();
    const shareText = encodeURIComponent(
      "Hey! I am sharing with you an exclusive upto ₹1000 gift invite link from Intaara. Pick your favourite jewellery gift, I have already selected mine. \nCheck it out : https://wa.me/918076130691?text=Hi%20Intaara%2C%20I%20got%20Exclusive%20Invite%20IJ221"
    );
    const a = document.createElement("a");
    a.href = `https://api.whatsapp.com/send?text=${shareText}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowSharePopup(false);
  }

  // Infinite scroll: load more products when sentinel enters viewport.
  // Use a ref to hold the latest pagination state so the IntersectionObserver
  // stays stable (created once) instead of being recreated on every state change.
  const stateRef = useRef({ loadingMore, hasNextPage, cursor });
  stateRef.current = { loadingMore, hasNextPage, cursor };

  const loadMore = useCallback(async () => {
    const { loadingMore: lm, hasNextPage: hnp, cursor: c } = stateRef.current;
    if (lm || !hnp || !c) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/gift-products?after=${encodeURIComponent(c)}`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setHasNextPage(data.hasNextPage);
      setCursor(data.endCursor);
    } catch {
      // silently fail — user can scroll again to retry
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="pb-28">
      <Celebration show={showSharePopup || showUnlockedPopup} />

      {showWelcome && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 px-6 animate-fade-in">
          <div className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-sage-500 via-terracotta-400 to-sage-500" />
            <div className="mb-4 flex items-center justify-center">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sage-100 text-3xl">
                🥳
              </span>
            </div>

            <div className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-terracotta-500">
              <Sparkles size={12} /> Invite Only <Sparkles size={12} />
            </div>

            <h3 className="text-lg font-bold tracking-wide text-sage-800">
              INVITE ONLY COUPON APPLIED
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Invite only coupon for first customer is applied. Please pick a{" "}
              <span className="font-semibold text-sage-700">free gift.</span>{" "}
            </p>

            <button
              onClick={handleWelcomeDismiss}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-terracotta-600"
            >
              Choose My Free Gift <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showUnlockedPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-fade-in"
          onClick={() => setShowUnlockedPopup(false)}
        >
          <div
            className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-100">
              <Gift size={28} className="text-sage-700" />
            </span>
            <h3 className="relative text-xl font-bold tracking-wide text-sage-800">
              2nd Gift Unlocked! 🎉
            </h3>
            <p className="relative mt-2 text-sm text-gray-600">
              Your second free gift is now available. Pick one from the collection below!
            </p>

            <button
              onClick={() => setShowUnlockedPopup(false)}
              className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-700 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sage-800"
            >
              Pick My 2nd Gift <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {showSharePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-fade-in"
          onClick={() => setShowSharePopup(false)}
        >
          <div
            className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-100">
              <Gift size={28} className="text-sage-700" />
            </span>
            <h3 className="text-xl font-bold tracking-wide text-sage-800">
              You've unlocked a 2nd gift 🥳!
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Share this <span className="font-semibold text-terracotta-500">FREE GIFT INVITE</span> with at least <span className="font-semibold text-terracotta-500"> 3 of your friends </span> to claim your second free gift.
            </p>

            <button
              onClick={handleWhatsAppShare}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#1da851]"
            >
              <Share2 size={18} /> Share on WhatsApp
            </button>

            <button
              onClick={() => setShowSharePopup(false)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-100 py-3 text-sm font-semibold text-sage-700 transition hover:bg-sage-200"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 animate-fade-in"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative w-full max-w-sm animate-pop overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti shower */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute top-0 block h-2 w-2 rounded-sm animate-confetti"
                  style={{
                    left: `${c.left}%`,
                    backgroundColor: c.color,
                    animationDelay: `${c.delay}s`,
                    animationDuration: `${c.duration}s`,
                  }}
                />
              ))}
            </div>

            <span className="relative mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-sage-100">
              <PartyPopper size={28} className="text-sage-700" />
            </span>
            <h3 className="relative font-cinzel text-xl font-bold tracking-wide text-sage-800">
              Your gift box is ready!
            </h3>
            <p className="relative mt-3 font-cinzel text-3xl font-bold tabular-nums text-terracotta-500">
              ₹{popupTotal.toLocaleString("en-IN")}
            </p>
            <p className="relative -mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-sage-700">
              worth
            </p>
            <p className="relative mt-2 text-xs text-gray-500">
              Buy any product on the next screen to claim them at ₹0.
            </p>

            <Link
              href="/redeem"
              className="relative mt-5 flex items-center justify-center gap-2 rounded-xl bg-terracotta-500 py-3 text-sm font-semibold text-white shadow transition hover:bg-terracotta-600"
            >
              Redeem My Gifts <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => setShowPopup(false)}
              className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-100 py-3 text-sm font-semibold text-sage-700 transition hover:bg-sage-200"
            >
              <RefreshCw size={15} /> Change Selection
            </button>
          </div>
        </div>
      )}

      <GiftProgressBar />

      <HeroCarousel />

      <section className="px-4 pt-4">
      
        <div className="mt-4 rounded-2xl bg-sage-50 p-4 text-sm leading-relaxed text-gray-700 ring-1 ring-black/5">
          <Step n={1} text="Pick the free gifts you love 💝" />
          <Step n={2} text="Add them to your gift box 🎁" />
          <Step n={3} text="Get them free on your first purchase 🛍️" />
        </div>
      </section>

      {/* Slow-moving feature strip */}
      <div className="overflow-hidden bg-sage-700 py-2">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE_ITEMS.map((label, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="px-6 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white"
                >
                  {label}
                  <span className="ml-6 text-white/70">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


      {gifts.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-full max-w-[480px] px-4">
          <Link
            href="/redeem"
            className={`flex items-center justify-center gap-1.5 rounded-xl bg-[#1A3C2A] py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#152e20] ${
              gifts.length >= 2 ? "animate-cta-glow" : ""
            }`}
          >
            Continue to Redeem <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <section id="pick-gifts" className="px-4 pt-5">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-bold text-gray-800">Pick your free gifts</h2>
          <span className="text-xs text-gray-400">All free with purchase</span>
        </div>
        {products.length === 0 ? (
          <EmptyState message="No free gifts available right now. Remove the `non-gift` tag from Shopify products to populate this screen." />
        ) : (
          <>
            {categories.length > 1 && (
              <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
                <button
                  onClick={() => selectCategory(null)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeCategory === null
                      ? "bg-sage-700 text-white"
                      : "bg-sage-100 text-sage-700"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                      activeCategory === cat.id
                        ? "bg-sage-700 text-white"
                        : "bg-sage-100 text-sage-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((p, i) => (
                <Fragment key={p.id}>
                  <GiftCard product={p} onLockedClick={() => setShowSharePopup(true)} />
                  {(i + 1) % 4 === 0 && i < filteredProducts.length - 1 && (
                    <div className="col-span-2 -mx-4 my-1">
                      <FeatureMarquee />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {hasNextPage && (
              <div
                ref={sentinelRef}
                className="flex items-center justify-center py-6"
              >
                {loadingMore && (
                  <Loader2 size={20} className="animate-spin text-sage-400" />
                )}
              </div>
            )}
          </>
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

// Pre-randomised confetti config so it's stable across re-renders within a
// session and doesn't mismatch between SSR and CSR.
const CONFETTI_COLORS = [
  "#d4af37", // gold
  "#f0d27a", // light gold
  "#b9694f", // terracotta
  "#5f7a54", // sage-600
  "#7c9885", // sage-500
];
const CONFETTI = Array.from({ length: 24 }, (_, i) => ({
  left: (i * 4.17 + (i % 5) * 7) % 100,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: (i % 8) * 0.12,
  duration: 1.8 + (i % 5) * 0.2,
}));

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sage-300 bg-sage-50 p-6 text-center text-sm text-sage-700">
      {message}
    </div>
  );
}

const MARQUEE_ITEMS = [
  "Gold Plated",
  "Waterproof",
  "Skin Friendly",
  "Free Shipping",
  "24Hr Easy Returns",
];
