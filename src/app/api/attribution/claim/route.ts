import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const HMAC_SECRET = process.env.HMAC_SECRET ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Signed tokens are valid for 30 days from issuance.
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function verifyToken(token: string): { name: string; mobile: string } | null {
  if (!HMAC_SECRET) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString();
  } catch {
    return null;
  }

  const expectedHmac = crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(payload)
    .digest("base64url");

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedHmac);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  const [name, mobile, tsRaw] = payload.split("|");
  const ts = Number(tsRaw);
  if (!mobile || !Number.isFinite(ts)) return null;
  if (Date.now() - ts > TOKEN_MAX_AGE_MS) return null;

  return { name: name ?? "", mobile };
}

export async function POST(req: Request) {
  let body: { anonymousId?: unknown; token?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body.anonymousId !== "string" ||
    typeof body.token !== "string" ||
    body.anonymousId.length > 100 ||
    body.token.length > 500
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const decoded = verifyToken(body.token);
  if (!decoded) {
    // Fail silently — do not reveal tampering details to the client.
    return new NextResponse(null, { status: 204 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ name: decoded.name || null }, { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: insertError } = await supabase.from("main_analytics_visitors").insert({
    anonymous_id: body.anonymousId,
    last_seen_at: new Date().toISOString(),
    wa_mobile: decoded.mobile || null,
    wa_name: decoded.name || null,
  });

  if (insertError && insertError.code === "23505") {
    // Row already exists — only fill wa_mobile/wa_name if currently null.
    if (decoded.mobile) {
      await supabase
        .from("main_analytics_visitors")
        .update({ wa_mobile: decoded.mobile })
        .eq("anonymous_id", body.anonymousId)
        .is("wa_mobile", null);
    }
    if (decoded.name) {
      await supabase
        .from("main_analytics_visitors")
        .update({ wa_name: decoded.name })
        .eq("anonymous_id", body.anonymousId)
        .is("wa_name", null);
    }
  }

  // Return decoded name so the client can personalize share messages.
  // Mobile is not returned to avoid exposing it unnecessarily.
  return NextResponse.json({ name: decoded.name || null }, { status: 200 });
}
