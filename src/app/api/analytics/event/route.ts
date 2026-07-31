import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EVENT_NAMES = new Set([
  "landing_viewed",
  "page_viewed",
  "gift_selected",
  "gift_removed",
  "redeem_product_added",
  "redeem_product_removed",
  "second_gift_unlock_prompt_viewed",
  "share_cta_clicked",
  "second_gift_unlocked",
  "checkout_started",
  "checkout_opened",
  "category_selected",
]);

const ATTRIBUTION_KEYS = [
  "referralToken",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "waMobile",
] as const;

type Attribution = Record<(typeof ATTRIBUTION_KEYS)[number], string | null>;

function isStringOrNull(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isProperties(value: unknown): value is Record<string, string | number | boolean | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(
    ([key, property]) =>
      key.length <= 80 &&
      (typeof property === "string" ||
        typeof property === "number" ||
        typeof property === "boolean" ||
        property === null)
  );
}

function isAttribution(value: unknown): value is Attribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return ATTRIBUTION_KEYS.every((key) => isStringOrNull(record[key]));
}

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return new NextResponse(null, { status: 204 });
  }

  let body: {
    anonymousId?: unknown;
    sessionId?: unknown;
    name?: unknown;
    pathname?: unknown;
    properties?: unknown;
    attribution?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body.anonymousId !== "string" ||
    typeof body.sessionId !== "string" ||
    typeof body.name !== "string" ||
    typeof body.pathname !== "string" ||
    !EVENT_NAMES.has(body.name) ||
    !isProperties(body.properties) ||
    !isAttribution(body.attribution)
  ) {
    return NextResponse.json({ error: "Invalid analytics event" }, { status: 400 });
  }

  if (
    body.anonymousId.length > 100 ||
    body.sessionId.length > 100 ||
    body.pathname.length > 500 ||
    JSON.stringify(body).length > 10_000
  ) {
    return NextResponse.json({ error: "Analytics event is too large" }, { status: 413 });
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("main_analytics_events").insert({
    anonymous_id: body.anonymousId,
    session_id: body.sessionId,
    event_name: body.name,
    pathname: body.pathname,
    event_properties: body.properties,
    referral_token: body.attribution.referralToken,
    utm_properties: {
      source: body.attribution.utmSource,
      medium: body.attribution.utmMedium,
      campaign: body.attribution.utmCampaign,
      content: body.attribution.utmContent,
      term: body.attribution.utmTerm,
    },
  });

  if (error) {
    console.error("Analytics event insert failed:", error.message);
    return new NextResponse(null, { status: 500 });
  }

  const visitorRow = {
    anonymous_id: body.anonymousId,
    last_seen_at: new Date().toISOString(),
    first_referral_token: body.attribution.referralToken,
    wa_mobile: body.attribution.waMobile,
    first_utm_properties: {
      source: body.attribution.utmSource,
      medium: body.attribution.utmMedium,
      campaign: body.attribution.utmCampaign,
      content: body.attribution.utmContent,
      term: body.attribution.utmTerm,
    },
  };

  const { error: insertError } = await supabase
    .from("main_analytics_visitors")
    .insert(visitorRow);

  if (insertError && insertError.code === "23505") {
    // Conflict — row already exists.
    // Always update last_seen_at.
    await supabase
      .from("main_analytics_visitors")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("anonymous_id", body.anonymousId);

    // Only set wa_mobile if it's currently null and we have a new value.
    if (body.attribution.waMobile) {
      await supabase
        .from("main_analytics_visitors")
        .update({ wa_mobile: body.attribution.waMobile })
        .eq("anonymous_id", body.anonymousId)
        .is("wa_mobile", null);
    }
  }

  return new NextResponse(null, { status: 204 });
}
