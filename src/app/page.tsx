import { getGiftProducts } from "@/lib/products";
import type { Product } from "@/data/products";
import GiftingScreen from "./GiftingScreen";

export const revalidate = 3600;

export default async function GiftingPage() {
  let products: Product[] = [];
  let hasNextPage = false;
  let endCursor = null as string | null;
  try {
    const page = await getGiftProducts();
    products = page.products;
    hasNextPage = page.hasNextPage;
    endCursor = page.endCursor;
  } catch (err) {
    console.error("Failed to load gift products from Shopify:", err);
  }
  return (
    <GiftingScreen
      products={products}
      hasNextPage={hasNextPage}
      endCursor={endCursor}
    />
  );
}
