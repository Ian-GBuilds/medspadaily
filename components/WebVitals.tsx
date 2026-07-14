"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics";

// Report Core Web Vitals (LCP, CLS, INP, …) to GA4 as events, so real-user
// performance is measurable — it drives Google Ads Quality Score, which drives
// cost-per-click. No-op until GA is configured (trackEvent guards for that).
export default function WebVitals() {
  useReportWebVitals((metric) => {
    trackEvent(metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  });
  return null;
}
