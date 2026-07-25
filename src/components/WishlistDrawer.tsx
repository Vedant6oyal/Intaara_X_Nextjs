"use client";

import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Heart, Trash2, X } from "lucide-react";
import { useAppStore } from "@/store/AppStore";

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    closeWishlist,
    toggleWishlist,
    addToCart,
    openCart,
  } = useAppStore();

  return (
    <Dialog.Root open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[400px] max-w-[85vw] flex-col bg-white shadow-2xl animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <Dialog.Title className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Heart size={20} className="fill-red-500 text-red-500" />
              Wishlist
              {wishlist.length > 0 && (
                <span className="text-sm font-medium text-gray-400">
                  ({wishlist.length})
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close wishlist"
                className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          {wishlist.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <Heart size={48} className="text-gray-200" />
              <p className="text-sm font-medium text-gray-500">
                Your wishlist is empty
              </p>
              <p className="text-xs text-gray-400">
                Tap the heart icon on any product to save it here.
              </p>
              <Dialog.Close asChild>
                <Link
                  href="/redeem"
                  className="mt-2 rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-800"
                >
                  Browse Products
                </Link>
              </Dialog.Close>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {wishlist.map((product) => {
                  const href = product.handle
                    ? `/product/${product.handle}?from=redeem`
                    : "#";
                  return (
                    <div
                      key={product.id}
                      className="flex gap-3 rounded-xl border border-gray-100 p-3 shadow-sm"
                    >
                      <Link
                        href={href}
                        onClick={closeWishlist}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sage-50"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={href}
                          onClick={closeWishlist}
                          className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-sage-700"
                        >
                          {product.name}
                        </Link>
                        <span className="mt-1 text-sm font-bold text-sage-700">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <div className="mt-auto flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(product);
                              closeWishlist();
                              openCart();
                            }}
                            className="rounded-lg bg-sage-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sage-700"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product)}
                            aria-label="Remove from wishlist"
                            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
