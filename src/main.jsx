import "./themes/index.js";
import { hydrateConsentGlobals } from "./consent/consentStorage.js";
import { registerOptionalConsentHooks } from "./consent/optionalScripts.js";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import { LANDING_VARIANTS } from "./landingVariants.js";

hydrateConsentGlobals();
registerOptionalConsentHooks();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function createVariantComponents() {
  if (import.meta.env.VITE_USE_VARIANTS !== "true") return {};
  return {
    v1: lazy(() => import("./versions/text_updates.jsx")),
    s1: lazy(() => import("./versions/short_variant.jsx")),
  };
}

const VARIANT_COMPONENTS = createVariantComponents();

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
    <Routes>
      {LANDING_VARIANTS.map(({ path, variantId }) => {
        const Cmp = VARIANT_COMPONENTS[variantId] || App;
        const element = <Cmp variantId={variantId} />;
        return (
          <Route
            key={variantId}
            path={path}
            element={
              VARIANT_COMPONENTS[variantId] ? (
                <Suspense fallback={null}>{element}</Suspense>
              ) : (
                element
              )
            }
          />
        );
      })}
    </Routes>
  </BrowserRouter>
);
