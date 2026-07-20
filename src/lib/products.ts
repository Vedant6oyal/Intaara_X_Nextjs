import "server-only";

import { shopifyFetch } from "./shopify";
import type { Category, Product } from "@/data/products";

type ShopifyMoney = { amount: string; currencyCode: string };

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
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
  products: {
    edges: Array<{ node: ShopifyProductNode; cursor: string }>;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $query: String, $after: String) {
    products(first: $first, query: $query, after: $after) {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          tags
          featuredImage {
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
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
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
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

  // First non-"non-gift" tag becomes the category label (Studs, Hoops, etc.).
  const category = node.tags.find((t) => t.toLowerCase() !== "non-gift");

  const images = node.images.edges.map((e) => e.node.url);
  const featured = node.featuredImage?.url ?? images[0] ?? FALLBACK_IMAGE;
  // Ensure the featured image is first and avoid duplicates.
  const orderedImages = [featured, ...images.filter((u) => u !== featured)];

  return {
    id: node.id,
    variantId: variant?.id,
    handle: node.handle,
    name: node.title,
    description: node.descriptionHtml,
    price: Math.round(price),
    mrp: compareAt > price ? Math.round(compareAt) : undefined,
    image: featured,
    images: orderedImages,
    tags: node.tags,
    category,
    collections: node.collections.edges.map((e) => e.node.id),
  };
}

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      tags
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
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
`;

/** Fetch a single product by its Shopify handle for the details page. */
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProductNode | null }>(
    {
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    }
  );
  return data.productByHandle ? toProduct(data.productByHandle) : null;
}

export type ProductPage = {
  products: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
};

async function fetchProducts(
  query: string,
  first = 50,
  after?: string | null
): Promise<ProductPage> {
  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first, query, after: after ?? null },
  });
  return {
    products: data.products.edges.map((e) => toProduct(e.node)),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

/** Free-gift screen: all products NOT tagged `non-gift` in Shopify. */
export async function getGiftProducts(): Promise<ProductPage> {
  return fetchProducts("-tag:non-gift", 24);
}

/** Load more gift products by cursor. */
export async function getGiftProductsAfter(
  after: string
): Promise<ProductPage> {
  return fetchProducts("-tag:non-gift", 24, after);
}

/** Redeem & Shop screen: all products in Shopify. */
export async function getShopProducts(): Promise<ProductPage> {
  return fetchProducts("", 100);
}

/** Redeem & Shop screen: ALL products, paginating through every page. */
export async function getAllShopProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let cursor: string | null = null;
  let hasNext = true;
  while (hasNext) {
    const page = await fetchProducts("", 250, cursor);
    all.push(...page.products);
    hasNext = page.hasNextPage;
    cursor = page.endCursor;
  }
  return all;
}

/** Derive category circles from the unique non-"non-gift" tags on shop products. */
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
