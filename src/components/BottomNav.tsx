"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, ShoppingBag } from "lucide-react";

const tabs = [
  { href: "/", label: "Free Gifts", icon: Gift },
  { href: "/redeem", label: "Redeem & Shop", icon: ShoppingBag },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-black/5 bg-white/95 backdrop-blur">
      <div className="grid grid-cols-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${
                active ? "text-sage-700" : "text-gray-400"
              }`}
            >
              <Icon size={22} className={active ? "fill-sage-100" : ""} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
