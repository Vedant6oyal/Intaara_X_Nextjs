/**
 * Shiprocket (Fastrr) checkout helpers — safe to import on the client.
 */

/** Seller domain Shiprocket has your configuration saved under. */
export const SHIPROCKET_SELLER_DOMAIN =
  process.env.NEXT_PUBLIC_SHIPROCKET_SELLER_DOMAIN ?? "";

/** Optional coupon auto-applied at checkout (e.g. to make free gifts ₹0). */
export const SHIPROCKET_COUPON_CODE =
  process.env.NEXT_PUBLIC_SHIPROCKET_COUPON_CODE ?? "";

/**
 * Shiprocket expects the *numeric* Shopify variant id, while the Storefront
 * API returns a GID like `gid://shopify/ProductVariant/1234567890`. Pull out
 * the trailing number (ignoring any `?key=` suffix).
 */
export function toNumericVariantId(gid: string): string {
  const match = gid.match(/(\d+)(?:\?.*)?$/);
  return match ? match[1] : gid;
}
