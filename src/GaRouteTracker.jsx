import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { sendGaPageView } from "./consent/googleAnalytics.js";

export function GaRouteTracker() {
  const location = useLocation();
  const skipNext = useRef(true);
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    sendGaPageView();
  }, [location.pathname, location.search]);
  return null;
}
