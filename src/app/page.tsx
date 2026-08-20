import { getAllGiftProducts, getShopCollections, getProductByHandle } from "@/lib/products";
import type { Category, Product } from "@/data/products";
import GiftingScreen from "./GiftingScreen";

export const revalidate = 3600;

const MYSTERY_GIFT_HANDLE = "free-mystery-jewellery";

export default async function GiftingPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let mysteryGift: Product | null = null;
  try {
    [products, mysteryGift] = await Promise.all([
      getAllGiftProducts(),
      getProductByHandle(MYSTERY_GIFT_HANDLE),
    ]);
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
      mysteryGift={mysteryGift}
    />
  );
}
