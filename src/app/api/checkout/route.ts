import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

export const runtime = "nodejs";

type IncomingLine = {
  variantId: string;
  qty: number;
  isGift?: boolean;
};

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Storefront API cart IDs look like:
 *   gid://shopify/Cart/<TOKEN>?key=<KEY>
 * The storefront accepts /cart/c/<TOKEN>?key=<KEY> to load that cart on /cart.
 */
function parseCartId(id: string): { token: string; key: string } | null {
  const match = id.match(/Cart\/([^?]+)\?key=(.+)$/);
  if (!match) return null;
  return { token: match[1], key: match[2] };
}

export async function POST(req: Request) {
  let body: { lines?: IncomingLine[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  if (!domain) {
    return NextResponse.json(
      { error: "SHOPIFY_STORE_DOMAIN is not set" },
      { status: 500 }
    );
  }

  const lines = (body.lines ?? []).filter(
    (l): l is IncomingLine =>
      !!l &&
      typeof l.variantId === "string" &&
      typeof l.qty === "number" &&
      l.qty > 0
  );

  if (lines.length === 0) {
    return NextResponse.json({ error: "No line items" }, { status: 400 });
  }

  const cartLines = lines.map((l) => ({
    merchandiseId: l.variantId,
    quantity: l.qty,
    attributes: l.isGift ? [{ key: "_free_gift", value: "true" }] : undefined,
  }));

  const discountCode = process.env.SHOPIFY_GIFT_DISCOUNT_CODE?.trim();

  const input: Record<string, unknown> = { lines: cartLines };
  if (discountCode) input.discountCodes = [discountCode];

  try {
    const data = await shopifyFetch<CartCreateResponse>({
      query: CART_CREATE,
      variables: { input },
      revalidate: 0,
    });

    const errors = data.cartCreate.userErrors;
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.map((e) => e.message).join("; ") },
        { status: 400 }
      );
    }

    const cartId = data.cartCreate.cart?.id;
    if (!cartId) {
      return NextResponse.json(
        { error: "Shopify returned no cart" },
        { status: 502 }
      );
    }

    const parsed = parseCartId(cartId);
    if (!parsed) {
      return NextResponse.json(
        { error: "Unrecognised cart id format" },
        { status: 502 }
      );
    }

    // Land the customer on the storefront /cart page with the saved cart
    // (line attributes, discount codes, etc.) hydrated by Shopify.
    const url = `https://${domain}/cart/c/${parsed.token}?key=${parsed.key}`;

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Shopify cartCreate failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
