import { deriveCategories, getShopProducts } from "@/lib/products";
import RedeemScreen from "./RedeemScreen";

export const revalidate = 60;

export default async function RedeemPage() {
  let products: Awaited<ReturnType<typeof getShopProducts>> = [];
  try {
    products = await getShopProducts();
  } catch (err) {
    console.error("Failed to load shop products from Shopify:", err);
  }
  const categories = deriveCategories(products);
  return <RedeemScreen products={products} categories={categories} />;
}
