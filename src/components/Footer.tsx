"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/products";
import { useAppStore } from "@/store/AppStore";

const legalLinks = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Refund & Exchange", href: "/policies/returns" },
  { label: "Terms of Service", href: "/policies/terms" },
  { label: "Shipping Policy", href: "/policies/shipping" },
];

export default function Footer({ categories }: { categories: Category[] }) {
  const { openWishlist } = useAppStore();
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  // Reuse the redeem screen's category mechanism: persist the selected
  // collection id then navigate to /redeem, which reads it on mount.
  const goToCollection = (categoryId: string | null) => {
    if (typeof window !== "undefined") {
      if (categoryId) window.sessionStorage.setItem("redeem:category", categoryId);
      else window.sessionStorage.removeItem("redeem:category");
    }
    router.push("/redeem");
  };

  return (
    <footer className="bg-sage-700 px-6 pb-28 pt-8 font-sans text-cream">
      {/* Newsletter */}
      <form onSubmit={handleSubscribe} className="mb-10">
        <div className="flex items-stretch overflow-hidden rounded-sm border border-cream/25">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-cream placeholder:text-cream/50 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="grid w-14 place-items-center border-l border-[#d4af37] bg-transparent text-cream transition hover:bg-[#d4af37]/10"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* Shop + Company */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4 font-cinzel text-lg font-semibold text-cream">
            Shop
          </h3>
          <ul className="space-y-3 text-[15px] text-cream/85">
            <li>
              <button
                onClick={() => goToCollection(null)}
                className="text-left transition hover:text-white"
              >
                Collections
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => goToCollection(cat.id)}
                  className="text-left transition hover:text-white"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-cinzel text-lg font-semibold text-cream">
            Company
          </h3>
          <ul className="space-y-3 text-[15px] text-cream/85">
            <li>
              <a
                href="mailto:help@intaara.in"
                className="transition hover:text-white"
              >
                Contact
              </a>
            </li>
            <li>
              <Link href="/" className="transition hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <button
                onClick={openWishlist}
                className="transition hover:text-white"
              >
                Wishlist
              </button>
            </li>
            <li>
              <Link href="/" className="transition hover:text-white">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Legal */}
      <div className="mt-10">
        <h3 className="mb-4 font-cinzel text-lg font-semibold text-cream">
          Legal
        </h3>
        <ul className="space-y-3 text-[15px] text-cream/85">
          <li>
            <a
              href="mailto:help@intaara.in"
              className="transition hover:text-white"
            >
              Contact Information
            </a>
          </li>
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 border-t border-cream/15 pt-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} INTAARA. All rights reserved.
      </div>
    </footer>
  );
}
