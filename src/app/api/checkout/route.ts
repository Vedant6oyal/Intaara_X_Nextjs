import { NextResponse } from "next/server";

export const runtime = "nodejs";

type IncomingLine = {
  variantId: string;
  qty: number;
  isGift?: boolean;
};

/**
 * Extract the numeric variant id from either:
 *   - "gid://shopify/ProductVariant/12345"  (Storefront GraphQL format)
 *   - "12345"                               (already numeric)
 */
function numericVariantId(id: string): string | null {
  const trimmed = id.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/ProductVariant\/(\d+)/);
  return match ? match[1] : null;
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

  // Build Shopify cart permalink: /cart/<vid>:<qty>,<vid>:<qty>
  // We send the customer to the storefront cart page (not /checkout) so the
  // Shiprocket Checkout theme script can intercept and open its modal.
  const itemsParam = lines
    .map((l) => {
      const numeric = numericVariantId(l.variantId);
      return numeric ? `${numeric}:${l.qty}` : null;
    })
    .filter((s): s is string => !!s)
    .join(",");

  if (!itemsParam) {
    return NextResponse.json(
      { error: "Could not resolve any variant IDs" },
      { status: 400 }
    );
  }

  // Force Shopify to land the customer on /cart (not /checkouts/...) so the
  // Shiprocket Checkout theme script can intercept. We send both params
  // because behavior varies between Shopify plans / themes:
  //   - redirect=no  : standard documented param
  //   - return_to    : honored even when "skip cart" is configured
  const url = `https://${domain}/cart/${itemsParam}?redirect=no&return_to=/cart`;

  return NextResponse.json({ url });
}
