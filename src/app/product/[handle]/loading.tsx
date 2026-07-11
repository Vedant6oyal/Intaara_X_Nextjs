import { ArrowLeft, ShoppingBag } from "lucide-react";

/**
 * Instant skeleton shown while the server component fetches the product from
 * Shopify. Next.js renders this immediately on navigation (Suspense boundary),
 * so the user gets feedback instead of staring at the previous page.
 */
export default function ProductLoading() {
  return (
    <div className="pb-28">
      {/* Sticky top bar (mirrors ProductDetails) */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white/95 px-3 py-2 backdrop-blur-md">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-300">
          <ArrowLeft size={18} />
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-sage-300">
          <ShoppingBag size={18} />
        </div>
      </div>

      {/* Main image */}
      <div className="aspect-square w-full animate-pulse bg-gray-200" />

      {/* Thumbnails */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>

      {/* Title + rating */}
      <div className="px-4 pt-2">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-40 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Price */}
      <div className="mt-4 px-4">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Trust badges */}
      <div className="mt-5 grid grid-cols-3 gap-2 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>

      {/* Description block */}
      <div className="mt-6 space-y-2 px-4">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
