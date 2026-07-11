"use client";

import { useEffect, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ReviewSummary } from "@/lib/reviews";

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

const EMPTY: ReviewSummary = { reviews: [], count: 0, average: 0 };

/**
 * Fetches store-wide reviews client-side directly from Supabase.
 * Avoids a serverless function invocation per page view.
 */
export function useReviews() {
  const [data, setData] = useState<ReviewSummary>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    supabase
      .from("product_reviews")
      .select(
        "id, product_handle, author_name, rating, title, body, photo_url, verified, created_at"
      )
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data: rows, error }) => {
        if (!active) return;
        if (error || !rows) {
          setLoading(false);
          return;
        }
        const reviews = rows.map((r) => ({
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
          ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) /
            10
          : 0;
        setData({ reviews, count, average });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
