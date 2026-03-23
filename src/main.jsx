import "./themes/index.js";
import { hydrateConsentGlobals } from "./consent/consentStorage.js";
import { initGtagConsentStub, sendGaPageView } from "./consent/googleAnalytics.js";
import { registerOptionalConsentHooks } from "./consent/optionalScripts.js";
import { createRoot } from "react-dom/client";
import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainVariant from "./versions/main.jsx";
import FirstVariant from "./versions/first.jsx";
import FirstWithGptColorsVariant from "./versions/first_with_gpt_colors.jsx";
import TextUpdatesVariant from "./versions/text_updates.jsx";
import { LANDING_VARIANTS } from "./landingVariants.js";

hydrateConsentGlobals();
initGtagConsentStub();
registerOptionalConsentHooks();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function createLazyOptionalVariants() {
  if (import.meta.env.VITE_USE_VARIANTS !== "true") return {};
  return {
    v1: lazy(() => import("./versions/text_updates.jsx")),
  };
}

const LAZY_OPTIONAL_VARIANTS = createLazyOptionalVariants();

function resolveVariantComponent(variantId) {
  if (variantId === "v1") return FirstVariant;
  if (variantId === "gpt_colors") return FirstWithGptColorsVariant;
  if (variantId === "v2") return TextUpdatesVariant;

  const LazyCmp = LAZY_OPTIONAL_VARIANTS[variantId];
  if (LazyCmp) return LazyCmp;

  return MainVariant;
}

function GaRouteTracker() {
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

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
    <GaRouteTracker />
    <Routes>
      <Route path="/short" element={<Navigate to="/" replace />} />
      {LANDING_VARIANTS.map(({ path, variantId }) => {
        const Cmp = resolveVariantComponent(variantId);
        const element = <Cmp variantId={variantId} />;
        const needsSuspense = Boolean(LAZY_OPTIONAL_VARIANTS[variantId]);
        return (
          <Route
            key={path}
            path={path}
            element={needsSuspense ? <Suspense fallback={null}>{element}</Suspense> : element}
          />
        );
      })}
    </Routes>
  </BrowserRouter>
);
