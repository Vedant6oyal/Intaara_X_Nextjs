import "server-only";

import { shopifyFetch } from "./shopify";
import type { Category, Product } from "@/data/products";

type ShopifyMoney = { amount: string; currencyCode: string };

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney };
  variants: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
        price: ShopifyMoney;
        compareAtPrice: ShopifyMoney | null;
      };
    }>;
  };
};

type ProductsResponse = {
  products: { edges: Array<{ node: ShopifyProductNode }> };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          tags
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop";

function toProduct(node: ShopifyProductNode): Product {
  const variant = node.variants.edges[0]?.node;
  const price = Number(
    variant?.price.amount ?? node.priceRange.minVariantPrice.amount ?? 0
  );
  const compareAt = Number(
    variant?.compareAtPrice?.amount ??
      node.compareAtPriceRange.minVariantPrice.amount ??
      0
  );

  // First non-"gift" tag becomes the category label (Studs, Hoops, etc.).
  const category = node.tags.find((t) => t.toLowerCase() !== "gift");

  return {
    id: node.id,
    variantId: variant?.id,
    name: node.title,
    price: Math.round(price),
    mrp: compareAt > price ? Math.round(compareAt) : undefined,
    image: node.featuredImage?.url ?? FALLBACK_IMAGE,
    tags: node.tags,
    category,
  };
}

async function fetchProducts(query: string, first = 50): Promise<Product[]> {
  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first, query },
  });
  return data.products.edges.map((e) => toProduct(e.node));
}

/** Free-gift screen: products tagged `gift` in Shopify. */
export async function getGiftProducts(): Promise<Product[]> {
  return fetchProducts("tag:gift", 50);
}

/** Redeem & Shop screen: everything that isn't tagged `gift`. */
export async function getShopProducts(): Promise<Product[]> {
  return fetchProducts("-tag:gift", 100);
}

/** Derive category circles from the unique non-"gift" tags on shop products. */
export function deriveCategories(products: Product[]): Category[] {
  const seen = new Map<string, Category>();
  for (const p of products) {
    const tag = p.category;
    if (!tag) continue;
    if (seen.has(tag)) continue;
    seen.set(tag, { id: tag, name: tag, image: p.image });
  }
  return Array.from(seen.values());
}
