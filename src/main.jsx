import "./themes/index.js";
import { hydrateConsentGlobals } from "./consent/consentStorage.js";
import { registerOptionalConsentHooks } from "./consent/optionalScripts.js";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import ShortVariant from "./versions/short_variant.jsx";
import { LANDING_VARIANTS } from "./landingVariants.js";

hydrateConsentGlobals();
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
  if (variantId === "s1") return ShortVariant;
  const LazyCmp = LAZY_OPTIONAL_VARIANTS[variantId];
  if (LazyCmp) return LazyCmp;
  return App;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
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
