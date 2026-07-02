export {};

declare global {
  interface ShiprocketProduct {
    variantId: string;
    quantity: number;
  }

  interface ShiprocketBuyDirectArgs {
    /** Checkout initiation source. */
    type: "cart" | "product";
    products: ShiprocketProduct[];
    couponCode?: string;
    utmParams?: string;
    cartAttributes?: Record<string, unknown>;
  }

  interface ShiprocketCheckoutEvents {
    buyDirect: (args: ShiprocketBuyDirectArgs) => void;
  }

  interface Window {
    shiprocketCheckoutEvents?: ShiprocketCheckoutEvents;
  }
}
