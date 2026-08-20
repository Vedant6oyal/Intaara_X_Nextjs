import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductByHandle, getShopProducts } from "@/lib/products";
import ProductDetails from "./ProductDetails";

export const revalidate = 3600;

const MYSTERY_GIFT_HANDLE = "free-mystery-jewellery";

// Pre-render all product pages at build time so they're served from the CDN
// with zero serverless function invocations. ISR revalidates every hour.
export async function generateStaticParams() {
  try {
    const { products } = await getShopProducts();
    return products.map((p) => ({ handle: p.handle }));
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  let product = null;
  let mysteryGift = null;
  try {
    [product, mysteryGift] = await Promise.all([
      getProductByHandle(params.handle),
      getProductByHandle(MYSTERY_GIFT_HANDLE),
    ]);
  } catch (err) {
    console.error("Failed to load product from Shopify:", err);
  }

  if (!product) notFound();

  return (
    <Suspense>
      <ProductDetails product={product} mysteryGift={mysteryGift} />
    </Suspense>
  );
}
