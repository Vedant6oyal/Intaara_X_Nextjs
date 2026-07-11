"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { SHIPROCKET_SELLER_DOMAIN } from "@/lib/shiprocket";

/**
 * Shiprocket (Fastrr) checkout assets — only loaded on pages where checkout
 * can happen (redeem + product details). Skipped on the gifting page to save
 * bandwidth and avoid the crypto.subtle error on non-secure contexts.
 */
export default function ShiprocketLoader() {
  const pathname = usePathname();

  // Gifting page has no cart/checkout — skip loading Shiprocket entirely.
  if (pathname === "/") return null;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css"
      />
      <input type="hidden" id="sellerDomain" value={SHIPROCKET_SELLER_DOMAIN} readOnly />
      <Script
        src="https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js"
        strategy="afterInteractive"
      />
    </>
  );
}
