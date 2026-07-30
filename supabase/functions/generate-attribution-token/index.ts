// Supabase Edge Function: generate-attribution-token
//
// Receives { name, mobile } from AISensy (or any WhatsApp automation) and
// returns a signed token: base64url(name|mobile|timestamp).HMAC-SHA256-signature
//
// The signature is verified server-side in the giftbox-app at
// /api/attribution/claim before wa_name/wa_mobile are ever written to Supabase.
//
// Deploy:
//   supabase functions deploy generate-attribution-token
// Set the shared secret (must match HMAC_SECRET in giftbox-app's env):
//   supabase secrets set HMAC_SECRET=your-secret-here

import { createHmac } from "node:crypto";

const HMAC_SECRET = Deno.env.get("HMAC_SECRET") ?? "";

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function sign(payload: string): string {
  const hmac = createHmac("sha256", HMAC_SECRET).update(payload).digest("base64");
  return hmac.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  if (!HMAC_SECRET) {
    console.error("HMAC_SECRET is not configured");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  let body: { name?: unknown; mobile?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const name = typeof body.name === "string" ? body.name : "";
  const mobile = typeof body.mobile === "string" ? body.mobile : "";

  if (!mobile) {
    return new Response(JSON.stringify({ error: "mobile is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const ts = Date.now();
  const payload = `${name}|${mobile}|${ts}`;
  const signature = sign(payload);
  const token = `${toBase64Url(payload)}.${signature}`;

  return new Response(JSON.stringify({ data: token }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
});
