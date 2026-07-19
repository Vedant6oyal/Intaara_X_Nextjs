import { NextRequest, NextResponse } from "next/server";
import { getGiftProductsAfter } from "@/lib/products";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const after = req.nextUrl.searchParams.get("after");
  if (!after) {
    return NextResponse.json(
      { error: "Missing 'after' cursor parameter" },
      { status: 400 }
    );
  }

  try {
    const page = await getGiftProductsAfter(after);
    return NextResponse.json(page);
  } catch (err) {
    console.error("Failed to load more gift products:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
