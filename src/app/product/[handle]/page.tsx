import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/products";
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
  return <ProductDetails product={product} />;
}
