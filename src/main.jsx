import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import { LANDING_VARIANTS } from "./landingVariants.js";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
    <Routes>
      {LANDING_VARIANTS.map(({ path, variantId }) => (
        <Route key={variantId} path={path} element={<App variantId={variantId} />} />
      ))}
    </Routes>
  </BrowserRouter>
);
