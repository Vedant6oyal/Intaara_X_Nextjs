import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase client — safe to import from server components.
 * Uses the anon key + RLS policies to enforce access. If either env var is
 * missing we log once and return `null`; callers should handle that gracefully
 * (e.g. fall back to empty data) instead of crashing the render.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
let warned = false;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (!warned) {
      // eslint-disable-next-line no-console
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set — falling back to empty data."
      );
      warned = true;
    }
    return null;
  }
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return client;
}
