import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.SHIPROCKET_WEBHOOK_SECRET ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

type ShiprocketPayload = {
  cart_id?: string;
  latest_stage?: string;
  payment_status?: string;
  payment_method?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  total_price?: number;
  total_discount?: number;
  shipping_price?: number;
  tax?: number;
  currency?: string;
  item_count?: number;
  items?: unknown[];
  discount_codes?: unknown[];
  shipping_address?: Record<string, unknown>;
  billing_address?: Record<string, unknown>;
  custom_attributes?: Record<string, unknown>;
};

export async function POST(req: Request) {
  const secret = req.headers.get("x-webhook-secret");

  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ShiprocketPayload;
  try {
    body = (await req.json()) as ShiprocketPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const customAttrs = body.custom_attributes ?? {};

  const row = {
    cart_id: body.cart_id ?? null,
    checkout_stage: body.latest_stage ?? null,
    payment_status: body.payment_status ?? null,
    payment_method: body.payment_method ?? null,
    shprkt_first_name: body.first_name ?? null,
    shprkt_last_name: body.last_name ?? null,
    shprkt_email: body.email ?? null,
    shprkt_phone: body.phone_number ?? null,
    total_price: body.total_price ?? null,
    total_discount: body.total_discount ?? null,
    shipping_price: body.shipping_price ?? null,
    tax: body.tax ?? null,
    currency: body.currency ?? null,
    item_count: body.item_count ?? null,
    items: body.items ?? null,
    discount_codes: body.discount_codes ?? null,
    shprkt_shipping_address: body.shipping_address ?? null,
    shprkt_billing_address: body.billing_address ?? null,
    anonymous_id: (customAttrs.anonymous_id as string) ?? null,
    landing_page_url: (customAttrs.landing_page_url as string) ?? null,
    free_gifts: (customAttrs.free_gifts as string) ?? null,
    ipv4_address: (customAttrs.ipv4_address as string) ?? null,
    raw_payload: body,
  };

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from("main_shiprocket_checkouts")
      .insert(row);

    if (error) {
      console.error("[Shiprocket Webhook] Insert failed:", error.message);
    } else {
      console.log("[Shiprocket Webhook] Saved cart_id:", body.cart_id);
    }
  } else {
    console.warn("[Shiprocket Webhook] Supabase not configured, skipping insert");
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
