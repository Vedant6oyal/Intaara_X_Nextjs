import { getShopCollections, getShopProducts } from "@/lib/products";
import type { Category } from "@/data/products";
import RedeemScreen from "./RedeemScreen";

export const revalidate = 3600;

export default async function RedeemPage() {
  let products: Awaited<ReturnType<typeof getShopProducts>> = [];
  let categories: Category[] = [];
  try {
    products = await getShopProducts();
    categories = await getShopCollections(products);
  } catch (err) {
    console.error("Failed to load shop data from Shopify:", err);
  }
  return <RedeemScreen products={products} categories={categories} />;
}
