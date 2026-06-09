"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Gift } from "lucide-react";
import { useAppStore } from "@/store/AppStore";

export default function Header({ title = "INTAARA" }: { title?: string }) {
  const { cartCount, gifts, openCart } = useAppStore();
  const pathname = usePathname();
  const isGiftScreen = pathname === "/";

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isGiftScreen) {
      setHidden(false);
      return;
    }

    const onScroll = () => {
      setHidden(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isGiftScreen]);

  return (
    <header
      className={`sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-black/5 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <button aria-label="Menu" className="text-sage-800">
          <Menu size={24} />
        </button>

        <h1 className="font-serif text-xl font-bold tracking-wide text-terracotta-600">
          {title}
        </h1>

        <div className="flex items-center gap-3 text-sage-800">
          <div className="relative">
            <Gift size={22} />
            {gifts.length > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-terracotta-500 text-[10px] font-bold text-white">
                {gifts.length}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-sage-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
