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
  collections: {
    edges: Array<{ node: { id: string; title: string } }>;
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
          collections(first: 20) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          image {
            url
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
    collections: node.collections.edges.map((e) => e.node.id),
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

type CollectionsResponse = {
  collections: {
    edges: Array<{
      node: { id: string; title: string; image: { url: string } | null };
    }>;
  };
};

/**
 * Category circles sourced from Shopify Collections. Only collections that
 * actually contain at least one shop product are returned, each using the
 * collection's image (falling back to a member product's image).
 */
export async function getShopCollections(
  products: Product[]
): Promise<Category[]> {
  const data = await shopifyFetch<CollectionsResponse>({
    query: COLLECTIONS_QUERY,
    variables: { first: 50 },
  });

  // Collection IDs present on the shop products, with a representative image.
  const presentIds = new Set<string>();
  const fallbackImage = new Map<string, string>();
  for (const p of products) {
    for (const cid of p.collections ?? []) {
      presentIds.add(cid);
      if (!fallbackImage.has(cid)) fallbackImage.set(cid, p.image);
    }
  }

  return data.collections.edges
    .map((e) => e.node)
    .filter((c) => presentIds.has(c.id))
    .map((c) => ({
      id: c.id,
      name: c.title,
      image: c.image?.url ?? fallbackImage.get(c.id) ?? FALLBACK_IMAGE,
    }));
}
