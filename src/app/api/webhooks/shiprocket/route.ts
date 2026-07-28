import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WEBHOOK_SECRET = process.env.SHIPROCKET_WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  const secret = req.headers.get("x-webhook-secret");

  if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  console.log("[Shiprocket Webhook] Received:", JSON.stringify(body, null, 2));

  return NextResponse.json({ received: true }, { status: 200 });
}
