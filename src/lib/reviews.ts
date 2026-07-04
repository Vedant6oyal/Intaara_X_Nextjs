import "server-only";
import { getSupabase } from "./supabase";

export type Review = {
  id: string;
  productHandle: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  photoUrl: string | null;
  verified: boolean;
  createdAt: string;
};

export type ReviewSummary = {
  reviews: Review[];
  count: number;
  average: number;
};

const EMPTY: ReviewSummary = { reviews: [], count: 0, average: 0 };

/**
 * Fetch all approved reviews (store-wide), along with aggregate stats.
 * Returns an empty summary if Supabase isn't configured or on error.
 */
export async function getProductReviews(
  _productHandle?: string,
  limit = 100
): Promise<ReviewSummary> {
  const supabase = getSupabase();
  if (!supabase) return EMPTY;

  const { data, error } = await supabase
    .from("product_reviews")
    .select(
      "id, product_handle, author_name, rating, title, body, photo_url, verified, created_at"
    )
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[reviews] fetch error:", error.message);
    return EMPTY;
  }

  const reviews: Review[] = (data ?? []).map((r) => ({
    id: r.id,
    productHandle: r.product_handle,
    authorName: r.author_name,
    rating: r.rating,
    title: r.title,
    body: r.body,
    photoUrl: r.photo_url,
    verified: r.verified,
    createdAt: r.created_at,
  }));

  const count = reviews.length;
  const average = count
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
    : 0;

  return { reviews, count, average };
}
