/**
 * List of landing variants for A/B or multi-variant tests.
 * path — URL path, label — header text, variantId — passed to App.
 *
 * Default route "/" is the short variant (S1). Classic main layout: /main.
 * With VITE_USE_VARIANTS unset or not "true", only "/" (S1) is registered.
 * Set VITE_USE_VARIANTS=true in .env.local for all routes and header links.
 */
export const useVariantsEnabled = import.meta.env.VITE_USE_VARIANTS === "true";

const ALL_LANDING_VARIANTS = [
  { path: "/", label: "Main", variantId: "main" },
  { path: "/first", label: "First", variantId: "v1" },
  { path: "/first_with_gpt_colors", label: "GPT", variantId: "gpt_colors" },
  { path: "/text_updates", label: "V2", variantId: "v2" },
];

export const LANDING_VARIANTS = useVariantsEnabled
  ? ALL_LANDING_VARIANTS
  : [{ path: "/", label: "Main", variantId: "main" }];
