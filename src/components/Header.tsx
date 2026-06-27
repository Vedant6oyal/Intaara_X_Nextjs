"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Gift } from "lucide-react";
import { useAppStore } from "@/store/AppStore";

export default function Header({ title = "INTAARA" }: { title?: string }) {
  const { cartCount, gifts, openCart } = useAppStore();
  const pathname = usePathname();
  const isGiftScreen = pathname === "/";
  const isRedeemScreen = pathname === "/redeem";
  const shouldHideOnScroll = isGiftScreen || isRedeemScreen;

  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!shouldHideOnScroll) {
      setHidden(false);
      return;
    }

    const onScroll = () => {
      setHidden(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldHideOnScroll]);

  return (
    <header
      className={`sticky top-0 z-30 bg-sage-700/95 backdrop-blur border-b border-white/10 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <button aria-label="Menu" className="text-cream/90 transition hover:text-white">
          <Menu size={24} />
        </button>

        <img
          src="https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Intaara_logo_text_gold.avif"
          alt={title}
          className="h-10 w-auto object-contain"
        />

        <div className="flex items-center gap-3 text-cream/90">
          <div className="relative">
            <Gift size={22} />
            {gifts.length > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-terracotta-500 text-[10px] font-bold text-white ring-2 ring-sage-700">
                {gifts.length}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative transition hover:text-white"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#d4af37] text-[10px] font-bold text-sage-900 ring-2 ring-sage-700">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
