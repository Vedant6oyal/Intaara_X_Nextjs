import { getGiftProducts } from "@/lib/products";
import GiftingScreen from "./GiftingScreen";

export const revalidate = 3600;

export default async function GiftingPage() {
  let products = [] as Awaited<ReturnType<typeof getGiftProducts>>;
  try {
    products = await getGiftProducts();
  } catch (err) {
    console.error("Failed to load gift products from Shopify:", err);
  }
  return <GiftingScreen products={products} />;
}
