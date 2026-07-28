"use client";

export const ANALYTICS_EVENT_NAMES = [
  "landing_viewed",
  "page_viewed",
  "gift_selected",
  "gift_removed",
  "redeem_product_added",
  "redeem_product_removed",
  "second_gift_unlock_prompt_viewed",
  "share_cta_clicked",
  "share_link_created",
  "second_gift_unlocked",
  "checkout_started",
  "checkout_opened",
  "category_selected",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
type AnalyticsProperties = Record<string, string | number | boolean | null>;

type Attribution = {
  referralToken: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
};

const ANONYMOUS_ID_KEY = "intaara:analytics:anonymous-id";
const SESSION_ID_KEY = "intaara:analytics:session-id";
const ATTRIBUTION_KEY = "intaara:analytics:attribution";

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreate(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = createId();
  storage.setItem(key, value);
  return value;
}

function readAttribution(): Attribution {
  const stored = window.localStorage.getItem(ATTRIBUTION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      window.localStorage.removeItem(ATTRIBUTION_KEY);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const attribution: Attribution = {
    referralToken: params.get("ref") ?? params.get("invite"),
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
  };
  window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return attribution;
}

export function getAnonymousId() {
  if (typeof window === "undefined") return null;
  return getOrCreate(window.localStorage, ANONYMOUS_ID_KEY);
}

export function trackEvent(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  try {
    const anonymousId = getOrCreate(window.localStorage, ANONYMOUS_ID_KEY);
    const sessionId = getOrCreate(window.sessionStorage, SESSION_ID_KEY);
    const attribution = readAttribution();

    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        anonymousId,
        sessionId,
        name,
        pathname: window.location.pathname,
        properties,
        attribution,
      }),
    });
  } catch {
  }
}
