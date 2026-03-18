import "./themes/index.js";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import TextUpdates from "./versions/text_updates.jsx";
import ShortVariant from "./versions/short_variant.jsx";
import { LANDING_VARIANTS } from "./landingVariants.js";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const VARIANT_COMPONENTS = {
  v1: TextUpdates,
  s1: ShortVariant,
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
    <Routes>
      {LANDING_VARIANTS.map(({ path, variantId }) => {
        const Cmp = VARIANT_COMPONENTS[variantId] || App;
        return (
          <Route
            key={variantId}
            path={path}
            element={<Cmp variantId={variantId} />}
          />
        );
      })}
    </Routes>
  </BrowserRouter>
);
