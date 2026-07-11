import "server-only";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2024-10";

export type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  /** Next.js fetch cache control. Defaults to 60s ISR. */
  revalidate?: number;
};

export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 3600,
}: ShopifyFetchOptions): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Missing Shopify env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in .env.local"
    );
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shopify ${res.status}: ${body}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  if (!json.data) {
    throw new Error("Shopify response missing data");
  }
  return json.data;
}
