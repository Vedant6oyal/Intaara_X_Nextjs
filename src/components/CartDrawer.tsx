"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Gift,
  Loader2,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useCountUp } from "@/hooks/useCountUp";
import { trackEvent } from "@/lib/analytics";
import { toNumericVariantId, SHIPROCKET_COUPON_CODE } from "@/lib/shiprocket";

export default function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    closeCart,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    gifts,
    giftTotal,
    toggleGift,
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expandedItems = useMemo(() => {
    const items: { product: typeof cart[number]["product"] }[] = [];
    cart.forEach((line) => {
      for (let i = 0; i < line.qty; i++) {
        items.push({ product: line.product });
      }
    });
    return items;
  }, [cart]);

  const mrpTotal = cart.reduce(
    (s, l) => s + (l.product.mrp ?? l.product.price) * l.qty,
    0
  );
  const savings = mrpTotal - cartTotal + giftTotal;
  const totalMrp = mrpTotal + giftTotal;

  function handleCheckout() {
    setError(null);

    if (cart.length === 0) {
      setError("Nothing in your cart to checkout.");
      return;
    }

    setLoading(true);
    trackEvent("checkout_started", {
      gift_count: gifts.length,
      redeem_item_count: cartCount,
      cart_value: cartTotal,
    });

    // Build Shiprocket product list: cart items + free gifts.
    const products: ShiprocketProduct[] = [
      ...cart.flatMap((line) =>
        Array.from({ length: line.qty }, () => ({
          variantId: toNumericVariantId(line.product.variantId ?? line.product.id),
          quantity: 1,
        }))
      ),
      ...gifts.map((g) => ({
        variantId: toNumericVariantId(g.variantId ?? g.id),
        quantity: 1,
      })),
    ];

    const cartAttributes: Record<string, unknown> = {
      gift_count: gifts.length,
      gift_total: giftTotal,
    };

    const buyDirect = window.shiprocketCheckoutEvents?.buyDirect;
    if (!buyDirect) {
      setError("Checkout is not ready yet. Please try again in a moment.");
      setLoading(false);
      return;
    }

    buyDirect({
      type: "cart",
      products,
      couponCode: SHIPROCKET_COUPON_CODE || undefined,
      cartAttributes,
    });
    setLoading(false);
  }

  return (
    <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
        />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white shadow-2xl outline-none data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <Dialog.Title className="flex items-center gap-2 text-base font-bold tracking-wide text-gray-900">
              YOUR CART
              {cartCount > 0 && (
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-gray-900 px-1.5 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100"
            >
              <X size={20} />
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cartCount === 0 && gifts.length === 0 ? (
              <EmptyState onClose={closeCart} />
            ) : (
              <>
                {cart.length === 0 && gifts.length > 0 && (
                  <Link
                    href="/redeem"
                    onClick={closeCart}
                    className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-terracotta-300 bg-terracotta-50 px-4 py-3 transition hover:bg-terracotta-100"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terracotta-500 text-white">
                      <ShoppingBag size={18} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-terracotta-800">
                        One last step!
                      </p>
                      <p className="text-xs text-terracotta-600">
                        Purchase any product to claim your gifts at ₹0
                      </p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-terracotta-500" />
                  </Link>
                )}

                {cart.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {expandedItems.map((item, idx) => {
                      const p = item.product;
                      const saved = p.mrp ? p.mrp - p.price : 0;
                      return (
                        <li
                          key={`${p.id}-${idx}`}
                          className="flex gap-3 rounded-xl bg-gray-50 p-3"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                {p.name}
                              </h3>
                              <button
                                aria-label={`Remove ${p.name}`}
                                onClick={() => removeFromCart(p.id)}
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="text-sm font-bold text-gray-900">
                                ₹{p.price}
                              </span>
                              {p.mrp && p.mrp > p.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{p.mrp}
                                </span>
                              )}
                              {saved > 0 && (
                                <span className="rounded bg-sage-100 px-1.5 py-0.5 text-[10px] font-semibold text-sage-700">
                                  Save ₹{saved}
                                </span>
                              )}
                            </div>

                            <div className="mt-auto flex items-center justify-end pt-2">
                              <span className="text-sm font-bold text-gray-900">
                                ₹{p.price}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {gifts.length > 0 && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sage-700">
                      🎁 Free gifts ({gifts.length})
                      <span className="ml-auto flex items-baseline gap-1.5">
                        <span className="text-sm font-bold line-through">
                          ₹{giftTotal}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-sage-700">
                          FREE
                        </span>
                      </span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {gifts.map((g) => (
                        <li
                          key={g.id}
                          className="flex items-center gap-3 rounded-xl bg-sage-50 p-3 ring-1 ring-sage-100"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={g.image}
                              alt={g.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-gray-800">
                              {g.name}
                            </p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold line-through">
                                ₹{g.price}
                              </span>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-700">
                                Free
                              </p>
                            </div>
                          </div>
                          <button
                            aria-label={`Remove ${g.name}`}
                            onClick={() => toggleGift(g)}
                            className="grid h-7 w-7 place-items-center rounded-md text-sage-700 transition hover:bg-sage-100"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    {giftTotal > 0 && <SavingsBanner amount={giftTotal} open={cartOpen} />}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {cartCount > 0 && (
            <div className="border-t border-black/5 bg-white px-5 py-4">
              {error && (
                <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}

              <div className="mb-3 flex items-end justify-between">
                <div>
                  {savings > 0 && (
                    <span className="inline-block rounded-md bg-sage-50 px-2 py-0.5 text-[11px] font-semibold text-sage-700 ring-1 ring-sage-100">
                      Saving ₹{savings}
                    </span>
                  )}
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{cartTotal}
                    </span>
                    {totalMrp > cartTotal && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{totalMrp}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex w-full items-center justify-between rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-black disabled:opacity-70"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Checkout
                </span>
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SavingsBanner({ amount, open }: { amount: number; open: boolean }) {
  const value = useCountUp(amount, `${open}-${amount}`);

  return (
    <div
      key={`${open}-${amount}`}
      className="mt-3 flex items-center gap-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-3.5 py-2.5 animate-pop"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Sparkles size={14} />
      </span>
      <p className="text-[13px] font-semibold leading-tight text-emerald-800">
        <span className="font-bold">Yay!</span> you saved{" "}
        <span className="font-bold tabular-nums">
          ₹{value.toLocaleString("en-IN")}
        </span>{" "}
        with free gifts
      </p>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-400">
        <ShoppingBag size={28} />
      </span>
      <h3 className="text-base font-semibold text-gray-800">
        Your cart is empty
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Pick free gifts and add products to redeem them.
      </p>
      <button
        onClick={onClose}
        className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Continue shopping
      </button>
    </div>
  );
}
