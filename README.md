# Gift & Redeem — Mobile Ecommerce Web App

A mobile-first Next.js (App Router + TypeScript + Tailwind) ecommerce app with a twist:

## Two main screens

1. **Free Gifts** (`/`) — Build-your-own gift box. Pick complimentary products
   worth **up to ₹1000**. A live progress bar fills toward the ₹1000 limit, and a
   summary of selected gifts is shown. The budget is enforced (you can't exceed ₹1000).
2. **Redeem & Shop** (`/redeem`) — Category circles at the top (photo + name), a
   grid of purchasable products, and a sticky checkout bar. Buying a product
   "redeems" the free gifts you selected.

State is shared across both screens via `src/store/AppStore.tsx`.

## Shopify integration

Products are fetched from Shopify's **Storefront API**.

- Products tagged **`gift`** in Shopify show on the Free Gifts screen (`/`).
- All other products show on Redeem & Shop (`/redeem`).
- Categories on the redeem screen are derived from each product's first
  non-`gift` tag (e.g. `Studs`, `Hoops`, `Rings`).

### Setup

1. In Shopify admin → **Settings → Apps and sales channels → Develop apps**,
   create an app and configure Storefront API access with these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
2. Install the app and copy the **Storefront access token**.
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_STOREFRONT_TOKEN=...
   SHOPIFY_API_VERSION=2024-10
   ```
4. Tag the products you want as free gifts with `gift` in Shopify.

### Where the integration lives

- `src/lib/shopify.ts` — typed Storefront GraphQL client (server-only).
- `src/lib/products.ts` — `getGiftProducts()`, `getShopProducts()`,
  `deriveCategories()`.
- `src/app/page.tsx` and `src/app/redeem/page.tsx` are server components
  that fetch from Shopify and pass data to client subcomponents
  (`GiftingScreen`, `RedeemScreen`).

Pages use ISR with `revalidate = 60` (Shopify changes appear within ~1 min).

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill in Shopify creds
npm run dev
```

Open http://localhost:3000

## Checkout

The sticky button on `/redeem` posts cart + gift lines to
`@/Users/vedantgoyal/Desktop/projects/giftbox-app/src/app/api/checkout/route.ts`,
which calls Shopify's Storefront `cartCreate` mutation and redirects the user
to the returned `checkoutUrl`. If your store has Shiprocket Checkout installed
as a Shopify app, it will intercept that URL automatically — so the customer
gets your usual Shiprocket flow without any extra integration here.

Each gift line is tagged with the line-item attribute `_free_gift: true`, so
you can:

- create an automatic Shopify discount targeting that attribute, **or**
- set `SHOPIFY_GIFT_DISCOUNT_CODE` in `.env.local` to a discount code that
  zeroes those line items.

## Persistence

Selected gifts and cart contents are stored in `localStorage` under the key
`giftbox-app:v1` (see `@/Users/vedantgoyal/Desktop/projects/giftbox-app/src/store/AppStore.tsx`).
A refresh or new tab restores the previous selection.

## Roadmap

- Optional: switch to direct Shiprocket Checkout API instead of the
  Shopify-cart-handoff approach.
