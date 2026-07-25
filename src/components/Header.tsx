"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Gift, X, Truck, RotateCcw, ShieldCheck, FileText, Home, Sparkles, Heart } from "lucide-react";
import { useAppStore } from "@/store/AppStore";

export default function Header({ title = "INTAARA" }: { title?: string }) {
  const { cartCount, gifts, openCart, wishlist, openWishlist } = useAppStore();
  const pathname = usePathname();
  const isGiftScreen = pathname === "/";
  const isRedeemScreen = pathname === "/redeem";
  const shouldHideOnScroll = isGiftScreen || isRedeemScreen;

  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const menuLinks = [
    { href: "/", label: "Pick Free Gift", icon: Sparkles },
    { href: "/redeem", label: "Shop", icon: Home },
  ];

  const policyLinks = [
    { href: "/policies/shipping", label: "Shipping & Delivery", icon: Truck },
    { href: "/policies/returns", label: "Refund & Exchange", icon: RotateCcw },
    { href: "/policies/privacy", label: "Privacy Policy", icon: ShieldCheck },
    { href: "/policies/terms", label: "Terms of Service", icon: FileText },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-sage-700/95 backdrop-blur border-b border-white/10 transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className="text-cream/90 transition hover:text-white"
          >
            <Menu size={24} />
          </button>

          <img
            src="https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Intaara_logo_text_gold.avif"
            alt={title}
            className="h-10 w-auto object-contain"
          />

          <div className="flex items-center gap-3 text-cream/90">
            <Link href="/" aria-label="Pick free gifts" className="relative transition hover:text-white">
              <Gift size={22} />
              {gifts.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-terracotta-500 text-[10px] font-bold text-white ring-2 ring-sage-700">
                  {gifts.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Open wishlist"
              onClick={openWishlist}
              className="relative transition hover:text-white"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-sage-700">
                  {wishlist.length}
                </span>
              )}
            </button>
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

      {/* Hamburger menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <span className="font-cinzel text-lg font-bold text-gray-900">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col px-3 py-4">
              {menuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      pathname === link.href
                        ? "bg-sage-50 text-sage-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-3 border-t border-black/5" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  openWishlist();
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Heart size={18} />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <div className="my-3 border-t border-black/5" />

              {policyLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
