/**
 * List of landing variants for A/B or multi-variant tests.
 * path — URL path, label — header text, variantId — passed to App.
 *
 * Default: only main (VITE_USE_VARIANTS unset or not the string "true").
 * Set VITE_USE_VARIANTS=true in .env.local to enable all routes and header links.
 */
export const useVariantsEnabled = import.meta.env.VITE_USE_VARIANTS === "true";

const ALL_LANDING_VARIANTS = [
  { path: "/", label: "Main", variantId: "main" },
  { path: "/gpt_recommendations", label: "GPT", variantId: "gpt" },
  { path: "/text_updates", label: "V1", variantId: "v1" },
  { path: "/short", label: "S1", variantId: "s1" },
];

export const LANDING_VARIANTS = useVariantsEnabled
  ? ALL_LANDING_VARIANTS
  : [{ path: "/", label: "Main", variantId: "main" }];
