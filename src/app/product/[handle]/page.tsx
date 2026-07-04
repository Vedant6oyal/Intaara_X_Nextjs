import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/products";
import { getProductReviews } from "@/lib/reviews";
import ProductDetails from "./ProductDetails";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  let product = null;
  try {
    product = await getProductByHandle(params.handle);
  } catch (err) {
    console.error("Failed to load product from Shopify:", err);
  }
  if (!product) notFound();

  const reviewSummary = await getProductReviews();

  return <ProductDetails product={product} reviewSummary={reviewSummary} />;
}
