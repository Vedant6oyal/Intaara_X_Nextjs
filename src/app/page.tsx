import { getAllGiftProducts, getShopCollections } from "@/lib/products";
import type { Category, Product } from "@/data/products";
import GiftingScreen from "./GiftingScreen";

export const revalidate = 3600;

export default async function GiftingPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    products = await getAllGiftProducts();
    categories = await getShopCollections(products);
  } catch (err) {
    console.error("Fail to load gift products from Shopify:", err);
  }
  return (
    <GiftingScreen
      products={products}
      hasNextPage={false}
      endCursor={null}
      categories={categories}
    />
  );
}
