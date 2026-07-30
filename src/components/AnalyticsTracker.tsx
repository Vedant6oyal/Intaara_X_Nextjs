"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, claimAttributionToken } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    claimAttributionToken();
  }, []);

  useEffect(() => {
    trackEvent(pathname === "/" ? "landing_viewed" : "page_viewed", {
      query_present: Boolean(window.location.search),
    });
  }, [pathname]);

  return null;
}
