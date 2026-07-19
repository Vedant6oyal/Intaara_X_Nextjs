import { getShopCollections, getShopProducts } from "@/lib/products";
import type { Category, Product } from "@/data/products";
import RedeemScreen from "./RedeemScreen";

export const revalidate = 3600;

export default async function RedeemPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    const page = await getShopProducts();
    products = page.products;
    categories = await getShopCollections(products);
  } catch (err) {
    console.error("Failed to load shop data from Shopify:", err);
  }
  return <RedeemScreen products={products} categories={categories} />;
}
