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

export async function POST(req: Request) {
  let body: { lines?: IncomingLine[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lines = (body.lines ?? []).filter(
    (l): l is IncomingLine =>
      !!l && typeof l.variantId === "string" && typeof l.qty === "number" && l.qty > 0
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

    const url = data.cartCreate.cart?.checkoutUrl;
    if (!url) {
      return NextResponse.json(
        { error: "Shopify returned no checkout URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Shopify cartCreate failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
