"use client";

import Script from "next/script";
import { SHIPROCKET_SELLER_DOMAIN } from "@/lib/shiprocket";

/**
 * Shiprocket (Fastrr) checkout assets — loaded everywhere since any page
 * can add to cart and start checkout.
 */
export default function ShiprocketLoader() {
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
