"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Gift,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { useCountUp } from "@/hooks/useCountUp";

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

  const mrpTotal = cart.reduce(
    (s, l) => s + (l.product.mrp ?? l.product.price) * l.qty,
    0
  );
  const savings = mrpTotal - cartTotal;

  async function handleCheckout() {
    setError(null);

    const cartLines = cart
      .filter((l) => l.product.variantId)
      .map((l) => ({
        variantId: l.product.variantId as string,
        qty: l.qty,
        isGift: false,
      }));

    const giftLines = gifts
      .filter((g) => g.variantId)
      .map((g) => ({
        variantId: g.variantId as string,
        qty: 1,
        isGift: true,
      }));

    const lines = [...cartLines, ...giftLines];
    if (lines.length === 0) {
      setError("Nothing in your cart to checkout.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
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
                {cart.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {cart.map((line) => {
                      const p = line.product;
                      const saved = p.mrp ? p.mrp - p.price : 0;
                      return (
                        <li
                          key={p.id}
                          className="flex gap-3 rounded-xl bg-gray-50 p-3"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-20 w-20 shrink-0 rounded-lg object-cover"
                          />
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                {p.name}
                              </h3>
                              <button
                                aria-label={`Remove ${p.name}`}
                                onClick={() => {
                                  for (let i = 0; i < line.qty; i++)
                                    removeFromCart(p.id);
                                }}
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

                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2 rounded-md ring-1 ring-gray-200">
                                <button
                                  aria-label="Decrease"
                                  onClick={() => removeFromCart(p.id)}
                                  className="grid h-7 w-7 place-items-center rounded-md text-gray-700 transition hover:bg-gray-100"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="min-w-[16px] text-center text-sm font-semibold">
                                  {line.qty}
                                </span>
                                <button
                                  aria-label="Increase"
                                  onClick={() => addToCart(p)}
                                  className="grid h-7 w-7 place-items-center rounded-md text-gray-700 transition hover:bg-gray-100"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-gray-900">
                                ₹{p.price * line.qty}
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
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sage-700">
                      <Gift size={14} /> Free gifts ({gifts.length})
                    </div>
                    <ul className="flex flex-col gap-2">
                      {gifts.map((g) => (
                        <li
                          key={g.id}
                          className="flex items-center gap-3 rounded-xl bg-sage-50 p-3 ring-1 ring-sage-100"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={g.image}
                            alt={g.name}
                            className="h-12 w-12 shrink-0 rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-gray-800">
                              {g.name}
                            </p>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-sage-700">
                              Free
                            </p>
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
                    {mrpTotal > cartTotal && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{mrpTotal}
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
