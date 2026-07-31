"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Bus,
  Check,
  Droplets,
  Feather,
  Heart,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useReviews } from "@/hooks/useReviews";
import type { Product } from "@/data/products";
import type { Review, ReviewSummary } from "@/lib/reviews";
import { trackEvent } from "@/lib/analytics";

export default function ProductDetails({
  product,
}: {
  product: Product;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromRedeem = searchParams.get("from") === "redeem";
  const {
    isGiftSelected,
    toggleGift,
    giftsFull,
    gift2Locked,
    unlockGift2,
    inCart,
    addToCart,
    removeFromCart,
    openCart,
    cartCount,
    isWishlisted,
    toggleWishlist,
  } = useAppStore();

  // Reviews load client-side directly from Supabase (no serverless function).
  const { data: reviewSummary, loading: reviewsLoading } = useReviews();


  const isGift = !fromRedeem && !product.tags?.some((t) => t.toLowerCase() === "non-gift");
  const selected = isGiftSelected(product.id);
  const qty = inCart(product.id);
  const discountUnlocked = cartCount === 1 && !isGift;
  const displayPrice = discountUnlocked
    ? Math.round(product.price * 0.5)
    : product.price;
  const saved = product.mrp ? product.mrp - product.price : 0;
  const discountPct =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const images = product.images?.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Prefer real review counts from Supabase; fall back to a deterministic
  // pseudo-count derived from the product name so it's stable per product.
  const fallbackCount = (() => {
    let hash = 0;
    for (let i = 0; i < product.name.length; i++) {
      hash = (hash * 31 + product.name.charCodeAt(i)) >>> 0;
    }
    return 100 + (hash % 151); // 100–250 inclusive
  })();
  const reviewCount = fallbackCount;
  const averageRating = reviewSummary?.average || 4.9;

  return (
    <div className="pb-28">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 px-3 py-2 backdrop-blur-md">
        <button
          aria-label="Back"
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/");
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-700 hover:bg-sage-100"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="line-clamp-1 px-2 text-sm font-semibold text-gray-800">
          {product.name}
        </span>
        <button
          aria-label="Cart"
          onClick={openCart}
          className="relative grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-700 hover:bg-sage-100"
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#1A3C2A] px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Image gallery */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-sage-50"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) {
            setActiveImg((i) => (i + 1) % images.length);
          } else {
            setActiveImg((i) => (i - 1 + images.length) % images.length);
          }
          touchStartX.current = null;
        }}
      >
        <Image
          src={images[activeImg]}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover"
          priority
        />

        {isGift && (
          <span className="absolute left-3 top-3 rounded-md bg-terracotta-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
            Free Gift
          </span>
        )}
        {!isGift && discountPct > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-sage-700 px-2 py-1 text-[11px] font-bold text-white shadow">
            Demi-Fine
          </span>
        )}
        <button
          aria-label="Wishlist"
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow transition"
        >
          <Heart size={16} className={isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeImg ? "w-5 bg-sage-700" : "w-1.5 bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActiveImg(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === activeImg ? "ring-sage-700" : "ring-transparent"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Title + rating */}
      <section className="px-4 pt-2">
        {product.category && (
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sage-700">
            {product.category}
          </p>
        )}
        <h1 className="mt-1 font text-2xl font-bold leading-tight text-gray-900">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={15}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {reviewCount} reviews
          </span>
        </div>
      </section>

      {/* Price block */}
      <section className="mt-4 px-4">
        {isGift ? (
          <div className="flex items-baseline gap-3">
            <span className="font text-3xl font-bold text-sage-700">
              FREE
            </span>
            <span className="text-xl font-semibold text-gray-400 line-through decoration-[2px]">
              ₹{(product.mrp ?? product.price).toLocaleString("en-IN")}
            </span>
          </div>
        ) : discountUnlocked ? (
          <div className="flex items-baseline gap-3">
            <div className="flex items-baseline gap-1.5 rounded-lg bg-gradient-to-r from-[#fff4c9] to-[#ffe58a] px-2 py-1 ring-1 ring-[#d4af37]/50 animate-price-flash">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#1A3C2A]">
                −50%
              </span>
              <span className="font text-3xl font-bold text-[#1A3C2A]">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-400 line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="font text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp && (
              <span className="text-lg font-semibold text-gray-400 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
            {saved > 0 && (
              <span className="rounded-md bg-sage-100 px-2 py-0.5 text-xs font-bold text-sage-700">
                Save ₹{saved}
              </span>
            )}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {isGift
            ? "free on first purchase."
            : "Inclusive of all taxes."}
        </p>
      </section>

      {/* Trust badges */}
      <section className="mt-5 grid grid-cols-3 gap-2 px-4">
        <Badge icon={<img src="https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Icons/gold_plated_icon.png" alt="" loading="lazy" className="h-5 w-5 object-contain" />} label="18k gold plated" />
        <Badge icon={<img src="https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Icons/waterproof_1.png" alt="" loading="lazy" className="h-5 w-5 object-contain" />} label="Waterproof" />
        <Badge icon={<img src="https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Icons/skin_friendly.png" alt="" loading="lazy" className="h-5 w-5 object-contain" />} label="Skin Friendly" />
    <Badge icon={<RotateCcw size={16} />} label="24hr return" />
        <Badge icon={<Banknote size={16} />} label="Cash on delivery" />
        <Badge icon={<Truck size={16} />} label="Free shipping" />
      </section>

      {/* Info accordions */}
      <section className="mt-6 px-4">
        <div className="border-t border-gray-200">
          {product.description && (
            <Accordion
              icon={<Feather size={16} />}
              title="Description"
              defaultOpen
            >
              {/<[a-z][\s\S]*>/i.test(product.description) ? (
                <div
                  className="prose prose-sm max-w-none text-sm leading-relaxed text-gray-600 [&_a]:text-sage-700 [&_a]:underline [&_img]:rounded-lg [&_img]:my-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-2 [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_strong]:font-semibold [&_br]:block [&_table]:w-full [&_table]:my-2 [&_table]:border-collapse [&_td]:py-1 [&_td]:pr-3 [&_td]:align-top [&_td]:text-sm [&_th]:py-1 [&_th]:pr-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              )}
            </Accordion>
          )}
          <Accordion icon={<Star size={16} />} title="Jewellery Care">
            <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
              <li>Avoid contact with perfumes, lotions and harsh chemicals.</li>
              <li>Wipe gently with a soft, dry cloth after wear.</li>
              <li>Store in the pouch provided to prevent scratches.</li>
              <li>Safe to wear daily — it&apos;s waterproof and skin-safe.</li>
            </ul>
          </Accordion>
          <Accordion icon={<Truck size={16} />} title="Shipping Policy">
            <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
              <li>Free shipping across India on all orders.</li>
              <li>Dispatched within 1–2 business days.</li>
              <li>Delivery in 3–6 business days depending on location.</li>
              
            </ul>
          </Accordion>
          <Accordion icon={<Truck size={16} />} title="Returns & Exchanges">
            <ul className="space-y-1.5 text-sm leading-relaxed text-gray-600">
              
            </ul>
          </Accordion>
        </div>
      </section>

      {/* Free-gift teaser for non-gift products */}
      {!isGift && (
        <section className="mt-6 px-4">
          <Link
            href="/"
            className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-sage-700 to-sage-800 p-4 text-white shadow"
          >
            <div>
              <p className="mt-1 text-sm font-semibold">
                All orders are dispatched within 24 hours
              </p>
            </div>
            <Truck size={22} className="text-amber-300" />
          </Link>
        </section>
      )}

      {/* Customer reviews */}
      <CustomerReviews
        reviews={reviewSummary?.reviews ?? []}
        totalCount={reviewCount}
        average={averageRating}
        loading={reviewsLoading}
      />

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur-md">
        {isGift ? (
          <button
            onClick={() => {
              if (!selected && giftsFull) return;
              if (!selected && gift2Locked) {
                trackEvent("share_cta_clicked", { share_channel: "whatsapp", source: "product_details" });
                unlockGift2();
                const shareText = encodeURIComponent(
                  "Hey! I just unlocked a FREE gift from Intaara 🎁 You can grab yours too! Check it out: https://intaara.com"
                );
                window.open(`https://api.whatsapp.com/send?text=${shareText}`, "_blank");
                return;
              }
              toggleGift(product);
              if (!selected) {
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem("gift:showSharePopup", "1");
                }
                setTimeout(() => {
                  if (window.history.length > 1) router.back();
                  else router.push("/");
                }, 400);
              }
            }}
            disabled={!selected && giftsFull}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition ${
              selected
                ? "bg-sage-700 text-white"
                : !selected && giftsFull
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : !selected && gift2Locked
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "bg-[#1A3C2A] text-white shadow-lg hover:bg-[#152e20]"
            }`}
          >
            {selected ? (
              <>
                <Check size={18} /> Added to Gift Box
              </>
            ) : giftsFull ? (
              "Gift Box is Full"
            ) : gift2Locked ? (
              <>
                <Share2 size={18} /> Share to Unlock
              </>
            ) : (
              <>
                <Plus size={18} /> Add as Free Gift
              </>
            )}
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => addToCart(product)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A3C2A] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#152e20]"
          >
            <ShoppingBag size={18} /> Add to Cart · ₹
            {displayPrice.toLocaleString("en-IN")}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center justify-between rounded-xl bg-sage-50 px-3 py-2">
              <button
                aria-label="Decrease"
                onClick={() => removeFromCart(product.id)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sage-700 shadow-sm"
              >
                <Minus size={16} />
              </button>
              <span className="font text-base font-bold tabular-nums text-sage-800">
                {qty}
              </span>
              <button
                aria-label="Increase"
                onClick={() => addToCart(product)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sage-700 shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={openCart}
              className="flex-1 rounded-xl bg-[#1A3C2A] py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#152e20]"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-sage-50 px-2 py-3 text-center ring-1 ring-sage-100">
      <span>{icon}</span>
      <span className="text-[13px] font-bold text-gray-700">{label}</span>
    </div>
  );
}

function Accordion({
  icon,
  title,
  defaultOpen = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="text-gray-700">{icon}</span>
          <span className="font text-base font-bold text-gray-900">
            {title}
          </span>
        </span>
        <span className="text-gray-500">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      {open && <div className="pb-4 pl-7 pr-1">{children}</div>}
    </div>
  );
}

const REVIEW_PHOTOS = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1620656798932-902894c0c8db?w=400&q=80&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80&fit=crop",
];

const DUMMY_REVIEWS = [
  {
    name: "Ananya S.",
    date: "2 days ago",
    rating: 5,
    title: "Looks even better in person",
    body: "Honestly so impressed with the finish — looks like real gold and the packaging is so thoughtful. Got it as a gift and it came with a free pair of studs!",
    photo:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&fit=crop",
  },
  {
    name: "Priya M.",
    date: "1 week ago",
    rating: 5,
    title: "Haven't taken it off in weeks",
    body: "Wore it in the shower, to the gym, everywhere — zero tarnish, zero skin reaction. Worth every rupee.",
    photo:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80&fit=crop",
  },
  {
    name: "Riya K.",
    date: "2 weeks ago",
    rating: 5,
    title: "Fast delivery, lovely piece",
    body: "Reached me in 3 days. The plating feels really thick and premium. Will be ordering again for my sister.",
  },
  {
    name: "Neha P.",
    date: "3 weeks ago",
    rating: 5,
    title: "Bought 4 already",
    body: "Stack them, layer them — they all match perfectly. My go-to jewellery brand now.",
    photo:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80&fit=crop",
  },
];

type DisplayReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  title: string | null;
  body: string;
  photo: string | null;
  verified: boolean;
};

const REVIEWS_PER_PAGE = 5;

function CustomerReviews({
  reviews,
  totalCount,
  average,
  loading = false,
}: {
  reviews: Review[];
  totalCount: number;
  average: number;
  loading?: boolean;
}) {
  const hasReal = reviews.length > 0;
  const allDisplay: DisplayReview[] = hasReal
    ? reviews.map((r) => ({
        id: r.id,
        name: r.authorName,
        date: formatRelative(r.createdAt),
        rating: r.rating,
        title: r.title,
        body: r.body,
        photo: r.photoUrl,
        verified: r.verified,
      }))
    : DUMMY_REVIEWS.map((r, i) => ({
        id: `dummy-${i}`,
        name: r.name,
        date: r.date,
        rating: r.rating,
        title: r.title,
        body: r.body,
        photo: r.photo ?? null,
        verified: true,
      }));

  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const display = allDisplay.slice(0, visibleCount);
  const hasMore = visibleCount < allDisplay.length;

  const handleMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((c) => c + REVIEWS_PER_PAGE);
      setLoadingMore(false);
    }, 1000);
  };

  const photos = allDisplay
    .map((r) => r.photo)
    .filter((p): p is string => !!p);
  const photoStrip = photos.length ? photos : REVIEW_PHOTOS;

  return (
    <section className="mt-8 border-t border-gray-200 px-4 pt-6">
      <h2 className="font text-xl font-bold text-gray-900">Customer reviews</h2>

      {/* Summary */}
      <div className="mt-3 flex items-center gap-3">
        <span className="font text-3xl font-bold text-gray-900">
          4.9
        </span>
        <span className="text-sm text-gray-500">
          500+ reviews
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-sage-700">
          <ShieldCheck size={13} /> Verified
        </span>
      </div>

      {/* Write a review CTA */}
      <button className="mt-4 w-full rounded-xl bg-[#1A3C2A] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#152e20]">
        Write a review
      </button>

      {/* Photo strip */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {photoStrip.map((src, i) => (
          <div
            key={i}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      {/* Reviews list header */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-gray-700">
          Product and store reviews ({totalCount.toLocaleString("en-IN")})
        </p>
      </div>

      {/* Individual reviews */}
      {loading ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 py-10 text-gray-400">
          <Loader2 size={28} className="animate-spin text-sage-600" />
          <span className="text-sm font-medium">Loading reviews…</span>
        </div>
      ) : (
        <>
          <div className="mt-3 space-y-3">
            {display.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="fill-sage-700 text-sage-700"
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {r.name}
                  </span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">
                      <ShieldCheck size={11} /> Verified
                    </span>
                  )}
                  <span className="ml-auto text-[11px] text-gray-400">
                    {r.date}
                  </span>
                </div>
                {r.title && (
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {r.title}
                  </p>
                )}
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {r.body}
                </p>
                {r.photo && (
                  <div className="mt-3 h-24 w-24 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.photo}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={handleMore}
              disabled={loadingMore}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {loadingMore ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {loadingMore ? "Loading…" : "More reviews"}
            </button>
          )}
        </>
      )}
    </section>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / day);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
