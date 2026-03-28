import { SpeedInsights } from "@vercel/speed-insights/react";
import { useLocation } from "react-router-dom";

/** Vercel Speed Insights (Web Vitals); `route` updates on client-side navigation. */
export function SpeedInsightsRoute() {
  const { pathname, search } = useLocation();
  const route = `${pathname}${search}` || null;
  return <SpeedInsights route={route} />;
}
