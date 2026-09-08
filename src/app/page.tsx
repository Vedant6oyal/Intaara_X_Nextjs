import { getAllShopProductsLight, getShopCollections } from "@/lib/products";
import type { Category, Product } from "@/data/products";
import HomeScreen from "./HomeScreen";

export const revalidate = 3600;

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    products = await getAllShopProductsLight();
    categories = await getShopCollections(products);
  } catch (err) {
    console.error("Failed to load shop data from Shopify:", err);
  }
  return <HomeScreen products={products} categories={categories} />;
}
