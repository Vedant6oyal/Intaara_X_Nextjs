export type Product = {
  /** Shopify product GID (or local id when seeded). */
  id: string;
  /** Shopify variant GID — required for cart/checkout. Optional for legacy data. */
  variantId?: string;
  name: string;
  /** Current selling price in INR (rounded). */
  price: number;
  /** Compare-at / MRP in INR. Only set when greater than `price`. */
  mrp?: number;
  image: string;
  rating?: number;
  ratingCount?: number;
  tag?: string;
  /** Display category (derived from a Shopify product tag). */
  category?: string;
  /** Raw Shopify tags, useful for filtering. */
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  image: string;
};

export const GIFT_BUDGET = 1000;
